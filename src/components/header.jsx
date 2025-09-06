import { useAuth } from '../context/AuthContext';

const Header = ({ onNavigate }) => {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  return (
    <header className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('product-feed')}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold">EcoFinds</span>
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('product-feed')}
              className="hover:text-green-200 transition-colors"
            >
              Browse
            </button>
            <button
              onClick={() => onNavigate('my-listings')}
              className="hover:text-green-200 transition-colors"
            >
              My Listings
            </button>
            <button
              onClick={() => onNavigate('cart')}
              className="hover:text-green-200 transition-colors"
            >
              Cart
            </button>
            <button
              onClick={() => onNavigate('previous-purchases')}
              className="hover:text-green-200 transition-colors"
            >
              Purchases
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onNavigate('user-dashboard')}
              >
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.username}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              </button>
              <button
                onClick={handleLogout}
                className="bg-green-700 hover:bg-green-800 px-3 py-1 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;