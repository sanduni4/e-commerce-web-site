import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import './UserOrders.css';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getUserOrders();
      setOrders(data);
    } catch (error) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'orange';
      case 'processing': return 'blue';
      case 'shipped': return 'purple';
      case 'delivered': return 'green';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-error">
        <div className="container">
          <h2>Error Loading Orders</h2>
          <p>{error}</p>
          <button onClick={loadOrders} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-orders">
      <div className="container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>Track and manage your order history</p>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-content">
              <h3>No Orders Yet</h3>
              <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
              <a href="/products" className="shop-now-btn">
                Start Shopping
              </a>
            </div>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const totalAmount = order.orderItems?.reduce((total, item) => 
                total + (item.price * item.quantity), 0
              ) || 0;

              return (
                <div key={order.orderId} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Order #{order.orderId}</h3>
                      <p className="order-date">Placed on {formatDate(order.date)}</p>
                    </div>
                    <div className="order-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="order-items">
                    {order.orderItems?.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-image">
                          <img 
                            src={item.image || '/placeholder-image.jpg'} 
                            alt={item.Name}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                            }}
                          />
                        </div>
                        <div className="item-details">
                          <h4>{item.Name}</h4>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: {formatPrice(item.price)}</p>
                        </div>
                        <div className="item-total">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div className="shipping-info">
                      <h4>Shipping Address:</h4>
                      <p>{order.name}</p>
                      <p>{order.address}</p>
                      <p>Phone: {order.phoneNumber}</p>
                      {order.notes && (
                        <p className="order-notes">
                          <strong>Notes:</strong> {order.notes}
                        </p>
                      )}
                    </div>
                    <div className="order-total">
                      <h3>Total: {formatPrice(totalAmount)}</h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;