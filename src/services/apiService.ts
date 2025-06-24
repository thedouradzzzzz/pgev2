import type {
  User,
  AppUser,
  Product,
  AddUserFormData,
} from '../../types';

const API_BASE_URL = '/api';

interface ApiErrorData { success: false; message: string; error?: any; }
interface ApiSuccessData<T> { success: true; data: T; token?: string; message?: string; }
type ApiResponse<T> = ApiSuccessData<T> | ApiErrorData;

const getAuthToken = (): string | null => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    try {
      const parsedUser: User = JSON.parse(storedUser);
      return parsedUser.token || null;
    } catch { return null; }
  }
  return null;
};

const request = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: any,
  isPublic: boolean = false
): Promise<ApiSuccessData<T>> => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const token = getAuthToken();

  if (!isPublic && token) {
    headers['Authorization'] = token;
  } else if (!isPublic && !token && !endpoint.startsWith('/auth/login')) {
    throw new Error('Não autorizado. Token não encontrado ou inválido.');
  }

  const config: RequestInit = { method, headers };
  if (body) { config.body = JSON.stringify(body); }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data: any = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || `Erro na API: ${response.status}`);
    }
    return { success: true, data: data.data || data, token: data.token, message: data.message };
  } catch (error) {
    if (error instanceof Error) { throw error; }
    throw new Error(`Erro de comunicação com o servidor.`);
  }
};

export const login = async (email: string, password_param: string): Promise<ApiSuccessData<{ token: string, user: AppUser }>> => {
  return request<{ token: string, user: AppUser }>(`/auth/login`, 'POST', { email, password: password_param }, true);
};

export const registerUser = async (userData: AddUserFormData): Promise<ApiSuccessData<AppUser>> => {
  const backendUserData = { name: userData.name, email: userData.email, password: userData.password_param, role: userData.role };
  return request<AppUser>(`/auth/register`, 'POST', backendUserData, true);
};

export const fetchUsers = async (): Promise<ApiSuccessData<AppUser[]>> => {
    return request<AppUser[]>(`/users`, 'GET');
};

export const fetchProducts = async (): Promise<ApiSuccessData<Product[]>> => {
    return request<Product[]>(`/produtos`, 'GET', undefined, true);
};

const apiService = {
  login,
  registerUser,
  fetchUsers,
  fetchProducts,
};

export default apiService;
