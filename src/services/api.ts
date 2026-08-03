import type { AuthResponse, UserData } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('smcpp_token');

  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('smcpp_token');
    localStorage.removeItem('smcpp_user');
    localStorage.removeItem('smcpp_rol');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  // File download blob response
  if (options.headers && (options.headers as any)['Accept'] === 'application/pdf') {
    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, errorText || 'Error al descargar archivo.');
    }
    return (await response.blob()) as unknown as T;
  }

  const contentType = response.headers.get('content-type');
  let data: any = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
      typeof data === 'object' && data?.error
        ? data.error
        : typeof data === 'string'
        ? data
        : `Error HTTP ${response.status}`;
    throw new ApiError(response.status, errorMessage, data);
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: <T>(endpoint: string, body: any) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),

  downloadBlob: async (endpoint: string, filename: string) => {
    const token = localStorage.getItem('smcpp_token');
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    if (!res.ok) {
      throw new ApiError(res.status, 'Error al descargar archivo desde el servidor.');
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
};
