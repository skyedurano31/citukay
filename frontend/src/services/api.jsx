// services/api.js
const API_BASE_URL = 'http://localhost:8080/api';
const SPRING_BOOT_URL = 'http://localhost:8080'; // For images

// Helper function to transform image URLs
const transformProductImages = (products) => {
  if (!products) return products;
  
  if (Array.isArray(products)) {
    return products.map(product => ({
      ...product,
      imageUrl: product.imageUrl 
        ? `${SPRING_BOOT_URL}${product.imageUrl}`
        : null
    }));
  }
  
  // Single product
  return {
    ...products,
    imageUrl: products.imageUrl 
      ? `${SPRING_BOOT_URL}${products.imageUrl}`
      : null
  };
};

export const api = {
  async createProduct(productData) {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(productData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Failed to create product: ${response.status}`);
    }
    
    return transformProductImages(data);
  },
  
 async login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  
  return data;
},

async register(userData) {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  
  return data;
},

  async updateUser(userId, userData) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  // Products - UPDATED
  async getProducts() {
    const response = await fetch(`${API_BASE_URL}/products`);
    const data = await response.json();
    return transformProductImages(data);
  },

  async getProductById(id) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    const data = await response.json();
    return transformProductImages(data);
  },

  async searchProducts(keyword) {
    const response = await fetch(`${API_BASE_URL}/products/search?keyword=${encodeURIComponent(keyword)}`);
    const data = await response.json();
    return transformProductImages(data);
  },

  async getProductsByCategory(categoryId) {
    const response = await fetch(`${API_BASE_URL}/products/category/${categoryId}`);
    const data = await response.json();
    return transformProductImages(data);
  },

  // Cart (unchanged)
  async getCart(userId) {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}`);
    return response.json();
  },

  async addToCart(userId, productId, quantity = 1) {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}/add/${productId}?quantity=${quantity}`, {
      method: 'POST'
    });
    return response.json();
  },

  async updateCartItem(userId, productId, quantity) {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}/update/${productId}?quantity=${quantity}`, {
      method: 'PUT'
    });
    return response.json();
  },

  async removeFromCart(userId, productId) {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}/remove/${productId}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  async clearCart(userId) {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}/clear`, {
      method: 'DELETE'
    });
    return response.text();
  },

  // Orders (unchanged)
  async getOrders() {
    const response = await fetch(`${API_BASE_URL}/orders`);
    return response.json();
  },

  async getOrderById(id) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`);
    return response.json();
  },

  async getUserOrders(userId) {
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
    return response.json();
  },

  async createOrder(userId, items) {
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    return response.json();
  },

  // Categories (unchanged)
  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return response.json();
  },

  async getCategoryById(id) {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    return response.json();
  },

  // Payments (unchanged)
  async createPayment(orderId, paymentMethod) {
    const response = await fetch(`${API_BASE_URL}/payment/order/${orderId}?paymentMethod=${paymentMethod}`, {
      method: 'POST'
    });
    return response.json();
  },

  // Optional: Add a direct image test function
  async testImageUrl(imagePath) {
    if (!imagePath) return null;
    return `${SPRING_BOOT_URL}${imagePath}`;
  }
};