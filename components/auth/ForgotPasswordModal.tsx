
import React, { useState } from 'react';
import Modal from '../common/Modal';
import type { ForgotPasswordFormData } from '../../types';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ForgotPasswordFormData) => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const inputBaseClasses = "mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('O e-mail é obrigatório.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Formato de e-mail inválido.');
        return;
    }
    onSubmit({ email });
    // Don't close modal immediately, App.tsx will show toast and user can close.
    // setEmail(''); // Clear email after submission
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
        form="forgotPasswordForm"
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
      >
        Enviar Link de Recuperação
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recuperar Senha" footer={modalFooter}>
      <form id="forgotPasswordForm" onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">{error}</p>}
        <p className="text-sm text-gray-600">
          Digite seu endereço de e-mail abaixo. Se uma conta estiver associada a este e-mail, enviaremos um link para redefinir sua senha.
        </p>
        <div>
          <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700">Seu Endereço de E-mail</label>
          <input 
            type="email" 
            name="email" 
            id="forgot-email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className={inputBaseClasses}
            placeholder="seuemail@exemplo.com"
          />
        </div>
      </form>
    </Modal>
  );
};

export default ForgotPasswordModal;