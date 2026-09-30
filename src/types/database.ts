export type PriceType = 'free_consultation' | 'custom_quote' | 'percentage_fee' | 'fixed';

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_type: PriceType;
  base_price: number;
  duration_minutes: number;
  is_active: boolean;
  created_at?: string;
  features?: string[];
  sqft_range?: string;
  badge?: string;
  image?: string;
}

export interface Appointment {
  id?: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_id?: string;
  service_name?: string;
  booking_date: string;
  booking_time_slot: string;
  notes?: string;
  status?: AppointmentStatus | string;
  created_at?: string;

  // Compatibility aliases
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  appointment_date?: string;
  appointment_time?: string;
}

export interface BusinessHour {
  id?: string;
  day_of_week: string;
  open_time: string;
  close_time: string;
  is_closed: boolean;
  display_text: string;
}

export interface Review {
  id?: string;
  author_name: string;
  company_designation?: string;
  rating: number;
  comment: string;
  source: string;
  is_featured: boolean;
  created_at?: string;
  avatar_bg?: string;
}

export interface AdminAccount {
  id?: string;
  full_name: string;
  email: string;
  password?: string;
  created_at?: string;
}
