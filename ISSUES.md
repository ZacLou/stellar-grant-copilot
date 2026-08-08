# Scoped follow-up issues

These are intended to be filed as individual GitHub issues (and, once this repo is
approved into the Stellar Wave Program, tagged with complexity levels for Wave
contributors). Each is scoped to be completable independently.

## 1. Add a proposal scoring / readiness checklist
**Complexity: Medium.** Add a derived, non-LLM checklist view (per SCF's own
"Clear / Measurable / Verifiable / Outcome-based" milestone criteria, and per-section
completeness) that gives a quick red/yellow/green readiness signal before a user
requests full LLM review or exports. Pure logic over `Proposal` — no new API calls.

## 2. Add collaborative editing for team proposals
**Complexity: High.** Most SCF/Wave applications are written by more than one person
(dev lead + non-technical cofounder, etc.). Add real-time or async multi-editor
support (e.g. Yjs + a lightweight backend, or a simple "shared link with named
sections locked to an author") so a team can co-author one proposal instead of
copy-pasting between docs.

## 3. Add a template library by grant type
**Complexity: Medium.** Currently the editor ships one generic section set. Add
selectable starter templates (SCF Open Track, SCF Integration Track, SCF RFP Track,
Wave repo application) with track-specific placeholder copy and slightly different
section guidance, sourced from the SCF Handbook's per-track pages.

## 4. Add a budget calculator with Wave point-estimation guidance
**Complexity: Medium.** Add a small calculator in the Budget section: for SCF, help
users derive a budget from (deliverable × estimated hours × hourly rate) per the
official best-practices guidance; for Wave, help maintainers estimate how many
Trivial/Medium/High (100/150/200-point) issues a roadmap decomposes into, so repo
applicants can show reviewers they understand Wave's issue-scoping model.

## 5. Add direct submission via API, if/when one becomes available
**Complexity: High, blocked.** Neither SCF nor Drips Wave currently expose a public
submission API (SCF submissions go through an interest form + invited application;
Wave repo applications go through drips.network onboarding). This issue tracks
watching for either program publishing a submission API and wiring up a "Submit
directly" button as an alternative to manual export, gated behind confirming the
integration against the then-current official docs.

## 6. Add inline diff / revision history for section edits
**Complexity: Low.** Track edit history per section (client-side, e.g. in
localStorage) so a user can compare a draft before and after applying review
feedback, and see how a section evolved across revisions.

## 7. Add a "reviewer persona" toggle for review feedback
**Complexity: Low.** Let the user pick between an SCF-panel-style review voice and a
Wave-maintainer style review voice (both grounded in the same `fewshot.ts` sources)
so feedback tone matches which panel will actually read the submission.
