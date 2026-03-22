# F1: Navigation — Design Decisions

## Desktop Nav

**Final link set:** Blog, DummyLink (placeholder — to be replaced once later features land), Contact (mail icon), LinkedIn, GitHub.

**Hover state:** Warm sand pill (`bg-sky-2/65`) that blooms in from 90% scale using CSS `group-hover` with `scale-90 → scale-100` + opacity transition. `rounded-full` since it wraps tightly around text/icon. No underlines — considered dated.

**Icon links** (Contact, LinkedIn, GitHub): icon-only with `aria-label`, no visible text. Icons get a single shake animation on hover via `useAnimation` + `onHoverStart/onHoverEnd` — plays once then snaps back in 100ms on exit. `whileHover` keyframes were tried first but got stuck mid-frame on quick exit.

**GSAP scroll integration:** Desktop nav fades in (`opacity 0 → 1, y -8 → 0`) as the hero exits the viewport, driven by ScrollTrigger. After crossing `heroEnd`, all ScrollTriggers are killed and final values are locked with `gsap.set`.

## Mobile Nav

**Trigger:** Hamburger (Menu icon) in header, always z-50. Icon swaps to X on open with a 15ms rotation via Motion AnimatePresence `mode="wait"`.

**Open animation:** Radial bloom using `clip-path: circle()` expanding from the hamburger position (`calc(100% - 34px) 30px`) to `circle(170%)`. Duration 0.45s, custom cubic bezier `[0.4, 0, 0.15, 1]`. Overlay is z-40, header stays z-50 so the close button is always accessible.

**Link stagger:** GSAP imperative stagger (`fromTo` with `stagger: 0.08, delay: 0.25`) triggered via `useEffect` when `mobileOpen` becomes true. Motion variants were tried but produced a reliable flicker after the stagger completed — caused by Motion having no visual property to hold onto in the container variant state. GSAP's imperative model avoids this entirely.

**Link hover:** Full-width rounded pill (`-inset-x-4, -inset-y-2, rounded-xl`) using same `bg-sky-2/65` color as desktop. Content wrapped in `relative z-10` to stay above the pill.

**Footer:** "Made with ❤️ in Los Angeles" with a beating heart — `motion.span` animating `scale: [1, 1.4, 1]` on infinite repeat with 1.2s delay between beats. Fades in after bloom completes (`delay: 0.45`).

**Accessibility:** Body scroll locked when open (`overflow: hidden`), Escape key closes menu, `aria-expanded` on toggle button. Full WCAG AA audit done post-implementation — see Accessibility section below.

## Rejected Approaches

- Sheet/drawer slide-in: too generic, doesn't fit the desert aesthetic
- Motion `staggerChildren` variants for link entrance: reliable post-animation flicker that couldn't be resolved
- Per-link Motion `delay` props: same flicker issue
- `whileHover` for icon shake: animation gets stuck on a frame if cursor exits quickly

## Accessibility (PR #18)

WCAG AA audit run after F1 merged. All critical issues fixed:

- **Focus trap:** Tab/Shift+Tab cycles within the mobile overlay while open
- **Focus return:** `closeMenu()` helper calls `hamburgerRef.current?.focus()` on every close path
- **Skip link:** `<a href="#main-content">` as first focusable element; `<main id="main-content">` wraps `{children}` in `layout.tsx`
- **`aria-controls`:** Hamburger has `aria-controls="mobile-nav"`; overlay has `role="dialog" aria-modal="true" aria-label="Navigation menu"`
- **Invisible nav in tab order (M3/M4):** Desktop nav starts with `inert` attribute, removed by GSAP imperatively at three points: `navTween` `onEnter`, freeze `onEnter`, and reduced-motion path
- **Reduced motion (M5/M6):** `ShakeIcon` uses `useReducedMotion()` to skip animation; `HeartFooter` component passes `animate={}` when reduced motion is preferred

**Deferred:**
- M8: `DummyLink` with `href="#"` — deferred until final nav links are decided
- Minor: hamburger tap target size (~30px, below 44px ideal), focus ring contrast at 50% opacity, footer text at `opacity: 0.4`

## Open Items

- `DummyLink` is a placeholder — replace once F2–F5 clarify final page structure
