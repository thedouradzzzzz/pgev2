
import React, { useState, useEffect } from 'react';
import type { DescriptorFormData } from '../../types';
// DescriptorStatus and DESCRIPTOR_STATUS_OPTIONS are removed

interface DescriptorFormProps {
  onSubmit: (data: DescriptorFormData) => void;
  initialData?: DescriptorFormData;
  isEditMode?: boolean;
  onCancel: () => void;
}

const DescriptorForm: React.FC<DescriptorFormProps> = ({ onSubmit, initialData, isEditMode = false, onCancel }) => {
  const [formData, setFormData] = useState<DescriptorFormData>({
    name: '',
    value: '',
  });
  const [error, setError] = useState<string | null>(null);

  const inputBaseClasses = "mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
  const labelBaseClasses = "block text-sm font-medium text-gray-700 mb-1";
  const textareaBaseClasses = `${inputBaseClasses} min-h-[80px]`;


  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Reset for add mode
      setFormData({ name: '', value: '' });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.value.trim()) {
      setError(`Os campos "Nome do Descritivo" e "Valor" são obrigatórios.`);
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">{error}</p>}
      
      <div>
        <label htmlFor="name" className={labelBaseClasses}>Nome do Descritivo</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={inputBaseClasses} placeholder="Ex: Chave de API, URL do Servidor"/>
      </div>
      
      <div>
        <label htmlFor="value" className={labelBaseClasses}>Valor do Descritivo</label>
        <textarea name="value" id="value" value={formData.value} onChange={handleChange} rows={3} required className={textareaBaseClasses} placeholder="Ex: xyz123abc, https://api.exemplo.com"></textarea>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
        >
          {isEditMode ? 'Salvar Alterações' : 'Adicionar Descritivo'}
        </button>
      </div>
    </form>
  );
};

export default DescriptorForm;