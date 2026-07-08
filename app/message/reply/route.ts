import { NextResponse } from "next/server";
import { addMessage } from "@/lib/chat-store";

export async function POST(request: Request) {
  console.log("POST /message/reply");

  const body = await request.json();
  const text = body.text?.trim();

  if (!text) {
    return NextResponse.json(
      { ok: false, error: "A reply requires 'text' in the request body." },
      { status: 400 },
    );
  }

  const message = addMessage({
    id: body.MessageSid ?? `MODEL${Date.now()}`,
    role: "model",
    text,
    createdAt: new Date().toISOString(),
    raw: body,
  });

  return NextResponse.json({ ok: true, message });
}
