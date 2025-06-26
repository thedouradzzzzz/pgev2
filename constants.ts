import {
  HomeIcon,
  UsersIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  WrenchScrewdriverIcon, // Ícone original de ativos
  CogIcon,               // Ícone original de categorias
  DocumentTextIcon,      // Ícone original de logs
  ChartBarIcon,
} from './components/icons/Icons';

export const SIDEBAR_NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: HomeIcon, adminOnly: false },
  { name: 'Gerenciamento de Usuários', path: '/dashboard/users', icon: UsersIcon, adminOnly: true },
  { name: 'Buscar Produto', path: '/dashboard/products/search', icon: MagnifyingGlassIcon, adminOnly: false },
  { name: 'Cadastrar Produto', path: '/dashboard/products/add', icon: PlusCircleIcon, adminOnly: true },
  { name: 'Gerenciar Ativos', path: '/dashboard/assets', icon: WrenchScrewdriverIcon, adminOnly: false },
  { name: 'Gerenciar Categorias', path: '/dashboard/product-types', icon: CogIcon, adminOnly: true }, // NOME E ÍCONE ORIGINAIS
  { name: 'Logs de Movimentações', path: '/dashboard/logs', icon: DocumentTextIcon, adminOnly: false },
  { name: 'Relatórios', path: '/dashboard/reports', icon: ChartBarIcon, adminOnly: false },
];

export const CATARINENSE_PHARMA_HEADER_LOGO_URL = 'https://www.catarinensepharma.com.br/wp-content/themes/catarinense/assets/images/logo-footer.png.webp';
export const ABPLAST_HEADER_LOGO_URL = 'https://abplast.com.br/wp-content/uploads/2025/03/Mask-group.svg';

