
import React, { useState, useEffect } from 'react';
import type { AssetFormData, AppUser } from '../../types';
// AssetStatus and ASSET_STATUS_OPTIONS are removed as they are not part of the new model

interface AssetFormProps {
  onSubmit: (data: AssetFormData) => void;
  initialData?: AssetFormData;
  users: AppUser[]; 
  isEditMode?: boolean;
  onCancel: () => void;
}

const AssetForm: React.FC<AssetFormProps> = ({ onSubmit, initialData, users, isEditMode = false, onCancel }) => {
  const [formData, setFormData] = useState<AssetFormData>({
    name: '',
    description: '',
    responsavel: null,
    localizacao: '',
  });
  const [error, setError] = useState<string | null>(null);

  const inputBaseClasses = "mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
  const labelBaseClasses = "block text-sm font-medium text-gray-700 mb-1";
  const textareaBaseClasses = `${inputBaseClasses} min-h-[80px]`;

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        responsavel: initialData.responsavel || null,
        localizacao: initialData.localizacao || '',
      });
    } else {
      // Reset for add mode
      setFormData({ name: '', description: '', responsavel: null, localizacao: '' });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === "" && name === "responsavel" ? null : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError(`O campo "Nome do Ativo" é obrigatório.`);
      return;
    }
    // Other fields are optional according to new backend model for Asset
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">{error}</p>}
      
      <div>
        <label htmlFor="name" className={labelBaseClasses}>Nome do Ativo</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={inputBaseClasses} placeholder="Ex: Notebook Dell XPS 15 TI-001"/>
      </div>
      
      <div>
        <label htmlFor="localizacao" className={labelBaseClasses}>Localização (Opcional)</label>
        <input type="text" name="localizacao" id="localizacao" value={formData.localizacao || ''} onChange={handleChange} className={inputBaseClasses} placeholder="Ex: Sala 301, Prédio B"/>
      </div>

      <div>
        <label htmlFor="responsavel" className={labelBaseClasses}>Usuário Responsável (Opcional)</label>
        <select name="responsavel" id="responsavel" value={formData.responsavel || ''} onChange={handleChange} className={inputBaseClasses}>
          <option value="">Nenhum</option>
          {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
        </select>
      </div>
      
      <div>
        <label htmlFor="description" className={labelBaseClasses}>Descrição (Opcional)</label>
        <textarea name="description" id="description" value={formData.description || ''} onChange={handleChange} rows={4} className={textareaBaseClasses} placeholder="Detalhes adicionais sobre o ativo, como configuração, observações importantes, etc."></textarea>
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
          {isEditMode ? 'Salvar Alterações' : 'Adicionar Ativo'}
        </button>
      </div>
    </form>
  );
};

export default AssetForm;