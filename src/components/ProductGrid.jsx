import { useProducts } from "../context/ProductContext";
import ProductCard from "./ProductCard";
import SkeletonCard from "./SkeletonCard";

export default function ProductGrid() {
  const { products, loading, error } = useProducts();

  if (error) {
    return (
      <div className="error-state">
        <h3>Something went wrong</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📦</div>
        <h3>No products found</h3>
        <p>Try adjusting your search or filter to find what you&apos;re looking for.</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}