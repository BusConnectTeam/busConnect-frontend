import { catalogApi } from '@/lib/api';
import { CalculateRouteRequest, Province } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

const MUNICIPALITIES_KEY = ['municipalities'];
const ROUTES_KEY = ['routes'];

export function useMunicipalities() {
  return useQuery({
    queryKey: MUNICIPALITIES_KEY,
    queryFn: catalogApi.getAllMunicipalities,
    staleTime: 1000 * 60 * 60, // 1 hora - no cambian frecuentemente
  });
}

export function useSearchMunicipalities(name: string) {
  return useQuery({
    queryKey: [...MUNICIPALITIES_KEY, 'search', name],
    queryFn: () => catalogApi.searchMunicipalities(name),
    enabled: name.length >= 2, // Solo buscar con 2+ caracteres
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useMunicipalitiesByProvince(province: Province) {
  return useQuery({
    queryKey: [...MUNICIPALITIES_KEY, 'province', province],
    queryFn: () => catalogApi.getMunicipalitiesByProvince(province),
    enabled: !!province,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
}

export function useCalculateRoute() {
  return useMutation({
    mutationFn: (data: CalculateRouteRequest) => catalogApi.calculateRoute(data),
  });
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: catalogApi.healthCheck,
    refetchInterval: 30000, // Cada 30 segundos
  });
}

export function useRateLimitStats() {
  return useQuery({
    queryKey: ['rate-limit'],
    queryFn: catalogApi.getRateLimitStats,
  });
}

export function useCacheStats() {
  return useQuery({
    queryKey: ['cache-stats'],
    queryFn: catalogApi.getCacheStats,
  });
}
