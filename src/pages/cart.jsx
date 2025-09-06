import React from 'react';
import { useProducts } from '../context/ProductContext';

const Cart = ({ onNavigate }) => {
  const { cartItems, removeFromCart, checkout } = useProducts();

  // Calculate total safely
  const total = cartItems?.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0) || 0;

  const handleCheckout = () => {
    const result = checkout();
    if (result.success) {
      alert('Purchase completed successfully!');
      onNavigate('product-feed');
    } else {
      alert(result.message || 'Checkout failed. Please try again.');
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293极客时间c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 极客时间2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
            <p className="mt-1 text-sm text-gray-500">Start shopping to add items to your cart.</p>
            <div className="mt-6">
              <button
                onClick={() => onNavigate('product-feed')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart ({cartItems.length} items)</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={item.id || item._id || `cart-item-${index}`} className="flex items-center space-x-4 py-4 border-b border-gray-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.category}</p>
                    {item.quantity > 1 && (
                      <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <p className="text-green-600 font-bold">
                      ${(item.price * (item.quantity || 1)).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id || item._id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-green-600">${total.toFixed(2)}</span>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => onNavigate('product-feed')}
                  className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;