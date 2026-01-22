import { BusCompany, BusCompanyStats } from '@/types';
import { apiClient } from './client';

const BASE_PATH = '/api/companies';

export const companiesApi = {
  /**
   * Obtener todas las empresas
   */
  getAll: (): Promise<BusCompany[]> => {
    return apiClient.get<BusCompany[]>(BASE_PATH);
  },

  /**
   * Obtener empresa por ID
   */
  getById: (id: number): Promise<BusCompany> => {
    return apiClient.get<BusCompany>(`${BASE_PATH}/${id}`);
  },

  /**
   * Buscar empresas por nombre
   */
  searchByName: (name: string): Promise<BusCompany[]> => {
    return apiClient.get<BusCompany[]>(`${BASE_PATH}/search?name=${encodeURIComponent(name)}`);
  },

  /**
   * Filtrar empresas por ciudad
   */
  getByCity: (city: string): Promise<BusCompany[]> => {
    return apiClient.get<BusCompany[]>(`${BASE_PATH}/city/${encodeURIComponent(city)}`);
  },

  /**
   * Obtener estadísticas de una empresa (buses y conductores)
   */
  getStats: (id: number): Promise<BusCompanyStats> => {
    return apiClient.get<BusCompanyStats>(`${BASE_PATH}/${id}/stats`);
  },
};
