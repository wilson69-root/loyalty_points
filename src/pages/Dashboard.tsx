import React from 'react';
import {
  BarChart3, Users, CalendarClock, Award, TrendingUp, Star, Clock, DollarSign, 
  Users2, Activity, ShoppingBag, BarChartHorizontalBig, LineChart, ListChecks, Eye // Added more icons
} from 'lucide-react';
import { useLoyalty } from '../context/LoyaltyContext';
import { formatCurrency, formatDate } from '../utils/mockData';

// Helper component for consistent card styling (similar to Settings.tsx)
interface DashboardCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}
const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon, children, className = '', titleClassName = 'text-xl' }) => (
  <div className={`bg-gray-800 bg-opacity-60 backdrop-blur-md shadow-2xl rounded-xl border border-gray-700 ${className}`}>
    <div className="p-5 border-b border-gray-700 flex items-center">
      {icon && <div className="mr-3 p-2 bg-gray-700 rounded-lg text-purple-400">{icon}</div>}
      <h3 className={`font-semibold text-white ${titleClassName}`}>{title}</h3>
    </div>
    <div className="p-5">
      {children}
    </div>
  </div>
);

const Dashboard = () => {
  const { customers, visits, rewards } = useLoyalty();

  const totalCustomers = customers.length;
  const totalVisits = visits.length;
  const recentVisits = visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  const totalRevenue = visits.reduce((sum, visit) => sum + visit.amount, 0);
  const avgTicketValue = totalRevenue / totalVisits || 0;
  const totalPointsAwarded = visits.reduce((sum, visit) => sum + visit.points, 0);
  const activeRewardsCount = rewards.filter(r => r.isactive).length;

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  
  const recentPeriodVisitsCount = visits.filter(v => new Date(v.date) >= thirtyDaysAgo).length;
  const previousPeriodVisitsCount = visits.filter(v => new Date(v.date) >= sixtyDaysAgo && new Date(v.date) < thirtyDaysAgo).length;
  const visitGrowthPercentage = previousPeriodVisitsCount > 0 
    ? ((recentPeriodVisitsCount - previousPeriodVisitsCount) / previousPeriodVisitsCount) * 100 
    : (recentPeriodVisitsCount > 0 ? 100 : 0); // Handle case where previous is 0

  const recentCustomers = [...customers]
    .sort((a, b) => new Date(b.joindate).getTime() - new Date(a.joindate).getTime())
    .slice(0, 5);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const visitsByDay = daysOfWeek.map(dayAbbrev => {
    const dayFullName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][daysOfWeek.indexOf(dayAbbrev)];
    return {
      day: dayAbbrev,
      count: visits.filter(v => new Date(v.date).toLocaleDateString('en-US', { weekday: 'long' }) === dayFullName).length
    };
  });
  const maxVisitsForChart = Math.max(...visitsByDay.map(d => d.count), 0);

  const serviceStats = visits.reduce((acc, visit) => {
    acc[visit.service] = (acc[visit.service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topServices = Object.entries(serviceStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([service, count]) => ({ service, count }));
  const maxServiceCount = topServices.length > 0 ? topServices[0].count : 0;

  const monthlyRevenueData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const monthVisits = visits.filter(v => {
      const visitDate = new Date(v.date);
      return visitDate >= monthStart && visitDate <= monthEnd;
    });
    
    const revenue = monthVisits.reduce((sum, visit) => sum + visit.amount, 0);
    monthlyRevenueData.push({
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      revenue
    });
  }
  const maxRevenueForChart = Math.max(...monthlyRevenueData.map(m => m.revenue), 0);

  const StatCard = ({ title, value, icon, growth, unit, bgColorClass = 'from-purple-600 to-purple-700', textColorClass = 'text-purple-100' }: {
    title: string, value: string | number, icon: React.ReactNode, growth?: number, unit?: string, bgColorClass?: string, textColorClass?: string
  }) => (
    <div className={`p-6 rounded-xl shadow-xl text-white bg-gradient-to-br ${bgColorClass}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${textColorClass}`}>{title}</p>
          <h3 className="text-3xl font-bold">{value} <span className="text-lg">{unit}</span></h3>
          {growth !== undefined && (
            <div className={`flex items-center mt-1 text-xs ${textColorClass} opacity-80`}>
              <TrendingUp className={`h-3 w-3 mr-1 ${growth >= 0 ? 'text-green-300' : 'text-red-300'}`} />
              <span className={`${growth >= 0 ? 'text-green-300' : 'text-red-300'}`}>{growth >= 0 ? '+' : ''}{growth.toFixed(1)}%</span> vs last month
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-white bg-opacity-20">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-slate-900 to-gray-800 min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white flex items-center">
          <Activity size={36} className="mr-4 text-purple-400" /> Loyalty Dashboard
        </h1>
        <p className="text-gray-400 mt-2">Overview of your loyalty program performance and customer engagement.</p>
      </div>

      {/* Main Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Customers" value={totalCustomers} icon={<Users2 className="h-8 w-8" />} bgColorClass="from-blue-600 to-blue-700" textColorClass="text-blue-100" />
        <StatCard title="Total Visits" value={totalVisits} icon={<CalendarClock className="h-8 w-8" />} growth={visitGrowthPercentage} bgColorClass="from-green-600 to-green-700" textColorClass="text-green-100" />
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={<DollarSign className="h-8 w-8" />} bgColorClass="from-yellow-500 to-yellow-600" textColorClass="text-yellow-100" />
        <StatCard title="Avg. Ticket Value" value={formatCurrency(avgTicketValue)} icon={<ShoppingBag className="h-8 w-8" />} bgColorClass="from-red-500 to-red-600" textColorClass="text-red-100" />
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Points Awarded" icon={<Star size={20}/>} className="text-center">
          <p className="text-4xl font-bold text-yellow-400">{totalPointsAwarded.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Total points distributed</p>
        </DashboardCard>
        <DashboardCard title="Active Rewards" icon={<Award size={20}/>} className="text-center">
          <p className="text-4xl font-bold text-indigo-400">{activeRewardsCount}</p>
          <p className="text-sm text-gray-400">Currently available rewards</p>
        </DashboardCard>
        <DashboardCard title="Avg. Points / Visit" icon={<TrendingUp size={20}/>} className="text-center">
          <p className="text-4xl font-bold text-pink-400">{totalVisits > 0 ? (totalPointsAwarded / totalVisits).toFixed(1) : 0}</p>
          <p className="text-sm text-gray-400">Average points earned per visit</p>
        </DashboardCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Visits by Day Chart */}
        <DashboardCard title="Visits by Day" icon={<BarChart3 size={20}/>} className="lg:col-span-2">
          <div className="h-64 flex items-end space-x-2 md:space-x-4 pt-4">
            {visitsByDay.map((day) => (
              <div key={day.day} className="flex flex-col items-center flex-1 h-full">
                <div className="relative w-full group h-full flex items-end">
                  <div 
                    className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-md transition-all duration-300 ease-in-out hover:from-purple-500 hover:to-purple-300 cursor-pointer"
                    style={{ 
                      height: `${maxVisitsForChart > 0 ? (day.count / maxVisitsForChart) * 90 : 0}%`, // Use 90% of height to leave space for label
                      minHeight: '5px' // Ensure a minimum visible height for the bar itself
                    }}
                  ></div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {day.count} visits
                  </div>
                </div>
                <div className="text-xs font-medium text-gray-400 mt-2">{day.day}</div>
              </div>
            ))}
          </div>
        </DashboardCard>
        
        {/* Recent Customers */}
        <DashboardCard title="Newest Members" icon={<Users size={20}/>}>
          <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {recentCustomers.map((customer) => (
              <li key={customer.id} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                    {customer.firstname.charAt(0)}{customer.lastname.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-100">{customer.firstname} {customer.lastname}</p>
                    <p className="text-xs text-gray-400">Joined: {formatDate(customer.joindate)}</p>
                  </div>
                </div>
                <Eye size={18} className="text-purple-400 cursor-pointer hover:text-purple-300" />
              </li>
            ))}
            {recentCustomers.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No recent customers.</p>}
          </ul>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend Chart */}
        <DashboardCard title="Monthly Revenue Trend" icon={<LineChart size={20}/>}>
          <div className="h-60 flex items-end space-x-2 md:space-x-3 pt-4">
            {monthlyRevenueData.map((month, index) => (
              <div key={index} className="flex flex-col items-center flex-1 h-full">
                <div className="relative w-full group h-full flex items-end">
                  <div 
                    className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-sm transition-all duration-300 ease-in-out hover:from-green-500 hover:to-green-300 cursor-pointer"
                    style={{ 
                      height: `${maxRevenueForChart > 0 ? (month.revenue / maxRevenueForChart) * 90 : 0}%`, // Use 90% of height
                      minHeight: '5px' // Ensure a minimum visible height
                    }}
                  ></div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {formatCurrency(month.revenue)}
                  </div>
                </div>
                <div className="text-xs font-medium text-gray-400 mt-2">{month.month}</div>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Top Services */}
        <DashboardCard title="Popular Services" icon={<ListChecks size={20}/>}>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {topServices.map((service, index) => (
              <div key={service.service} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <span className={`mr-2 w-5 text-center font-semibold ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-gray-500'}`}>{index + 1}.</span>
                  <span className="font-medium text-gray-200">{service.service}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-700 rounded-full h-2.5 mr-2">
                    <div 
                      className="bg-purple-500 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${maxServiceCount > 0 ? (service.count / maxServiceCount) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-gray-300">{service.count}</span>
                </div>
              </div>
            ))}
            {topServices.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No service data available.</p>}
          </div>
        </DashboardCard>
      </div>
      
      {/* Recent Activity Table */}
      <DashboardCard title="Recent Visits" icon={<BarChartHorizontalBig size={20}/>}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700/50">
              <tr>
                {['Customer', 'Service', 'Date', 'Amount', 'Points', 'Staff'].map(header => (
                  <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {recentVisits.map((visit) => {
                const customer = customers.find(c => c.id === visit.customerid);
                return (
                  <tr key={visit.id} className="hover:bg-gray-700/70 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium text-xs mr-3">
                          {customer ? `${customer.firstname.charAt(0)}${customer.lastname.charAt(0)}` : '??'}
                        </div>
                        <span className="text-sm font-medium text-gray-100">
                          {customer ? `${customer.firstname} ${customer.lastname}` : 'Unknown Customer'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{visit.service}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{formatDate(visit.date)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-400">{formatCurrency(visit.amount)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-500/20 text-purple-300">
                        +{visit.points}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{visit.staffmember}</td>
                  </tr>
                );
              })}
              {recentVisits.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    No recent visits to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
};

export default Dashboard;