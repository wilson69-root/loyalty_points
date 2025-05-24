import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Award, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/customers', name: 'Customers', icon: <Users className="h-5 w-5" /> },
    { path: '/rewards', name: 'Rewards', icon: <Award className="h-5 w-5" /> },
    { path: '/settings', name: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <aside 
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <h2 className="text-xl font-bold text-purple-700">LoyaltyPro</h2>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>
      
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path} className="px-2">
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center space-x-3 px-3 py-2 rounded-md transition-colors duration-200 ${
                    isActive 
                      ? 'bg-purple-50 text-purple-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {item.icon}
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200 flex items-center justify-center">
        <div className={`${collapsed ? 'hidden' : 'block'} text-xs text-gray-500`}>
          &copy; 2025 LoyaltyPro
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;