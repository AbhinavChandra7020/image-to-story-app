import { NextRequest, NextResponse } from "next/server";

export async function GET(){

    return NextResponse.json({
        captionTxt: "This is the image interactive story endpoint"
    })
}
