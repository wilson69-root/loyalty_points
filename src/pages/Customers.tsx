import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Phone, Mail, Calendar, Package } from 'lucide-react';
import { useLoyalty } from '../context/LoyaltyContext';
import { formatDate } from '../utils/mockData';

const Customers = () => {
  const navigate = useNavigate();
  const { customers, getCustomerPoints } = useLoyalty();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCustomers = customers.filter(customer => 
    customer.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
        
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
          
          <button 
            onClick={() => navigate('/check-in')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loyalty Points
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => {
                const points = getCustomerPoints(customer.id);
                return (
                  <tr 
                    key={customer.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/customers/${customer.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">
                          {customer.firstname.charAt(0)}{customer.lastname.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.firstname} {customer.lastname}
                          </div>
                          {customer.notes && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {customer.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-1" />
                          {customer.phone}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-1" />
                          {customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {formatDate(customer.joindate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Package className="h-4 w-4 text-purple-500 mr-1" />
                        <span className="font-medium">{points}</span>
                        <span className="text-gray-500 ml-1">points</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/customers/${customer.id}`);
                        }}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredCustomers.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">No customers found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;