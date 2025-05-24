import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Store, Search, Bell, User } from 'lucide-react';
import { useLoyalty } from '../context/LoyaltyContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { businessName } = useLoyalty();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/customers':
        return 'Customers';
      case '/rewards':
        return 'Rewards';
      case '/settings':
        return 'Settings';
      case '/check-in':
        return 'Customer Check-In';
      default:
        if (location.pathname.startsWith('/customers/')) {
          return 'Customer Details';
        }
        return 'Dashboard';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Store className="h-8 w-8 text-purple-700 mr-3" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{businessName}</h1>
            <p className="text-sm text-gray-500">{getPageTitle()}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/check-in')}
            className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Check-In Customer
          </button>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <Search className="h-5 w-5 text-gray-500" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-orange-500 rounded-full"></span>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <User className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;