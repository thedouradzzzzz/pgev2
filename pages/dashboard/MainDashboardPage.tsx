
import React, { useMemo } from 'react';
import type { Product, Asset } from '../../types'; // Company interface removed, CompanyEnum is used
import { Company as CompanyEnum } from '../../types'; // AssetStatus removed
import { ArchiveBoxIcon, WrenchScrewdriverIcon, TagIcon, ExclamationTriangleIcon } from '../../components/icons/Icons'; // ChartPieIcon removed
import { COMPANY_OPTIONS } from '../../constants';

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
    const categories = new Set(products.map(p => p.categoryName));
    return categories.size;
  }, [products]);

  const totalAssets = useMemo(() => {
    return assets.length;
  }, [assets]);

  // assetStatusDistribution is removed as Asset model no longer has 'status'
  // const assetStatusDistribution = useMemo(() => {
  //   const distribution: Record<AssetStatus, number> = {
  //     [AssetStatus.IN_USE]: 0,
  //     [AssetStatus.AVAILABLE]: 0,
  //     [AssetStatus.MAINTENANCE]: 0,
  //   };
  //   assets.forEach(asset => {
  //     // This part caused errors because asset.status does not exist
  //     // if (distribution[asset.status] !== undefined) {
  //     //   distribution[asset.status]++;
  //     // }
  //   });
  //   return distribution;
  // }, [assets]);

  const lowStockAlerts = useMemo(() => {
    const alertsByCompany: Record<CompanyEnum, Product[]> = {
      [CompanyEnum.CATARINENSE]: [],
      [CompanyEnum.ABPLAST]: [],
      [CompanyEnum.CATARINENSE_FILIAL]: [],
      [CompanyEnum.OUTRO]: [], // Added to satisfy Record type
    };
    products.forEach(product => {
      if (product.quantity < 5) {
         const companyKey = COMPANY_OPTIONS.find(opt => opt.label === product.fornecedorName)?.value as CompanyEnum | undefined;
         if (companyKey && alertsByCompany[companyKey]) {
          alertsByCompany[companyKey].push(product);
        } else if (product.fornecedorName) {
             console.warn(`Produto ${product.id} (${product.name}) com fornecedor "${product.fornecedorName}" não mapeado para CompanyEnum no MainDashboardPage.`);
            // Optionally, assign to 'OUTRO' if it doesn't map to a specific company
            // alertsByCompany[CompanyEnum.OUTRO].push(product);
        } else {
            // Product without a fornecedorName could be assigned to 'OUTRO' or ignored
            // alertsByCompany[CompanyEnum.OUTRO].push(product);
        }
      }
    });
    return alertsByCompany;
  }, [products]);

  const hasAnyLowStockAlerts = Object.values(lowStockAlerts).some(alerts => alerts && alerts.length > 0);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Visão Geral do Sistema</h1>

      {/* Low Stock Alerts - Rendered First */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <ExclamationTriangleIcon className="h-6 w-6 mr-2 text-yellow-500" />
          Alertas de Estoque Baixo (Menos de 5 unidades)
        </h2>
        {!hasAnyLowStockAlerts && (
            <p className="text-sm text-gray-500">Nenhum alerta de estoque baixo no momento para nenhuma empresa.</p>
        )}
        {hasAnyLowStockAlerts && COMPANY_OPTIONS.map(companyOpt => {
          const alerts = lowStockAlerts[companyOpt.value as CompanyEnum];
          
          if (!alerts || alerts.length === 0) {
             return null; 
          }
          return (
            <div key={companyOpt.value} className="mb-6">
              <h3 className="text-lg font-medium text-gray-600 mb-2 border-b pb-1">{companyOpt.label}</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {alerts.map(product => (
                  <li key={product.id} className="text-red-600">
                    <span className="font-semibold">{product.name} ({product.categoryName})</span> - Quantidade: {product.quantity}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Adjusted grid to 3 columns */}
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
         {/* KPI Card for Ativos em Manutenção removed 
         <KpiCard 
          title="Ativos em Manutenção"
          value={assetStatusDistribution[AssetStatus.MAINTENANCE]}
          icon={<ChartPieIcon className="h-6 w-6" />}
          description={`Em Uso: ${assetStatusDistribution[AssetStatus.IN_USE]}, Disponível: ${assetStatusDistribution[AssetStatus.AVAILABLE]}`}
          colorClass="bg-amber-500"
        /> */}
      </div>

      {/* Asset Status Distribution section removed
      <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Distribuição de Ativos por Status</h2>
        <div className="flex flex-col sm:flex-row justify-around items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {Object.entries(assetStatusDistribution).map(([status, count]) => (
            <div key={status} className="text-center p-4 rounded-lg bg-gray-50 border w-full sm:w-auto flex-1">
              <p className="text-lg font-medium text-gray-600">{status as AssetStatus}</p>
              <p className="text-4xl font-bold text-blue-600">{count}</p>
            </div>
          ))}
        </div>
      </div>
      */}

       <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3">Bem-vindo(a) ao Sistema de Gerenciamento de Insumos!</h2>
        <p className="text-gray-500 max-w-md mx-auto">
            Utilize o menu lateral para navegar pelas funcionalidades disponíveis.
            Este painel oferece uma visão rápida dos indicadores chave e alertas importantes.
        </p>
    </div>
    </div>
  );
};

export default MainDashboardPage;
