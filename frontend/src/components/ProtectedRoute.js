import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requireAuth = false, 
  requireAdmin = false, 
  requireCustomer = false 
}) => {
  const { isAuthenticated, isAdmin, isCustomer, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if admin access is required
  if (requireAdmin && !isAdmin) {
    return (
      <div className="access-denied">
        <div className="container">
          <h2>Access Denied</h2>
          <p>You need administrator privileges to access this page.</p>
          <button onClick={() => window.history.back()}>Go Back</button>
        </div>
      </div>
    );
  }

  // Check if customer access is required
  if (requireCustomer && !isCustomer) {
    return (
      <div className="access-denied">
        <div className="container">
          <h2>Access Denied</h2>
          <p>This page is only available for customers.</p>
          <button onClick={() => window.history.back()}>Go Back</button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;