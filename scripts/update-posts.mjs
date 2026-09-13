// update-posts.mjs — pull the latest Hugo blog posts into a static cache.
// Reads the blog's RSS feed, keeps the newest entries, and writes
// public/content/posts.json. Run with `npm run update-posts` before building
// (or on a schedule) to refresh. The Blog section imports the JSON
// statically, so the portfolio stays fully static — no runtime fetching.

import { writeFile, mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createInterface } from "node:readline/promises";

const FEED_URL = "https://thurashares.qzz.io/blog/index.xml";
const MAX_POSTS = 6;
const EXCERPT_LENGTH = 170;

// The blog host blocks non-browser clients (403 on CI runners),
// so identify as a browser.
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Accept: "application/rss+xml, application/xml, text/html, */*",
};

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outPath = join(root, "public", "content", "posts.json");

function field(block, tag) {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return match ? match[1].trim() : "";
}

function decodeEntities(text) {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&rsquo;|&#8217;|&lsquo;/g, "’")
    .replace(/&ldquo;|&#8220;/g, "“")
    .replace(/&rdquo;|&#8221;/g, "”")
    .replace(/&hellip;|&#8230;/g, "…")
    .replace(/&mdash;|&#8212;/g, "—")
    .replace(/&nbsp;/g, " ")
    .replace(/&#?\w+;/g, "");
}

function stripHtml(html) {
  return (
    decodeEntities(
      html
        // The feed escapes markup (&lt;p&gt;), so decode structural
        // entities before stripping tags.
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/<iframe[\s\S]*?<\/iframe>/gi, " ")
        .replace(/<[^>]+>/g, " "),
    )
      .replace(/\s+/g, " ")
      .trim()
  );
}

function excerptOf(text) {
  if (text.length <= EXCERPT_LENGTH) return text;
  const cut = text.slice(0, EXCERPT_LENGTH);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

// The one-liner from the post's front matter, rendered as
// <meta name="description">. Null when missing or unreachable.
async function pageDescription(url) {
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) return null;
    const html = await res.text();
    for (const m of html.matchAll(/<meta\s[^>]*>/gi)) {
      const tag = m[0];
      if (!/(?:name|property)=["']?(?:description|og:description)["']?/i.test(tag))
        continue;
      const content = tag.match(/content=["']([^"']*)["']/i);
      if (content) {
        const text = decodeEntities(content[1]).replace(/\s+/g, " ").trim();
        if (text) return text;
      }
    }
  } catch {
    /* fall back to the content-derived excerpt */
  }
  return null;
}

let xml;
try {
  const res = await fetch(FEED_URL, { headers: HEADERS });
  if (!res.ok) throw new Error(`Feed request failed: ${res.status}`);
  xml = await res.text();
} catch (err) {
  // The blog being unreachable must never break the site build:
  // keep the last committed snapshot.
  if (existsSync(outPath)) {
    console.warn(`Feed unreachable (${err.message}); keeping cached posts.json`);
    process.exit(0);
  }
  throw err;
}

const posts = await Promise.all(
  [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(async (m) => {
    const block = m[1];
    const url = field(block, "link");
    const date = new Date(field(block, "pubDate"));
    return {
      id: new URL(url).pathname.replace(/\/$/, "").split("/").pop(),
      title: stripHtml(field(block, "title")),
      url,
      date: Number.isNaN(date.getTime()) ? null : date.toISOString(),
      excerpt:
        (await pageDescription(url)) ||
        excerptOf(stripHtml(field(block, "description"))),
    };
  }),
);

const latest = posts
  .filter((p) => p.id && p.title && p.url && p.date)
  .sort((a, b) => (a.date < b.date ? 1 : -1))
  .slice(0, MAX_POSTS);

if (latest.length === 0) throw new Error("No posts parsed from feed");

// Snapshot of the previous cache so --sync can report what changed.
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
console.log(`Wrote ${latest.length} posts to public/content/posts.json`);

// --sync: interactive commit + push flow. Reports what changed since the
// last snapshot, then walks through commit and push with confirmations.
async function syncFlow(previous, latest) {
  if (!process.stdin.isTTY) {
    throw new Error("--sync needs an interactive terminal");
  }

  const prevById = new Map(previous.map((p) => [p.id, p]));
  const nextById = new Map(latest.map((p) => [p.id, p]));
  const added = latest.filter((p) => !prevById.has(p.id));
  const removed = previous.filter((p) => !nextById.has(p.id));
  const updated = latest.filter((p) => {
    const old = prevById.get(p.id);
    return old && (old.title !== p.title || old.excerpt !== p.excerpt);
  });

  if (added.length === 0 && removed.length === 0 && updated.length === 0) {
    console.log("Already up to date — nothing to commit.");
    return;
  }

  for (const p of added) console.log(`  + ${p.title}`);
  for (const p of updated) console.log(`  ~ ${p.title}`);
  for (const p of removed) console.log(`  - ${p.title}`);

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = async (q) => {
    try {
      return (await rl.question(`${q} [Y/n] `)).trim().toLowerCase();
    } catch (err) {
      // Ctrl+D with a pending question rejects instead of returning.
      if (err?.code === "ABORT_ERR") {
        console.log("\nCancelled.");
        process.exit(1);
      }
      throw err;
    }
  };
  try {
    if (!(await ask("Commit these changes?")).startsWith("n")) {
      execFileSync("git", ["add", "public/content/posts.json"], { stdio: "inherit" });
      execFileSync("git", ["commit", "-m", "Update latest blog posts"], {
        stdio: "inherit",
      });
    } else {
      console.log("Skipped commit — leaving changes uncommitted.");
      return;
    }

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
    console.log("Pushed — the Pages deploy will rebuild with the new posts.");
  } finally {
    rl.close();
  }
}

if (process.argv.includes("--sync")) await syncFlow(previous, latest);
