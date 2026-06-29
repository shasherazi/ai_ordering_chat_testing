import { NextResponse } from "next/server";
import { clearMessages, getMessages } from "@/lib/chat-store";

export async function GET() {
  return NextResponse.json({
    ok: true,
    messages: getMessages(),
  });
}

export async function DELETE() {
  clearMessages();
  return NextResponse.json({ ok: true });
}
