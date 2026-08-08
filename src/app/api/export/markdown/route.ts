import { NextRequest, NextResponse } from "next/server";
import { proposalToMarkdown, markdownFilename } from "@/lib/exportMarkdown";
import { Proposal } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let proposal: Proposal;
  try {
    proposal = (await req.json()) as Proposal;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const markdown = proposalToMarkdown(proposal);
  const filename = markdownFilename(proposal);

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
