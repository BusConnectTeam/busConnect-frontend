// Tipos para los autobuses
export type BusType = 'minibus' | 'standard' | 'luxury';

export interface Bus {
  id: string;
  companyId: string;
  name: string;
  capacity: number;
  type: BusType;
  amenities: string[];
  images: string[];
  pricePerDay: number;
  rating: number;
  reviewCount: number;
}

// Tipos para las empresas
export interface Company {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  description: string;
  fleet: Bus[];
}

// Tipos para el blog
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  slug: string;
  category: string;
}

// Tipos para formularios
export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  passengers: number;
  message?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
