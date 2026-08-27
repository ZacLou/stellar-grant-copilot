export type ReviewerPersona = "scf-panel" | "wave-maintainer";

export interface PersonaConfig {
  id: ReviewerPersona;
  label: string;
  description: string;
  toneHint: string;
}

export const PERSONAS: Record<ReviewerPersona, PersonaConfig> = {
  "scf-panel": {
    id: "scf-panel",
    label: "SCF Panel",
    description:
      "Review tone matching the Stellar Community Fund panel. Emphasizes budget justification, deliverable clarity, and ecosystem impact.",
    toneHint:
      "You are an SCF panel reviewer. Evaluate this section for: (1) clear, evidence-backed problem statement; (2) specific, verifiable deliverables tied to budget line items; (3) realistic timeline; (4) ecosystem impact. Be direct about gaps but constructive in tone.",
  },
  "wave-maintainer": {
    id: "wave-maintainer",
    label: "Wave Maintainer",
    description:
      "Review tone matching a Drips Wave repo maintainer. Emphasizes issue decomposition, contributor accessibility, and sprint feasibility.",
    toneHint:
      "You are a Drips Wave repo maintainer reviewing a repository application. Evaluate this section for: (1) well-scoped issues (Trivial/Medium/High); (2) contributor onboarding clarity; (3) whether the roadmap is realistic for 1-week sprints; (4) alignment with Stellar ecosystem needs. Be practical and sprint-focused.",
  },
};

export function getPersonaConfig(persona: ReviewerPersona): PersonaConfig {
  return PERSONAS[persona];
}
