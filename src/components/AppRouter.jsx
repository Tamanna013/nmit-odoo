import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/login';
import Register from '../pages/signup';
import ProductFeed from '../pages/productFeed';
import ProductDetail from '../pages/productDetail';
import AddProduct from '../pages/addProduct';
import MyListings from '../pages/myListings';
import UserDashboard from '../pages/userDashboard';
import Cart from '../pages/cart';
import PreviousPurchases from '../pages/previousPurchases';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProductFeed />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/purchases" element={<PreviousPurchases />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;