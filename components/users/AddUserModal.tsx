import React, { useState } from 'react';
import Modal from '../common/Modal';
import type { AddUserFormData } from '../../types';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (data: AddUserFormData) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAddUser }) => {
  const [formData, setFormData] = useState<AddUserFormData>({
    name: '',
    email: '',
    password_param: '',
    confirmPassword_param: '',
    role: 'Funcionário', // Corrected default role
    // status: 'Ativo', // Removed, not in AddUserFormData type or backend model
    // forcePasswordChange: false, // Removed, not in AddUserFormData type or backend model
  });
  const [error, setError] = useState<string | null>(null);

  const inputBaseClasses = "mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Removed checkbox handling as forcePasswordChange is removed
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Removed forcePasswordChange from required check
    if (!formData.name || !formData.email || !formData.password_param || !formData.confirmPassword_param) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
    if (formData.password_param !== formData.confirmPassword_param) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Formato de e-mail inválido.');
        return;
    }

    onAddUser(formData);
    setFormData({ 
        name: '', email: '', password_param: '', confirmPassword_param: '', 
        role: 'Funcionário', // Corrected reset role
        // status: 'Ativo', // Removed
        // forcePasswordChange: false // Removed
    }); 
  };

  const modalFooter = (
    <>
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
      >
        Cancelar
      </button>
      <button
        type="submit"
        form="addUserForm" 
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
      >
        Adicionar Usuário
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Novo Usuário" footer={modalFooter}>
      <form id="addUserForm" onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">{error}</p>}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required 
                 className={inputBaseClasses}/>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required
                 className={inputBaseClasses}/>
        </div>
        <div>
          <label htmlFor="password_param" className="block text-sm font-medium text-gray-700">Senha</label>
          <input type="password" name="password_param" id="password_param" value={formData.password_param} onChange={handleChange} required
                 className={inputBaseClasses}/>
        </div>
        <div>
          <label htmlFor="confirmPassword_param" className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
          <input type="password" name="confirmPassword_param" id="confirmPassword_param" value={formData.confirmPassword_param} onChange={handleChange} required
                 className={inputBaseClasses}/>
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Cargo (Role)</label>
          <select name="role" id="role" value={formData.role} onChange={handleChange}
                  className={inputBaseClasses}>
            <option value="Funcionário">Funcionário</option> 
            <option value="Gerente">Gerente (Administrador)</option>
          </select>
        </div>
        {/* Removed Status select field */}
        {/* Removed Force Password Change checkbox */}
      </form>
    </Modal>
  );
};

export default AddUserModal;