// spec: specs/003-chat-guest-view.md § スレッド一覧ビュー
// activeThreadId が null のときに表示されるスレッド一覧

import type { Thread } from "../../context/ChatContext";
import type { CandidateRecord } from "../../types/candidates";

type Props = {
  threads: Record<string, Thread>;
  candidates: CandidateRecord[];
  onSelectThread: (candidateId: string) => void;
};

function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function initials(name: string): string {
  const parts = name.trim().split(/[\s　]+/);
  return parts.map((p) => p[0]).join("").slice(0, 2);
}

export function ThreadListView({ threads, candidates, onSelectThread }: Props) {
  const threadList = Object.values(threads).filter((t) => t.messages.length > 0);

  if (threadList.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center h-64 text-gray-400 text-sm"
        data-testid="empty-thread-list"
      >
        <p>まだスレッドはありません</p>
        <p className="mt-1">候補者カードから打診してみましょう</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {threadList.map((thread) => {
        const candidate = candidates.find((c) => c.id === thread.candidateId);
        const lastMsg = thread.messages.at(-1);
        if (!candidate) return null;

        return (
          <li key={thread.candidateId}>
            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 cursor-pointer text-left"
              onClick={() => onSelectThread(thread.candidateId)}
              aria-label={`${candidate.name}様のスレッドを開く`}
            >
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {initials(candidate.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 text-sm">{candidate.name}様</span>
                  {lastMsg && (
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {formatTimestamp(lastMsg.timestamp)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{candidate.company}</p>
                {lastMsg && (
                  <p className="text-xs text-gray-400 truncate mt-0.5" data-testid={`last-msg-${thread.candidateId}`}>
                    {lastMsg.text}
                  </p>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
