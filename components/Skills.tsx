// Skills.tsx - Grid of skill cards with tags

import skills from "@/content/skills.json";

export function Skills() {
  return (
    <section id="skills" className="py-24">
      <div className="container-main">
        {/* Section header */}
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-lime mb-3">
            What I work with
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-charcoal">
            Technical skills
          </h2>
        </div>

        {/* Skills grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((skill) => (
            <div
              key={skill.title}
              className="bg-warm-white p-7 rounded-xl border border-soft-border overflow-hidden
                hover:-translate-y-1 hover:border-lime-light transition-all"
            >
              {/* Skill title */}
              <h3 className="font-display text-lg font-medium mb-2 text-charcoal">
                {skill.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-warm-gray mb-4">{skill.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`
                      text-xs py-1 px-2.5 rounded font-medium
                      ${
                        tag === skill.highlight
                          ? "bg-lime/20 text-lime"
                          : "bg-cream text-warm-gray"
                      }
                    `}
                  >
                    {tag}
                    {tag === skill.highlight && " ★"}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
