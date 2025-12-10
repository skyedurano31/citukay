// pages/ProfilePage.js - Simplest version
import React from 'react';
import UserProfile from '../components/UserProfile';
import { Link } from 'react-router-dom'; // Import Link

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <UserProfile />
      
      {/* Simple link - ProfilePage is already protected by PrivateRoute */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        textAlign: 'center',
        borderTop: '1px solid #e0d0d0'
      }}>
        <Link 
          to="/products/new" 
          style={{
            display: 'inline-block',
            background: '#8B0000',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          + Sell an Item / Add Product
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;