import { ApiError } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class ApiException extends Error {
  constructor(
    public status: number,
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

function getErrorMessage(status: number, defaultMessage?: string): string {
  const messages: Record<number, string> = {
    400: 'Datos inválidos',
    404: 'Recurso no encontrado',
    409: 'Conflicto: el recurso ya existe',
    429: 'Límite de peticiones excedido (2000/día)',
    500: 'Error interno del servidor',
    503: 'Servicio no disponible temporalmente',
  };
  return defaultMessage || messages[status] || `Error ${status}`;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage: string | undefined;

    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorBody.error;
    } catch {
      // Response body is not JSON
    }

    throw new ApiException(
      response.status,
      getErrorMessage(response.status, errorMessage)
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<T>(response);
  },

  post: async <T, B = unknown>(endpoint: string, body?: B): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  put: async <T, B = unknown>(endpoint: string, body?: B): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<T>(response);
  },
};

export { API_URL };
