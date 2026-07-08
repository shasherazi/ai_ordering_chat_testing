import { NextResponse } from "next/server";
import { getMessages } from "@/lib/chat-store";

export async function GET() {
  return NextResponse.json({
    ok: true,
    messages: getMessages(),
  });
}
