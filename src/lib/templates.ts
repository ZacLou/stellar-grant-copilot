import { SectionId } from "./types";

export type TemplateId = "scf-open" | "scf-integration" | "scf-rfp" | "wave-repo";

export interface Template {
  id: TemplateId;
  label: string;
  description: string;
  track: "SCF" | "Wave";
  sections: Partial<Record<SectionId, { placeholder: string; description: string }>>;
}

export const TEMPLATES: Record<TemplateId, Template> = {
  "scf-open": {
    id: "scf-open",
    label: "SCF Open Track",
    description: "Standard SCF proposal for any Stellar ecosystem project.",
    track: "SCF",
    sections: {
      problemStatement: {
        placeholder:
          "Describe the problem in the Stellar ecosystem your project solves. Include evidence: user surveys, developer feedback, analytics data, or comparable ecosystem metrics.",
        description:
          "What specific, evidence-backed problem does this address in the Stellar ecosystem? Who experiences it, and how do you know it's real?",
      },
      solution: {
        placeholder:
          "Explain your solution in plain terms. What will you build? How does it solve the stated problem? Why is this approach better than alternatives?",
        description:
          "What are you building, and why is this approach the right one vs. alternatives?",
      },
      milestones: {
        placeholder:
          "List concrete, independently verifiable milestones with dates and acceptance criteria:\n\n- Milestone 1 (Week X): [deliverable + verification method]\n- Milestone 2 (Week Y): [deliverable + verification method]",
        description:
          "Concrete milestones with dates and acceptance criteria — not vague phases.",
      },
    },
  },

  "scf-integration": {
    id: "scf-integration",
    label: "SCF Integration Track",
    description: "For projects integrating existing services or products with Stellar.",
    track: "SCF",
    sections: {
      problemStatement: {
        placeholder:
          "Describe the integration gap. What existing service/product are you connecting to Stellar, and what user need does this integration serve? Include current user metrics if available.",
        description:
          "What integration gap in the Stellar ecosystem are you filling?",
      },
      solution: {
        placeholder:
          "Detail the integration architecture: what Stellar primitives (SEPs, Soroban, Horizon, RPC) will you use? How will the existing service connect to Stellar? Provide a technical diagram if helpful.",
        description:
          "How will you integrate with Stellar? Which primitives and APIs?",
      },
      technicalArchitecture: {
        placeholder:
          "Integration-specific architecture:\n- Existing service components and their Stellar counterparts\n- Data flow between the service and Stellar network\n- Authentication model (Stellar keys, service auth)\n- Rate limits and scalability considerations",
        description:
          "Concrete integration design — components, data flow, auth, scalability.",
      },
      milestones: {
        placeholder:
          "Integration milestones with Stellar-specific verification:\n\n- Milestone 1 (Week X): Stellar testnet integration working — verified via demo + testnet tx hash\n- Milestone 2 (Week Y): Mainnet launch — verified via production tx volume",
        description:
          "Verifiable milestones with Stellar-specific acceptance criteria.",
      },
    },
  },

  "scf-rfp": {
    id: "scf-rfp",
    label: "SCF RFP Track",
    description: "For responding to a Stellar Community Fund Request for Proposals.",
    track: "SCF",
    sections: {
      problemStatement: {
        placeholder:
          "Reference the specific RFP you are responding to. Restate the problem as defined in the RFP and explain why your team is positioned to address it specifically.",
        description:
          "Which RFP are you responding to? Restate the problem and your fit.",
      },
      solution: {
        placeholder:
          "Address each requirement in the RFP's scope section. Map your deliverables to the RFP's expected outcomes. Be explicit about any optional scope items you include or exclude.",
        description:
          "Map your solution to each RFP requirement and expected outcome.",
      },
      team: {
        placeholder:
          "Highlight team members' experience relevant to this RFP's domain. If the RFP requires specific expertise (e.g., anchor development, DeFi protocols), name who covers it and link to relevant prior work.",
        description:
          "Who covers the RFP's required expertise areas? Link to relevant prior work.",
      },
      budget: {
        placeholder:
          "Line-item budget organized by RFP deliverable, not by role. For each RFP requirement, list the cost and justify it against the expected impact.",
        description:
          "Budget organized by RFP deliverable with per-requirement justification.",
      },
    },
  },

  "wave-repo": {
    id: "wave-repo",
    label: "Wave Repo Application",
    description: "For applying to have your repo included in a Drips Wave program.",
    track: "Wave",
    sections: {
      problemStatement: {
        placeholder:
          "What open-source need does your repo address in the Stellar ecosystem? Describe the contributor audience you expect to attract during the Wave sprint.",
        description:
          "What Stellar ecosystem need does your repo serve? Who will contribute?",
      },
      solution: {
        placeholder:
          "Describe your repo's structure and tech stack. How does it enable Wave contributors to make meaningful, scoped contributions in 1-week sprints?",
        description:
          "How is your repo structured for Wave contributor success?",
      },
      milestones: {
        placeholder:
          "Roadmap decomposing into Wave-scoped issues:\n\nTrivial (100pt): [examples of 2-8hr tasks]\nMedium (150pt): [examples of 8-20hr tasks]\nHigh (200pt): [examples of 20-40hr tasks]\n\nTotal estimated points: XXX",
        description:
          "Roadmap as Trivial/Medium/High issue decomposition for Wave reviewers.",
      },
    },
  },
};

export function getTemplate(id: TemplateId): Template {
  return TEMPLATES[id];
}

export function getTemplatesByTrack(track: "SCF" | "Wave"): Template[] {
  return Object.values(TEMPLATES).filter((t) => t.track === track);
}
