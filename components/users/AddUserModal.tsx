import React, { useState } from 'react';
import Modal from '../common/Modal';
import type { AddUserFormData } from '../../types';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (data: AddUserFormData & { forcePasswordChange: boolean }) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAddUser }) => {
  const [formData, setFormData] = useState<AddUserFormData>({
    name: '',
    email: '',
    password_param: '',
    confirmPassword_param: '',
    role: 'Usuário',
  });
  // NOVO: Estado para o checkbox
  const [forcePasswordChange, setForcePasswordChange] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const inputBaseClasses = "mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.password_param || !formData.confirmPassword_param) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
    if (formData.password_param !== formData.confirmPassword_param) {
      setError('As senhas não coincidem.');
      return;
    }
    if (formData.password_param.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres.');
        return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Formato de e-mail inválido.');
        return;
    }

    // Enviando o valor do checkbox junto com os outros dados
    onAddUser({ ...formData, forcePasswordChange });
  };

  const modalFooter = (
    <>
      <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Cancelar</button>
      <button type="submit" form="addUserForm" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Adicionar Usuário</button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Novo Usuário" footer={modalFooter}>
      <form id="addUserForm" onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">{error}</p>}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={inputBaseClasses}/>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className={inputBaseClasses}/>
        </div>
        <div>
          <label htmlFor="password_param" className="block text-sm font-medium text-gray-700">Senha</label>
          <input type="password" name="password_param" id="password_param" value={formData.password_param} onChange={handleChange} required className={inputBaseClasses}/>
        </div>
        <div>
          <label htmlFor="confirmPassword_param" className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
          <input type="password" name="confirmPassword_param" id="confirmPassword_param" value={formData.confirmPassword_param} onChange={handleChange} required className={inputBaseClasses}/>
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Função</label>
          <select name="role" id="role" value={formData.role} onChange={handleChange} className={inputBaseClasses}>
            <option value="Usuário">Usuário</option>
            <option value="Administrador">Administrador</option>
          </select>
        </div>
        {/* NOVO: Checkbox para forçar troca de senha */}
        <div className="flex items-center mt-4">
            <input 
              id="add-forcePasswordChange" 
              name="forcePasswordChange" 
              type="checkbox" 
              checked={forcePasswordChange} 
              onChange={(e) => setForcePasswordChange(e.target.checked)} 
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="add-forcePasswordChange" className="ml-2 block text-sm text-gray-900">Forçar troca de senha no próximo login</label>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;
