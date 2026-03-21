# Design Decisions

Captured from the WS-HERO experimentation session. These decisions inform WS4 (Design System) and everything that follows.

---

## Vibe

Warm desert sunset at dusk. Retro-pixel lego character standing on layered ground bands looking toward the horizon. Animations are scroll-driven and deliberate — nothing gratuitous. The overall feeling is warm, personal, and a little playful without being loud.

---

## Color Palette

Derived from the parallax hero scene. These are the raw values; WS4 will formalize them into semantic tokens.

### Sky (top → horizon)
| Token | Hex | Description |
|-------|-----|-------------|
| sky-1 | `#FAE8B8` | Pale golden — zenith |
| sky-2 | `#F0C08A` | Warm peach/amber — mid sky |
| sky-3 | `#F4935A` | Warm orange — near horizon |

### Sun
| Token | Hex | Description |
|-------|-----|-------------|
| sun | `#FFD166` | Golden yellow |

### Ground (horizon → floor)
| Token | Hex | Description |
|-------|-----|-------------|
| ground-1 | `#C9B89A` | Light sand/tan — nearest horizon |
| ground-2 | `#AE9470` | Medium earth |
| ground-3 | `#8E7050` | Warm brown |
| ground-4 | `#6E5038` | Dark earth — floor |

### Header
- Background: `rgba(250, 232, 184, 0.7)` (sky-1 at 70% opacity)
- Gradient: solid amber top → transparent bottom edge (85% stop)
- Backdrop blur: `blur(14px)`

Dark mode palette is TBD — will be derived in WS4.

---

## Typography

| Role | Font | Variable |
|------|------|----------|
| Display / header name | Waves Signal | `--font-waves-signal` |
| Body / UI / nav | Wotfard | `--font-wotfard` |
| Code / mono | Basier Circle Mono | `--font-basier-mono` |
| Available / unused | Pixel Robot | `--font-pixel-robot` |
| Available / unused | Archia | `--font-archia` |
| Available / unused | Indie Flower | `--font-indie-flower` |

All fonts are registered as CSS variables via `next/font/local` in `src/fonts/fonts.ts` and injected on `<body>` in `src/app/layout.tsx`.

---

## Animation

**Library choice:** GSAP + ScrollTrigger for all scroll-driven animations. Motion (framer-motion) available for component-level animations (entrance, hover, layout) where scroll-linking isn't needed.

**Patterns established in the hero:**

- Parallax via `data-parallax` attribute + `querySelectorAll` loop — keeps markup clean, factors live in a single `PARALLAX` constant
- Scrubbed tweens use `trigger: 'body'` with pixel offsets (`top+=${px} top`) rather than element-based triggers — avoids sticky/fixed positioning complications
- `onUpdate` (not plain scrub) for opacity — gives frame-accurate progress tracking
- `back.out(N)` ease for entrances with overshoot bounce; `back.in(N)` for exits
- Stagger via `{ each: N, from: 'start'|'end' }` object form
- **Freeze pattern:** when animations should lock at final state, call `scrollTrigger.kill()` (not `tween.kill()`) then `gsap.set()` to hard-write values. Triggered via a point `ScrollTrigger` using `onEnter` (not `onLeave` — `onLeave` requires an `end` to fire).

**Reduced motion:** all GSAP blocks check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and skip animation, setting final visible state directly.

---

## Hero Component (`ParallaxHero`)

- `200vh` wrapper — 100vh sticky scene + 100vh scroll space
- Scene is `position: sticky; top: 0; overflow: hidden`
- 3 sky bands + sun + 4 ground bands, each `height: 200%` so parallax never exposes a bottom edge
- Character (`lego-hero.png`) anchored via `bottom` percentage to ground-3 top edge — no pixel math needed
- Character and sun both shrink to near-zero after convergence point (`CONVERGENCE_PROGRESS = 0.55`)
- Character `transformOrigin: 'bottom left'` keeps feet on ground as it scales
- Sun `transformOrigin: 'center center'`

Key constants live at the top of the file and are meant to be tuned freely:
`PARALLAX`, `COLORS`, `HORIZON_PCT`, `SKY_TOPS`, `GROUND_TOPS`, `CONVERGENCE_PROGRESS`, `SHRINK_SCALE`

---

## Header Component (`SiteHeader`)

- Fixed bar, `h-15` (60px) mobile / `h-20` (80px) desktop
- Starts invisible (`opacity: 0`) and fades in over the first 200px of scroll
- Name "Gustavo Gallegos" in Waves Signal, split into individual `<span class="letter inline-block">` elements
- Letters animate in staggered left-to-right (scale 0→1 + opacity, `back.out(2)`, scrubbed over 800px)
- Letters 1–15 (all except first G) exit staggered right-to-left at end of hero (`back.in(2)`)
- Nav links (Blog, DummyLink, LinkedIn, GitHub) fade in with slight y drift over last 200px of hero
- LinkedIn and GitHub use inline SVG — lucide-react brand icons are deprecated (removed in v1.0), simple-icons recommended for brand logos
- All animations freeze permanently once scroll passes `heroEnd` (200vh): ScrollTriggers killed via `scrollTrigger.kill()`, final state hard-set via `gsap.set()`

---

## Decisions Still Open (for WS4)

- Dark mode color palette
- Semantic token naming (`--color-bg`, `--color-surface`, `--color-accent`, etc.)
- Whether to use shadcn/ui or go fully custom
- Actual GitHub and LinkedIn URLs (currently placeholders in `SiteHeader`)
- What "DummyLink" becomes
