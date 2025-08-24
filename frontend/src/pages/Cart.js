import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const updateQuantity = (productId, newQuantity) => {
    const updatedCart = cart.map(item =>
      item.product._id === productId
        ? { ...item, quantity: Math.max(0, newQuantity) }
        : item
    ).filter(item => item.quantity > 0);
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cart.filter(item => item.product._id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const placeOrder = async () => {
    if (!deliveryAddress.trim()) {
      alert('Please enter delivery address');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      const orderData = {
        items: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        deliveryAddress
      };

      await axios.post(`${process.env.REACT_APP_API_URL}/orders`, orderData);
      
      // Clear cart
      localStorage.removeItem('cart');
      setCart([]);
      setDeliveryAddress('');
      
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order: ' + (error.response?.data?.message || error.message));
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center">
        <h1>Your Cart</h1>
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Your Cart</h1>
      
      {cart.map(item => (
        <div key={item.product._id} className="cart-item">
          <div>
            <h4>{item.product.name}</h4>
            <p>Price: ${item.price}</p>
          </div>
          
          <div>
            <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>
              -
            </button>
            <span style={{ margin: '0 1rem' }}>{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
              disabled={item.quantity >= item.product.stock}
            >
              +
            </button>
          </div>
          
          <div>
            <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
            <button 
              onClick={() => removeItem(item.product._id)}
              className="btn btn-danger"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      
      <div className="cart-total">
        <h3>Total: ${getTotal().toFixed(2)}</h3>
      </div>
      
      <div className="form-group">
        <label>Delivery Address:</label>
        <textarea
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          rows="3"
          style={{ width: '100%' }}
          required
        />
      </div>
      
      <button onClick={placeOrder} className="btn btn-success">
        Place Order
      </button>
    </div>
  );
};

export default Cart;