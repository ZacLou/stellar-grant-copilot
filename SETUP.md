# SETUP

## Prerequisites

- Node.js 20+
- An Anthropic API key (for the "Review this section" feature only — the editor and
  export features work without one)

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

```bash
cp .env.example .env.local
```

Then edit `.env.local` and set:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Get a key at https://console.anthropic.com/. The key is read server-side only
(`src/app/api/review/route.ts`) and is never sent to the browser.

If `ANTHROPIC_API_KEY` is not set, the app still runs — the editor, autosave (to
`localStorage`), and Markdown/PDF export all work — but the "Review this section"
button will return a clear error explaining the key is missing, instead of failing
silently.

## 3. Run the dev server

```bash
npm run dev
```

Visit http://localhost:3000.

## 4. Run tests

```bash
npm run test
```

This runs the Jest suite in `__tests__/`, which covers:
- `export.test.ts` — Markdown export content/structure and PDF export (valid PDF
  header, non-trivial byte size, empty-proposal handling, multi-page overflow
  handling)
- `reviewPrompt.test.ts` — that grounded review patterns and their source URLs are
  correctly embedded per section/track, and that context/empty-draft handling works

CI (`.github/workflows/ci.yml`) runs `npm run lint`, `npm run test:ci`, and
`npm run build` on every push and pull request to `main`.

## 5. Production build

```bash
npm run build
npm run start
```

## 6. Deploying

This is a standard Next.js 14 App Router project and deploys to any Next.js-capable
host (Vercel, Netlify, a Node server, etc.). The only required runtime secret is
`ANTHROPIC_API_KEY`. No database is used — proposal drafts are persisted client-side
in `localStorage` under the key `stellar-grant-copilot:proposal` (see
`src/app/page.tsx`); nothing is sent to a server except the specific section text
being reviewed or exported, per request.

## Project layout

```
src/
  app/
    page.tsx                 # main editor UI
    layout.tsx / globals.css
    api/
      review/route.ts        # POST -> calls Anthropic Messages API
      export/markdown/route.ts
      export/pdf/route.ts
  components/
    SectionCard.tsx           # per-section editor + review button/output
  lib/
    types.ts                  # Proposal / SectionId data model
    fewshot.ts                 # curated, cited grounding patterns for review
    reviewPrompt.ts            # builds the system/user prompt sent to Claude
    exportMarkdown.ts
    exportPdf.ts
__tests__/
  export.test.ts
  reviewPrompt.test.ts
```

## Extending the grounding set

To add or update the patterns the review feature is grounded in, edit
`src/lib/fewshot.ts`. Each pattern must:
1. Be paraphrased, not quoted verbatim, from a genuinely public source.
2. Include a `sourceId` pointing to an entry in `SOURCES` with a real URL.

See `ISSUES.md` for scoped follow-up work, including a template library that would
extend this same grounding pattern to per-track SCF pages (Open/Integration/RFP).
