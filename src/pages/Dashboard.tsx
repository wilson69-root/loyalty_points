import React from 'react';
import { BarChart3, Users, CalendarClock, Award } from 'lucide-react';
import { useLoyalty } from '../context/LoyaltyContext';
import { formatCurrency, formatDate } from '../utils/mockData';

const Dashboard = () => {
  const { customers, visits } = useLoyalty();

  // Calculate summary stats
  const totalCustomers = customers.length;
  const totalVisits = visits.length;
  const recentVisits = visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  const totalRevenue = visits.reduce((sum, visit) => sum + visit.amount, 0);
  const avgTicketValue = totalRevenue / totalVisits || 0;

  // Find most recent customers
  const recentCustomers = [...customers]
    .sort((a, b) => new Date(b.joindate).getTime() - new Date(a.joindate).getTime())
    .slice(0, 5);

  // Calculate visits by day of week for chart
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const visitsByDay = daysOfWeek.map(day => {
    return {
      day: day.substring(0, 3),
      count: visits.filter(v => new Date(v.date).toLocaleDateString('en-US', { weekday: 'long' }) === day).length
    };
  });

  // Find the max visits for scaling the chart
  const maxVisits = Math.max(...visitsByDay.map(d => d.count));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Summary Cards */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-50 text-purple-700 mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalCustomers}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-50 text-orange-500 mr-4">
              <CalendarClock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Visits</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalVisits}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-50 text-green-600 mr-4">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Ticket</p>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(avgTicketValue)}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visits by Day Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Visits by Day of Week</h3>
          <div className="h-64 flex items-end space-x-6 pt-4">
            {visitsByDay.map((day) => (
              <div key={day.day} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-purple-600 rounded-t-sm transition-all duration-500 ease-in-out hover:bg-purple-700"
                  style={{ 
                    height: `${maxVisits ? (day.count / maxVisits) * 100 : 0}%`,
                    minHeight: day.count ? '10%' : '2%'
                  }}
                ></div>
                <div className="text-xs font-medium text-gray-500 mt-2">{day.day}</div>
                <div className="text-sm font-semibold">{day.count}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent Customers */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Customers</h3>
          <ul className="space-y-3">
            {recentCustomers.map((customer) => (
              <li key={customer.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">
                    {customer.firstname.charAt(0)}{customer.lastname.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{customer.firstname} {customer.lastname}</p>
                    <p className="text-xs text-gray-500">{customer.phone}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{formatDate(customer.joindate)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Visits</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentVisits.map((visit) => {
                const customer = customers.find(c => c.id === visit.customerid);
                return (
                  <tr key={visit.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {customer ? `${customer.firstname} ${customer.lastname}` : 'Unknown'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{visit.service}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(visit.date)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatCurrency(visit.amount)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        +{visit.points}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{visit.staffmember}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;