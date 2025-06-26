import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Asset, AppUser } from '../../types';
// PencilIcon foi removido das importações
import { PlusIcon, TrashIcon, UploadIcon } from '../../components/icons/Icons';
import ImportAssetsModal from '../../components/assets/ImportAssetsModal';
import apiService from '../../src/services/apiService';

interface AssetManagementPageProps {
  assets: Asset[];
  users: AppUser[];
  onDeleteAsset: (assetId: string) => void;
  onDataNeedsRefresh: () => void;
}

const ITEMS_PER_PAGE = 15;

const AssetManagementPage: React.FC<AssetManagementPageProps> = ({ assets, users, onDeleteAsset, onDataNeedsRefresh }) => {
  const navigate = useNavigate();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    nome: '',
    fabricante: '',
    numero_serie: '',
    modelo: '',
  });

  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1); // Reseta para a primeira página ao filtrar
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  // useMemo re-adicionado para otimização
  const filteredAssets = useMemo(() => {
    return assets.filter(asset =>
      (filters.nome ? (asset.nome || '').toLowerCase().includes(filters.nome.toLowerCase()) : true) &&
      (filters.fabricante ? (asset.fabricante || '').toLowerCase().includes(filters.fabricante.toLowerCase()) : true) &&
      (filters.numero_serie ? (asset.numero_serie || '').toLowerCase().includes(filters.numero_serie.toLowerCase()) : true) &&
      (filters.modelo ? (asset.modelo || '').toLowerCase().includes(filters.modelo.toLowerCase()) : true)
    );
  }, [assets, filters]);

  // Lógica de paginação re-adicionada
  const totalPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE);
  const paginatedAssets = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAssets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAssets, currentPage]);

  const handleImport = async (file: File) => {
    try {
      const result = await apiService.importAssetsCSV(file);
      onDataNeedsRefresh();
      return result.data;
    } catch (error) {
      console.error("Falha na importação:", error);
      throw error;
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gerenciar Ativos</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsImportModalOpen(true)} className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150">
            <UploadIcon className="h-5 w-5 mr-2" />
            Importar CSV
          </button>
          <button onClick={() => navigate('/dashboard/assets/add')} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150">
            <PlusIcon className="h-5 w-5 mr-2" />
            Adicionar Ativo
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input type="text" name="nome" placeholder="Filtrar por Nome..." value={filters.nome} onChange={handleFilterChange} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md" />
            <input type="text" name="fabricante" placeholder="Filtrar por Fabricante..." value={filters.fabricante} onChange={handleFilterChange} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md" />
            <input type="text" name="numero_serie" placeholder="Filtrar por Nº de Série..." value={filters.numero_serie} onChange={handleFilterChange} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md" />
            <input type="text" name="modelo" placeholder="Filtrar por Modelo..." value={filters.modelo} onChange={handleFilterChange} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md" />
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fabricante</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nº de Série</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local/Resp.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedAssets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{asset.nome || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.fabricante || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.numero_serie || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.modelo || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" title={asset.localizacao || ''}>{asset.localizacao || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => onDeleteAsset(String(asset.id))} title="Excluir" className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"><TrashIcon className="h-5 w-5"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
         {filteredAssets.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Nenhum ativo encontrado.
          </div>
        )}
      </div>

      {/* Paginação re-adicionada */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Anterior</button>
            <span className="text-sm text-gray-700">Página {currentPage} de {totalPages}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Próxima</button>
        </div>
      )}

      <ImportAssetsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
};

export default AssetManagementPage;
