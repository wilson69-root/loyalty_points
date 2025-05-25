import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, UserPlus, Phone, Package, ArrowRight, Briefcase, Users, CalendarDays, Building } from 'lucide-react'; // Added more icons for variety if needed
import { useLoyalty } from '../context/LoyaltyContext';
import { generateId, addCustomer as addCustomerToSupabase, addVisitToSupabase } from '../utils/mockData'; // Removed formatPhoneNumber as it's not used here
import toast from 'react-hot-toast';

const CheckIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    customers, 
    findCustomerByPhone, 
    addCustomer, 
    addVisit, 
    // getCustomerPoints // Not directly used in this component's logic flow, consider removing if not needed for future enhancements
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
    staffmember: '',
  });
  
  const presetServices = [
    { name: 'Haircut', defaultAmount: 35, icon: <Briefcase size={20} className="mr-2 text-purple-400" /> },
    { name: 'Haircut & Style', defaultAmount: 55, icon: <Users size={20} className="mr-2 text-purple-400" /> },
    { name: 'Color', defaultAmount: 85, icon: <Package size={20} className="mr-2 text-purple-400" /> }, // Re-using Package icon
    { name: 'Highlights', defaultAmount: 120, icon: <CalendarDays size={20} className="mr-2 text-purple-400" /> }, // Example, choose appropriate
    { name: 'Blowout', defaultAmount: 45, icon: <Building size={20} className="mr-2 text-purple-400" /> }, // Example, choose appropriate
    { name: 'Treatment', defaultAmount: 65, icon: <UserPlus size={20} className="mr-2 text-purple-400" /> }, // Example, choose appropriate
  ];
  
  useEffect(() => {
    const customerid = location.state?.customerid;
    if (customerid) {
      const customer = customers.find(c => c.id === customerid);
      if (customer) {
        setSelectedCustomer(customer);
        setPhoneNumber(customer.phone);
        setPhase('service');
      }
    }
  }, [location.state, customers]);
  
  const handlePhoneSearch = () => {
    if (phoneNumber.length < 7) { // Basic validation, consider more robust validation
      toast.error('Please enter a valid phone number');
      return;
    }
    
    const customer = findCustomerByPhone(phoneNumber);
    if (customer) {
      setSelectedCustomer(customer);
      setPhase('service');
      toast.success(`Welcome back, ${customer.firstname}!`);
    } else {
      setNewCustomer({...newCustomer, phone: phoneNumber});
      setPhase('customer');
      toast('New customer? Please fill in details.');
    }
  };
  
  const handleCreateCustomer = async () => {
    if (!newCustomer.firstname || !newCustomer.lastname) {
      toast.error('Please enter first and last name');
      return;
    }
    // Basic email validation (optional, enhance as needed)
    if (newCustomer.email && !/\S+@\S+\.\S+/.test(newCustomer.email)) {
        toast.error('Please enter a valid email address');
        return;
    }
    
    const customerData = {
      id: generateId(),
      ...newCustomer,
      joindate: new Date().toISOString(),
    };
    
    try {
      const savedCustomer = await addCustomerToSupabase(customerData);
      addCustomer(savedCustomer);
      setSelectedCustomer(savedCustomer);
      setPhase('service');
      toast.success('New customer created successfully!');
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
    
    const visitData = {
      id: generateId(),
      customerid: selectedCustomer.id,
      date: new Date().toISOString(),
      service: service.name,
      amount: amount * 100, // Store in cents
      points: Math.floor(amount), // Example: 1 point per dollar
      notes: service.notes,
      staffmember: service.staffmember,
    };
    
    try {
      await addVisitToSupabase(visitData);
      addVisit(visitData);
      toast.success(`Visit recorded! +${Math.floor(amount)} points earned by ${selectedCustomer.firstname}.`);
      navigate(`/customers/${selectedCustomer.id}`);
    } catch (error) {
      console.error('Error recording visit:', error);
      toast.error('Failed to record visit. Please try again.');
    }
  };

  const inputStyle = "w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 focus:outline-none";
  const buttonStyle = "px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-150 ease-in-out flex items-center justify-center";
  const cardStyle = "bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-700";

  const renderSearchPhase = () => (
    <div className={`${cardStyle} max-w-lg mx-auto`}>
      <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">Customer Check-In</h2>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="phoneSearch" className="block text-sm font-medium text-gray-300 mb-1">
            Enter Customer Phone Number
          </label>
          <div className="mt-1 flex rounded-lg shadow-sm">
            <div className="relative flex items-stretch flex-grow focus-within:z-10">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phoneSearch"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d+\-().\s]/g, ''))} // Allow more characters for phone
                placeholder="+1 (555) 123-4567"
                className={`${inputStyle} pl-10 rounded-r-none`}
              />
            </div>
            <button
              onClick={handlePhoneSearch}
              className={`${buttonStyle} ml-0 rounded-l-none`}
            >
              <Search className="h-5 w-5 mr-2" />
              Find
            </button>
          </div>
        </div>
        
        {customers.length > 0 && (
          <div className="border-t border-gray-700 pt-6 mt-6">
            <p className="text-sm text-gray-400 mb-4">Or select a recent customer:</p>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {customers.slice(0, 5).map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setPhoneNumber(customer.phone);
                    setPhase('service');
                    toast.success(`Selected ${customer.firstname} ${customer.lastname}`);
                  }}
                  className="w-full flex items-center p-4 border border-gray-700 bg-gray-750 hover:bg-gray-700 rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium text-lg">
                    {customer.firstname.charAt(0)}{customer.lastname.charAt(0)}
                  </div>
                  <div className="ml-4 text-left">
                    <p className="text-md font-medium text-gray-100">{customer.firstname} {customer.lastname}</p>
                    <p className="text-xs text-gray-400">{customer.phone}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderCustomerPhase = () => (
    <div className={`${cardStyle} max-w-lg mx-auto`}>
      <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">New Customer Details</h2>
      <p className="text-center text-gray-400 mb-6">Phone: {newCustomer.phone || 'Not specified'}</p>
      <div className="space-y-4">
        <div>
          <label htmlFor="firstname" className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
          <input id="firstname" type="text" value={newCustomer.firstname} onChange={(e) => setNewCustomer({...newCustomer, firstname: e.target.value})} placeholder="Enter first name" className={inputStyle} />
        </div>
        <div>
          <label htmlFor="lastname" className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
          <input id="lastname" type="text" value={newCustomer.lastname} onChange={(e) => setNewCustomer({...newCustomer, lastname: e.target.value})} placeholder="Enter last name" className={inputStyle} />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email (Optional)</label>
          <input id="email" type="email" value={newCustomer.email} onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})} placeholder="Enter email address" className={inputStyle} />
        </div>
        <div className="flex justify-between items-center pt-4">
          <button onClick={() => setPhase('search')} className={`${buttonStyle} bg-gray-600 hover:bg-gray-500`}>
            Back to Search
          </button>
          <button onClick={handleCreateCustomer} className={`${buttonStyle} flex items-center`}>
            <UserPlus className="h-5 w-5 mr-2" /> Create & Proceed
          </button>
        </div>
      </div>
    </div>
  );
  
  const renderServicePhase = () => (
    <div className={`${cardStyle} max-w-2xl mx-auto`}>
      {selectedCustomer && (
        <div className="mb-8 p-4 bg-gray-750 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-purple-400">Checking in: {selectedCustomer.firstname} {selectedCustomer.lastname}</h3>
          <p className="text-sm text-gray-400">Phone: {selectedCustomer.phone}</p>
          {/* <p className="text-sm text-gray-400">Points: {getCustomerPoints(selectedCustomer.id)}</p> */}
        </div>
      )}
      <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">Record Visit / Service</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-300 mb-3">Quick Add Services:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {presetServices.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleSelectService(preset)}
              className="flex flex-col items-center justify-center p-3 border border-gray-700 bg-gray-750 hover:bg-gray-700 rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 text-center"
            >
              {preset.icon}
              <span className="text-sm font-medium text-gray-200 mt-1">{preset.name}</span>
              <span className="text-xs text-purple-400">(${preset.defaultAmount})</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4 border-t border-gray-700 pt-6">
        <div>
          <label htmlFor="serviceName" className="block text-sm font-medium text-gray-300 mb-1">Service Name</label>
          <input id="serviceName" type="text" value={service.name} onChange={(e) => setService({...service, name: e.target.value})} placeholder="e.g., Haircut, Consultation" className={inputStyle} />
        </div>
        <div>
          <label htmlFor="serviceAmount" className="block text-sm font-medium text-gray-300 mb-1">Amount ($)</label>
          <input id="serviceAmount" type="number" value={service.amount} onChange={(e) => setService({...service, amount: e.target.value})} placeholder="e.g., 50.00" className={inputStyle} />
        </div>
        <div>
          <label htmlFor="staffMember" className="block text-sm font-medium text-gray-300 mb-1">Staff Member (Optional)</label>
          <input id="staffMember" type="text" value={service.staffmember} onChange={(e) => setService({...service, staffmember: e.target.value})} placeholder="e.g., Jane Doe" className={inputStyle} />
        </div>
        <div>
          <label htmlFor="serviceNotes" className="block text-sm font-medium text-gray-300 mb-1">Notes (Optional)</label>
          <textarea id="serviceNotes" value={service.notes} onChange={(e) => setService({...service, notes: e.target.value})} placeholder="Any specific details..." rows={3} className={inputStyle}></textarea>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 space-y-3 sm:space-y-0 sm:space-x-3">
          <button onClick={() => { setPhase('search'); setSelectedCustomer(null); setPhoneNumber(''); }} className={`${buttonStyle} bg-gray-600 hover:bg-gray-500 w-full sm:w-auto`}>
            Cancel / New Search
          </button>
          <button onClick={handleAddVisit} className={`${buttonStyle} w-full sm:w-auto flex items-center`}>
            <Package className="h-5 w-5 mr-2" /> Add Visit & Earn Points
          </button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8 text-gray-100">
      <div className="max-w-4xl mx-auto">
        {phase === 'search' && renderSearchPhase()}
        {phase === 'customer' && renderCustomerPhase()}
        {phase === 'service' && renderServicePhase()}
      </div>
    </div>
  );
};

export default CheckIn;