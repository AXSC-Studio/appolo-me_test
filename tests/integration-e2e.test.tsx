// Step 7: 結合テスト
// 入力→候補抽出→優先順位→推薦理由→選択→チャット遷移の1導線
// spec: specs/004-app-shell-integration.md § Integration Conditions
//
// ── fake timers 方針 ──────────────────────────────────────────
// vi.useFakeTimers() は queueMicrotask もfakeするため React scheduler が停止する。
// toFake: ['setTimeout','clearTimeout','setInterval','clearInterval'] なら
// React の MessageChannel / Promise は実タイマーのまま動く。
//
// ── fillForm 日付クリック問題 ──────────────────────────────────
// dayBtn1クリック後、React再レンダリング前に dayBtn2 を連続クリックすると
// TripCalendar の handleDayClick が startDate=null を参照し、
// 2回とも onSelectStart を呼ぶ → endDate 未設定 → バリデーションエラー。
// → 日付クリック間に await Promise.resolve() を挟み React 再レンダリングを待つ。
//
// ── waitFor を使わない理由 ─────────────────────────────────────
// waitFor は setTimeout でポーリングするため fake timers 下でデッドロックする。
// → act() + await Promise.resolve() + 同期アサーションで代替する。

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TripConditionDraftProvider } from "../apps/web/src/context/TripConditionDraftContext";
import { CandidateProvider } from "../apps/web/src/context/CandidateContext";
import { ChatProvider } from "../apps/web/src/context/ChatContext";
import App from "../apps/web/src/App";
import { useTripConditionDraftContext } from "../apps/web/src/context/TripConditionDraftContext";

// ── ヘルパー ─────────────────────────────────────────────────

function CandidateProviderBridge({ children }: { children: React.ReactNode }) {
  const { draft } = useTripConditionDraftContext();
  return (
    <CandidateProvider handoffDataset={draft.handoffDataset}>
      {children}
    </CandidateProvider>
  );
}

function renderFullApp(initialPath = "/") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
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
 *
 * 日付クリック間に await Promise.resolve() を挟む理由:
 *   TripCalendar の handleDayClick は startDate props をクロージャで参照する。
 *   fireEvent.click(dayBtn1) 直後に dayBtn2 をクリックすると、
 *   React 再レンダリング前のため startDate=null を参照し onSelectStart を2回呼ぶ。
 *   await Promise.resolve() で React の更新キューをflushしてから2回目をクリックする。
 */
async function fillForm(destination: string, purposeLabel: string) {
  // ① 出張先
  fireEvent.change(screen.getByRole("combobox"), { target: { value: destination } });

  // ② 目的
  fireEvent.click(screen.getByText(purposeLabel));

  // ③ 開始日（最初の有効な日付ボタン）
  const dayBtns = screen
    .getAllByRole("button")
    .filter((b) => /^\d+$/.test(b.textContent?.trim() ?? "") && !b.hasAttribute("disabled"));
  fireEvent.click(dayBtns[0]);

  // React を再レンダリングさせ TripCalendar に startDate を反映させる
  await Promise.resolve();
  await Promise.resolve();

  // ④ 終了日（2番目の有効な日付ボタン。再レンダリング後に再取得）
  const dayBtns2 = screen
    .getAllByRole("button")
    .filter((b) => /^\d+$/.test(b.textContent?.trim() ?? "") && !b.hasAttribute("disabled"));
  fireEvent.click(dayBtns2[1]);

  // React を再レンダリングさせ endDate を反映させる
  await Promise.resolve();
  await Promise.resolve();

  // ⑤ 確定ボタン
  fireEvent.click(screen.getByRole("button", { name: "AIマッチングを開始する" }));

  // navigate("/candidates") → CandidateProvider useEffect → setIsLoading(true) をflush
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

/** アプリ側タイマー(setTimeout/setInterval)だけfake */
const FAKE_TIMER_CONFIG = {
  toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval"] as const,
};

// ── Step7-1: フォーム入力 → /candidates → MatchingProgress ────

describe("結合テスト Step7-1: フォーム入力 → 候補者一覧遷移", () => {
  beforeEach(() => { vi.useFakeTimers(FAKE_TIMER_CONFIG); });
  afterEach(() => { vi.useRealTimers(); });

  it("出張先・目的・日程を入力してAIマッチング開始 → /candidates でMatchingProgressが表示される", async () => {
    renderFullApp("/");

    await act(async () => {
      await fillForm("大阪", "SaaS新規開拓・地方営業");
    });

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});

// ── Step7-2: 候補者ランキング順序 ────────────────────────────────

describe("結合テスト Step7-2: 候補者ランキング順序", () => {
  beforeEach(() => { vi.useFakeTimers(FAKE_TIMER_CONFIG); });
  afterEach(() => { vi.useRealTimers(); });

  it("マッチング完了後、priority=1カードが先頭に表示される", async () => {
    renderFullApp("/");

    await act(async () => {
      await fillForm("大阪", "SaaS新規開拓・地方営業");
    });

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // 2000ms 進めてマッチング完了
    await act(async () => {
      vi.advanceTimersByTime(2000);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByText("No.1 優先アプローチ")).toBeInTheDocument();

    // 優先順位の順序確認
    const labels = screen
      .getAllByText(/No\.\d+ /)
      .map((el) => el.textContent ?? "");
    expect(labels[0]).toContain("No.1");
    expect(labels[1]).toContain("No.2");
  });
});

// ── Step7-3: カード展開 → 推薦理由・打診テキスト ────────────────

describe("結合テスト Step7-3: カード展開 → 推薦理由・打診テキスト", () => {
  beforeEach(() => { vi.useFakeTimers(FAKE_TIMER_CONFIG); });
  afterEach(() => { vi.useRealTimers(); });

  it("候補者カードを展開するとAIマッチング選定理由と打診テキストが表示される", async () => {
    renderFullApp("/");

    await act(async () => {
      await fillForm("愛知", "製造DX推進・協業面談");
    });

    await act(async () => {
      vi.advanceTimersByTime(2000);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByText("No.1 優先アプローチ")).toBeInTheDocument();

    // No.1カード（aria-expanded=false）を展開
    const closedCards = screen.getAllByRole("button", { expanded: false });
    await act(async () => {
      fireEvent.click(closedCards[0]);
      await Promise.resolve();
    });

    expect(screen.getByText("AIマッチング選定理由")).toBeInTheDocument();
    expect(screen.getByText("打診テキスト")).toBeInTheDocument();
  });
});

// ── Step7-4: チャットへ進む → ChatView詳細ビュー ─────────────────

describe("結合テスト Step7-4: 候補者カードからチャットへ遷移", () => {
  beforeEach(() => { vi.useFakeTimers(FAKE_TIMER_CONFIG); });
  afterEach(() => { vi.useRealTimers(); });

  it("候補者カードの「チャットに進む」→ ChatView詳細ビューが開く", async () => {
    renderFullApp("/");

    await act(async () => {
      await fillForm("大阪", "SaaS新規開拓・地方営業");
    });

    await act(async () => {
      vi.advanceTimersByTime(2000);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByText("No.1 優先アプローチ")).toBeInTheDocument();

    // No.1カードを展開
    await act(async () => {
      fireEvent.click(screen.getAllByRole("button", { expanded: false })[0]);
      await Promise.resolve();
    });

    // 「チャットに進む」をクリック
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /様とのチャットに進む/ }));
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    // ChatDetailView が表示される
    expect(screen.getByTestId("message-input")).toBeInTheDocument();
  });
});

// ── Step7-5: /candidates → handoffDataset=null → /リダイレクト ──

describe("結合テスト Step7-5: /candidates → handoffDataset=null → /リダイレクト", () => {
  it("handoffDataset=nullの状態で/candidatesにアクセスすると/にリダイレクトされる", () => {
    renderFullApp("/candidates");
    expect(screen.getByRole("button", { name: "AIマッチングを開始する" })).toBeInTheDocument();
  });
});
