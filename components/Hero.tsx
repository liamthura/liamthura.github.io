// Hero.tsx — landing section: dot-grid band, status line, marker headline,
// polaroid avatar, CTAs. Reads profile.json.

import Image from "next/image";
import profile from "@/content/profile.json";
import { MarkerText } from "@/components/site-ui";

export function Hero() {
  const parts = profile.tagline.split(profile.highlightWord);

  return (
    <section className="pt-16">
      <div className="container-main">
        <div className="col-shell pt-9 pb-24">
          <div className="dot-band mb-10" aria-hidden />

          {/* Status line */}
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] mb-8 py-1.5 px-2.5 rounded bg-tint text-accent-deep">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {profile.status}
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-10">
            <div className="flex-1">
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold text-ink leading-[1.02] mb-7">
                {parts[0]}
                <MarkerText>{profile.highlightWord}</MarkerText>
                {parts[1]}
              </h1>

              <p className="text-lg text-muted max-w-[560px] mb-6">{profile.bio}</p>

              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted mb-8">
                {profile.credentials}
              </p>

              <div className="flex gap-3.5 flex-wrap">
                <a
                  href="#projects"
                  className="py-3.5 px-6 rounded-[10px] text-[11px] font-bold uppercase tracking-[0.1em] bg-ink text-paper hover:opacity-90 transition-opacity"
                >
                  See my work ↓
                </a>
                <a
                  href="#contact"
                  className="py-3.5 px-6 rounded-[10px] text-[11px] font-bold uppercase tracking-[0.1em] border border-line text-ink hover:border-ink transition-colors"
                >
                  Get in touch
                </a>
              </div>
            </div>

            {/* Polaroid avatar */}
            <div className="flex-shrink-0 md:pt-2">
              <div className="relative w-[250px] rotate-3">
                <div
                  className="absolute -top-3 left-1/3 w-24 h-6 -rotate-6 rounded-sm"
                  style={{ background: "rgba(230,225,210,0.85)" }}
                  aria-hidden
                />
                <div className="bg-white rounded-xl p-3.5 shadow-[0_10px_30px_rgba(30,26,20,0.14)]">
                  <div className="w-[222px] h-[222px] rounded-md overflow-hidden bg-cover-fill">
                    <Image
                      src={profile.avatar}
                      alt={profile.name}
                      width={222}
                      height={222}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-center text-sm font-semibold text-muted mt-2.5">
                    hi, i&apos;m liam :)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
