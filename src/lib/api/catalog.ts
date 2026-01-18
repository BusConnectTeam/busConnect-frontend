import {
  Municipality,
  Province,
  RouteResult,
  CalculateRouteRequest,
} from '@/types';
import { apiClient } from './client';

const BASE_PATH = '/api/routes';

export interface CacheStats {
  size: number;
  hitRate: number;
  missRate: number;
}

export interface RateLimitStats {
  remaining: number;
  limit: number;
  resetAt: string;
}

export const catalogApi = {
  // ============================================
  // MUNICIPIOS
  // ============================================

  /**
   * Obtener todos los municipios de Catalunya (947)
   */
  getAllMunicipalities: (): Promise<Municipality[]> => {
    return apiClient.get<Municipality[]>(`${BASE_PATH}/municipalities`);
  },

  /**
   * Buscar municipios por nombre (máximo 5 resultados)
   */
  searchMunicipalities: (name: string): Promise<Municipality[]> => {
    return apiClient.get<Municipality[]>(
      `${BASE_PATH}/municipalities/search?name=${encodeURIComponent(name)}`
    );
  },

  /**
   * Obtener municipios por provincia
   */
  getMunicipalitiesByProvince: (province: Province): Promise<Municipality[]> => {
    return apiClient.get<Municipality[]>(`${BASE_PATH}/municipalities/${province}`);
  },

  // ============================================
  // CÁLCULO DE RUTAS
  // ============================================

  /**
   * Calcular ruta entre dos municipios
   * @param data - Origen, destino y opcionalmente forzar recálculo
   */
  calculateRoute: (data: CalculateRouteRequest): Promise<RouteResult> => {
    return apiClient.post<RouteResult, CalculateRouteRequest>(
      `${BASE_PATH}/calculate`,
      data
    );
  },

  // ============================================
  // ESTADÍSTICAS Y HEALTH
  // ============================================

  /**
   * Verificar estado del servicio
   */
  healthCheck: (): Promise<{ status: string }> => {
    return apiClient.get<{ status: string }>(`${BASE_PATH}/health`);
  },

  /**
   * Obtener estadísticas del rate limit (2000 llamadas/día)
   */
  getRateLimitStats: (): Promise<RateLimitStats> => {
    return apiClient.get<RateLimitStats>(`${BASE_PATH}/rate-limit-stats`);
  },

  /**
   * Obtener estadísticas de caché
   */
  getCacheStats: (): Promise<CacheStats> => {
    return apiClient.get<CacheStats>(`${BASE_PATH}/cache-stats`);
  },
};
