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
import ProductTypeManagementPage from './pages/products/ProductTypeManagementPage';
import MovementLogsPage from './pages/logs/MovementLogsPage';
import ReportsDashboardPage from './pages/reports/ReportsDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import PlaceholderContent from './pages/PlaceholderContent';
import ForceChangePasswordPage from './pages/auth/ForceChangePasswordPage';
import ForgotPasswordModal from './components/auth/ForgotPasswordModal';

import apiService from './src/services/apiService';

import type {
  User, AppUser, Product, Asset, Descriptor, LogEntry, Category, Fornecedor,
  ProductFormData, AssetFormData, DescriptorFormData, AddUserFormData,
  EditUserFormData, AddQuantityFormData, SubtractQuantityFormData, ForgotPasswordFormData,
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

  const addLog = useCallback(async (actionType: LogEntryActionType, description: string, details?: Record<string, any>) => {
    if (!currentUser) {
      console.error("Não é possível registrar log: usuário não está logado.");
      return;
    }
    const logData = {
      userId: currentUser.id,
      username: currentUser.username,
      actionType,
      description,
      details,
    };
    try {
      await apiService.createLog(logData);
      const newLogEntryForState: LogEntry = {
        ...logData,
        id: Date.now().toString(),
        timestamp: new Date(),
      };
      setLogs(prevLogs => [newLogEntryForState, ...prevLogs]);
    } catch (err) {
      console.error("Falha ao salvar log no servidor:", err);
    }
  }, [currentUser]);

  const handleLogin = async (email: string, password_param: string): Promise<boolean> => {
    setError(null);
    try {
      const loginResponse = await apiService.login(email, password_param);

      if (loginResponse.success && loginResponse.data) {
        if (loginResponse.data.requiresPasswordChange) {
          sessionStorage.setItem('passwordChangeUserId', String(loginResponse.data.userId));
          navigate('/force-change-password');
          return true;
        }

        if (loginResponse.data.token && loginResponse.data.user) {
          const { token, user } = loginResponse.data;
          const userToStore: User = { id: String(user.id), username: user.name, isAdmin: user.role === 'admin', token: token };
          localStorage.setItem('currentUser', JSON.stringify(userToStore));
          setCurrentUser(userToStore);
          showToast('Login bem-sucedido!', 'success');
          navigate('/dashboard');
          return true;
        }
      }
      throw new Error(loginResponse.message || "Resposta inválida do servidor.");

    } catch (err: any) {
      setError(err.message || 'Erro de login.');
      try {
        await apiService.createLog({
            userId: '0',
            username: 'System',
            actionType: LogEntryActionType.USER_LOGIN_FAIL,
            description: `Tentativa de login falhou para o email: ${email}. Erro: ${err.message}`
        });
      } catch (logErr) {
        console.error("Falha ao registrar log de falha de login:", logErr);
      }
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
    setAppUsers([]); setProducts([]); setCategories([]); setFornecedores([]); setAssets([]); setDescriptors([]); setLogs([]);
    showToast('Logout realizado com sucesso.', 'success');
    navigate('/');
  };

  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
        const [usersResponse, productsResponse, assetsResponse, categoriesResponse, fornecedoresResponse, logsResponse] = await Promise.all([
            apiService.fetchUsers(),
            apiService.fetchProducts(),
            apiService.fetchAssets(),
            apiService.fetchCategories(),
            apiService.fetchFornecedores(),
            apiService.fetchLogs(),
        ]);

        if (usersResponse.success) setAppUsers(usersResponse.data);
        else showToast(usersResponse.message || 'Falha ao buscar usuários.', 'error');

        if (productsResponse.success) setProducts(productsResponse.data);
        else showToast(productsResponse.message || 'Falha ao buscar produtos.', 'error');

        if (assetsResponse.success) setAssets(assetsResponse.data);
        else showToast(assetsResponse.message || 'Falha ao buscar ativos.', 'error');

        if (categoriesResponse.success) {
            const sortedCategories = [...categoriesResponse.data].sort((a, b) => a.name.localeCompare(b.name));
            setCategories(sortedCategories);
        } else showToast(categoriesResponse.message || 'Falha ao buscar categorias.', 'error');

        if (fornecedoresResponse.success) {
            const sortedFornecedores = [...fornecedoresResponse.data].sort((a, b) => a.name.localeCompare(b.name));
            setFornecedores(sortedFornecedores);
        } else showToast(fornecedoresResponse.message || 'Falha ao buscar fornecedores.', 'error');
        
        if (logsResponse.success) setLogs(logsResponse.data);
        else showToast(logsResponse.message || 'Falha ao buscar logs.', 'error');

    } catch (error: any) {
        console.error("Erro crítico ao buscar dados:", error);
        showToast(error.message || 'Erro de comunicação ao carregar dados.', 'error');
        if (error.message.includes('Não autorizado')) {
            handleLogout();
        }
    } finally {
        setLoading(false);
    }
  }, [currentUser]);

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
    if (currentUser?.token) {
        fetchData();
        addLog(LogEntryActionType.USER_LOGIN_SUCCESS, `Usuário ${currentUser.username} logado com sucesso.`);
    } else {
        setAppUsers([]); setProducts([]); setCategories([]); setFornecedores([]); setAssets([]); setDescriptors([]); setLogs([]);
    }
  }, [currentUser?.token]);

  const handleForgotPasswordSubmit = async (data: ForgotPasswordFormData) => { /* ... */ };

  const handleActualResetPassword = async (userId: string, newPassword_param: string): Promise<boolean> => {
    try {
      const response = await apiService.forceChangePassword(userId, newPassword_param);
      if (response.success) {
        showToast('Senha alterada com sucesso! Faça o login novamente.', 'success');
        sessionStorage.removeItem('passwordChangeUserId');
        return true;
      }
      throw new Error(response.message || 'Falha ao alterar a senha.');
    } catch (err: any) {
      showToast(`Erro: ${err.message}`, 'error');
      return false;
    }
  };

  const handleAddUser = async (data: AddUserFormData & { forcePasswordChange: boolean }) => {
    try {
      const response = await apiService.registerUser(data);
      if (response.success && response.data) {
        setAppUsers(prevUsers => [...prevUsers, response.data].sort((a,b) => a.name.localeCompare(b.name)));
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

  const handleEditUser = async (userId: string, data: EditUserFormData) => {
    try {
      const response = await apiService.updateUser(userId, data);
      if(response.success && response.data) {
        setAppUsers(prevUsers => prevUsers.map(u => (u.id === Number(userId) ? response.data : u)));
        showToast('Usuário atualizado com sucesso!', 'success');
        addLog(LogEntryActionType.USER_UPDATED, `Usuário '${data.name}' (ID: ${userId}) foi atualizado.`);
      } else {
        throw new Error(response.message || 'Falha ao atualizar usuário.');
      }
    } catch (err: any) {
      showToast(`Erro ao editar usuário: ${err.message}`, 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário? Esta ação é irreversível.')) {
        return;
    }
    try {
      const response = await apiService.deleteUser(userId);
      if(response.success) {
        setAppUsers(prevUsers => prevUsers.filter(u => u.id !== Number(userId)));
        showToast('Usuário deletado com sucesso.', 'success');
        addLog(LogEntryActionType.USER_DELETED, `Usuário com ID: ${userId} foi deletado.`);
      } else {
        throw new Error(response.message || 'Falha ao deletar usuário.');
      }
    } catch (err: any) {
      showToast(`Erro ao deletar usuário: ${err.message}`, 'error');
    }
  };

  const handleUpdateQuantity = async (productId: string, amountChange: number, details: { purchaseOrderNumber?: string; destinationAsset?: string }) => {
    try {
      const response = await apiService.updateProductQuantity(productId, amountChange, details);
      if (response.success && response.data) {
        setProducts(prevProducts => prevProducts.map(p => (p.id.toString() === productId ? response.data : p)));
        showToast('Quantidade atualizada com sucesso!', 'success');
      } else {
        throw new Error(response.message || 'Falha ao atualizar a quantidade.');
      }
    } catch (err: any) {
      showToast(`Erro: ${err.message}`, 'error');
    }
  };

  const handleResetPasswordByAdmin = async (userId: string, newPassword_param: string) => { /* ... */ };

  const handleAddCategory = async (name: string, description?: string): Promise<boolean> => {
    try {
        const response = await apiService.createCategory({ name, description });
        if (response.success && response.data) {
            setCategories(prev => [...prev, response.data].sort((a,b) => a.name.localeCompare(b.name)));
            showToast('Categoria adicionada com sucesso!', 'success');
            addLog(LogEntryActionType.CATEGORY_CREATED, `Categoria '${name}' foi criada.`);
            return true;
        }
        throw new Error(response.message || 'Falha ao criar categoria.');
    } catch (err: any) {
        showToast(`Erro: ${err.message}`, 'error');
        return false;
    }
  };

  const handleAddFornecedor = async (name: string, contact_info?: string): Promise<boolean> => {
    try {
        const response = await apiService.createFornecedor({ name, contact_info });
        if (response.success && response.data) {
            setFornecedores(prev => [...prev, response.data].sort((a,b) => a.name.localeCompare(b.name)));
            showToast('Fornecedor adicionado com sucesso!', 'success');
            addLog(LogEntryActionType.FORNECEDOR_CREATED, `Fornecedor '${name}' foi criado.`);
            return true;
        }
        throw new Error(response.message || 'Falha ao criar fornecedor.');
    } catch (err: any) {
        showToast(`Erro: ${err.message}`, 'error');
        return false;
    }
  };

  // <-- FUNÇÃO ADICIONADA -->
  const handleEditCategory = async (id: string, name: string, description?: string): Promise<boolean> => {
    try {
        const response = await apiService.updateCategory(id, { name, description });
        if (response.success && response.data) {
            setCategories(prev => prev.map(c => c.id === id ? response.data : c).sort((a,b) => a.name.localeCompare(b.name)));
            showToast('Categoria atualizada com sucesso!', 'success');
            // Adicione um log se desejar
            return true;
        }
        throw new Error(response.message || 'Falha ao atualizar categoria.');
    } catch (err: any) {
        showToast(`Erro: ${err.message}`, 'error');
        return false;
    }
  };
  
  // <-- FUNÇÃO ADICIONADA -->
  const handleEditFornecedor = async (id: string, name: string, contact_info?: string): Promise<boolean> => {
    try {
        const response = await apiService.updateFornecedor(id, { name, contact_info });
        if (response.success && response.data) {
            setFornecedores(prev => prev.map(f => f.id === id ? response.data : f).sort((a,b) => a.name.localeCompare(b.name)));
            showToast('Fornecedor atualizado com sucesso!', 'success');
            // Adicione um log se desejar
            return true;
        }
        throw new Error(response.message || 'Falha ao atualizar fornecedor.');
    } catch (err: any) {
        showToast(`Erro: ${err.message}`, 'error');
        return false;
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    try {
      const response = await apiService.deleteCategory(id);
      if (response.success) {
        setCategories(prev => prev.filter(c => c.id !== id).sort((a,b) => a.name.localeCompare(b.name)));
        showToast('Categoria deletada com sucesso.', 'success');
        addLog(LogEntryActionType.CATEGORY_DELETED, `Categoria '${name}' (ID: ${id}) foi deletada.`);
      } else {
        throw new Error(response.message || 'Falha ao deletar categoria.');
      }
    } catch (err: any) {
      showToast(`Erro: ${err.message}`, 'error');
    }
  };

  const handleDeleteFornecedor = async (id: string, name: string) => {
    try {
      const response = await apiService.deleteFornecedor(id);
      if (response.success) {
        setFornecedores(prev => prev.filter(f => f.id !== id).sort((a,b) => a.name.localeCompare(b.name)));
        showToast('Fornecedor deletado com sucesso.', 'success');
        addLog(LogEntryActionType.FORNECEDOR_DELETED, `Fornecedor '${name}' (ID: ${id}) foi deletada.`);
      } else {
        throw new Error(response.message || 'Falha ao deletar fornecedor.');
      }
    } catch (err: any) {
      showToast(`Erro: ${err.message}`, 'error');
    }
  };

  const handleAddProduct = async (data: Omit<ProductFormData, 'price'> & { empresa: string }) => {
    try {
      const response = await apiService.createProduct(data);
      if (response.success && response.data) {
        setProducts(prevProducts => [...prevProducts, response.data].sort((a, b) => a.name.localeCompare(b.name)));
        showToast(`Produto '${response.data.name}' cadastrado com sucesso!`, 'success');
        addLog(LogEntryActionType.PRODUCT_CREATED, `Produto '${response.data.name}' foi cadastrado.`);
      } else {
        throw new Error(response.message || 'Falha ao cadastrar o produto.');
      }
    } catch (err: any) {
      showToast(`Erro ao cadastrar produto: ${err.message}`, 'error');
    }
  };

  const handleAddAsset = async (data: AssetFormData) => { /* ... */ };
  const handleUpdateAsset = async (assetId: string, data: AssetFormData) => { /* ... */ };
  
  const handleDeleteAsset = async (assetId: string) => {
    if (!window.confirm('Tem certeza que deseja deletar este ativo? Esta ação é irreversível.')) {
        return;
    }
    try {
      const response = await apiService.deleteAsset(assetId); 
      if (response.success) {
        setAssets(prevAssets => prevAssets.filter(asset => String(asset.id) !== assetId));
        showToast('Ativo deletado com sucesso.', 'success');
        addLog(LogEntryActionType.ASSET_DELETED, `Ativo com ID ${assetId} foi deletado.`);
      } else {
        throw new Error(response.message || 'Falha ao deletar o ativo.');
      }
    } catch (err: any) {
      showToast(`Erro ao deletar ativo: ${err.message}`, 'error');
    }
  };

  const handleAddDescriptor = async (data: DescriptorFormData) => { /* ... */ };
  const handleUpdateDescriptor = async (descriptorId: string, data: DescriptorFormData) => { /* ... */ };
  const handleDeleteDescriptor = async (descriptorId: string) => { /* ... */ };

  if (loading && !currentUser) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-700">Carregando Sistema...</div>;
  }

  return (
    <>
      {toast && ( <div className={`fixed top-5 right-5 p-4 rounded-md shadow-lg text-white z-[100] ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{toast.message}</div> )}
      {isForgotPasswordModalOpen && ( <ForgotPasswordModal isOpen={isForgotPasswordModalOpen} onClose={() => setIsForgotPasswordModalOpen(false)} onSubmit={handleForgotPasswordSubmit} /> )}
      <Routes>
        <Route path="/" element={ currentUser ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} onForgotPassword={() => setIsForgotPasswordModalOpen(true)} /> } />
        <Route path="/force-change-password" element={<ForceChangePasswordPage onActualResetPassword={handleActualResetPassword} onLogout={handleLogout} />} />
        <Route path="/dashboard" element={ currentUser ? <DashboardLayout currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/" /> }>
          {loading && currentUser ? (
             <Route index element={<div className="flex justify-center items-center h-full p-6 text-gray-600">Carregando dados do dashboard...</div>} />
          ) : (
            <>
              <Route index element={<MainDashboardPage products={products} assets={assets} />} />
              <Route path="users" element={currentUser?.isAdmin ? <UserManagementPage users={appUsers} onAddUser={handleAddUser} onEditUser={handleEditUser} onDeleteUser={handleDeleteUser} onResetPassword={handleResetPasswordByAdmin} /> : <Navigate to="/dashboard" />} />
              <Route path="products/search" element={<ProductSearchPage products={products} categories={categories} fornecedores={fornecedores} onUpdateQuantity={handleUpdateQuantity} />} />
              <Route path="products/add" element={currentUser?.isAdmin ? <ProductAddPage products={products} categories={categories} fornecedores={fornecedores} onAddProduct={handleAddProduct} /> : <Navigate to="/dashboard" />} />
              <Route path="assets" element={<AssetManagementPage assets={assets} users={appUsers} onDeleteAsset={handleDeleteAsset} onDataNeedsRefresh={fetchData} />} />
              <Route path="assets/add" element={<AssetAddPage users={appUsers} onAddAsset={handleAddAsset} />} />
              <Route path="assets/edit/:assetId" element={<AssetEditPage assets={assets} users={appUsers} onUpdateAsset={handleUpdateAsset}/>} />
              {/* ATUALIZADO AQUI */}
              <Route path="product-types" element={currentUser?.isAdmin ? <ProductTypeManagementPage categories={categories} fornecedores={fornecedores} onAddProductType={handleAddCategory} onEditProductType={handleEditCategory} onDeleteProductType={handleDeleteCategory} onAddFornecedor={handleAddFornecedor} onEditFornecedor={handleEditFornecedor} onDeleteFornecedor={handleDeleteFornecedor} /> : <Navigate to="/dashboard" />} />
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
