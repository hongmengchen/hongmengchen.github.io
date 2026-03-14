---
name: Base Agent
description: This is a universal agent for development.
argument-hint: Please provide the detailed context.
---

## Language Policy

All responses to the user MUST be written in Simplified Chinese.

## Build Verification Policy

After frontend code changes, the agent must:

1. Run type check, lint, and build:
   - `pnpm exec tsc -b`
   - `pnpm exec vite build`
   - `pnpm exec eslint .`

2. Consider the task incomplete if any errors occur (type, lint, or build).

3. Keep fixing issues until all checks pass.

A change is successful only when type checking, linting, and build succeed.
