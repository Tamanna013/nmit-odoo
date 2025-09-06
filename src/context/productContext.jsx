import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockProducts, mockPurchases } from '../data/mockData';
import { useAuth } from './AuthContext';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const { currentUser } = useAuth();

  // Initialize with mock data
  useEffect(() => {
    setAllProducts(mockProducts);
    setPurchases(mockPurchases);
  }, []);

  // Get current user's products
  const myProducts = allProducts.filter(product => product.sellerId === currentUser?.id);

  const addProduct = (productData) => {
    const newProduct = {
      id: Date.now(), // Generate unique ID
      ...productData,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    setAllProducts(prev => [newProduct, ...prev]);
    return { success: true, product: newProduct };
  };

  const deleteProduct = (productId) => {
    setAllProducts(prev => prev.filter(product => product.id !== productId));
  };

  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const checkout = () => {
    // Convert cart items to purchases
    const newPurchases = cartItems.map(item => ({
      ...item,
      purchaseDate: new Date().toISOString(),
      status: 'completed'
    }));
    
    setPurchases(prev => [...prev, ...newPurchases]);
    setCartItems([]);
    
    return { success: true, message: 'Checkout completed successfully' };
  };

  const value = {
    allProducts,
    purchases,
    cartItems,
    myProducts,
    addProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    checkout
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};