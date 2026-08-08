import { proposalToMarkdown, markdownFilename } from "@/lib/exportMarkdown";
import { proposalToPdf, pdfFilename } from "@/lib/exportPdf";
import { Proposal } from "@/lib/types";

function sampleProposal(overrides: Partial<Proposal> = {}): Proposal {
  return {
    id: "test-id",
    title: "Test Proposal: SEP-24 Debug Toolkit",
    track: "SCF",
    sections: {
      problemStatement: "Anchors integrating SEP-24 spend weeks debugging interactive flows.",
      solution: "A CLI + web toolkit that replays and inspects SEP-24 sessions.",
      technicalArchitecture: "A proxy service records requests; a web UI visualizes state transitions.",
      team: "Jane Doe (lead) has shipped two Stellar SDKs since 2022.",
      budget: "$4,000 for Milestone 1: 80 hrs at $50/hr on the proxy service.",
      milestones: "Milestone 1 (Week 2): proxy passes CI against testnet SEP-24 flow, verified via public demo URL.",
    },
    updatedAt: "2026-01-15T00:00:00.000Z",
    ...overrides,
  };
}

describe("proposalToMarkdown", () => {
  it("includes the title, track, and all section headings", () => {
    const proposal = sampleProposal();
    const md = proposalToMarkdown(proposal);

    expect(md).toContain("# Test Proposal: SEP-24 Debug Toolkit");
    expect(md).toContain("Stellar Community Fund (SCF) Build Award");
    expect(md).toContain("## Problem Statement");
    expect(md).toContain("## Solution");
    expect(md).toContain("## Technical Architecture");
    expect(md).toContain("## Team");
    expect(md).toContain("## Budget");
    expect(md).toContain("## Milestones");
  });

  it("includes section body content verbatim", () => {
    const proposal = sampleProposal();
    const md = proposalToMarkdown(proposal);
    expect(md).toContain("Anchors integrating SEP-24 spend weeks debugging interactive flows.");
    expect(md).toContain("$4,000 for Milestone 1: 80 hrs at $50/hr on the proxy service.");
  });

  it("marks empty sections as not yet written", () => {
    const proposal = sampleProposal({
      sections: {
        problemStatement: "",
        solution: "",
        technicalArchitecture: "",
        team: "",
        budget: "",
        milestones: "",
      },
    });
    const md = proposalToMarkdown(proposal);
    const occurrences = md.match(/_\(not yet written\)_/g) ?? [];
    expect(occurrences.length).toBe(6);
  });

  it("renders Wave-specific track language", () => {
    const proposal = sampleProposal({ track: "Wave" });
    const md = proposalToMarkdown(proposal);
    expect(md).toContain("Drips Wave — Stellar Wave Program Repo Application");
    expect(md).toContain("drips.network/wave/stellar");
  });

  it("falls back to a default title when empty", () => {
    const proposal = sampleProposal({ title: "" });
    const md = proposalToMarkdown(proposal);
    expect(md).toContain("# Untitled Proposal");
  });
});

describe("markdownFilename", () => {
  it("slugifies the title and appends the track", () => {
    const proposal = sampleProposal();
    expect(markdownFilename(proposal)).toBe("test-proposal-sep-24-debug-toolkit-scf.md");
  });

  it("falls back to untitled-proposal when title is empty", () => {
    const proposal = sampleProposal({ title: "   " });
    expect(markdownFilename(proposal)).toBe("untitled-proposal-scf.md");
  });
});

describe("proposalToPdf", () => {
  it("produces a valid, non-trivial PDF byte stream", async () => {
    const proposal = sampleProposal();
    const bytes = await proposalToPdf(proposal);

    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.byteLength).toBeGreaterThan(500);

    // PDF files start with the "%PDF-" magic header.
    const header = Buffer.from(bytes.slice(0, 5)).toString("ascii");
    expect(header).toBe("%PDF-");
  });

  it("handles an empty proposal without throwing", async () => {
    const proposal = sampleProposal({
      title: "",
      sections: {
        problemStatement: "",
        solution: "",
        technicalArchitecture: "",
        team: "",
        budget: "",
        milestones: "",
      },
    });
    const bytes = await proposalToPdf(proposal);
    expect(bytes.byteLength).toBeGreaterThan(0);
  });

  it("handles very long section text across multiple pages", async () => {
    const longText = "This is a long deliverable description. ".repeat(400);
    const proposal = sampleProposal({
      sections: {
        problemStatement: longText,
        solution: longText,
        technicalArchitecture: longText,
        team: longText,
        budget: longText,
        milestones: longText,
      },
    });
    const bytes = await proposalToPdf(proposal);
    const header = Buffer.from(bytes.slice(0, 5)).toString("ascii");
    expect(header).toBe("%PDF-");
  });
});

describe("pdfFilename", () => {
  it("slugifies the title and appends the track", () => {
    const proposal = sampleProposal({ track: "Wave" });
    expect(pdfFilename(proposal)).toBe("test-proposal-sep-24-debug-toolkit-wave.pdf");
  });
});
