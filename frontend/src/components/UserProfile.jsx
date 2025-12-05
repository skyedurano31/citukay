// components/UserProfile.js - Updated for simplified Address entity
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    zipCode: '',
    isDefault: false
  });
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Load user data and addresses
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      loadUserAddresses();
    }
  }, [user]);

  const loadUserAddresses = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/addresses/user/${user.id}`);
      if (response.ok) {
        const userAddresses = await response.json();
        setAddresses(userAddresses);
      }
    } catch (err) {
      console.error('Failed to load addresses:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        if (updateUser) {
          updateUser(updatedUser);
        }
        setSuccess('Profile updated successfully!');
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setAddressLoading(true);
    setError('');

    try {
      const url = editingAddressId 
        ? `http://localhost:8080/api/addresses/${editingAddressId}`
        : `http://localhost:8080/api/addresses/user/${user.id}`;
      
      const method = editingAddressId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressForm)
      });

      if (response.ok) {
        const savedAddress = await response.json();
        
        if (editingAddressId) {
          setAddresses(addresses.map(addr => 
            addr.id === savedAddress.id ? savedAddress : addr
          ));
        } else {
          setAddresses([...addresses, savedAddress]);
        }
        
        // Reset form
        setAddressForm({
          street: '',
          city: '',
          zipCode: '',
          isDefault: false
        });
        setEditingAddressId(null);
        setSuccess(editingAddressId ? 'Address updated!' : 'Address added!');
      } else {
        setError('Failed to save address');
      }
    } catch (err) {
      setError('Failed to save address: ' + err.message);
    } finally {
      setAddressLoading(false);
    }
  };

  const handleEditAddress = (address) => {
    setAddressForm({
      street: address.street || '',
      city: address.city || '',
      zipCode: address.zipCode || '',
      isDefault: address.isDefault || false
    });
    setEditingAddressId(address.id);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      const response = await fetch(`http://localhost:8080/api/addresses/${addressId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setAddresses(addresses.filter(addr => addr.id !== addressId));
        setSuccess('Address deleted successfully!');
      } else {
        setError('Failed to delete address');
      }
    } catch (err) {
      setError('Failed to delete address: ' + err.message);
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/addresses/${addressId}/set-default`, {
        method: 'PUT'
      });

      if (response.ok) {
        // Update local state
        const updatedAddresses = addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === addressId
        }));
        setAddresses(updatedAddresses);
        setSuccess('Default address updated!');
      }
    } catch (err) {
      setError('Failed to set default address');
    }
  };

  if (!user) {
    return <div className="error">Please login to view your profile</div>;
  }

  return (
    <div className="user-profile">
      <h2>My Profile</h2>
      
      <div className="profile-content">
        {/* Profile Form */}
        <div className="profile-form-section">
          <form onSubmit={handleSubmit}>
            <h3>Edit Profile</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled
              />
              <small className="form-help">Email cannot be changed</small>
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (123) 456-7890"
              />
            </div>
            
            {success && !success.includes('Address') && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}
            
            <button 
              type="submit" 
              className="btn-save"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
        
        {/* Address Management Section */}
        <div className="address-section">
          <h3>My Addresses</h3>
          
          {/* Address Form */}
          <form onSubmit={handleAddressSubmit} className="address-form">
            <h4>{editingAddressId ? 'Edit Address' : 'Add New Address'}</h4>
            
            <div className="form-group">
              <label>Street Address</label>
              <input
                type="text"
                name="street"
                value={addressForm.street}
                onChange={handleAddressChange}
                required
                placeholder="123 Main St"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={addressForm.city}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={addressForm.zipCode}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-check">
              <input
                type="checkbox"
                name="isDefault"
                id="isDefault"
                checked={addressForm.isDefault}
                onChange={handleAddressChange}
              />
              <label htmlFor="isDefault">Set as default address</label>
            </div>
            
            <div className="form-buttons">
              <button 
                type="submit" 
                className="btn-save"
                disabled={addressLoading}
              >
                {addressLoading ? 'Saving...' : (editingAddressId ? 'Update Address' : 'Add Address')}
              </button>
              
              {editingAddressId && (
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => {
                    setEditingAddressId(null);
                    setAddressForm({
                      street: '',
                      city: '',
                      zipCode: '',
                      isDefault: false
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          
          {/* Address List */}
          <div className="address-list">
            {addresses.length === 0 ? (
              <p className="no-addresses">No addresses saved yet.</p>
            ) : (
              addresses.map(address => (
                <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                  <div className="address-content">
                    {address.isDefault && <span className="default-badge">⭐ Default</span>}
                    <p className="address-street">{address.street}</p>
                    <p className="address-city">{address.city}, {address.zipCode}</p>
                  </div>
                  <div className="address-actions">
                    <button 
                      onClick={() => handleEditAddress(address)}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => setDefaultAddress(address.id)}
                      className="btn-default"
                      disabled={address.isDefault}
                    >
                      {address.isDefault ? 'Default' : 'Set Default'}
                    </button>
                    <button 
                      onClick={() => handleDeleteAddress(address.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Danger Zone */}
        <div className="danger-zone">
          <h3>Danger Zone</h3>
          <button 
            className="btn-danger"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                console.log('Account deletion requested');
              }
            }}
          >
            Delete Account
          </button>
          <p className="warning-text">
            Warning: This action cannot be undone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;