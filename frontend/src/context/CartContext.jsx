// context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null); // Changed from [] to null
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = async () => {
    if (user) {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/cart/${user.id}`);
        const data = await response.json();
        
        console.log('Cart API Response:', data);
        
        // Your API returns cartItems, not items
        const items = data.cartItems || [];
        console.log('Cart items:', items);
        
        setCart(data); // Store the entire cart object
        setCartCount(items.length);
        
        // Calculate total from cartItems
        const total = items.reduce((sum, item) => {
          const price = item.product?.price || 0;
          const quantity = item.quantity || 1;
          return sum + (price * quantity);
        }, 0);
        setCartTotal(total);
        
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // For guest users
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{"cartItems": []}');
      const items = guestCart.cartItems || [];
      
      setCart(guestCart);
      setCartCount(items.length);
      
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setCartTotal(total);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/cart/${user.id}/add/${product.id}?quantity=${quantity}`, {
          method: 'POST'
        });
        const data = await response.json();
        
        // Update with new cart data
        const items = data.cartItems || [];
        setCart(data);
        setCartCount(items.length);
        
        const total = items.reduce((sum, item) => {
          const price = item.product?.price || 0;
          const qty = item.quantity || 1;
          return sum + (price * qty);
        }, 0);
        setCartTotal(total);
        
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest cart logic
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{"cartItems": []}');
      const items = guestCart.cartItems || [];
      
      const existingItemIndex = items.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        items[existingItemIndex].quantity += quantity;
      } else {
        items.push({
          id: product.id,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl
          },
          quantity: quantity
        });
      }
      
      guestCart.cartItems = items;
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      
      setCart(guestCart);
      setCartCount(items.length);
      setCartTotal(items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0));
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/cart/${user.id}/remove/${productId}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        
        const items = data.cartItems || [];
        setCart(data);
        setCartCount(items.length);
        
        const total = items.reduce((sum, item) => {
          const price = item.product?.price || 0;
          const quantity = item.quantity || 1;
          return sum + (price * quantity);
        }, 0);
        setCartTotal(total);
        
      } catch (error) {
        console.error('Error removing from cart:', error);
      } finally {
        setLoading(false);
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{"cartItems": []}');
      const items = guestCart.cartItems.filter(item => item.id !== productId);
      guestCart.cartItems = items;
      
      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      
      setCart(guestCart);
      setCartCount(items.length);
      setCartTotal(items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0));
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (user) {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/cart/${user.id}/update/${productId}?quantity=${quantity}`, {
          method: 'PUT'
        });
        const data = await response.json();
        
        const items = data.cartItems || [];
        setCart(data);
        setCartCount(items.length);
        
        const total = items.reduce((sum, item) => {
          const price = item.product?.price || 0;
          const qty = item.quantity || 1;
          return sum + (price * qty);
        }, 0);
        setCartTotal(total);
        
      } catch (error) {
        console.error('Error updating cart:', error);
      } finally {
        setLoading(false);
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{"cartItems": []}');
      const items = guestCart.cartItems;
      const item = items.find(item => item.id === productId);
      
      if (item) {
        item.quantity = quantity;
        guestCart.cartItems = items;
        localStorage.setItem('guestCart', JSON.stringify(guestCart));
        
        setCart(guestCart);
        setCartCount(items.length);
        setCartTotal(items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0));
      }
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        setLoading(true);
        await fetch(`http://localhost:8080/api/cart/${user.id}/clear`, {
          method: 'DELETE'
        });
        
        setCart(null);
        setCartCount(0);
        setCartTotal(0);
        
      } catch (error) {
        console.error('Error clearing cart:', error);
      } finally {
        setLoading(false);
      }
    } else {
      localStorage.removeItem('guestCart');
      setCart(null);
      setCartCount(0);
      setCartTotal(0);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      cartTotal,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};