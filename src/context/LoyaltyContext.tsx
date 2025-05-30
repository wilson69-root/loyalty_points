import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, Visit, Reward } from '../types';
import { 
  fetchCustomers, 
  fetchVisits, 
  fetchRewards,
  addCustomer as addCustomerToSupabase,
  updateCustomer as updateCustomerToSupabase,
  deleteCustomer as deleteCustomerToSupabase,
  addVisitToSupabase,
  // Add these new imports
  addRewardToSupabase,
  updateRewardInSupabase,
  deleteRewardFromSupabase
} from '../utils/mockData';

interface LoyaltyContextType {
  businessName: string;
  customers: Customer[];
  visits: Visit[];
  rewards: Reward[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  findCustomerByPhone: (phone: string) => Customer | undefined;
  addVisit: (visit: Visit) => void;
  getCustomerVisits: (customerid: string) => Visit[];
  getCustomerPoints: (customerid: string) => number;
  updateRewards: (rewards: Reward[]) => void;
  redeemReward: (customerid: string, rewardId: string) => void;
}

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

export const LoyaltyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [customersData, visitsData, rewardsData] = await Promise.all([
          fetchCustomers(),
          fetchVisits(),
          fetchRewards()
        ]);
        
        setCustomers(customersData);
        setVisits(visitsData);
        setRewards(rewardsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Find customer by phone
  const findCustomerByPhone = (phone: string): Customer | undefined => {
    // Normalize the phone number for comparison
    const normalizedPhone = phone.replace(/\D/g, '');
    return customers.find(customer => 
      customer.phone.replace(/\D/g, '').includes(normalizedPhone)
    );
  };

  // Add a new customer
  const addCustomer = async (customer: Customer) => {
    try {
      const newCustomer = await addCustomerToSupabase(customer);
      setCustomers(prev => [...prev, newCustomer]);
      return newCustomer;
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  };

  // Add a new visit
  const addVisit = async (visit: Visit) => {
    try {
      const newVisit = await addVisitToSupabase(visit);
      setVisits(prev => [...prev, newVisit]);
      return newVisit;
    } catch (error) {
      console.error('Error adding visit:', error);
      throw error;
    }
  };

  const getCustomerVisits = (customerid: string): Visit[] => {
    return visits.filter((v) => v.customerid === customerid);
  };

  const getCustomerPoints = (customerid: string): number => {
    return getCustomerVisits(customerid).reduce((total, visit) => total + visit.points, 0);
  };

  // Update the updateRewards function to persist to Supabase
  const updateRewards = async (newRewards: Reward[]) => {
    try {
      // Find which rewards are new, updated, or deleted
      const currentRewardIds = rewards.map(r => r.id);
      const newRewardIds = newRewards.map(r => r.id);
      
      // New rewards to add
      const rewardsToAdd = newRewards.filter(r => !r.id || !currentRewardIds.includes(r.id));
      
      // Existing rewards that were updated
      const rewardsToUpdate = newRewards.filter(r => 
        r.id && currentRewardIds.includes(r.id) && 
        JSON.stringify(r) !== JSON.stringify(rewards.find(cr => cr.id === r.id))
      );
      
      // Rewards that were deleted
      const rewardsToDelete = rewards.filter(r => !newRewardIds.includes(r.id));
      
      // Process all operations
      await Promise.all([
        ...rewardsToAdd.map(r => addRewardToSupabase(r)),
        ...rewardsToUpdate.map(r => updateRewardInSupabase(r.id, r)),
        ...rewardsToDelete.map(r => deleteRewardFromSupabase(r.id))
      ]);
      
      // Update local state
      setRewards(newRewards);
    } catch (error) {
      console.error('Error updating rewards:', error);
      throw error;
    }
  };

  const redeemReward = (customerid: string, rewardId: string) => {
    // Logic to redeem a reward would go here
    // This would typically update the visits or a separate redemptions table
    console.log(`Customer ${customerid} redeemed reward ${rewardId}`);
  };

  return (
    <LoyaltyContext.Provider
      value={{
        businessName: "My Business", // Added default business name
        customers,
        visits,
        rewards,
        addCustomer,
        updateCustomer: async (id: string, customer: Partial<Customer>) => {
          try {
            const updatedCustomer = await updateCustomerToSupabase(id, customer);
            setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updatedCustomer } : c));
            return updatedCustomer;
          } catch (error) {
            console.error('Error updating customer:', error);
            throw error;
          }
        },
        findCustomerByPhone,
        addVisit,
        getCustomerVisits,
        getCustomerPoints,
        updateRewards,
        redeemReward,
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  );
};

export const useLoyalty = (): LoyaltyContextType => {
  const context = useContext(LoyaltyContext);
  if (context === undefined) {
    throw new Error('useLoyalty must be used within a LoyaltyProvider');
  }
  return context;
};