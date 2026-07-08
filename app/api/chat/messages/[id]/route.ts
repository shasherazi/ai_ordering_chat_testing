import { clearMessages } from "@/lib/chat-store";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params; // Await the params

  await fetch(`http://localhost:3000/message/${id}`, {
    method: "DELETE",
  });

  clearMessages();
  return NextResponse.json({ ok: true });
}
