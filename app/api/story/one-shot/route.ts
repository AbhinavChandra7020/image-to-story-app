//import api/story/one-shot

import { NextRequest, NextResponse } from "next/server";
import { generateOneShotStory } from "@/app/_lib/generateOneShotStory";
import type { OneShotStoryPrompts } from "@/app/_types/promptTypes";

export async function GET(){

    return NextResponse.json({
        captionTxt: "This is the one shot story endpoint"
    })
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<OneShotStoryPrompts>;

    const {
      caption,
      genre = "General",
      storySoFar = "",
      chunkTarget = 800,
      instruction = "continue",
      focusMode = "balanced",
      creativityLevel = "balanced",
      consistencyMode = false,
    } = body;

    if (!caption) {
      return NextResponse.json({ error: "Caption is required" }, { status: 400 });
    }

    const storyChunk = await generateOneShotStory({
      caption,
      genre,
      storySoFar,
      chunkTarget,
      instruction,
      focusMode,
      creativityLevel,
      consistencyMode,
    });

    return NextResponse.json({ story: storyChunk });
  } catch (err) {
    console.error("[ONE_SHOT_ERROR]", err);
    return NextResponse.json({ error: "Failed to generate one-shot story" }, { status: 500 });
  }
}
