import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { SectionShell } from "@/components/site-ui";
import { Contact } from "@/components/Contact";
import { ListSections, type ReadingList } from "@/components/Lists";
import lists from "@/content/lists.json";

export const metadata: Metadata = {
  title: "Lists · Liam Thura",
  description: "Reading lists and reference collections worth keeping.",
};

const curated = lists as ReadingList[];

export default function ListsPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Nav />
      <div className="pt-16">
        <div className="container-main">
          <div className="col-shell pt-12 pb-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3 text-accent-deep">
              Lists
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-ink mb-4">
              Worth keeping
            </h1>
            <p className="text-[15px] leading-[1.68] text-muted max-w-[560px]">
              Reading lists and reference collections I actually return to.
              Synced from my own library. A snapshot, refreshed whenever I
              remember.
            </p>
          </div>
        </div>
        <SectionShell>
          {curated.length === 0 ? (
            <div className="border border-dashed border-line rounded-2xl px-6 py-12 text-center">
              <p className="font-display text-xl font-semibold text-ink mb-2">
                Nothing synced yet
              </p>
              <p className="text-sm leading-[1.65] text-muted max-w-[420px] mx-auto">
                These lists sync from a self-hosted library. Run{" "}
                <code className="text-[13px] bg-paper border border-line rounded px-1.5 py-0.5">
                  npm run sync-lists
                </code>{" "}
                to pull them in.
              </p>
            </div>
          ) : (
            <ListSections lists={curated} />
          )}
        </SectionShell>
      </div>
      <Contact />
    </main>
  );
}
