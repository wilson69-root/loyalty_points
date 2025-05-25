import React, { useState } from 'react';
import {
  Store, CreditCard, Percent, Gift, Phone, Clock, Settings as SettingsIcon, 
  Save, LogOut, Smartphone, CheckCircle, Bell, Mail, Download, AlertTriangle, Building2, DollarSign, CalendarDays, ShieldCheck,
  Star // Added Star icon here
} from 'lucide-react'; // Added more specific icons
import { toast, ToastContainer } from 'react-toastify'; // Using react-toastify for consistency
import 'react-toastify/dist/ReactToastify.css';

// Define a type for settings for better type safety
interface AppSettings {
  businessName: string;
  pointsPerDollar: number;
  expirydays: number;
  welcomeBonus: number;
  birthdayBonus: number;
  smsNotifications: boolean;
  emailNotifications: boolean;
  // Add other settings as needed
}

const Settings = () => {
  const [settings, setSettings] = useState<AppSettings>({
    businessName: 'Bella Salon & Spa',
    pointsPerDollar: 1,
    expirydays: 365,
    welcomeBonus: 50,
    birthdayBonus: 25,
    smsNotifications: true,
    emailNotifications: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let processedValue: string | number | boolean = value;
    if (type === 'number') {
      processedValue = parseFloat(value) || 0;
    }
    // For checkboxes, you'd handle 'checked' property, but we're using custom toggles
    setSettings(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleToggleChange = (name: keyof AppSettings) => {
    setSettings(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to a database or context
    console.log('Saving settings:', settings);
    toast.success('Settings saved successfully!');
  };

  const handleExportData = () => {
    toast.info('Exporting customer data... (Feature not implemented)');
  };

  const handleSignOut = () => {
    toast.warn('Signing out... (Feature not implemented)');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-slate-900 to-gray-800 min-h-screen text-white">
      <ToastContainer theme="dark" position="bottom-right" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center">
          <SettingsIcon size={30} className="mr-3 text-purple-400" /> Application Settings
        </h1>
        <p className="text-gray-400 mt-1">Manage your loyalty program configurations and account details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Business & Loyalty Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Settings Card */}
          <SettingsCard title="Business Information" icon={<Building2 className="text-purple-400" />}>
            <InputField label="Business Name" name="businessName" value={settings.businessName} onChange={handleInputChange} placeholder="Your Company LLC" />
          </SettingsCard>

          {/* Loyalty Program Settings Card */}
          <SettingsCard title="Loyalty Program Rules" icon={<Star className="text-yellow-400" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Points per Dollar Spent" name="pointsPerDollar" type="number" value={settings.pointsPerDollar} onChange={handleInputChange} icon={<DollarSign size={16} className="text-gray-400" />} min={0} step={0.1} />
              <InputField label="Points Expiry (Days)" name="expirydays" type="number" value={settings.expirydays} onChange={handleInputChange} icon={<CalendarDays size={16} className="text-gray-400" />} min={0} helperText="Set to 0 for no expiry" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <InputField label="Welcome Bonus Points" name="welcomeBonus" type="number" value={settings.welcomeBonus} onChange={handleInputChange} icon={<Gift size={16} className="text-gray-400" />} min={0} />
              <InputField label="Birthday Bonus Points" name="birthdayBonus" type="number" value={settings.birthdayBonus} onChange={handleInputChange} icon={<Gift size={16} className="text-gray-400" />} min={0} />
            </div>
          </SettingsCard>
        </div>

        {/* Column 2: Notifications & Account */}
        <div className="space-y-6">
          {/* Notification Settings Card */}
          <SettingsCard title="Notification Preferences" icon={<Bell className="text-red-400" />}>
            <ToggleField label="SMS Notifications" name="smsNotifications" enabled={settings.smsNotifications} onChange={() => handleToggleChange('smsNotifications')} description="Send texts for rewards & promotions." />
            <ToggleField label="Email Notifications" name="emailNotifications" enabled={settings.emailNotifications} onChange={() => handleToggleChange('emailNotifications')} description="Send emails for updates & rewards." />
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Preview (Example)</h4>
              <div className="p-3 bg-gray-700/50 rounded-md border border-gray-600">
                <div className="flex items-start">
                  <Mail size={18} className="text-purple-400 mr-2 mt-0.5" />
                  <div className="text-xs text-gray-400">
                    <p className="font-medium text-gray-300">Email Subject: You've got points!</p>
                    <p>Hi [Customer Name], you've earned {settings.welcomeBonus} points from your recent visit at {settings.businessName}! Your new balance is [Total Points].</p>
                  </div>
                </div>
              </div>
            </div>
          </SettingsCard>

          {/* Account Actions Card */}
          <SettingsCard title="Account Actions" icon={<ShieldCheck className="text-green-400" />}>
            <ActionButton icon={<Download size={18} />} text="Export Customer Data" onClick={handleExportData} variant="secondary" />
            <ActionButton icon={<LogOut size={18} />} text="Sign Out" onClick={handleSignOut} variant="danger" />
          </SettingsCard>
        </div>
      </div>

      {/* Floating Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-all duration-150 transform hover:scale-105"
        >
          <Save size={20} className="mr-2" />
          Save All Settings
        </button>
      </div>
    </div>
  );
};

// Helper Components (can be in the same file or imported)
interface SettingsCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}
const SettingsCard: React.FC<SettingsCardProps> = ({ title, icon, children }) => (
  <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-2xl rounded-xl border border-gray-700">
    <div className="p-5 border-b border-gray-700 flex items-center">
      <div className="mr-3 p-2 bg-gray-700 rounded-lg">{icon}</div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    <div className="p-5 space-y-4">
      {children}
    </div>
  </div>
);

interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  helperText?: string;
  min?: number;
  step?: number;
}
const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type = 'text', placeholder, icon, helperText, min, step }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <div className="relative mt-1">
      {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        step={step}
        className={`block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors duration-150`}
      />
    </div>
    {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
  </div>
);

interface ToggleFieldProps {
  label: string;
  name: keyof AppSettings; // Ensure name is a key of AppSettings
  enabled: boolean;
  onChange: () => void;
  description?: string;
}
const ToggleField: React.FC<ToggleFieldProps> = ({ label, name, enabled, onChange, description }) => (
  <div className="flex items-center justify-between py-2">
    <div>
      <label htmlFor={name} className="text-sm font-medium text-gray-200">{label}</label>
      {description && <p className="text-xs text-gray-400 max-w-xs">{description}</p>}
    </div>
    <button
      type="button"
      id={name}
      onClick={onChange}
      className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 ${enabled ? 'bg-purple-600' : 'bg-gray-600'}`}
    >
      <span aria-hidden="true" className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

interface ActionButtonProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}
const ActionButton: React.FC<ActionButtonProps> = ({ icon, text, onClick, variant = 'primary' }) => {
  const baseClasses = "w-full flex items-center justify-center px-4 py-2.5 border rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-150";
  let variantClasses = '';
  switch (variant) {
    case 'danger':
      variantClasses = 'border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20 focus:ring-red-500';
      break;
    case 'secondary':
      variantClasses = 'border-gray-600 bg-gray-700/50 text-gray-300 hover:bg-gray-700 focus:ring-purple-500';
      break;
    default: // primary
      variantClasses = 'border-transparent bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500';
      break;
  }
  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      {icon}<span className="ml-2">{text}</span>
    </button>
  );
};

export default Settings;