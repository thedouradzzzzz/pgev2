import {
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  ChartBarIcon,
  // Novos ícones importados
  UserGroupIcon,
  ComputerDesktopIcon,
  ClipboardDocumentListIcon,
  Cog8ToothIcon,
} from './components/icons/Icons';

export const SIDEBAR_NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: HomeIcon, adminOnly: false },
  // Ícone e Nome atualizados
  { name: 'Gerenciamento de Usuários', path: '/dashboard/users', icon: UserGroupIcon, adminOnly: true },
  { name: 'Buscar Produto', path: '/dashboard/products/search', icon: MagnifyingGlassIcon, adminOnly: false },
  { name: 'Cadastrar Produto', path: '/dashboard/products/add', icon: PlusCircleIcon, adminOnly: true },
  // Ícone atualizado
  { name: 'Gerenciar Ativos', path: '/dashboard/assets', icon: ComputerDesktopIcon, adminOnly: false },
  // Ícone e Nome atualizados
  { name: 'Gerenciar Cadastros', path: '/dashboard/product-types', icon: ClipboardDocumentListIcon, adminOnly: true },
  // Ícone atualizado
  { name: 'Logs de Movimentações', path: '/dashboard/logs', icon: DocumentTextIcon, adminOnly: false },
  { name: 'Relatórios', path: '/dashboard/reports', icon: ChartBarIcon, adminOnly: false },
  // Adicionando link para o Painel Administrativo, se aplicável
  { name: 'Administração', path: '/dashboard/admin', icon: Cog8ToothIcon, adminOnly: true },
];

export const CATARINENSE_PHARMA_HEADER_LOGO_URL = 'https://www.catarinensepharma.com.br/wp-content/themes/catarinense/assets/images/logo-footer.png.webp';
// URL CORRIGIDA
export const ABPLAST_HEADER_LOGO_URL = 'https://storage.googleapis.com/ecdt-logo-saida/68edc61f568891f248c32b0f17b9575d3bf8f68e183ea68ba311e34f0d210336/AB-PLAST-MANUFATURADOS-PLASTICOS-LTDA.webp';
