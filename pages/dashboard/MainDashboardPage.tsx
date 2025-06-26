import React, { useMemo } from 'react';
import type { Product, Asset } from '../../types';
import { ArchiveBoxIcon, WrenchScrewdriverIcon, TagIcon, ExclamationTriangleIcon } from '../../components/icons/Icons';

interface MainDashboardPageProps {
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

const MainDashboardPage: React.FC<MainDashboardPageProps> = ({ products, assets }) => {
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

  const lowStockAlerts = useMemo(() => {
    const alerts: Record<string, Product[]> = {};
    products.forEach(product => {
      if (product.quantity < 5) {
        const empresa = product.empresa || 'Outros';
        if (!alerts[empresa]) {
          alerts[empresa] = [];
        }
        alerts[empresa].push(product);
      }
    });
    return alerts;
  }, [products]);

  const hasAnyLowStockAlerts = Object.values(lowStockAlerts).some(alerts => alerts.length > 0);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Visão Geral do Sistema</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <ExclamationTriangleIcon className="h-6 w-6 mr-2 text-yellow-500" />
          Alertas de Estoque Baixo (Menos de 5 unidades)
        </h2>
        {!hasAnyLowStockAlerts && (
            <p className="text-sm text-gray-500">Nenhum alerta de estoque baixo no momento.</p>
        )}
        {hasAnyLowStockAlerts && Object.entries(lowStockAlerts).map(([empresa, alertProducts]) => (
          <div key={empresa} className="mb-6 last:mb-0">
            <h3 className="text-lg font-medium text-gray-700 mb-2 border-b pb-1">{empresa}</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {alertProducts.map(product => (
                <li key={product.id} className="text-red-600">
                  {/* CORREÇÃO AQUI: Trocado categoryName por empresa */}
                  <span className="font-semibold">{product.name} ({product.empresa})</span> - Quantidade: {product.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

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

       <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3">Bem-vindo(a) ao Sistema de Gerenciamento de Insumos!</h2>
        <p className="text-gray-500 max-w-md mx-auto">
            Utilize o menu lateral para navegar pelas funcionalidades disponíveis.
        </p>
    </div>
    </div>
  );
};

export default MainDashboardPage;
