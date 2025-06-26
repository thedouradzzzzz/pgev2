import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATARINENSE_PHARMA_HEADER_LOGO_URL } from '../../constants';

interface ForceChangePasswordPageProps {
  onActualResetPassword: (userId: string, newPassword_param: string) => Promise<boolean>;
  onLogout: () => void;
}

const ForceChangePasswordPage: React.FC<ForceChangePasswordPageProps> = ({ onActualResetPassword, onLogout }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const userId = sessionStorage.getItem('passwordChangeUserId');

  useEffect(() => {
    if (!userId) {
      setError("Nenhuma sessão de troca de senha encontrada. Redirecionando para o login...");
      setTimeout(() => navigate('/'), 3000);
    }
  }, [userId, navigate]);

  const inputBaseClasses = "mt-1 block w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!userId) {
      setError("Sessão inválida. Tente fazer login novamente.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('As novas senhas não coincidem.');
      return;
    }
    if (newPassword.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    const success = await onActualResetPassword(userId, newPassword);
    if (success) {
      setSuccessMessage('Senha alterada com sucesso! Você será redirecionado para o login.');
      setTimeout(() => {
        onLogout();
      }, 3000);
    } else {
      setError('Ocorreu um erro ao tentar alterar a senha. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 p-4">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src={CATARINENSE_PHARMA_HEADER_LOGO_URL} alt="Catarinense Pharma" className="h-12 object-contain" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Troca de Senha Obrigatória</h2>
        <p className="text-center text-gray-600 mb-6">
          {userId ? "Por segurança, defina uma nova senha para continuar." : "Sessão inválida."}
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nova Senha</label>
            <input id="newPassword" name="newPassword" type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputBaseClasses} placeholder="Digite sua nova senha" disabled={!userId || !!successMessage} />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
            <input id="confirmPassword" name="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputBaseClasses} placeholder="Confirme sua nova senha" disabled={!userId || !!successMessage} />
          </div>
          {error && (<p className="text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">{error}</p>)}
          {successMessage && (<p className="text-sm text-green-600 bg-green-100 p-3 rounded-md border border-green-300">{successMessage}</p>)}
          <div>
            <button type="submit" disabled={!userId || !!successMessage} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
              {successMessage ? 'Senha Alterada!' : 'Salvar Nova Senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForceChangePasswordPage;
