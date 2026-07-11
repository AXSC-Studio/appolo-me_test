// spec: specs/003-chat-guest-view.md § Data / State (ChatContext)
// スレッド管理: candidateId をキーに Message[] を蓄積

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// ── 型定義 ───────────────────────────────────────────────────

export type MessageRole = "host" | "guest";

export type Message = {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: number; // Date.now()
};

export type Thread = {
  candidateId: string;
  messages: Message[];
};

type ChatContextValue = {
  threads: Record<string, Thread>;
  activeThreadId: string | null;
  setActiveThread: (candidateId: string) => void;
  clearActiveThread: () => void;
  sendMessage: (candidateId: string, text: string) => void;
};

// ── モック返信 ───────────────────────────────────────────────

export const MOCK_REPLIES = [
  "ご連絡ありがとうございます。出張のタイミングでぜひお会いしましょう！",
  "承知しました。ご都合の良い日時を教えていただけますか？",
  "ありがとうございます。詳細について確認してご返信します。",
];

// ── Context ──────────────────────────────────────────────────

const ChatContext = createContext<ChatContextValue | null>(null);

let msgCounter = 0;
function newId(): string {
  return `msg-${Date.now()}-${++msgCounter}`;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<Record<string, Thread>>({});
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  const setActiveThread = useCallback((candidateId: string) => {
    setThreads((prev) => {
      if (prev[candidateId]) return prev;
      return {
        ...prev,
        [candidateId]: { candidateId, messages: [] },
      };
    });
    setActiveThreadId(candidateId);
  }, []);

  const clearActiveThread = useCallback(() => {
    setActiveThreadId(null);
  }, []);

  const sendMessage = useCallback((candidateId: string, text: string) => {
    const hostMsg: Message = {
      id: newId(),
      role: "host",
      text,
      timestamp: Date.now(),
    };

    // host メッセージを追加
    setThreads((prev) => ({
      ...prev,
      [candidateId]: {
        candidateId,
        messages: [...(prev[candidateId]?.messages ?? []), hostMsg],
      },
    }));

    // 1500ms後にゲスト（モック）返信を追加
    setTimeout(() => {
      const reply = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
      const guestMsg: Message = {
        id: newId(),
        role: "guest",
        text: reply,
        timestamp: Date.now(),
      };
      setThreads((prev) => ({
        ...prev,
        [candidateId]: {
          candidateId,
          messages: [...(prev[candidateId]?.messages ?? []), guestMsg],
        },
      }));
    }, 1500);
  }, []);

  return (
    <ChatContext.Provider
      value={{ threads, activeThreadId, setActiveThread, clearActiveThread, sendMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx)
    throw new Error(
      "useChatContext は ChatProvider の内側で使用してください"
    );
  return ctx;
}
