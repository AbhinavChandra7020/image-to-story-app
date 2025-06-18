import { NextRequest, NextResponse } from "next/server";

export async function GET(){

    return NextResponse.json({
        captionTxt: "This is the one shot story endpoint"
    })
}
