import { NextResponse } from "next/server";
import { addMessage } from "@/lib/chat-store";

type IncomingUserMessage = {
  MessageSid?: string;
  AccountSid?: string;
  From?: string;
  To?: string;
  Body?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as IncomingUserMessage;

  if (!body.Body || !body.From || !body.To) {
    return NextResponse.json(
      { ok: false, error: "Body, From, and To are required." },
      { status: 400 },
    );
  }

  fetch("https://ai-ordering-28435915977.us-central1.run.app/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      MessageSid: body.MessageSid,
      AccountSid: body.AccountSid,
      From: body.From,
      To: body.To,
      Body: body.Body,
    }),
  }).catch((error) => {
    console.error("Failed to forward message to /message:", error);
  });

  const message = addMessage({
    id: body.MessageSid ?? `SM${Date.now()}`,
    role: "user",
    text: body.Body,
    createdAt: new Date().toISOString(),
    raw: body as Record<string, unknown>,
  });

  return NextResponse.json({ ok: true, message });
}
