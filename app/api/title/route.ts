// app/api/title/route.ts - Fixed endpoint path

import { NextRequest, NextResponse } from "next/server";
import { generateTitle } from "@/app/_lib/generateTitle";
import { TitleGenerationPrompts } from "@/app/_types/promptTypes";

export async function GET(){
    return NextResponse.json({
        message: "This is the title generation endpoint"
    })
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TitleGenerationPrompts;

    if (!body.storyText || typeof body.storyText !== "string") {
      return NextResponse.json({ error: "Missing or invalid storyText" }, { status: 400 });
    }

    const genre = body.genre ?? "General";

    const titles = await generateTitle({ storyText: body.storyText, genre });

    return NextResponse.json({ titles });
  } catch (error) {
    console.error("Error generating title:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}