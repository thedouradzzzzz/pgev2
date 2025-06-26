export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
  token: string;
}

export interface AppUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at?: string;
  force_password_change?: boolean;
}

export interface AddUserFormData {
  name: string;
  email: string;
  password_param: string;
  confirmPassword_param: string;
  role: 'Administrador' | 'Usuário';
}

export interface EditUserFormData {
  name: string;
  email: string;
  role: 'admin' | 'user';
  forcePasswordChange?: boolean;
}

export interface ResetPasswordFormData {
    newPassword_param: string;
    confirmPassword_param: string;
}

export interface ForgotPasswordFormData {
    email: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  categoryName?: string;
  fornecedorName?: string;
  barcode?: string;
  empresa: 'ABPlast' | 'Catarinense Matriz' | 'Catarinense Filial';
}

export interface ProductFormData {
    name: string;
    barcode: string;
    description: string;
    empresa: string;
    categoria_id: string;
    fornecedor_id?: string;
}

export interface AddQuantityFormData {
    productId: string;
    quantity: number;
    purchaseOrderNumber?: string;
}

export interface SubtractQuantityFormData {
    productId: string;
    quantity: number;
    destinationAsset?: string;
}

export interface Asset {
  id: string;
  nome: string;
  qrCodeValue: string;
  descricao?: string;
  responsavel_id?: string;
  assignedToUsername?: string;
  localizacao?: string;
  purchaseDate?: Date;
  fabricante?: string;
  numero_serie?: string;
  modelo?: string;
}

export interface AssetFormData {
  name: string;
  description?: string;
  assignedToUserId?: string;
  location?: string;
}

export interface Descriptor {
  id: string;
  name: string;
  fields: { [key: string]: string | number | boolean };
}

export interface DescriptorFormData {
    name: string;
}

export enum LogEntryActionType {
  USER_LOGIN_SUCCESS = 'Login bem-sucedido',
  USER_LOGIN_FAIL = 'Falha no Login',
  USER_LOGOUT = 'Logout',
  USER_CREATED = 'Usuário Criado',
  USER_UPDATED = 'Usuário Atualizado',
  USER_DELETED = 'Usuário Deletado',
  USER_CREATE_FAIL = 'Falha ao Criar Usuário',
  PRODUCT_CREATED = 'Produto Criado',
  PRODUCT_DELETED = 'Produto Deletado', // <-- ADICIONADO
  INVENTORY_UPDATED = 'Estoque Atualizado',
  ASSET_CREATED = 'Ativo Criado',
  ASSET_UPDATED = 'Ativo Atualizado',
  ASSET_DELETED = 'Ativo Deletado',
  ASSET_IMPORT = 'Importação de Ativos',
  CATEGORY_CREATED = 'Categoria Criada',
  CATEGORY_DELETED = 'Categoria Deletada',
  FORNECEDOR_CREATED = 'Fornecedor Criado',
  FORNECEDOR_DELETED = 'Fornecedor Deletado',
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  username: string;
  actionType: LogEntryActionType;
  description: string;
  details?: any;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Fornecedor {
  id: string;
  name: string;
  contact_info?: string;
}

export enum Company {
  CATARINENSE = 'Catarinense Pharma',
  ABPLAST = 'ABPlast',
  CATARINENSE_FILIAL = 'Catarinense Filial',
  OUTRO = "Outro"
}
