import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './ProductForm.css';

const ProductForm = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '1', // Default to 1
    imageFile: null,
    categoryId: ''
  });

  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await api.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Failed to load categories');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.match('image.*')) {
        setError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      setFormData({
        ...formData,
        imageFile: file
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToServer = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('http://localhost:8080/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.filePath; // Should return something like "/uploads/products/filename.jpg"
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate required fields
      if (!formData.name || !formData.price || !formData.categoryId) {
        throw new Error('Please fill in all required fields');
      }

      let imageUrl = '';

      // Upload image if selected
      if (formData.imageFile) {
        setUploadingImage(true);
        try {
          imageUrl = await uploadImageToServer(formData.imageFile);
          console.log('Image uploaded to:', imageUrl);
        } catch (uploadError) {
          console.error('Failed to upload image:', uploadError);
          // Continue without image if upload fails
        }
        setUploadingImage(false);
      }

      // Prepare product data
      const productData = {
        name: formData.name,
        description: formData.description || '',
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity) || 1,
        imageUrl: imageUrl || '',
        category: { 
          id: parseInt(formData.categoryId) 
        }
      };

      console.log('Sending product data:', productData);

      // Create product
      const createdProduct = await api.createProduct(productData);
      
      console.log('Product created:', createdProduct);
      
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        stockQuantity: '1',
        imageFile: null,
        categoryId: ''
      });
      setImagePreview('');
      
      // Redirect to products page after 2 seconds
      setTimeout(() => {
        navigate('/products');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error.message || 'Failed to create product. Please check your input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <div className="product-form-header">
        <h2>Sell Your Item</h2>
        <button 
          className="btn-back"
          onClick={() => navigate('/products')}
          type="button"
          disabled={loading}
        >
          ← Back to Products
        </button>
      </div>

      {success && (
        <div className="success-message">
          <div className="message-content">
            <span className="success-icon">✅</span>
            <div>
              <strong>Item listed successfully!</strong>
              <p>Redirecting to products page...</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <div className="message-content">
            <span className="error-icon">❌</span>
            <div>
              <strong>Error:</strong>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-section">
          <h3>Item Details</h3>
          
          <div className="form-group">
            <label htmlFor="name" className="required-label">
              What are you selling? *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., iPhone 13, Nike Air Max, Vintage Chair"
              disabled={loading}
              className={formData.name ? 'filled' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Tell buyers about your item: condition, features, etc."
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Price & Category</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price" className="required-label">
                Price (₱) *
              </label>
              <div className="input-with-icon">
                <span className="currency-icon">₱</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  disabled={loading}
                  className={formData.price ? 'filled' : ''}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="stockQuantity">Quantity *</label>
              <input
                type="number"
                id="stockQuantity"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                required
                min="1"
                placeholder="1"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="categoryId" className="required-label">
              Category *
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              disabled={loading || categories.length === 0}
              className={formData.categoryId ? 'filled' : ''}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && !loading && (
              <small className="form-warning">No categories found. Please contact admin.</small>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Add Photos</h3>
          
          <div className="form-group">
            <label htmlFor="imageFile">
              Upload Photo (Optional)
            </label>
            <div className="file-upload-area">
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading || uploadingImage}
                style={{ display: 'none' }}
              />
              <label 
                htmlFor="imageFile" 
                className="file-upload-label"
              >
                {imagePreview ? (
                  <div className="image-preview-small">
                    <img src={imagePreview} alt="Preview" />
                    <span className="change-text">Change Photo</span>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <span className="upload-icon">📷</span>
                    <span className="upload-text">Click to upload a photo</span>
                    <small className="upload-hint">JPEG, PNG up to 5MB</small>
                  </div>
                )}
              </label>
            </div>
            
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate('/products')}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={loading || uploadingImage || !formData.name || !formData.price || !formData.categoryId}
          >
            {(loading || uploadingImage) ? (
              <>
                <span className="spinner"></span>
                {uploadingImage ? 'Uploading Photo...' : 'Creating Listing...'}
              </>
            ) : (
              'List Item for Sale'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;