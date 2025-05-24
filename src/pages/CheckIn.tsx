import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, UserPlus, Phone, Package, ArrowRight } from 'lucide-react';
import { useLoyalty } from '../context/LoyaltyContext';
import { generateId, formatPhoneNumber, addCustomer as addCustomerToSupabase } from '../utils/mockData';
import toast from 'react-hot-toast';

const CheckIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    customers, 
    findCustomerByPhone, 
    addCustomer, 
    addVisit, 
    getCustomerPoints 
  } = useLoyalty();
  
  const [phase, setPhase] = useState<'search' | 'customer' | 'service'>('search');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
  });
  
  const [service, setService] = useState({
    name: '',
    amount: '',
    notes: '',
    staffMember: '',
  });
  
  const presetServices = [
    { name: 'Haircut', defaultAmount: 35 },
    { name: 'Haircut & Style', defaultAmount: 55 },
    { name: 'Color', defaultAmount: 85 },
    { name: 'Highlights', defaultAmount: 120 },
    { name: 'Blowout', defaultAmount: 45 },
    { name: 'Treatment', defaultAmount: 65 },
  ];
  
  // If we have a customerId from the state, use it
  useEffect(() => {
    const customerId = location.state?.customerId;
    if (customerId) {
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        setSelectedCustomer(customer);
        setPhoneNumber(customer.phone);
        setPhase('service');
      }
    }
  }, [location.state, customers]);
  
  const handlePhoneSearch = () => {
    if (phoneNumber.length < 7) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    const customer = findCustomerByPhone(phoneNumber);
    if (customer) {
      setSelectedCustomer(customer);
      setPhase('service');
      toast.success(`Found ${customer.firstname} ${customer.lastname}`);
    } else {
      setNewCustomer({...newCustomer, phone: phoneNumber});
      setPhase('customer');
    }
  };
  
  const handleCreateCustomer = async () => {
    if (!newCustomer.firstname || !newCustomer.lastname) {
      toast.error('Please enter first and last name');
      return;
    }
    
    const customer = {
      id: generateId(),
      firstname: newCustomer.firstname,
      lastname: newCustomer.lastname,
      phone: newCustomer.phone,
      email: newCustomer.email,
      joindate: new Date().toISOString(),
    };
    
    try {
      // Save to Supabase
      const savedCustomer = await addCustomerToSupabase(customer);
      
      // Update local state
      addCustomer(savedCustomer);
      setSelectedCustomer(savedCustomer);
      setPhase('service');
      toast.success('New customer created!');
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error('Failed to create customer. Please try again.');
    }
  };
  
  const handleSelectService = (preset: typeof presetServices[0]) => {
    setService({
      ...service,
      name: preset.name,
      amount: preset.defaultAmount.toString(),
    });
  };
  
  const handleAddVisit = async () => {
    if (!selectedCustomer || !service.name || !service.amount) {
      toast.error('Please select a service and enter an amount');
      return;
    }
    
    const amount = parseFloat(service.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    const visit = {
      id: generateId(),
      customerId: selectedCustomer.id,
      date: new Date().toISOString(),
      service: service.name,
      amount: amount * 100, // Convert to cents for storage
      points: Math.floor(amount),
      notes: service.notes,
      staffMember: service.staffMember,
    };
    
    try {
      // Save to Supabase
      // TODO: Implement addVisitToSupabase function or import it from utils
      // await addVisitToSupabase(visit);
      
      // Update local state
      addVisit(visit);
      toast.success(`Visit recorded! +${Math.floor(amount)} points earned`);
      navigate(`/customers/${selectedCustomer.id}`);
    } catch (error) {
      console.error('Error recording visit:', error);
      toast.error('Failed to record visit. Please try again.');
    }
  };
  
  const renderSearchPhase = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Check-In</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter Customer Phone Number
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <div className="relative flex items-stretch flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d-]/g, ''))}
                placeholder="+254712345789"
                className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
              />
            </div>
            <button
              onClick={handlePhoneSearch}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Search className="h-4 w-4 mr-1" />
              Find
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-500 mb-4">Recent customers:</p>
          <div className="space-y-2">
            {customers.slice(0, 3).map((customer) => (
              <button
                key={customer.id}
                onClick={() => {
                  setSelectedCustomer(customer);
                  setPhoneNumber(customer.phone);
                  setPhase('service');
                }}
                className="w-full flex items-center p-3 border border-gray-200 rounded-md hover:bg-purple-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium text-sm">
                  {customer.firstname.charAt(0)}{customer.lastname.charAt(0)}
                </div>
                <div className="ml-3 text-left">
                  <p className="text-sm font-medium text-gray-900">{customer.firstname} {customer.lastname}</p>
                  <p className="text-xs text-gray-500">{formatPhoneNumber(customer.phone)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderNewCustomerPhase = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">New Customer</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              value={newCustomer.firstname}
              onChange={(e) => setNewCustomer({...newCustomer, firstname: e.target.value})}
              className="focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              value={newCustomer.lastname}
              onChange={(e) => setNewCustomer({...newCustomer, lastname: e.target.value})}
              className="focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
              className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              disabled
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
            className="focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        
        <div className="pt-4 flex justify-between">
          <button
            onClick={() => setPhase('search')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={handleCreateCustomer}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-700 hover:bg-purple-800"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Create Customer
          </button>
        </div>
      </div>
    </div>
  );
  
  const renderServicePhase = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Record Visit</h2>
      
      {selectedCustomer && (
        <div className="flex items-center mb-6 bg-purple-50 p-3 rounded-md">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">
            {selectedCustomer.firstname.charAt(0)}{selectedCustomer.lastname.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {selectedCustomer.firstname} {selectedCustomer.lastname}
            </p>
            <div className="flex items-center text-xs text-gray-500">
              <Package className="h-3 w-3 text-purple-500 mr-1" />
              <span>{getCustomerPoints(selectedCustomer.id)} points</span>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedCustomer(null);
              setPhoneNumber('');
              setPhase('search');
            }}
            className="ml-auto text-sm text-purple-700 hover:text-purple-800"
          >
            Change
          </button>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
            {presetServices.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleSelectService(preset)}
                className={`px-3 py-2 text-xs font-medium rounded-md border ${
                  service.name === preset.name
                    ? 'bg-purple-100 border-purple-300 text-purple-800'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={service.name}
            onChange={(e) => setService({...service, name: e.target.value})}
            placeholder="Custom service"
            className="focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount ($) *
          </label>
          <input
            type="number"
            value={service.amount}
            onChange={(e) => setService({...service, amount: e.target.value})}
            className="focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
            min="0"
            step="0.01"
          />
          <p className="mt-1 text-xs text-gray-500">
            Customer will earn {service.amount ? Math.floor(parseFloat(service.amount)) : 0} points
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Staff Member
          </label>
          <select
            value={service.staffMember}
            onChange={(e) => setService({...service, staffMember: e.target.value})}
            className="focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
          >
            <option value="">Select staff member</option>
            <option value="Jessica">Jessica</option>
            <option value="Carlos">Carlos</option>
            <option value="Maria">Maria</option>
            <option value="David">David</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={service.notes}
            onChange={(e) => setService({...service, notes: e.target.value})}
            rows={2}
            className="focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Optional service notes"
          ></textarea>
        </div>
        
        <div className="pt-4 flex justify-between">
          <button
            onClick={() => {
              setPhase('search');
              setSelectedCustomer(null);
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={handleAddVisit}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-700 hover:bg-purple-800"
          >
            <ArrowRight className="h-4 w-4 mr-1" />
            Complete Check-In
          </button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="py-4">
      {phase === 'search' && renderSearchPhase()}
      {phase === 'customer' && renderNewCustomerPhase()}
      {phase === 'service' && renderServicePhase()}
    </div>
  );
};

export default CheckIn;