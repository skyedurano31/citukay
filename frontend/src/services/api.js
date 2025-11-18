import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData) => 
    api.post('/auth/register', userData),
};

// Products API calls
export const productsAPI = {
  getAllProducts: () => 
    api.get('/products'),
  
  getProductById: (id) => 
    api.get(`/products/${id}`),
  
  getProductsByCategory: (categoryId) => 
    api.get(`/products/category/${categoryId}`),
  
  searchProducts: (keyword) => 
    api.get(`/products/search?keyword=${keyword}`),
};

// Users API calls
export const usersAPI = {
  getUserById: (id) => 
    api.get(`/users/${id}`),
  
  updateUser: (id, userData) => 
    api.put(`/users/${id}`, userData),
};

// Orders API calls
export const ordersAPI = {
  createOrder: (userId, items) => 
    api.post(`/orders/user/${userId}`, items),
  
  getUserOrders: (userId) => 
    api.get(`/orders/user/${userId}`),
  
  getOrderById: (id) => 
    api.get(`/orders/${id}`),
};

export default api;