//api/caption

import { NextRequest, NextResponse } from "next/server";
import { generateCaptionFromBase64 } from "@/app/_lib/generateCaption";
export async function GET(){

    return NextResponse.json({
        captionTxt: "This is the image caption endpoint"
    })
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const detailLevel = (formData.get("detailLevel") as string) || "detailed";

    if (!file) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    const caption = await generateCaptionFromBase64(base64, detailLevel as "detailed" | "short");

    return NextResponse.json({ caption });
  } catch (error) {
    console.error("[CAPTION ERROR]", error);
    return NextResponse.json({ error: "Failed to generate caption" }, { status: 500 });
  }
}
