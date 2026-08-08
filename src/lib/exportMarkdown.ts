import { Proposal, SECTIONS, SECTION_ORDER } from "./types";

/**
 * Renders a proposal to Markdown in a layout matching how SCF Build applications
 * and Drips Wave repo applications are structured: a title/track header followed
 * by the standard sections in order, each under its own heading.
 * See: https://stellar.gitbook.io/scf-handbook/scf-awards/build-award
 *      https://docs.drips.network/wave/maintainers/participating-in-a-wave/
 */
export function proposalToMarkdown(proposal: Proposal): string {
  const lines: string[] = [];

  lines.push(`# ${proposal.title || "Untitled Proposal"}`);
  lines.push("");
  lines.push(`**Track:** ${proposal.track === "SCF" ? "Stellar Community Fund (SCF) Build Award" : "Drips Wave — Stellar Wave Program Repo Application"}`);
  lines.push(`**Last updated:** ${new Date(proposal.updatedAt).toISOString().slice(0, 10)}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  for (const id of SECTION_ORDER) {
    const def = SECTIONS[id];
    const body = proposal.sections[id]?.trim();
    lines.push(`## ${def.title}`);
    lines.push("");
    lines.push(body && body.length > 0 ? body : "_(not yet written)_");
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push(
    `_Drafted with stellar-grant-copilot. ${
      proposal.track === "SCF"
        ? "Submit via the SCF interest form at communityfund.stellar.org."
        : "Submit your repo for approval at drips.network/wave/stellar."
    }_`
  );

  return lines.join("\n");
}

export function markdownFilename(proposal: Proposal): string {
  const slug = (proposal.title || "untitled-proposal")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${slug || "untitled-proposal"}-${proposal.track.toLowerCase()}.md`;
}
