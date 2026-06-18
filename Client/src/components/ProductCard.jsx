import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { currency, discountedPrice } from "../utils/pricing.js";

export default function ProductCard({ product }) {
  const finalPrice = discountedPrice(product.price, product.discount);

  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`} className="product-image-link">
        <img src={product.mainImg} alt={product.title} />
      </Link>
      <div className="product-card-body">
        <div className="product-meta">
          <span>{product.category}</span>
          <span>{product.gender}</span>
        </div>
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <div className="price-row">
          <strong>{currency(finalPrice)}</strong>
          {product.discount > 0 && (
            <>
              <span className="strike">{currency(product.price)}</span>
              <span className="discount">{product.discount}% off</span>
            </>
          )}
        </div>
        <Link className="primary-button full" to={`/products/${product._id}`}>
          <ShoppingCart size={18} />
          Shop Now
        </Link>
      </div>
    </article>
  );
}
