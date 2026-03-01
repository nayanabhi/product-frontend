import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { fetchCategories, fetchProducts } from "../services/api";
import { useDebounce } from "../hooks/useDebounce";

function getStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get("search") ?? "",
    category: params.get("category") ?? "",
    page: Math.max(1, parseInt(params.get("page"), 10) || 1),
    limit: Math.max(5, parseInt(params.get("limit"), 10) || 10),
  };
}

function syncUrlToState(search, category, page, limit) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  if (limit !== 10) params.set("limit", String(limit));
  const query = params.toString();
  const url = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;
  window.history.replaceState({}, "", url);
}

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [initialUrl] = useState(getStateFromUrl);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearchState] = useState(initialUrl.search);
  const [category, setCategoryState] = useState(initialUrl.category);
  const [page, setPageState] = useState(initialUrl.page);
  const [limit, setLimitState] = useState(initialUrl.limit);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const debouncedSearch = useDebounce(search);

  const refetch = () => {
    setError(null);
    setRefetchTrigger((t) => t + 1);
  };

  const setSearch = useCallback(
    (v) => setSearchState(typeof v === "function" ? v : (prev) => v),
    [],
  );
  const setCategory = useCallback(
    (v) => setCategoryState(typeof v === "function" ? v : (prev) => v),
    [],
  );
  const setPage = useCallback(
    (v) => setPageState(typeof v === "function" ? v : (prev) => v),
    [],
  );
  const setLimit = useCallback(
    (v) => setLimitState(typeof v === "function" ? v : (prev) => v),
    [],
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, limit]);

  useEffect(() => {
    syncUrlToState(search, category, page, limit);
  }, [search, category, page, limit]);

  useEffect(() => {
    const onPopState = () => {
      const s = getStateFromUrl();
      setSearchState(s.search);
      setCategoryState(s.category);
      setPageState(s.page);
      setLimitState(s.limit);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchProducts({
          search: debouncedSearch,
          category,
          page,
          limit,
        });
        if (cancelled) return;
        const data = res.data ?? res;
        const productList = Array.isArray(data) ? data : (data?.products ?? []);
        setProducts(productList);
        const meta = res.meta ?? res;
        const total = meta?.totalCount ?? meta?.total ?? productList.length;
        const pages =
          meta?.totalPages ??
          Math.max(1, Math.ceil((total || productList.length) / limit));
        setTotalCount(total);
        setTotalPages(pages);
      } catch (err) {
        if (cancelled) return;
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load products",
        );
        setProducts([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, category, page, limit, refetchTrigger]);

  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetchCategories();
        const data = res.data ?? res;
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setCatLoading(false);
      }
    }

    loadCategories();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        search,
        setSearch,
        category,
        setCategory,
        page,
        setPage,
        limit,
        setLimit,
        totalPages,
        totalCount,
        refetch,
        categories,
        catLoading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
