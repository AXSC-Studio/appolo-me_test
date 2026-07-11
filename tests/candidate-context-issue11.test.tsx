// TDD GREEN — Issue #11: CandidateContext
// spec: specs/002-candidate-extraction.md § Data / State (CandidateContext)
// fake timers で 2000ms 遅延をテスト
// vi.runAllTimersAsync() でfakeTimer + asyncPromiseを同時に処理

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { CandidateProvider, useCandidateContext } from "../apps/web/src/context/CandidateContext";
import type { HandoffDataset } from "../apps/web/src/types/trip-conditions";

// rankCandidates をモック
vi.mock("../apps/web/src/engine/matchingEngine", () => ({
  rankCandidates: vi.fn(),
}));

import { rankCandidates } from "../apps/web/src/engine/matchingEngine";
const mockRankCandidates = vi.mocked(rankCandidates);

const baseHandoff: HandoffDataset = {
  toLocation: "大阪",
  purposeType: "SAAS_SALES",
  purposeText: "",
  startDate: { month: 8, day: 1 },
  endDate: { month: 8, day: 3 },
};

const mockSuccessResult = {
  status: "success" as const,
  results: [
    {
      candidateId: "c001",
      priority: 1,
      matchingScore: 55,
      matchedAttribute: "SaaS",
      recommendationReason: "理由",
      nextAction: "次のアクション",
      pitchMessage: "打診文",
    },
  ],
};

// テスト用コンポーネント
function Probe() {
  const { rankingState, isLoading, selectedId, setSelectedId } =
    useCandidateContext();
  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="status">{rankingState?.status ?? "null"}</span>
      <span data-testid="selectedId">{selectedId ?? "null"}</span>
      <button onClick={() => setSelectedId("c001")}>select</button>
    </div>
  );
}

describe("CandidateContext — handoffDataset=null", () => {
  it("null のとき rankCandidates が実行されない", () => {
    render(
      <CandidateProvider handoffDataset={null}>
        <Probe />
      </CandidateProvider>
    );
    expect(mockRankCandidates).not.toHaveBeenCalled();
    expect(screen.getByTestId("loading").textContent).toBe("false");
    expect(screen.getByTestId("status").textContent).toBe("null");
  });
});

describe("CandidateContext — handoffDataset あり（fake timers）", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockRankCandidates.mockResolvedValue(mockSuccessResult);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("handoffDataset 変化直後は isLoading=true", () => {
    render(
      <CandidateProvider handoffDataset={baseHandoff}>
        <Probe />
      </CandidateProvider>
    );
    expect(screen.getByTestId("loading").textContent).toBe("true");
  });

  it("2000ms後に rankCandidates が完了し status=success になる", async () => {
    render(
      <CandidateProvider handoffDataset={baseHandoff}>
        <Probe />
      </CandidateProvider>
    );
    expect(screen.getByTestId("loading").textContent).toBe("true");

    // runAllTimersAsync: setTimeout発火 + asyncコールバックのPromise解決を一括処理
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(screen.getByTestId("status").textContent).toBe("success");
    expect(screen.getByTestId("loading").textContent).toBe("false");
  });

  it("rankCandidates が handoffDataset を引数に呼ばれる", async () => {
    render(
      <CandidateProvider handoffDataset={baseHandoff}>
        <Probe />
      </CandidateProvider>
    );
    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(mockRankCandidates).toHaveBeenCalledWith(baseHandoff);
  });

  it("Provider 外使用時にエラーをthrowする", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(
      "useCandidateContext は CandidateProvider の内側で使用してください"
    );
    consoleError.mockRestore();
  });
});

describe("CandidateContext — selectedId", () => {
  it("setSelectedId で selectedId が更新される", async () => {
    const { getByRole } = render(
      <CandidateProvider handoffDataset={null}>
        <Probe />
      </CandidateProvider>
    );
    expect(screen.getByTestId("selectedId").textContent).toBe("null");
    await act(async () => {
      getByRole("button", { name: "select" }).click();
    });
    expect(screen.getByTestId("selectedId").textContent).toBe("c001");
  });
});
