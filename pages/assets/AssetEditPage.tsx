
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AssetForm from '../../components/assets/AssetForm'; // AssetForm will be updated for the new model
import type { Asset, AssetFormData, AppUser } from '../../types';

interface AssetEditPageProps {
  assets: Asset[];
  users: AppUser[];
  onUpdateAsset: (assetId: string, data: AssetFormData) => void;
}

const AssetEditPage: React.FC<AssetEditPageProps> = ({ assets, users, onUpdateAsset }) => {
  const navigate = useNavigate();
  const { assetId } = useParams<{ assetId: string }>();
  
  const assetToEdit = assets.find(a => a.id === assetId);

  const handleSubmit = (data: AssetFormData) => {
    if (assetId) {
      onUpdateAsset(assetId, data);
      navigate('/dashboard/assets');
    }
  };

  if (!assetToEdit) {
    return (
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-xl font-semibold text-red-600">Ativo não encontrado.</h2>
        <button onClick={() => navigate('/dashboard/assets')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Voltar para Lista de Ativos
        </button>
      </div>
    );
  }
  
  // Prepare initialData for the form, mapping from new Asset model to AssetFormData
  const initialFormData: AssetFormData = {
    name: assetToEdit.name,
    description: assetToEdit.description || '',
    responsavel: assetToEdit.responsibleUserId || null,
    localizacao: assetToEdit.location || '',
  };


  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Editar Ativo: {assetToEdit.name}</h1>
      <AssetForm 
        onSubmit={handleSubmit} 
        initialData={initialFormData}
        users={users}
        isEditMode={true}
        onCancel={() => navigate('/dashboard/assets')}
      />
    </div>
  );
};

export default AssetEditPage;