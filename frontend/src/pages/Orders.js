import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders/myorders`);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div>
      <h1>My Orders</h1>
      
      {orders.length === 0 ? (
        <p className="text-center">You haven't placed any orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="admin-section">
            <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span className={order.status.toLowerCase()}>{order.status}</span></p>
            <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
            <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
            
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

export default Orders;