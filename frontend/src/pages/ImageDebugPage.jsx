// pages/ImageDebugPage.js
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const ImageDebugPage = () => {
  const [products, setProducts] = useState([]);
  const [imageTests, setImageTests] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      console.log('Products with transformed URLs:', data);
      setProducts(data);
      
      // Test each image
      data.forEach(product => {
        if (product.imageUrl) {
          testImage(product.imageUrl, product.name);
        }
      });
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const testImage = (url, productName) => {
    const img = new Image();
    img.onload = () => {
      console.log(`✅ ${productName}: Image loads - ${url}`);
      setImageTests(prev => [...prev, { url, productName, status: 'success' }]);
    };
    img.onerror = () => {
      console.log(`❌ ${productName}: Image FAILS - ${url}`);
      setImageTests(prev => [...prev, { url, productName, status: 'error' }]);
    };
    img.src = url;
  };

  const openImageInTab = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Image Debug Page</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Image Test Results</h3>
        {imageTests.map((test, index) => (
          <div key={index} style={{ 
            margin: '5px', 
            padding: '5px', 
            backgroundColor: test.status === 'success' ? '#d4edda' : '#f8d7da',
            color: test.status === 'success' ? '#155724' : '#721c24'
          }}>
            <strong>{test.productName}:</strong> {test.status} - 
            <a href="#" onClick={() => openImageInTab(test.url)} style={{ marginLeft: '10px' }}>
              {test.url}
            </a>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <h3>{product.name}</h3>
            <p><strong>ID:</strong> {product.id}</p>
            <p><strong>Image URL:</strong> {product.imageUrl || 'No image'}</p>
            
            <div style={{ margin: '10px 0' }}>
              <img 
                src={product.imageUrl || '/images/default-product.jpg'} 
                alt={product.name}
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  objectFit: 'cover',
                  border: '2px solid #ccc',
                  backgroundColor: '#f5f5f5'
                }}
                onError={(e) => {
                  e.target.src = '/images/default-product.jpg';
                  e.target.alt = 'Default image';
                  e.target.style.border = '2px solid red';
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => openImageInTab(product.imageUrl)}>
                Open Image
              </button>
              <button onClick={() => console.log('Product data:', product)}>
                Log Data
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageDebugPage;