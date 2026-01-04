/**
 * In-memory conversation store for 3-day MVP
 * In production, this would be replaced with database storage
 */

export type ConversationState = {
  id: string;
  studentId: string;
  studentName: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  questionCount: number;
  isComplete: boolean;
  createdAt: Date;
};

// Declare global type for Next.js to ensure singleton across route segments
declare global {
  var __conversationStore: Map<string, ConversationState> | undefined;
}

// Use globalThis to ensure a true singleton across all Next.js routes
// This prevents the issue where different route segments get different instances
const conversationStore = globalThis.__conversationStore ?? new Map<string, ConversationState>();
globalThis.__conversationStore = conversationStore;

export function getConversation(id: string): ConversationState | undefined {
  return conversationStore.get(id);
}

export function setConversation(id: string, conversation: ConversationState): void {
  conversationStore.set(id, conversation);
}

export function deleteConversation(id: string): boolean {
  return conversationStore.delete(id);
}

export function getAllConversations(): ConversationState[] {
  return Array.from(conversationStore.values());
}

export function clearOldConversations(maxAgeMs: number = 24 * 60 * 60 * 1000): number {
  const now = Date.now();
  let cleared = 0;

  for (const [id, conversation] of conversationStore.entries()) {
    if (now - conversation.createdAt.getTime() > maxAgeMs) {
      conversationStore.delete(id);
      cleared++;
    }
  }

  return cleared;
}
