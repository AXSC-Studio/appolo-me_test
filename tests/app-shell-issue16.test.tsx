// TDD GREEN — Issue #16: App shell integration
// spec: specs/004-app-shell-integration.md § Unit Test Conditions

import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { TripConditionDraftProvider } from "../apps/web/src/context/TripConditionDraftContext";
import { CandidateProvider } from "../apps/web/src/context/CandidateContext";
import { ChatProvider } from "../apps/web/src/context/ChatContext";
import App from "../apps/web/src/App";

// ── ヘルパー ─────────────────────────────────────────────────

function renderApp(initialPath = "/") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <TripConditionDraftProvider>
        <CandidateProvider handoffDataset={null}>
          <ChatProvider>
            <App />
          </ChatProvider>
        </CandidateProvider>
      </TripConditionDraftProvider>
    </MemoryRouter>
  );
}

// ── ルーティング ──────────────────────────────────────────────

describe("ルーティング", () => {
  it("/ → TripConditionForm が表示される", () => {
    renderApp("/");
    expect(screen.getByRole("button", { name: "AIマッチングを開始する" })).toBeInTheDocument();
  });

  it("/candidates → handoffDataset=null のとき / へリダイレクトされる", () => {
    renderApp("/candidates");
    expect(screen.getByRole("button", { name: "AIマッチングを開始する" })).toBeInTheDocument();
  });

  it("/chat → ChatView が表示される", async () => {
    await act(async () => {
      renderApp("/chat");
    });
    // data-testid で ChatView コンテナを確認（BottomNavと被らない）
    expect(screen.getByTestId("chat-view")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ゲストとのやりとり" })).toBeInTheDocument();
  });

  it("/unknown → / へリダイレクトされる（TripConditionFormが表示される）", () => {
    renderApp("/unknown");
    expect(screen.getByRole("button", { name: "AIマッチングを開始する" })).toBeInTheDocument();
  });
});

// ── Provider構成 ──────────────────────────────────────────────

describe("Provider構成", () => {
  it("全ルートで TripConditionDraftContext が利用可能（フォームが表示できる）", () => {
    renderApp("/");
    expect(screen.getByRole("button", { name: "AIマッチングを開始する" })).toBeInTheDocument();
  });

  it("全ルートで ChatContext が利用可能（/chat が表示できる）", async () => {
    await act(async () => {
      renderApp("/chat");
    });
    expect(screen.getByTestId("chat-view")).toBeInTheDocument();
  });
});

// ── BottomNav ─────────────────────────────────────────────────

describe("BottomNav", () => {
  it("「出張の管理」クリック → / の TripConditionForm が表示される", async () => {
    const user = userEvent.setup();
    await act(async () => {
      renderApp("/chat");
    });

    await user.click(screen.getByRole("button", { name: /出張の管理/ }));

    expect(screen.getByRole("button", { name: "AIマッチングを開始する" })).toBeInTheDocument();
  });

  it("「ゲストとのやりとり」クリック → /chat の ChatView が表示される", async () => {
    const user = userEvent.setup();
    renderApp("/");

    await user.click(screen.getByRole("button", { name: /ゲストとのやりとり/ }));

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByTestId("chat-view")).toBeInTheDocument();
  });
});

// ── ChatView URLパラメータ連携 ────────────────────────────────

describe("ChatView URLパラメータ連携", () => {
  it("/chat?candidateId=c001 → 佐藤 健一様のチャット詳細が表示される", async () => {
    await act(async () => {
      renderApp("/chat?candidateId=c001");
    });
    expect(screen.getByText("佐藤 健一様")).toBeInTheDocument();
    expect(screen.getByText("株式会社テックスタート")).toBeInTheDocument();
  });
});
