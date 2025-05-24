export interface Customer {
  id: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  joindate: string;
  notes?: string;
  birthday?: string;
  preferences?: string[];
}

export interface Visit {
  id: string;
  customerId: string;
  date: string;
  service: string;
  amount: number;
  points: number;
  notes?: string;
  staffMember?: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  expiryDays?: number;
  isActive: boolean;
  category?: string;
}

export interface RedemptionHistory {
  id: string;
  customerId: string;
  rewardId: string;
  date: string;
  points: number;
}

export type ServiceCategory = 'haircut' | 'color' | 'treatment' | 'styling' | 'other';

export interface BusinessSettings {
  name: string;
  pointsPerDollar: number;
  expiryDays: number;
  welcomeBonus: number;
  birthdayBonus: number;
}