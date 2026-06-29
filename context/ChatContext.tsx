"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ChatMessage } from "@/lib/chat-store";

const ACCOUNT_SID = "AC123456789abcdef";
const USER_TO = "+15551234567";

function randomUsNumber() {
  const area = Math.floor(Math.random() * 800) + 200;
  const exchange = Math.floor(Math.random() * 800) + 200;
  const line = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  return `+1${area}${exchange}${line}`;
}

type ChatContextType = {
  messages: ChatMessage[];
  sendMessage: (text: string) => Promise<void>;
  resetChat: () => Promise<void>;
  recipientNumber: string;
  senderNumber: string;
  isSending: boolean;
  error: string | null;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userFrom, setUserFrom] = useState(() => randomUsNumber());

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        setUserFrom(randomUsNumber()); // Randomize sender number for each fetch to simulate different users
      }
    } catch {
      // Intentionally ignore polling errors
    }
  }, []);

  // Poll for new messages (simulates a realtime web socket / webhook incoming)
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const resetChat = useCallback(async () => {
    setIsSending(true);
    setError(null);

    try {
      const res = await fetch("/api/chat/messages", {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to reset chat");
      }

      setMessages([]);
      setUserFrom(randomUsNumber());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSending(false);
    }
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setIsSending(true);
    setError(null);

    const payload = {
      MessageSid: `SM${Date.now()}${Math.floor(Math.random() * 1000)}`,
      AccountSid: ACCOUNT_SID,
      From: userFrom,
      To: USER_TO,
      Body: text,
    };

    try {
      const res = await fetch("/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send");
      }

      await fetchMessages(); // immediately fetch locally to see the update
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        resetChat,
        recipientNumber: USER_TO,
        senderNumber: userFrom,
        isSending,
        error,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
