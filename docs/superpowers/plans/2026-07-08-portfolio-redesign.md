# Portfolio Redesign ("Working Drawing") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the live portfolio (liamthura.github.io) to the approved Figma "Working Drawing" direction — paper canvas with visible column rules, hatch dividers, Bricolage Grotesque display type, one signal-green accent, sticker avatar, live status line — while leaving all content and the local-only admin CMS fully working.

**Architecture:** The site is a single-page Next.js App Router app. Every public section is a component in `components/*.tsx` that statically imports its data from `public/content/*.json`. This redesign is a **restyle, not a rewrite of data flow**: we change `app/globals.css` tokens, swap the display font in `app/layout.tsx`, add a small shared UI kit (`components/site-ui.tsx`), and rewrite the JSX/classes of each section component. No JSON is edited. The experience grouping logic already exists and is reused as-is (only its markup changes).

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4 (CSS-first `@theme inline` tokens), TypeScript strict, `next/font/google`, `@phosphor-icons/react`.

## Global Constraints

- **No test suite exists.** The correctness gate for every task is: `npm run lint` passes, `npm run build` passes, and a visual check of the affected section in **both light and dark** mode. Do not add a test framework.
- **The admin CMS must keep working.** `app/api`, `app/admin`, `components/admin` are gitignored/local-only (present in this worktree because they were copied in during setup). The admin UI + `ThemeToggle` consume these exact Tailwind tokens: `bg-cream`, `bg-warm-white`, `text-charcoal`, `text-warm-gray`, `border-soft-border`, `text-lime`. **Never rename or remove the CSS variables `--cream`, `--warm-white`, `--charcoal`, `--warm-gray`, `--soft-border`, `--lime`, `--lime-light`, `--ink`, `--ink-fg`, or the `--font-body` variable.** They may be *re-pointed* (aliased) to new palette values but must remain defined. `--blue`/`--blue-light` and `font-display` are NOT used by admin — safe to repurpose.
- **Do not edit `public/content/*.json` copy.** Components consume it verbatim. The junk "Test" experience entry stays; it renders as the second Honda role and demonstrates the multi-role timeline.
- **Keep light + dark mode.** `.dark` class on `<html>` + `components/ThemeProvider.tsx` + `THEME_INIT_SCRIPT` are untouched. Every new token gets both a `:root` and a `.dark` value.
- **Fonts:** display font becomes **Bricolage Grotesque**; body stays **Plus Jakarta Sans**. Fraunces is removed.
- **Accent:** one signal green. Old blue accent is retired from public components.
- Match existing formatting: 2-space indent, no semicolons, comments rare and only for non-obvious *why*. Run `npm run lint` before considering any task done.
- Images: avatar + two project covers load from `filedn.com`, already whitelisted in `next.config.ts` — no config change.

## Palette reference (use verbatim)

| Role | Light | Dark |
|---|---|---|
| paper (page bg) | `#faf9f5` | `#131110` |
| surface (cards) | `#ffffff` | `#1f1c19` |
| ink (primary text) | `#1c1917` | `#f3f1ec` |
| muted (secondary text) | `#57534e` | `#a8a29a` |
| line (hairline) | `#e5e1d8` | `#332f2b` |
| accent (dots/active) | `#00a05c` | `#1cba73` |
| accent-deep (eyebrows/links/text) | `#0a7a50` | `#4ac78c` |
| marker (lime highlight bg) | `#c8f169` | `#c8f169` |
| tint (green wash card) | `#e9f6ee` | `#1b2a22` |
| tint-line | `#b7dec9` | `#385f4c` |
| cover (image placeholder) | `#edebe5` | `#292622` |
| ink-island (contact bg) | `#1c1917` | `#0e0c0a` |
| ink-island-fg | `#faf9f5` | `#f3f1ec` |

## File Structure

- `app/layout.tsx` — swap Fraunces→Bricolage Grotesque (Task 1).
- `app/globals.css` — new palette vars + aliases + `@theme inline` exposure + shared utility classes (Task 1).
- `components/site-ui.tsx` — **new** shared kit: `SectionShell`, `SectionHeader`, `Tag`, `StatusChip`, `MarkerText` (Task 2).
- `components/Nav.tsx` (Task 3), `Hero.tsx` (Task 4), `About.tsx` (Task 5), `Experience.tsx` (Task 6), `Projects.tsx` (Task 7), `Skills.tsx` (Task 8), `Education.tsx` (Task 9), `Hobbies.tsx` (Task 10), `Contact.tsx` + `Footer.tsx` (Task 11).
- Task 12 — full-page light+dark verification and admin regression check.

---

### Task 1: Foundation — fonts + design tokens

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Produces (Tailwind utilities available to all later tasks): existing `bg-cream bg-warm-white text-charcoal text-warm-gray border-soft-border text-lime` (now re-pointed) PLUS new `bg-paper bg-surface text-ink text-muted border-line text-accent text-accent-deep bg-accent bg-tint border-tint-line bg-cover bg-ink-island text-ink-island-fg`; utility classes `.col-shell`, `.hatch-divider`, `.dot-band`, `.mark`, `.font-display` (now Bricolage). CSS var `--font-display` now bound to Bricolage Grotesque.

- [ ] **Step 1: Swap the display font in `app/layout.tsx`**

Replace the `Fraunces` import and loader with Bricolage Grotesque. Change lines 1-19 to:

```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/components/ThemeProvider";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});
```

Then update the `<html>` className (line 32) to use `bricolage.variable` instead of `fraunces.variable`:

```tsx
    <html lang="en" className={`${jakarta.variable} ${bricolage.variable}`} suppressHydrationWarning>
```

- [ ] **Step 2: Rewrite the token layer in `app/globals.css`**

Replace the whole block from `:root {` (line 18) through the end of the `.dark { … }` block (line 50) with the new palette + backward-compat aliases. New content:

```css
:root {
  /* New "working drawing" palette (source of truth) */
  --paper:       #faf9f5;
  --surface:     #ffffff;
  --ink-1:       #1c1917;
  --muted:       #57534e;
  --line:        #e5e1d8;
  --accent:      #00a05c;
  --accent-deep: #0a7a50;
  --marker:      #c8f169;
  --tint:        #e9f6ee;
  --tint-line:   #b7dec9;
  --cover:       #edebe5;

  /* Backward-compat aliases — the admin CMS + ThemeToggle depend on these
     token names. Keep them defined; they now point at the new palette. */
  --cream:       var(--paper);
  --warm-white:  var(--surface);
  --charcoal:    var(--ink-1);
  --warm-gray:   var(--muted);
  --soft-border: var(--line);
  --lime:        var(--accent-deep); /* admin accent text now reads green */
  --lime-light:  var(--marker);
  --blue:        var(--accent);      /* retired from public; kept for safety */
  --blue-light:  var(--tint);

  /* Always-dark island (Contact/Footer) */
  --ink:         #1c1917;
  --ink-fg:      #faf9f5;
  color-scheme: light;
}

.dark {
  --paper:       #131110;
  --surface:     #1f1c19;
  --ink-1:       #f3f1ec;
  --muted:       #a8a29a;
  --line:        #332f2b;
  --accent:      #1cba73;
  --accent-deep: #4ac78c;
  --marker:      #c8f169;
  --tint:        #1b2a22;
  --tint-line:   #385f4c;
  --cover:       #292622;

  --cream:       var(--paper);
  --warm-white:  var(--surface);
  --charcoal:    var(--ink-1);
  --warm-gray:   var(--muted);
  --soft-border: var(--line);
  --lime:        var(--accent-deep);
  --lime-light:  var(--marker);
  --blue:        var(--accent);
  --blue-light:  var(--tint);

  --ink:         #0e0c0a; /* contact island: lighter island now sits darker */
  --ink-fg:      #f3f1ec;
  color-scheme: dark;
}
```

- [ ] **Step 3: Expose new tokens in the `@theme inline` block**

In `app/globals.css`, inside the existing `@theme inline { … }` block, add the new color tokens alongside the existing ones (keep all existing lines intact):

```css
  --color-paper:        var(--paper);
  --color-surface:      var(--surface);
  --color-ink:          var(--ink-1);
  --color-muted:        var(--muted);
  --color-line:         var(--line);
  --color-accent:       var(--accent);
  --color-accent-deep:  var(--accent-deep);
  --color-marker:       var(--marker);
  --color-tint:         var(--tint);
  --color-tint-line:    var(--tint-line);
  --color-cover:        var(--cover);
  --color-ink-island:   var(--ink);
  --color-ink-island-fg: var(--ink-fg);
```

Then **change the existing line `--color-ink: var(--ink);` to `--color-ink: var(--ink-1);`** so `text-ink` means primary near-black text in the redesign. **Keep the existing `--color-ink-fg: var(--ink-fg);` line as-is** (do not delete it).

> Why this exact shape: `bg-ink` and `text-ink` share the single `--color-ink` token, so "ink" can mean only one thing. The redesign needs it to mean primary text, so the always-dark island is exposed separately as `bg-ink-island`/`text-ink-island-fg`. Keeping `--color-ink-fg` alive and re-pointing `--color-ink` to `--ink-1` (≈ the old island `#2d2d2d`) means the *old* `Contact.tsx`/`Footer.tsx` — which use `bg-ink`/`text-ink-fg` and aren't rewritten until Task 11 — keep rendering as a readable dark block through Tasks 1–10 instead of going unstyled. The new Contact (Task 11) switches to `bg-ink-island`/`text-ink-island-fg`.

- [ ] **Step 4: Update `body` base + `container-main`, add utility classes**

In `app/globals.css`, the `body` rule (lines 69-73) already uses `var(--cream)`/`var(--charcoal)` which now resolve to paper/ink — leave it. Update `.container-main` max-width from `1100px` to `1216px` (1120 column + 48px padding each side) and append the new utility classes at the end of the file:

```css
.container-main {
  max-width: 1216px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

/* Centered content column with full-height hairline rules on both edges. */
.col-shell {
  max-width: 1120px;
  margin-inline: auto;
  padding-inline: 3rem;
  border-inline: 1px solid var(--line);
}

/* Diagonal hatch strip used as a divider between sections. */
.hatch-divider {
  height: 32px;
  background-image: repeating-linear-gradient(
    -45deg,
    var(--line) 0 1px,
    transparent 1px 12px
  );
}

/* Dashed dot-grid band (hero texture). */
.dot-band {
  height: 88px;
  background-image: repeating-linear-gradient(
    to right,
    var(--line) 0 2px,
    transparent 2px 16px
  );
  background-size: 100% 16px;
  background-repeat: repeat-y;
  opacity: 0.9;
}

/* Lime marker highlight behind a headline word. */
.mark {
  background: var(--marker);
  color: var(--ink-1);
  padding: 0 0.3em 0.08em;
  border-radius: 0.4rem;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
```

- [ ] **Step 5: Verify build, lint, and admin regression**

Run:
```bash
npm run lint && npm run build
```
Expected: both exit 0, all `/admin/*` routes still listed in build output.

Then start the dev server and screenshot the admin panel to confirm it still renders with the new (green) accent:
```bash
npm run dev &   # port 3000
npx playwright screenshot --viewport-size=1440,900 --wait-for-timeout=2500 http://localhost:3000/admin/about /private/tmp/redesign-admin.png
```
Expected: admin sidebar/editor render, no broken colors (accent text now green, not lime-yellow). Stop the dev server after.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat(redesign): new working-drawing tokens + Bricolage Grotesque font"
```

---

### Task 2: Shared site UI kit

**Files:**
- Create: `components/site-ui.tsx`

**Interfaces:**
- Produces:
  - `SectionShell({ id?, dark?, children })` — renders `<section>` + top `.hatch-divider` (omitted when `dark`) + `.col-shell` wrapper. `dark` swaps rule color via `text-ink-island-fg` context (border stays via `border-line`; the dark section overrides its own bg).
  - `SectionHeader({ label, title, dark? })` — uppercase letterspaced green eyebrow (`label`) + Bricolage title. No numbering, no em dash.
  - `Tag({ children })` — bordered uppercase chip (`text-[10px] tracking-[0.08em]`).
  - `StatusChip({ children })` — green-tinted chip with a leading accent dot.
  - `MarkerText({ children })` — `<span class="mark">`.

- [ ] **Step 1: Write `components/site-ui.tsx`**

```tsx
// site-ui.tsx — shared primitives for the public redesign.
// Section shell (centered column + hairline rules + hatch divider),
// section header (green eyebrow + Bricolage title), chips, marker text.

import type { ReactNode } from "react";

export function SectionShell({
  id,
  dark = false,
  children,
}: {
  id?: string;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={dark ? "bg-ink-island text-ink-island-fg" : ""}>
      {!dark && <div className="hatch-divider" aria-hidden />}
      <div className="container-main">
        <div className="col-shell py-20 md:py-24">{children}</div>
      </div>
    </section>
  );
}

export function SectionHeader({
  label,
  title,
  dark = false,
}: {
  label: string;
  title: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-10">
      <p
        className={`text-[11px] font-bold uppercase tracking-[0.14em] mb-3 ${
          dark ? "text-accent-deep" : "text-accent-deep"
        }`}
      >
        {label}
      </p>
      <h2
        className={`font-display text-3xl md:text-[40px] font-semibold ${
          dark ? "text-ink-island-fg" : "text-ink"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-[0.08em] py-1.5 px-2.5 rounded border border-line text-muted">
      {children}
    </span>
  );
}

export function StatusChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] py-1.5 px-2.5 rounded bg-tint text-accent-deep">
      <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden />
      {children}
    </span>
  );
}

export function MarkerText({ children }: { children: ReactNode }) {
  return <span className="mark">{children}</span>;
}
```

- [ ] **Step 2: Verify it compiles**

Run:
```bash
npm run lint && npm run build
```
Expected: exit 0. (Kit is unused so far; build proves it type-checks.)

- [ ] **Step 3: Commit**

```bash
git add components/site-ui.tsx
git commit -m "feat(redesign): shared section shell, header, chip primitives"
```

---

### Task 3: Nav restyle

**Files:**
- Modify: `components/Nav.tsx`

**Interfaces:**
- Consumes: nothing new. Keeps all existing scroll-spy + mobile-menu logic (lines 19-69) UNCHANGED. Only the returned JSX classes/labels change.

- [ ] **Step 1: Restyle the logo + links**

Keep the whole component logic; change only the `return (...)` markup. Logo becomes Bricolage wordmark `khant.`; active link uses green underline; container uses hairline bottom border on paper. Replace the logo `<a>` (lines 75-81) with:

```tsx
        <a
          href="#"
          className="font-display font-bold text-xl text-ink no-underline flex items-center gap-2"
        >
          khant<span className="text-accent">.</span>
        </a>
```

Update the nav wrapper (line 72) background/border to the new tokens:

```tsx
    <nav className="fixed top-0 left-0 right-0 bg-paper/85 backdrop-blur-md z-50 border-b border-line">
```

For the desktop link active/idle classes (lines 92-99), replace with:

```tsx
            text-[11px] font-semibold uppercase tracking-[0.1em] no-underline transition-colors
            ${
              activeSection === link.sectionId
                ? "text-accent-deep"
                : "text-muted hover:text-ink"
            }
```

The mobile dropdown (lines 110-147): swap `bg-warm-white`→`bg-surface`, `border-soft-border`→`border-line`, `text-charcoal`→`text-ink`, `text-warm-gray`→`text-muted`, `bg-cream`→`bg-paper` throughout.

- [ ] **Step 2: Verify + screenshot both themes**

```bash
npm run lint && npm run build
npm run dev &
npx playwright screenshot --viewport-size=1440,300 --wait-for-timeout=2500 http://localhost:3000 /private/tmp/redesign-nav.png
```
Expected: `khant.` wordmark, uppercase nav links, green active state. Toggle dark via appending `?` is not possible — instead verify dark by evaluating: screenshot is enough for light; dark verified in Task 12 full pass. Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add components/Nav.tsx
git commit -m "feat(redesign): restyle nav to working-drawing"
```

---

### Task 4: Hero

**Files:**
- Modify: `components/Hero.tsx`

**Interfaces:**
- Consumes: `profile.json` (unchanged fields: `tagline`, `highlightWord`, `name`, `nickname`, `bio`, `badge`, `avatar`). `MarkerText` from `site-ui`.

- [ ] **Step 1: Rewrite `Hero.tsx`**

Full replacement (keeps the `parts` split; drops gradient orbs; adds dot band, status line, marker headline, polaroid avatar, buttons):

```tsx
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
            Currently: writing my dissertation · Newcastle, UK
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
                IT Management · Northumbria University · Ex-Honda Motor Europe
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
                  <div className="w-[222px] h-[222px] rounded-md overflow-hidden bg-cover">
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
```

> The polaroid card stays literal white in both themes (`bg-white`) by design — matches the Figma. The `bg-cover` placeholder shows only if the image fails.

- [ ] **Step 2: Verify + screenshot**

```bash
npm run lint && npm run build
npm run dev &
npx playwright screenshot --viewport-size=1440,760 --wait-for-timeout=3000 http://localhost:3000 /private/tmp/redesign-hero.png
```
Expected: dot band, green status pill with pulsing dot, marker-highlighted "actually", tilted polaroid with real photo, two uppercase buttons. Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat(redesign): hero with dot band, status line, polaroid avatar"
```

---

### Task 5: About

**Files:**
- Modify: `components/About.tsx`

**Interfaces:**
- Consumes: `about.json` (`intro`, `paragraphs[]`, `strengths[]`). `SectionShell`, `SectionHeader` from `site-ui`. Keeps the `isExpanded` collapse behaviour.

- [ ] **Step 1: Rewrite `About.tsx`**

```tsx
// About.tsx — pull quote + narrative + strengths grid. Collapsible tail.
"use client";

import { useState } from "react";
import about from "@/content/about.json";
import { SectionShell, SectionHeader } from "@/components/site-ui";

export function About() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <SectionShell id="about">
      <SectionHeader label="About" title="The slightly longer version" />

      <div className="grid md:grid-cols-[400px_1fr] gap-12 md:gap-[72px] items-start">
        {/* Pull quote */}
        <p className="font-display text-[26px] leading-[1.45] font-medium text-ink">
          {about.intro}
        </p>

        {/* Narrative + strengths */}
        <div>
          <p className="text-[15px] leading-[1.68] text-muted mb-5">
            {about.paragraphs[0]}
          </p>

          {isExpanded && (
            <div className="space-y-5 mb-5">
              {about.paragraphs.slice(1).map((para, i) => (
                <p key={i} className="text-[15px] leading-[1.68] text-muted">
                  {para}
                </p>
              ))}
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-medium text-muted hover:text-ink transition-colors mb-9"
          >
            {isExpanded ? "Shorter ↑" : "Even longer ↓"}
          </button>

          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink mb-4">
            What I bring to a team
          </p>
          <div className="grid sm:grid-cols-2 gap-x-7 gap-y-3.5">
            {about.strengths.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-accent-deep font-bold text-sm leading-[1.5]">
                  →
                </span>
                <span className="text-[13px] font-semibold leading-[1.5] text-ink">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 2: Verify + screenshot**

```bash
npm run lint && npm run build
npm run dev &
npx playwright screenshot --full-page --viewport-size=1440,900 --wait-for-timeout=3000 http://localhost:3000 /private/tmp/redesign-about.png
```
Expected: green "ABOUT" eyebrow, Bricolage title, large pull quote left, narrative + 2-col strengths with green arrows right. Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add components/About.tsx
git commit -m "feat(redesign): about pull-quote + strengths layout"
```

---

### Task 6: Experience (restyle only)

**Files:**
- Modify: `components/Experience.tsx`

**Interfaces:**
- Consumes: `experience.json`. **Keep lines 1-97 (imports, `formatMonth`, `dateValue`, grouping `useMemo`, `splitDescription`, expand state) UNCHANGED.** Only replace the `return (...)` JSX (lines 99-227). Uses `SectionShell`, `SectionHeader`, `Tag`.

- [ ] **Step 1: Replace only the JSX return**

Swap `<section …>…</section>` for a `SectionShell`-based layout. Dates in a fixed left column; **org name is a bold green uppercase eyebrow above the role title**; multi-role groups keep the vertical timeline thread (filled green dot = current `to === null`, hollow = past). Replace lines 99-227 with:

```tsx
  return (
    <SectionShell id="experience">
      <SectionHeader label="Experience" title="Where I've worked" />

      <div>
        {groups.map((group, i) => {
          const isMulti = group.roles.length > 1;
          return (
            <div
              key={group.company}
              className={`py-7 grid md:grid-cols-[190px_1fr] gap-4 md:gap-8 ${
                i < groups.length - 1 ? "border-b border-line" : ""
              }`}
            >
              {/* Left column — dates only */}
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted pt-1">
                {formatMonth(group.spanFrom)} — {formatMonth(group.spanTo)}
              </div>

              {/* Right column — org eyebrow + role(s) */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent-deep mb-3">
                  {group.company}
                </p>

                <div className={isMulti ? "relative" : ""}>
                  {isMulti && (
                    <div
                      aria-hidden
                      className="absolute left-[4px] top-3 bottom-3 w-0.5 bg-line"
                    />
                  )}
                  <div className={isMulti ? "space-y-6" : ""}>
                    {group.roles.map((role) => {
                      const { firstSentence, rest } = splitDescription(
                        role.description,
                      );
                      const isExpanded = expandedRoles.has(role.id);
                      const isCurrent = role.to === null;

                      return (
                        <div
                          key={role.id}
                          className={isMulti ? "relative pl-7" : ""}
                        >
                          {isMulti && (
                            <div
                              aria-hidden
                              className={`absolute left-0 top-1.5 w-[9px] h-[9px] rounded-full ${
                                isCurrent
                                  ? "bg-accent"
                                  : "bg-paper border-[1.5px] border-muted"
                              }`}
                            />
                          )}

                          {isMulti && (
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted mb-1">
                              {formatMonth(role.from)} — {formatMonth(role.to)}
                              <span className="text-muted/60"> · </span>
                              {role.type}
                            </p>
                          )}

                          <h3 className="font-display text-xl font-semibold text-ink mb-2">
                            {role.role}
                          </h3>

                          <p className="text-sm leading-[1.65] text-muted mb-3">
                            {rest && rest.length <= 100
                              ? role.description
                              : firstSentence +
                                (isExpanded && rest ? ` ${rest}` : "")}
                          </p>

                          {rest && rest.length > 100 && (
                            <button
                              onClick={() => toggleRole(role.id)}
                              className="mb-3 text-sm font-medium text-muted hover:text-ink transition-colors"
                            >
                              {isExpanded ? "Read less ↑" : "Read more ↓"}
                            </button>
                          )}

                          {role.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {role.tags.map((tag) => (
                                <Tag key={tag}>{tag}</Tag>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
```

- [ ] **Step 2: Update imports**

Change line 6-8 imports to add the kit and remove nothing else:

```tsx
import { useMemo, useState } from "react";
import experience from "@/content/experience.json";
import { SectionShell, SectionHeader, Tag } from "@/components/site-ui";
```

- [ ] **Step 3: Verify + screenshot**

```bash
npm run lint && npm run build
npm run dev &
npx playwright screenshot --full-page --viewport-size=1440,900 --wait-for-timeout=3000 http://localhost:3000 /private/tmp/redesign-exp.png
```
Expected: dates left, green org eyebrow above role titles; Honda group shows two roles on a thread (filled dot for the "Test" current role, hollow for placement year). Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add components/Experience.tsx
git commit -m "feat(redesign): restyle experience timeline, org-led rows"
```

---

### Task 7: Projects (bento + bottom-pinned links)

**Files:**
- Modify: `components/Projects.tsx`

**Interfaces:**
- Consumes: `projects.json` (`id, title, description, status, type, url, github, readMore, image, tags, size`). `SectionShell`, `SectionHeader`, `Tag`, `StatusChip`.

- [ ] **Step 1: Rewrite `Projects.tsx`**

Keeps the bento sizing map. Status becomes a `StatusChip`; link row is pushed to card bottom with `mt-auto`; tags use `Tag`. Full replacement:

```tsx
"use client";

// Projects.tsx — bento grid of project cards. Link row pinned to card bottom.

import Image from "next/image";
import {
  ArrowSquareOutIcon,
  GithubLogoIcon,
  ArticleIcon,
} from "@phosphor-icons/react";
import projects from "@/content/projects.json";
import { SectionShell, SectionHeader, Tag, StatusChip } from "@/components/site-ui";

export function Projects() {
  return (
    <SectionShell id="projects">
      <SectionHeader label="Projects" title="Things I've made" />

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[minmax(140px,auto)] grid-flow-dense w-full">
        {projects.map((project) => {
          const isArchived = project.status === "Archived";
          return (
            <div
              key={project.id}
              className={`group relative bg-surface rounded-2xl border overflow-hidden flex flex-col h-full w-full transition-all
                ${
                  isArchived
                    ? "border-line/70 opacity-70 hover:opacity-100"
                    : "border-line hover:-translate-y-1 hover:border-tint-line"
                }
                ${project.size === "large" ? "md:col-span-4 md:row-span-2 p-6" : ""}
                ${project.size === "medium" ? "md:col-span-2 md:row-span-2 p-6" : ""}
                ${project.size === "standard" ? "md:col-span-4 p-5" : ""}
                ${project.size === "small" ? "md:col-span-2 p-5" : ""}`}
            >
              {project.image && (
                <div
                  className="w-full h-44 relative -m-6 mb-4"
                  style={{ width: "calc(100% + 48px)" }}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="mb-2.5">
                <StatusChip>
                  {project.status} · {project.type}
                </StatusChip>
              </div>

              <h3 className="font-display font-semibold text-ink text-xl mb-2">
                {project.title}
              </h3>

              <p className="text-[13.5px] leading-[1.6] text-muted mb-3">
                {project.description}
              </p>

              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              )}

              {/* Link row — pinned to the bottom edge */}
              {(project.url || project.github || project.readMore) && (
                <div className="mt-auto pt-3 border-t border-line flex flex-wrap gap-5 text-[11px] font-bold uppercase tracking-[0.1em]">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-accent-deep hover:opacity-80"
                    >
                      <ArrowSquareOutIcon size={13} /> Live
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-ink hover:opacity-80"
                    >
                      <GithubLogoIcon size={13} /> GitHub
                    </a>
                  )}
                  {project.readMore && (
                    <a
                      href={project.readMore}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-accent-deep hover:opacity-80"
                    >
                      <ArticleIcon size={13} /> Read
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 2: Verify + screenshot**

```bash
npm run lint && npm run build
npm run dev &
npx playwright screenshot --full-page --viewport-size=1440,900 --wait-for-timeout=3000 http://localhost:3000 /private/tmp/redesign-projects.png
```
Expected: bento cards, green status chips, bordered tag chips, link rows aligned at card bottoms with `Live / GitHub / Read`. Cover images render for Lighthouse + StudentStack. Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add components/Projects.tsx
git commit -m "feat(redesign): projects bento with bottom-pinned links"
```

---

### Task 8: Skills

**Files:**
- Modify: `components/Skills.tsx`

**Interfaces:**
- Consumes: `skills.json` (`title, description, tags[], highlight`). `SectionShell`, `SectionHeader`, `Tag`. The AI/LLM card gets the green tint.

- [ ] **Step 1: Rewrite `Skills.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify + screenshot**

```bash
npm run lint && npm run build
npm run dev &
npx playwright screenshot --full-page --viewport-size=1440,900 --wait-for-timeout=3000 http://localhost:3000 /private/tmp/redesign-skills.png
```
Expected: 3×3 card grid, AI & LLM card tinted green, others on white/surface. Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add components/Skills.tsx
git commit -m "feat(redesign): skills card grid with tinted AI card"
```

---

### Task 9: Education

**Files:**
- Modify: `components/Education.tsx`

**Interfaces:**
- Consumes: `education.json` (`from, to, title, institution, grades, dissertation, highlights[]`). `SectionShell`, `SectionHeader`, `StatusChip`.

- [ ] **Step 1: Rewrite `Education.tsx`**

```tsx
// Education.tsx — degree (left) + dissertation callout & highlights (right).

import education from "@/content/education.json";
import { SectionShell, SectionHeader, StatusChip } from "@/components/site-ui";

export function Education() {
  return (
    <SectionShell>
      <SectionHeader label="Education" title="Academic background" />

      {education.map((entry) => (
        <div
          key={entry.id}
          className="grid md:grid-cols-[400px_1fr] gap-12 md:gap-[72px]"
        >
          {/* Degree */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted mb-3">
              {entry.from} — {entry.to}
            </p>
            <h3 className="font-display text-[26px] leading-[1.2] font-semibold text-ink mb-3">
              {entry.title}
            </h3>
            <p className="text-sm text-muted mb-3">{entry.institution}</p>
            {entry.grades && <StatusChip>{entry.grades}</StatusChip>}
          </div>

          {/* Detail */}
          <div>
            {entry.dissertation && (
              <div className="bg-surface border-l-[3px] border-accent px-5 py-4 mb-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent-deep mb-2">
                  Dissertation
                </p>
                <p className="text-sm leading-[1.65] text-muted">
                  {entry.dissertation}
                </p>
              </div>
            )}

            {entry.highlights && entry.highlights.length > 0 && (
              <>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink mb-3">
                  Key highlights
                </p>
                <ul className="space-y-2.5">
                  {entry.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="text-accent-deep font-bold text-sm">→</span>
                      <span className="text-[13px] font-semibold text-ink">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      ))}
    </SectionShell>
  );
}
```

- [ ] **Step 2: Verify + screenshot**

```bash
npm run lint && npm run build
npm run dev &
npx playwright screenshot --full-page --viewport-size=1440,900 --wait-for-timeout=3000 http://localhost:3000 /private/tmp/redesign-edu.png
```
Expected: degree left with green grade chip; dissertation callout with green left rule; arrow highlight list. Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add components/Education.tsx
git commit -m "feat(redesign): education degree + dissertation callout"
```

---

### Task 10: Hobbies (tilted cards)

**Files:**
- Modify: `components/Hobbies.tsx`

**Interfaces:**
- Consumes: `hobbies.json` (`emoji, title, description`). `SectionShell`, `SectionHeader`.

- [ ] **Step 1: Rewrite `Hobbies.tsx`**

Alternating slight tilt per card via index; soft shadow.

```tsx
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
```

- [ ] **Step 2: Verify + screenshot**

```bash
npm run lint && npm run build
npm run dev &
npx playwright screenshot --full-page --viewport-size=1440,900 --wait-for-timeout=3000 http://localhost:3000 /private/tmp/redesign-hobbies.png
```
Expected: four tilted emoji cards that straighten on hover. Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add components/Hobbies.tsx
git commit -m "feat(redesign): tilted hobby sticker cards"
```

---

### Task 11: Contact + Footer (dark island)

**Files:**
- Modify: `components/Contact.tsx`
- Modify: `components/Footer.tsx`

**Interfaces:**
- Consumes: `contact.json` (`headline, intro, secondary, availability, links[]`). Uses `SectionShell` with `dark` prop; keeps the Phosphor `iconMap` + link-splitting logic.

- [ ] **Step 1: Rewrite `Contact.tsx`**

Keeps `iconMap`, `linksWithValues`/`linksWithoutValues`. Wraps in dark `SectionShell`; headline gets a marker word; links become bordered rows.

```tsx
"use client";

// Contact.tsx — dark island: headline with marker word, copy, link rows.

import {
  EnvelopeIcon,
  LinkedinLogoIcon,
  GithubLogoIcon,
} from "@phosphor-icons/react";
import contact from "@/content/contact.json";
import { SectionShell } from "@/components/site-ui";

const iconMap: {
  [key: string]: React.ComponentType<{ size?: number; className?: string }>;
} = { EnvelopeIcon, LinkedinLogoIcon, GithubLogoIcon };

export function Contact() {
  const headlineParts = contact.headline.split(/(\btalk\b)/i);

  return (
    <SectionShell id="contact" dark>
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent-deep mb-3">
        Contact
      </p>
      <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-8">
        {headlineParts.map((part, i) =>
          /^talk$/i.test(part) ? (
            <span key={i} className="mark">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </h2>

      <div className="grid md:grid-cols-[1fr_380px] gap-12 md:gap-[72px] items-start">
        <div>
          <p className="text-[15px] leading-[1.68] text-ink-island-fg/70 mb-4">
            {contact.intro}
          </p>
          <p className="text-sm leading-[1.68] text-ink-island-fg/70 mb-4">
            {contact.secondary}
          </p>
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em]">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            {contact.availability}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {contact.links.map((link) => {
            const Icon = iconMap[link.icon];
            return (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith("mailto") ? undefined : "_blank"}
                className="flex items-center justify-between gap-3 px-[18px] py-3.5 border border-ink-island-fg/15 rounded-[10px] hover:border-ink-island-fg/30 transition-colors"
              >
                <span className="inline-flex items-center gap-2.5">
                  {Icon && <Icon size={16} className="text-accent-deep" />}
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent-deep">
                    {link.label}
                  </span>
                </span>
                <span className="text-[13px] font-semibold text-ink-island-fg">
                  {link.value}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Footer bar */}
      <div className="mt-9 pt-6 border-t border-ink-island-fg/15 flex flex-col md:flex-row justify-between items-center gap-3">
        <span className="font-display font-bold text-base">
          khant<span className="text-accent">.</span>
        </span>
        <span className="text-xs text-ink-island-fg/60">
          © 2026 · Built by Liam Thura, fuelled by dumplings
        </span>
        <a
          href="#"
          className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent-deep"
        >
          Back to top ↑
        </a>
      </div>
    </SectionShell>
  );
}
```

- [ ] **Step 2: Reduce `Footer.tsx` to nothing rendered**

The footer bar now lives inside Contact. Remove `<Footer />` from `app/page.tsx` (delete the import on line 12 and the `<Footer />` usage on line 26) and delete `components/Footer.tsx`.

```bash
git rm components/Footer.tsx
```
Edit `app/page.tsx`: remove `import { Footer } from "@/components/Footer";` and the `<Footer />` line.

- [ ] **Step 3: Verify + screenshot**

```bash
npm run lint && npm run build
npm run dev &
npx playwright screenshot --full-page --viewport-size=1440,900 --wait-for-timeout=3000 http://localhost:3000 /private/tmp/redesign-contact.png
```
Expected: dark island with green "CONTACT" eyebrow, marker "talk.", three bordered link rows, footer bar with `khant.` + credit + back-to-top. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add components/Contact.tsx app/page.tsx
git commit -m "feat(redesign): dark contact island with inline footer bar"
```

---

### Task 12: Full-page verification (light + dark) + admin regression

**Files:** none (verification only).

- [ ] **Step 1: Build + lint clean**

```bash
npm run lint && npm run build
```
Expected: exit 0; build route list still includes `/`, `/admin`, `/admin/*`, `/api/[section]`.

- [ ] **Step 2: Full-page screenshot, light mode**

```bash
npm run dev &
npx playwright screenshot --full-page --viewport-size=1440,900 --wait-for-timeout=4000 http://localhost:3000 /private/tmp/redesign-full-light.png
```
Verify against the Figma light frame: nav, hero, about, experience (Honda group threaded), projects (bottom-pinned links), skills (tinted AI card), education, hobbies (tilted), contact island.

- [ ] **Step 3: Full-page screenshot, dark mode**

Force dark by pre-seeding localStorage. Create `/private/tmp/shot-dark.mjs`:

```js
import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.addInitScript(() => localStorage.setItem("theme", "dark"));
await p.goto("http://localhost:3000", { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
await p.screenshot({ path: "/private/tmp/redesign-full-dark.png", fullPage: true });
await b.close();
```

Run: `node /private/tmp/shot-dark.mjs` (from the scratchpad dir where playwright is installed, or `cd` there). Verify: page bg is near-black `#131110`, cards `#1f1c19`, text light, green accents brighter, polaroid + lime markers unchanged, contact island reads as a *darker* block than the page.

- [ ] **Step 4: Admin regression, both themes**

```bash
npx playwright screenshot --viewport-size=1440,900 --wait-for-timeout=2500 http://localhost:3000/admin/projects /private/tmp/redesign-admin-light.png
node -e "process.exit(0)"  # (or reuse shot-dark.mjs pointed at /admin/projects)
```
Verify: admin sidebar, editors, save button all render; accent color is now green; no invisible text (contrast OK) in light and dark. Stop dev server.

- [ ] **Step 5: Confirm admin folders stayed gitignored**

```bash
git status --porcelain
```
Expected: only tracked files (`app/`, `components/*.tsx` excluding admin, `docs/`) appear — NO `app/api`, `app/admin`, `components/admin` entries.

- [ ] **Step 6: Final commit (if any stragglers)**

```bash
git add -A
git commit -m "chore(redesign): final light+dark verification" --allow-empty
```

---

## Self-Review

**Spec coverage:** hero/status/polaroid ✓ (T4), about ✓ (T5), experience grouping+org-led ✓ (T6), projects bento+pinned links ✓ (T7), skills tinted ✓ (T8), education ✓ (T9), hobbies tilted ✓ (T10), contact dark island ✓ (T11), tokens+font ✓ (T1), plain labels ✓ (SectionHeader, no numbering/dash), dark mode ✓ (T1 tokens + T12 verify), admin-safe ✓ (Global Constraints + T1/T12 checks).

**Placeholder scan:** none — every step has literal code/commands.

**Type/name consistency:** `SectionShell`/`SectionHeader`/`Tag`/`StatusChip`/`MarkerText` defined in T2, consumed identically T4–T11. Token utility names (`text-ink`, `text-muted`, `border-line`, `text-accent-deep`, `bg-tint`, `border-tint-line`, `bg-surface`, `bg-ink-island`, `text-ink-island-fg`) defined in T1 `@theme inline`, used consistently after. `text-ink` = primary text via `--color-ink: var(--ink-1)`; island uses `bg-ink-island`/`text-ink-island-fg`. `--color-ink-fg` is kept alive so the pre-Task-11 Contact/Footer stay readable during the restyle — no collision, no transient breakage.

**Admin-safety verified:** grep confirms `bg-ink`/`text-ink-fg` appear only in `Contact.tsx` + `Footer.tsx` (both handled in T11); admin uses only `cream/warm-white/charcoal/warm-gray/soft-border/lime` (all kept as aliases) and neither `blue` nor `font-display`. Font swap + blue retirement are safe.
