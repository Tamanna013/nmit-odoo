import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/mockData';

const AddProduct = ({ onNavigate }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState('Used');
  const [year, setYear] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [dimensions, setDimensions] = useState({ length: '', width: '', height: '' });
  const [weight, setWeight] = useState('');
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');
  const [originalPackaging, setOriginalPackaging] = useState(false);
  const [manualIncluded, setManualIncluded] = useState(false);
  const [workingCondition, setWorkingCondition] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { addProduct } = useProducts();
  const { currentUser } = useAuth();

  const handleDimensionChange = (dimension, value) => {
    setDimensions(prev => ({
      ...prev,
      [dimension]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check for required fields before proceeding
    if (!title || !description || !price || !image) {
      return setError('Please fill in all required fields');
    }
    
    // ⭐ Add the conditional check here to prevent the TypeError
    if (!currentUser) {
      setError('You must be logged in to add a product.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      const newProduct = {
        title,
        description,
        category,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        condition,
        year: year ? parseInt(year) : null,
        brand,
        model,
        dimensions,
        weight: weight ? parseFloat(weight) : null,
        material,
        color,
        originalPackaging,
        manualIncluded,
        workingCondition,
        image,
        sellerId: currentUser.id // This line is now safe
      };
      
      const result = await addProduct(newProduct);
      
      if (result && result.success) {
        onNavigate('my-listings');
      } else {
        // Handle cases where the mock API returns an error
        setError(result.message || 'Failed to create product');
      }
    } catch (err) {
      // Catch any network or unexpected errors
      setError('Failed to create product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Add a new Product</h1>
            <p className="text-gray-600">List your item for sale on EcoFinds</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Product Details</h2>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL *
                    </label>
                    <input
                      id="image"
                      type="url"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Paste image URL here"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                    {image && (
                      <div className="mt-4 flex justify-center">
                        <img src={image} alt="Preview" className="h-48 w-48 object-contain rounded-md border border-gray-200" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Title *
                    </label>
                    <input
                      id="title"
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter product title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Category *
                    </label>
                    <select
                      id="category"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Description *
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Describe your product in detail..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($) *
                      </label>
                      <input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>

                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity *
                      </label>
                      <input
                        id="quantity"
                        type="number"
                        min="1"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                      Condition *
                    </label>
                    <select
                      id="condition"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                    >
                      <option value="New">New</option>
                      <option value="Like New">Like New</option>
                      <option value="Used">Used</option>
                      <option value="Refurbished">Refurbished</option>
                      <option value="For Parts">For Parts</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Optional Details</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                      Year of Manufacture
                    </label>
                    <input
                      id="year"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g. 2020"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                        Brand
                      </label>
                      <input
                        id="brand"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Product brand"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                      />
                    </div>

                    <div>
                      <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                        Model
                      </label>
                      <input
                        id="model"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Product model"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dimensions (L, W, H)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Length"
                          value={dimensions.length}
                          onChange={(e) => handleDimensionChange('length', e.target.value)}
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Width"
                          value={dimensions.width}
                          onChange={(e) => handleDimensionChange('width', e.target.value)}
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Height"
                          value={dimensions.height}
                          onChange={(e) => handleDimensionChange('height', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      id="weight"
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Product weight in kg"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-1">
                      Material
                    </label>
                    <input
                      id="material"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Product material"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <input
                      id="color"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Product color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        id="original-packaging"
                        type="checkbox"
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        checked={originalPackaging}
                        onChange={(e) => setOriginalPackaging(e.target.checked)}
                      />
                      <label htmlFor="original-packaging" className="ml-2 block text-sm text-gray-900">
                        Original Packaging
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="manual-included"
                        type="checkbox"
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        checked={manualIncluded}
                        onChange={(e) => setManualIncluded(e.target.checked)}
                      />
                      <label htmlFor="manual-included" className="ml-2 block text-sm text-gray-900">
                        Manual/Instructions Included
                      </label>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="working-condition" className="block text-sm font-medium text-gray-700 mb-1">
                      Working Condition Description
                    </label>
                    <textarea
                      id="working-condition"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Describe the working condition of the product..."
                      value={workingCondition}
                      onChange={(e) => setWorkingCondition(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => onNavigate('product-feed')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? 'Adding Item...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;