import { NextResponse } from "next/server";
import { addMessage } from "@/lib/chat-store";

export async function POST(request: Request) {
  const body = await request.json();
  const text = body.text?.trim() || body.Body?.trim();

  if (!text) {
    return NextResponse.json(
      { ok: false, error: "A reply requires 'text' or 'Body'." },
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
