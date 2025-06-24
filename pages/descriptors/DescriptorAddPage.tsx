
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DescriptorForm from '../../components/descriptors/DescriptorForm'; // Will be simplified
import type { DescriptorFormData } from '../../types';

interface DescriptorAddPageProps {
  onAddDescriptor: (data: DescriptorFormData) => void;
}

const DescriptorAddPage: React.FC<DescriptorAddPageProps> = ({ onAddDescriptor }) => {
  const navigate = useNavigate();

  const handleSubmit = (data: DescriptorFormData) => {
    onAddDescriptor(data);
    navigate('/dashboard/descriptors');
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Adicionar Novo Descritivo</h1>
      <DescriptorForm 
        onSubmit={handleSubmit} 
        onCancel={() => navigate('/dashboard/descriptors')}
        // isEditMode is false by default
      />
    </div>
  );
};

export default DescriptorAddPage;