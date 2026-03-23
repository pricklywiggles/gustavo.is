# F2: Introduction Section — Design Decisions

## Layout

**Structure:** `h-screen flex flex-col` — top 2/3 (`flex-2`) for text, bottom 1/3 (`flex-1`) for photo strip. The split feels natural: text is the hero content, photos are the supporting act below it.

**Background:** `bg-ground-4` (darkest earth tone, `oklch(0.4572 0.0543 59.52)`) — makes the section feel grounded and distinct from the hero above.

## Text Animation

**Mechanic:** "I'm [subject] with [predicate]" — "I'm" and "with" are static cream (`--color-sky-1`), the dynamic lines are warm orange (`--color-sky-3`).

**Slide structure:** Each dynamic span is rendered as a `block` in a shared `relative` container. Slide 0 is `position: relative` (gives the container its natural height); slides 1+ are `absolute inset-x-0 top-0` (overlay without affecting layout height). No `overflow-hidden` on the container — it was tried but clips the scale animation, creating a visible horizontal cut line.

**GSAP timeline phases:**
1. Slow upward drift (`y: -24, ease: none, 0.6 duration`) — the viewer feels the text "wanting" to leave
2. Fast exit (`y: -120, opacity: 0, scale: 1.1, power3.in`) — expands slightly as it evaporates
3. Snap-in (`y: 0, opacity: 1, scale: 1, power4.out`) — enters from below at `scale: 0.94`, lands with weight

**Transform origin:** `gsap.set([...subjects, ...predicates], { transformOrigin: 'left center' })` — prevents leftward drift during scale since text is left-aligned. Default center origin would push the left edge left as the element grows.

**Scroll snap:** `snap: { snapTo: 0.5, duration: { min: 0.2, max: 0.5 } }` — commits to the nearest slide at the midpoint, so users never land in a between-state.

## Photo Strip

**String:** SVG quadratic bezier `M 0,3 Q 50,31 100,3` with `preserveAspectRatio="none"` + `vectorEffect="non-scaling-stroke"` so the stroke width stays 2px at all viewport widths. `SAG_PX = 18` gives a realistic weight-sag.

**Clothespin placement:** `computeStringOffsets(n)` derives per-card `marginTop` from the bezier formula: `y(p) = STRING_Y0 + 4 * SAG_PX * p * (1-p)` where `p = (2i+1)/(2n)` for `justify-around` layout. This makes each clothespin top mathematically touch the curve.

**Card tilt:** `ALL_ROTATIONS = [-3, 1.5, -2.5, 2, -1, 3]` — hand-placed feel. GSAP owns the rotation (via `gsap.set(card, { rotation, transformOrigin: 'top center' })`) rather than inline CSS `transform`, so x-translation animations compose cleanly on the same transform matrix.

**Photos:** `next/image` with explicit `width={407} height={640}` (actual polaroid dimensions) + `h-auto` — preserves the natural portrait aspect ratio without a sized wrapper. CSS `drop-shadow` (traces image outline) rather than `box-shadow` (bounding box) so the shadow follows the polaroid's white border edge.

## Photo Transition Animation

**Mechanic:** On each slide transition, outgoing cards stagger-slide to `x: 500` (`power2.in`) while incoming cards enter from `x: -500` to `x: 0` (`power3.out`). Stagger is `0.03s` — snappy cascade.

**All slide rows rendered:** All three slides' photo rows are rendered as `absolute inset-0` overlays in the strip. Slides 1+ start at `x: -500, opacity: 0` via `gsap.set`. The strip has `overflow-hidden` to clip off-screen cards.

## Responsive Card Counts

**Counts:** 4 (mobile < 640) / 5 (tablet < 768) / 6 (desktop). Six photos per slide in `SLIDES` data to cover the maximum.

**GSAP single-init:** `useState(6)` matches the desktop default so `useGSAP` runs exactly once on desktop. On smaller screens, `useEffect` changes `cardCount` after mount — but `useGSAP` has no `cardCount` dependency, so it never rebuilds. The extra unmounted cards are silently skipped by GSAP (animating removed DOM nodes is a no-op). This avoids ScrollTrigger pin corruption from a teardown/rebuild cycle.

## Font

**Bricolage Grotesque** replaced Wotfard as the site-wide sans font. It's a variable Google font (`axes: ['wdth']`) — warm, playful, refined enough for both display sizes and body/blog text. Loaded via `next/font/google` with `variable: '--font-bricolage-grotesque'`.
