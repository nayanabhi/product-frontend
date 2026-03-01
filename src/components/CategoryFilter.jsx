import { useProducts } from "../context/ProductContext";

export default function CategoryFilter() {
  const { category, setCategory, categories, catLoading } = useProducts();

  return (
    <div className="filter-wrapper">
      <select
        id="category"
        className="category-select"
        aria-label="Filter by category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">All categories</option>
        {catLoading ? (
          <option disabled>Loading...</option>
        ) : (
          categories.map(({ category, count }) => (
            <option key={category} value={category}>
              {/* capitalize first letter */}
              {category.charAt(0).toUpperCase() + category.slice(1)} ({count})
            </option>
          ))
        )}
      </select>
    </div>
  );
}
