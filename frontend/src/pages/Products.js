import React from 'react';
import ProductList from '../components/ProductList';
import './Products.css';

const Products = () => {
  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1>Our Products</h1>
          <p>Discover our full range of amazing products</p>
        </div>
        
        <ProductList />
      </div>
    </div>
  );
};

export default Products;