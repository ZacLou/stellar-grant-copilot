import { Proposal, SectionId, SECTION_ORDER } from "./types";

export type ReadinessLevel = "red" | "yellow" | "green";

export interface SectionScore {
  sectionId: SectionId;
  title: string;
  level: ReadinessLevel;
  checks: CheckResult[];
}

export interface CheckResult {
  label: string;
  passed: boolean;
}

export interface ProposalScore {
  overall: ReadinessLevel;
  sections: SectionScore[];
}

const MIN_SECTION_LENGTH = 50;

function isNotEmpty(text: string): boolean {
  return text.trim().length >= MIN_SECTION_LENGTH;
}

function hasKeywords(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

function hasNumbers(text: string): boolean {
  return /\d/.test(text);
}

function scoreProblemStatement(text: string): CheckResult[] {
  return [
    {
      label: "Describes a specific problem",
      passed: isNotEmpty(text) && hasKeywords(text, ["problem", "issue", "challenge", "gap", "need", "lack"]),
    },
    {
      label: "Identifies who is affected",
      passed: hasKeywords(text, ["user", "developer", "anchor", "wallet", "dapp", "community", "ecosystem"]),
    },
    {
      label: "Provides evidence or data",
      passed: hasNumbers(text) || hasKeywords(text, ["survey", "data", "research", "interview", "feedback", "metric"]),
    },
  ];
}

function scoreSolution(text: string): CheckResult[] {
  return [
    {
      label: "Explains the solution clearly",
      passed: isNotEmpty(text) && hasKeywords(text, ["build", "create", "develop", "implement", "design", "deliver"]),
    },
    {
      label: "Addresses the stated problem",
      passed: isNotEmpty(text),
    },
    {
      label: "Mentions alternatives and rationale",
      passed: hasKeywords(text, ["alternative", "instead", "rather than", "compared to", "unlike", "existing"]),
    },
  ];
}

function scoreTechnicalArchitecture(text: string): CheckResult[] {
  return [
    {
      label: "Lists concrete components or tech stack",
      passed: hasKeywords(text, ["component", "stack", "api", "sdk", "contract", "database", "indexer", "frontend", "backend", "soroban", "react", "rust"]),
    },
    {
      label: "Describes Stellar/Soroban integration points",
      passed: hasKeywords(text, ["stellar", "soroban", "horizon", "rpc", "sep", "freighter", "sacl", "turret"]),
    },
    {
      label: "Identifies key technical risks",
      passed: hasKeywords(text, ["risk", "challenge", "limitation", "tradeoff", "bottleneck", "concern"]),
    },
  ];
}

function scoreTeam(text: string): CheckResult[] {
  return [
    {
      label: "Names specific team members",
      passed: hasKeywords(text, ["name", "lead", "role", "@", "github"]) || hasNumbers(text) || text.trim().length > 200,
    },
    {
      label: "Describes relevant track record",
      passed: hasKeywords(text, ["shipped", "built", "delivered", "contributed", "experience", "worked", "prior"]),
    },
    {
      label: "Explains work division",
      passed: hasKeywords(text, ["responsible", "lead", "role", "focus", "handling", "owning"]),
    },
  ];
}

function scoreBudget(text: string): CheckResult[] {
  return [
    {
      label: "Includes line-item breakdown",
      passed: isNotEmpty(text) && hasNumbers(text),
    },
    {
      label: "Ties costs to deliverables",
      passed: hasKeywords(text, ["milestone", "deliverable", "hour", "week", "month", "rate"]),
    },
    {
      label: "Amounts are reasonable and justified",
      passed: isNotEmpty(text) && text.trim().length > 100,
    },
  ];
}

function scoreMilestones(text: string): CheckResult[] {
  return [
    {
      label: "Has concrete, dated milestones",
      passed: hasKeywords(text, ["week", "month", "day", "date", "q1", "q2", "q3", "q4"]) || hasNumbers(text),
    },
    {
      label: "Specifies acceptance criteria",
      passed: hasKeywords(text, ["criteria", "verify", "test", "acceptance", "review", "check", "pass"]),
    },
    {
      label: "Outcomes are independently verifiable",
      passed: hasKeywords(text, ["url", "dashboard", "public", "repo", "github", "demo", "deployed"]),
    },
  ];
}

function computeLevel(checks: CheckResult[]): ReadinessLevel {
  const passed = checks.filter((c) => c.passed).length;
  const total = checks.length;
  if (passed === total) return "green";
  if (passed >= total - 1) return "yellow";
  return "red";
}

const SCORERS: Record<SectionId, (text: string) => CheckResult[]> = {
  problemStatement: scoreProblemStatement,
  solution: scoreSolution,
  technicalArchitecture: scoreTechnicalArchitecture,
  team: scoreTeam,
  budget: scoreBudget,
  milestones: scoreMilestones,
};

export function scoreProposal(proposal: Proposal): ProposalScore {
  const sections: SectionScore[] = SECTION_ORDER.map((id) => {
    const title = id.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
    const text = proposal.sections[id] ?? "";
    const checks = SCORERS[id](text);
    const level = computeLevel(checks);
    return { sectionId: id, title, level, checks };
  });

  const levels = sections.map((s) => s.level);
  const greenCount = levels.filter((l) => l === "green").length;
  const redCount = levels.filter((l) => l === "red").length;
  const overall: ReadinessLevel = greenCount === sections.length
    ? "green"
    : redCount > 0
      ? "red"
      : "yellow";

  return { overall, sections };
}
