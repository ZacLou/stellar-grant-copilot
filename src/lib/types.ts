export type SectionId =
  | "problemStatement"
  | "solution"
  | "technicalArchitecture"
  | "team"
  | "budget"
  | "milestones";

export interface SectionDef {
  id: SectionId;
  title: string;
  description: string;
  placeholder: string;
}

export const SECTION_ORDER: SectionId[] = [
  "problemStatement",
  "solution",
  "technicalArchitecture",
  "team",
  "budget",
  "milestones",
];

export const SECTIONS: Record<SectionId, SectionDef> = {
  problemStatement: {
    id: "problemStatement",
    title: "Problem Statement",
    description:
      "What specific, evidence-backed problem does this address in the Stellar ecosystem? Who experiences it, and how do you know it's real?",
    placeholder:
      "e.g. Anchors integrating SEP-24 currently spend N weeks debugging interactive flows because...",
  },
  solution: {
    id: "solution",
    title: "Solution",
    description:
      "What are you building, in plain terms? How does it solve the problem, and why is this approach the right one (vs. alternatives)?",
    placeholder: "e.g. We will build a lightweight SDK that...",
  },
  technicalArchitecture: {
    id: "technicalArchitecture",
    title: "Technical Architecture",
    description:
      "Concrete technical design: components, stack, integration points with Stellar/Soroban, data flow, and key technical risks.",
    placeholder: "e.g. The system consists of three components: (1) an indexer...",
  },
  team: {
    id: "team",
    title: "Team",
    description:
      "Who is building this, what is their relevant track record (shipped repos, prior Stellar/SCF/Wave work), and how is work divided?",
    placeholder: "e.g. Jane Doe (lead dev) has shipped X, Y on Stellar since 2022...",
  },
  budget: {
    id: "budget",
    title: "Budget",
    description:
      "Line-item budget tied directly to deliverables, not just hours. Justify each line by referencing the milestone it funds.",
    placeholder: "e.g. $4,000 — Milestone 1 (core indexer): 80 hrs @ $50/hr...",
  },
  milestones: {
    id: "milestones",
    title: "Milestones",
    description:
      "Concrete, independently verifiable milestones with dates and acceptance criteria — not vague phases like 'development' or 'testing'.",
    placeholder:
      "e.g. Milestone 1 (Week 2): Indexer syncs testnet ledger 1000 blocks; verified via public dashboard URL + passing CI.",
  },
};

export type ProposalSections = Record<SectionId, string>;

export interface Proposal {
  id: string;
  title: string;
  track: "SCF" | "Wave";
  sections: ProposalSections;
  updatedAt: string;
}

export function emptyProposal(): Proposal {
  return {
    id: crypto.randomUUID?.() ?? String(Date.now()),
    title: "Untitled Proposal",
    track: "SCF",
    sections: {
      problemStatement: "",
      solution: "",
      technicalArchitecture: "",
      team: "",
      budget: "",
      milestones: "",
    },
    updatedAt: new Date().toISOString(),
  };
}
