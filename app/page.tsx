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

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <Nav />
      <Hero />
      <About>
        <Fold
          label="Work and education"
          title={
            <>
              For the <s>nosy</s> curious
            </>
          }
        >
          <Experience header={false} bare />
          <div className="border-t border-line mt-12 pt-12">
            <Education header={false} bare />
          </div>
        </Fold>
      </About>
      <Work>
        <Fold label="Skills" title="What I've learned">
          <Skills header={false} bare />
        </Fold>
      </Work>
      <Hobbies />
      <Blog />
      <Contact />
    </main>
  );
}
