
import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Asset, AppUser, AssetFormData } from '../../types';
// AssetStatus is no longer part of the backend Asset model
// import { ASSET_STATUS_OPTIONS } from '../../constants'; 
import { PlusIcon, PencilIcon, TrashIcon } from '../../components/icons/Icons';
// import ViewQRModal from '../../components/assets/ViewQRModal'; // QR functionality removed
import DeleteAssetConfirmationModal from '../../components/assets/DeleteAssetConfirmationModal';

interface AssetManagementPageProps {
  assets: Asset[];
  users: AppUser[]; // For responsible user dropdown
  onDeleteAsset: (assetId: string) => void;
  onImportAssets: (importedAssetsData: AssetFormData[], summary: { successfullyAdded: number; duplicatesSkipped: number; errors: number; errorDetails: string[] }) => void; // Will be disabled
}

const ITEMS_PER_PAGE = 10;

const AssetManagementPage: React.FC<AssetManagementPageProps> = ({ assets, users, onDeleteAsset, onImportAssets }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    name: '',
    location: '',
    responsibleUserId: '',
  });

  // const [isQRModalOpen, setIsQRModalOpen] = useState(false); // QR functionality removed
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Asset | null; direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatusMessage, setImportStatusMessage] = useState<string | null>(null);
  const [isImportLoading, setIsImportLoading] = useState(false); // Kept for UI disabling

  const inputBaseClasses = "mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";


  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCurrentPage(1); 
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const clearFilters = () => {
    setCurrentPage(1);
    setFilters({ name: '', location: '', responsibleUserId: '' });
  };

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      return (
        (filters.name ? (asset.name || '').toLowerCase().includes(filters.name.toLowerCase()) : true) &&
        (filters.location ? (asset.location || '').toLowerCase().includes(filters.location.toLowerCase()) : true) &&
        (filters.responsibleUserId ? asset.responsibleUserId === filters.responsibleUserId : true)
      );
    });
  }, [assets, filters]);

  const requestSort = (key: keyof Asset) => {
    setCurrentPage(1); 
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAssets = useMemo(() => {
    let sortableAssets = [...filteredAssets];
    if (sortConfig.key !== null) {
      sortableAssets.sort((a, b) => {
        const key = sortConfig.key!;
        const valA = a[key];
        const valB = b[key];
        let comparison = 0;
        if (valA === null || valA === undefined) comparison = -1;
        else if (valB === null || valB === undefined) comparison = 1;
        else comparison = String(valA).localeCompare(String(valB), 'pt-BR', { sensitivity: 'base' });
        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      });
    }
    return sortableAssets;
  }, [filteredAssets, sortConfig]);

  const paginatedAssets = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedAssets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedAssets, currentPage]);

  const totalPages = Math.ceil(sortedAssets.length / ITEMS_PER_PAGE);

  // const openQRModal = (asset: Asset) => { // QR functionality removed
  //   setSelectedAsset(asset);
  //   setIsQRModalOpen(true);
  // };

  const openDeleteModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    // setIsQRModalOpen(false); // QR functionality removed
    setIsDeleteModalOpen(false);
    setSelectedAsset(null);
  };

  const confirmDelete = () => {
    if (selectedAsset) {
      onDeleteAsset(selectedAsset.id);
    }
    closeModals();
  };

  const getUserNameById = (userId: string | null | undefined) => {
    if (!userId) return 'N/A';
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Desconhecido';
  };
  
  const getSortIndicator = (key: keyof Asset) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return '';
  };

  const handleCsvImportClick = () => {
    // CSV Import is disabled due to model mismatch
    setImportStatusMessage("Importação CSV de Ativos está desabilitada devido à incompatibilidade do modelo de dados atual.");
    setIsImportLoading(false); // Ensure it's not stuck loading
    if (fileInputRef.current) fileInputRef.current.value = ""; 
    onImportAssets([], { successfullyAdded: 0, duplicatesSkipped: 0, errors: 0, errorDetails: ["Funcionalidade desabilitada."] });
  };


  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gerenciamento de Ativos</h1>
        <div className="flex gap-2">
            <button
                onClick={handleCsvImportClick} // Changed to new handler
                disabled={true} // Explicitly disable
                className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Importação CSV desabilitada para o modelo atual de Ativos."
            >
                Importar CSV (Desabilitado)
            </button>
            <button 
                onClick={() => navigate('/dashboard/assets/add')}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150"
            >
                <PlusIcon className="h-5 w-5 mr-2" />
                Adicionar Ativo
            </button>
        </div>
      </div>
       {importStatusMessage && (
        <div className={`p-3 mb-4 rounded-md text-sm ${importStatusMessage.startsWith('Erro') || importStatusMessage.includes('desabilitada') ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-blue-100 text-blue-700 border border-blue-300'}`}>
          {importStatusMessage}
        </div>
      )}

      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <input type="text" name="name" placeholder="Nome do Ativo" value={filters.name} onChange={handleFilterChange} className={inputBaseClasses}/>
          <input type="text" name="location" placeholder="Localização" value={filters.location} onChange={handleFilterChange} className={inputBaseClasses}/>
          <select name="responsibleUserId" value={filters.responsibleUserId} onChange={handleFilterChange} className={inputBaseClasses}>
            <option value="">Todos os Usuários</option>
            {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
          </select>
           <button 
            onClick={clearFilters}
            className="sm:col-span-1 lg:col-span-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            >
            Limpar Filtros
          </button>
        </div>
      </div>
      

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="th-cell cursor-pointer hover:bg-gray-100" onClick={() => requestSort('name')}>Nome{getSortIndicator('name')}</th>
              <th className="th-cell cursor-pointer hover:bg-gray-100" onClick={() => requestSort('location')}>Localização{getSortIndicator('location')}</th>
              <th className="th-cell cursor-pointer hover:bg-gray-100" onClick={() => requestSort('responsibleUserId')}>Responsável{getSortIndicator('responsibleUserId')}</th>
              <th className="th-cell">Descrição</th>
              <th className="th-cell">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedAssets.map(asset => (
              <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                <td className="td-cell">{asset.name}</td>
                <td className="td-cell">{asset.location || '-'}</td>
                <td className="td-cell">{getUserNameById(asset.responsibleUserId)}</td>
                <td className="td-cell max-w-xs truncate" title={asset.description || ''}>{asset.description || '-'}</td>
                <td className="td-cell space-x-1">
                  <button onClick={() => navigate(`/dashboard/assets/edit/${asset.id}`)} title="Editar" className="action-btn text-indigo-600 hover:bg-indigo-100"><PencilIcon className="h-5 w-5"/></button>
                  {/* QR Code button removed */}
                  <button onClick={() => openDeleteModal(asset)} title="Excluir" className="action-btn text-red-600 hover:bg-red-100"><TrashIcon className="h-5 w-5"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {paginatedAssets.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Nenhum ativo encontrado com os filtros atuais.
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
            <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
                Anterior
            </button>
            <span className="text-sm text-gray-700">
                Página {currentPage} de {totalPages}
            </span>
            <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
                Próxima
            </button>
        </div>
      )}

      <style>{`
        .th-cell { @apply px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider; }
        .td-cell { @apply px-4 py-4 whitespace-nowrap text-sm text-gray-800; } 
        .action-btn { @apply p-1 rounded transition; }
      `}</style>

      {selectedAsset && (
        <>
          {/* ViewQRModal removed */}
          <DeleteAssetConfirmationModal isOpen={isDeleteModalOpen} onClose={closeModals} onConfirmDelete={confirmDelete} assetName={selectedAsset.name} />
        </>
      )}
    </div>
  );
};

export default AssetManagementPage;