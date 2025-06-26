import React, { useMemo } from 'react';
import type { Product, Asset } from '../../types'; // Importações desatualizadas removidas
import { ArchiveBoxIcon, WrenchScrewdriverIcon, TagIcon, ExclamationTriangleIcon } from '../../components/icons/Icons';

interface ReportsDashboardPageProps {
  products: Product[];
  assets: Asset[];
}

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  colorClass?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, description, colorClass = 'bg-blue-600' }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg flex items-start space-x-4 hover:shadow-xl transition-shadow">
    <div className={`p-3 rounded-full ${colorClass} text-white`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
    </div>
  </div>
);


const ReportsDashboardPage: React.FC<ReportsDashboardPageProps> = ({ products, assets }) => {
  const totalProductStock = useMemo(() => {
    return products.reduce((sum, product) => sum + product.quantity, 0);
  }, [products]);

  const uniqueProductCategories = useMemo(() => {
    const categories = new Set(products.map(p => p.categoryName).filter(Boolean));
    return categories.size;
  }, [products]);

  const totalAssets = useMemo(() => {
    return assets.length;
  }, [assets]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard de Relatórios</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard
          title="Total de Produtos em Estoque"
          value={totalProductStock}
          icon={<ArchiveBoxIcon className="h-6 w-6" />}
          description="Soma das quantidades de todos os produtos."
          colorClass="bg-green-500"
        />
        <KpiCard
          title="Categorias de Produtos Únicas"
          value={uniqueProductCategories}
          icon={<TagIcon className="h-6 w-6" />}
          description="Número de categorias de produtos distintas."
           colorClass="bg-indigo-500"
        />
        <KpiCard
          title="Total de Ativos Cadastrados"
          value={totalAssets}
          icon={<WrenchScrewdriverIcon className="h-6 w-6" />}
          description="Número total de ativos gerenciados."
           colorClass="bg-sky-500"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Gerador de Relatórios</h2>
        <p className="text-gray-600">
          Esta seção será dedicada à geração de relatórios personalizados e visualização de dados mais detalhados.
          Funcionalidades como seleção de métricas, períodos, filtros avançados e exportação serão implementadas aqui no futuro.
        </p>
      </div>
    </div>
  );
};

export default ReportsDashboardPage;
