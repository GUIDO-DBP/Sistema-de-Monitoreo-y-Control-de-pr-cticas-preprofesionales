
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
  let rawData: any = null;
  if (contentType && contentType.includes('application/json')) {
    rawData = await response.json();
  } else {
    rawData = await response.text();
  }

  if (!response.ok) {
    // Read backend error from { error } or { message } fields
    const errorMessage =
      typeof rawData === 'object' && rawData !== null
        ? rawData.error || rawData.message || rawData.msg || `Error HTTP ${response.status}`
        : typeof rawData === 'string'
        ? rawData
        : `Error HTTP ${response.status}`;
    throw new ApiError(response.status, errorMessage, rawData);
  }

  // Auto-unwrap { data: ... } envelope when the ONLY key is "data".
  // Controllers that respond directly (arrays, plain objects without the envelope)
  // are passed through untouched.
  const unwrapped =
    rawData !== null &&
    typeof rawData === 'object' &&
    !Array.isArray(rawData) &&
    Object.keys(rawData).length === 1 &&
    'data' in rawData
      ? rawData.data
      : rawData;

  return unwrapped as T;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { method: 'GET', ...options }),
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
