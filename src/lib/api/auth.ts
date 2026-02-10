import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types';
import { apiClient } from './client';

const BASE_PATH = '/api/users/auth';

export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse, LoginRequest>(`${BASE_PATH}/login`, data);
  },

  register: (data: RegisterRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse, RegisterRequest>(`${BASE_PATH}/register`, data);
  },

  getMe: (): Promise<User> => {
    return apiClient.get<User>('/api/users/me');
  },
};
