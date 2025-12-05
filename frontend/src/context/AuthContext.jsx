// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api'; // Import your API service

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email);
      
      const result = await api.login(email, password);
      console.log('Login API result:', result);
      
      if (result.id || result.token) {
        // Build user object based on your Spring Boot User entity
        const authenticatedUser = {
          id: result.id,
          email: result.email,
          firstName: result.firstName,
          lastName: result.lastName,
          token: result.token,
          name: `${result.firstName} ${result.lastName}`.trim()
        };
        
        console.log('Setting user:', authenticatedUser);
        setUser(authenticatedUser);
        localStorage.setItem('user', JSON.stringify(authenticatedUser));
        return { success: true, user: authenticatedUser };
      } else {
        return { 
          success: false, 
          error: result.message || 'Invalid email or password' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    console.log('Logging out...');
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('cart'); // Clear cart on logout
  };

  const register = async (userData) => {
    try {
      console.log('Registering user:', userData);
      
      const result = await api.register(userData);
      console.log('Registration API result:', result);
      
      if (result.id) {
        // After successful registration, automatically login
        const loginResult = await login(userData.email, userData.password);
        
        if (loginResult.success) {
          return { success: true, user: loginResult.user };
        }
      }
      
      return { 
        success: false, 
        error: result.message || 'Registration failed' 
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};