// TDD GREEN — Issue #7: TripCalendar
// spec: specs/001-trip-condition-input.md § ③ カレンダーウィジェット
// TODAY = { month: 7, day: 11 } → isPast は compareDates(d, TODAY) < 0
// つまり day 10 以前が disabled。day 11（当日）は選択可能。

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TripCalendar } from "../apps/web/src/components/trip-conditions/TripCalendar";
import type { TripDate } from "../apps/web/src/types/trip-conditions";

function renderCalendar(
  overrides: Partial<{
    startDate: TripDate | null;
    endDate: TripDate | null;
    onSelectStart: (d: TripDate) => void;
    onSelectEnd: (d: TripDate) => void;
  }> = {}
) {
  const props = {
    startDate: null,
    endDate: null,
    onSelectStart: vi.fn(),
    onSelectEnd: vi.fn(),
    ...overrides,
  };
  const result = render(<TripCalendar {...props} />);
  return { ...result, ...props };
}

describe("TripCalendar — 月表示", () => {
  it("初期表示は2026年7月", () => {
    renderCalendar();
    expect(screen.getByText("2026年7月")).toBeInTheDocument();
  });

  it("次の月ボタンで8月に切り替わる", async () => {
    const user = userEvent.setup();
    renderCalendar();
    await user.click(screen.getByRole("button", { name: "次の月" }));
    expect(screen.getByText("2026年8月")).toBeInTheDocument();
  });

  it("8月から前の月ボタンで7月に戻る", async () => {
    const user = userEvent.setup();
    renderCalendar();
    await user.click(screen.getByRole("button", { name: "次の月" }));
    await user.click(screen.getByRole("button", { name: "前の月" }));
    expect(screen.getByText("2026年7月")).toBeInTheDocument();
  });

  it("7月では前の月ボタンがdisabled", () => {
    renderCalendar();
    expect(screen.getByRole("button", { name: "前の月" })).toBeDisabled();
  });

  it("9月では次の月ボタンがdisabled", async () => {
    const user = userEvent.setup();
    renderCalendar();
    await user.click(screen.getByRole("button", { name: "次の月" }));
    await user.click(screen.getByRole("button", { name: "次の月" }));
    expect(screen.getByText("2026年9月")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "次の月" })).toBeDisabled();
  });
});

describe("TripCalendar — 日付選択", () => {
  // TODAY = { month: 7, day: 11 }
  // isPast = compareDates(d, TODAY) < 0 → day 10 以前が disabled
  // day 11（当日）・day 12以降は選択可能

  it("startDate未選択時: クリックでonSelectStartが呼ばれる", async () => {
    const user = userEvent.setup();
    const onSelectStart = vi.fn();
    renderCalendar({ startDate: null, onSelectStart });
    await user.click(screen.getByRole("button", { name: "12" }));
    expect(onSelectStart).toHaveBeenCalledWith({ month: 7, day: 12 });
  });

  it("startDate選択済み・endDate未選択時: 後日クリックでonSelectEndが呼ばれる", async () => {
    const user = userEvent.setup();
    const onSelectEnd = vi.fn();
    renderCalendar({
      startDate: { month: 7, day: 12 },
      endDate: null,
      onSelectEnd,
    });
    await user.click(screen.getByRole("button", { name: "15" }));
    expect(onSelectEnd).toHaveBeenCalledWith({ month: 7, day: 15 });
  });

  it("startDate選択済み時: startDateより前の日クリックでonSelectStartが呼ばれる", async () => {
    const user = userEvent.setup();
    const onSelectStart = vi.fn();
    renderCalendar({
      startDate: { month: 7, day: 20 },
      endDate: null,
      onSelectStart,
    });
    await user.click(screen.getByRole("button", { name: "15" }));
    expect(onSelectStart).toHaveBeenCalledWith({ month: 7, day: 15 });
  });

  it("startDate・endDate両方選択済み時: クリックでonSelectStartがリセット", async () => {
    const user = userEvent.setup();
    const onSelectStart = vi.fn();
    renderCalendar({
      startDate: { month: 7, day: 12 },
      endDate: { month: 7, day: 20 },
      onSelectStart,
    });
    await user.click(screen.getByRole("button", { name: "15" }));
    expect(onSelectStart).toHaveBeenCalledWith({ month: 7, day: 15 });
  });

  it("過去の日付（7月10日）はdisabledで選択不可", async () => {
    const user = userEvent.setup();
    const onSelectStart = vi.fn();
    renderCalendar({ onSelectStart });
    // day 10 は TODAY(11日) より前 → isPast=true → disabled
    const btn = screen.getByRole("button", { name: "10" });
    expect(btn).toBeDisabled();
    await user.click(btn).catch(() => {});
    expect(onSelectStart).not.toHaveBeenCalled();
  });
});
