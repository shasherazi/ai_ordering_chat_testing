"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { ChatProvider, useChat } from "@/context/ChatContext";

function ChatInterface() {
  const { messages, sendMessage, isSending, error } = useChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex h-screen bg-neutral-100 flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-full max-h-[800px] border border-neutral-200">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 text-white">
          <h1 className="text-xl font-bold tracking-tight">Support Chat</h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulating webhooks to{" "}
            <code className="bg-slate-800 px-1 py-0.5 rounded text-slate-300">
              /message
            </code>
          </p>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-slate-400 mt-10 text-sm">
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
                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                      isUser
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-white text-slate-800 border border-slate-200 rounded-tl-sm"
                    }`}
                  >
                    <div
                      className={`text-[10px] font-bold mb-1 uppercase tracking-wider ${isUser ? "text-blue-200" : "text-slate-400"}`}
                    >
                      {isUser ? "You" : "Model"}
                    </div>
                    <div className="leading-relaxed whitespace-pre-wrap break-words">
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
          <div className="px-6 py-2 bg-red-50 text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-white border-t border-slate-200 flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
            placeholder="I want 2 zinger burgers..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 transition-all text-black"
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl transition-colors shadow-sm"
          >
            {isSending ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Wrap the interface in the provider we created
export default function Page() {
  return (
    <ChatProvider>
      <ChatInterface />
    </ChatProvider>
  );
}
