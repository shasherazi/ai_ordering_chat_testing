import { NextResponse } from "next/server";
import { addMessage } from "@/lib/chat-store";

type IncomingUserMessage = {
  from?: string;
  to?: string;
  text?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as IncomingUserMessage;

  if (!body.text || !body.from || !body.to) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Missing required fields: 'from', 'to', and 'text' are required.",
      },
      { status: 400 },
    );
  }

  fetch("http://localhost:3000/webhooks/telnyx/sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      from: body.from,
      to: body.to,
      text: body.text,
    }),
  }).catch((error) => {
    console.error("Failed to forward message to /message:", error);
  });

  const message = addMessage({
    id: `SM${Date.now()}`,
    role: "user",
    text: body.text,
    createdAt: new Date().toISOString(),
    raw: body as Record<string, unknown>,
  });

  return NextResponse.json({ ok: true, message });
}
