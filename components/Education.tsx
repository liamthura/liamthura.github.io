// Education.tsx - Academic background with degree entries
// Single card per entry: degree info left, highlights right

import education from "@/content/education.json";

export function Education() {
  return (
    <section className="py-24 bg-warm-white border-t border-soft-border">
      <div className="container-main">
        {/* Section header */}
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-lime mb-3">
            Education
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-charcoal">
            Academic background
          </h2>
        </div>

        {/* Education entries */}
        {education.map((entry) => (
          <div
            key={entry.id}
            className="bg-cream p-8 rounded-xl border border-soft-border mb-8 last:mb-0"
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left side - degree details */}
              <div>
                <p className="text-sm text-warm-gray mb-2">
                  {entry.from} – {entry.to}
                </p>
                <h3 className="font-display text-xl font-medium text-charcoal mb-2">
                  {entry.title}
                </h3>
                <p className="text-warm-gray text-sm mb-4">
                  {entry.institution}
                </p>

                {entry.grades && (
                  <p className="text-warm-gray text-[15px] mb-4">
                    {entry.grades}
                  </p>
                )}

                {entry.dissertation && (
                  <p className="text-warm-gray text-[15px]">
                    <strong className="text-charcoal">Dissertation:</strong>{" "}
                    {entry.dissertation}
                  </p>
                )}
              </div>

              {/* Right side - highlights */}
              {entry.highlights && entry.highlights.length > 0 && (
                <div>
                  <p className="text-lg font-display mb-2">Key highlights</p>
                  <ul className="text-[15px] text-warm-gray space-y-2">
                    {entry.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-lime">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
