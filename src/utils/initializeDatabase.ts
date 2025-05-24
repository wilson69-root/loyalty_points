import { supabase } from './supabaseClient';
import { seedSupabaseWithMockData } from './mockData';

export const createSupabaseTables = async (): Promise<void> => {
  try {
    // Create customers table with snake_case column names
    const { error: customersTableError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.customers (
          id UUID PRIMARY KEY,
          firstname TEXT NOT NULL,
          lastname TEXT NOT NULL,
          phone TEXT,
          email TEXT,
          joindate TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          notes TEXT,
          birthday TEXT,
          preferences TEXT[]
        );
      `
    });
    
    if (customersTableError) {
      console.error('Error creating customers table:', customersTableError);
      throw customersTableError;
    }
    
    // Create visits table with snake_case column names
    const { error: visitsTableError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.visits (
          id UUID PRIMARY KEY,
          customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
          date TIMESTAMP WITH TIME ZONE NOT NULL,
          service TEXT NOT NULL,
          amount INTEGER NOT NULL,
          points INTEGER NOT NULL,
          notes TEXT,
          staff_member TEXT
        );
      `
    });
    
    if (visitsTableError) {
      console.error('Error creating visits table:', visitsTableError);
      throw visitsTableError;
    }
    
    // Create rewards table with snake_case column names
    const { error: rewardsTableError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS public.rewards (
          id UUID PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          points_required INTEGER NOT NULL,
          expiry_days INTEGER,
          is_active BOOLEAN DEFAULT TRUE,
          category TEXT
        );
      `
    });
    
    if (rewardsTableError) {
      console.error('Error creating rewards table:', rewardsTableError);
      throw rewardsTableError;
    }
    
    console.log('Database tables created successfully');
    
    // Seed the database with mock data
    await seedSupabaseWithMockData();
    
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const initializeDatabase = async (): Promise<void> => {
  try {
    // Check if tables exist and have data
    const { data: customersData, error: customersError } = await supabase
      .from('customers')
      .select('id')
      .limit(1);
    
    if (customersError && customersError.code === '42P01') {
      // Table doesn't exist, create tables
      console.log('Tables do not exist, creating tables...');
      await createSupabaseTables();
    } else if (customersError) {
      console.error('Error checking customers table:', customersError);
      throw customersError;
    } else if (!customersData || customersData.length === 0) {
      // Table exists but no data
      console.log('No data found, seeding database...');
      await seedSupabaseWithMockData();
      console.log('Database seeded successfully');
    } else {
      console.log('Database already contains data');
    }
    
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// You can call this function when your app initializes
// createSupabaseTables();