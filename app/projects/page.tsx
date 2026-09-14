import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";

export const metadata: Metadata = {
  title: "Projects · Liam Thura",
  description: "Selected work: side projects, uni builds, and experiments.",
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Nav />
      <div className="pt-16">
        <div className="container-main">
          <div className="col-shell pt-12 pb-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3 text-accent-deep">
              Projects
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-ink mb-4">
              Things I&apos;ve made
            </h1>
            <p className="text-[15px] leading-[1.68] text-muted max-w-[560px]">
              Here you&apos;ll find my projects that I&apos;ve worked on. Side projects as well as some of the serious ones ofc.
            </p>
          </div>
        </div>
        <Projects header={false} />
        <div className="container-main">
          <div className="col-shell pb-24">
            <div className="bg-tint border border-tint-line rounded-2xl px-6 py-6">
              <p className="font-display text-xl font-semibold text-ink mb-2">
                Want something like this?
              </p>
              <p className="text-sm leading-[1.65] text-muted mb-4 max-w-[520px]">
                I take on small projects: websites, AI tweaks, automation
                that removes busywork. Tell me what you&apos;re trying to do
                and we&apos;ll figure it out.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center min-h-[44px] text-[11px] font-bold uppercase tracking-[0.1em] text-accent-deep hover:opacity-80"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Contact />
    </main>
  );
}
