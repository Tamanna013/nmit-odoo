import React from 'react';
import { useProducts } from '../context/ProductContext';

const ProductCard = ({ product, onNavigate }) => {
  const { addToCart } = useProducts();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => onNavigate('product-detail', product.id)}
    >
      <div className="relative pb-[70%] overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">
          {product.title}
        </h3>
        
        <p className="text-green-600 font-bold text-lg mb-2">
          ${product.price}
        </p>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
            {product.category}
          </span>
          
          <button
            onClick={handleAddToCart}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;