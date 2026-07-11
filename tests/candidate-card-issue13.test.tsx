// TDD GREEN — Issue #13: CandidateCard + CandidateList
// spec: specs/002-candidate-extraction.md § Screen / 候補者カード

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { CandidateCard } from "../apps/web/src/components/candidates/CandidateCard";
import type { MatchResult } from "../apps/web/src/types/candidates";

vi.mock("../apps/web/src/context/CandidateContext", () => ({
  useCandidateContext: vi.fn(),
}));

const mockResult: MatchResult = {
  candidateId: "c001",
  priority: 1,
  matchingScore: 85,
  matchedAttribute: "SaaS経験",
  recommendationReason: "SaaS導入に豊富な実績があります。",
  nextAction: "直接連絡して出張日程を共有する",
  pitchMessage: "佐藤様、出張のご連絡です。",
};

function renderCard(overrides: Partial<Parameters<typeof CandidateCard>[0]> = {}) {
  const props = {
    result: mockResult,
    candidateName: "佐藤 健一",
    company: "テックスタート",
    role: "CEO",
    isExpanded: false,
    onToggle: vi.fn(),
    ...overrides,
  };
  return { ...render(<MemoryRouter><CandidateCard {...props} /></MemoryRouter>), ...props };
}

describe("CandidateCard — 折りたたみ時（isExpanded=false）", () => {
  it("候補者名・企業・役職が表示される", () => {
    renderCard();
    expect(screen.getByText("佐藤 健一")).toBeInTheDocument();
    expect(screen.getByText(/テックスタート/)).toBeInTheDocument();
  });

  it("優先順位バッジが表示される（priority=1 → No.1 優先アプローチ）", () => {
    renderCard();
    expect(screen.getByText("No.1 優先アプローチ")).toBeInTheDocument();
  });

  it("マッチ度スコアが表示される", () => {
    renderCard();
    expect(screen.getByText(/マッチ度 85%/)).toBeInTheDocument();
  });

  it("アコーディオン内コンテンツは非表示", () => {
    renderCard();
    expect(screen.queryByText("AIマッチング選定理由")).not.toBeInTheDocument();
  });

  it("ヘッダークリックで onToggle が呼ばれる", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    renderCard({ onToggle });
    await user.click(screen.getByRole("button", { expanded: false }));
    expect(onToggle).toHaveBeenCalledOnce();
  });
});

describe("CandidateCard — 展開時（isExpanded=true）", () => {
  it("選定理由・次アクション・打診テキストが表示される", () => {
    renderCard({ isExpanded: true });
    expect(screen.getByText("AIマッチング選定理由")).toBeInTheDocument();
    expect(screen.getByText("SaaS導入に豊富な実績があります。")).toBeInTheDocument();
    expect(screen.getByText("直接連絡して出張日程を共有する")).toBeInTheDocument();
  });

  it("コピーボタンが表示される", () => {
    renderCard({ isExpanded: true });
    expect(screen.getByRole("button", { name: /コピー/ })).toBeInTheDocument();
  });

  it("チャットボタンが表示される", () => {
    renderCard({ isExpanded: true });
    expect(
      screen.getByRole("button", { name: /チャットに進む/ })
    ).toBeInTheDocument();
  });
});

describe("CandidateCard — コピーボタン状態管理（fake timers）", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("クリック後「コピー済み」に変化し2秒でリセット", async () => {
    renderCard({ isExpanded: true });
    const copyBtn = screen.getByRole("button", { name: /コピー/ });

    await act(async () => {
      copyBtn.click();
      // clipboard.writeText の Promise を flush
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByRole("button", { name: /コピー済み/ })).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.queryByRole("button", { name: /コピー済み/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^コピー$/ })).toBeInTheDocument();
  });
});
