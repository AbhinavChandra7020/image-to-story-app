// app/api/story/one-shot/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateOneShotStory } from "@/app/_lib/generateOneShotStory";
import type { OneShotStoryPrompts } from "@/app/_types/promptTypes";

export async function GET() {
  return NextResponse.json({
    message: "One-shot story generation endpoint",
    status: "active"
  });
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

    // Validate required fields
    if (!caption) {
      return NextResponse.json(
        { error: "Caption is required for story generation" }, 
        { status: 400 }
      );
    }

    // Validate chunk target range
    if (chunkTarget < 100 || chunkTarget > 1500) {
      return NextResponse.json(
        { error: "Chunk target must be between 100 and 1500 words" }, 
        { status: 400 }
      );
    }

    console.log(`[ONE_SHOT_API] Generating ${instruction} chunk with ${chunkTarget} words for ${genre} story`);

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

    const wordCount = storyChunk.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    console.log(`[ONE_SHOT_API] Generated chunk: ${wordCount} words`);

    return NextResponse.json({ 
      story: storyChunk,
      wordCount,
      instruction,
      genre
    });

  } catch (err) {
    console.error("[ONE_SHOT_ERROR]", err);
    
    // Return more specific error messages
    if (err instanceof Error) {
      if (err.message.includes("ECONNREFUSED")) {
        return NextResponse.json(
          { error: "Cannot connect to Ollama server. Please make sure Ollama is running on localhost:11434" }, 
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { error: `Story generation failed: ${err.message}` }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "An unexpected error occurred during story generation" }, 
      { status: 500 }
    );
  }
}