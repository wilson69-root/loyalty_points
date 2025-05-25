import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Store, Search, Bell, User, X, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useLoyalty } from '../context/LoyaltyContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { businessName } = useLoyalty();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Refs for closing dropdowns when clicking outside
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

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

  // Effect to handle clicks outside of dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node) && isSearchOpen) {
        // Only close search if it's open and click is outside input area
        if (!(event.target instanceof HTMLInputElement && event.target.type === 'text')) {
            setIsSearchOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to a search results page or handle search inline
      console.log('Searching for:', searchTerm);
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`); // Example navigation
      setIsSearchOpen(false);
      setSearchTerm('');
    }
  };
  
  // Dummy notifications
  const notifications = [
    { id: 1, message: 'New customer John Doe signed up.', time: '2m ago' },
    { id: 2, message: 'Reward "Free Coffee" is running low.', time: '1h ago' },
    { id: 3, message: 'Settings updated successfully.', time: '3h ago' },
  ];

  return (
    <header className="bg-gradient-to-br from-gray-900 to-gray-800 border-b border-gray-700 shadow-md z-20 sticky top-0 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-4 md:px-6 py-2 sm:py-3 gap-2 sm:gap-0">
        <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start">
          <Store className="h-8 w-8 text-purple-400 mr-3" />
          <div>
            <h1 className="text-lg font-semibold text-white tracking-wide">{businessName}</h1>
            <p className="text-sm text-gray-400">{getPageTitle()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 xs:space-x-2 md:space-x-4 w-full sm:w-auto justify-end">
          {/* Search Input - Toggles */}
          <div ref={searchRef} className="relative flex items-center">
            {!isSearchOpen && (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
                aria-label="Open search"
              >
                <Search className="h-5 w-5 text-gray-400" />
              </button>
            )}
            {isSearchOpen && (
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-700 rounded-full pr-2">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search customers, rewards..."
                  className="py-2 px-3 xs:px-4 w-28 xs:w-40 md:w-64 bg-transparent text-white placeholder-gray-500 focus:outline-none rounded-full text-sm"
                  autoFocus
                />
                <button type="submit" className="p-1.5 rounded-full hover:bg-gray-600" aria-label="Submit search">
                    <Search className="h-4 w-4 text-gray-300" />
                </button>
                <button 
                    type="button"
                    onClick={() => { setIsSearchOpen(false); setSearchTerm(''); }}
                    className="p-1.5 ml-1 rounded-full hover:bg-gray-600"
                    aria-label="Close search"
                >
                    <X className="h-4 w-4 text-gray-300" />
                </button>
              </form>
            )}
          </div>

          <button 
            onClick={() => navigate('/check-in')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-2 xs:px-3 md:px-4 rounded-md text-xs xs:text-sm font-medium transition-colors duration-200 whitespace-nowrap shadow-md"
          >
            Check-In
          </button>
          {/* Notifications Dropdown */}
          <div ref={notificationsRef} className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200 relative"
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5 text-gray-400" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-orange-500 rounded-full border-2 border-gray-900"></span>
              )}
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 xs:w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-30">
                <div className="px-4 py-2 border-b border-gray-700">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                </div>
                <ul className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? notifications.map(notif => (
                    <li key={notif.id} className="px-4 py-3 hover:bg-gray-700/50 cursor-pointer">
                      <p className="text-sm text-gray-200">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{notif.time}</p>
                    </li>
                  )) : (
                    <li className="px-4 py-3 text-sm text-gray-400 text-center">No new notifications</li>
                  )}
                </ul>
                <div className="px-4 py-2 border-t border-gray-700 text-center">
                    <button className="text-xs text-purple-400 hover:text-purple-300 font-medium">View All</button>
                </div>
              </div>
            )}
          </div>
          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center p-1.5 rounded-full hover:bg-gray-700 transition-colors duration-200"
              aria-label="Open user menu"
            >
              <User className="h-5 w-5 text-gray-400" />
              <ChevronDown className={`h-4 w-4 text-gray-400 ml-1 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-40 xs:w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-1 z-30">
                <button 
                  onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700/50 flex items-center"
                >
                  <Settings size={16} className="mr-2.5 text-gray-400" /> Settings
                </button>
                <button 
                  onClick={() => { console.log('Sign Out Clicked'); setIsProfileOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700/50 flex items-center"
                >
                  <LogOut size={16} className="mr-2.5" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;