# 🛰️ Stellar Grant Copilot

A focused copilot for drafting **Stellar Community Fund (SCF) Build Award** proposals
and **Drips Wave — Stellar Wave Program** repo applications: a structured editor, an
LLM-powered "review this section" feature grounded in publicly documented SCF/Wave
review criteria, and one-click export to Markdown/PDF.

**This repository is itself submitted as a Drips Wave Stellar Program repo
application.** See [Why this is ecosystem-wide value, not a single project](#why-this-is-ecosystem-wide-value-not-a-single-project)
below.

## Features

1. **Structured multi-section editor** — Problem Statement, Solution, Technical
   Architecture, Team, Budget, and Milestones, each with inline guidance on what
   reviewers actually look for in that section.
2. **"Review this section" (LLM-powered, end-to-end functional)** — sends the section
   draft plus the rest of the proposal as context to Claude, grounded in a curated,
   citable set of patterns distilled from official SCF and Drips Wave documentation
   (see [Grounding sources](#grounding-sources-for-review-feedback)). Feedback is
   structured as Strengths / Issues / Suggested rewrite, and calls out vague
   milestones, unjustified budget lines, and over-scoped timelines specifically,
   rather than generic "add more detail" notes.
3. **Export to Markdown and PDF** in a layout matching how SCF Build and Wave repo
   applications are structured (title, track, ordered sections, submission pointer).
   Both exporters are covered by CI tests (`__tests__/export.test.ts`).

## Why this is ecosystem-wide value, not a single project

Drips Wave rewards contributions that unblock or accelerate *other* open-source work
in the Stellar ecosystem — see
[docs.drips.network/wave](https://docs.drips.network/wave/), which frames Wave as
solving the "maintenance gap" by concentrating community energy on scoped,
verifiable issues across many approved repos, and
[stellar.gitbook.io/scf-handbook](https://stellar.gitbook.io/scf-handbook), which
notes SCF explicitly favors projects that are public goods with demonstrated value
to the wider ecosystem rather than to a single team.

Two structural problems repeatedly show up in both programs' public guidance:

- **SCF** explicitly warns that budgets must map to verifiable deliverables and that
  the technical architecture must be fully designed *before* submission — yet this
  is exactly the kind of structured planning that's easy to skip when writing a
  proposal in a blank document.
- **Drips Wave** maintainers are expected to scope issues into discrete,
  complexity-tagged units (Trivial/Medium/High) that a single contributor can finish
  in a one-week sprint — a skill that has nothing to do with the maintainer's actual
  code and everything to do with how they write.

This tool doesn't fund one product; it raises the floor on *every* application that
uses it, for any team applying to SCF or Wave — which directly compounds the goal
both programs state publicly: more usable, better-scoped public goods in the
ecosystem, not more polished pitches for a single team's roadmap.

## Grounding sources for review feedback

The review feature does not hallucinate grant-writing advice. It's grounded in a
curated set of paraphrased patterns (see `src/lib/fewshot.ts`), each tied to a
public, citable source:

| Source | URL |
|---|---|
| SCF Handbook — Build Award | https://stellar.gitbook.io/scf-handbook/scf-awards/build-award |
| SCF Handbook — Budget & Deliverable Guidelines | https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/budget-and-deliverable-guidelines |
| SCF Handbook — RFP Track | https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/rfp-track |
| SCF Handbook — Official Rules | https://stellar.gitbook.io/scf-handbook/supporting-programs/public-goods-award/official-rules |
| Stellar.org — SCF Submission Best Practices | https://stellar.org/blog/ecosystem/stellar-community-fund-soroban-submission-best-practices |
| Drips Docs — Wave Overview | https://docs.drips.network/wave/ |
| Drips Docs — Participating in a Wave (Maintainers) | https://docs.drips.network/wave/maintainers/participating-in-a-wave/ |
| Drips Docs — Solving Issues & Earning Rewards (Contributors) | https://docs.drips.network/wave/contributors/solving-issues-and-earning-rewards/ |

Nothing in this repository reproduces private, paywalled, or third-party applicant
material — only paraphrased patterns from official, publicly accessible program
documentation, each kept short and attributed. See `src/lib/fewshot.ts` for the
full list with per-pattern citations.

## Tech stack

- Next.js 14 (App Router) + TypeScript
- `@anthropic-ai/sdk` for the review feature (server-side only — the API key never
  reaches the browser)
- `pdf-lib` for PDF export (no headless browser dependency)
- Jest + ts-jest for tests, run in CI on every push/PR

## Getting started

See [SETUP.md](./SETUP.md) for local development, environment variables, testing,
and deployment instructions.

## Project status / scope of this MVP

This MVP prioritizes review quality and a working end-to-end flow over visual
polish, per the guidance that a copilot giving genuinely useful feedback on a rough
draft is the core value. Deliberately out of scope for the MVP (tracked as issues,
see [ISSUES.md](./ISSUES.md)): collaborative editing, a template library, a budget
calculator, direct API submission, and a proposal readiness/scoring checklist.

## License

MIT — see [LICENSE](./LICENSE).
