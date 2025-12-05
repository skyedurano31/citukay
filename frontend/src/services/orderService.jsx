// services/orderService.jsx
const API_BASE_URL = 'http://localhost:8080/api';

export const orderService = {
  async getOrders() {
    const response = await fetch(`${API_BASE_URL}/orders`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    
    return response.json();
  },

  async getOrderById(id) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch order');
    }
    
    return response.json();
  },

  async getUserOrders(userId) {
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user orders');
    }
    
    return response.json();
  },

  async createOrder(userId, items) {
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(items)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create order');
    }
    
    return response.json();
  },

  async updateOrderStatus(orderId, status) {
    const response = await fetch(
      `${API_BASE_URL}/orders/${orderId}/status?status=${encodeURIComponent(status)}`,
      { 
        method: 'PUT',
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to update order status');
    }
    
    return response.json();
  },

  async createPayment(orderId, paymentMethod) {
    const response = await fetch(
      `${API_BASE_URL}/payment/order/${orderId}?paymentMethod=${encodeURIComponent(paymentMethod)}`,
      { 
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to create payment');
    }
    
    return response.json();
  }
};

// If you want a default export too (optional):
// export default orderService;