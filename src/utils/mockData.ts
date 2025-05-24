import { Customer, Visit, Reward } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabaseClient';

export const generateMockData = () => {
  // Generate mock customers
  const mockCustomers: Customer[] = [
    {
      id: '1',
      firstname: 'John',
      lastname: 'Doe',
      phone: '+254 712 345 678',
      email: 'john@example.com',
      joindate: '2024-12-01',
      notes: 'Prefers appointments on weekends',
      birthday: '1985-04-15',
      preferences: ['short haircuts', 'beard trim']
    },
    {
      id: '2',
      firstname: 'Jane',
      lastname: 'Smith',
      phone: '+254 723 456 789',
      email: 'jane@example.com',
      joindate: '2025-01-15',
      notes: 'Allergic to certain hair products',
      birthday: '1990-07-22',
      preferences: ['balayage', 'natural products']
    },
    {
      id: '3',
      firstname: 'Sarah',
      lastname: 'Johnson',
      phone: '+254 734 567 890',
      email: 'sarah@example.com',
      joindate: '2025-02-03',
      birthday: '1982-09-10',
      preferences: ['blowouts', 'color touch-ups']
    },
    {
      id: '4',
      firstname: 'Michael',
      lastname: 'Brown',
      phone: '+254 745 678 901',
      email: 'michael@example.com',
      joindate: '2025-01-10',
      notes: 'Prefers quick appointments during lunch breaks',
      preferences: ['classic cuts', 'beard shaping']
    },
    {
      id: '5',
      firstname: 'Emily',
      lastname: 'Davis',
      phone: '+254 756 789 012',
      email: 'emily@example.com',
      joindate: '2024-11-20',
      birthday: '1995-02-18',
      preferences: ['hair treatments', 'styling']
    }
  ];

  // Generate mock visits
  const mockVisits: Visit[] = [
    {
      id: '101',
      customerId: '1',
      date: '2025-01-05T14:30:00',
      service: 'Haircut',
      amount: 3500,
      points: 35,
      staffMember: 'Maria'
    },
    {
      id: '102',
      customerId: '1',
      date: '2025-02-10T10:15:00',
      service: 'Haircut & Beard Trim',
      amount: 5000,
      points: 50,
      staffMember: 'Carlos'
    },
    {
      id: '103',
      customerId: '2',
      date: '2025-01-20T13:00:00',
      service: 'Color & Style',
      amount: 12000,
      points: 120,
      notes: 'Used hypoallergenic products',
      staffMember: 'Jessica'
    },
    {
      id: '104',
      customerId: '2',
      date: '2025-02-15T16:45:00',
      service: 'Balayage',
      amount: 15000,
      points: 150,
      staffMember: 'Jessica'
    },
    {
      id: '105',
      customerId: '3',
      date: '2025-02-05T11:30:00',
      service: 'Blowout',
      amount: 4500,
      points: 45,
      staffMember: 'David'
    },
    {
      id: '106',
      customerId: '4',
      date: '2025-01-25T12:30:00',
      service: 'Quick Cut',
      amount: 2500,
      points: 25,
      notes: 'Lunch break appointment',
      staffMember: 'Carlos'
    },
    {
      id: '107',
      customerId: '5',
      date: '2025-01-10T15:00:00',
      service: 'Hair Treatment',
      amount: 7500,
      points: 75,
      staffMember: 'Maria'
    },
    {
      id: '108',
      customerId: '5',
      date: '2025-02-01T14:00:00',
      service: 'Cut & Style',
      amount: 6500,
      points: 65,
      staffMember: 'Jessica'
    }
  ];

  // Generate mock rewards
  const mockRewards: Reward[] = [
    {
      id: '201',
      name: 'Free Basic Haircut',
      description: 'Redeem for a complimentary basic haircut service',
      pointsRequired: 200,
      expiryDays: 90,
      isActive: true,
      category: 'service'
    },
    {
      id: '202',
      name: '50% Off Color Service',
      description: 'Get half off your next color service',
      pointsRequired: 300,
      expiryDays: 60,
      isActive: true,
      category: 'discount'
    },
    {
      id: '203',
      name: 'Free Product Sample Kit',
      description: 'Receive a kit of premium hair care samples',
      pointsRequired: 100,
      expiryDays: 30,
      isActive: true,
      category: 'product'
    },
    {
      id: '204',
      name: 'VIP Treatment Add-on',
      description: 'Add a luxury treatment to any service',
      pointsRequired: 150,
      expiryDays: 45,
      isActive: true,
      category: 'addon'
    },
    {
      id: '205',
      name: 'Bring a Friend Discount',
      description: 'Both you and a friend get 25% off services',
      pointsRequired: 250,
      expiryDays: 30,
      isActive: true,
      category: 'special'
    }
  ];

  return { mockCustomers, mockVisits, mockRewards };
};

// Add these new functions for Supabase integration

// Function to seed the Supabase database with mock data
export const seedSupabaseWithMockData = async (): Promise<void> => {
  const { mockCustomers, mockVisits, mockRewards } = generateMockData();
  
  try {
    // Insert customers
    const { error: customersError } = await supabase
      .from('customers')
      .upsert(mockCustomers, { onConflict: 'id' });
    
    if (customersError) throw customersError;
    console.log('Customers data seeded successfully');
    
    // Insert visits
    const { error: visitsError } = await supabase
      .from('visits')
      .upsert(mockVisits, { onConflict: 'id' });
    
    if (visitsError) throw visitsError;
    console.log('Visits data seeded successfully');
    
    // Insert rewards
    const { error: rewardsError } = await supabase
      .from('rewards')
      .upsert(mockRewards, { onConflict: 'id' });
    
    if (rewardsError) throw rewardsError;
    console.log('Rewards data seeded successfully');
    
  } catch (error) {
    console.error('Error seeding data to Supabase:', error);
    throw error;
  }
};

// Functions to fetch data from Supabase
export const fetchCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*');
  
  if (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
  
  return data || [];
};

export const fetchVisits = async (customerId?: string): Promise<Visit[]> => {
  let query = supabase.from('visits').select('*');
  
  if (customerId) {
    query = query.eq('customerId', customerId);
  }
  
  const { data, error } = await query.order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching visits:', error);
    throw error;
  }
  
  return data || [];
};

export const fetchRewards = async (isActive?: boolean): Promise<Reward[]> => {
  let query = supabase.from('rewards').select('*');
  
  if (isActive !== undefined) {
    query = query.eq('isActive', isActive);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching rewards:', error);
    throw error;
  }
  
  return data || [];
};

// CRUD operations for customers
// Update the addCustomer function to use snake_case for database fields
export const addCustomer = async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
  const newCustomer = { ...customer, id: generateId() };
  
  // Convert camelCase to snake_case for database
  const dbCustomer = {
    id: newCustomer.id,
    firstname: newCustomer.firstname,
    lastname: newCustomer.lastname,
    phone: newCustomer.phone,
    email: newCustomer.email,
    joindate: newCustomer.joindate,
    notes: newCustomer.notes,
    birthday: newCustomer.birthday,
    preferences: newCustomer.preferences
  };
  
  const { data, error } = await supabase
    .from('customers')
    .insert([dbCustomer])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
  
  // Convert snake_case back to camelCase for application
  return {
    id: data.id,
    firstname: data.firstname,
    lastname: data.lastname,
    phone: data.phone,
    email: data.email,
    joindate: data.joindate,
    notes: data.notes,
    birthday: data.birthday,
    preferences: data.preferences
  };
};

export const updateCustomer = async (id: string, updates: Partial<Customer>): Promise<Customer> => {
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
  
  return data;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a Kenyan number (starts with 254 or 0)
  if (cleaned.startsWith('254')) {
    // Format as +254 7XX XXX XXX
    const match = cleaned.match(/^254(\d{3})(\d{3})(\d{3})$/);
    if (match) {
      return `+254 ${match[1]} ${match[2]} ${match[3]}`;
    }
  } else if (cleaned.startsWith('0')) {
    // Format as 07XX XXX XXX
    const match = cleaned.match(/^0(\d{3})(\d{3})(\d{3})$/);
    if (match) {
      return `+254 ${match[1]} ${match[2]} ${match[3]}`;
    }
  } else if (cleaned.length === 9) {
    // Assume it's a 9-digit number without the country code or leading zero
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
    if (match) {
      return `+254 ${match[1]} ${match[2]} ${match[3]}`;
    }
  }
  
  // If none of the patterns match, return the original
  return phoneNumber;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

export const generateId = (): string => {
  return uuidv4();
};

// Add this new function for adding visits to Supabase
export const addVisitToSupabase = async (visit: Omit<Visit, 'id'>): Promise<Visit> => {
  const newVisit = { ...visit, id: generateId() };
  
  const { data, error } = await supabase
    .from('visits')
    .insert([newVisit])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding visit to Supabase:', error);
    throw error;
  }
  
  return data;
};