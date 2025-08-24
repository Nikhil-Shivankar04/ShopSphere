import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/orders`);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/admin/orders/${orderId}/status`, {
        status: newStatus
      });
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div>
      <h2>Manage Orders</h2>
      
      {orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="admin-section">
            <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
            <p><strong>Customer:</strong> {order.user?.name} ({order.user?.email})</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
            <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
            
            <div className="form-group">
              <label><strong>Status:</strong></label>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                style={{ marginLeft: '1rem' }}
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <h4>Items:</h4>
            {order.items.map(item => (
              <div key={item._id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #eee' }}>
                <p><strong>Product:</strong> {item.product?.name || 'Product not available'}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                <p><strong>Subtotal:</strong> ${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;