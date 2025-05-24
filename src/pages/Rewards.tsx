import React, { useState } from 'react';
import { Award, Plus, Edit2, Trash2 } from 'lucide-react';
import { useLoyalty } from '../context/LoyaltyContext';
import { generateId } from '../utils/mockData';
import toast from 'react-hot-toast';

const Rewards = () => {
  const { rewards, updateRewards } = useLoyalty();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    pointsRequired: '',
    expiryDays: '',
    category: '',
  });
  
  const handleAddReward = () => {
    if (!newReward.name || !newReward.pointsRequired) {
      toast.error('Please enter a name and points required');
      return;
    }
    
    const points = parseInt(newReward.pointsRequired, 10);
    if (isNaN(points) || points <= 0) {
      toast.error('Please enter a valid point value');
      return;
    }
    
    const reward = {
      id: generateId(),
      name: newReward.name,
      description: newReward.description,
      pointsRequired: points,
      expiryDays: newReward.expiryDays ? parseInt(newReward.expiryDays, 10) : undefined,
      isActive: true,
      category: newReward.category || undefined,
    };
    
    updateRewards([...rewards, reward]);
    setIsAdding(false);
    setNewReward({
      name: '',
      description: '',
      pointsRequired: '',
      expiryDays: '',
      category: '',
    });
    toast.success('Reward created successfully!');
  };
  
  const handleUpdateReward = (id: string) => {
    const updatedRewards = rewards.map(reward => {
      if (reward.id === id) {
        return {
          ...reward,
          name: newReward.name || reward.name,
          description: newReward.description || reward.description,
          pointsRequired: newReward.pointsRequired ? parseInt(newReward.pointsRequired, 10) : reward.pointsRequired,
          expiryDays: newReward.expiryDays ? parseInt(newReward.expiryDays, 10) : reward.expiryDays,
          category: newReward.category || reward.category,
        };
      }
      return reward;
    });
    
    updateRewards(updatedRewards);
    setEditingId(null);
    setNewReward({
      name: '',
      description: '',
      pointsRequired: '',
      expiryDays: '',
      category: '',
    });
    toast.success('Reward updated successfully!');
  };
  
  const handleEditReward = (reward: typeof rewards[0]) => {
    setEditingId(reward.id);
    setNewReward({
      name: reward.name,
      description: reward.description || '',
      pointsRequired: reward.pointsRequired.toString(),
      expiryDays: reward.expiryDays ? reward.expiryDays.toString() : '',
      category: reward.category || '',
    });
  };
  
  const handleToggleActive = (id: string) => {
    const updatedRewards = rewards.map(reward => {
      if (reward.id === id) {
        return { ...reward, isActive: !reward.isActive };
      }
      return reward;
    });
    
    updateRewards(updatedRewards);
    toast.success('Reward status updated');
  };
  
  const handleDeleteReward = (id: string) => {
    if (confirm('Are you sure you want to delete this reward?')) {
      const updatedRewards = rewards.filter(reward => reward.id !== id);
      updateRewards(updatedRewards);
      toast.success('Reward deleted');
    }
  };
  
  const categories = [
    { value: 'service', label: 'Service' },
    { value: 'product', label: 'Product' },
    { value: 'discount', label: 'Discount' },
    { value: 'addon', label: 'Add-on' },
    { value: 'special', label: 'Special' },
  ];
  
  const renderRewardForm = (isEditing: boolean = false) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {isEditing ? 'Edit Reward' : 'Add New Reward'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reward Name *
          </label>
          <input
            type="text"
            value={newReward.name}
            onChange={(e) => setNewReward({...newReward, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="e.g. Free Haircut"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Points Required *
          </label>
          <input
            type="number"
            value={newReward.pointsRequired}
            onChange={(e) => setNewReward({...newReward, pointsRequired: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="e.g. 100"
            min="1"
            required
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={newReward.description}
          onChange={(e) => setNewReward({...newReward, description: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          placeholder="Describe the reward"
        ></textarea>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={newReward.category}
            onChange={(e) => setNewReward({...newReward, category: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Days
          </label>
          <input
            type="number"
            value={newReward.expiryDays}
            onChange={(e) => setNewReward({...newReward, expiryDays: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="e.g. 30 (leave empty for no expiry)"
            min="1"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => {
            setIsAdding(false);
            setEditingId(null);
            setNewReward({
              name: '',
              description: '',
              pointsRequired: '',
              expiryDays: '',
              category: '',
            });
          }}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => isEditing ? handleUpdateReward(editingId!) : handleAddReward()}
          className="px-4 py-2 bg-purple-700 border border-transparent rounded-md text-sm font-medium text-white hover:bg-purple-800"
        >
          {isEditing ? 'Update Reward' : 'Add Reward'}
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Rewards</h2>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-700 hover:bg-purple-800"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Reward
          </button>
        )}
      </div>
      
      {isAdding && renderRewardForm()}
      {editingId && renderRewardForm(true)}
      
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reward
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rewards.map((reward) => (
                <tr key={reward.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Award className={`h-5 w-5 mr-3 ${reward.isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{reward.name}</div>
                        {reward.description && (
                          <div className="text-sm text-gray-500">{reward.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reward.pointsRequired} points</div>
                    {reward.expiryDays && (
                      <div className="text-xs text-gray-500">Expires in {reward.expiryDays} days</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {reward.category ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {reward.category.charAt(0).toUpperCase() + reward.category.slice(1)}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(reward.id)}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        reward.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {reward.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditReward(reward)}
                      className="text-purple-600 hover:text-purple-900 mr-3"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteReward(reward.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {rewards.length === 0 && (
          <div className="py-8 text-center">
            <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-1">No rewards available yet</p>
            <button
              onClick={() => setIsAdding(true)}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Add your first reward
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;