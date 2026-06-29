export type ChatMessage = {
  id: string;
  role: "user" | "model";
  text: string;
  createdAt: string;
  raw?: Record<string, unknown>;
};

type ChatStore = {
  messages: ChatMessage[];
};

// Next.js development hot-reloads clear standard variables.
// This global object keeps messages intact across local recompiles.
const globalForChat = globalThis as unknown as {
  __chatStore?: ChatStore;
};

export const chatStore: ChatStore = globalForChat.__chatStore ?? {
  messages: [],
};

if (!globalForChat.__chatStore) {
  globalForChat.__chatStore = chatStore;
}

export function addMessage(message: ChatMessage) {
  chatStore.messages.push(message);
  return message;
}

export function getMessages() {
  return chatStore.messages;
}

export function clearMessages() {
  chatStore.messages.length = 0;
}
