# gustavo.is — Site Refresh Plan (Feature-Focused)

## Context

The site refresh migrated the stack (WS1–WS3), built a hero with GSAP parallax (WS-HERO), set up the design system with oklch tokens and shadcn/ui Base UI (WS4), and did a first pass at layout/nav (WS5). The WS5 mobile menu and footer were unsatisfactory — both will be redesigned from scratch in their respective feature workstreams below.

The remaining work is restructured around **features**, not technical layers. Each feature includes its own design exploration, implementation, and polish.

**Locked decisions:**
- Warm desert sunset palette (oklch tokens in `globals.css`)
- GSAP + ScrollTrigger for scroll-driven animation; Motion for component-level
- shadcn/ui v4 (Base UI variant), Tailwind v4, wotfard/waves-signal/pixel-robot fonts
- Velite for MDX content, Resend for email

---

## Completed Workstreams

- **WS1** Setup -- DONE
- **WS2** Stack migration (Next.js 16, React 19, Tailwind v4) -- DONE
- **WS3** Content infrastructure (Velite, MDX schemas, case study migration) -- DONE
- **WS-HERO** Parallax hero with GSAP scroll animations -- DONE
- **WS4** Design system (oklch palette, shadcn/ui init, typography, components) -- DONE
- **WS5** Layout & nav first pass (metadata, mobile menu draft, footer draft) -- DONE (nav and footer to be redesigned below)

---

## Remaining Feature Workstreams

### F1: Navigation ✅ DONE (+ WCAG AA fixes in PR #18)
_Finish desktop nav design + redesign mobile navigation from scratch._

**Interactive session** — begin by discussing direction with Gustavo before any code.

- Design desktop nav: finalize link set (replace DummyLink placeholder), hover/active states, spacing, visual weight relative to the header name animation
- Redesign mobile navigation: the current Sheet slide-in is generic — design a mobile menu that fits the desert/warm aesthetic with proper hierarchy, spacing, and transitions
- Update `NAV_LINKS` to reflect final site structure as other features land

**Key files:** `src/components/header/SiteHeader.tsx`, `src/components/ui/sheet.tsx`

---

### F2: Introduction Component ✅ DONE (PR #19)
_Scroll-driven "I'm ____ with ____" rotating text + accompanying media._

- Scroll-pinned section with three slides (engineer / dog dad / tinkerer)
- Text: slow upward drift → scale+fade exit, snap-in from below with ScrollTrigger snap
- Photo strip: polaroid cards on a curved SVG clothesline, photos swap per slide (stagger slide-out right / slide-in left)
- Responsive card counts: 4 mobile / 5 tablet / 6 desktop
- Bricolage Grotesque adopted as site-wide sans font (replacing Wotfard)
- Placeholder Kiwi photos and copy in place — see Finishing Touches for real content

**Key files:** `src/components/landing/IntroSection.tsx`, `src/fonts/fonts.ts`, `src/app/globals.css`

---

### F3: Product Timeline <-- NEXT
_Interactive scroll-driven timeline of career products._

**Interactive session** — begin by discussing direction with Gustavo before any code.

- Explore animation concepts together: horizontal scrub? faux-3D landscape with products appearing from the distance? vertical timeline with scroll-triggered reveals? Try multiple approaches before committing.
- Create a data file with all relevant products, companies, roles, dates, and descriptions
- Gather/create logos and images for companies and products
- Build the GSAP (or Motion) scroll-driven animation
- Decide on color treatment — does it extend the desert palette or introduce its own sub-palette?

**Key files:** New data file (e.g. `src/data/career-timeline.ts`), new component `src/components/landing/ProductTimeline.tsx`, assets in `public/`

---

### F4: Get in Touch
_Resend-powered contact component with inline and modal modes._

**Interactive session** — begin by discussing direction with Gustavo before any code.

- Design the contact component: inline mode for the landing page, modal mode for use elsewhere
- Set up Resend account (user creates account, Claude helps with API key setup and DNS verification)
- Implement the Resend integration (replace old Postmark `/api/contact` route)
- Form fields, validation, success/error states
- Mobile-responsive

**Key files:** `src/app/api/contact/route.ts` (rewrite), new component `src/components/contact/ContactForm.tsx`, old `src/components/contact.tsx` (delete)

---

### F5: Footer
_Redesigned footer that ties the landing page together._

**Interactive session** — begin by discussing direction with Gustavo before any code.

- Design a footer that complements the desert aesthetic and the rest of the landing page
- Social links (LinkedIn, GitHub), copyright, possibly site nav links or a tagline
- Replace the current minimal footer (`src/components/footer/SiteFooter.tsx`)

**Key files:** `src/components/footer/SiteFooter.tsx` (rewrite)

---

### F6: Case Study Pages
_Redesign Ponder and Ponder Blogs pages to match the new site aesthetic._

- Redesign the case study page template based on how the landing page ended up looking
- Update MDX rendering and layout for project pages
- Validate with existing content (`content/projects/ponder.mdx`, `content/projects/ponder-blogs.mdx`)
- Remove old `/remembering` routes, wire up new `/work/[slug]` routes
- Clean up old `src/components/projects.tsx`

**Key files:** New `src/app/work/[slug]/page.tsx`, `src/components/mdx/`, content files, old `src/app/remembering/` (delete)

---

### F7: Blog
_MDX blog infrastructure, clear authoring workflow, and design._

- Design blog index and post pages to fit the site aesthetic
- Ensure MDX pipeline works end-to-end (Velite -> page rendering)
- Define a clear workflow for future blog posts (file conventions, frontmatter, preview)
- Validate with `content/blog/hello-world.mdx`
- Blog-specific MDX components if needed

**Key files:** New `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `velite.config.ts`, `content/blog/`

---

### F8: SEO & Discoverability
_OpenGraph, sitemap, llms.txt, and modern discoverability best practices._

- Plan and implement OG images (static or dynamic with Satori/@vercel/og)
- Review current best practices: do we need llms.txt? What do AI crawlers look for?
- Sitemap generation (update existing `src/app/api/sitemap/route.ts` or use Next.js built-in)
- Structured data / JSON-LD if warranted
- Meta tags audit across all pages
- robots.txt review

**Key files:** `src/app/api/sitemap/route.ts`, new OG image route, `public/robots.txt`, layout metadata

---

### F9: Dark Mode (deferred)
_Derive dark palette, implement `.dark` overrides, add toggle to SiteHeader._

Deferred until all features above are complete. The CSS variable structure already supports it.

---

## Finishing touches
_Nice-to-haves to revisit after the main plan is complete._

- Beach and palm tree motif at the bottom of the mobile menu sheet
- Correct site icon for desktop and mobile using best practices
- Gradients on hero color bands
- IntroSection (F2): replace placeholder Kiwi photos with the real per-slide photos, and finalize the predicate copy for each slide

