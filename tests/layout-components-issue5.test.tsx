// TDD GREEN — Issue #5: レイアウトコンポーネント（AppHeader / HeroSection / BottomNav）
// spec: specs/001-trip-condition-input.md § レイアウト / spec: specs/004-app-shell-integration.md

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { AppHeader } from "../apps/web/src/components/layout/AppHeader";
import { HeroSection } from "../apps/web/src/components/layout/HeroSection";
import { BottomNav } from "../apps/web/src/components/layout/BottomNav";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("AppHeader", () => {
  it("appolo.me ロゴテキストが表示される", () => {
    render(<AppHeader />, { wrapper: MemoryRouter });
    expect(screen.getByText(/appolo\.me/i)).toBeInTheDocument();
  });
});

describe("HeroSection", () => {
  it("h1 見出しが表示される", () => {
    render(<HeroSection />, { wrapper: MemoryRouter });
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});

describe("BottomNav", () => {
  it("「出張の管理」ボタンが表示される", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <BottomNav />
      </MemoryRouter>
    );
    expect(screen.getByText("出張の管理")).toBeInTheDocument();
  });

  it("「ゲストとのやりとり」ボタンが表示される", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <BottomNav />
      </MemoryRouter>
    );
    expect(screen.getByText("ゲストとのやりとり")).toBeInTheDocument();
  });

  it("「出張の管理」クリックで navigate('/') が呼ばれる", () => {
    mockNavigate.mockClear();
    render(
      <MemoryRouter initialEntries={["/chat"]}>
        <BottomNav />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("出張の管理"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("「ゲストとのやりとり」クリックで navigate('/chat') が呼ばれる", () => {
    mockNavigate.mockClear();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <BottomNav />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("ゲストとのやりとり"));
    expect(mockNavigate).toHaveBeenCalledWith("/chat");
  });

  it("/ のとき「出張の管理」ボタンが brand-orange クラスを持つ", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <BottomNav />
      </MemoryRouter>
    );
    const btn = screen.getByText("出張の管理").closest("button");
    expect(btn?.className).toContain("brand-orange");
  });

  it("/chat のとき「ゲストとのやりとり」ボタンが brand-orange クラスを持つ", () => {
    render(
      <MemoryRouter initialEntries={["/chat"]}>
        <BottomNav />
      </MemoryRouter>
    );
    const btn = screen.getByText("ゲストとのやりとり").closest("button");
    expect(btn?.className).toContain("brand-orange");
  });
});
