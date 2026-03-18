# gustavo.is — Project Guide

## Project Overview
Personal portfolio site for Gustavo Gallegos. Currently undergoing a full refresh from Next.js 13.4 to a modern stack. The site includes a landing page, work case studies, blog, and contact form.

**Production URL:** https://gustavo.is
**Dev server:** `pnpm dev` (port 3001)

## Branching Strategy
- All work happens on `site-refresh` branch (or feature branches off it)
- Nothing merges to `master` until the full refresh is complete
- Feature branches: `site-refresh/<feature-name>`

## Stack
- **Framework:** Next.js 16.2 + React 19 (upgrading from 13.4)
- **Styling:** Tailwind CSS v4.2 (CSS-first config) + shadcn/ui v4
- **Content:** Velite (MDX for blog + case studies)
- **Animation:** Motion (framer-motion) and/or GSAP — decide per feature
- **Email:** Resend (replacing Postmark)
- **Testing:** Vitest + Testing Library + Playwright (strict TDD)
- **Package manager:** pnpm

## Coding Conventions
- Default to Server Components. Only add `'use client'` when interactivity or browser APIs are needed.
- Push `'use client'` boundaries as far down the component tree as possible.
- All request APIs are async: `await cookies()`, `await headers()`, `await params`, `await searchParams`.
- Use `@/*` path alias (maps to `./src/*`).
- Prefer named exports over default exports for components.
- TypeScript strict mode. No `any` unless absolutely necessary.
- Tailwind for all styling — no CSS-in-JS.

## Testing (TDD)
- Write tests before or alongside implementation.
- Unit/integration: Vitest + Testing Library (`pnpm test`)
- E2E: Playwright (`pnpm test:e2e`)
- All new components need tests. All bug fixes need regression tests.

## Content Authoring
- Blog posts: `content/blog/<slug>.mdx`
- Project case studies: `content/projects/<slug>.mdx`
- MDX components live in `src/components/mdx/`
- Content schemas defined in `velite.config.ts`

## Animation Strategy
- Use Motion (framer-motion) for component-level animations, page transitions, and layout animations.
- Use GSAP for complex scroll-driven animations and timeline sequences.
- Prefer CSS transitions/animations for simple hover/focus states.
- Always respect `prefers-reduced-motion`.

## Shell Tooling
Prefer these tools over their defaults (find, grep, cat, etc.):

- FILES: `fd` instead of `find`
- TEXT/strings: `rg` instead of `grep`
- CODE STRUCTURE: `ast-grep`
- SELECTION from multiple results: pipe to `fzf`
- JSON: `jq`
- YAML/XML: `yq`
- FILE VIEWING: `bat` instead of `cat` (if available)
- DIRECTORY LISTING: `eza` instead of `ls` (if available)
- GIT DIFFS: `delta` instead of default git diff
- PROCESSES: `procs` instead of `ps`, `btop` instead of `top`
- HTTP/APIs: `httpie` (`http`) instead of `curl`
- CSV: `xsv` for querying and filtering CSV files

When uncertain if a tool is installed, check with `which <tool>` before using it.