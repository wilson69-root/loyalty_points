import React, { useState } from 'react';
import { 
  Store, CreditCard, Percent, Gift, Phone, Clock, 
  Save, LogOut, Smartphone, CheckCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    businessName: 'Bella Salon & Spa',
    pointsPerDollar: 1,
    expirydays: 365,
    welcomeBonus: 50,
    birthdayBonus: 25,
    smsNotifications: true,
    emailNotifications: true,
  });
  
  const handleSaveSettings = () => {
    // In a real app, this would save to a database
    toast.success('Settings saved successfully!');
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Store className="h-5 w-5 text-purple-700 mr-2" />
            Business Settings
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => setSettings({...settings, businessName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points per Dollar Spent
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Percent className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={settings.pointsPerDollar}
                    onChange={(e) => setSettings({...settings, pointsPerDollar: parseFloat(e.target.value)})}
                    className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    min="0.1"
                    step="0.1"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points Expiry (Days)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={settings.expirydays}
                    onChange={(e) => setSettings({...settings, expirydays: parseInt(e.target.value)})}
                    className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    min="0"
                    step="1"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Set to 0 for no expiry
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Welcome Bonus Points
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CheckCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={settings.welcomeBonus}
                    onChange={(e) => setSettings({...settings, welcomeBonus: parseInt(e.target.value)})}
                    className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birthday Bonus Points
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Gift className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={settings.birthdayBonus}
                    onChange={(e) => setSettings({...settings, birthdayBonus: parseInt(e.target.value)})}
                    className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Notification Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Smartphone className="h-5 w-5 text-purple-700 mr-2" />
            Notifications
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                <p className="text-xs text-gray-500">
                  Send text messages for rewards and promotions
                </p>
              </div>
              <button
                onClick={() => setSettings({...settings, smsNotifications: !settings.smsNotifications})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  settings.smsNotifications ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                <p className="text-xs text-gray-500">
                  Send emails for points updates and available rewards
                </p>
              </div>
              <button
                onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  settings.emailNotifications ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="pt-4 border-t border-gray-200 mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Notifications Preview</h4>
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-purple-600 mr-2" />
                  <div className="text-xs text-gray-600">
                    <p className="font-medium">SMS Example:</p>
                    <p>"Bella Salon & Spa: You've earned 50 points from your recent visit! You now have 250 points total. Redeem for rewards in-store."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <CreditCard className="h-5 w-5 text-purple-700 mr-2" />
            Payment Settings
          </h3>
          
          <div className="p-4 bg-purple-50 border border-purple-100 rounded-md mb-6">
            <p className="text-sm text-purple-800">
              Connect your payment system to automatically track purchases and award points.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
              <div className="flex items-center">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-100 rounded-md text-blue-700 mr-3">
                  <span className="font-bold">S</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Square</h4>
                  <p className="text-xs text-gray-500">Connect your Square account</p>
                </div>
              </div>
              <button className="px-3 py-1 text-xs font-medium text-purple-700 border border-purple-300 rounded-md hover:bg-purple-50">
                Connect
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
              <div className="flex items-center">
                <div className="h-10 w-10 flex items-center justify-center bg-green-100 rounded-md text-green-700 mr-3">
                  <span className="font-bold">C</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Clover</h4>
                  <p className="text-xs text-gray-500">Connect your Clover account</p>
                </div>
              </div>
              <button className="px-3 py-1 text-xs font-medium text-purple-700 border border-purple-300 rounded-md hover:bg-purple-50">
                Connect
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
              <div className="flex items-center">
                <div className="h-10 w-10 flex items-center justify-center bg-purple-100 rounded-md text-purple-700 mr-3">
                  <span className="font-bold">M</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Manual Entry</h4>
                  <p className="text-xs text-gray-500">Track visits and points manually</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md">
                Active
              </span>
            </div>
          </div>
        </div>
        
        {/* Account Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Store className="h-5 w-5 text-purple-700 mr-2" />
            Account
          </h3>
          
          <div className="space-y-4">
            <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-purple-800">
              <Save className="h-4 w-4 mr-2" />
              Save All Changes
            </button>
            
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Export Customer Data
            </button>
            
            <div className="pt-4 border-t border-gray-200 mt-4">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-700 hover:bg-purple-800"
        >
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;