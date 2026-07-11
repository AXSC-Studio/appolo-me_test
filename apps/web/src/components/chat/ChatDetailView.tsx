// spec: specs/003-chat-guest-view.md § チャット詳細ビュー
// ホスト=右・ブランドオレンジ / ゲスト=左・グレー

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import type { Message } from "../../context/ChatContext";
import type { CandidateRecord } from "../../types/candidates";

type Props = {
  candidateId: string;
  candidate: CandidateRecord;
  messages: Message[];
  onBack: () => void;
  onSend: (text: string) => void;
};

function formatTime(ts: number): string {
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export function ChatDetailView({ candidate, messages, onBack, onSend }: Props) {
  const [inputText, setInputText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const text = inputText.trim();
    if (!text) return;
    onSend(text);
    setInputText("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white flex-shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-500 hover:text-gray-800 cursor-pointer p-1 -ml-1"
          aria-label="スレッド一覧に戻る"
        >
          ←
        </button>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{candidate.name}様</p>
          <p className="text-xs text-gray-500">{candidate.company}</p>
        </div>
      </div>

      {/* メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-8">
            打診テキストを貼り付けて送信してください
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "host" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "host"
                  ? "bg-orange-500 text-white rounded-br-sm"
                  : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
              }`}
              data-testid={`bubble-${msg.role}`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.role === "host" ? "text-orange-200 text-right" : "text-gray-400"}`}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 入力フォーム */}
      <div className="flex items-end gap-2 px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0">
        <textarea
          className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-400 transition-colors min-h-[44px] max-h-32"
          placeholder="メッセージを入力… (Enter送信 / Shift+Enter改行)"
          rows={1}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          data-testid="message-input"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!inputText.trim()}
          className="flex-shrink-0 bg-orange-500 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          data-testid="send-button"
        >
          送信
        </button>
      </div>
    </div>
  );
}
