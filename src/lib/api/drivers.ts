import { Driver } from '@/types';
import { apiClient } from './client';

const BASE_PATH = '/api/companies/drivers';

export const driversApi = {
  /**
   * Obtener todos los conductores
   */
  getAll: (): Promise<Driver[]> => {
    return apiClient.get<Driver[]>(BASE_PATH);
  },

  /**
   * Obtener conductor por ID
   */
  getById: (id: number): Promise<Driver> => {
    return apiClient.get<Driver>(`${BASE_PATH}/${id}`);
  },

  /**
   * Obtener conductores de una empresa específica
   */
  getByCompany: (companyId: number): Promise<Driver[]> => {
    return apiClient.get<Driver[]>(`/api/companies/${companyId}/drivers`);
  },

  /**
   * Buscar conductores por nombre
   */
  searchByName: (name: string): Promise<Driver[]> => {
    return apiClient.get<Driver[]>(`${BASE_PATH}/search?name=${encodeURIComponent(name)}`);
  },

  /**
   * Obtener conductores por idioma
   */
  getByLanguage: (language: string): Promise<Driver[]> => {
    return apiClient.get<Driver[]>(`${BASE_PATH}/language/${encodeURIComponent(language)}`);
  },

  /**
   * Obtener conductores por experiencia mínima
   */
  getByMinExperience: (years: number): Promise<Driver[]> => {
    return apiClient.get<Driver[]>(`${BASE_PATH}/experience/${years}`);
  },
};
