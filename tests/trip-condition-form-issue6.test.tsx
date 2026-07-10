// TDD GREEN — Issue #6: TripConditionForm + ValidationErrors
// spec: specs/001-trip-condition-input.md § Unit Test Conditions 1,2,3

import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { TripConditionDraftProvider } from "../apps/web/src/context/TripConditionDraftContext";
import { TripConditionForm } from "../apps/web/src/components/trip-conditions/TripConditionForm";

// useNavigate は MemoryRouter の中で動作するのでモック不要
function renderForm() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <TripConditionDraftProvider>
        <TripConditionForm />
      </TripConditionDraftProvider>
    </MemoryRouter>
  );
}

describe("TripConditionForm — 表示確認", () => {
  it("出張先ドロップダウン（combobox）が表示される", () => {
    renderForm();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("確定ボタンが表示される", () => {
    renderForm();
    expect(
      screen.getByRole("button", { name: "AIマッチングを開始する" })
    ).toBeInTheDocument();
  });

  it("出張目的グリッドに4つの選択肢がある", () => {
    renderForm();
    expect(screen.getByText("資金調達・アライアンス探索")).toBeInTheDocument();
    expect(screen.getByText("SaaS新規開拓・地方営業")).toBeInTheDocument();
    expect(screen.getByText("製造DX推進・協業面談")).toBeInTheDocument();
    expect(screen.getByText("AI推薦目的")).toBeInTheDocument();
  });
});

describe("TripConditionForm — バリデーション", () => {
  it("何も入力せず確定するとtoLocationエラーが表示される", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole("button", { name: "AIマッチングを開始する" }));
    await waitFor(() => {
      expect(
        screen.getByText(/出張先を選択してください/)
      ).toBeInTheDocument();
    });
  });

  it("何も入力せず確定するとpurposeTypeエラーが表示される", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole("button", { name: "AIマッチングを開始する" }));
    await waitFor(() => {
      expect(
        screen.getByText(/出張目的を選択してください/)
      ).toBeInTheDocument();
    });
  });

  it("何も入力せず確定するとstartDateエラーが表示される", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole("button", { name: "AIマッチングを開始する" }));
    await waitFor(() => {
      expect(
        screen.getByText(/出発日を選択してください/)
      ).toBeInTheDocument();
    });
  });
});
