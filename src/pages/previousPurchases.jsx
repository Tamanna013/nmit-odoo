import React, { useState, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

const PreviousPurchases = ({ onNavigate }) => {
  const { purchases } = useProducts();
  const { currentUser } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [groupBy, setGroupBy] = useState('none');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedPurchases = useMemo(() => {
    // Add safety check for purchases
    if (!purchases || purchases.length === 0) return [];
    
    let filtered = purchases.filter(item => {
      const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });

    // Sort purchases
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
          break;
        case 'price':
          aValue = parseFloat(a.price) || 0;
          bValue = parseFloat(b.price) || 0;
          break;
        case 'date':
        default:
          aValue = new Date(a.purchaseDate || a.date || 0).getTime();
          bValue = new Date(b.purchaseDate || b.date || 0).getTime();
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [purchases, searchTerm, sortBy, sortOrder, categoryFilter]);

  const groupedPurchases = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Purchases': filteredAndSortedPurchases };
    }
    
    const groups = {};
    filteredAndSortedPurchases.forEach(item => {
      const key = item[groupBy] || 'Unknown';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });
    
    return groups;
  }, [filteredAndSortedPurchases, groupBy]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Safe check for purchases
  const hasPurchases = purchases && purchases.length > 0;
  const hasFilteredPurchases = filteredAndSortedPurchases.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">Unique Bison</h1>
          <p className="text-gray-600 text-center mt-2">Previous Purchases</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89极客时间 3.476l4.817 4.817a1 1 0 01-1.414 1.414极客时间l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr极客时间-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
                placeholder="Search ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <button
                  onClick={toggleSortOrder}
                  className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Sort {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
                <select
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                </select>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Filter
              </button>
              
              <div className="relative">
                <select
                  className="block w-full px-4 py-2 text-sm font-medium text极客时间-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                >
                  <option value="none">Group by</option>
                  <option value="category">Category</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {!hasPurchases ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No purchase history</h3>
            <p className="mt-1 text-sm text-gray-500">Your purchase history will appear here after you make your first purchase.</p>
            <div className="mt-6">
              <button
                onClick={() => onNavigate('product-feed')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : !hasFilteredPurchases ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-900">No purchases match your search criteria</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* Grouped Purchases */}
            {Object.entries(groupedPurchases).map(([groupName, groupItems]) => (
              <div key={groupName} className="mb-8">
                {groupBy !== 'none' && (
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">{groupName}</h2>
                )}
                
                {/* Table View for Larger Screens */}
                <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden mb-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Purchase Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {groupItems.map((item, index) => (
                        <tr key={item.id || index}>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-md object-cover" src={item.image} alt={item.title} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                <div className="text-sm text-gray-500">{item.description?.substring(0, 50)}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">${item.price}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'Unknown date'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Card View for Mobile */}
                <div className="md:hidden grid grid-cols-1 gap-4">
                  {groupItems.map((item, index) => (
                    <div key={item.id || index} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16">
                            <img className="h-16 w-16 rounded-md object-cover" src={item.image} alt={item.title} />
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="text-sm font-medium text-gray-900">{item.title}</div>
                            <div className="text-sm text-gray-500 mt-1">${item.price}</div>
                            <div className="mt-1">
                              <span className="px-2 inline-flex text-xs leading-5 font-semib极客时间old rounded-full bg-green-100 text-green-800">
                                {item.category}
                              </span>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              Purchased: {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'Unknown date'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Summary Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total Items: {purchases.length}
                </span>
                <button
                  onClick={() => onNavigate('product-feed')}
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PreviousPurchases;