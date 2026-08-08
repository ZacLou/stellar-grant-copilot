import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { buildReviewPrompt } from "@/lib/reviewPrompt";
import { SECTIONS, SectionId } from "@/lib/types";

export const runtime = "nodejs";

const RequestSchema = z.object({
  sectionId: z.custom<SectionId>((v) => typeof v === "string" && v in SECTIONS),
  track: z.enum(["SCF", "Wave"]),
  sectionText: z.string(),
  fullContext: z.record(z.string()).optional().default({}),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { sectionId, track, sectionText, fullContext } = parsed.data;

  if (!sectionText || sectionText.trim().length === 0) {
    return NextResponse.json(
      { error: "Section is empty — write a draft before requesting a review." },
      { status: 400 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "ANTHROPIC_API_KEY is not configured on the server. See SETUP.md for how to set it.",
      },
      { status: 500 }
    );
  }

  const { system, user } = buildReviewPrompt(sectionId, track, sectionText, fullContext);

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system,
      messages: [{ role: "user", content: user }],
    });

    const text = response.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .filter(Boolean)
      .join("\n");

    return NextResponse.json({ review: text });
  } catch (err) {
    console.error("Review generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate review. Check server logs and your API key." },
      { status: 502 }
    );
  }
}
