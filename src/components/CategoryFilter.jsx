import { useProducts } from "../context/ProductContext";

export default function CategoryFilter() {
  const { category, setCategory } = useProducts();

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
        <option value="electronics">Electronics</option>
        <option value="fashion">Fashion</option>
        <option value="books">Books</option>
        <option value="home">Home</option>
        <option value="sports">Sports</option>
      </select>
    </div>
  );
}
