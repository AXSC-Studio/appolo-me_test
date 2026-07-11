// spec: specs/003-chat-guest-view.md § Internal Design
// URLパラメータ ?candidateId= → setActiveThread → 詳細ビュー or 一覧ビュー

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useChatContext } from "../../context/ChatContext";
import { DUMMY_CANDIDATES } from "../../data/candidateDummyDB";
import { ThreadListView } from "./ThreadListView";
import { ChatDetailView } from "./ChatDetailView";

export function ChatView() {
  const [searchParams] = useSearchParams();
  const { threads, activeThreadId, setActiveThread, clearActiveThread, sendMessage } =
    useChatContext();

  const candidateIdParam = searchParams.get("candidateId");

  // URLパラメータからアクティブスレッドを初期化
  useEffect(() => {
    if (candidateIdParam) {
      setActiveThread(candidateIdParam);
    }
  }, [candidateIdParam, setActiveThread]);

  const activeThread =
    activeThreadId != null ? threads[activeThreadId] ?? null : null;
  const activeCandidate =
    activeThreadId != null
      ? DUMMY_CANDIDATES.find((c) => c.id === activeThreadId) ?? null
      : null;

  return (
    <div className="flex flex-col h-full" data-testid="chat-view">
      {/* ページヘッダー（一覧表示時のみ） */}
      {activeThread == null && (
        <div className="px-4 py-4 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900">ゲストとのやりとり</h1>
        </div>
      )}

      {/* 本体 */}
      <div className="flex-1 overflow-hidden">
        {activeThread != null && activeCandidate != null ? (
          <ChatDetailView
            candidateId={activeThreadId!}
            candidate={activeCandidate}
            messages={activeThread.messages}
            onBack={clearActiveThread}
            onSend={(text) => sendMessage(activeThreadId!, text)}
          />
        ) : (
          <ThreadListView
            threads={threads}
            candidates={DUMMY_CANDIDATES}
            onSelectThread={setActiveThread}
          />
        )}
      </div>
    </div>
  );
}
