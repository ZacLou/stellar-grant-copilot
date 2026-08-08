import { buildReviewPrompt } from "@/lib/reviewPrompt";

describe("buildReviewPrompt", () => {
  it("embeds grounded patterns with source URLs for a known section", () => {
    const { system } = buildReviewPrompt("milestones", "SCF", "We will do development and testing.", {});
    expect(system).toContain("clear (obvious what's being shipped)");
    expect(system).toContain("https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/budget-and-deliverable-guidelines");
  });

  it("includes Wave-specific framing when track is Wave", () => {
    const { system } = buildReviewPrompt("budget", "Wave", "We need $10k.", {});
    expect(system).toContain("Drips Wave");
    expect(system).toContain("complexity tiers");
  });

  it("includes other section context but marks it as context-only", () => {
    const { user } = buildReviewPrompt(
      "solution",
      "SCF",
      "We build a toolkit.",
      { problemStatement: "Anchors debug SEP-24 for weeks." }
    );
    expect(user).toContain("OTHER SECTIONS (for context only");
    expect(user).toContain("Anchors debug SEP-24 for weeks.");
  });

  it("flags empty drafts explicitly to the model", () => {
    const { user } = buildReviewPrompt("team", "SCF", "   ", {});
    expect(user).toContain("(empty — the applicant has not written this section yet)");
  });
});
