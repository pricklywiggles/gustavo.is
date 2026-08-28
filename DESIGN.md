---
name: gustavo.is
description: A warm, tactile, single-palette system built from a golden-hour horizon, spoken in two voices, Kitora for titles and Wotfard for sentences.
colors:
  dusk-earth: "oklch(0.4572 0.0543 59.52)"
  pale-dune: "oklch(0.9338 0.065 89.92)"
  amber-mirage: "oklch(0.8381 0.0889 69.43)"
  horizon-blaze: "oklch(0.7537 0.1378 49.92)"
  noon-sun: "oklch(0.8803 0.1348 86.06)"
  dune-tan: "oklch(0.7891 0.0452 81.82)"
  desert-clay: "oklch(0.681 0.0587 75.53)"
  canyon-brown: "oklch(0.5665 0.0595 67.97)"
  first-light: "oklch(0.9912 0.0069 88.64)"
  sand-haze: "oklch(0.9567 0.0333 88.06)"
  sand-line: "oklch(0.88 0.045 83)"
  dusk-ink: "oklch(0.2781 0.0296 256.85)"
  warning-ember: "oklch(0.577 0.245 27.325)"
  stratos: "oklch(0.36 0.09 258)"
  zenith-blue: "oklch(0.52 0.13 250)"
  day-sky: "oklch(0.8 0.075 235)"
  open-sea: "oklch(0.55 0.105 232)"
  deep-sea: "oklch(0.4 0.095 240)"
typography:
  display:
    fontFamily: "Kitora, Wotfard, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Kitora, Wotfard, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "normal"
  title:
    fontFamily: "Kitora, Wotfard, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  legend:
    fontFamily: "Kitora, Wotfard, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.01em"
  body:
    fontFamily: "Wotfard, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Wotfard, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.dusk-earth}"
    textColor: "{colors.first-light}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "oklch(0.4572 0.0543 59.52 / 85%)"
    textColor: "{colors.first-light}"
    rounded: "{rounded.lg}"
  button-secondary:
    backgroundColor: "{colors.pale-dune}"
    textColor: "{colors.dusk-earth}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "44px"
  input-default:
    backgroundColor: "{colors.first-light}"
    textColor: "{colors.dusk-ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "40px"
  link-dark:
    textColor: "{colors.noon-sun}"
    rounded: "{rounded.sm}"
  link-dark-hover:
    textColor: "{colors.sand-haze}"
    rounded: "{rounded.sm}"
  link-dark-focus:
    backgroundColor: "{colors.noon-sun}"
    textColor: "{colors.dusk-ink}"
    rounded: "{rounded.sm}"
  link-light:
    textColor: "{colors.dusk-earth}"
    rounded: "{rounded.sm}"
  link-light-hover:
    backgroundColor: "{colors.amber-mirage}"
    textColor: "{colors.dusk-ink}"
    rounded: "{rounded.sm}"
  link-light-focus:
    backgroundColor: "{colors.dusk-earth}"
    textColor: "{colors.first-light}"
    rounded: "{rounded.sm}"
---

# Design System: gustavo.is

## 1. Overview

**Creative North Star: "The Long Horizon"**

The system is built from one scene: a golden-hour desert horizon, sky bands parallaxing from pale dune-gold down through amber to a blazing near-horizon orange, a small Lego-avatar figure walking toward it. That scene is the strategic metaphor. A visitor scrolling the hero isn't watching decoration. They're watching the vantage point widen, the same way 26 years across product, QA, program management, and engineering widens what one person can see and do. The site never says this in words. It shows it, in the work, and lets the horizon carry the feeling.

Everything runs on a single warm palette (with one scoped cool exception, see the Cool Branch) and two typefaces with locked jobs: Kitora Bold for anything title-like, Wotfard for anything that reads as sentences. There is no light/dark toggle. Precision comes from restraint. Warmth and playfulness come from materiality, the Lego figure, the tactile "pressed" surfaces, never from decoration bolted onto an otherwise generic template.

This explicitly rejects the cookie-cutter developer-portfolio look: the generic centered hero, the identical icon-plus-heading project cards, the templated GitHub-README-as-website feel. Nothing here should read as swappable with any other dev's portfolio.

**Key characteristics:**
- One warm palette, no theme switch. The golden-hour scene is the brand, not a mode.
- Two voices: Kitora speaks in titles, Wotfard speaks in sentences. Never a third face.
- Tactile, "pressed" surfaces on interactive elements. Buttons and cards read as physically real, not flat vector shapes.
- The horizon/range metaphor is shown through content and motion, never stated as copy.

## 2. Colors

A single sun-baked, warm palette. Depth and hierarchy come from moving along one warm ramp (near-white dawn light down to deep canyon earth), not from switching hue families. Tokens live in the `@theme` block of `src/app/globals.css`; that block is the source of truth and the Storybook page at Design system > Palette (`.storybook/design/palette.mdx`) is its reference, rendered from the live tokens.

### Primary
- **Dusk Earth** (oklch(0.4572 0.0543 59.52)): the deep warm-brown anchor. Primary buttons, dark section grounds, the darkest text-on-light-surface role.

### Secondary
- **Pale Dune** (oklch(0.9338 0.065 89.92)): the palest gold in the sky band. Secondary button fills, sunlit section backgrounds, and the label color on dark bars.

### Tertiary
- **Amber Mirage** (oklch(0.8381 0.0889 69.43)): warm peach-amber, the mid-sky tone. The accent role: hover fills, active nav states, small moments that need warmth without full saturation.

### Neutral
- **First Light** (oklch(0.9912 0.0069 88.64)): the base page background. Barely-there warm off-white, not a stark white.
- **Sand Haze** (oklch(0.9567 0.0333 88.06)): one step warmer than First Light. Card and muted-surface backgrounds that separate from the page without a hard edge.
- **Sand Line** (oklch(0.88 0.045 83)): borders, dividers, input strokes.
- **Dusk Ink** (oklch(0.2781 0.0296 256.85)): body text. Reads as near-neutral dark, and deliberately leans cool; body copy should never fight the palette for attention. Also the site's darkest ground: the reading page's code surface (blocks and inline chips) and the 404 scene's sky.

### Signal and focus (extended ramp)
- **Horizon Blaze** (oklch(0.7537 0.1378 49.92)): the near-horizon orange. Reserved for the dark-ground focus ring and chart data, the one place a saturated warm tone may appear. It cannot hold a ring on light warm ground, where even the opaque color measures 1.89:1 on Pale Dune; Canyon Brown takes that role.
- **Noon Sun** (oklch(0.8803 0.1348 86.06)): the hero's sun disc and small accent moments (the blog title's period, entry dates on dark ground). On the reading page it is the whole dark-ground accent role: links, ordered-list counters, the h2 terminal period, the horizon rule's dot, the blockquote mark, the play disc. Belongs to the hero scene first.
- **Canyon Brown** (oklch(0.5665 0.0595 67.97)): the ramp step above Dusk Earth. Hover pill on dark bars, the vista bluff's return to the warm ramp.
- **Warning Ember** (oklch(0.577 0.245 27.325)): errors and destructive actions. The one color allowed to break from the warm-earth family, because errors need to read as urgent, not on-brand.

### Mid-ramp steps
- **Dune Tan** (oklch(0.7891 0.0452 81.82)) and **Desert Clay** (oklch(0.681 0.0587 75.53)): mid-ramp earth steps, declared for hero ground bands and data viz and held in reserve until the blog reading page put them to work. Dune Tan takes prose bullets (3.77:1 on Dusk Earth, a glyph role) and the code blocks' header strip; both draw the `GroundStrata` seams alongside Canyon Brown.

### The Cool Branch (landfall only)
Five tokens scoped to the landing page's landfall section: the descent from Dusk Ink's space, through daytime atmosphere, into the Pacific. **Stratos** (oklch(0.36 0.09 258)), **Zenith Blue** (oklch(0.52 0.13 250)), **Day Sky** (oklch(0.8 0.075 235)), **Open Sea** (oklch(0.55 0.105 232)), **Deep Sea** (oklch(0.4 0.095 240)). Every other surface on the site stays warm; the bluff in the vista's foreground returns to the ramp with Canyon Brown and Dune Tan. No cool token may appear outside the landfall descent.

### Semantic tokens
The shadcn layer in `globals.css` maps onto the ramp: `--primary` is Dusk Earth, `--secondary` Pale Dune, `--muted` Sand Haze, `--border`/`--input` Sand Line, `--ring` Horizon Blaze, `--destructive` Warning Ember, `--background`/`--foreground` First Light/Dusk Ink. Only tokens with a real consumer exist; when a future shadcn copy-in needs one that's missing, add it mapped to a ramp color, never a gray. The `@custom-variant dark` line in `globals.css` scopes `dark:` to a class nothing applies, so copy-in dark-mode classes are inert by construction.

### Tints
Translucent steps of ramp colors (`text-pale-dune/75`, `border-sand-line/60`) are the system's second dimension: muted text, hairlines, scrims. For new code, pick from the ladder **10 / 30 / 50 / 75 / 85** (scrim, hairline, mid tint, secondary text, primary text on a tint) and contrast-check any text step against its real background (AA is 4.5:1; `text-pale-dune/75` on Dusk Earth fails at 4.21:1, `/85` passes at 4.88:1). Shipped values off the ladder were vetted visually and are not to be renormalized wholesale.

### Named rules
**The One Ramp Rule.** Every surface color, from the palest background to the darkest text, comes from this single warm ramp. The Cool Branch is the one scoped exception and may not grow. If a new color doesn't sit on the ramp, it doesn't belong on the site, including any future "dark mode," which this system does not have.

**The Rare Blaze Rule.** Horizon Blaze is a focus/data color, not a decoration. It shows up on a ring, a chart line, a rare accent, never as a background flood.

**The Ground Picks the Ring Rule.** The focus ring is chosen by the ground it lands on, never by habit: opaque Horizon Blaze on dark surfaces (6.41:1 on Dusk Ink, 3.20:1 on Dusk Earth), opaque Canyon Brown on light warm ones (3.77:1 on Pale Dune, 4.04:1 on Sand Haze, 4.47:1 on First Light). Both live in `src/lib/focus-ring.ts`, keyed by `Tone`: `FOCUS_RING` hugs controls that carry their own padding (buttons, pills, inputs, media boxes), and `FOCUS_OUTLINE` is the same colour stepped 3px out for bare text and glyphs (footer links, menu links, tabs, the logo), where a hugging ring crowds the letters. Blaze on Pale Dune measures 1.89:1 and is not an indicator; the /50 blaze tint the dark ring once wore fell to 2.63:1 on Dusk Ink and was retired for the same reason. Every recipe that renders a control therefore requires a `tone`: `cta`, `navPill`, `textLink`, and the bar themes, whose `text` is narrowed per ground so a theme can't pair light labels with a light ring.

**The Unbroken Ground Rule.** Every page closes on Dusk Earth and hands off to the Dusk Earth footer with no visible seam. The closing ground runs continuously to the bottom of the page.

## 3. Typography

**Title voice:** Kitora Bold (`--font-display`, `--font-legend`), a single 700 cut, self-hosted Latin-subset WOFF2.
**Sentence voice:** Wotfard (`--font-sans`), weights 100 through 700 loaded, 400 to 700 in practice.

**Character:** Kitora carries every title-like and display role; because it ships one bold cut, all title-like text renders at 700 and hierarchy within the title voice comes from size alone. Wotfard carries everything that reads as sentences: body copy, labels, form text, UI copy. Hierarchy never comes from a third family.

Kitora needs two hand-tuned corrections, both in `globals.css`: `.font-display` pulls word-spacing back to roughly 0.27em (Kitora's natural word space is 0.366em against Wotfard's 0.233em and drifts apart at display sizes), and `.kitora-equals` rebuilds the equals sign from two stacked hyphens because Kitora's "=" draws as a single bar. Both are calibrated to this face; swapping it means re-measuring in the dev-only font lab.

### Hierarchy
- **Display** (Kitora 700, clamp(2.25rem to 3.5rem), 1.05 to 1.1 line-height, -0.01em tracking): the page's one headline moment. One per page.
- **Headline** (Kitora 700, clamp(1.875rem to 2.25rem), 1.15 line-height): section titles.
- **Title** (Kitora 700, 1.25rem, 1.3 line-height): standalone card headings and sub-section titles. (Blog index entry titles stay Wotfard medium on purpose: the entry list reads as UI per the Two Voices Rule, while the reading page's headings take Kitora.)
- **Legend** (Kitora 700, 0.8125rem, 0.01em tracking): instrument text. Panorama roles, the year, the counter and its label.
- **Body** (Wotfard 400, 1rem, 1.6 line-height, 65 to 75ch measure): paragraph copy, blog and retrospective content. The retrospective Purpose prose takes one step up (1.0625rem, 1.75 line-height, 66ch measure) so long-form prose on Pale Dune holds at arm's length; that is a vetted step of Body, not a new role, and not a licence for arbitrary sizes.
- **Label** (Wotfard 500, 0.8125rem, 1.4 line-height, 0.01em tracking, sentence case): form labels, nav items, metadata. Never uppercase, never a tiny tracked eyebrow above a section.

### Named rules
**The Two Voices Rule.** Kitora speaks in titles, Wotfard speaks in sentences. If it's a set piece or a standalone heading, it's Kitora; if the reader is meant to read it as prose or UI, it's Wotfard. A third typeface never enters.

## 4. Elevation

Hybrid: mostly flat, tonal surfaces (Sand Haze on First Light needs no shadow to read as a distinct layer), with one deliberate exception: a "pressed," inset-shadow treatment on the elements a visitor actually touches. Depth is conveyed through touch, not ambient drop shadows.

### Shadow vocabulary
All three ship as tokens in `globals.css` and utilities (`shadow-pressed`, `shadow-pressed-soft`, `shadow-raised`); never hand-write these values inline.

- **Pressed** (`inset 0 2px 2px rgb(0 0 0 / 0.4), 0 2px 0 rgb(255 255 255 / 0.4)`): the signature "well," a Lego-brick-like inset. Applied to buttons on `:active`, paired with the 1px press-down translate.
- **Pressed soft** (`inset 0 2px 2px rgb(0 0 0 / 0.1), 0 2px 0 rgb(255 255 255 / 0.55)`): the same well at card scale, for large resting surfaces like the contact scene's card, where the full-strength inset would read as damage rather than depth.
- **Raised** (`inset 0 2px 2px rgb(255 255 255 / 0.5), 0 2px 8px rgb(0 0 0 / 0.45)`): the inverse coin, a lit top edge with a soft drop, for the one role that must read as sitting proud of the surface (the video play discs: the retrospective walkthrough and the blog's YouTube card).

### Stacking
Four named steps ship as tokens in `globals.css` (`--z-index-bar`, `--z-index-overlay`, `--z-index-dialog`, `--z-index-dev`) and utilities (`z-bar`, `z-overlay`, `z-dialog`, `z-dev`); never hand-write a z-index on fixed or sticky chrome. Same integers the overlays always had, now with names.

- **bar** (50): the site bar in every shell: the riding header on the home and inner pages, the return header, and the blog index's sticky sky bar.
- **overlay** (60): full-viewport sheets and scrims that cover the bar: the mobile menu, the contact dialog's backdrop.
- **dialog** (70): the modal panel above its scrim: the contact dialog's popup. The step names the panel, not the ARIA role; the mobile menu is `role="dialog"` and sits at `overlay`.
- **dev** (100): development-only chrome (the font lab). Never reaches a visitor.

Page-internal layering (`z-0` to `z-30`, `-z-1`) is local to a section, not part of the ladder, and must stay under `bar`; the landing showcase's `z-30` rides under the return header by design. The Motion+ blinds curtain paints at its own library-owned z-index (999999) above the whole ladder.

### Named rules
**The Pressed Rule.** Anything a visitor can click or press gets the well treatment on interaction, never an ambient drop shadow at rest. Depth here means "you can touch this," not "this is floating above the page."

## 5. Motion

Motion is a first-class material of this system, not a finishing touch. The site is motion-heavy by intent, with two libraries doing two locked jobs: **GSAP + ScrollTrigger** owns scroll-driven storytelling (pinning, scrubbing, parallax); **Motion** owns component-level animation (layout, enter/exit, micro-transitions). Never animate the same property of the same element with both.

### Named rules
**The Scroll Story Rule.** The landing page narrates by scroll. The hero's parallax scene is the opening line, and subsequent landing sections continue the story as scroll-driven sequences, chapters revealed by the visitor's own movement, not static blocks with a fade-in bolted on.

**The Sheet Rule.** Elements that visually belong to a scene move with the scene. Nothing that reads as part of a parallax world may scroll away at document speed while its world is pinned. The site header rides the hero's top sky band and exits in lockstep with it rather than scrolling off on its own.

**The Tasteful Microinteraction Rule.** Interactive elements get microinteractions wherever tasteful: hover pills, press states, focus transitions. If a microinteraction doesn't clarify state or add warmth, it doesn't ship; motion is never decoration for its own sake.

**Reduced Motion Is a Design, Not a Disable.** Every effect ships with a `prefers-reduced-motion` alternative that still reads as designed: static illustrations, crossfades or instant states, hovers that swap color without movement.

## 6. Components

The landing scroll story, `/contact`, the two `/remembering` retrospectives, the blog pages (the panorama index and the dusk-earth reading page), the 404 scene, and the site-wide header/footer are built and designed. Nothing routed ships as a wireframe anymore.

### Buttons
- **Shape:** gently rounded corners (10px / `rounded.lg`).
- **Shared recipes:** `src/lib/cta.ts`. `cta({ variant, tone })` (solid or outline) carries the CTA archetype's shape, height, and press; `navPill({ variant, tone })` (text or icon) carries the header/footer pill shape. `tone` is required and picks the focus ring per the Ground Picks the Ring Rule; every call site names its ground. Call sites add only their scene's colors; solid presses with `shadow-pressed`, outline supplies the border.
- **Primary CTA** (the shipped archetype: contact send, say-hello, the showcase links, the 404 return home): 44px tall, 20px horizontal padding, Dusk Earth surface with First Light text on light ground (tone-themed on dark), press adds `shadow-pressed` on top of the 1px translate-down.
- **Secondary:** Pale Dune background, Dusk Earth text, same shape and press treatment.
- **shadcn Button** (`src/components/ui/button.tsx`): the copy-in primitive, 32px default height, wired to the semantic tokens above so its variants land on the ramp. Not yet rendered on any shipped page; it's the base for future UI.
- **Destructive:** Warning Ember at low opacity as background, Warning Ember text. Reserved for genuinely destructive actions, none of which exist on this site yet.
- **State changes animate.** Any button whose content changes with state ("Send" becoming "Sending") animates its size change instead of snapping: use `AnimatedButton` (`src/components/animated-button/animated-button.tsx`), which springs the box (bounce 0.2) while keeping the label undistorted.

### Links
One recipe, two tones: `textLink({ tone })` in `src/lib/link.ts`, with the look in `.site-link` and its tone classes in `globals.css` (unlayered, so the typography plugin's underline never resurfaces). No underline anywhere; hue and 500 weight carry the link role. Focus-visible is a highlighter swipe: a solid fill whose same-color 4px outline extends it past the text box, so no ring line ever shows.
- **Dark** (`site-link-dark`, the blog reading page): Noon Sun, Sand Haze on hover; the swipe sets Dusk Ink on Noon Sun at 10.18:1.
- **Light** (`site-link-light`, the retrospective prose): Dusk Earth at 6.03:1 on Pale Dune, hover fills with Amber Mirage under Dusk Ink (the nav pill's hover move), and the swipe inverts to First Light on Dusk Earth at 7.14:1. Canyon Brown was measured as the light swipe and rejected: light text on it reaches only 4.47:1, just under AA.
- **Rest-state trade, accepted knowingly:** with no underline, a link is told from its body text by hue and weight alone. Dusk Earth sits 1.52:1 from the Dusk Ink/90 body around it, and Noon Sun 1.19:1 from the blog's Pale Dune body, both under the 3:1 that WCAG G183 asks of an underline-free link. The 500 weight and the strong hover and focus fills carry the affordance instead.

### Inputs / fields
Built, in the contact form: First Light background, Sand Line 1px border, 8px radius (`rounded.md`), 40px height, 12px horizontal padding. Focus swaps the border to Horizon Blaze and adds the ring for the form's `tone`: the `/contact` card renders light and takes Canyon Brown, the header's dialog renders dark and keeps blaze. Errors render in Warning Ember on light surfaces and Noon Sun on dark ones, because Warning Ember can't hold contrast on Dusk Earth.

### Cards / containers
- **Corner style:** 14px radius (`rounded.xl`), one step softer than buttons, signaling "container" vs "control."
- **Background:** Sand Haze on a First Light page (or First Light on a Sand Haze section). Always one ramp-step of separation, never white-on-white.
- **Shadow:** `shadow-pressed-soft` at rest, per the Elevation section. Not a drop shadow.
- **Border:** Sand Line, 1px, optional, only when the background step alone doesn't read clearly.

### Navigation
The site header: `gustavo.is` wordmark left, text links plus contact/LinkedIn/Bluesky/GitHub icon links right, transparent background. Hover shows a fully-rounded pill one ramp step off the ground the bar sits on, darker on light ground and lighter on dark; the active route carries `aria-current` with no visual marker; the keyboard focus ring comes from the bar theme's `tone`, which every entry in `SURFACE_THEMES` declares (dark bars keep blaze, while the sky bar, the sand-haze return header, and the light riding header take Canyon Brown). On the home page the header obeys the Sheet Rule: it rides the hero's pin and exits with the sheet. Pages that open on dark ground (the retrospectives, blog posts, the 404) give the riding bar `DARK_BAR`'s labels and Canyon Brown pill without its background: Pale Dune labels, a pill at 1.60:1 on Dusk Earth and 3.20:1 on the 404's Dusk Ink, Pale Dune on the pill at 3.77:1, the same pairing the return bar ships on its own Dusk Earth. The 404 passes `onDarkSurface` to `SiteHeader` because no route predicate can identify an unmatched path.

**The Return Header.** Once the riding header is gone, scrolling upward anywhere slides the same bar back in on a translucent sheet; scrolling down retracts it. Its colors adapt to the section beneath: sections declare their background via `data-surface` (`first-light` / `pale-dune` / `dusk-ink` / `dusk-earth` / `day-sky`), and the bar renders one ramp step off that surface (`SURFACE_THEMES` in `src/components/bar-themes.ts`). Every new full-bleed section must declare its `data-surface`.

### The Long Horizon hero (signature component)
Layered sky bands (Pale Dune, Amber Mirage, Horizon Blaze) and ground bands parallax at different scroll speeds; the Noon Sun disc grows; the Lego-avatar figure shrinks toward the horizon as the bands converge. This is the one place every extended-ramp color is allowed to appear together; everywhere else, pull from Primary/Secondary/Tertiary/Neutral only.

### The blog reading page
One dark-earth surface end to end: curtain blinds, `BlogPostHero`, article, and footer all share Dusk Earth per the Unbroken Ground Rule. `GroundStrata` compresses the hero's ground bands into three hairline seams (Dune Tan, Desert Clay, Canyon Brown) that thicken toward the article: the opening seam runs at content width so it reads as a cut, not a wall, while the closing seam above the footer stays full bleed. The article body is `.blog-prose` in `globals.css`: `@tailwindcss/typography`'s variables remapped onto the light-on-dark ladder. Kitora h2s close with a Noon Sun period echoing the index's "Blog.", the horizontal rule is a Noon Sun dot ringed in Dusk Earth on a hairline horizon, blockquotes read as traditional pull quotes (a Noon Sun mark hanging in a left gutter beside text one step larger, no card; the `Blockquote` MDX component's icon slot lets a post supply its own mark), and inline code sits in small Dusk Ink chips. Links carry no underline: the shared `textLink({ tone: "dark" })` recipe formalizes the look (Noon Sun, Sand Haze on hover; focus-visible reads as a Noon Sun highlighter swipe, solid sun behind ink text with a same-color outline extending it), applied to every anchor by the MDX link component. Both tones live under Links in Components. Contrast on Dusk Earth: body Pale Dune at 6.03:1, links and ordered-list counters Noon Sun at 5.08:1, secondary text Pale Dune/85 at 4.88:1; unordered bullets take Dune Tan at 3.77:1, licensed as glyphs against the 3:1 floor, never as text.

### Code blocks
`CodeBlock` and `CodeBlockTabs` share one borderless frame: a Dusk Ink well at the container radius under a Dune Tan header strip (the tabs row, or the standalone block's title strip). Shiki highlights with `desert-ramp` (`src/lib/code-theme.ts`), a theme built from the ramp itself on a Dusk Ink editor background: Pale Dune body text, variables and properties (12.09:1); Horizon Blaze keywords and storage (6.41:1); Noon Sun strings, numbers and language constants (10.18:1); Amber Mirage function names and tags (8.81:1); First Light type and attribute names (14.31:1); Dune Tan punctuation and operators (7.55:1); Desert Clay italic comments (5.08:1, the floor). Every token clears AA for text, so the syntax colors need no data-color license; `code-theme.test.ts` keeps it that way, and the theme's `colorReplacements` write the built HTML as `var(--color-*)` tokens rather than hex. Tab labels sit right-aligned in Dusk Ink, the only ladder step clearing AA for 13px text on Dune Tan (tints fall under 4.5:1 fast on light ground); the active label rides a sliding Dusk Ink pill and flips to Pale Dune, inactive hover is a Desert Clay pill one ramp step below the surface (the header nav's hover rule), and keyboard focus is a Dusk Ink outline because the horizon-blaze ring is near-invisible on Dune Tan. The copy button presses per the Pressed Rule and hides until hover only where hover exists; on touch it rests visible.

### The YouTube card
A privacy-clean thumbnail link, never an embed: the thumbnail rides the same-origin `/_next/image` proxy, so the page makes zero Google requests. A Dusk Earth scrim keeps the Noon Sun play disc readable on any frame; the disc takes `shadow-raised`, the proud-element role from the Elevation section.

### The 404 scene
A single footerless Dusk Ink viewport (nothing scrolls, so there is no ground hand-off): Kitora's "404" where the zero is a black hole, a near-black radial core inside a rotating Amber Mirage to Noon Sun accretion ring, plus an edge-on disk band crossing the whole set piece behind the digits, all CSS. The Lego avatar, a UFO, and the space station spiral in on desynchronized GSAP loops, each seeded mid-fall so the scene is alive at first sight; two reseeded `StarLayer` planes fill the sky. GSAP owns the actors and the ring, Motion owns only the copy block's entrance (the two-library rule). Reduced motion gets the designed still: every actor parks at an authored angle, radius, and tilt.

## 7. Do's and Don'ts

### Do:
- **Do** keep every color on the One Ramp. If a new UI need arises, find its answer on the warm ramp before reaching for an unrelated hue.
- **Do** pick tint steps from the ladder (10/30/50/75/85) and contrast-check text tints against their real background.
- **Do** reserve the Pressed treatment for things a visitor actually interacts with; flat/tonal everywhere else.
- **Do** route every text link through `textLink({ tone })` and every focus ring through `FOCUS_RING[tone]` or `FOCUS_OUTLINE[tone]`, directly or via a recipe's `tone`. A hand-written ring class is a bug, not a variant.
- **Do** let work and case-study content demonstrate the PM/QA/program-management/engineering range through what it contains, never through a stated claim of breadth (per PRODUCT.md's Positioning).
- **Do** keep the contact form as the one clear call to action; no competing secondary CTA.

### Don't:
- **Don't** build the cookie-cutter developer-portfolio template look: generic centered hero, identical project cards, no personal voice. (Direct from PRODUCT.md's anti-reference.)
- **Don't** add a third typeface, and don't let Kitora write sentences or Wotfard carry set-piece titles. See the Two Voices Rule.
- **Don't** hand-write shadow values; use `shadow-pressed`, `shadow-pressed-soft`, `shadow-raised`.
- **Don't** hand-write a z-index on fixed or sticky chrome; use the ladder (`z-bar`, `z-overlay`, `z-dialog`, `z-dev`).
- **Don't** use gradient text, side-stripe borders, or a tiny uppercase tracked eyebrow above every section. None of that belongs in a system this restrained.
- **Don't** underline a link. Hue and weight carry the role, and focus is the highlighter swipe; the underline is not a fallback this system keeps.
- **Don't** introduce a light/dark theme toggle. This system has one palette, full stop. The `dark:` variant is deliberately neutered in `globals.css`.

## Known exceptions

Vetted deviations, kept on purpose:
- `text-white` on the landfall vista CTA (`landing/landfall-vista/landfall-vista.tsx`): true white on Canyon Brown, chosen visually over First Light.
- `bg-white/[0.03]` on the project showcase media frame (`landing/project-showcase/project-showcase.tsx`): a 3% white lift over dark ground; no ramp token exists at that role.
- The blog reading page's decorative tints (`.blog-prose` in `globals.css`, the YouTube card): hairlines and scrims at 15/20/25/35% sit off the tint ladder, reviewed and kept as non-text decoration.
- The 404 black hole's core (`not-found/not-found-scene/not-found-scene.tsx`): a near-black `#06070c` below the ramp's darkest step, because a Dusk Ink core would vanish into the scene's Dusk Ink sky; the ramp supplies only the accretion ring.
