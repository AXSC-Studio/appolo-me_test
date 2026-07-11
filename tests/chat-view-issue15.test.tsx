// TDD GREEN — Issue #15: ChatView (ThreadListView + ChatDetailView + ChatView)
// spec: specs/003-chat-guest-view.md § Screen / External Design

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ChatProvider } from "../apps/web/src/context/ChatContext";
import { ChatView } from "../apps/web/src/components/chat/ChatView";
import { ThreadListView } from "../apps/web/src/components/chat/ThreadListView";
import { ChatDetailView } from "../apps/web/src/components/chat/ChatDetailView";
import type { Thread, Message } from "../apps/web/src/context/ChatContext";
import { DUMMY_CANDIDATES } from "../apps/web/src/data/candidateDummyDB";

// ── ヘルパー ─────────────────────────────────────────────────

function renderChatView(search = "") {
  return render(
    <MemoryRouter initialEntries={[`/chat${search}`]}>
      <ChatProvider>
        <ChatView />
      </ChatProvider>
    </MemoryRouter>
  );
}

const MOCK_CANDIDATE = DUMMY_CANDIDATES[0]; // 佐藤 健一 / c001

function makeThread(candidateId: string, messages: Message[] = []): Thread {
  return { candidateId, messages };
}

function makeMessage(role: "host" | "guest", text: string): Message {
  return { id: `msg-${Math.random()}`, role, text, timestamp: Date.now() };
}

// ── ThreadListView ────────────────────────────────────────────

describe("ThreadListView", () => {
  it("スレッドが空のとき「まだスレッドはありません」を表示する", () => {
    render(
      <ThreadListView
        threads={{}}
        candidates={DUMMY_CANDIDATES}
        onSelectThread={vi.fn()}
      />
    );
    expect(screen.getByTestId("empty-thread-list")).toBeInTheDocument();
  });

  it("メッセージのないスレッドは一覧に表示しない", () => {
    const threads = { c001: makeThread("c001") };
    render(
      <ThreadListView
        threads={threads}
        candidates={DUMMY_CANDIDATES}
        onSelectThread={vi.fn()}
      />
    );
    expect(screen.getByTestId("empty-thread-list")).toBeInTheDocument();
  });

  it("メッセージのあるスレッドは候補者名を表示する", () => {
    const threads = {
      c001: makeThread("c001", [makeMessage("host", "テスト送信")]),
    };
    render(
      <ThreadListView
        threads={threads}
        candidates={DUMMY_CANDIDATES}
        onSelectThread={vi.fn()}
      />
    );
    expect(screen.getByText("佐藤 健一様")).toBeInTheDocument();
    expect(screen.getByTestId("last-msg-c001")).toHaveTextContent("テスト送信");
  });

  it("スレッドカードクリックで onSelectThread が candidateId を渡して呼ばれる", async () => {
    const onSelect = vi.fn();
    const threads = {
      c001: makeThread("c001", [makeMessage("host", "hi")]),
    };
    const user = userEvent.setup();
    render(
      <ThreadListView
        threads={threads}
        candidates={DUMMY_CANDIDATES}
        onSelectThread={onSelect}
      />
    );
    await user.click(screen.getByRole("button", { name: /佐藤 健一様のスレッドを開く/ }));
    expect(onSelect).toHaveBeenCalledWith("c001");
  });
});

// ── ChatDetailView ────────────────────────────────────────────

describe("ChatDetailView", () => {
  it("空状態で「打診テキストを貼り付けて送信してください」を表示", () => {
    render(
      <MemoryRouter>
        <ChatDetailView
          candidateId="c001"
          candidate={MOCK_CANDIDATE}
          messages={[]}
          onBack={vi.fn()}
          onSend={vi.fn()}
        />
      </MemoryRouter>
    );
    expect(screen.getByText(/打診テキストを貼り付けて送信してください/)).toBeInTheDocument();
  });

  it("ヘッダーに候補者名と会社名が表示される", () => {
    render(
      <MemoryRouter>
        <ChatDetailView
          candidateId="c001"
          candidate={MOCK_CANDIDATE}
          messages={[]}
          onBack={vi.fn()}
          onSend={vi.fn()}
        />
      </MemoryRouter>
    );
    expect(screen.getByText("佐藤 健一様")).toBeInTheDocument();
    expect(screen.getByText("株式会社テックスタート")).toBeInTheDocument();
  });

  it("メッセージが表示される（host=right bubble, guest=left bubble）", () => {
    const messages: Message[] = [
      makeMessage("host", "こんにちは"),
      makeMessage("guest", "よろしく"),
    ];
    render(
      <MemoryRouter>
        <ChatDetailView
          candidateId="c001"
          candidate={MOCK_CANDIDATE}
          messages={messages}
          onBack={vi.fn()}
          onSend={vi.fn()}
        />
      </MemoryRouter>
    );
    expect(screen.getByText("こんにちは")).toBeInTheDocument();
    expect(screen.getByText("よろしく")).toBeInTheDocument();
  });

  it("入力欄が空のとき送信ボタンが disabled", () => {
    render(
      <MemoryRouter>
        <ChatDetailView
          candidateId="c001"
          candidate={MOCK_CANDIDATE}
          messages={[]}
          onBack={vi.fn()}
          onSend={vi.fn()}
        />
      </MemoryRouter>
    );
    expect(screen.getByTestId("send-button")).toBeDisabled();
  });

  it("テキスト入力後に送信ボタンを押すと onSend が呼ばれ入力欄がクリアされる", async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ChatDetailView
          candidateId="c001"
          candidate={MOCK_CANDIDATE}
          messages={[]}
          onBack={vi.fn()}
          onSend={onSend}
        />
      </MemoryRouter>
    );
    const input = screen.getByTestId("message-input");
    await user.type(input, "打診テキスト");
    await user.click(screen.getByTestId("send-button"));
    expect(onSend).toHaveBeenCalledWith("打診テキスト");
    expect(input).toHaveValue("");
  });

  it("Enter キー送信で onSend が呼ばれる", async () => {
    const onSend = vi.fn();
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ChatDetailView
          candidateId="c001"
          candidate={MOCK_CANDIDATE}
          messages={[]}
          onBack={vi.fn()}
          onSend={onSend}
        />
      </MemoryRouter>
    );
    const input = screen.getByTestId("message-input");
    await user.type(input, "テスト{Enter}");
    expect(onSend).toHaveBeenCalledWith("テスト");
  });

  it("戻るボタンで onBack が呼ばれる", async () => {
    const onBack = vi.fn();
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ChatDetailView
          candidateId="c001"
          candidate={MOCK_CANDIDATE}
          messages={[]}
          onBack={onBack}
          onSend={vi.fn()}
        />
      </MemoryRouter>
    );
    await user.click(screen.getByRole("button", { name: "スレッド一覧に戻る" }));
    expect(onBack).toHaveBeenCalled();
  });
});

// ── ChatView (統合) ───────────────────────────────────────────

describe("ChatView", () => {
  it("?candidateId なしで「ゲストとのやりとり」ヘッダーが表示される", () => {
    renderChatView();
    expect(screen.getByText("ゲストとのやりとり")).toBeInTheDocument();
  });

  it("?candidateId=c001 でチャット詳細ビューが開く", async () => {
    await act(async () => {
      renderChatView("?candidateId=c001");
    });
    expect(screen.getByText("佐藤 健一様")).toBeInTheDocument();
  });

  describe("fake timers — sendMessage統合", () => {
    beforeEach(() => { vi.useFakeTimers(); });
    afterEach(() => { vi.useRealTimers(); });

    it("メッセージ送信後 host バブルが表示され、1500ms後に guest バブルが追加される", async () => {
      await act(async () => {
        renderChatView("?candidateId=c001");
      });

      // fireEvent.change でReact管理ステートを更新（fake timers環境でも安全）
      const input = screen.getByTestId("message-input");
      await act(async () => {
        fireEvent.change(input, { target: { value: "打診メッセージ" } });
      });

      // send-button を直接クリック（userEvent は内部タイマーを使うため不可）
      await act(async () => {
        screen.getByTestId("send-button").click();
        await Promise.resolve();
      });

      expect(screen.getAllByTestId("bubble-host")).toHaveLength(1);

      // 1500ms進めて guest 返信を確認
      await act(async () => {
        vi.advanceTimersByTime(1500);
        await Promise.resolve();
      });

      expect(screen.getAllByTestId("bubble-guest")).toHaveLength(1);
    });
  });
});
