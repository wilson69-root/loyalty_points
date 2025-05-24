import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, Visit, Reward } from '../types';
import { 
  fetchCustomers, 
  fetchVisits, 
  fetchRewards,
  addCustomer as addCustomerToSupabase,
  updateCustomer as updateCustomerToSupabase,
  deleteCustomer as deleteCustomerToSupabase,
  addVisitToSupabase
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
  getCustomerVisits: (customerId: string) => Visit[];
  getCustomerPoints: (customerId: string) => number;
  updateRewards: (rewards: Reward[]) => void;
  redeemReward: (customerId: string, rewardId: string) => void;
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

  const getCustomerVisits = (customerId: string): Visit[] => {
    return visits.filter((v) => v.customerId === customerId);
  };

  const getCustomerPoints = (customerId: string): number => {
    return getCustomerVisits(customerId).reduce((total, visit) => total + visit.points, 0);
  };

  const updateRewards = (newRewards: Reward[]) => {
    setRewards(newRewards);
  };

  const redeemReward = (customerId: string, rewardId: string) => {
    // Logic to redeem a reward would go here
    // This would typically update the visits or a separate redemptions table
    console.log(`Customer ${customerId} redeemed reward ${rewardId}`);
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