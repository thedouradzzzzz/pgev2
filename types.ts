// Frontend User (currentUser state) - Aligned with token and /api/auth/me
export interface User {
  id: string; // from backend _id
  username: string; // from backend nome
  isAdmin: boolean; // derived from backend cargo === 'Gerente'
  token?: string; // JWT token
  // forcePasswordChange flag is removed as backend doesn't support this direct mechanism.
  // Password reset is handled via forgot/reset password flow.
}

// Backend User structure (for user management lists and /api/auth/me)
export interface AppUser {
  id: string; // from backend _id
  name: string; // from backend nome
  email: string; // from backend email
  role: 'Gerente' | 'Funcionário'; // from backend cargo
  // resetPasswordToken and resetPasswordExpire are backend internal, not usually sent to frontend directly in full listings.
}

export interface NavItem {
  name:string;
  path: string;
  icon?: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode; 
  adminOnly?: boolean;
}

// Corresponds to backend Categoria
export interface Category {
  id: string; // from backend _id
  name: string; // from backend nome
  description?: string; // from backend descricao
}

// Corresponds to backend Fornecedor - maps to frontend Company concept
export interface Fornecedor {
  id: string; // from backend _id
  name: string; // from backend nome
  contact?: { name?: string; email?: string; phone?: string }; // from backend contato
  address?: { street?: string; city?: string; state?: string; zip?: string }; // from backend endereco
}

// Enum for frontend Company concept for display consistency in alerts, still useful for UI grouping
export enum Company {
  CATARINENSE = 'Catarinense Pharma',
  ABPLAST = 'ABPlast',
  CATARINENSE_FILIAL = 'Catarinense Pharma Filial', 
  OUTRO = 'Outro Fornecedor', // Fallback
}


// Representa um produto no sistema, aligned with backend Produto
export interface Product {
  id: string; // from backend _id
  name: string; // from backend nome (e.g., "Kingston A400")
  barcode: string; // from backend barcode (unique, sparse)
  description?: string; // from backend descricao
  price: number; // from backend preco
  quantity: number; // from backend quantidade
  categoryId: string; // from backend categoria (ObjectId)
  categoryName?: string; // populated from Categoria.name for display
  fornecedorId?: string | null; // from backend fornecedor (ObjectId)
  fornecedorName?: string; // populated from Fornecedor.name for display
}

// Form data for creating/editing a product (frontend to backend)
export interface ProductFormData {
  name: string; 
  barcode: string;
  description?: string;
  price: number; 
  categoria: string; // ID of the Category
  fornecedor?: string | null; // ID of the Fornecedor
}


// Tipos para gerenciamento de quantidade de produto (EntradaEstoque API payload)
export interface AddQuantityFormData {
  productId: string; 
  quantity: number; 
  priceCost: number; 
}

// Tipos para gerenciamento de quantidade de produto (SaidaEstoque API payload)
export interface SubtractQuantityFormData {
  productId: string; 
  quantity: number; 
  reason: 'Venda' | 'Ajuste' | 'Perda' | 'Outro'; 
}


// Tipos para Modals e Forms de Usuário (Frontend forms)
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export interface AddUserFormData { 
  name: string; 
  email: string; 
  password_param: string; 
  confirmPassword_param: string;
  role: 'Gerente' | 'Funcionário'; 
}

export interface EditUserFormData { 
  name: string;
  email: string;
  role: 'Gerente' | 'Funcionário';
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData { 
  newPassword_param: string; 
  confirmNewPassword_param: string; 
  // token will be part of the URL, not form data for this specific type
}


// --- ASSET AND DESCRIPTOR TYPES - UPDATED for new backend models ---
export interface Asset { // Aligned with new backend Asset.js
  id: string; // from backend _id
  name: string; // from backend nome
  description?: string; // from backend descricao
  responsibleUserId?: string | null; // from backend responsavel (User ObjectId)
  responsibleUserName?: string; // For display, populated on frontend if needed
  location?: string; // from backend localizacao
  // Frontend specific or previously used fields like assetType, serialNumber, brand, model, acquisitionDate, status, qrCodeValue, maintenanceNotes
  // are NOT part of the new backend Asset model. They will be removed from frontend data management.
}

export interface AssetFormData { // Aligned with new backend Asset.js
  name: string;
  description?: string;
  responsavel?: string | null; // Backend expects ObjectId for User
  localizacao?: string;
}

export interface Descriptor { // Aligned with new backend Descriptor.js
  id: string; // from backend _id
  name: string; // from backend nome (unique)
  value: string; // from backend valor
  // Previous extensive fields are NOT part of the new backend Descriptor model.
}

export interface DescriptorFormData { // Aligned with new backend Descriptor.js
  name: string;
  value: string;
}
// --- END OF ASSET AND DESCRIPTOR TYPES ---


export enum LogEntryActionType {
  // User Actions
  USER_LOGIN_SUCCESS = 'Login Bem-Sucedido',
  USER_LOGIN_FAIL = 'Falha no Login',
  USER_LOGOUT = 'Logout de Usuário',
  USER_REGISTERED = 'Usuário Registrado (API)',
  USER_FETCH_ME_SUCCESS = 'Dados do Usuário Carregados (API)',
  USER_UPDATED = 'Usuário Atualizado (API)', 
  USER_DELETED = 'Usuário Excluído (API)', 
  USER_PASSWORD_RESET_REQUEST = 'Solicitação de Reset de Senha (API)', // Forgot Password
  USER_PASSWORD_RESET_SUCCESS = 'Senha Resetada com Sucesso (API)', // Reset Password with token
  USER_PASSWORD_CHANGED_BY_ADMIN = 'Senha Alterada por Admin (API)', // Admin reset a user's password

  // Product/Category/Fornecedor Actions
  PRODUCT_CREATED = 'Produto Criado (API)',
  PRODUCT_UPDATED = 'Produto Atualizado (API)', 
  PRODUCT_DELETED = 'Produto Excluído (API)',
  PRODUCT_QUANTITY_ADD = 'Entrada de Estoque Registrada (API)', 
  PRODUCT_QUANTITY_SUBTRACT = 'Saída de Estoque Registrada (API)', 
  
  CATEGORY_CREATED = 'Categoria Criada (API)', 
  CATEGORY_UPDATED = 'Categoria Atualizada (API)',
  CATEGORY_DELETED = 'Categoria Excluída (API)',
  FORNECEDOR_CREATED = 'Fornecedor Criado (API)', 
  FORNECEDOR_UPDATED = 'Fornecedor Atualizado (API)',
  FORNECEDOR_DELETED = 'Fornecedor Excluído (API)',
  
  // Asset Actions (Now API based)
  ASSET_CREATED = 'Ativo Criado (API)',
  ASSET_UPDATED = 'Ativo Atualizado (API)',
  ASSET_DELETED = 'Ativo Excluído (API)',
  // ASSET_IMPORTED = 'Importação de Ativos via CSV (Local)', // This will be disabled for now

  // Descriptor Actions (Now API based)
  DESCRIPTOR_CREATED = 'Descritivo Criado (API)',
  DESCRIPTOR_UPDATED = 'Descritivo Atualizado (API)',
  DESCRIPTOR_DELETED = 'Descritivo Excluído (API)',
  
  // System Actions
  API_SUCCESS = 'Operação API Bem-Sucedida',
  API_ERROR = 'Erro de API',
  SYSTEM_ERROR = 'Erro no Sistema (Frontend)',
  OTHER = 'Outra Ação',
}

export interface LogEntry {
  id: string; 
  timestamp: Date;
  userId?: string; 
  username: string; 
  actionType: LogEntryActionType;
  description: string; 
  details?: Record<string, any>; 
}

export interface StockMovementLog {
    id: string; 
    product: { _id: string, name: string }; 
    quantity: number;
    user: { _id: string, name: string }; 
    date: string; 
    type: 'Entrada' | 'Saída';
    priceCost?: number; 
    reason?: string; 
    rawDetails: any; 
}

// Old AssetStatus and DescriptorStatus enums, might be removed if not used elsewhere with new models
export enum AssetStatus {
  IN_USE = 'Em uso',
  AVAILABLE = 'Disponível',
  MAINTENANCE = 'Manutenção',
}
export enum DescriptorStatus {
  ACTIVE = 'Ativo',
  INACTIVE = 'Inativo',
}