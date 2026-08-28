---
name: doc-readme
description: Keep src/components/landing/README.md (the landing scroll story's architecture and pitfalls doc) current after a change. Use when the ship-it docs phase reports an architecture docNeed, or when asked to update the landing README for a change or diff. Classifies whether the diff touches the landing story first; out-of-scope diffs are a no-op.
allowed-tools: Bash, Read, Edit
---

# doc-readme: reconcile the landing story's README

`src/components/landing/README.md` is a living contract: it records the
scroll story's architecture, the invariants that keep it working, and the
pitfalls that were already paid for once. Agents are required to read it
before touching `src/components/landing/`, so a stale claim there causes
real damage. This skill reconciles it against a shipped change by the
curate-serial mechanic: edit only the sections the diff actually affects,
never regenerate the file.

## 1. Classify scope

Diff the change (`git diff <base>...<head> --stat`, or the changed-file
list the caller provides). In scope when it touches any of:

- `src/components/landing/**`
- shared modules the README names as contracts: `src/components/use-steady-frames.ts`, `src/components/motion-anchor.tsx`, `src/components/odometer-number.tsx`, `src/components/animated-number.tsx`
- `public/*panorama*/**` (layer art the README's template-matching and sea-level sections describe)

Out of scope: stop and report "no landing README impact" with one line of
reasoning. Do not touch the file.

## 2. Reconcile by section

Read the README and the in-scope diff hunks. For each README section,
ask: does the diff make any sentence here false, incomplete, or newly
misleading? Typical triggers:

- A moved or renamed file: fix the file map and any path references.
- A changed invariant (pin lengths, phase order, sea-level rules, the
  two-library split, entrance gating): update the invariant's wording to
  the new truth; never leave both the old and new claims.
- A new pitfall paid for in this change (a bug class the diff fixes that
  future edits could reintroduce): add it in the style of the existing
  entries, one tight paragraph, why-first.
- Changed verification recipes (probe positions, chapter query params,
  test landmines): update the recipe steps.

Edit surgically with Edit; keep the README's voice (dense, imperative,
why-first). Do not restructure sections or reflow untouched prose.

## 3. Report

Summarize what changed in the README (section names, one line each) or
state the no-op. Never claim an update you did not make.

## Project context

- The README's owner cares about exactness: layer positions are
  template-matched, not eyeballed, and the doc says so; never soften
  those claims.
- House rules apply to everything written here: no em dashes anywhere
  (use a comma, colon, or split the sentence), comments and doc prose
  carry non-obvious why only, no AI attribution.
- The landing story is GSAP-owned for scroll and Motion-owned for
  load-time animation; if a diff blurs that line, the README's invariant
  list is where the correction gets recorded.
