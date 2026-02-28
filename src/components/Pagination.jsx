import { useProducts } from "../context/ProductContext";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20];
const MAX_PAGE_BUTTONS = 5;

function getPageNumbers(current, total) {
  if (total <= MAX_PAGE_BUTTONS) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const half = Math.floor(MAX_PAGE_BUTTONS / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(total, start + MAX_PAGE_BUTTONS - 1);
  if (end - start < MAX_PAGE_BUTTONS - 1) {
    start = Math.max(1, end - MAX_PAGE_BUTTONS + 1);
  }
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
}

export default function Pagination() {
  const { products, page, setPage, totalPages, totalCount, limit, setLimit } = useProducts();

  if (!products?.length) return null;

  const pageNumbers = getPageNumbers(page, totalPages);

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

      <div className="pagination" role="navigation" aria-label="Pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          aria-label="Previous page"
        >
          Previous
        </button>

        <div className="pagination-numbers">
          {pageNumbers[0] > 1 && (
            <>
              <button
                type="button"
                className="pagination-num"
                onClick={() => setPage(1)}
                aria-label="Page 1"
              >
                1
              </button>
              {pageNumbers[0] > 2 && <span className="pagination-ellipsis">…</span>}
            </>
          )}
          {pageNumbers.map((n) => (
            <button
              key={n}
              type="button"
              className={`pagination-num ${n === page ? "pagination-num-active" : ""}`}
              onClick={() => setPage(n)}
              aria-label={`Page ${n}`}
              aria-current={n === page ? "page" : undefined}
            >
              {n}
            </button>
          ))}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="pagination-ellipsis">…</span>
              )}
              <button
                type="button"
                className="pagination-num"
                onClick={() => setPage(totalPages)}
                aria-label={`Page ${totalPages}`}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

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