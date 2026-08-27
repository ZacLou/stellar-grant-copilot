import { scoreProposal } from "../lib/scoring";
import { Proposal } from "../lib/types";

function makeProposal(overrides: Partial<Record<string, string>> = {}): Proposal {
  return {
    id: "test-1",
    title: "Test Proposal",
    track: "SCF",
    sections: {
      problemStatement: "",
      solution: "",
      technicalArchitecture: "",
      team: "",
      budget: "",
      milestones: "",
      ...overrides,
    },
    updatedAt: new Date().toISOString(),
  };
}

describe("scoreProposal", () => {
  it("returns all red for an empty proposal", () => {
    const result = scoreProposal(makeProposal());
    expect(result.overall).toBe("red");
    result.sections.forEach((s) => {
      expect(s.level).toBe("red");
      s.checks.forEach((c) => expect(c.passed).toBe(false));
    });
  });

  it("returns yellow for partially filled proposal", () => {
    const result = scoreProposal(
      makeProposal({
        problemStatement:
          "Many developers struggle with Stellar wallet integration because they lack a clear guide. Survey data shows 60% drop-off during onboarding.",
        solution:
          "We will build a developer toolkit that simplifies wallet integration by providing a unified SDK with pre-built UI components and clear documentation.",
      })
    );
    // problemStatement should be green (all checks pass), some others still red
    const ps = result.sections.find((s) => s.sectionId === "problemStatement")!;
    expect(ps.level).toBe("green");
    const sol = result.sections.find((s) => s.sectionId === "solution")!;
    expect(sol.level).not.toBe("red");
  });

  it("returns green for a complete, well-written proposal", () => {
    const result = scoreProposal(
      makeProposal({
        problemStatement:
          "Stellar developers face a critical problem: integrating anchors requires debugging SEP-24 for weeks. Our survey of 50 developers shows 80% experience this issue. The problem affects wallets and dApps across the ecosystem.",
        solution:
          "We will build a lightweight SDK that wraps SEP-24 into a 3-line integration, replacing the current fragmented approach. Unlike existing solutions that require manual flow handling, our SDK provides an automatic state machine.",
        technicalArchitecture:
          "The system consists of three components: (1) a Soroban contract for on-chain verification, (2) a TypeScript SDK with React hooks, (3) an indexer for transaction tracking. Integration points include Horizon API, SEP-24 endpoints, and Freighter wallet. Key risks include anchor API changes and RPC rate limits.",
        team:
          "Jane Doe (lead dev) has shipped 3 Stellar projects since 2022 including the Stellar-Wallet-Kit. John Smith (frontend) contributed to stellar-docs. Jane handles the Soroban contract and SDK core, John owns the frontend components and testing.",
        budget:
          "$4,000 — Milestone 1 (core SDK): 80 hrs @ $50/hr. $3,000 — Milestone 2 (React components): 60 hrs @ $50/hr. $1,500 — Milestone 3 (docs + examples): 30 hrs @ $50/hr. Includes 10% buffer for unexpected scope.",
        milestones:
          "Milestone 1 (Week 2): SDK wraps SEP-24 flow; verified via passing CI + demo URL. Milestone 2 (Week 4): React components with Storybook; verified via public dashboard. Milestone 3 (Week 6): Deployed docs site with interactive examples; verified via GitHub Pages URL.",
      })
    );
    expect(result.overall).toBe("green");
  });

  it("detects missing technical specifics", () => {
    const result = scoreProposal(
      makeProposal({
        problemStatement:
          "Developers need better tools for Stellar because the ecosystem is growing rapidly. This is a well-known problem in the community.",
        solution:
          "We will create a comprehensive platform that solves multiple developer pain points. The platform will be easy to use and well-documented.",
        technicalArchitecture: "",
        team: "",
        budget: "",
        milestones: "",
      })
    );
    const arch = result.sections.find((s) => s.sectionId === "technicalArchitecture")!;
    expect(arch.level).toBe("red");
  });
});
