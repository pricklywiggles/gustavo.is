# Work-history section: architecture and pitfalls

Read this before changing anything in `src/components/landing/`. It records
how the scroll story works, the invariants that keep it working, and the
bugs already paid for once. Verification recipes are at the bottom; use
them after any change here.

## What this section is

One pinned, scrubbed GSAP master timeline (~33 viewport-heights) playing:
the "Play + Purpose = Work" equation (right-aligned terms, a drawn rule,
then the result taking the ink drift), then three city chapters (Seattle,
San Francisco, Los Angeles), each with a layer-cascade panorama build,
a parallax breath
that opens a HUD band, a year hero that docks top-right, instrument
entrances, and a time scrub driving year/stint/users readouts; chapters
are joined by HUD-out/scene-out transitions, and the story ends with a
dusk outro (band closes, sun sets, depth-staggered dim to dusk-ink).
`?chapter=N` previews a single city through the identical code path.

## File map

Components sit in per-component folders (`work-history/work-history.tsx`);
the shared modules (`scroll-phases.ts`, `panorama-phases.ts`,
`work-history-data.ts`, `use-below-sm.ts`) stay at this folder's root.
Bullets name the file.

- `work-history.tsx`: orchestrator. `storyPhases()` builds the phase list
  (ids namespaced per chapter, e.g. `scrub@1`), the useGSAP block wires
  every builder, one shared readout state follows whichever chapter's
  scrub holds the playhead. Pacing knobs: `SCRUB_VH_PER_YEAR`,
  `HUD_OUT_VH`, `SCENE_OUT_VH`.
- `scroll-phases.ts`: `resolvePhases()`, sequential cursor plus
  `with`/`offset` anchoring. Reordering the story is reordering the list.
- `panorama-phases.ts`: all timeline builders (cascade, year cues,
  parallax, curtain, scene exit, outro close, dusk, sunset, cloud sway,
  vessels). Scroll-driven work writes into the master timeline;
  time-based ambience (sway, vessels) runs on its own clock.
- `panorama-scene.tsx`: presentational renderer. Conventions:
  `[data-pano-layer]` in config order, `[data-pano-sway]` wrappers for
  ambient clouds, `[data-pano-surface]` curtain, `[data-pano-sun-track]`
  wrapping `[data-pano-sun]`, `[data-pano-veil]` on the last chapter.
- `work-history-data.ts`: ALL per-city config and career data. Layer
  positions are template-matched from the author's reference screenshots;
  never round or "tidy" them (see recipe below).
- `work-history-hud.tsx`: instruments (year + role, ruler, stint bar,
  counter). Purely presentational; GSAP drives via `data-hud-*` hooks.
- `city-ledger.tsx`: the reduced-motion reading of a chapter (companies,
  positions, products, years) rendered under each static panorama;
  `display:none` under motion. See the reduced-motion section.
- `odometer-number.tsx` / `animated-number.tsx`: see counter section.

## Invariants (break these and it silently falls apart)

1. Timeline seconds are viewport-heights. Phase offsets read as scroll
   distances; the pin length is `phase.total * innerHeight`.
2. Function-based tween values re-measure during ScrollTrigger refresh
   WHILE PINS ARE REVERTED. Measure against the section or stage rect,
   never the viewport, or elements fly thousands of pixels on refresh.
3. Every scroll-driven motion must be a declarative tween on the master
   timeline. Never drive transforms imperatively (gsap.set inside an
   onUpdate): it works on the first forward pass and dies permanently
   after one scrub rewind. The sun's crown arc was rebuilt because of
   exactly this.
4. Two-library rule: GSAP owns scroll-driven transforms, Motion owns
   digit/component animation. Never both on the same property of the
   same element.
5. Scroll-to-React bridge: the scrub proxy pushes state ONLY when a
   quantized value changes (year int, stint index, users figure).
6. Each chapter owns its own PanoramaScene and HUD DOM. GSAP choreographs
   entrances/exits across chapters; React must never swap those nodes.
7. GSAP cannot interpolate `filter` from `none`: dimming uses
   fromTo brightness(1) to brightness(0) with `immediateRender: false`.
8. Tailwind preflight clamps `img` to `max-width: 100%`. Every pano layer
   needs `max-w-none` or wider-than-canvas strips silently pin at stage
   width and their configured width does nothing.
9. Sea level (per city): the layers touching the waterline/city-base
   plane carry NO parallax; layers z-above rise, z-below sink, and no
   riser may cross sea level. Cities where the front water cannot open
   enough band are `horizonLocked`: the page-surface curtain rises
   instead, and the band-clearance amplifier must stay disabled.
10. The sun is two nested elements: the track's y is the crown's line
    (the disc's top edge), the disc pairs swell and downward offset with
    the same ease, so the crown can never stall or rise while growing.
    Knobs live in `SunConfig` (`growthEase`, `growthStart`, `endScale`,
    `duskEndTop`); `duskEndTop` was derived from far-hill's crest
    (28.86% canvas) plus the swollen radius, re-derive if art moves.
11. The projects-to-landfall handoff never scrolls a starfield: the
    landfall section pulls itself up 200vh so its stage pins while the
    projects stage is still pinned, dissolves its sky over the canvas
    during the `fade` phase, and holds while the showcase (z-30, painted
    above the incoming stage) alone rides off. Change the projects
    section's spacers and you must re-derive the -mt and the fade/hold
    phase lengths together (see LandfallSection's overlap contract).
12. Load-time entrances (the hero's band/sun choreography) must not start
    until frames render steadily: animation clocks run on real time, and
    the post-hydration task storm (GSAP timeline builds, first
    ScrollTrigger refresh) can outlast a whole entrance, snapping it
    straight to its end state. Gate on `src/components/use-steady-frames.ts`; reuse it
    for any new mount-time animation here.
13. The server HTML carries each settled value and headline exactly once,
    as plain text. `OdometerNumber` renders its reels and `AnimatedLines`
    its aria-hidden `.split-char` copy only once `useMounted()`
    (`src/components/use-mounted.ts`, a `useSyncExternalStore` whose
    server snapshot is false) flips in the post-hydration re-render;
    client-only mounts read true at once. A mount-time layout effect
    (`useGSAP` runs in the hydration commit, before any child's
    re-render) therefore finds no `[data-reel]` or `.split-char` yet:
    target the line instead (the `Work` ink drift tweens
    `[data-quote-result]`) or keep the query inside a function-based
    value that GSAP evaluates later (`counterPoint`).

## iOS scroll smoothness: the hero's one clock and the projects overlay (FRA-185)

The hero is CSS sticky, not a GSAP pin, so the pin-reverted rules above
do not apply; these do. The rule behind all of them: desktop, Android,
and macOS Safari keep their pre-branch behavior exactly (`scrub: true`,
raw scroll samples, the video's shadow). Only iOS changes.

- The gate is a device test, `isIOSDevice()` in `src/lib/ios-device.ts`:
  touch plus an iPhone/iPad/iPod user agent, or a Macintosh one with more
  than one touch point (iPadOS 13+). Never a browser sniff: Safari and
  Chrome on iOS share WebKit's scroll reporting and take the same path.
  Evaluate it inside the `gsap.matchMedia` callbacks; it is false during
  SSR. Media-query gates (`hover: hover`, `pointer: coarse`,
  `ScrollTrigger.isTouch === 1`) were rejected: they sweep Android in.
- Scrub: `scrollScrub()` (`src/lib/scroll-scrub.ts`) is `true` everywhere
  and 0.25s on iOS, which reports scroll positions sparsely and sometimes
  wrongly (the touchmove bug ScrollTrigger works around), so each raw
  sample paints as a step. The hero, the intro headline, the projects
  rail, the landfall descent, and the vista resolve it at runtime (the
  descent was added after the phone showed the earth's swell and the
  cloud deck stepping; the vista rides the same stretch). `AnimatedLines`
  defaults to `true` in scrub and pin modes; the intro is its only
  consumer passing `scrub`, and a test pins that. Work history stays on
  `scrub: true`: it was never reported stepping, and the gate makes the
  catch-up a one-line, desktop-neutral change there if it ever is.
  Progress-driven side effects (video cue, sheet visibility) read the raw
  trigger progress, which is the real scroll.
- Viewport height comes from the scene's `h-screen` box (`metrics.vh`),
  and the intro measures its own section the same way. `innerHeight` on
  iOS Safari is the toolbar-dependent visual height: small at the top of
  the page, larger once the bar collapses, while every `vh` in the CSS is
  the large viewport. Pacing scrubs by `innerHeight` desynced them from
  the geometry they drive. GSAP already ignores the bar's height-only
  resize on touch-only devices (`ignoreMobileResize` defaults to
  `isTouch === 1`), so no refresh fires mid-gesture; the mismatch was
  the number itself.
- One clock on iOS. Off iOS the sheet scrolls natively after its 1vh
  stick and the hole's timeline (133.333vh to 233.333vh) assigns
  `hole.yOff` from raw progress; both are the raw scroll, so they agree.
  With a numeric scrub they cannot: the hole's growth trails the
  catch-up while `yOff` follows the finger, and no scrub value fixes it
  (smoothing `yOff` instead drifts the reveal off the video by ~250px at
  flick speed). So on iOS the motion callback turns the `display:
  contents` carrier around the sheet into a sticky element of
  `CARRIER_VH` (106.667vh; stick distance exactly `REVEAL_COMPLETE_VH`)
  and makes the sheet its absolute child, and one scrubbed timeline from
  100vh to 233.333vh moves the sheet's `y` by -133.333vh, climbs `yOff`
  by +133.333vh (path coordinates are sheet-local), and grows the hole
  from 33.333vh in. The sheet's rect follows the native sheet's line at
  every scroll position (probed to 0.001vh); at completion its remainder
  is exactly the carrier's box, so the carrier's native release continues
  the line. The styles are `gsap.set` inside the context so a
  reduced-motion flip reverts them. Do not extend `--hero-pin` to keep
  the 240vh sheet stuck (page length and every downstream anchor change)
  and do not raise the scrub.
- Clip writes: `hero/hero-hole.ts` owns the path and a per-frame writer
  (`createClipWriter`). Four callers (scroll, growth, sway, breath)
  collapse to one write per frame; none while the path is unchanged (the
  closed hole's frame-only path is constant), none while the sheet is
  hidden past the reveal (the sway and breath tweens pause with it and
  resume with one synchronous write), none after disposal. Disposal is a
  flag: `gsap.ticker.add(fn, true)` returns a wrapper that
  `ticker.remove(fn)` never matches. Setup and refresh writes stay
  synchronous: a clip referencing an empty path hides the sheet for a
  frame.
- The intro video's drop shadow stays by default; a layout effect sets
  `filter: none` on iOS devices before first paint. A filter on a playing
  video is re-rendered every video frame, and on phones that ran under
  the hole's per-frame clip raster.
- Projects headline: native layout. `WarpStarfieldOverlay` (headline,
  astronaut, cue) is an absolute track 200vh into the section, 125vh
  tall, holding a sticky `h-screen` screen: the page pins it for 25vh at
  the theater's lock and releases it at page speed, gone by 325vh where
  the showcase arrives. That is the piecewise path (`200vh - x`, `0`,
  `225vh - x`) the starfield used to translate every frame from a scroll
  sample, which steps on iOS and reads as a spring with any filter on it.
  The starfield keeps the canvas and UFO, reveals the overlay through
  `[data-warp-word]`, `[data-warp-astronaut]` and `[data-scroll-hint]`,
  and measures word rests relative to the canvas (the two screens
  coincide at the lock, where the flight happens). The scroll sample
  survives only for the star camera (`restCamY`), low-passed at 80ms on
  iOS. A 325vh track from the section's top was rejected: it pins the
  headline through the seed phase. The section keys both halves on a
  live reduced-motion flip so neither keeps stale inline styles.
- If phones still step after all this, the residual is the
  native-scroll/JS boundary, not geometry. Evaluate
  `ScrollTrigger.normalizeScroll(true)` on a throwaway preview branch,
  never as a query flag in the merged tree: it is an experimental
  page-wide input takeover (2.8s default momentum, disables CSS smooth
  scrolling) that must be reconciled with the theater's `window.scrollTo`
  clamp, MotionAnchor, the header hold, the mobile menu, and the contact
  dialog. Do not add per-element lag instead.

## Mobile (below sm) adaptations

All of these are CSS-gated (custom properties consumed by static max-sm:
classes): no JS observes the breakpoint except the counter's odometer
mount, so there is nothing to hydrate or refresh on a viewport flip.

- Panorama crop: phones see ~30% of the canvas. Each city's
  `mobileFocusX` (work-history-data.ts) picks the canvas x-fraction the
  phone centers on; 0.5 is the desktop-identical center. The offset
  (`panoFocusLeft` in panorama-scene.tsx) clamps to the stage's real
  coverage slack, so any value degrades to an edge-flush crop instead
  of exposing canvas. Transforms stay GSAP's; the stage positions via
  `left` only, which keeps `offsetLeft` truthful for the vessels.
- Per-layer repositioning: a PanoramaLayer may carry `mobile`
  (left/top/width strings; the LA Hollywood sign uses it). The layer
  must define all three axes in `style`. Phase builders that measure
  config (curtain fill top, sway ambient width) always read the
  desktop values.
- The sun: `SunConfig.mobile` (left/top, canvas %) moves the RESTING
  disc below sm. Descent/swell deltas still come from the desktop
  numbers, so the whole arc translates rigidly; scrub-end values have
  no mobile knobs yet, and size is deliberately excluded (the crown
  arc derives its swell-dive pairing from the desktop size).
- Vessels: sail-in entry points derive from the stage's real left edge
  (`vesselSailStartPct`), never from an assumed centered stage.
- Users counter: the bar's logo boxes shrink below sm (SE 375px floor)
  and the bar's counter slot hides; a compact `data-hud-counter`
  instrument takes the top-left corner, sharing the role caption's
  entrance tween and exiting with the whole HUD. Both counter shells
  stay mounted as stable GSAP targets; only the active one mounts the
  odometer (use-below-sm.ts), so three reel loops run, not six.
- Landfall clouds: each SKY_CLOUDS entry pairs `box` with a `mobileBox`
  of max-sm: overrides, derived from the desktop values and then
  tuned. Retune phones by editing mobileBox only; a test guards the
  max-sm: prefixes.

## Reduced motion (the static edition)

`prefers-reduced-motion: reduce` gets a designed still page, not a disabled
one (DESIGN.md). The hero, intro, work history, landfall and vista put
every scroll tween under
`gsap.matchMedia("(prefers-reduced-motion: no-preference)")`, so they
build nothing; the projects section keeps its ScrollTriggers (index
scrub, rail, overflow toggle: direct feedback on the reader's own scroll)
and gates only the theater lock on the live query. The layout differences
are CSS only (`motion-reduce:` / `motion-safe:` classes), so the server
HTML is one DOM shape for both.

- Hero: track `h-[200vh]`, sheet wrapper `h-screen`, sheet
  `sticky h-screen`. With no stick distance the sheet scrolls away from
  the first pixel and uncovers the sticky intro beneath; at 1vh the intro
  is fully revealed and leaves with the page. Its own reveals are
  matchMedia-gated and rest visible, and its scene video seeks to its
  last frame once metadata loads (the finished room, not the empty one);
  a flip back to motion rewinds it for the hero's play cue.
- Projects: the 225vh spacer exists to park the showcase a quarter
  viewport past the fold at the theater lock, so it is `motion-reduce:h-0`,
  and the overlay's track drops its `motion-safe:` offset and height to
  sit at the section's top with zero stick (the seed scrub's two-viewport
  entry read as two empty screens before the headline). The headline
  screen hands straight to the showcase, whose 700vh scrub still pins one
  project per viewport.
- Work history: the section is `h-auto`. After the equation screen each
  `PanoramaScene` is one in-flow screen (`motion-reduce:relative
  motion-reduce:h-screen`; layers at their authored rest are the finished
  composite) followed by that chapter's `CityLedger` (data from
  `src/lib/career.ts`'s `employmentHistory()`, computed over the full
  CHAPTERS so `?chapter=N` previews keep "present" right). Every HUD
  wrapper is `motion-reduce:hidden` but stays mounted (invariant 6). The
  ledgers are `hidden motion-reduce:block`, so the motion layout's
  stacking and the 54-layer order never change.
- Landfall: `[data-descent]` is `h-auto` and holds two in-flow screens,
  the stage (`motion-reduce:relative`, never static, which would drop it as
  the containing block and let the station, earth and clouds resolve
  against the two-screen descent unclipped: stars, station) and
  `[data-descent-still]` (`hidden motion-reduce:block`: gradient sky,
  thinning stars, the limb's glow), then the vista follows. The still
  lives INSIDE the descent on purpose: the descent's scrub anchor then
  spans both screens, so a resize while viewing the still keeps its
  place. Two shapes already failed. A still outside the descent with no
  anchor falls back to the one-screen descent on resize (extent floors
  to 1px, restores to its top). A still outside with its own zero-height
  flow anchor breaks flips: `measure()` sorts anchors by top, the vista's
  `-mt-[2px]` tuck puts its top 2px above the zero-height still, so the
  still sorts last and wins selection for the whole vista, and a flip
  back landed one viewport low. Never hang `data-motion-anchor` on a
  `display:none` node either (a zero rect at the current scrollY wins).
  None of the timeline's `data-descent-*` / `data-star-layer` /
  `data-cloud-slot` hooks may appear inside the still.
- The header hold (`data-header-hold`) is off under reduced motion
  (site-header.tsx): no year readout to protect, and the stack is many
  screens tall.
- Contact dialog: popup, backdrop and content exits run at duration 0, so
  AnimatePresence unmounts on the next frame instead of holding the box
  for the 0.3s color handback.

Hook rule (FRA-170, then the sweep): landing-path components read the
preference through `useReducedMotionLive`
(`src/components/use-reduced-motion-live.ts`), never Motion's
`useReducedMotion`, which is true on a reduced client's FIRST render while
the server rendered false (the odometer's reel tree vs plain text was the
thrown text mismatch; nulled variants and a dropped `whileTap` tabindex
were the attribute ones). The live hook is false through SSR and
hydration, then flips in a post-hydration re-render: one painted frame of
the motion DOM shape is possible, so reduced-only DOM must be CSS-gated
and whatever the hook toggles must read right in both shapes.
`src/test/hydrate-reduced.tsx` server-renders a tree and hydrates it as a
reduced client; the `*.hydration.test.tsx` files pin zero mismatches and
a server HTML with no `data-reel` or `split-char` (invariant 13)
(React serializes `muted=""` but jsdom never initializes the property from
the parsed attribute, so the helper sets it before hydrating). The helper
proves the post-hydration flip only: jsdom's window is present on its
"server" pass, so a swap back to Motion's snapshot hook would not show up
as a mismatch; `reduced-motion-hook.test.ts` pins that rule statically.

Headless recipe (Playwright context `{ reducedMotion: "reduce" }` against
the dev server, scrolls `behavior: "instant"`): zero `pageerror`s on load;
hero track 2vh and the sheet's top at -0.5vh once scrolled 0.5vh; the
intro video's `currentTime` at its duration; the projects section 8vh
with `[data-scroll-hint]` on screen at the section's top; three
scene roots of 1vh each followed by a ledger; `[data-hud-ruler]` rects at
zero height; the descent 2vh tall with the still filling its second
screen and the vista at its bottom (2px tuck); `[role="dialog"]` detached
within a couple of frames after Escape; the still still on screen after a
mid-still viewport resize; the landfall CTA heading at the same viewport y
across a flip to motion and back. Run the `no-preference` control too:
track 4.4vh, descent 10.75vh, ledgers and still `display: none`, rulers
tall.

## The users counter

- The counter is `OdometerNumber`: physical reels, one springed value,
  per-reel screen-speed cap (~2 rev/s). Low digits blur during fast
  scrubs, high digits stay honest, everything lands aligned at rest.
  `reelPosition()` carry math and `advanceReel()` are unit-tested.
- Server and hydration render the settled number as plain `tabular-nums`
  text (the same element the reduced branch returns); the reel tree
  mounts in the post-hydration re-render, born on the settled digits with
  no entrance (invariant 13). The phone HUD's handoff mounts a fresh
  odometer client-side, which reads mounted at once, so reels appear
  immediately there.
- Do NOT switch it to Motion's AnimateNumber: scrub values stride
  thousands per frame, and per-digit rolling sweeps the long way around
  whenever a middle digit decreases while the value rises.
- The year DOES use `AnimatedNumber` (AnimateNumber wrapper): unit ticks
  are its sweet spot. The wrapper computes `trend` from the last
  committed value because the library mutates a ref during render and
  StrictMode's double-render zeroes its direction.
- Totals are cumulative across cities: `carriedUsersBefore()` sums prior
  chapters' finals; changing any `usersReached` updates hand-offs and
  the finale automatically (unit tests pin 0 / 200M / 223M).

## Layer positioning: template matching, not eyeballing

The author composes each city precisely and expects exact reproduction;
eyeballed positions were rejected. Recovery recipe (used for SF and LA):

1. Get the composed reference screenshot (`~/Pictures/Screenshots`,
   filenames contain a narrow no-break space before AM/PM; glob with
   `*`). Reference may be the clean canvas or a design-tool window.
2. Calibrate scale/origin against a full-width layer; a selection box in
   the shot is a scale witness (box px / sprite px).
3. Match per layer with occlusion-aware SSD on the alpha-masked sprite;
   for buried layers use crown crops or a full-composite reconstruction
   hill-climb (per-layer SSD degenerates on occluded dark sprites).
4. Accept ~10-25 mean-abs-RGB residual (antialiasing). Verify in-page:
   every rendered rect must match config left/top/width exactly.
   sharp lives at `node_modules/.pnpm/sharp@*/node_modules/sharp`.

Findings this surfaced (do not "fix" them): layers cut by canvas edges,
off-canvas bleeds, per-layer scale (SF bridge-front 92.5%), waters ~1%
below bottom-flush. Watch the naming trap: the author names water planes
front-to-back; files are numbered back-to-front.

## Verification workflow (how every change here was proven)

- Dev preview: `localhost:3000/?chapter=N` (0 Seattle, 1 SF, 2 LA).
- Headless probes: Playwright via the sibling repo's install
  (`@playwright/test` in `~/repository/pricklywiggles/gustavo.is`), park
  the scrub at fractions of the pin-spacer and read computed styles or
  rects. Pin span = spacer height minus one viewport.
- The page uses smooth scrolling: probes MUST scroll with
  `behavior: "instant"` or dense sampling reads a stale position while
  reporting motion as frozen.
- After code changes, first probe run can race lazy images and Turbopack
  recompiles; warm once or rerun before trusting numbers. If the dev
  server serves stale code after edits: kill it, `rm -rf .next`, restart.
- Numbers beat screenshots: assert monotonicity/geometry from rects
  (e.g. the sun-crown sweep, sea-level pinning) rather than eyeballing.
- Probing anything below the projects section: the warp theater locks the
  page the first time its seed scrub completes, and its sim clock only
  runs while its stage is on screen, so repeated jump-past attempts can
  starve it forever. Park AT the lock position (projects section top plus
  2 viewports), wait for `[data-scroll-hint]` to reach opacity 1, then
  scroll freely.
- Transformed elements extend the document's scrollable overflow: a
  scroll-driven element translated below its layout bottom (the landfall
  bluff's entry offset) adds phantom scroll range and a bare-html strip
  at max scroll. Clip on the landfall SECTION (`overflow-y-clip`), not
  the vista or its sky block: the parallax planes settle above their
  layout spots, so a closer clip decapitates the clouds late in the
  entry. Clip does not break the stage's sticky pin.
- Never call `ScrollTrigger.refresh()` from an image `onLoad` in this
  section. The vista's lazy images arrive while the descent's cloud deck is
  still scrubbing (Chrome's lazy-load margin reaches them at roughly 8.4 to
  9.3vh into the descent), and a forced refresh there was a 73 to 130ms
  main-thread task: the only dropped frames in the whole handoff. Images
  with `width`/`height` attributes already reserve their box, so there is
  nothing to re-measure; if a load-time refresh is ever really needed, use
  `ScrollTrigger.refresh(true)`, which defers to scrollEnd mid-scroll.
- Live prefers-reduced-motion flips: MotionAnchor
  (`src/components/motion-anchor/motion-anchor.tsx`) re-anchors scroll across the
  motion-safe geometry collapse (~975vh in the descent alone). Contract:
  every top-level scroll region carries `data-motion-anchor`;
  GSAP-pinned sections are measured via their pin-spacer. Pitfalls
  already paid for: the browser clamps scrollY and fires that scroll
  event BEFORE MediaQueryList listeners run (scroll steps precede media
  evaluation in the rendering loop), so the pre-flip position must come
  from a history sample older than the flip frame, and that clamp
  sample must be purged or it poisons rapid follow-up flips; the flip
  then triggers a run of ScrollTrigger refreshes over several hundred
  ms (media refresh, pin re-measures, image loads), each restoring
  ScrollTrigger's stale recorded scroll, so the compensation stays
  pending and re-applies after every refresh until the dance goes
  quiet. Probe with Playwright's page.emulateMedia({reducedMotion})
  mid-session; assert the CTA heading's viewport position is preserved
  to the pixel across flip, flip back, and rapid triple flips.
- Window resizes reuse the same machinery with per-anchor semantics:
  the data-motion-anchor VALUE is "scrub" (vh-scaled scrub regions:
  hero, work-history, projects, the descent) or "flow" (normal-flow
  content: the vista, the site footer). On resize, scrub anchors
  preserve normalized progress through the region's scrollable extent
  and flow anchors preserve the pixel offset; preference flips stay
  pixel-mode everywhere. The burst's first gated resize event freezes
  the pre-resize world (anchor cache, filtered scroll history, and the
  OLD viewport height, which the fraction denominator must use; live
  innerHeight mid-burst mixes coordinate systems). Later events only
  re-arm the settle and fallback timers. The gate mirrors
  ScrollTrigger's own exactly (touch-only browsers skip
  unchanged-width height deltas within 25%, base dims re-based only on
  orientation change), so pending arms only when gsap's refresh will
  come; a 500ms fallback applies anyway if it never does. Compensation
  never arms, and a pending resize never applies, while an input,
  textarea, or contenteditable is focused (mobile keyboards must not
  move the page, even when they open mid-burst). Crossing 767/768 fires
  gsap's media refresh BEFORE the window resize event, so the
  matchMediaInit listener also arms resize pending when cached
  viewport dims differ from live ones. After every apply the frozen
  basis is reset to the just-applied world, so interleaved flips and
  resizes resolve from the latest applied state, never the original
  one. The warp theater's scroll lock re-bases on refresh (the seed
  trigger's onRefresh assigns lockY to the refreshed end, then snaps
  to it); if MotionAnchor applies during a locked resize, the lock's
  clamp wins by design.

## Test-suite landmines

`vitest.setup.ts` is load-bearing: manual RTL cleanup (this RTL version
has no vitest auto-cleanup entrypoint), a `matchMedia` polyfill (jsdom
lacks it; ScrollTrigger needs it at registration), and an `afterAll` that
disables every registered ScrollTrigger instance (its 250ms sync interval
outliving jsdom crashes runs with "requestAnimationFrame is not defined";
blind `disable()` throws). Two instances exist in any file that uses
`hydrateReduced`: its `vi.resetModules()` re-registers a fresh
gsap/ScrollTrigger, and a dynamic import in `afterAll` only ever saw that
one, so the file's static instance leaked its interval into teardown (the
CI-only unhandled error on FRA-185). Tests that open the lazy contact
dialog preload `@/components/contact-dialog` in `beforeAll`: Vite's
transform of that chunk under load blew a 4s `findByRole` more than once. Async server
components cannot be tested in vitest; use E2E. The polyfill answers
`matches: false`, so tests run the motion paths; to exercise a reduced
branch mock `@/components/use-reduced-motion-live` (contact-dialog.test
does), or hydrate through `src/test/hydrate-reduced.tsx`.
