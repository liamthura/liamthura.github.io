// sync-lists.mjs — pull public Karakeep list feeds into a static cache
// (public/content/lists.json). The /lists page imports the JSON
// statically, so the portfolio stays fully static.
//
// Config (never committed — put these in .env.local):
//   KARKEEP_FEEDS  comma-separated public list RSS URLs, one per list.
//                  In Karakeep: open a list > share/RSS to get its URL.
//                  Tokens stay in .env.local (gitignored), never in git.
//
// Run with `npm run sync-lists`. In an interactive terminal it offers to
// commit and push afterwards. If a feed is unreachable and a cache exists,
// the cache is kept and the script exits 0 so builds never break.

import { writeFile, mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createInterface } from "node:readline/promises";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "public", "content", "lists.json");

// node doesn't read .env.local by itself — load it so the CLI works
// without exporting variables first. CI never needs this script.
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

const FEEDS = (process.env.KARKEEP_FEEDS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const MAX_ITEMS_PER_LIST = 30;

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Accept: "application/rss+xml, application/xml, */*",
};

function field(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  if (!match) return "";
  return stripTags(match[1]);
}

function stripTags(html) {
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#?\w+;/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Feed URLs carry tokens — never print one; refer to feeds by number.
async function fetchList(url, index) {
  const label = `feed #${index + 1}`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${label} request failed: ${res.status}`);
  const xml = await res.text();

  const channel = (xml.match(/<channel>([\s\S]*?)<\/channel>/) || [])[1] || "";
  let name = field(channel, "title") || `List ${index + 1}`;
  name = name.replace(/^Bookmarks from\s+/i, "");
  const rawDescription = field(channel, "description") || "";
  const description = rawDescription.replace(/^Bookmarks from\s+/i, "");
  const id =
    (url.match(/\/lists\/([^/?]+)/) || [])[1] || `feed-${index + 1}`;

  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .map((m) => {
      const title = field(m[1], "title");
      const link = (m[1].match(/<link>([\s\S]*?)<\/link>/) || [])[1]?.trim();
      const note = field(m[1], "description").slice(0, 140) || undefined;
      if (!title && !link) return null;
      return {
        title: title || link,
        url: link || null,
        ...(note ? { note } : {}),
      };
    })
    .filter(Boolean)
    .slice(0, MAX_ITEMS_PER_LIST);

  return {
    id,
    name,
    ...(description && description !== name ? { description } : {}),
    items,
  };
}

let latest = null;
try {
  if (FEEDS.length === 0) {
    throw new Error("Set KARKEEP_FEEDS in .env.local (comma-separated RSS URLs)");
  }
  latest = [];
  for (let i = 0; i < FEEDS.length; i++) {
    try {
      latest.push(await fetchList(FEEDS[i], i));
    } catch (err) {
      console.warn(`Skipping ${err.message}`);
    }
  }
  if (latest.length === 0) throw new Error("No list feeds could be read");
} catch (err) {
  if (existsSync(outPath)) {
    console.warn(`Lists unreachable (${err.message}); keeping cache`);
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

  for (const l of added) console.log(`  + ${l.name} (${l.items.length} items)`);
  for (const l of changed) console.log(`  ~ ${l.name} (${l.items.length} items)`);
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
