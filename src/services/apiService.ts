import type {
  User, AppUser, Product, Asset, Category, Fornecedor, LogEntry,
  ProductFormData, AddUserFormData, EditUserFormData, LogEntryActionType,
} from '../../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface ApiErrorData { success: false; message: string; error?: any; }
interface ApiSuccessData<T> {
  success: true;
  data: T;
  token?: string;
  message?: string;
  requiresPasswordChange?: boolean,
  userId?: number
}
type ApiResponse<T> = ApiSuccessData<T> | ApiErrorData;

const getAuthToken = (): string | null => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    try {
      const parsedUser: { token?: string } = JSON.parse(storedUser);
      return parsedUser.token || null;
    } catch { return null; }
  }
  return null;
};

const request = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  body?: any,
  isPublic: boolean = false
): Promise<ApiSuccessData<any>> => {
  const endpointPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const token = getAuthToken();

  if (!isPublic && token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (!isPublic && !token && !endpoint.startsWith('/auth/login')) {
    if (!endpoint.startsWith('/users/force-change-password')) {
      throw new Error('Não autorizado, nenhum token fornecido.');
    }
  }

  const config: RequestInit = { method, headers };
  if (body) { config.body = JSON.stringify(body); }

  try {
    const response = await fetch(`${API_BASE_URL}${endpointPath}`, config);
    const data: any = await response.json();

    if (!response.ok || data.success === false) {
      const errorMessage = data?.message || `Erro na API: ${response.status}`;
      throw new Error(errorMessage);
    }

    const responseData = data.data ? data : { ...data, data: data };
    return { success: true, ...responseData };

  } catch (error) {
    if (error instanceof Error) { throw error; }
    throw new Error(`Erro de comunicação com o servidor.`);
  }
};

// --- Auth ---
export const login = async (email: string, password_param: string): Promise<ApiSuccessData<{ token?: string, user?: AppUser, userId?: number, requiresPasswordChange?: boolean }>> => {
  const response = await request<any>(`/auth/login`, 'POST', { email, password: password_param }, true);

  return {
      success: true,
      data: {
          token: response.token,
          user: response.user,
          userId: response.userId,
          requiresPasswordChange: response.requiresPasswordChange
      }
  };
};

// --- Users ---
export const registerUser = async (userData: AddUserFormData & { forcePasswordChange: boolean }): Promise<ApiSuccessData<AppUser>> => {
  const backendUserData = {
    name: userData.name,
    email: userData.email,
    password: userData.password_param,
    role: userData.role,
    force_password_change: userData.forcePasswordChange
  };
  return request<AppUser>('/auth/register', 'POST', backendUserData, false);
};
export const fetchUsers = async (): Promise<ApiSuccessData<AppUser[]>> => request<AppUser[]>(`/users`, 'GET');
export const updateUser = async (userId: string, userData: EditUserFormData): Promise<ApiSuccessData<AppUser>> => request<AppUser>(`/users/${userId}`, 'PUT', userData);
export const deleteUser = async (userId: string): Promise<ApiSuccessData<null>> => request<null>(`/users/${userId}`, 'DELETE');
export const forceChangePassword = async (userId: string, newPassword_param: string): Promise<ApiSuccessData<null>> => {
  return request<null>('/users/force-change-password', 'POST', { userId, newPassword: newPassword_param }, true);
};

// --- Products ---
export const fetchProducts = async (): Promise<ApiSuccessData<Product[]>> => request<Product[]>(`/produtos`, 'GET');
export const createProduct = async (productData: Omit<ProductFormData, 'price'> & { empresa: string }): Promise<ApiSuccessData<Product>> => request<Product>('/produtos', 'POST', productData);
export const updateProductQuantity = async (productId: string, amountChange: number, details: any): Promise<ApiSuccessData<Product>> => request<Product>(`/produtos/${productId}/quantity`, 'PATCH', { amountChange, details });
export const deleteProduct = async (productId: string): Promise<ApiSuccessData<null>> => request<null>(`/produtos/${productId}`, 'DELETE');

// --- Assets ---
export const fetchAssets = async (): Promise<ApiSuccessData<Asset[]>> => request<Asset[]>(`/assets`, 'GET');
export const deleteAsset = async (assetId: string): Promise<ApiSuccessData<null>> => request<null>(`/assets/${assetId}`, 'DELETE');
export const importAssetsCSV = async (file: File): Promise<ApiSuccessData<{ successfullyAdded: number; successfullyUpdated: number; errors: string[] }>> => {
  const formData = new FormData();
  formData.append('file', file);

  const token = getAuthToken();
  if (!token) {
    throw new Error('Não autorizado, nenhum token fornecido.');
  }

  const response = await fetch(`${API_BASE_URL}/assets/import`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Erro ao importar o arquivo.');
  }

  return data;
};

// --- Categories ---
export const fetchCategories = async (): Promise<ApiSuccessData<Category[]>> => request<Category[]>('/categorias', 'GET');
export const createCategory = async (data: { name: string, description?: string }): Promise<ApiSuccessData<Category>> => request<Category>('/categorias', 'POST', data);
export const updateCategory = async (id: string, data: { name: string, description?: string }): Promise<ApiSuccessData<Category>> => request<Category>(`/categorias/${id}`, 'PUT', data);
export const deleteCategory = async (id: string): Promise<ApiSuccessData<null>> => request<null>(`/categorias/${id}`, 'DELETE');

// --- Fornecedores ---
export const fetchFornecedores = async (): Promise<ApiSuccessData<Fornecedor[]>> => request<Fornecedor[]>('/fornecedores', 'GET');
export const createFornecedor = async (data: { name: string, contact_info?: string }): Promise<ApiSuccessData<Fornecedor>> => request<Fornecedor>('/fornecedores', 'POST', data);
export const updateFornecedor = async (id: string, data: { name: string, contact_info?: string }): Promise<ApiSuccessData<Fornecedor>> => request<Fornecedor>(`/fornecedores/${id}`, 'PUT', data);
export const deleteFornecedor = async (id: string): Promise<ApiSuccessData<null>> => request<null>(`/fornecedores/${id}`, 'DELETE');

// --- Logs ---
export const fetchLogs = async (): Promise<ApiSuccessData<LogEntry[]>> => request<LogEntry[]>('/logs', 'GET');
export const createLog = async (logData: { userId: string, username: string, actionType: LogEntryActionType, description: string, details?: Record<string, any> }): Promise<ApiSuccessData<LogEntry>> => {
    return request<LogEntry>('/logs', 'POST', logData);
};

const apiService = {
  login,
  registerUser,
  fetchUsers,
  updateUser,
  deleteUser,
  forceChangePassword,
  fetchProducts,
  createProduct,
  updateProductQuantity,
  deleteProduct, // <-- ADICIONADO
  fetchAssets,
  deleteAsset,
  importAssetsCSV,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchFornecedores,
  createFornecedor,
  updateFornecedor,
  deleteFornecedor,
  fetchLogs,
  createLog,
};

export default apiService;
