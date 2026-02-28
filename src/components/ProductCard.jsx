export default function ProductCard({ product }) {
  const handleImageError = (e) => {
    e.target.style.display = "none";
    e.target.nextSibling?.classList.add("product-card-placeholder-visible");
  };

  return (
    <article className="product-card">
      <div className="product-card-image">
        {product.image ? (
          <>
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
              onError={handleImageError}
            />
            <div className="product-card-placeholder" aria-hidden="true">
              {product.title?.slice(0, 1) || "?"}
            </div>
          </>
        ) : (
          <div className="product-card-placeholder product-card-placeholder-visible" aria-hidden="true">
            {product.title?.slice(0, 1) || "?"}
          </div>
        )}
      </div>
      <div className="product-card-body">
        <h3>{product.title}</h3>
        <p className="product-card-price" aria-label={`Price ₹${product.price}`}>
          ₹{product.price}
        </p>
      </div>
    </article>
  );
}