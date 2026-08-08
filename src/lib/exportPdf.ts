import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from "pdf-lib";
import { Proposal, SECTIONS, SECTION_ORDER } from "./types";

const PAGE_WIDTH = 612; // US Letter
const PAGE_HEIGHT = 792;
const MARGIN = 56;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const rawLine of text.split("\n")) {
    if (rawLine.trim() === "") {
      lines.push("");
      continue;
    }
    const words = rawLine.split(" ");
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      const width = font.widthOfTextAtSize(candidate, size);
      if (width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

/**
 * Renders a proposal to a simple, clean single-column PDF suitable for pasting
 * into or attaching alongside an SCF / Wave submission form.
 */
export async function proposalToPdf(proposal: Proposal): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page: PDFPage = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  function newPageIfNeeded(lineHeight: number) {
    if (y - lineHeight < MARGIN) {
      page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
    }
  }

  function drawText(text: string, font: PDFFont, size: number, gapAfter = 4) {
    const lineHeight = size * 1.35;
    const lines = wrapText(text, font, size, CONTENT_WIDTH);
    for (const line of lines) {
      newPageIfNeeded(lineHeight);
      page.drawText(line, {
        x: MARGIN,
        y,
        size,
        font,
        color: rgb(0.1, 0.1, 0.12),
      });
      y -= lineHeight;
    }
    y -= gapAfter;
  }

  drawText(proposal.title || "Untitled Proposal", bold, 20, 6);
  drawText(
    proposal.track === "SCF"
      ? "Track: Stellar Community Fund (SCF) Build Award"
      : "Track: Drips Wave — Stellar Wave Program Repo Application",
    regular,
    10,
    2
  );
  drawText(`Last updated: ${new Date(proposal.updatedAt).toISOString().slice(0, 10)}`, regular, 10, 14);

  for (const id of SECTION_ORDER) {
    const def = SECTIONS[id];
    const body = proposal.sections[id]?.trim();
    newPageIfNeeded(30);
    drawText(def.title, bold, 13, 6);
    drawText(body && body.length > 0 ? body : "(not yet written)", regular, 10.5, 14);
  }

  return doc.save();
}

export function pdfFilename(proposal: Proposal): string {
  const slug = (proposal.title || "untitled-proposal")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${slug || "untitled-proposal"}-${proposal.track.toLowerCase()}.pdf`;
}
