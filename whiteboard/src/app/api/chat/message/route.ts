// Chat message API route
// NOTE: Chat feature (chatMessage, chatRoom models) is not yet implemented in the schema.
// This route returns 501 until the feature is added to the Prisma schema.

import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  return NextResponse.json(
    { error: "Chat feature not yet implemented" },
    { status: 501 },
  );
}

export async function POST(_request: NextRequest) {
  return NextResponse.json(
    { error: "Chat feature not yet implemented" },
    { status: 501 },
  );
}
