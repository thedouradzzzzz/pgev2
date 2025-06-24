
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CATARINENSE_PHARMA_HEADER_LOGO_URL } from '../../constants';

interface ResetPasswordPageProps {
  onActualResetPassword: (token: string, newPassword_param: string) => Promise<boolean>; // Changed prop name
  onLogout: () => void;
  username: string; // Will be empty or not used if user isn't logged in.
  resetToken?: string; // Passed from App.tsx via route
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onActualResetPassword, onLogout, username, resetToken }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const params = useParams();
  const tokenFromUrl = params.token || resetToken;


  useEffect(() => {
    if (!tokenFromUrl) {
      setError("Token de reset de senha não encontrado ou inválido. Solicite um novo link.");
      // Consider redirecting or disabling form
    }
  }, [tokenFromUrl]);


  const inputBaseClasses = "mt-1 block w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!tokenFromUrl) {
      setError("Token de reset de senha ausente.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      setError('Nova senha e confirmação são obrigatórias.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('As novas senhas não coincidem.');
      return;
    }
    
    const success = await onActualResetPassword(tokenFromUrl, newPassword);
    if (success) {
      setSuccessMessage('Senha alterada com sucesso! Você pode agora fazer login com sua nova senha.');
      // Optional: automatically navigate to login after a delay
      setTimeout(() => {
        navigate('/'); 
      }, 3000);
    } else {
      setError('Ocorreu um erro ao tentar alterar a senha. O token pode ser inválido ou expirado. Tente novamente ou solicite um novo link.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 p-4">
      {/* Logout button may not be relevant if user is not logged in for this flow */}
      {/* <div className="absolute top-4 right-4">
        <button
          onClick={onLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Sair (Logout)
        </button>
      </div> */}
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img 
            src={CATARINENSE_PHARMA_HEADER_LOGO_URL} 
            alt="Catarinense Pharma" 
            className="h-12 object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Redefinir Senha</h2>
        <p className="text-center text-gray-600 mb-6">
          {tokenFromUrl ? "Defina sua nova senha abaixo." : "Link de redefinição de senha inválido ou ausente."}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newPassword"className="block text-sm font-medium text-gray-700">
              Nova Senha
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputBaseClasses}
              placeholder="Digite sua nova senha"
              disabled={!tokenFromUrl || !!successMessage}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword"className="block text-sm font-medium text-gray-700">
              Confirmar Nova Senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputBaseClasses}
              placeholder="Confirme sua nova senha"
              disabled={!tokenFromUrl || !!successMessage}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">{error}</p>
          )}
          {successMessage && (
            <p className="text-sm text-green-600 bg-green-100 p-3 rounded-md border border-green-300">{successMessage}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={!tokenFromUrl || !!successMessage} 
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 disabled:opacity-50"
            >
              {successMessage ? 'Senha Alterada!' : 'Salvar Nova Senha'}
            </button>
          </div>
        </form>
         {!successMessage && (
            <p className="mt-4 text-center text-sm">
                <button onClick={() => navigate('/')} className="text-blue-600 hover:underline">Voltar para Login</button>
            </p>
         )}
      </div>
    </div>
  );
};

export default ResetPasswordPage; // Renamed component for clarity
