import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Phone, Mail, Calendar, Package, Users, TrendingUp, Star, Crown, Filter, UserPlus, BarChart2, Award } from 'lucide-react'; // Added UserPlus, BarChart2, Award
import { useLoyalty } from '../context/LoyaltyContext';
import { formatDate } from '../utils/mockData'; // Assuming formatDate is available

const Customers = () => {
  const navigate = useNavigate();
  const { customers, getCustomerPoints, visits } = useLoyalty();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('joindate'); // Default sort by join date
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // Default descending

  const customerActivity = useMemo(() => {
    return customers.map(customer => {
      const customerVisits = visits.filter(v => v.customerid === customer.id);
      const points = getCustomerPoints(customer.id);
      const lastVisit = customerVisits.length > 0 ? 
        new Date(Math.max(...customerVisits.map(v => new Date(v.date).getTime()))) : null;
      
      return {
        ...customer,
        points,
        visitCount: customerVisits.length,
        lastVisit,
        totalSpent: customerVisits.reduce((sum, v) => sum + v.amount, 0)
      };
    });
  }, [customers, visits, getCustomerPoints]);

  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customerActivity.filter(customer => 
      customer.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm)) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = (a.firstname + ' ' + a.lastname).localeCompare(b.firstname + ' ' + b.lastname);
      } else if (sortBy === 'points') {
        comparison = a.points - b.points;
      } else if (sortBy === 'joindate') {
        comparison = new Date(a.joindate).getTime() - new Date(b.joindate).getTime();
      } else if (sortBy === 'lastVisit') {
        const dateA = a.lastVisit ? a.lastVisit.getTime() : 0;
        const dateB = b.lastVisit ? b.lastVisit.getTime() : 0;
        comparison = dateA - dateB;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [customerActivity, searchTerm, sortBy, sortOrder]);

  // Statistics
  const totalCustomers = customers.length;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentSignups = customers.filter(c => new Date(c.joindate) >= thirtyDaysAgo).length;
  const totalPointsAwarded = customerActivity.reduce((sum, c) => sum + c.points, 0);
  const avgPointsPerCustomer = totalCustomers > 0 ? Math.round(totalPointsAwarded / totalCustomers) : 0;

  const getCustomerTier = (points: number) => {
    if (points >= 500) return { name: 'VIP Gold', color: 'text-yellow-500', icon: <Crown size={16} className="mr-1" /> };
    if (points >= 250) return { name: 'Silver', color: 'text-gray-400', icon: <Star size={16} className="mr-1" /> };
    if (points >= 100) return { name: 'Bronze', color: 'text-orange-400', icon: <Award size={16} className="mr-1" /> };
    return { name: 'New', color: 'text-green-500', icon: <UserPlus size={16} className="mr-1" /> };
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const renderSortIcon = (column: string) => {
    if (sortBy !== column) return <Filter size={14} className="ml-1 text-gray-400" />;
    return sortOrder === 'asc' ? '▲' : '▼';
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-slate-900 to-gray-800 min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Customer Management</h1>
            <p className="text-gray-400 mt-1">Oversee your loyalty program members and their engagement.</p>
          </div>
          <button 
            onClick={() => navigate('/check-in')} // Assuming '/check-in' is the route for adding customers
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-colors duration-150"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Customer
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Users size={24} className="text-purple-400" />} title="Total Customers" value={totalCustomers.toString()} />
          <StatCard icon={<UserPlus size={24} className="text-green-400" />} title="Recent Signups (30d)" value={recentSignups.toString()} />
          <StatCard icon={<Package size={24} className="text-sky-400" />} title="Avg. Points" value={avgPointsPerCustomer.toString()} />
          <StatCard icon={<BarChart2 size={24} className="text-red-400" />} title="Total Points Awarded" value={totalPointsAwarded.toString()} />
        </div>
      </div>

      {/* Customer Table Area */}
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-2xl rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-semibold text-white">All Customers</h2>
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-600 rounded-lg leading-5 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors duration-150"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700 bg-opacity-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 transition-colors duration-150" onClick={() => handleSort('name')}>
                  Customer {renderSortIcon('name')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Contact Info
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 transition-colors duration-150" onClick={() => handleSort('joindate')}>
                  Join Date {renderSortIcon('joindate')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 transition-colors duration-150" onClick={() => handleSort('points')}>
                  Loyalty Points {renderSortIcon('points')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Tier
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600 transition-colors duration-150" onClick={() => handleSort('lastVisit')}>
                  Last Visit {renderSortIcon('lastVisit')}
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 bg-opacity-30 divide-y divide-gray-700">
              {filteredAndSortedCustomers.map((customer) => {
                const tier = getCustomerTier(customer.points);
                return (
                  <tr 
                    key={customer.id} 
                    className="hover:bg-gray-700/50 transition-colors duration-150 cursor-pointer group"
                    onClick={() => navigate(`/customers/${customer.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500 bg-opacity-30 flex items-center justify-center text-purple-300 font-semibold border border-purple-500">
                          {customer.firstname.charAt(0)}{customer.lastname.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-100 group-hover:text-purple-300 transition-colors duration-150">
                            {customer.firstname} {customer.lastname}
                          </div>
                          {customer.notes && (
                            <div className="text-xs text-gray-400 truncate max-w-xs">
                              {customer.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {customer.phone && <div className="text-sm text-gray-300 flex items-center">
                          <Phone size={14} className="text-gray-400 mr-1.5" />
                          {customer.phone}
                        </div>}
                        <div className="text-sm text-gray-400 flex items-center">
                          <Mail size={14} className="text-gray-400 mr-1.5" />
                          {customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-300">
                        <Calendar size={14} className="text-gray-400 mr-1.5" />
                        {formatDate(customer.joindate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-sky-300">
                        <Package size={14} className="text-sky-400 mr-1.5" />
                        <span className="font-semibold">{customer.points}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-opacity-20 ${tier.color.replace('text-', 'bg-').replace('-500', '-500/30')} ${tier.color}`}>
                        {tier.icon} {tier.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {customer.lastVisit ? formatDate(customer.lastVisit.toISOString()) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click when clicking button
                          navigate(`/customers/${customer.id}`);
                        }}
                        className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-150"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredAndSortedCustomers.length === 0 && (
          <div className="py-12 text-center">
            <Search size={48} className="mx-auto text-gray-500 mb-4" />
            <p className="text-xl font-semibold text-gray-300 mb-2">No Customers Found</p>
            <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// StatCard Component (can be in the same file or imported)
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description?: string;
}
const StatCard: React.FC<StatCardProps> = ({ icon, title, value, description }) => (
  <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-5 rounded-xl shadow-lg border border-gray-700 hover:border-purple-500/70 transition-all duration-300 transform hover:scale-105">
    <div className="flex items-center justify-between mb-3">
      <div className="p-2 bg-gray-700 rounded-lg">
        {icon}
      </div>
    </div>
    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</h3>
    <p className="text-2xl font-bold text-white mt-1">{value}</p>
    {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
  </div>
);

export default Customers;