import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productsAPI, authAPI, ordersAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // New Product Form
  const [newProduct, setNewProduct] = useState({
    productId: '',
    productName: '',
    altName: [''],
    image: [''],
    description: '',
    price: '',
    lastPrice: '',
    stock: ''
  });

  useEffect(() => {
    if (activeTab === 'products') {
      loadProducts();
    } else if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAllProducts();
      setProducts(data);
    } catch (error) {
      setMessage('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await authAPI.getAllUsers();
      setUsers(data);
    } catch (error) {
      setMessage('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getAllOrders();
      setOrders(data);
    } catch (error) {
      setMessage('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Process the data
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        lastPrice: parseFloat(newProduct.lastPrice),
        stock: parseInt(newProduct.stock),
        altName: newProduct.altName.filter(name => name.trim() !== ''),
        image: newProduct.image.filter(img => img.trim() !== '')
      };

      await productsAPI.createProduct(productData);
      setMessage('Product created successfully!');
      setNewProduct({
        productId: '',
        productName: '',
        altName: [''],
        image: [''],
        description: '',
        price: '',
        lastPrice: '',
        stock: ''
      });
      loadProducts();
    } catch (error) {
      setMessage('Failed to create product: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productsAPI.deleteProduct(productId);
      setMessage('Product deleted successfully!');
      loadProducts();
    } catch (error) {
      setMessage('Failed to delete product');
    }
  };

  const handleToggleUserBlock = async (userId, isBlocked) => {
    try {
      await authAPI.toggleUserBlock(userId, !isBlocked);
      setMessage(`User ${isBlocked ? 'unblocked' : 'blocked'} successfully!`);
      loadUsers();
    } catch (error) {
      setMessage('Failed to update user status');
    }
  };

  const addArrayField = (field) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateArrayField = (field, index, value) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayField = (field, index) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  if (!isAdmin) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>You need admin privileges to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.firstName}!</p>
        </div>

        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
            <button onClick={() => setMessage('')} className="close-btn">×</button>
          </div>
        )}

        <div className="dashboard-tabs">
          <button 
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>

        <div className="dashboard-content">
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="products-section">
              <div className="section-header">
                <h2>Product Management</h2>
              </div>

              {/* Add New Product Form */}
              <div className="add-product-form">
                <h3>Add New Product</h3>
                <form onSubmit={handleProductSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Product ID</label>
                      <input
                        type="text"
                        value={newProduct.productId}
                        onChange={(e) => setNewProduct({...newProduct, productId: e.target.value})}
                        placeholder="PRD001"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Product Name</label>
                      <input
                        type="text"
                        value={newProduct.productName}
                        onChange={(e) => setNewProduct({...newProduct, productName: e.target.value})}
                        placeholder="Product Name"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Product description..."
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newProduct.lastPrice}
                        onChange={(e) => setNewProduct({...newProduct, lastPrice: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Stock</label>
                      <input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  {/* Alternative Names */}
                  <div className="form-group">
                    <label>Alternative Names</label>
                    {newProduct.altName.map((name, index) => (
                      <div key={index} className="array-input">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => updateArrayField('altName', index, e.target.value)}
                          placeholder="Alternative name"
                        />
                        {newProduct.altName.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removeArrayField('altName', index)}
                            className="remove-btn"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => addArrayField('altName')}
                      className="add-btn"
                    >
                      Add Alternative Name
                    </button>
                  </div>

                  {/* Images */}
                  <div className="form-group">
                    <label>Image URLs</label>
                    {newProduct.image.map((img, index) => (
                      <div key={index} className="array-input">
                        <input
                          type="url"
                          value={img}
                          onChange={(e) => updateArrayField('image', index, e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                        {newProduct.image.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removeArrayField('image', index)}
                            className="remove-btn"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => addArrayField('image')}
                      className="add-btn"
                    >
                      Add Image URL
                    </button>
                  </div>

                  <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'Creating...' : 'Create Product'}
                  </button>
                </form>
              </div>

              {/* Products List */}
              <div className="products-list">
                <h3>Existing Products</h3>
                {loading ? (
                  <div className="loading">Loading products...</div>
                ) : (
                  <div className="products-table">
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.productId}>
                            <td>{product.productId}</td>
                            <td>{product.productName}</td>
                            <td>${product.price}</td>
                            <td>{product.stock}</td>
                            <td>
                              <button 
                                onClick={() => handleDeleteProduct(product.productId)}
                                className="delete-btn"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="users-section">
              <h2>User Management</h2>
              {loading ? (
                <div className="loading">Loading users...</div>
              ) : (
                <div className="users-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td>{user.firstName} {user.lastName}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`user-type ${user.type}`}>
                              {user.type}
                            </span>
                          </td>
                          <td>
                            <span className={`user-status ${user.isBlocked ? 'blocked' : 'active'}`}>
                              {user.isBlocked ? 'Blocked' : 'Active'}
                            </span>
                          </td>
                          <td>
                            {user.type !== 'admin' && (
                              <button 
                                onClick={() => handleToggleUserBlock(user._id, user.isBlocked)}
                                className={user.isBlocked ? 'unblock-btn' : 'block-btn'}
                              >
                                {user.isBlocked ? 'Unblock' : 'Block'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="orders-section">
              <h2>Order Management</h2>
              {loading ? (
                <div className="loading">Loading orders...</div>
              ) : (
                <div className="orders-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.orderId}>
                          <td>{order.orderId}</td>
                          <td>{order.userEmail}</td>
                          <td>{order.orderItems?.length || 0} items</td>
                          <td>{new Date(order.date).toLocaleDateString()}</td>
                          <td>
                            <span className={`order-status ${order.status}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;