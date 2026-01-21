// Hobbies.tsx - Personal interests grid

import hobbies from "@/content/hobbies.json";

export function Hobbies() {
  return (
    <section className="py-24">
      <div className="container-main">
        {/* Section header */}
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-lime mb-3">
            Outside of work
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-charcoal">
            When I&apos;m not at a screen
          </h2>
        </div>

        {/* Hobbies grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {hobbies.map((hobby) => (
            <div
              key={hobby.title}
              className="bg-warm-white p-6 rounded-xl border border-soft-border"
            >
              <span className="text-3xl mb-3 block">{hobby.emoji}</span>
              <h3 className="font-display text-xl font-medium text-charcoal mb-1">
                {hobby.title}
              </h3>
              <p className="text-sm text-warm-gray">{hobby.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
