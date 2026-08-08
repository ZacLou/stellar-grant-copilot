import { NextRequest, NextResponse } from "next/server";
import { proposalToPdf, pdfFilename } from "@/lib/exportPdf";
import { Proposal } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let proposal: Proposal;
  try {
    proposal = (await req.json()) as Proposal;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const pdfBytes = await proposalToPdf(proposal);
  const filename = pdfFilename(proposal);

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
