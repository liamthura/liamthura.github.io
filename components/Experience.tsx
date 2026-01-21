// Experience.tsx - Work history timeline
// Grid layout: date column (200px) + details column

import experience from "@/content/experience.json";

export function Experience() {
  return (
    <section id="experience" className="py-24">
      <div className="container-main">
        {/* Section header */}
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-lime mb-3">
            Experience
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-charcoal">
            Where I&apos;ve worked
          </h2>
        </div>

        {/* Experience list */}
        <div>
          {experience.map((job, i) => (
            <div
              key={job.id}
              className={`
                py-8 grid md:grid-cols-[200px_1fr] gap-6 md:gap-10
                ${i < experience.length - 1 ? "border-b border-soft-border" : ""}
              `}
            >
              {/* Left column - company and dates */}
              <div className="text-warm-gray text-sm">
                <span className="font-semibold text-charcoal block mb-1">
                  {job.company}
                </span>
                <span>
                  {job.from} - {job.to}
                </span>
                <br />
                <span>{job.type}</span>
              </div>

              {/* Right column - role details */}
              <div>
                <h3 className="font-display text-xl font-medium text-charcoal mb-3">
                  {job.role}
                </h3>
                <p className="text-warm-gray mb-4">{job.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs py-1.5 px-3 bg-warm-white border border-soft-border rounded-md text-warm-gray"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
