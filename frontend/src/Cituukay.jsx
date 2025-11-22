import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import './CituukayApp.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to products if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/products" />;
};

function AppContent() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/products" />} />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />

          <Route
           path="/cart" element={<Cart />} 
          />
          
          {/* Protected routes */}
          <Route 
            path="/products" 
            element={
              <ProductList />
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <div className="page-container">
                  <h1>My Orders</h1>
                  <p>Order history will be displayed here.</p>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <div className="page-container">
                  <h1>User Profile</h1>
                  <p>User profile management will be here.</p>
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* 404 page */}
          <Route path="*" element={
            <div className="page-container">
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

function Cituukay() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default Cituukay;