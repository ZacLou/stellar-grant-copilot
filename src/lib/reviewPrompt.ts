import { REVIEW_PATTERNS, sourceById } from "./fewshot";
import { SECTIONS, SectionId } from "./types";

export function buildReviewPrompt(
  sectionId: SectionId,
  track: "SCF" | "Wave",
  sectionText: string,
  fullContext: Partial<Record<SectionId, string>>
): { system: string; user: string } {
  const def = SECTIONS[sectionId];
  const patterns = REVIEW_PATTERNS[sectionId] ?? [];

  const groundingBlock = patterns
    .map((p, i) => {
      const src = sourceById(p.sourceId);
      return `${i + 1}. ${p.pattern}${src ? ` [Source: ${src.label} — ${src.url}]` : ""}`;
    })
    .join("\n");

  const contextBlock = Object.entries(fullContext)
    .filter(([id, text]) => id !== sectionId && text && text.trim().length > 0)
    .map(([id, text]) => `### ${SECTIONS[id as SectionId].title}\n${text}`)
    .join("\n\n");

  const system = `You are a meticulous, ecosystem-native reviewer for Stellar grant applications, modeled on how ${track === "SCF" ? "Stellar Community Fund (SCF)" : "Drips Wave (Stellar Wave Program repo applications)"} reviewers actually evaluate submissions.

Ground your feedback in these publicly documented patterns for the "${def.title}" section (cite them by number when you use them):
${groundingBlock || "(no specific patterns loaded for this section — fall back to general grant-writing rigor)"}

Rules:
- Be specific and actionable. Never say generic things like "add more detail" without saying exactly what detail and why it matters to a reviewer.
- Quote or closely paraphrase the weakest 1-3 phrases from the applicant's draft and say precisely what's wrong with them (vague, unverifiable, missing a number, missing a date, etc.).
- Where relevant, rewrite one weak sentence from the draft into a strong version, so the applicant sees the pattern in action.
- Call out realistic-scope problems: is this actually doable in the stated timeframe/budget, or does it read as over-scoped?
- If the section is genuinely strong, say so plainly and explain which pattern it satisfies — don't invent problems to fill space.
- Keep the whole response under ~350 words, structured with short headers: Strengths, Issues (numbered), Suggested rewrite (if applicable).
- Do not fabricate facts about the applicant's project. Only comment on what's in the draft and the other sections provided as context.`;

  const user = `TRACK: ${track}
SECTION: ${def.title}
SECTION GUIDANCE: ${def.description}

${contextBlock ? `OTHER SECTIONS (for context only, do not review these directly):\n${contextBlock}\n\n` : ""}DRAFT TEXT TO REVIEW:
"""
${sectionText.trim() || "(empty — the applicant has not written this section yet)"}
"""

Give your review now.`;

  return { system, user };
}
