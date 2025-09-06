import React, { useState, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { categories } from '../data/mockData';

const ProductFeed = ({ onNavigate }) => {
  const { allProducts, cartItems } = useProducts();
  const { currentUser } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [groupBy, setGroupBy] = useState('none');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'price':
          aValue = parseFloat(a.price);
          bValue = parseFloat(b.price);
          break;
        case 'date':
        default:
          aValue = a.createdAt || 0;
          bValue = b.createdAt || 0;
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [allProducts, searchTerm, sortBy, sortOrder, categoryFilter]);

  const groupedProducts = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Products': filteredAndSortedProducts };
    }
    
    const groups = {};
    filteredAndSortedProducts.forEach(product => {
      const key = product[groupBy] || 'Unknown';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(product);
    });
    
    return groups;
  }, [filteredAndSortedProducts, groupBy]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* Header with Logo and Navigation */}
      <Header cartItemsCount={cartItems.length} onNavigate={onNavigate} />
      
      <div className="container mx-auto px-4 py-6">
        {/* Search and Filter Section */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ....."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-green-500 focus:outline-none"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          {/* ... rest of your ProductFeed component remains the same ... */}
        </div>

        {/* Product Cards Section */}
        {allProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedProducts.map(product => (
              <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        )}

        {filteredAndSortedProducts.length === 0 && searchTerm && (
          <div className="text-center py-12 bg-white rounded-lg shadow mt-6">
            <p className="text-gray-500">No products found for "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFeed;