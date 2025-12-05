// components/OrderHistory.js (FIXED VERSION)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import OrderDetail from './OrderDetail';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Changed from selectedOrder

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const data = await api.getUserOrders(user.id);
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (selectedOrderId) {
    // Find the selected order to pass some data
    const selectedOrder = orders.find(o => o.id === selectedOrderId);
    return (
      <OrderDetail 
        orderId={selectedOrderId}
        order={selectedOrder} // Optional: pass order data for immediate display
        onBack={() => setSelectedOrderId(null)} 
      />
    );
  }

  if (orders.length === 0) {
    return (
      <div className="no-orders">
        <h2>No Orders Yet</h2>
        <p>Start shopping to see your orders here!</p>
        <button onClick={() => window.location.href = '/products'} className="btn-primary">
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="order-history">
      <h2>Order History</h2>
      
      <div className="orders-list">
        {orders.map(order => (
          <div 
            key={order.id} 
            className="order-card"
          >
            <div className="order-header">
              <div>
                <h3>Order #{order.id}</h3>
                <p className="order-date">Placed on {formatDate(order.orderDate)}</p>
              </div>
              <span className={`order-status ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            
            <div className="order-summary">
              <div className="order-items">
                {order.items && order.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="order-item-preview">
                    <span>{item.productName}</span>
                    <span>x{item.quantity}</span>
                  </div>
                ))}
                {order.items && order.items.length > 2 && (
                  <div className="more-items">+{order.items.length - 2} more items</div>
                )}
              </div>
              
              <div className="order-total">
                Total: ${order.totalAmount?.toFixed(2) || '0.00'}
              </div>
            </div>
            
            <div className="order-actions">
              <button 
                className="btn-view-details"
                onClick={() => setSelectedOrderId(order.id)} // FIXED: Pass ID, not object
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;