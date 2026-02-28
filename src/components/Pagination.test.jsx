import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Pagination from "./Pagination";
import { ProductProvider } from "../context/ProductContext";
import { fetchProducts } from "../services/api";

vi.mock("../services/api", () => ({
  fetchProducts: vi.fn(),
}));

const mockProducts = Array(5).fill(null).map((_, i) => ({
  id: i + 1,
  title: `Product ${i + 1}`,
  price: 100 + i,
  image: `https://example.com/img${i}.jpg`,
}));

describe("Pagination", () => {
  beforeEach(() => {
    vi.mocked(fetchProducts).mockResolvedValue({
      data: mockProducts,
      meta: { totalCount: 25, totalPages: 3 },
    });
  });

  it("returns null when no products", async () => {
    vi.mocked(fetchProducts).mockResolvedValue({ data: [], meta: { totalCount: 0, totalPages: 1 } });
    const { container } = render(
      <ProductProvider>
        <Pagination />
      </ProductProvider>
    );
    await waitFor(() => {
      expect(fetchProducts).toHaveBeenCalled();
    });
    // Pagination returns null when products.length is 0
    const pagination = container.querySelector(".pagination-wrapper");
    expect(pagination).toBeNull();
  });

  it("displays page info and Previous/Next buttons when products exist", async () => {
    render(
      <ProductProvider>
        <Pagination />
      </ProductProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(/showing.*products/i)).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /previous page/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next page/i })).toBeInTheDocument();
  });

  it("displays items per page select", async () => {
    render(
      <ProductProvider>
        <Pagination />
      </ProductProvider>
    );
    await waitFor(() => {
      expect(screen.getByLabelText(/items per page/i)).toBeInTheDocument();
    });
  });
});
