import { useProducts } from "../context/ProductContext";

export default function SearchBar() {
  const { search, setSearch } = useProducts();

  return (
    <div className="search-wrapper">
      <input
        type="search"
        className="search-input"
        aria-label="Search products"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && (
        <button
          type="button"
          className="search-clear"
          aria-label="Clear search"
          onClick={() => setSearch("")}
        >
          ×
        </button>
      )}
    </div>
  );
}
