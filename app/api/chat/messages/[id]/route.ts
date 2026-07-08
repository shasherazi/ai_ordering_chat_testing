import { clearMessages } from "@/lib/chat-store";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params; // Await the params

  await fetch(
    `https://ai-ordering-28435915977.us-central1.run.app/message/${id}`,
    {
      method: "DELETE",
    },
  );

  clearMessages();
  return NextResponse.json({ ok: true });
}
