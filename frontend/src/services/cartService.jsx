// services/cartService.js
const API_BASE_URL = 'http://localhost:8080/api';

export const cartService = {
  async getCart(userId) {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }
    
    return response.json();
  },

  async addToCart(userId, productId, quantity = 1) {
    const response = await fetch(
      `${API_BASE_URL}/cart/${userId}/add/${productId}?quantity=${quantity}`,
      { method: 'POST' }
    );
    
    if (!response.ok) {
      throw new Error('Failed to add to cart');
    }
    
    return response.json();
  },

  async updateQuantity(userId, productId, quantity) {
    const response = await fetch(
      `${API_BASE_URL}/cart/${userId}/update/${productId}?quantity=${quantity}`,
      { method: 'PUT' }
    );
    
    if (!response.ok) {
      throw new Error('Failed to update quantity');
    }
    
    return response.json();
  },

  async removeFromCart(userId, productId) {
    const response = await fetch(
      `${API_BASE_URL}/cart/${userId}/remove/${productId}`,
      { method: 'DELETE' }
    );
    
    if (!response.ok) {
      throw new Error('Failed to remove from cart');
    }
    
    return response.json();
  },

  async clearCart(userId) {
    const response = await fetch(
      `${API_BASE_URL}/cart/${userId}/clear`,
      { method: 'DELETE' }
    );
    
    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }
    
    return response.text();
  }
};