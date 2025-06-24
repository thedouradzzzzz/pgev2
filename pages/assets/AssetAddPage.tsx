
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AssetForm from '../../components/assets/AssetForm'; // AssetForm will be updated for the new model
import type { AssetFormData, AppUser } from '../../types';

interface AssetAddPageProps {
  users: AppUser[];
  onAddAsset: (data: AssetFormData) => void;
}

const AssetAddPage: React.FC<AssetAddPageProps> = ({ users, onAddAsset }) => {
  const navigate = useNavigate();

  const handleSubmit = (data: AssetFormData) => {
    onAddAsset(data);
    navigate('/dashboard/assets');
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Adicionar Novo Ativo</h1>
      <AssetForm 
        onSubmit={handleSubmit} 
        users={users}
        onCancel={() => navigate('/dashboard/assets')}
        // isEditMode is false by default
      />
    </div>
  );
};

export default AssetAddPage;