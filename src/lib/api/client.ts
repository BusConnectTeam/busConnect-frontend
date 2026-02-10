
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const TOKEN_KEY = 'busconnect_auth_token';

const PUBLIC_ENDPOINTS = [
  '/api/users/auth/login',
  '/api/users/auth/register',
];

function isPublicEndpoint(endpoint: string): boolean {
  return PUBLIC_ENDPOINTS.some((pub) => endpoint.startsWith(pub));
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function getHeaders(endpoint: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (!isPublicEndpoint(endpoint)) {
    const token = getStoredToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

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
    401: 'Credenciales inválidas o sesión expirada',
    404: 'Recurso no encontrado',
    409: 'Conflicto: el recurso ya existe',
    429: 'Límite de peticiones excedido (2000/día)',
    500: 'Error interno del servidor',
    503: 'Servicio no disponible temporalmente',
  };
  return defaultMessage || messages[status] || `Error ${status}`;
}

/**
 * Convierte mensajes de error técnicos en mensajes amigables para el usuario
 */
export function getFriendlyErrorMessage(error: unknown): string {
  // Si es un error de ApiException
  if (error instanceof ApiException) {
    const errorMsg = error.message.toLowerCase();
    
    // Errores relacionados con rutas/OpenRouteService
    if (errorMsg.includes('openrouteservice') || errorMsg.includes('404') || errorMsg.includes('not found')) {
      return 'No se pudo calcular la ruta entre estos municipios. Por favor, intenta con otra ubicación.';
    }
    
    // Límite de peticiones
    if (error.status === 429 || errorMsg.includes('rate limit') || errorMsg.includes('límite')) {
      return 'Has realizado demasiadas búsquedas. Por favor, espera unos minutos e intenta nuevamente.';
    }
    
    // Errores de red
    if (error.status === 503 || errorMsg.includes('no disponible')) {
      return 'El servicio no está disponible en este momento. Por favor, intenta más tarde.';
    }
    
    // Error de servidor
    if (error.status >= 500) {
      return 'Ocurrió un error en el servidor. Por favor, intenta nuevamente más tarde.';
    }
  }
  
  // Error genérico de red
  if (error instanceof Error) {
    if (error.message.toLowerCase().includes('fetch') || error.message.toLowerCase().includes('network')) {
      return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    }
  }
  
  // Mensaje por defecto
  return 'No se pudo completar la búsqueda. Por favor, intenta nuevamente.';
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      removeStoredToken();
      localStorage.removeItem('busconnect_current_user');
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }

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
      headers: getHeaders(endpoint),
    });
    return handleResponse<T>(response);
  },

  post: async <T, B = unknown>(endpoint: string, body?: B): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(endpoint),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  put: async <T, B = unknown>(endpoint: string, body?: B): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(endpoint),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(endpoint),
    });
    return handleResponse<T>(response);
  },
};

export { API_URL };

