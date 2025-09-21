import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

const CartPage = () => {
  const { 
    cart, 
    totalItems, 
    totalPrice, 
    loading, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(productId);
    } else {
      await updateCartItem(productId, newQuantity);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      await removeFromCart(productId);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('Please login to proceed with checkout');
      navigate('/login');
      return;
    }
    // Here you would typically redirect to a checkout page
    alert('Checkout functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="loading-spinner"></div>
        <p>Loading cart...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <h1>Your Cart is Empty</h1>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.productId} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.image || '/placeholder-image.jpg'} 
                    alt={item.productName}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                    }}
                  />
                </div>

                <div className="item-details">
                  <h3 className="item-name">
                    <Link to={`/products/${item.productId}`}>
                      {item.productName}
                    </Link>
                  </h3>
                  <p className="item-price">{formatPrice(item.price)} each</p>
                </div>

                <div className="item-quantity">
                  <label htmlFor={`quantity-${item.productId}`}>Qty:</label>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      disabled={loading}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      disabled={loading}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  <span className="total-price">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>

                <div className="item-actions">
                  <button 
                    onClick={() => handleRemoveItem(item.productId)}
                    disabled={loading}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-box">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Items ({totalItems}):</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              
              <div className="summary-row total">
                <span>Total:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={loading || cart.length === 0}
                className="checkout-btn"
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>

              <Link to="/products" className="continue-shopping">
                Continue Shopping
              </Link>
            </div>

            <div className="cart-actions">
              <button 
                onClick={handleClearCart}
                disabled={loading || cart.length === 0}
                className="clear-cart-btn"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;