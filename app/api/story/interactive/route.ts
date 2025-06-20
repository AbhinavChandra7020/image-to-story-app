//api/story/interactive

import { NextRequest, NextResponse } from "next/server";
import { generateInteractiveStory } from "@/app/_lib/generateInteractiveStory";
import type { InteractiveStoryPrompts } from "@/app/_types/promptTypes";

export async function GET(){

    return NextResponse.json({
        captionTxt: "This is the image interactive story endpoint"
    })
}

// POST /api/story/interactive
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as InteractiveStoryPrompts;

    if (!body.caption) {
      return NextResponse.json({ error: "Caption is required." }, { status: 400 });
    }

    const storyChunk = await generateInteractiveStory(body);
    return NextResponse.json({ story: storyChunk });
  } catch (error: any) {
    console.error("[INTERACTIVE STORY API ERROR]:", error);
    return NextResponse.json(
      { error: "Failed to generate interactive story." },
      { status: 500 }
    );
  }
}
