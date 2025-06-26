import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import type { AppUser, EditUserFormData } from '../../types';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditUser: (data: EditUserFormData) => void; // Removido userId, será pego do currentUser
  currentUser: AppUser | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, onEditUser, currentUser }) => {
  const [formData, setFormData] = useState<EditUserFormData>({
    name: '',
    email: '',
    role: 'user',
    forcePasswordChange: false,
  });
  const [error, setError] = useState<string | null>(null);

  const inputBaseClasses = "mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        forcePasswordChange: !!currentUser.force_password_change,
      });
    } else {
      setFormData({ name: '', email: '', role: 'user', forcePasswordChange: false });
    }
  }, [currentUser, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    if (isCheckbox) {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.name || !formData.email) {
      setError('Nome e Email são obrigatórios.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Formato de e-mail inválido.');
        return;
    }
    if (currentUser) {
      // A função onEditUser agora só precisa dos dados do formulário
      onEditUser(formData);
    }
  };

  const modalFooter = (
    <>
      <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Cancelar</button>
      <button type="submit" form="editUserForm" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Salvar Alterações</button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar Usuário: ${currentUser?.name}`} footer={modalFooter}>
      <form id="editUserForm" onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">{error}</p>}
        <div>
          <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
          <input type="text" name="name" id="edit-name" value={formData.name} onChange={handleChange} required className={inputBaseClasses}/>
        </div>
        <div>
          <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" id="edit-email" value={formData.email} onChange={handleChange} required className={inputBaseClasses}/>
        </div>
        <div>
          <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700">Função</label>
          {/* CORREÇÃO: Os <option> agora têm 'value'="user"' e 'value="admin"' */}
          <select name="role" id="edit-role" value={formData.role} onChange={handleChange} className={inputBaseClasses}>
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div className="flex items-center mt-4">
            <input id="forcePasswordChange" name="forcePasswordChange" type="checkbox" checked={formData.forcePasswordChange} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
            <label htmlFor="forcePasswordChange" className="ml-2 block text-sm text-gray-900">Forçar troca de senha no próximo login</label>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;
