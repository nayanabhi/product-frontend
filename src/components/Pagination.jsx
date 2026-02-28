import { useProducts } from "../context/ProductContext";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20];

export default function Pagination() {
  const { products, page, setPage, totalPages, totalCount, limit, setLimit } = useProducts();

  if (!products?.length) return null;

  return (
    <div className="pagination-wrapper">
      <div className="pagination-info">
        <span>
          Showing {products.length} of {totalCount > 0 ? totalCount : products.length} products
        </span>
        <label className="items-per-page">
          Items per page:
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            aria-label="Items per page"
          >
            {ITEMS_PER_PAGE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          aria-label="Previous page"
        >
          Previous
        </button>

        <span className="pagination-page" aria-live="polite">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}