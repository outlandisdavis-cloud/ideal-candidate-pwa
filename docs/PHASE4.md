# Phase 4 — Polish & Safety Hardening

## Completed
- Prompt-injection sanitizer for untrusted job listing input: `src/sanitize.ts`
- Accessibility helper: `src/a11y.ts` (skip-to-main)
- PWA shell already in place via `vite-plugin-pwa`

## Remaining (no-code or later)
- Full WCAG 2.1 AA audit (color contrast, keyboard nav, screen-reader labels)
- Offline stress tests on low-end devices
- Privacy review: confirm local-only storage, encrypted at rest, no telemetry
- Dependency audit in CI (`npm audit`)
