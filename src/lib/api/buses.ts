import { BusTypeEntity, BusTypeFilters, SeatType } from '@/types';
import { apiClient } from './client';

const BASE_PATH = '/api/companies/buses';

function buildQueryString(filters: BusTypeFilters): string {
  const params = new URLSearchParams();

  if (filters.minCapacity !== undefined) {
    params.append('minCapacity', filters.minCapacity.toString());
  }
  if (filters.maxCapacity !== undefined) {
    params.append('maxCapacity', filters.maxCapacity.toString());
  }
  if (filters.seatType) {
    params.append('seatType', filters.seatType);
  }
  if (filters.hasWifi !== undefined) {
    params.append('hasWifi', filters.hasWifi.toString());
  }
  if (filters.hasAirConditioning !== undefined) {
    params.append('hasAirConditioning', filters.hasAirConditioning.toString());
  }
  if (filters.hasToilet !== undefined) {
    params.append('hasToilet', filters.hasToilet.toString());
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

export const busesApi = {
  /**
   * Obtener todos los buses
   */
  getAll: (filters?: BusTypeFilters): Promise<BusTypeEntity[]> => {
    const query = filters ? buildQueryString(filters) : '';
    return apiClient.get<BusTypeEntity[]>(`${BASE_PATH}${query}`);
  },

  /**
   * Obtener bus por ID
   */
  getById: (id: number): Promise<BusTypeEntity> => {
    return apiClient.get<BusTypeEntity>(`${BASE_PATH}/${id}`);
  },

  /**
   * Obtener buses de una empresa específica
   */
  getByCompany: (companyId: number): Promise<BusTypeEntity[]> => {
    return apiClient.get<BusTypeEntity[]>(`/api/companies/${companyId}/buses`);
  },

  /**
   * Obtener buses por tipo de asiento
   */
  getBySeatType: (seatType: SeatType): Promise<BusTypeEntity[]> => {
    return apiClient.get<BusTypeEntity[]>(`${BASE_PATH}/seat-type/${seatType}`);
  },
};
