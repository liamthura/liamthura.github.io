// Skills.tsx — 3-col card grid; the AI & LLM card gets the green tint.

import skills from "@/content/skills.json";
import { SectionShell, SectionHeader, Tag } from "@/components/site-ui";

export function Skills() {
  return (
    <SectionShell id="skills">
      <SectionHeader label="Skills" title="What I work with" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {skills.map((skill) => {
          const tinted = skill.title.startsWith("AI");
          return (
            <div
              key={skill.title}
              className={`p-5 rounded-2xl border ${
                tinted
                  ? "bg-tint border-tint-line"
                  : "bg-surface border-line"
              }`}
            >
              <h3 className="font-display text-[17px] font-semibold mb-2 text-ink">
                {skill.title}
              </h3>
              <p className="text-[12.5px] leading-[1.58] text-muted mb-3">
                {skill.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {skill.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
