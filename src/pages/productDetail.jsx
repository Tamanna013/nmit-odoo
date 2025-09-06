import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = ({ productId, onNavigate }) => {
  const { allProducts, addToCart } = useProducts();
  const { currentUser } = useAuth();
  
  const product = allProducts.find(p => p.id === parseInt(productId));
  const [selectedImage, setSelectedImage] = useState(0);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <button
          onClick={() => onNavigate('product-feed')}
          className="text-green-600 hover:text-green-700 font-medium"
        >
          Back to products
        </button>
      </div>
    );
  }

  // Generate multiple images for demonstration
  const productImages = [
    product.image,
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&h=300&fit=crop'
  ];

  const handleAddToCart = () => {
    addToCart(product);
    onNavigate('cart');
  };

  const isOwner = currentUser && product.sellerId === currentUser.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Product Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">Product Page</h1>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Product Images Section */}
              <div>
                <div className="mb-4 relative overflow-hidden rounded-lg bg-gray-200 aspect-square">
                  <img
                    src={productImages[selectedImage]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Image Thumbnails */}
                <div className="grid grid-cols-5 gap-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square overflow-hidden rounded-md border-2 ${
                        selectedImage === index ? 'border-green-600' : 'border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                
                <div className="mt-2 text-center text-sm text-gray-500">
                  Should have more than 1 image
                </div>
              </div>

              {/* Product Information Section */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h2>
                
                <div className="flex items-center mb-4">
                  <span className="text-3xl font-bold text-green-600">${product.price}</span>
                  {product.originalPrice && (
                    <span className="ml-2 text-lg text-gray-500 line-through">${product.originalPrice}</span>
                  )}
                </div>

                {/* Category and Status */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded">
                    {product.category}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                    {product.condition || 'Used'}
                  </span>
                  {product.status && (
                    <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded">
                      {product.status}
                    </span>
                  )}
                </div>

                {/* Product Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                {/* Product Details Section */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Product Description should contains all the required field
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {product.brand && (
                      <div>
                        <span className="font-medium text-gray-700">Brand:</span>
                        <span className="ml-2 text-gray-600">{product.brand}</span>
                      </div>
                    )}
                    
                    {product.model && (
                      <div>
                        <span className="font-medium text-gray-700">Model:</span>
                        <span className="ml-2 text-gray-600">{product.model}</span>
                      </div>
                    )}
                    
                    {product.year && (
                      <div>
                        <span className="font-medium text-gray-700">Year:</span>
                        <span className="ml-2 text-gray-600">{product.year}</span>
                      </div>
                    )}
                    
                    {product.material && (
                      <div>
                        <span className="font-medium text-gray-700">Material:</span>
                        <span className="ml-2 text-gray-600">{product.material}</span>
                      </div>
                    )}
                    
                    {product.color && (
                      <div>
                        <span className="font-medium text-gray-700">Color:</span>
                        <span className="ml-2 text-gray-600">{product.color}</span>
                      </div>
                    )}
                    
                    {product.dimensions && (
                      <div>
                        <span className="font-medium text-gray-700">Dimensions:</span>
                        <span className="ml-2 text-gray-600">
                          {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height}
                        </span>
                      </div>
                    )}
                    
                    {product.weight && (
                      <div>
                        <span className="font-medium text-gray-700">Weight:</span>
                        <span className="ml-2 text-gray-600">{product.weight} kg</span>
                      </div>
                    )}
                    
                    <div>
                      <span className="font-medium text-gray-700">Original Packaging:</span>
                      <span className="ml-2 text-gray-600">
                        {product.originalPackaging ? 'Yes' : 'No'}
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700">Manual Included:</span>
                      <span className="ml-2 text-gray-600">
                        {product.manualIncluded ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                  
                  {product.workingCondition && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-1">Working Condition:</h4>
                      <p className="text-gray-600 text-sm">{product.workingCondition}</p>
                    </div>
                  )}
                </div>

                {/* Seller Information */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Seller Information</h3>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                      {currentUser?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{currentUser?.name || 'Unknown Seller'}</p>
                      <p className="text-sm text-gray-500">Member since 2023</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {!isOwner ? (
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart Button
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate('my-listings')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      My Listings
                    </button>
                  )}
                  
                  <button
                    onClick={() => onNavigate('product-feed')}
                    className="py-3 px-6 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Back to Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;