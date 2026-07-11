// Step 8: 受け入れテスト — Vision Install ❶' 5項目
// docs/business/vision.md § v0 受け入れ条件 ❶' より
//
// 1. 出張目的を入力できる
// 2. 候補者が3名以上表示される
// 3. 優先順位が明確に見える
// 4. 各候補の推薦理由が分かる
// 5. 顧客が次に会う相手を選べる
//
// 技術戦略:
//   - toFake: ['setTimeout','clearTimeout','setInterval','clearInterval'] のみ fake
//     → React scheduler (MessageChannel/Promise) への影響なし
//   - waitFor は使わず act() + await Promise.resolve() + 同期アサーション
//   - fillForm は async: 日付クリック間に await Promise.resolve() を挟み
//     TripCalendar の再レンダリングを待ってから endDate を設定する

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TripConditionDraftProvider, useTripConditionDraftContext } from "../apps/web/src/context/TripConditionDraftContext";
import { CandidateProvider } from "../apps/web/src/context/CandidateContext";
import { ChatProvider } from "../apps/web/src/context/ChatContext";
import App from "../apps/web/src/App";

// ── セットアップ ──────────────────────────────────────────────

function CandidateProviderBridge({ children }: { children: React.ReactNode }) {
  const { draft } = useTripConditionDraftContext();
  return (
    <CandidateProvider handoffDataset={draft.handoffDataset}>
      {children}
    </CandidateProvider>
  );
}

function renderApp() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <TripConditionDraftProvider>
        <CandidateProviderBridge>
          <ChatProvider>
            <App />
          </ChatProvider>
        </CandidateProviderBridge>
      </TripConditionDraftProvider>
    </MemoryRouter>
  );
}

/**
 * フォームを非同期で入力する。
 * 日付クリック間に await Promise.resolve() を挟み TripCalendar 再レンダリングを待つ。
 * （startDate 未反映時は2回とも onSelectStart が呼ばれ endDate=null になるバグを回避）
 */
async function fillAndSubmitForm(destination: string, purposeLabel: string) {
  fireEvent.change(screen.getByRole("combobox"), { target: { value: destination } });
  fireEvent.click(screen.getByText(purposeLabel));

  const day1Btns = screen
    .getAllByRole("button")
    .filter((b) => /^\d+$/.test(b.textContent?.trim() ?? "") && !b.hasAttribute("disabled"));
  fireEvent.click(day1Btns[0]);

  await Promise.resolve();
  await Promise.resolve();

  const day2Btns = screen
    .getAllByRole("button")
    .filter((b) => /^\d+$/.test(b.textContent?.trim() ?? "") && !b.hasAttribute("disabled"));
  fireEvent.click(day2Btns[1]);

  await Promise.resolve();
  await Promise.resolve();

  fireEvent.click(screen.getByRole("button", { name: "AIマッチングを開始する" }));

  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

const FAKE_TIMER_CONFIG = {
  toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval"] as const,
};

// ── ❶'-1: 出張目的を入力できる ───────────────────────────────

describe("受け入れテスト ❶'-1: 出張目的を入力できる", () => {
  it("出張先・目的・日程の入力UIが表示され、値を設定できる", () => {
    renderApp();

    // 出張先ドロップダウンが存在する
    expect(screen.getByRole("combobox")).toBeInTheDocument();

    // 目的ボタンが存在する（4種類）
    expect(screen.getByText("SaaS新規開拓・地方営業")).toBeInTheDocument();
    expect(screen.getByText("製造DX推進・協業面談")).toBeInTheDocument();

    // 確定ボタンが存在する
    expect(screen.getByRole("button", { name: "AIマッチングを開始する" })).toBeInTheDocument();

    // 目的を選択するとハイライトされる
    fireEvent.click(screen.getByText("SaaS新規開拓・地方営業"));
    const selectedBtn = screen
      .getAllByRole("button")
      .find((b) => b.textContent?.includes("SaaS新規開拓・地方営業"));
    expect(selectedBtn?.className).toContain("border-brand-orange");
  });
});

// ── ❶'-2: 候補者が3名以上表示される ─────────────────────────

describe("受け入れテスト ❶'-2: 候補者が3名以上表示される", () => {
  beforeEach(() => { vi.useFakeTimers(FAKE_TIMER_CONFIG); });
  afterEach(() => { vi.useRealTimers(); });

  it("AIマッチング完了後、候補者カードが3件以上レンダリングされる", async () => {
    renderApp();

    await act(async () => {
      await fillAndSubmitForm("大阪", "SaaS新規開拓・地方営業");
    });

    // MatchingProgress が表示されている（isLoading=true）
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // 2000ms 進めてマッチング完了
    await act(async () => {
      vi.advanceTimersByTime(2000);
      await Promise.resolve();
      await Promise.resolve();
    });

    // 優先順位ラベルが3件以上存在する = 候補者3名以上
    const priorityLabels = screen.getAllByText(/No\.\d+ /);
    expect(priorityLabels.length).toBeGreaterThanOrEqual(3);
  });
});

// ── ❶'-3: 優先順位が明確に見える ────────────────────────────

describe("受け入れテスト ❶'-3: 優先順位が明確に見える", () => {
  beforeEach(() => { vi.useFakeTimers(FAKE_TIMER_CONFIG); });
  afterEach(() => { vi.useRealTimers(); });

  it("候補者に No.1/No.2/No.3 の優先順位ラベルとマッチ度スコアが表示される", async () => {
    renderApp();

    await act(async () => {
      await fillAndSubmitForm("愛知", "製造DX推進・協業面談");
    });

    await act(async () => {
      vi.advanceTimersByTime(2000);
      await Promise.resolve();
      await Promise.resolve();
    });

    // 各優先順位ラベルが正しいテキストで存在する
    // PRIORITY_LABELS: 1="No.1 優先アプローチ" / 2="No.2 次点候補" / 3="No.3 補欠候補"
    expect(screen.getByText("No.1 優先アプローチ")).toBeInTheDocument();
    expect(screen.getByText("No.2 次点候補")).toBeInTheDocument();
    expect(screen.getByText("No.3 補欠候補")).toBeInTheDocument();

    // マッチ度スコアが3件以上表示される
    const scores = screen.getAllByText(/マッチ度/);
    expect(scores.length).toBeGreaterThanOrEqual(3);

    // 優先順位の表示順が No.1 → No.2 → No.3 の順
    const labels = screen.getAllByText(/No\.\d+ /).map((el) => el.textContent ?? "");
    expect(labels[0]).toContain("No.1");
    expect(labels[1]).toContain("No.2");
    expect(labels[2]).toContain("No.3");
  });
});

// ── ❶'-4: 各候補の推薦理由が分かる ─────────────────────────

describe("受け入れテスト ❶'-4: 各候補の推薦理由が分かる", () => {
  beforeEach(() => { vi.useFakeTimers(FAKE_TIMER_CONFIG); });
  afterEach(() => { vi.useRealTimers(); });

  it("カードを展開すると AIマッチング選定理由 と 打診テキスト が表示される", async () => {
    renderApp();

    await act(async () => {
      await fillAndSubmitForm("大阪", "SaaS新規開拓・地方営業");
    });

    await act(async () => {
      vi.advanceTimersByTime(2000);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByText("No.1 優先アプローチ")).toBeInTheDocument();

    // カード展開前: 推薦理由は非表示
    expect(screen.queryByText("AIマッチング選定理由")).not.toBeInTheDocument();

    // No.1カードを展開
    const closedCards = screen.getAllByRole("button", { expanded: false });
    await act(async () => {
      fireEvent.click(closedCards[0]);
      await Promise.resolve();
    });

    // 展開後: 推薦理由・打診テキストが表示される
    expect(screen.getByText("AIマッチング選定理由")).toBeInTheDocument();
    expect(screen.getByText("打診テキスト")).toBeInTheDocument();

    // 推薦理由テキスト本文が空でない
    const reasonSection = screen.getByText("AIマッチング選定理由").closest("div");
    expect(reasonSection?.textContent?.length).toBeGreaterThan(10);
  });
});

// ── ❶'-5: 顧客が次に会う相手を選べる ───────────────────────

describe("受け入れテスト ❶'-5: 顧客が次に会う相手を選べる", () => {
  beforeEach(() => { vi.useFakeTimers(FAKE_TIMER_CONFIG); });
  afterEach(() => { vi.useRealTimers(); });

  it("候補者を選択し「チャットに進む」でメッセージ入力画面に遷移できる", async () => {
    renderApp();

    await act(async () => {
      await fillAndSubmitForm("大阪", "SaaS新規開拓・地方営業");
    });

    await act(async () => {
      vi.advanceTimersByTime(2000);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByText("No.1 優先アプローチ")).toBeInTheDocument();

    // No.1カードを展開して「チャットに進む」ボタンを表示
    await act(async () => {
      fireEvent.click(screen.getAllByRole("button", { expanded: false })[0]);
      await Promise.resolve();
    });

    // 「〜様とのチャットに進む」ボタンが存在する
    const chatBtn = screen.getByRole("button", { name: /様とのチャットに進む/ });
    expect(chatBtn).toBeInTheDocument();

    // ボタンをクリックするとメッセージ入力画面に遷移
    await act(async () => {
      fireEvent.click(chatBtn);
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByTestId("message-input")).toBeInTheDocument();
    expect(screen.getByTestId("send-button")).toBeInTheDocument();
  });
});
