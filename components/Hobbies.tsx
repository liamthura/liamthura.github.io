// Hobbies.tsx — playful tilted sticker cards. Icons come from the
// Phosphor webfont, so each hobby can name any icon in hobbies.json
// (any slug from phosphoricons.com, e.g. "cooking-pot").
import hobbies from "@/content/hobbies.json";
import { SectionShell, SectionHeader } from "@/components/site-ui";

const TILT = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

// phosphoricons.com shows names like "Cooking Pot" — the font wants
// the slug form: lowercase, spaces as hyphens.
function iconClass(name: string): string {
  const slug = name.trim().toLowerCase().replace(/[\s_]+/g, "-");
  return `ph-duotone ph-${slug}`;
}

export function Hobbies({
  header = true,
  bare = false,
}: {
  header?: boolean;
  bare?: boolean;
}) {
  return (
    <SectionShell bare={bare}>
      {header && <SectionHeader label="Outside of work" title="When I'm not at a screen" />}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
        {hobbies.map((hobby, i) => (
          <div
            key={hobby.title}
            className={`bg-surface p-5 rounded-2xl border border-line shadow-[0_6px_16px_color-mix(in_srgb,var(--shade)_7%,transparent)] transition-transform hover:rotate-0 ${
              TILT[i % TILT.length]
            }`}
          >
            <i
              aria-hidden
              className={`${iconClass(hobby.icon)} text-accent-deep text-[28px] leading-none mb-2.5 block`}
            />
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
