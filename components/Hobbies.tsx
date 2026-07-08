// Hobbies.tsx — playful tilted sticker cards.

import hobbies from "@/content/hobbies.json";
import { SectionShell, SectionHeader } from "@/components/site-ui";

const TILT = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

export function Hobbies() {
  return (
    <SectionShell>
      <SectionHeader label="Outside of work" title="When I'm not at a screen" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
        {hobbies.map((hobby, i) => (
          <div
            key={hobby.title}
            className={`bg-surface p-5 rounded-2xl border border-line shadow-[0_6px_16px_rgba(30,26,20,0.07)] transition-transform hover:rotate-0 ${
              TILT[i % TILT.length]
            }`}
          >
            <span className="text-3xl mb-2.5 block">{hobby.emoji}</span>
            <h3 className="font-display text-[17px] font-semibold text-ink mb-1">
              {hobby.title}
            </h3>
            <p className="text-[12.5px] leading-[1.58] text-muted">
              {hobby.description}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
