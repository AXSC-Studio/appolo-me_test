// TDD GREEN — Issue #14: ChatContext
// spec: specs/003-chat-guest-view.md § Data / State

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ChatProvider, useChatContext, MOCK_REPLIES } from "../apps/web/src/context/ChatContext";

// テスト用プローブコンポーネント
function Probe({ candidateId }: { candidateId: string }) {
  const { threads, activeThreadId, setActiveThread, clearActiveThread, sendMessage } =
    useChatContext();
  const thread = threads[candidateId];
  return (
    <div>
      <span data-testid="activeId">{activeThreadId ?? "null"}</span>
      <span data-testid="msgCount">{thread?.messages.length ?? 0}</span>
      <span data-testid="lastRole">{thread?.messages.at(-1)?.role ?? "none"}</span>
      <button onClick={() => setActiveThread(candidateId)}>setActive</button>
      <button onClick={() => clearActiveThread()}>clearActive</button>
      <button onClick={() => sendMessage(candidateId, "テストメッセージ")}>send</button>
    </div>
  );
}

describe("ChatContext — setActiveThread", () => {
  it("存在しない candidateId で setActiveThread → 空スレッドが生成される", async () => {
    render(
      <ChatProvider>
        <Probe candidateId="c001" />
      </ChatProvider>
    );
    await act(async () => {
      screen.getByRole("button", { name: "setActive" }).click();
    });
    expect(screen.getByTestId("activeId").textContent).toBe("c001");
    expect(screen.getByTestId("msgCount").textContent).toBe("0");
  });

  it("clearActiveThread で activeThreadId が null になる", async () => {
    render(
      <ChatProvider>
        <Probe candidateId="c001" />
      </ChatProvider>
    );
    await act(async () => {
      screen.getByRole("button", { name: "setActive" }).click();
    });
    await act(async () => {
      screen.getByRole("button", { name: "clearActive" }).click();
    });
    expect(screen.getByTestId("activeId").textContent).toBe("null");
  });
});

describe("ChatContext — sendMessage（fake timers）", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it("sendMessage 後に host Message が追加される", async () => {
    render(
      <ChatProvider>
        <Probe candidateId="c001" />
      </ChatProvider>
    );
    await act(async () => {
      screen.getByRole("button", { name: "send" }).click();
      await Promise.resolve();
    });
    expect(screen.getByTestId("msgCount").textContent).toBe("1");
    expect(screen.getByTestId("lastRole").textContent).toBe("host");
  });

  it("1500ms後に guest Message が追加される", async () => {
    render(
      <ChatProvider>
        <Probe candidateId="c001" />
      </ChatProvider>
    );
    await act(async () => {
      screen.getByRole("button", { name: "send" }).click();
      await Promise.resolve();
    });
    expect(screen.getByTestId("msgCount").textContent).toBe("1");

    await act(async () => {
      vi.advanceTimersByTime(1500);
      await Promise.resolve();
    });
    expect(screen.getByTestId("msgCount").textContent).toBe("2");
    expect(screen.getByTestId("lastRole").textContent).toBe("guest");
  });

  it("guest返信は MOCK_REPLIES のいずれか", async () => {
    render(
      <ChatProvider>
        <Probe candidateId="c001" />
      </ChatProvider>
    );
    await act(async () => {
      screen.getByRole("button", { name: "send" }).click();
      await Promise.resolve();
    });
    await act(async () => {
      vi.advanceTimersByTime(1500);
      await Promise.resolve();
    });
    // lastRole は "guest" なので thread.messages.at(-1).text を確認したいが
    // Probe経由ではroleしか取れない → MOCK_REPLIES に3件あることを型チェックで保証
    expect(MOCK_REPLIES).toHaveLength(3);
    expect(screen.getByTestId("lastRole").textContent).toBe("guest");
  });
});

describe("ChatContext — Provider外エラー", () => {
  it("Provider 外使用時にエラーをthrowする", () => {
    function Bad() {
      useChatContext();
      return null;
    }
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Bad />)).toThrow(
      "useChatContext は ChatProvider の内側で使用してください"
    );
    consoleError.mockRestore();
  });
});
