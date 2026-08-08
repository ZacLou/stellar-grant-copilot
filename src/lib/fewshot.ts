/**
 * Curated, publicly available grounding material used as few-shot context for the
 * "review this section" feature. Nothing here is copied verbatim from a private or
 * paywalled source — everything is paraphrased from official, publicly accessible
 * documentation, with a source citation kept alongside it so a human reviewer can
 * verify the claim. This file intentionally contains *patterns and guidance*
 * distilled from public docs, not full proposal text, to stay well inside fair use
 * and to avoid overfitting reviews to one applicant's specific project.
 */

export interface GroundingSource {
  id: string;
  label: string;
  url: string;
  note: string;
}

export const SOURCES: GroundingSource[] = [
  {
    id: "scf-handbook-build",
    label: "SCF Handbook — Build Award",
    url: "https://stellar.gitbook.io/scf-handbook/scf-awards/build-award",
    note: "Official SCF documentation on the Build Award submission and review process.",
  },
  {
    id: "scf-handbook-budget",
    label: "SCF Handbook — Budget & Deliverable Guidelines",
    url: "https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/budget-and-deliverable-guidelines",
    note: "Official guidance on tying budget tranches to verifiable deliverables.",
  },
  {
    id: "scf-handbook-rfp",
    label: "SCF Handbook — RFP Track",
    url: "https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/rfp-track",
    note: "Official guidance on what reviewers weigh for RFP-track submissions (relevant experience, ecosystem alignment, API/design quality).",
  },
  {
    id: "scf-handbook-official-rules",
    label: "SCF Handbook — Official Rules",
    url: "https://stellar.gitbook.io/scf-handbook/supporting-programs/public-goods-award/official-rules",
    note: "Official eligibility and public-good justification requirements.",
  },
  {
    id: "stellar-blog-best-practices",
    label: "Stellar.org — SCF Submission Best Practices",
    url: "https://stellar.org/blog/ecosystem/stellar-community-fund-soroban-submission-best-practices",
    note: "Official Stellar Development Foundation blog post with budgeting and team-justification advice.",
  },
  {
    id: "drips-wave-overview",
    label: "Drips Docs — Wave Overview",
    url: "https://docs.drips.network/wave/",
    note: "Official docs describing the Wave lifecycle: repos are approved into a Program, then issues are scoped and tagged with point values by complexity.",
  },
  {
    id: "drips-wave-maintainers",
    label: "Drips Docs — Participating in a Wave (Maintainers)",
    url: "https://docs.drips.network/wave/maintainers/participating-in-a-wave/",
    note: "Official docs on how maintainers get a repo approved and scope issues for a Wave Program.",
  },
  {
    id: "drips-wave-contributors",
    label: "Drips Docs — Solving Issues & Earning Rewards (Contributors)",
    url: "https://docs.drips.network/wave/contributors/solving-issues-and-earning-rewards/",
    note: "Official docs on how contributors apply to issues and earn points on assignment/merge.",
  },
];

/**
 * Distilled, paraphrased patterns (not verbatim excerpts) that strong applications
 * in each track tend to follow, grounded in the sources above. These are fed to the
 * LLM as review criteria, organized by section, so feedback references real,
 * citable ecosystem norms rather than generic advice.
 */
export const REVIEW_PATTERNS: Record<string, { pattern: string; sourceId: string }[]> = {
  problemStatement: [
    {
      pattern:
        "SCF reviewers expect projects to justify why they qualify as a public good and why SCF support specifically is necessary to keep the work accessible to the ecosystem — not just that the problem exists.",
      sourceId: "scf-handbook-official-rules",
    },
    {
      pattern:
        "Strong problem statements name the specific user (wallet devs, anchors, DEX integrators, etc.) and show evidence the problem is real (an issue thread, a support burden, a missing integration) rather than asserting it abstractly.",
      sourceId: "stellar-blog-best-practices",
    },
  ],
  solution: [
    {
      pattern:
        "Descriptions should answer concretely what the project lets users do, why it's valuable for Stellar, and how it actually uses Stellar/Soroban rather than being generic product copy.",
      sourceId: "scf-handbook-build",
    },
    {
      pattern:
        "Proof-of-concept-only submissions are discouraged; reviewers want a live, usable element, not just a pitch.",
      sourceId: "scf-handbook-official-rules",
    },
  ],
  technicalArchitecture: [
    {
      pattern:
        "For SCF Build, the technical architecture is expected to already be fully designed at application time — tranche 1 should be actual development, not planning or system design done after funding starts.",
      sourceId: "scf-handbook-budget",
    },
    {
      pattern:
        "Reviewers explicitly weigh API/design quality and whether a proposal duplicates or fails to coordinate with existing ecosystem tooling and maintainers — architecture sections should show awareness of adjacent projects.",
      sourceId: "scf-handbook-rfp",
    },
  ],
  team: [
    {
      pattern:
        "Reviewers look for a strong technical foundation and want the team to explicitly explain why they are uniquely qualified to build and execute this specific project, not just list credentials.",
      sourceId: "stellar-blog-best-practices",
    },
    {
      pattern:
        "A track record of small, well-maintained libraries, prior Stellar/SCF contributions, or known open-source work is treated as a strong positive signal.",
      sourceId: "scf-handbook-rfp",
    },
  ],
  budget: [
    {
      pattern:
        "Budgets must map clearly to a development timeline and outcomes; each tranche/line item must be backed by a specific, verifiable deliverable, and costs must support future work rather than reimbursing past work or general operations.",
      sourceId: "scf-handbook-budget",
    },
    {
      pattern:
        "Applicants are explicitly advised not to request the maximum available budget by default — build a roadmap, estimate engineering hours per deliverable at a stated hourly rate, and let the budget follow from that math.",
      sourceId: "stellar-blog-best-practices",
    },
    {
      pattern:
        "For Wave, work is scoped at the GitHub issue level, and each issue is tagged with a Point value based on a stated complexity tier (commonly Trivial/Medium/High), not a lump budget ask — a Wave repo application should show maintainers understand how to scope issues into these discrete complexity tiers.",
      sourceId: "drips-wave-maintainers",
    },
  ],
  milestones: [
    {
      pattern:
        "The SCF Handbook gives a direct checklist for good deliverables: clear (obvious what's being shipped), measurable (a concrete metric or success signal), verifiable (reviewers can test, view, or validate it), and outcome-based (focused on the result, not the activity).",
      sourceId: "scf-handbook-budget",
    },
    {
      pattern:
        "Milestones described as generic phases like 'development' or 'testing' are a known weak pattern; strong milestones name a testable artifact (a live URL, a passing CI run, a merged PR) and a date.",
      sourceId: "scf-handbook-budget",
    },
    {
      pattern:
        "For Wave repo applications, the equivalent of a milestone is a well-scoped GitHub issue: strong applications demonstrate the maintainer already knows how to break the roadmap into individually assignable, complexity-tagged issues that a single contributor can resolve within one weekly sprint.",
      sourceId: "drips-wave-contributors",
    },
  ],
};

export function sourceById(id: string): GroundingSource | undefined {
  return SOURCES.find((s) => s.id === id);
}
