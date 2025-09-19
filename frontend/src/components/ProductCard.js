import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking add to cart
    const result = await addToCart(product, 1);
    
    if (result.success) {
      alert('Item added to cart!');
    } else {
      alert('Failed to add item to cart');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.productId}`} className="product-link">
        <div className="product-image">
          <img 
            src={product.image[0] || '/placeholder-image.jpg'} 
            alt={product.productName}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />
          {product.lastPrice > product.price && (
            <div className="discount-badge">
              {Math.round((1 - product.price / product.lastPrice) * 100)}% OFF
            </div>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.productName}</h3>
          <p className="product-description">
            {product.description.length > 100 
              ? `${product.description.substring(0, 100)}...` 
              : product.description
            }
          </p>
          
          <div className="product-pricing">
            <span className="current-price">{formatPrice(product.price)}</span>
            {product.lastPrice > product.price && (
              <span className="original-price">{formatPrice(product.lastPrice)}</span>
            )}
          </div>
          
          <div className="product-stock">
            {product.stock > 0 ? (
              <span className="in-stock">In Stock ({product.stock})</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
      
      <div className="product-actions">
        <button 
          onClick={handleAddToCart}
          disabled={loading || product.stock === 0}
          className={`add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}`}
        >
          {loading ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;