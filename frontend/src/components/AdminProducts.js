import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'General'
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    if (image) {
      submitData.append('image', image);
    }

    try {
      if (editingProduct) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/admin/products/${editingProduct._id}`,
          submitData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/admin/products`,
          submitData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }

      setShowForm(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', stock: '', category: 'General' });
      setImage(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/admin/products/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product: ' + (error.response?.data?.message || error.message));
    }
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', stock: '', category: 'General' });
    setImage(null);
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Manage Products</h2>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          Add New Product
        </button>
      </div>

      {showForm && (
        <div className="admin-section">
          <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows="3"
                style={{ width: '100%' }}
              />
            </div>

            <div className="form-group">
              <label>Price:</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Stock:</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Category:</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Image:</label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
              />
            </div>

            <div>
              <button type="submit" className="btn btn-success">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button type="button" onClick={cancelEdit} className="btn btn-danger" style={{ marginLeft: '1rem' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-grid">
        {products.map(product => (
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
            
            <div>
              <button 
                onClick={() => handleEdit(product)}
                className="btn btn-primary"
                style={{ marginRight: '0.5rem' }}
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(product._id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <p className="text-center">No products found.</p>
      )}
    </div>
  );
};

export default AdminProducts;