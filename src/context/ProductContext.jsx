import { createContext, useContext, useEffect, useState } from "react";
import { fetchProducts } from "../services/api";
import { useDebounce } from "../hooks/useDebounce";



const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, limit]);

  useEffect(() => {
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
        const data = res.data ?? res;
        const productList = Array.isArray(data) ? data : data?.products ?? [];
        setProducts(productList);
        const meta = res.meta ?? res;
        const total = meta?.totalCount ?? meta?.total ?? productList.length;
        const pages = meta?.totalPages ?? Math.max(1, Math.ceil((total || productList.length) / limit));
        setTotalCount(total);
        setTotalPages(pages);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Failed to load products");
        setProducts([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [debouncedSearch, category, page, limit]);

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
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
