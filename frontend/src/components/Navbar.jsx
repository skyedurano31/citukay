import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCartCount = async () => {
    if (!isAuthenticated || !user) {
      setCartItemsCount(0);
      return;
    }

    try {
      setLoading(true);
      const userId = user.id || 1;
      const response = await fetch(`http://localhost:8080/api/cart/${userId}`);
      
      if (response.ok) {
        const cart = await response.json();
        const count = cart.cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
        setCartItemsCount(count);
      } else {
        setCartItemsCount(0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartItemsCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartCount();

    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [isAuthenticated, user]); // Re-fetch when auth state changes

  // Also fetch cart count when component mounts and when user changes
  useEffect(() => {
    fetchCartCount();
  }, [user, isAuthenticated]);

  const handleLogout = () => {
    logout();
    setCartItemsCount(0); // Reset cart count on logout
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
            Products
          </Link>
          
          {/* My Cart Button - Always visible */}
          <Link to="/cart" className="nav-link cart-link">
            <span className="cart-icon">🛒</span>
            {!loading && cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
            {loading && (
              <span className="cart-loading">...</span>
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