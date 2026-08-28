<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Component organization

All components live under `src/components/`, in exactly one of three buckets:

- `src/components/ui/`: design-system primitives only (shadcn/Base UI copy-in: button, dialog, ...). Never put hand-written application components here.
- `src/components/<page>/`: page sections, named after the page they compose (`landing/`, `blog/`, `contact/`, `not-found/`, `retrospective/`). A section is a component that exists to be one slice of a specific page.
- `src/components/` (root): pure reusable components used across pages (`scroll-fade-in/`, `curtain-link/`).

Within every bucket except `ui/`, each component owns a kebab-case folder named after it:

- `<name>/<name>.tsx` is the component. Its `.test.tsx` / `.stories.tsx` satellites live beside it, as does a private helper module with exactly one consumer (`warp-starfield/warp-starfield-math.ts`).
- `<name>/index.ts` contains only `export * from "./<name>";` so imports stay `@/components/<bucket-path><name>`. Never write the component in `index.ts` itself.
- Modules shared by two or more components (data modules like `landing/projects-data.ts`, theme tables like `bar-themes.ts`, hooks like `use-media-query.ts`) stay flat files in their bucket, inside no component's folder.

`src/components/ui/` stays flat: the shadcn CLI writes flat files, and its output is not to be reorganized.

Tie-breaker: if a section contains a piece that's reusable on its own, split it. The reusable piece gets a folder at the root (`components/animated-headline/`); the section that arranges it stays in its page bucket (`components/landing/hero/`).

Do not colocate components inside `src/app/` (no `_components` folders); `src/app/` is for routing files only.

File naming: kebab-case for all component files and folders (`hero/hero.tsx`, `contact-form/contact-form.tsx`), never PascalCase. This matches Next.js special files and shadcn CLI output, and avoids case-rename traps between macOS and Linux CI. Exports stay PascalCase (`hero.tsx` exports `Hero`).

# Work-history scroll story

Before changing anything in `src/components/landing/` (the pinned
three-city scroll story: panoramas, HUD, counter, sun, outro), read
`src/components/landing/README.md`. It documents the architecture, the
invariants that keep the section working, and the already-paid-for
pitfalls (pin-reverted measurement, imperative-tween rewind death, filter
interpolation, preflight image clamping, sea-level rules, probe recipes).

Before adding a dependency or running the build, test, or lint toolchain, read the stack reference: @docs/stack.md
