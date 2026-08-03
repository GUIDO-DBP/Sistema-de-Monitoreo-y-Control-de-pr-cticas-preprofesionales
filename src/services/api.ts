const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown> | FormData;
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem('smcpp_token');
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let bodyData: BodyInit | undefined;
  if (options.body) {
    if (options.body instanceof FormData) {
      bodyData = options.body;
    } else {
      headers['Content-Type'] = 'application/json';
      bodyData = JSON.stringify(options.body);
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body: bodyData,
  });

  let jsonResponse: any = null;
  try {
    jsonResponse = await response.json();
  } catch {
    jsonResponse = null;
  }

  if (!response.ok) {
    const errorMessage = jsonResponse?.error || `Error HTTP ${response.status}`;
    const errorCode = jsonResponse?.code;
    const errorDetails = jsonResponse?.details;

    if (response.status === 401) {
      // Clear invalid/expired session
      localStorage.removeItem('smcpp_token');
      localStorage.removeItem('smcpp_user');
      localStorage.removeItem('smcpp_rol');

      // Redirect to login if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    throw new ApiError(response.status, errorMessage, errorCode, errorDetails);
  }

  return (jsonResponse?.data !== undefined ? jsonResponse.data : jsonResponse) as T;
}

// Helpers
export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: Record<string, unknown> | FormData, options?: RequestOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: Record<string, unknown> | FormData, options?: RequestOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: Record<string, unknown> | FormData, options?: RequestOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};
