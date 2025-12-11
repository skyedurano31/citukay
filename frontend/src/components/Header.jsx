import React, { useState } from 'react';
// 1. Change Link to NavLink
import { NavLink, Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SearchBar from './SearchBar';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Helper function to close menu and apply active-link class
  const navLinkClass = ({ isActive }) => {
    setMobileMenuOpen(false); // Close menu on click (for mobile)
    return isActive ? 'active-link' : '';
  };

  return (
    <header className="header">
      <div className="header-container">

        <div className="logo">
          {/* Use Link for the logo as it doesn't need 'active' styling */}
          <Link to="/">
            <img 
              src="/images/citlogo.png" 
              alt="CIT-U Logo"
              className="logo-image"
            />
            CITUKAY
          </Link>
        </div>

        <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`}>
          {/* 2. Use NavLink and the navLinkClass helper function */}
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>
          {user && (
            <NavLink to="/orders" className={navLinkClass}>
              Orders
            </NavLink>
          )}
        </nav>

        <div className="header-actions">
          <SearchBar />
          
          <div className="cart-icon">
            <Link to="/cart">
              🛒
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </div>

          {user ? (
            <div className="user-menu">
              <span className="user-name">Hi, {user.name}</span>
              <div className="dropdown">
                <Link to="/profile">Profile</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;