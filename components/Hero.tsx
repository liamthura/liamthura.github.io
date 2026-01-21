// Hero.tsx - Main landing section with intro, avatar, and CTAs
// Reads content from profile.json

import Image from "next/image";
import profile from "@/content/profile.json";

export function Hero() {
  const parts = profile.tagline.split(profile.highlightWord);

  return (
    <section className="min-h-screen flex items-center pt-16 relative overflow-hidden">
      {/* Floating gradient orbs - decorative background */}
      <div
        className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] opacity-30 rounded-full"
        style={{
          background: "radial-gradient(circle, #c5d98a 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[10%] -left-[15%] w-[400px] h-[400px] opacity-25 rounded-full"
        style={{
          background: "radial-gradient(circle, #b8c4ff 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[900px] mx-auto px-8 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <div className="flex-1">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 text-sm text-warm-gray mb-4 py-1.5 px-3.5 bg-warm-white rounded-full border border-soft-border">
              <span className="text-lime">●</span>
              {profile.badge}
            </div>

            {/* Mobile avatar */}
            <div className="md:hidden mb-6">
              <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-warm-white shadow-lg">
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Main headline */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-charcoal mb-6 leading-tight">
              {parts[0]}
              <span className="text-blue italic">{profile.highlightWord}</span>
              {parts[1]}
            </h1>

            {/* Short bio */}
            <p className="text-lg text-warm-gray max-w-[580px] mb-9">
              <strong className="text-charcoal font-semibold">
                {profile.name}
              </strong>
              , but everyone calls me {profile.nickname}. {profile.bio}
            </p>

            {/* CTA buttons */}
            <div className="flex gap-4 flex-wrap">
              <a
                href="#projects"
                className="py-3.5 px-7 rounded-lg font-semibold bg-charcoal text-warm-white hover:bg-charcoal/90 transition-all"
              >
                See my work →
              </a>
              <a
                href="#contact"
                className="py-3.5 px-7 rounded-lg font-semibold border border-soft-border text-charcoal hover:border-charcoal transition-colors"
              >
                Get in touch
              </a>
            </div>
          </div>

          {/* Desktop avatar */}
          <div className="hidden md:block flex-shrink-0">
            <div className="w-56 h-56 rounded-2xl overflow-hidden border-4 border-warm-white shadow-lg">
              <Image
                src={profile.avatar}
                alt={profile.name}
                width={224}
                height={224}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
