
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DescriptorForm from '../../components/descriptors/DescriptorForm'; // Will be simplified
import type { Descriptor, DescriptorFormData } from '../../types';

interface DescriptorEditPageProps {
  descriptors: Descriptor[];
  onUpdateDescriptor: (descriptorId: string, data: DescriptorFormData) => void;
}

const DescriptorEditPage: React.FC<DescriptorEditPageProps> = ({ descriptors, onUpdateDescriptor }) => {
  const navigate = useNavigate();
  const { descriptorId } = useParams<{ descriptorId: string }>();
  
  const descriptorToEdit = descriptors.find(d => d.id === descriptorId);

  const handleSubmit = (data: DescriptorFormData) => {
    if (descriptorId) {
      onUpdateDescriptor(descriptorId, data);
      navigate('/dashboard/descriptors');
    }
  };

  if (!descriptorToEdit) {
    return (
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-xl font-semibold text-red-600">Descritivo não encontrado.</h2>
        <button onClick={() => navigate('/dashboard/descriptors')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Voltar para Lista de Descritivos
        </button>
      </div>
    );
  }
  
  // Map new Descriptor model to new DescriptorFormData
  const initialFormData: DescriptorFormData = {
    name: descriptorToEdit.name,
    value: descriptorToEdit.value,
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Editar Descritivo: {descriptorToEdit.name}</h1>
      <DescriptorForm 
        onSubmit={handleSubmit} 
        initialData={initialFormData}
        isEditMode={true}
        onCancel={() => navigate('/dashboard/descriptors')}
      />
    </div>
  );
};

export default DescriptorEditPage;