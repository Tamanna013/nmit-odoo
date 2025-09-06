import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import ProductFeed from './pages/productFeed';
import ProductDetail from './pages/productDetail';
import AddProduct from './pages/addProduct';
import UserDashboard from './pages/userDashboard';
import MyListings from './pages/myListings';
import PreviousPurchases from './pages/previousPurchases';
import Login from './pages/login';
import Signup from './pages/signup';
import Cart from './pages/cart';

const App = () => {
  const [currentPage, setCurrentPage] = React.useState('product-feed');
  const [pageParam, setPageParam] = React.useState(null);

  const navigateTo = (page, param = null) => {
    setCurrentPage(page);
    setPageParam(param);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'product-feed':
        return <ProductFeed onNavigate={navigateTo} />;
      case 'product-detail':
        return <ProductDetail productId={pageParam} onNavigate={navigateTo} />;
      case 'add-product':
        return <AddProduct onNavigate={navigateTo} />;
      case 'user-dashboard':
        return <UserDashboard onNavigate={navigateTo} />;
      case 'my-listings':
        return <MyListings onNavigate={navigateTo} />;
      case 'previous-purchases':
        return <PreviousPurchases onNavigate={navigateTo} />;
      case 'login':
        return <Login onNavigate={navigateTo} />;
      case 'signup':
        return <Signup onNavigate={navigateTo} />;
      case 'cart':
        return <Cart onNavigate={navigateTo} />;
      default:
        return <ProductFeed onNavigate={navigateTo} />;
    }
  };

  return (
    <AuthProvider>
      <ProductProvider>
        <div className="App">
          {renderPage()}
        </div>
      </ProductProvider>
    </AuthProvider>
  );
};

export default App;