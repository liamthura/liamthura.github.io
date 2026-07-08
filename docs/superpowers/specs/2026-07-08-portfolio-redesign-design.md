# Portfolio Redesign — "Working Drawing" Direction (v2)

Date: 2026-07-08
Supersedes: the v1 "minimalist editorial" spec (previous session). That prototype was built in Figma but rejected — it looked almost identical to the live site. New reference: https://jdhruv.dev/ — playful, alive, youthful, still professional.
Deliverable: Figma design (file `8sh69lRXyRsNiHJpw6ztQG`), new frame(s) beside the old prototype. Implementation in the Next.js app is a separate later plan.

## Goal

Move from the calm cream/serif editorial look to a design with visible energy. The vibe target is **consultant / IT manager with taste** — explicitly NOT "big coder": no monospace fonts, no terminal aesthetics.

## Reference analysis (jdhruv.dev)

Its playfulness comes from the *frame*, not the content: visible column hairlines running full page height, dot-grid and diagonal-hatch texture bands, crop marks, live widgets (status line, Spotify last-played, view counter), cartoon avatar, playful project cover art — all on a near-monochrome canvas. Content itself stays serious. That trick carries over.

## Decisions (user-confirmed)

- **Color**: monochrome + one accent — signal green, evolved from the site's existing lime/sage heritage. No multi-color pops.
- **Structure**: single page, all CMS sections: hero, about, experience, projects, skills, education, hobbies, contact/footer.
- **Live widgets**: status line only (`● writing my dissertation · Newcastle, UK`). No Spotify/GitHub/view counter.
- **Avatar**: real photo in a playful sticker frame — thick white border, slight rotation, tape detail. (Good for recruiters; energy still goes up.)
- **Fonts**: **Bricolage Grotesque** (display) + **Plus Jakarta Sans** (body). All labels, dates, tags and section indices are letterspaced uppercase Plus Jakarta — "strategy deck", not "terminal". Fraunces and any mono are out.

## Visual system

- Canvas: paper white `#FAFAF7`; ink text `#1C1917`; hairlines `#E5E1D8`.
- Structural rules at both content-column edges, full page height. Dot-grid texture band in the hero. Diagonal-hatch divider strips between sections. Crop marks at section corners.
- Accent signal green `~#00A05C`: links, status dot, active states, section indices; pale green tint for washes; a lime marker-stroke highlight behind "actually" in the hero headline (replaces the current italic-serif treatment).
- Section headers: large Bricolage title + uppercase letterspaced index (`01 — ABOUT`).
- Projects: bento grid, cover placeholders, uppercase status chips, bordered tag chips, `Live ↗ · GitHub` footer row per card.
- Experience: timeline — uppercase date column, hairline separators, accent dot markers.
- Contact/footer: keeps the always-dark ink surface, accented in green.
- Dark mode: after light-mode approval.

## Refinements (user-directed, after first build)

- Project card link rows (`LIVE ↗ / GITHUB ↗`) pin to the card bottom via flexible spacer, aligning across uneven bento cards.
- Section eyebrow labels are plain (`ABOUT`, `EXPERIENCE`, …) — no numbering, no em dashes.
- Experience rows: dates alone in a 190px left column; org name is a bold green uppercase eyebrow ABOVE the role title. Consecutive roles at the same org group under one org eyebrow with a vertical thread — filled green dot for current role, hollow dot for past (prototyped with the placeholder "Test" Honda entry). Grouping derives from consecutive same-`company` entries in `experience.json` at render time; no schema change.
- Part-time jobs (Lane 7, Mantra) live in a compact "Meanwhile, paying the bills" sub-block.

## Dark mode (built as second frame)

Value remap, light → dark: paper `#FAFAF7→#131110` (page), white card `→#1F1C19`, ink text `→#F3F1EC`, muted `→#A8A29A`, hairline `→#332F2B`, deep green `→#4AC78C`, accent `→#1CBA73`, green tint `→#1B2A22`, cover placeholder `→#292622`.
Deliberate exceptions: polaroid sticker + tape stay white; lime markers stay lime with dark text; primary button inverts (light fill / dark text); Contact section keeps its `#1C1917` ink surface, which now reads as a slightly *lighter* island against the darker page.

## Content

All copy from `public/content/*.json` — already honest and conversational; no rewriting in scope. Design-level curation only: junk "Test" experience entry reused as the multi-role prototype, long descriptions trimmed, 10 projects curated into featured bento + "Also on the list" rows.
