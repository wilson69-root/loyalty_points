import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Phone, Mail, Calendar, Package, Clock, ChevronLeft, 
  Edit2, Gift, Award, Tag, CalendarClock 
} from 'lucide-react';
import { useLoyalty } from '../context/LoyaltyContext';
import { formatPhoneNumber, formatDate, formatDateTime, formatCurrency } from '../utils/mockData';
import toast from 'react-hot-toast';

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    customers, 
    visits, 
    rewards, 
    getCustomerVisits, 
    getCustomerPoints,
    updateCustomer,
    redeemReward
  } = useLoyalty();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'visits' | 'rewards'>('visits');
  
  const customer = customers.find(c => c.id === id);
  const customerVisits = id ? getCustomerVisits(id) : [];
  const totalPoints = id ? getCustomerPoints(id) : 0;
  
  const [editForm, setEditForm] = useState({
    firstname: customer?.firstname || '',
    lastname: customer?.lastname || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    birthday: customer?.birthday || '',
    notes: customer?.notes || '',
  });
  
  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500">Customer not found</p>
        <button
          onClick={() => navigate('/customers')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  const handleSaveEdit = () => {
    if (id) {
      updateCustomer(id, editForm);
      setIsEditing(false);
      toast.success('Customer information updated');
    }
  };

  const handleRedeemReward = (rewardId: string) => {
    if (id) {
      redeemReward(id, rewardId);
      toast.success('Reward redeemed successfully!');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/customers')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5 text-gray-500" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Customer Details</h2>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="ml-auto flex items-center text-sm text-purple-700 hover:text-purple-800"
          >
            <Edit2 className="h-4 w-4 mr-1" />
            Edit
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          {isEditing ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Customer</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editForm.firstname}
                    onChange={(e) => setEditForm({...editForm, firstname: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editForm.lastname}
                    onChange={(e) => setEditForm({...editForm, lastname: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birthday
                </label>
                <input
                  type="date"
                  value={editForm.birthday}
                  onChange={(e) => setEditForm({...editForm, birthday: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-purple-700 border border-transparent rounded-md text-sm font-medium text-white hover:bg-purple-800"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xl font-medium">
                  {customer.firstname.charAt(0)}{customer.lastname.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900">{customer.firstname} {customer.lastname}</h3>
                  <div className="flex items-center mt-1">
                    <Package className="h-4 w-4 text-purple-500 mr-1" />
                    <span className="font-medium text-gray-900">{totalPoints}</span>
                    <span className="text-gray-500 ml-1">loyalty points</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <span>{formatPhoneNumber(customer.phone)}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <span>{customer.email}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <span>Joined {formatDate(customer.joindate)}</span>
                </div>
                
                {customer.birthday && (
                  <div className="flex items-center text-gray-600">
                    <Gift className="h-5 w-5 text-gray-400 mr-3" />
                    <span>Birthday: {formatDate(customer.birthday)}</span>
                  </div>
                )}
                
                {customer.preferences && customer.preferences.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Preferences</h4>
                    <div className="flex flex-wrap gap-2">
                      {customer.preferences.map((pref, idx) => (
                        <span 
                          key={idx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {customer.notes && (
                  <div className="pt-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {customer.notes}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        {/* Tabs */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('visits')}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === 'visits'
                      ? 'border-b-2 border-purple-700 text-purple-700'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Visit History
                </button>
                <button
                  onClick={() => setActiveTab('rewards')}
                  className={`px-6 py-3 font-medium text-sm ${
                    activeTab === 'rewards'
                      ? 'border-b-2 border-purple-700 text-purple-700'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Available Rewards
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'visits' ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Visit History</h3>
                    <button
                      onClick={() => navigate('/check-in', { state: { customerId: id } })}
                      className="px-3 py-1.5 bg-purple-700 text-white text-sm font-medium rounded-md hover:bg-purple-800 transition-colors"
                    >
                      New Visit
                    </button>
                  </div>
                  
                  {customerVisits.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No visits recorded yet
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {customerVisits
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((visit) => (
                          <div 
                            key={visit.id}
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">{visit.service}</h4>
                                <div className="text-sm text-gray-500 flex items-center mt-1">
                                  <CalendarClock className="h-4 w-4 mr-1" />
                                  {formatDateTime(visit.date)}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-gray-900">{formatCurrency(visit.amount)}</div>
                                <div className="text-sm font-medium text-purple-700 mt-1">+{visit.points} points</div>
                              </div>
                            </div>
                            
                            {visit.notes && (
                              <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                {visit.notes}
                              </div>
                            )}
                            
                            {visit.staffMember && (
                              <div className="mt-2 text-xs text-gray-500">
                                Staff: {visit.staffMember}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Rewards</h3>
                  
                  {rewards.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No rewards available yet
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {rewards
                        .filter(reward => reward.isActive)
                        .map((reward) => {
                          const canRedeem = totalPoints >= reward.pointsRequired;
                          
                          return (
                            <div 
                              key={reward.id}
                              className={`border rounded-lg p-4 ${
                                canRedeem 
                                  ? 'border-purple-200 bg-purple-50 hover:bg-purple-100' 
                                  : 'border-gray-200 bg-gray-50'
                              } transition-colors`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center">
                                    <Award className={`h-5 w-5 mr-2 ${canRedeem ? 'text-purple-600' : 'text-gray-400'}`} />
                                    <h4 className={`font-medium ${canRedeem ? 'text-purple-900' : 'text-gray-500'}`}>
                                      {reward.name}
                                    </h4>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {reward.description}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className={`text-sm font-medium ${canRedeem ? 'text-purple-700' : 'text-gray-500'}`}>
                                    {reward.pointsRequired} points
                                  </div>
                                  {reward.expiryDays && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      Valid for {reward.expiryDays} days
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mt-3">
                                <button
                                  onClick={() => handleRedeemReward(reward.id)}
                                  disabled={!canRedeem}
                                  className={`w-full py-2 text-sm font-medium rounded-md ${
                                    canRedeem
                                      ? 'bg-purple-700 text-white hover:bg-purple-800'
                                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  }`}
                                >
                                  {canRedeem ? 'Redeem Reward' : `Need ${reward.pointsRequired - totalPoints} more points`}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;