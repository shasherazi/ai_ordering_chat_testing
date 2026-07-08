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

  const response = await fetch(
    "https://ai-ordering-28435915977.us-central1.run.app/webhooks/telnyx/sendMessage",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: body.from,
        to: body.to,
        text: body.text,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      {
        ok: false,
        error: `Failed to send message: ${errorText}`,
      },
      { status: response.status },
    );
  }

  const message = addMessage({
    id: `SM${Date.now()}`,
    role: "user",
    text: body.text,
    createdAt: new Date().toISOString(),
    raw: body as Record<string, unknown>,
  });

  return NextResponse.json({ ok: true, message });
}
