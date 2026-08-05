
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
  const token = sessionStorage.getItem('smcpp_token') || localStorage.getItem('smcpp_token');
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 80 seconds timeout for Render cold start handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 80000);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.status === 401) {
      sessionStorage.removeItem('smcpp_token');
      sessionStorage.removeItem('smcpp_user');
      sessionStorage.removeItem('smcpp_rol');
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
  const unwrapped =
    rawData !== null &&
    typeof rawData === 'object' &&
    !Array.isArray(rawData) &&
    Object.keys(rawData).length === 1 &&
    'data' in rawData
      ? rawData.data
      : rawData;

  return unwrapped as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new ApiError(504, 'El servidor está tardando en responder. Es posible que esté iniciando (Render Free Cold Start). Por favor intenta de nuevo.');
    }
    if (err instanceof ApiError) throw err;
    throw new ApiError(0, err.message || 'Error de conexión con el servidor. Verifica tu internet.');
  }
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
