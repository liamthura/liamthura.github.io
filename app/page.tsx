"use client";

import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Fold } from "@/components/Fold";
import { Skills } from "@/components/Skills";
import { Work } from "@/components/Work";
import { Experience } from "@/components/Experience";
import { Education } from "@/components/Education";
import { Hobbies } from "@/components/Hobbies";
import { Blog } from "@/components/Blog";
import { Contact } from "@/components/Contact";

function FoldSection({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className="hatch-divider" aria-hidden />
      <div className="container-main">
        <div className="col-shell py-10 md:py-12">{children}</div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <Nav />
      <Hero />
      <About />
      <FoldSection>
        <Fold label="Skills" title="What I work with">
          <Skills header={false} bare />
        </Fold>
      </FoldSection>
      <Work />
      <FoldSection>
        <Fold label="Background" title="Work and education">
          <Experience header={false} bare />
          <div className="border-t border-line mt-12 pt-12">
            <Education header={false} bare />
          </div>
        </Fold>
      </FoldSection>
      <Hobbies />
      <Blog />
      <Contact />
    </main>
  );
}
