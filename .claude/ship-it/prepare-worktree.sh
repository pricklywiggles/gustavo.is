#!/usr/bin/env bash
# ship-it worktree prepare: leave a fresh worktree safe and runnable.
# {wt} and {main} are passed by the orchestrator.
set -euo pipefail
wt="${1:?worktree path}"
main="${2:?main repo path}"

cd "$wt"

# Safe offline install: CI=true keeps pnpm from repointing the main repo's
# store, --offline serves everything (including the private-registry
# motion-plus package) from the store the main repo already populated.
CI=true pnpm install --frozen-lockfile --offline

# No further steps: this project has no non-git runtime artifacts (no
# codegen, no sidecars). The dev server builds .next on demand.
