
import React, { useState } from 'react';
import Modal from '../common/Modal';
import type { ResetPasswordFormData } from '../../types';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetPassword: (data: ResetPasswordFormData) => void;
  userName: string;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose, onResetPassword, userName }) => {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword_param: '',
    confirmNewPassword_param: '',
  });
  const [error, setError] = useState<string | null>(null);

  const inputBaseClasses = "mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.newPassword_param || !formData.confirmNewPassword_param) {
      setError('Nova senha e confirmação são obrigatórias.');
      return;
    }
    if (formData.newPassword_param !== formData.confirmNewPassword_param) {
      setError('As novas senhas não coincidem.');
      return;
    }
    onResetPassword(formData);
    setFormData({ newPassword_param: '', confirmNewPassword_param: ''}); 
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
        form="resetPasswordForm"
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
      >
        Resetar Senha
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Resetar Senha para ${userName}`} footer={modalFooter}>
      <form id="resetPasswordForm" onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">{error}</p>}
        <div>
          <label htmlFor="newPassword_param" className="block text-sm font-medium text-gray-700">Nova Senha</label>
          <input type="password" name="newPassword_param" id="newPassword_param" value={formData.newPassword_param} onChange={handleChange} required 
                 className={inputBaseClasses}/>
        </div>
        <div>
          <label htmlFor="confirmNewPassword_param" className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
          <input type="password" name="confirmNewPassword_param" id="confirmNewPassword_param" value={formData.confirmNewPassword_param} onChange={handleChange} required
                 className={inputBaseClasses}/>
        </div>
      </form>
    </Modal>
  );
};

export default ResetPasswordModal;