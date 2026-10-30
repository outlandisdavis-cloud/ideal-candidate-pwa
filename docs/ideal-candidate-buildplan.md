# Ideal Candidate — Build Plan

**Project:** Ideal Candidate — AI-assisted resume tailoring PWA
**Status:** Phase 0 — build plan draft

## Concept

A PWA that helps job seekers tailor their resume to each job listing so they read as the "ideal candidate," using an OpenAI-compatible AI backend (paid API or local Ollama server). User background is captured via an onboarding questionnaire + document uploads. For each application, the model rewrites the resume; the app keeps a database of resume versions and jobs applied to with status tracking.

## Honesty Levels (user-selectable, default = Honest)
- **Honest (default)** — only reframe/clarify real experience; no fabrication.
- **Stretching the Truth** — light embellishment of scope/impact; disclaimer shown.
- **Distorting Facts** — significant reframing; disclaimer shown.
- **Anything Goes** — aggressive tailoring; disclaimer shown.

Changing away from Honest triggers a disclaimer. App encourages staying on Honest.

## Core Features
1. Onboarding questionnaire (background, skills, experience, education, target roles).
2. Document upload (resume, cover letter, transcripts, certs) — parsed to text.
3. Job listing input (paste URL/text) → extract requirements.
4. AI tailoring: rewrite resume per listing at chosen honesty level; output diff + new version.
5. Resume version DB + job application tracker (status: applied/interview/offer/rejected).
6. Export tailored resume (PDF/DOCX) + cover letter.
7. Privacy: data stored locally (IndexedDB, encrypted) by default; AI calls go to user-configured endpoint.

## Suggested Application Type

**PWA (web-first), offline-capable shell, local-first data.**

Rationale:
- Cross-platform (desktop + mobile) without app-store friction.
- Aligns with existing Sponsor stack (React 19 + Vite + TS + vite-plugin-pwa + Dexie) — reuse patterns.
- AI backend is pluggable: OpenAI-compatible endpoint (paid) OR local Ollama — user configures base URL + key.
- Privacy: resumes never leave device except the AI call to the user's chosen endpoint.

Recommended stack: React 19 + Vite + TS, vite-plugin-pwa (Workbox), Dexie.js (IndexedDB, AES-256-GCM), pdf.js / mammoth for doc parsing, jsPDF / docx for export, OpenAI-compatible client (fetch).

## Tech Stack (proposed)
- Frontend: React 19 + Vite + TypeScript
- PWA: vite-plugin-pwa (Workbox)
- Storage: Dexie.js (IndexedDB) + Web Crypto encryption at rest
- Doc parsing: pdf.js (PDF), mammoth (DOCX)
- Export: jsPDF, docx
- AI: OpenAI-compatible chat completions (fetch) — endpoint + model + key configurable; supports Ollama
- Deploy: Web PWA → optional TWA/Capacitor later

## Data Model (Dexie)
- profile (questionnaire answers, encrypted)
- documents (uploaded files metadata + extracted text, encrypted)
- jobs (listing text, requirements, status)
- resumeVersions (versioned tailored resumes linked to job)
- settings (honesty level, endpoint config, encrypted key)

## Roadmap (suggested)
- Phase 1 — Foundation: scaffold, PWA shell, encrypted storage, onboarding questionnaire, doc upload+parse
- Phase 2 — AI core: endpoint config, tailoring prompt engine, honesty levels + disclaimers, diff view
- Phase 3 — Tracking: job DB, resume version DB, status pipeline, export
- Phase 4 — Polish: accessibility, offline, privacy review, red-team prompt injection
- Phase 5 — Beta: user testing
- Phase 6 — Launch

## Safety/Privacy Notes
- Never send data to a third-party AI without user's explicit endpoint choice.
- Disclaimers on honesty levels; encourage Honest default.
- Prompt-injection defense: treat job listing text as untrusted; sanitize before injecting into prompt.
- No medical/legal advice; resume content is user's responsibility.

## Open Questions
1. Which AI provider default? (suggest OpenAI gpt-4o-mini for cost, Ollama llama3.1 for local)
2. DOCX export fidelity requirements?
3. Multi-language support?
