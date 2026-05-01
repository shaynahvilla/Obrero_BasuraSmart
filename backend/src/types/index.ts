import { Request } from 'express';

export interface User {
  id: string;
  phone_number: string;
  full_name: string;
  email?: string;
  user_type: 'resident' | 'collector';
  address?: string;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface OTPCode {
  id: string;
  phone_number: string;
  code: string;
  expires_at: Date;
  is_used: boolean;
  created_at: Date;
}

export interface Schedule {
  id: string;
  title: string;
  description?: string;
  waste_type: 'biodegradable' | 'non-biodegradable' | 'recyclable';
  collection_date: Date;
  collection_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

export interface Route {
  id: string;
  name: string;
  description?: string;
  collector_id?: string;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

export interface RouteStop {
  id: string;
  route_id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  sequence_number: number;
  status: 'pending' | 'completed' | 'skipped';
  created_at: Date;
  updated_at: Date;
}

export interface Collection {
  id: string;
  route_stop_id: string;
  collector_id?: string;
  resident_id?: string;
  schedule_id?: string;
  collection_time: Date;
  waste_type: 'biodegradable' | 'non-biodegradable' | 'recyclable';
  weight_kg?: number;
  notes?: string;
  status: 'completed' | 'missed' | 'skipped';
  created_at: Date;
}

export interface UserSession {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface LoginRequest {
  phone_number: string;
}

export interface RegisterRequest {
  phone_number: string;
  full_name: string;
  email?: string;
  user_type: 'resident' | 'collector';
  address?: string;
}

export interface OTPRequest {
  phone_number: string;
  code: string;
}

export interface RouteWithStops extends Route {
  stops: RouteStop[];
}

export interface CollectionWithDetails extends Collection {
  route_stop?: RouteStop;
  collector?: User;
  resident?: User;
  schedule?: Schedule;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
