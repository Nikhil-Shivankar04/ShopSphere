import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="nav-link">Shop Sphere</Link>
      </div>
      
      <ul className="navbar-nav">
        <li><Link to="/" className="nav-link">Home</Link></li>
        <li><Link to="/products" className="nav-link">Products</Link></li>
        
        {user ? (
          <>
            <li><Link to="/cart" className="nav-link">Cart</Link></li>
            <li><Link to="/orders" className="nav-link">My Orders</Link></li>
            {user.role === 'admin' && (
              <li><Link to="/admin" className="nav-link">Admin</Link></li>
            )}
            <li>
              <span className="nav-link">Hello, {user.name}</span>
            </li>
            <li>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="nav-link">Login</Link></li>
            <li><Link to="/register" className="nav-link">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;