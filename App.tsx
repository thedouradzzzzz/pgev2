import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import MainDashboardPage from './pages/dashboard/MainDashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import ProductSearchPage from './pages/products/ProductSearchPage';
import ProductAddPage from './pages/products/ProductAddPage';
import AssetManagementPage from './pages/assets/AssetManagementPage';
import AssetAddPage from './pages/assets/AssetAddPage';
import AssetEditPage from './pages/assets/AssetEditPage';
import DescriptorManagementPage from './pages/descriptors/DescriptorManagementPage';
import DescriptorAddPage from './pages/descriptors/DescriptorAddPage';
import DescriptorEditPage from './pages/descriptors/DescriptorEditPage';
import ProductTypeManagementPage from './pages/products/ProductTypeManagementPage';
import MovementLogsPage from './pages/logs/MovementLogsPage';
import ReportsDashboardPage from './pages/reports/ReportsDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import PlaceholderContent from './pages/PlaceholderContent';
import ForceChangePasswordPage from './pages/auth/ForceChangePasswordPage';
import ForgotPasswordModal from './components/auth/ForgotPasswordModal';

import apiService from './src/services/apiService';

import type {
  User,
  AppUser,
  Product,
  Asset,
  Descriptor,
  LogEntry,
  Category,
  Fornecedor,
  ProductFormData,
  AssetFormData,
  DescriptorFormData,
  AddUserFormData,
  EditUserFormData,
  AddQuantityFormData,
  SubtractQuantityFormData,
  ForgotPasswordFormData,
} from './types';
import { LogEntryActionType } from './types';


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [descriptors, setDescriptors] = useState<Descriptor[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);


  const navigate = useNavigate();
  const location = useLocation();

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addLog = useCallback((actionType: LogEntryActionType, description: string, details?: Record<string, any>) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      userId: currentUser?.id || 'System',
      username: currentUser?.username || 'Sistema',
      actionType,
      description,
      details,
    };
    setLogs(prevLogs => {
      const updatedLogs = [newLog, ...prevLogs];
      try {
        localStorage.setItem('movementLogs', JSON.stringify(updatedLogs));
      } catch (e) {
        console.error("Failed to save logs to localStorage:", e);
      }
      return updatedLogs;
    });
  }, [currentUser]);

  const handleLogin = async (email: string, password_param: string): Promise<boolean> => {
    setError(null);
    try {
      const loginResponse = await apiService.login(email, password_param);
      if (loginResponse.success && loginResponse.data.token && loginResponse.data.user) {
        const { token, user } = loginResponse.data;
        const userToStore: User = { id: user.id, username: user.name, isAdmin: user.role === 'admin', token: token };
        localStorage.setItem('currentUser', JSON.stringify(userToStore));
        setCurrentUser(userToStore);
        addLog(LogEntryActionType.USER_LOGIN_SUCCESS, `Usuário ${userToStore.username} logado.`);
        showToast('Login bem-sucedido!', 'success');
        navigate('/dashboard');
        return true;
      } else {
        throw new Error(loginResponse.message || "Credenciais inválidas ou token não retornado.");
      }
    } catch (err: any) {
      setError(err.message || 'Erro de login.');
      addLog(LogEntryActionType.USER_LOGIN_FAIL, `Login falhou para ${email}. Erro: ${err.message}`);
      showToast(`Falha no login: ${err.message}`, 'error');
      localStorage.removeItem('currentUser');
      return false;
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      addLog(LogEntryActionType.USER_LOGOUT, `Usuário ${currentUser.username} deslogado.`);
    }
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setAppUsers([]); setProducts([]); setCategories([]); setFornecedores([]); setAssets([]); setDescriptors([]);
    showToast('Logout realizado com sucesso.', 'success');
    navigate('/');
  };
  
  // ===================================================================================
  // == CORREÇÃO APLICADA AQUI: Preenchendo a função para buscar os dados iniciais    ==
  // ===================================================================================
  const fetchData = useCallback(async () => {
    if (!currentUser) return; // Não faz nada se não houver usuário logado

    console.log("Iniciando busca de dados do sistema...");
    try {
        // Busca os dados em paralelo para mais performance
        const [usersResponse, productsResponse] = await Promise.all([
            apiService.fetchUsers(),
            apiService.fetchProducts()
            // Adicione outras chamadas de fetch aqui no futuro
        ]);

        if (usersResponse.success) {
            setAppUsers(usersResponse.data);
        } else {
            showToast(usersResponse.message || 'Falha ao buscar usuários.', 'error');
        }

        if (productsResponse.success) {
            setProducts(productsResponse.data);
        } else {
            showToast(productsResponse.message || 'Falha ao buscar produtos.', 'error');
        }

    } catch (error: any) {
        console.error("Erro crítico ao buscar dados:", error);
        showToast(error.message || 'Erro de comunicação ao carregar dados.', 'error');
        // Opcional: fazer logout se o token for inválido
        if (error.message.includes('Não autorizado')) {
            handleLogout();
        }
    }
  }, [currentUser]); // A dependência é apenas `currentUser`

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.token) {
        fetchData();
    } else {
        setAppUsers([]); setProducts([]); setCategories([]); setFornecedores([]); setAssets([]); setDescriptors([]);
    }
  }, [currentUser, fetchData]);

  const handleForgotPasswordSubmit = async (data: ForgotPasswordFormData) => { /* ... */ };
  const handleActualPasswordReset = async (token: string, newPassword_param: string): Promise<boolean> => { return false; };

  const handleAddUser = async (data: AddUserFormData) => {
    try {
      const response = await apiService.registerUser(data);
  
      if (response.success && response.data) {
        setAppUsers(prevUsers => [...prevUsers, response.data]);
        showToast('Usuário adicionado com sucesso!', 'success');
        addLog(LogEntryActionType.USER_CREATED, `Usuário '${data.name}' foi criado.`);
      } else {
        throw new Error(response.message || 'Ocorreu uma falha ao adicionar o usuário.');
      }
    } catch (err: any) {
      console.error("Erro detalhado ao adicionar usuário:", err);
      showToast(`Erro: ${err.message}`, 'error');
      addLog(LogEntryActionType.USER_CREATE_FAIL, `Falha ao tentar criar usuário '${data.name}'. Erro: ${err.message}`);
    }
  };

  const handleEditUser = async (userId: string, data: EditUserFormData) => { /* ... código existente ... */ };
  const handleDeleteUser = async (userId: string) => { /* ... código existente ... */ };
  const handleResetPasswordByAdmin = async (userId: string, newPassword_param: string) => { /* ... código existente ... */ };
  const handleAddCategory = async (name: string, description?: string): Promise<boolean> => { return false /* ... */ };
  const handleEditCategory = async (id: string, newName: string, newDescription?: string): Promise<boolean> => { return false /* ... */ };
  const handleDeleteCategory = async (id: string) => { /* ... */ };
  const handleAddProduct = async (data: ProductFormData) => { /* ... */ };
  const handleUpdateQuantity = async (productId: string, amountChange: number, details: { priceCost?: number; reason?: SubtractQuantityFormData['reason'] }) => { /* ... */ };
  const handleAddAsset = async (data: AssetFormData) => { /* ... */ };
  const handleUpdateAsset = async (assetId: string, data: AssetFormData) => { /* ... */ };
  const handleDeleteAsset = async (assetId: string) => { /* ... */ };
  const handleImportAssets = (importedAssetsData: AssetFormData[], summary: { successfullyAdded: number; duplicatesSkipped: number; errors: number; errorDetails: string[] }) => { /* ... */ };
  const handleAddDescriptor = async (data: DescriptorFormData) => { /* ... */ };
  const handleUpdateDescriptor = async (descriptorId: string, data: DescriptorFormData) => { /* ... */ };
  const handleDeleteDescriptor = async (descriptorId: string) => { /* ... */ };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-700">Carregando Sistema...</div>;
  }

  const resetTokenFromUrl = location.pathname.startsWith('/reset-password/') ? location.pathname.split('/').pop() : null;

  return (
    <>
      {toast && (
        <div className={`fixed top-5 right-5 p-4 rounded-md shadow-lg text-white z-[100] ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}
      {isForgotPasswordModalOpen && (
        <ForgotPasswordModal
          isOpen={isForgotPasswordModalOpen}
          onClose={() => setIsForgotPasswordModalOpen(false)}
          onSubmit={handleForgotPasswordSubmit}
        />
      )}
      <Routes>
        <Route
            path="/"
            element={
                currentUser ? <Navigate to="/dashboard" /> :
                <LoginPage onLogin={handleLogin} onForgotPassword={() => setIsForgotPasswordModalOpen(true)} />
            }
        />
        <Route path="/reset-password/:token" element={<ForceChangePasswordPage onActualResetPassword={handleActualPasswordReset} onLogout={handleLogout} username="" resetToken={resetTokenFromUrl || undefined} />} />
        <Route
          path="/dashboard"
          element={
            currentUser ? <DashboardLayout currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/" />
          }
        >
          {loading && currentUser ? (
             <Route index element={<div className="flex justify-center items-center h-full p-6 text-gray-600">Carregando dados do dashboard...</div>} />
          ) : (
            <>
              <Route index element={<MainDashboardPage products={products} assets={assets} />} />
              <Route path="users" element={currentUser?.isAdmin ? <UserManagementPage users={appUsers} onAddUser={handleAddUser} onEditUser={handleEditUser} onDeleteUser={handleDeleteUser} onResetPassword={handleResetPasswordByAdmin} /> : <Navigate to="/dashboard" />} />
              <Route path="products/search" element={<ProductSearchPage products={products} productTypes={categories.map(c=>c.name)} onUpdateQuantity={handleUpdateQuantity} />} />
              <Route path="products/add" element={currentUser?.isAdmin ? <ProductAddPage products={products} categories={categories} fornecedores={fornecedores} onAddProduct={handleAddProduct} /> : <Navigate to="/dashboard" />} />
              <Route path="assets" element={<AssetManagementPage assets={assets} users={appUsers} onDeleteAsset={handleDeleteAsset} onImportAssets={handleImportAssets}/>} />
              <Route path="assets/add" element={<AssetAddPage users={appUsers} onAddAsset={handleAddAsset} />} />
              <Route path="assets/edit/:assetId" element={<AssetEditPage assets={assets} users={appUsers} onUpdateAsset={handleUpdateAsset}/>} />
              <Route path="descriptors" element={currentUser?.isAdmin ? <DescriptorManagementPage descriptors={descriptors} onDeleteDescriptor={handleDeleteDescriptor} /> : <Navigate to="/dashboard" />} />
              <Route path="descriptors/add" element={currentUser?.isAdmin ? <DescriptorAddPage onAddDescriptor={handleAddDescriptor} /> : <Navigate to="/dashboard" />} />
              <Route path="descriptors/edit/:descriptorId" element={currentUser?.isAdmin ? <DescriptorEditPage descriptors={descriptors} onUpdateDescriptor={handleUpdateDescriptor} />: <Navigate to="/dashboard" />} />
              <Route path="product-types" element={currentUser?.isAdmin ? <ProductTypeManagementPage categories={categories} onAddProductType={handleAddCategory} onEditProductType={handleEditCategory} onDeleteProductType={handleDeleteCategory} /> : <Navigate to="/dashboard" />} />
              <Route path="logs" element={<MovementLogsPage logs={logs} />} />
              <Route path="reports" element={<ReportsDashboardPage products={products} assets={assets} />} />
              <Route path="admin" element={currentUser?.isAdmin ? <AdminDashboardPage appUsers={appUsers} products={products} assets={assets} descriptors={descriptors} movementLogs={logs} /> : <Navigate to="/dashboard" />} />
              <Route path="*" element={<PlaceholderContent title="Página não encontrada" message="A página que você está procurando não existe ou foi movida." />} />
            </>
          )}
        </Route>
        <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/"} />} />
      </Routes>
    </>
  );
};

export default App;
