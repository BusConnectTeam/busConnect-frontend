import { authApi } from '@/lib/api';
import { LoginRequest, RegisterRequest } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

const AUTH_KEY = ['auth'];
const ME_KEY = [...AUTH_KEY, 'me'];

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
  });
}

export function useMe(enabled: boolean = true) {
  return useQuery({
    queryKey: ME_KEY,
    queryFn: authApi.getMe,
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
