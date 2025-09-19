import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load cart on component mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.cart || []);
      setTotalItems(response.totalItems || 0);
      setTotalPrice(parseFloat(response.totalPrice || 0));
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);
      
      const cartItem = {
        productId: product.productId,
        productName: product.productName,
        price: product.price,
        quantity: quantity,
        image: product.image[0] || ''
      };

      const response = await cartAPI.addToCart(cartItem);
      setCart(response.cart || []);
      setTotalItems(response.totalItems || 0);
      
      // Calculate total price
      const newTotalPrice = (response.cart || []).reduce((total, item) => 
        total + (item.price * item.quantity), 0
      );
      setTotalPrice(newTotalPrice);
      
      return { success: true, message: response.message };
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return { success: false, message: 'Failed to add item to cart' };
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      setLoading(true);
      const response = await cartAPI.updateCartItem(productId, quantity);
      setCart(response.cart || []);
      setTotalItems(response.totalItems || 0);
      
      // Calculate total price
      const newTotalPrice = (response.cart || []).reduce((total, item) => 
        total + (item.price * item.quantity), 0
      );
      setTotalPrice(newTotalPrice);
      
      return { success: true, message: response.message };
    } catch (error) {
      console.error('Failed to update cart:', error);
      return { success: false, message: 'Failed to update cart item' };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      const response = await cartAPI.removeFromCart(productId);
      setCart(response.cart || []);
      setTotalItems(response.totalItems || 0);
      
      // Calculate total price
      const newTotalPrice = (response.cart || []).reduce((total, item) => 
        total + (item.price * item.quantity), 0
      );
      setTotalPrice(newTotalPrice);
      
      return { success: true, message: response.message };
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      return { success: false, message: 'Failed to remove item from cart' };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartAPI.clearCart();
      setCart([]);
      setTotalItems(0);
      setTotalPrice(0);
      return { success: true, message: 'Cart cleared successfully' };
    } catch (error) {
      console.error('Failed to clear cart:', error);
      return { success: false, message: 'Failed to clear cart' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    totalItems,
    totalPrice,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};