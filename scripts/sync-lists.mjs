// sync-lists.mjs — pull reading lists from a self-hosted Karakeep
// instance into a static cache (public/content/lists.json). The /lists
// page imports the JSON statically, so the portfolio stays fully static.
//
// Config (never committed — put these in .env.local):
//   KARKEEP_BASE_URL  e.g. http://nas.local:3000
//   KARKEEP_API_KEY   Settings > API Keys in the Karakeep web UI
//
// Run with `npm run sync-lists`. In an interactive terminal it offers to
// commit and push afterwards. If the instance is unreachable and a cache
// exists, the cache is kept and the script exits 0 so builds never break.

import { writeFile, mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createInterface } from "node:readline/promises";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "public", "content", "lists.json");

// node doesn't read .env.local by itself — load it so the CLI works
// without exporting variables first. CI never runs this script.
for (const file of [".env.local", ".env"]) {
  const path = join(root, file);
  if (!existsSync(path)) continue;
  try {
    for (const line of (await readFile(path, "utf8")).split("\n")) {
      const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)?\s*$/.exec(line);
      if (!match || process.env[match[1]] !== undefined) continue;
      let value = (match[2] || "").trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[match[1]] = value;
    }
  } catch {
    /* ignore unreadable env files */
  }
}

const BASE_URL = (process.env.KARKEEP_BASE_URL || "").replace(/\/$/, "");
const API_KEY = process.env.KARKEEP_API_KEY || "";
const MAX_ITEMS_PER_LIST = 20;

async function api(path) {
  const res = await fetch(`${BASE_URL}/api/v1${path}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  if (!res.ok) throw new Error(`${path} request failed: ${res.status}`);
  return res.json();
}

function itemOf(bookmark) {
  const content = bookmark.content || {};
  if (content.type === "link" && content.url) {
    return {
      title: content.title || bookmark.title || content.url,
      url: content.url,
      ...(content.description
        ? { note: content.description.slice(0, 140) }
        : {}),
    };
  }
  if (content.type === "text" && content.text) {
    const firstLine = content.text.split("\n")[0].slice(0, 120);
    return { title: firstLine, url: null };
  }
  if (bookmark.title) return { title: bookmark.title, url: null };
  return null;
}

async function listBookmarks(listId) {
  const items = [];
  let cursor = null;
  while (items.length < MAX_ITEMS_PER_LIST) {
    const params = new URLSearchParams({ limit: "50" });
    if (cursor) params.set("cursor", cursor);
    const page = await api(`/lists/${listId}/bookmarks?${params}`);
    const bookmarks = page.bookmarks ?? page.items ?? [];
    for (const b of bookmarks) {
      const item = itemOf(b);
      if (item) items.push(item);
      if (items.length >= MAX_ITEMS_PER_LIST) break;
    }
    cursor = page.nextCursor ?? null;
    if (!cursor) break;
  }
  return items;
}

let latest = null;
try {
  if (!BASE_URL || !API_KEY) {
    throw new Error(
      "Set KARKEEP_BASE_URL and KARKEEP_API_KEY (via .env.local) to sync",
    );
  }
  const data = await api("/lists");
  const rawLists = data.lists ?? data ?? [];
  latest = [];
  for (const list of Array.isArray(rawLists) ? rawLists : []) {
    if (!list?.id) continue;
    try {
      latest.push({
        id: String(list.id),
        name: list.name || "Untitled list",
        ...(list.description ? { description: list.description } : {}),
        items: await listBookmarks(list.id),
      });
    } catch (err) {
      console.warn(`Skipping list ${list.id}: ${err.message}`);
    }
  }
} catch (err) {
  if (existsSync(outPath)) {
    console.warn(`Karakeep unreachable (${err.message}); keeping cache`);
    process.exit(0);
  }
  throw err;
}

let previous = [];
if (existsSync(outPath)) {
  try {
    previous = JSON.parse(await readFile(outPath, "utf8"));
  } catch {
    previous = [];
  }
}

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, `${JSON.stringify(latest, null, 2)}\n`);
const itemCount = latest.reduce((n, l) => n + l.items.length, 0);
console.log(
  `Wrote ${latest.length} lists (${itemCount} items) to public/content/lists.json`,
);

if (process.argv.includes("--sync") || process.stdin.isTTY) {
  await syncFlow(previous, latest);
}

async function syncFlow(previous, latest) {
  const prevIds = new Set(previous.map((l) => l.id));
  const nextIds = new Set(latest.map((l) => l.id));
  const added = latest.filter((l) => !prevIds.has(l.id));
  const removed = previous.filter((l) => !nextIds.has(l.id));
  const changed = latest.filter((l) => {
    const old = previous.find((p) => p.id === l.id);
    return old && JSON.stringify(old) !== JSON.stringify(l);
  });

  if (added.length === 0 && removed.length === 0 && changed.length === 0) {
    console.log("Already up to date — nothing to commit.");
    return;
  }

  for (const l of added) console.log(`  + ${l.name}`);
  for (const l of changed) console.log(`  ~ ${l.name}`);
  for (const l of removed) console.log(`  - ${l.name}`);

  if (!process.stdin.isTTY) {
    throw new Error("--sync needs an interactive terminal");
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = async (q) => {
    try {
      return (await rl.question(`${q} [Y/n] `)).trim().toLowerCase();
    } catch (err) {
      if (err?.code === "ABORT_ERR") {
        console.log("\nCancelled.");
        process.exit(1);
      }
      throw err;
    }
  };
  try {
    if ((await ask("Commit these changes?")).startsWith("n")) {
      console.log("Skipped commit — leaving changes uncommitted.");
      return;
    }
    execFileSync("git", ["add", "public/content/lists.json"], {
      stdio: "inherit",
    });
    execFileSync("git", ["commit", "-m", "Update reading lists"], {
      stdio: "inherit",
    });

    const branch = execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
      encoding: "utf8",
    }).trim();
    if (branch === "HEAD") {
      console.log("Detached HEAD — push it yourself with: git push origin <branch>");
      return;
    }
    if ((await ask(`Push to origin/${branch}?`)).startsWith("n")) {
      console.log("Skipped push — run git push when ready.");
      return;
    }
    execFileSync("git", ["push", "origin", branch], { stdio: "inherit" });
    console.log("Pushed — the Pages deploy will rebuild with the new lists.");
  } finally {
    rl.close();
  }
}
