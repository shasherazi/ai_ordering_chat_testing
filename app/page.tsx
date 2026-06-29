"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { ChatProvider, useChat } from "@/context/ChatContext";

function ChatInterface() {
  const { messages, sendMessage, resetChat, senderNumber, isSending, error } =
    useChat();

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage(input);
    setInput("");
  };

  const handleReset = async () => {
    await resetChat();
    setInput("");
  };

  return (
    <div className="flex h-screen bg-neutral-100 flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="flex h-full max-h-[800px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
        {/* Header */}
        <div className="border-b border-slate-800 bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Support Chat</h1>
              <p className="mt-1 text-xs text-slate-400">
                Simulating webhooks to{" "}
                <code className="rounded bg-slate-800 px-1 py-0.5 text-slate-300">
                  /message
                </code>
              </p>
              <p className="mt-2 text-xs text-slate-400">
                From:{" "}
                <code className="rounded bg-slate-800 px-1 py-0.5 text-slate-300">
                  {senderNumber}
                </code>
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSending}
              className="rounded-xl bg-slate-700 px-4 py-2 text-xs font-semibold transition-colors hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500"
            >
              Reset chat
            </button>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-6">
          {messages.length === 0 ? (
            <div className="mt-10 text-center text-sm text-slate-400">
              No messages yet. Start typing below!
            </div>
          ) : (
            messages.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      isUser
                        ? "rounded-tr-sm bg-blue-600 text-white"
                        : "rounded-tl-sm border border-slate-200 bg-white text-slate-800"
                    }`}
                  >
                    <div
                      className={`mb-1 text-[10px] font-bold uppercase tracking-wider ${
                        isUser ? "text-blue-200" : "text-slate-400"
                      }`}
                    >
                      {isUser ? "You" : "Model"}
                    </div>
                    <div className="whitespace-pre-wrap break-words leading-relaxed">
                      {message.text}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 px-6 py-2 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className="flex gap-3 border-t border-slate-200 bg-white p-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
            placeholder="I want 2 zinger burgers..."
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-black transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSending ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ChatProvider>
      <ChatInterface />
    </ChatProvider>
  );
}
