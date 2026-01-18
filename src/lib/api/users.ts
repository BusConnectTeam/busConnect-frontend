import { User, CreateUserRequest, UpdateUserRequest } from '@/types';
import { apiClient } from './client';

const BASE_PATH = '/api/users';

export const usersApi = {
  /**
   * Obtener todos los usuarios activos
   */
  getAll: (): Promise<User[]> => {
    return apiClient.get<User[]>(BASE_PATH);
  },

  /**
   * Obtener un usuario por ID
   */
  getById: (id: number): Promise<User> => {
    return apiClient.get<User>(`${BASE_PATH}/${id}`);
  },

  /**
   * Obtener un usuario por email
   */
  getByEmail: (email: string): Promise<User> => {
    return apiClient.get<User>(`${BASE_PATH}/email/${encodeURIComponent(email)}`);
  },

  /**
   * Crear un nuevo usuario
   */
  create: (data: CreateUserRequest): Promise<User> => {
    return apiClient.post<User, CreateUserRequest>(BASE_PATH, data);
  },

  /**
   * Actualizar un usuario existente
   */
  update: (id: number, data: UpdateUserRequest): Promise<User> => {
    return apiClient.put<User, UpdateUserRequest>(`${BASE_PATH}/${id}`, data);
  },

  /**
   * Soft delete (desactivar usuario)
   */
  delete: (id: number): Promise<void> => {
    return apiClient.delete<void>(`${BASE_PATH}/${id}`);
  },

  /**
   * Restaurar un usuario desactivado
   */
  restore: (id: number): Promise<User> => {
    return apiClient.post<User>(`${BASE_PATH}/${id}/restore`);
  },

  /**
   * Eliminar permanentemente un usuario
   */
  deletePermanent: (id: number): Promise<void> => {
    return apiClient.delete<void>(`${BASE_PATH}/${id}/permanent`);
  },
};
