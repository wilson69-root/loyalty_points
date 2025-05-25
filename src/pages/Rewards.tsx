import React, { useState } from 'react';
import { useLoyalty } from '../context/LoyaltyContext';
import { generateId } from '../utils/mockData';
import { FiPlusCircle, FiEdit, FiTrash2, FiToggleLeft, FiToggleRight, FiGift, FiTag, FiCalendar } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the type for a single reward, mirroring what's expected by the context/database
interface Reward {
  id: string;
  name: string;
  description?: string;
  pointsrequired: number;
  expirydays?: number;
  isactive: boolean;
  category?: string;
}

const Rewards = () => {
  const { rewards, updateRewards } = useLoyalty();
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialNewRewardState = {
    name: '',
    description: '',
    pointsRequired: 0,
    expiryDays: 0,
    category: '',
  };
  const [newReward, setNewReward] = useState(initialNewRewardState);

  // Calculate reward statistics (optional, can be removed if not displayed)
  // const activeRewardsCount = rewards.filter(r => r.isactive).length;
  // const totalRewardsCount = rewards.length;
  // const avgPointsRequired = totalRewardsCount > 0 ? Math.round(rewards.reduce((sum, r) => sum + r.pointsrequired, 0) / totalRewardsCount) : 0;

  const handleAddReward = async () => {
    if (!newReward.name || newReward.pointsRequired <= 0) {
      toast.error('Please enter a valid name and points required (must be > 0).');
      return;
    }
    
    const rewardToAdd: Reward = {
      id: generateId(),
      name: newReward.name,
      description: newReward.description || undefined,
      pointsrequired: newReward.pointsRequired,
      expirydays: newReward.expiryDays > 0 ? newReward.expiryDays : undefined,
      isactive: true, // New rewards are active by default
      category: newReward.category || undefined,
    };
    
    try {
      await updateRewards([...rewards, {...rewardToAdd, description: rewardToAdd.description || ''}]);
      setNewReward(initialNewRewardState);
      toast.success('Reward created successfully!');
    } catch (error) {
      console.error('Error creating reward:', error);
      toast.error('Failed to create reward. Please try again.');
    }
  };
  
  const handleUpdateReward = async () => {
    if (!editingId) return;
    if (!newReward.name || newReward.pointsRequired <= 0) {
      toast.error('Please enter a valid name and points required (must be > 0).');
      return;
    }
    try {
      const updatedRewards = rewards.map(reward => {
        if (reward.id === editingId) {
          return {
            ...reward,
            name: newReward.name,
            description: newReward.description || undefined,
            pointsrequired: newReward.pointsRequired,
            expirydays: newReward.expiryDays > 0 ? newReward.expiryDays : undefined,
            category: newReward.category || undefined,
          } as Reward;
        }
        return reward;
      });
      
      await updateRewards(updatedRewards.map(reward => ({
        ...reward,
        description: reward.description || '' // Ensure description is never undefined
      })));
      setEditingId(null);
      setNewReward(initialNewRewardState);
      toast.success('Reward updated successfully!');
    } catch (error) {
      console.error('Error updating reward:', error);
      toast.error('Failed to update reward. Please try again.');
    }
  };
  
  const handleEditReward = (reward: Reward) => {
    setEditingId(reward.id);
    setNewReward({
      name: reward.name,
      description: reward.description || '',
      pointsRequired: reward.pointsrequired,
      expiryDays: reward.expirydays || 0,
      category: reward.category || '',
    });
  };
  
  const handleToggleActive = async (id: string, currentIsActive: boolean) => {
    const updatedRewards = rewards.map(reward => {
      if (reward.id === id) {
        return { ...reward, isactive: !currentIsActive };
      }
      return reward;
    });
    
    try {
        await updateRewards(updatedRewards);
        toast.success(`Reward ${!currentIsActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
        console.error('Error toggling reward status:', error);
        toast.error('Failed to update reward status.');
    }
  };
  
  const handleDeleteReward = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this reward?')) {
        try {
            const updatedRewards = rewards.filter(reward => reward.id !== id);
            await updateRewards(updatedRewards);
            toast.success('Reward deleted');
        } catch (error) {
            console.error('Error deleting reward:', error);
            toast.error('Failed to delete reward.');
        }
    }
  };

  const renderRewardForm = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">{editingId ? 'Edit Reward' : 'Add New Reward'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reward Name</label>
          <input
            type="text"
            id="name"
            value={newReward.name}
            onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
            placeholder="E.g., Free Coffee"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="pointsRequired" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Points Required</label>
          <input
            type="number"
            id="pointsRequired"
            value={newReward.pointsRequired}
            onChange={(e) => setNewReward({ ...newReward, pointsRequired: parseInt(e.target.value) || 0 })}
            placeholder="E.g., 100"
            min="1"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea
            id="description"
            value={newReward.description}
            onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
            rows={3}
            placeholder="Short description of the reward"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <input
            type="text"
            id="category"
            value={newReward.category}
            onChange={(e) => setNewReward({ ...newReward, category: e.target.value })}
            placeholder="E.g., Beverage, Discount"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="expiryDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Days (0 for no expiry)</label>
          <input
            type="number"
            id="expiryDays"
            value={newReward.expiryDays}
            onChange={(e) => setNewReward({ ...newReward, expiryDays: parseInt(e.target.value) || 0 })}
            placeholder="E.g., 30"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button
          onClick={() => {
            setEditingId(null);
            setNewReward(initialNewRewardState);
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          onClick={editingId ? handleUpdateReward : handleAddReward}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
        >
          {editingId ? <FiEdit className="mr-2" /> : <FiPlusCircle className="mr-2" />} {editingId ? 'Update Reward' : 'Add Reward'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Manage Rewards</h1>

      {renderRewardForm()}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Available Rewards</h2>
        {rewards.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No rewards available. Add some rewards using the form above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward: Reward) => (
              <div key={reward.id} className={`p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl ${reward.isactive ? 'bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700' : 'bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700'}`}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white flex items-center"><FiGift className="mr-2" />{reward.name}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${reward.isactive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {reward.isactive ? 'Active' : 'Inactive'}
                  </span>
                </div> 
                <p className="text-sm text-purple-100 dark:text-indigo-100 mb-1 line-clamp-2">{reward.description || 'No description'}</p>
                <div className="text-sm text-purple-200 dark:text-indigo-200 mb-1 flex items-center"><FiTag className="mr-2" />Category: {reward.category || 'N/A'}</div>
                <div className="text-lg font-bold text-white mb-3">{reward.pointsrequired} Points</div>
                {reward.expirydays && reward.expirydays > 0 && (
                  <p className="text-xs text-purple-100 dark:text-indigo-100 mb-3 flex items-center"><FiCalendar className="mr-2" />Expires in {reward.expirydays} days</p>
                )}
                <div className="mt-4 pt-4 border-t border-purple-400 dark:border-indigo-500 flex justify-end space-x-3">
                  <button
                    onClick={() => handleEditReward(reward)}
                    className="p-2 rounded-full text-white hover:bg-white/20 transition-colors duration-200"
                    title="Edit Reward"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteReward(reward.id)}
                    className="p-2 rounded-full text-white hover:bg-white/20 transition-colors duration-200"
                    title="Delete Reward"
                  >
                    <FiTrash2 size={18} />
                  </button>
                  <button
                    onClick={() => handleToggleActive(reward.id, reward.isactive)}
                    className="p-2 rounded-full text-white hover:bg-white/20 transition-colors duration-200"
                    title={reward.isactive ? 'Deactivate Reward' : 'Activate Reward'}
                  >
                    {reward.isactive ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;