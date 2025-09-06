import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';

const UserDashboard = ({ onNavigate }) => {
  const { currentUser, updateUser } = useAuth();
  const { allProducts, purchases } = useProducts();
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(currentUser?.username || currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  // Safely get user's products and purchases
  const myProducts = allProducts?.filter(product => product.sellerId === currentUser?.id) || [];
  const myPurchases = purchases || [];

  const handleSave = () => {
    if (updateUser) {
      updateUser({
        ...currentUser,
        username,
        email,
        avatar
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setUsername(currentUser?.username || currentUser?.name || '');
    setEmail(currentUser?.email || '');
    setAvatar(currentUser?.avatar || '');
    setIsEditing(false);
  };

  const stats = [
    {
      title: 'Listings',
      value: myProducts.length,
      color: 'bg-green-100 text-green-800',
      onClick: () => onNavigate('my-listings')
    },
    {
      title: 'Purchases',
      value: myPurchases.length,
      color: 'bg-blue-100 text-blue-800',
      onClick: () => onNavigate('previous-purchases')
    },
    {
      title: 'Items Sold',
      value: myProducts.filter(p => p.status === 'sold').length,
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header with Logo */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Logo of the application</h1>
            <p className="text-gray-600">Welcome to your personal dashboard</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Navigation Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Navigations</h2>
                <nav className="space-y-2">
                  <button
                    onClick={() => onNavigate('my-listings')}
                    className="w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-200"
                  >
                    My listings
                  </button>
                  <button
                    onClick={() => onNavigate('previous-purchases')}
                    className="w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-200"
                  >
                    My Purchases
                  </button>
                  <button
                    onClick={() => onNavigate('product-feed')}
                    className="w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-200"
                  >
                    Browse Products
                  </button>
                  <button
                    onClick={() => onNavigate('add-product')}
                    className="w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-200"
                  >
                    + Add New Listing
                  </button>
                </nav>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
                <div className="space-y-3">
                  {stats.map((stat, index) => (
                    <div 
                      key={index} 
                      className={`flex justify-between items-center p-3 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${stat.onClick ? 'hover:shadow-md' : ''}`}
                      onClick={stat.onClick}
                    >
                      <span className="text-gray-700">{stat.title}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stat.color}`}>
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                    >
                      Edit
                    </button>
                  )}
                </div>
                
                <div className="flex items-center space-x-6 mb-8">
                  <div className="relative">
                    <img
                      src={avatar || currentUser?.avatar || `https://ui-avatars.com/api/?name=${username}&background=10b981&color=fff`}
                      alt={username}
                      className="w-20 h-20 rounded-full border-2 border-green-600 object-cover"
                    />
                    {isEditing && (
                      <div className="absolute bottom-0 right-0">
                        <label htmlFor="avatar-upload" className="bg-green-600 text-white p-1 rounded-full cursor-pointer">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036极客时间H3v-3.572L16.732 3.732z" />
                          </svg>
                          <input
                            id="avatar-upload"
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              // Handle file upload logic here
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        className="text-xl font-semibold bg-transparent border-b border-gray-300 focus:outline-none focus:border-green-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    ) : (
                      <h2 className="text-xl font-semibold text-gray-900">{username}</h2>
                    )}
                    <p className="text-gray-600">{currentUser?.email}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{username}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-md">{email}</p>
                    )}
                  </div>

                  {isEditing && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Avatar URL
                      </label>
                      <input
                        type="url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Paste image URL"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Since
                    </label>
                    <p className="px-3 py-2 bg-gray-50 rounded-md">
                      {currentUser?.joinDate || 'January 2024'}
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick极客时间={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {myProducts.slice(0, 3).map(product => (
                    <div key={product.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md">
                      <img src={product.image} alt={product.title} className="w-12 h-12 rounded-md object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Listed: {product.title}</p>
                        <p className="text-xs text-gray-500">{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'Recent'}</p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        ${product.price}
                      </span>
                    </div>
                  ))}
                  {myProducts.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;