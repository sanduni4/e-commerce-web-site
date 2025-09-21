import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin, isCustomer } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>E-Shop</h1>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          {isAdmin && (
            <Link to="/admin" className="nav-link admin-link">
              Admin Dashboard
            </Link>
          )}
        </nav>

        <div className="header-actions">
          {(isAuthenticated && !isAdmin) && (
            <Link to="/cart" className="cart-link">
              <span className="cart-icon">🛒</span>
              {totalItems > 0 && (
                <span className="cart-count">{totalItems}</span>
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="user-menu">
              <div 
                className="user-greeting-container"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="user-greeting">
                  Hello, {user?.firstName}!
                  <span className={`user-type ${user?.type}`}>
                    ({user?.type})
                  </span>
                </span>
                <span className="dropdown-arrow">▼</span>
              </div>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <Link 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    My Profile
                  </Link>
                  
                  {isCustomer && (
                    <Link 
                      to="/orders" 
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Orders
                    </Link>
                  )}
                  
                  {isAdmin && (
                    <>
                      <Link 
                        to="/admin" 
                        className="dropdown-item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/admin/users" 
                        className="dropdown-item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Manage Users
                      </Link>
                    </>
                  )}
                  
                  <div className="dropdown-divider"></div>
                  <button 
                    onClick={handleLogout} 
                    className="dropdown-item logout-item"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="auth-link">Login</Link>
              <Link to="/register" className="auth-link register">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;