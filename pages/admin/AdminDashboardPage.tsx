
import React from 'react';
import type { AppUser, Product, Asset, Descriptor, LogEntry } from '../../types';
import { UsersIcon, ArchiveBoxIcon, WrenchScrewdriverIcon, DocumentTextIcon, ClipboardDocumentListIcon } from '../../components/icons/Icons';

interface AdminDashboardPageProps {
  appUsers: AppUser[];
  products: Product[];
  assets: Asset[];
  descriptors: Descriptor[];
  movementLogs: LogEntry[];
}

interface InfoCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  colorClass?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, count, icon, colorClass = "bg-purple-600" }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg flex items-start space-x-4 hover:shadow-xl transition-shadow">
     <div className={`p-3 rounded-full ${colorClass} text-white`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{count}</p>
    </div>
  </div>
);

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ 
  appUsers, 
  products, 
  assets, 
  descriptors, 
  movementLogs 
}) => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Painel de Administração</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoCard 
          title="Total de Usuários"
          count={appUsers.length}
          icon={<UsersIcon className="h-6 w-6" />}
          colorClass="bg-sky-500"
        />
        <InfoCard 
          title="Produtos Catalogados"
          count={products.length}
          icon={<ArchiveBoxIcon className="h-6 w-6" />}
          colorClass="bg-emerald-500"
        />
        <InfoCard 
          title="Ativos Gerenciados"
          count={assets.length}
          icon={<WrenchScrewdriverIcon className="h-6 w-6" />}
          colorClass="bg-amber-500"
        />
        <InfoCard 
          title="Descritivos Técnicos"
          count={descriptors.length}
          icon={<DocumentTextIcon className="h-6 w-6" />}
          colorClass="bg-rose-500"
        />
        <InfoCard 
          title="Entradas no Log"
          count={movementLogs.length}
          icon={<ClipboardDocumentListIcon className="h-6 w-6" />}
          colorClass="bg-slate-500"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Configurações do Sistema</h2>
        <p className="text-gray-600">
          Esta área será utilizada para configurações gerais do sistema, gerenciamento avançado de permissões,
          monitoramento de performance, backups e outras tarefas administrativas.
        </p>
        {/* Placeholder for future admin tools */}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
