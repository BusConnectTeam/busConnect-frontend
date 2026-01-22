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

// ============================================
// TIPOS DEL BACKEND API
// ============================================

// User Service Types
export type UserRole = 'CUSTOMER' | 'COMPANY' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
}

// Catalog Service Types
export type Province = 'Barcelona' | 'Girona' | 'Lleida' | 'Tarragona';

export interface Municipality {
  id: string;
  name: string;
  normalizedName: string;
  province: Province;
  latitude: number;
  longitude: number;
  postalCodes: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type RouteSource = 'openroute' | 'cache' | 'fallback' | 'error';

export interface RouteResult {
  origin: string;
  destination: string;
  distanceKm: number;
  durationMinutes: number;
  source: RouteSource;
  success: boolean;
  errorMessage: string | null;
  calculatedAt: string;
}

export interface CalculateRouteRequest {
  originMunicipality: string;
  destinationMunicipality: string;
  forceRefresh?: boolean;
}

// API Error Types
export interface ApiError {
  status: number;
  message: string;
  timestamp?: string;
}

// API Response wrapper (for paginated or meta responses if needed)
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: ApiError;
}

// ============================================
// COMPANY SERVICE TYPES
// ============================================

// Bus Company
export interface BusCompany {
  id: number;
  name: string;
  legalName: string;
  taxId: string;
  email: string;
  phone: string;
  website: string | null;
  logoUrl: string | null;
  description: string | null;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  foundedYear: number | null;
  active: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BusCompanyStats {
  company: BusCompany;
  totalBuses: number;
  totalDrivers: number;
}

// Bus Type (from backend - different from frontend BusType)
export type SeatType = 'standard' | 'premium' | 'vip' | 'sleeper';

export interface BusTypeEntity {
  id: number;
  companyId: number;
  name: string;
  description: string | null;
  capacity: number;
  seatType: SeatType;
  hasWifi: boolean;
  hasAirConditioning: boolean;
  hasToilet: boolean;
  hasUSBChargers: boolean;
  hasEntertainment: boolean;
  luggageCapacityKg: number;
  imageUrl: string | null;
  pricePerKm: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BusTypeFilters {
  minCapacity?: number;
  maxCapacity?: number;
  seatType?: SeatType;
  hasWifi?: boolean;
  hasAirConditioning?: boolean;
  hasToilet?: boolean;
}

// Driver
export interface Driver {
  id: number;
  companyId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  dateOfBirth: string;
  hireDate: string;
  yearsExperience: number;
  languages: string[];
  photoUrl: string | null;
  rating: number;
  totalTrips: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DriverFilters {
  minExperience?: number;
  language?: string;
  name?: string;
}
