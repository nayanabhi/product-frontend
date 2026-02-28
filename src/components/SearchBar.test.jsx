import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SearchBar from "./SearchBar";
import { ProductProvider } from "../context/ProductContext";
import { fetchProducts } from "../services/api";

vi.mock("../services/api", () => ({
  fetchProducts: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(fetchProducts).mockResolvedValue({
    data: [{ id: 1, title: "Test", price: 100, image: "" }],
    meta: { totalCount: 1, totalPages: 1 },
  });
});

function renderSearchBar() {
  return render(
    <ProductProvider>
      <SearchBar />
    </ProductProvider>
  );
}

describe("SearchBar", () => {
  it("renders search input with placeholder", () => {
    renderSearchBar();
    const input = screen.getByRole("textbox", { name: /search products/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Search products...");
  });

  it("updates search value when typing", () => {
    renderSearchBar();
    const input = screen.getByRole("textbox", { name: /search products/i });
    fireEvent.change(input, { target: { value: "phone" } });
    expect(input).toHaveValue("phone");
  });

  it("shows clear button when search has value and clears on click", () => {
    renderSearchBar();
    const input = screen.getByRole("textbox", { name: /search products/i });
    fireEvent.change(input, { target: { value: "test" } });
    const clearBtn = screen.getByRole("button", { name: /clear search/i });
    expect(clearBtn).toBeInTheDocument();
    fireEvent.click(clearBtn);
    expect(input).toHaveValue("");
  });
});
