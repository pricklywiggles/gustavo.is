---
target: return header over intro + intro text side
total_score: 35
p0_count: 1
p1_count: 2
timestamp: 2026-07-21T23-20-31Z
slug: src-components-landing-intro-tsx
---
# Critique: return header over intro + intro text side (2026-07-21)

Method: dual-agent. Score 35/40 (Good). Measured: bar-vs-section 1.06:1 (sand-haze/90 over pale-dune); text contrast 12.09:1; detector 0 static findings.

## Priority Issues
- [P0] Return header over pale-dune must go dark: SURFACE_THEMES["pale-dune"] -> bg-dusk-earth/90, text-first-light, pill bg-canyon-brown (bar-vs-section 4.83:1, labels 5.72:1). NOT canyon-brown bar (3.8:1 AA fail). Also fixes pale-dune/first-light bars rendering identically, and hides headline ghosting.
- [P1] Light-bar translucency recipe smudges dark display type through backdrop-blur-md at /90; change light recipe to /95 + backdrop-blur-lg (or + backdrop-saturate-150).
- [P1] Copy sentence two: "AI powered" missing hyphen; double-and chain; "everything from X to Y" states breadth (PRODUCT.md forbids); working/worked repetition. Suggested: "I'm a software engineer in Los Angeles — 26 years in tech. I've shipped Microsoft Office features, AI-powered health apps, and the agents behind them. Most days you can find me pair programming with my dog Kiwi."
- [P2] Identity line "software engineer" undersells product/QA/program/engineering range; e.g. "26 years across product, quality, and code."
- [P3] Display token drift: DESIGN.md frontmatter (600, clamp->4rem, 1.05) vs prose (700) vs code (700, clamp->3.5rem, 1.08). Sync spec to render.

## Personas
- Jordan: smudged bar at trust moment; no next action at intro end.
- Casey: bar invisible in glare; webm-only video, no poster/mp4 fallback risk on older iOS.

## Minor
- dusk-earth theme's canyon-brown/90 bar ~4.0:1 borderline; darken while touching map.
- Hero vh/vw/video-rect captured at mount; resize mis-clips until reload; invalidateOnRefresh eventually.
- Return header can appear during blob reveal (threshold vh+64 < 2vh); consider suppressing until reveal done.
- video preload="auto" -> "metadata".

## Questions
1. Dark bar everywhere instead of adaptive?
2. Should intro carry a quiet ask ("say hello ->")?
3. Could the Display line do one degree more work?
