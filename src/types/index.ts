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
  customerid: string;
  date: string;
  service: string;
  amount: number;
  points: number;
  notes?: string;
  staffmember?: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsrequired: number;
  expirydays?: number;
  isactive: boolean;
  category?: string;
}

export interface RedemptionHistory {
  id: string;
  customerid: string;
  rewardId: string;
  date: string;
  points: number;
}

export type ServiceCategory = 'haircut' | 'color' | 'treatment' | 'styling' | 'other';

export interface BusinessSettings {
  name: string;
  pointsPerDollar: number;
  expirydays: number;
  welcomeBonus: number;
  birthdayBonus: number;
}