// TDD GREEN — Issue #12: MatchingProgress / EmptyState / SocialShareBlock
// spec: specs/002-candidate-extraction.md § Screen

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { MatchingProgress } from "../apps/web/src/components/candidates/MatchingProgress";
import { EmptyState } from "../apps/web/src/components/candidates/EmptyState";
import { SocialShareBlock } from "../apps/web/src/components/candidates/SocialShareBlock";
import type { HandoffDataset } from "../apps/web/src/types/trip-conditions";

const baseHandoff: HandoffDataset = {
  toLocation: "東京(渋谷・恵比寿)",
  purposeType: "STARTUP_FUNDING",
  purposeText: "",
  startDate: { month: 7, day: 20 },
  endDate: { month: 7, day: 22 },
};

// ── MatchingProgress ─────────────────────────────────────────

describe("MatchingProgress", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it("progressbar ロールが存在する", () => {
    render(<MatchingProgress />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("初期値は 0%", () => {
    render(<MatchingProgress />);
    const bar = screen.getByRole("progressbar");
    expect(Number(bar.getAttribute("aria-valuenow"))).toBe(0);
  });

  it("インターバル経過後にプログレスが増加する", async () => {
    render(<MatchingProgress />);
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    const bar = screen.getByRole("progressbar");
    expect(Number(bar.getAttribute("aria-valuenow"))).toBeGreaterThan(0);
  });

  it("プログレスは 95% を超えない", async () => {
    render(<MatchingProgress />);
    await act(async () => {
      vi.advanceTimersByTime(10000);
    });
    const bar = screen.getByRole("progressbar");
    expect(Number(bar.getAttribute("aria-valuenow"))).toBeLessThanOrEqual(95);
  });
});

// ── EmptyState ───────────────────────────────────────────────

describe("EmptyState", () => {
  it("guidance テキストが表示される", () => {
    render(
      <MemoryRouter>
        <EmptyState guidance="条件を変更してお試しください。" />
      </MemoryRouter>
    );
    expect(screen.getByText("条件を変更してお試しください。")).toBeInTheDocument();
  });

  it("「出張条件を再入力する」ボタンが表示される", () => {
    render(
      <MemoryRouter>
        <EmptyState guidance="ガイダンス" />
      </MemoryRouter>
    );
    expect(
      screen.getByRole("button", { name: "出張条件を再入力する" })
    ).toBeInTheDocument();
  });
});

// ── SocialShareBlock ─────────────────────────────────────────

describe("SocialShareBlock", () => {
  it("3つのシェアボタンが表示される", () => {
    render(<SocialShareBlock handoffDataset={baseHandoff} />);
    expect(screen.getByRole("button", { name: "X（Twitter）でシェア" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "テキストをコピー" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "リンクをコピー" })).toBeInTheDocument();
  });

  it("X共有ボタンクリックで twitter.com/intent/tweet を開く", async () => {
    const user = userEvent.setup();
    const windowOpen = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<SocialShareBlock handoffDataset={baseHandoff} />);
    await user.click(screen.getByRole("button", { name: "X（Twitter）でシェア" }));
    expect(windowOpen).toHaveBeenCalledWith(
      expect.stringContaining("twitter.com/intent/tweet"),
      "_blank",
      "noopener,noreferrer"
    );
    windowOpen.mockRestore();
  });

  it("テキストコピーボタンで clipboard.writeText が呼ばれる", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    // jsdom では navigator.clipboard はgetter-only → defineProperty でモック
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    render(<SocialShareBlock handoffDataset={baseHandoff} />);
    await user.click(screen.getByRole("button", { name: "テキストをコピー" }));
    expect(writeText).toHaveBeenCalled();
  });
});
