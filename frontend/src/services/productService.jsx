// services/productService.js
const API_BASE_URL = 'http://localhost:8080/api';

export const productService = {
  async getAllProducts() {
    const response = await fetch(`${API_BASE_URL}/products`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    return response.json();
  },

  async getProductById(id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    return response.json();
  },

  async getProductsByCategory(categoryId) {
    const response = await fetch(`${API_BASE_URL}/products/category/${categoryId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }
    
    return response.json();
  },

  async searchProducts(keyword) {
    const response = await fetch(
      `${API_BASE_URL}/products/search?keyword=${encodeURIComponent(keyword)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    
    return response.json();
  },

  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    return response.json();
  }
};