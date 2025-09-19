import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
};

// Products API calls
export const productsAPI = {
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },
};

// Cart API calls
export const cartAPI = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },
  
  addToCart: async (item) => {
    const response = await api.post('/cart/add', item);
    return response.data;
  },
  
  updateCartItem: async (productId, quantity) => {
    const response = await api.put(`/cart/${productId}`, { quantity });
    return response.data;
  },
  
  removeFromCart: async (productId) => {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
  },
  
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },
};

// Orders API calls
export const ordersAPI = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  
  getUserOrders: async () => {
    const response = await api.get('/orders/user');
    return response.data;
  },
};

export default api;