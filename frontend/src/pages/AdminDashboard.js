import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminProducts from '../components/AdminProducts';
import AdminOrders from '../components/AdminOrders';

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      <nav style={{ marginBottom: '2rem' }}>
        <Link 
          to="/admin/products" 
          style={{
            marginRight: '1rem',
            padding: '0.5rem 1rem',
            background: location.pathname === '/admin/products' ? '#3498db' : '#eee',
            color: location.pathname === '/admin/products' ? 'white' : '#333',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Manage Products
        </Link>
        <Link 
          to="/admin/orders"
          style={{
            padding: '0.5rem 1rem',
            background: location.pathname === '/admin/orders' ? '#3498db' : '#eee',
            color: location.pathname === '/admin/orders' ? 'white' : '#333',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Manage Orders
        </Link>
      </nav>

      <Routes>
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="/" element={<AdminProducts />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;