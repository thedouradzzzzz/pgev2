
import type { NavItem } from './types';
import { HomeIcon, UsersIcon, ArchiveBoxIcon, DocumentPlusIcon, WrenchScrewdriverIcon, DocumentTextIcon, ClipboardDocumentListIcon, ChartBarIcon, CogIcon, TagIcon } from './components/icons/Icons';
import { AssetStatus, DescriptorStatus, Company } from './types';

export const DEFAULT_ADMIN_EMAIL = "admin@system.dev"; // Changed from USERNAME to EMAIL
export const DEFAULT_ADMIN_PASSWORD = "12@Sup34*";

// Updated to full SVG logo for Catarinense Pharma
export const CATARINENSE_PHARMA_HEADER_LOGO_URL = "https://catarinensepharma.com.br/wp-content/themes/catarinense/assets/images/logo-footer.png.webp";
export const ABPLAST_HEADER_LOGO_URL = "https://storage.googleapis.com/ecdt-logo-saida/68edc61f568891f248c32b0f17b9575d3bf8f68e183ea68ba311e34f0d210336/AB-PLAST-MANUFATURADOS-PLASTICOS-LTDA.webp";
// CATARINENSE_PHARMA_LOGIN_LOGO_URL is removed as it's no longer used.


export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
  { name: "Gerenciamento de Usuários", path: "/dashboard/users", icon: UsersIcon, adminOnly: true },
  { name: "Buscar Produto", path: "/dashboard/products/search", icon: ArchiveBoxIcon },
  { name: "Cadastrar Produto", path: "/dashboard/products/add", icon: DocumentPlusIcon, adminOnly: true },
  { name: "Gerenciar Ativos", path: "/dashboard/assets", icon: WrenchScrewdriverIcon },
  { name: "Gerenciador de Descritivos", path: "/dashboard/descriptors", icon: DocumentTextIcon, adminOnly: true },
  { name: "Tipos de Produto", path: "/dashboard/product-types", icon: TagIcon, adminOnly: true },
  { name: "Logs de Movimentações", path: "/dashboard/logs", icon: ClipboardDocumentListIcon },
  { name: "Relatórios", path: "/dashboard/reports", icon: ChartBarIcon },
  { name: "Administração", path: "/dashboard/admin", icon: CogIcon, adminOnly: true },
];

// PRODUCT_TYPES_ARRAY is removed as it will be managed in App.tsx state

export const ASSET_STATUS_OPTIONS = [
  { value: AssetStatus.AVAILABLE, label: 'Disponível' },
  { value: AssetStatus.IN_USE, label: 'Em uso' },
  { value: AssetStatus.MAINTENANCE, label: 'Manutenção' },
];

export const DESCRIPTOR_STATUS_OPTIONS = [
  { value: DescriptorStatus.ACTIVE, label: 'Ativo' },
  { value: DescriptorStatus.INACTIVE, label: 'Inativo' },
];

export const COMPANY_OPTIONS = [
  { value: Company.CATARINENSE, label: 'Catarinense Pharma' },
  { value: Company.ABPLAST, label: 'ABPlast' },
  { value: Company.CATARINENSE_FILIAL, label: 'Catarinense Pharma Filial' },
];