import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, category, minPrice, maxPrice]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/products`);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category !== 'All') {
      filtered = filtered.filter(product => product.category === category);
    }

    if (minPrice) {
      filtered = filtered.filter(product => product.price >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(product => product.price <= Number(maxPrice));
    }

    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.product._id === product._id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        existingItem.quantity += 1;
      }
    } else {
      cart.push({
        product,
        quantity: 1,
        price: product.price
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
  };

  if (loading) return <div className="loading">Loading products...</div>;

  const categories = ['All', ...new Set(products.map(p => p.category))];

  return (
    <div>
      <h1>Products</h1>
      
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product._id} className="product-card">
            {product.image && (
              <img 
                src={`http://localhost:5000${product.image}`} 
                alt={product.name}
                className="product-image"
              />
            )}
            <h3 className="product-title">{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <p className="product-price">${product.price}</p>
            <p className="product-stock">Stock: {product.stock}</p>
            <p className="product-category">Category: {product.category}</p>
            
            {user && product.stock > 0 && (
              <button 
                onClick={() => addToCart(product)}
                className="btn btn-primary"
              >
                Add to Cart
              </button>
            )}
            
            {product.stock === 0 && (
              <p className="error">Out of Stock</p>
            )}
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <p className="text-center">No products found matching your criteria.</p>
      )}
    </div>
  );
};

export default Products;