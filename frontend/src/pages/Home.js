import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="text-center">
      <h1>Welcome to Shop Sphere</h1>
      <p className="mt-2">Your one-stop destination for amazing products</p>
      
      {!user ? (
        <div className="mt-3">
          <Link to="/register" className="btn btn-primary mr-2">Get Started</Link>
          <Link to="/products" className="btn btn-success">Browse Products</Link>
        </div>
      ) : (
        <div className="mt-3">
          <Link to="/products" className="btn btn-primary mr-2">Shop Now</Link>
          {user.role === 'admin' && (
            <Link to="/admin" className="btn btn-success">Admin Dashboard</Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;