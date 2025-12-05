import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Function to get cart item count
  const getCartItemCount = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Update cart count on component mount and when cart updates
  useEffect(() => {
    setCartItemsCount(getCartItemCount());

    const handleCartUpdate = () => {
      setCartItemsCount(getCartItemCount());
    };

    // Listen for cart update events
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Cleanup
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img 
            src="/images/citlogo.png" 
            alt="CITU-UKAY Logo" 
            className="logo-image"
          />
          CITU-UKAY
        </Link>

        <div className="nav-menu">
          <Link to="/products" className="nav-link">
            UkayUkay
          </Link>
          
          {/* My Cart Button - Always visible */}
          <Link to="/cart" className="nav-link cart-link">
            <span className="cart-icon">🛒</span>
            My Cart
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/orders" className="nav-link">
                My Orders
              </Link>
              <div className="nav-user">
                <span className="welcome-text">Welcome, {currentUser?.firstName}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="nav-link signup-btn">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;