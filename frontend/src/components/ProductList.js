import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { productsAPI } from '../services/api';
import './ProductList.css';

const ProductList = ({ limit = null }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await productsAPI.getAllProducts();
      
      // Limit products if specified (for home page)
      const productsToShow = limit ? data.slice(0, limit) : data;
      setProducts(productsToShow);
    } catch (error) {
      console.error('Failed to load products:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={loadProducts} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-container">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;