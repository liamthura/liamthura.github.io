// About.tsx - Bio section with story and strengths sidebar

import about from "@/content/about.json";

export function About() {
  return (
    <section
      id="about"
      className="py-24 bg-warm-white border-t border-b border-soft-border"
    >
      <div className="container-main">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left column - story */}
          <div>
            {/* Section header */}
            <div className="mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-lime mb-3">
                About me
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-medium text-charcoal">
                The slightly longer version
              </h2>
            </div>

            {/* Intro paragraph */}
            <p className="text-charcoal text-lg mb-5">{about.intro}</p>

            {/* Remaining paragraphs */}
            {about.paragraphs.map((para, i) => (
              <p
                key={i}
                className={`text-warm-gray ${i < about.paragraphs.length - 1 ? "mb-5" : ""}`}
              >
                {para}
              </p>
            ))}
          </div>

          {/* Right column - strengths card */}
          <div className="bg-cream p-7 rounded-xl border border-soft-border">
            <p className="font-display text-lg font-medium mb-4 text-charcoal">
              What I bring to a team
            </p>
            <ul className="list-none">
              {about.strengths.map((item, i) => (
                <li
                  key={i}
                  className={`
                    flex items-start gap-3 py-2.5 text-[15px] text-warm-gray
                    ${i < about.strengths.length - 1 ? "border-b border-dashed border-soft-border" : ""}
                  `}
                >
                  <span className="text-lime font-bold">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
