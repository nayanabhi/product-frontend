import ProductGrid from "./components/ProductGrid";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import Pagination from "./components/Pagination";
import "./styles/product.css";

export default function App() {
  return (
    <div className="container">
      <header className="page-header">
        <h1>Products</h1>
        <div className="toolbar">
          <SearchBar />
          <CategoryFilter />
        </div>
      </header>
      <ProductGrid />
      <Pagination />
    </div>
  );
}