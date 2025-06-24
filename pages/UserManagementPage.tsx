import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, KeyIcon, UserCircleIcon } from '../components/icons/Icons';
import type { AppUser, AddUserFormData, EditUserFormData, ResetPasswordFormData } from '../types'; 
import AddUserModal from '../components/users/AddUserModal';
import EditUserModal from '../components/users/EditUserModal';
import DeleteConfirmationModal from '../components/users/DeleteConfirmationModal';
import ResetPasswordModal from '../components/users/ResetPasswordModal';

interface UserManagementPageProps {
  users: AppUser[];
  onAddUser: (data: AddUserFormData) => void;
  onEditUser: (userId: string, data: EditUserFormData) => void;
  onDeleteUser: (userId: string) => void;
  onResetPassword: (userId: string, newPassword_param: string) => void;
}

// const formatDate = (date: Date) => {
//   if (!date) return 'N/A'; // Handle cases where date might be undefined
//   return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
// };

const UserManagementPage: React.FC<UserManagementPageProps> = ({ users, onAddUser, onEditUser, onDeleteUser, onResetPassword }) => {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);

  const handleAddUserClick = () => setIsAddUserModalOpen(true);
  
  const handleEditUserClick = (user: AppUser) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  const handleDeleteUserClick = (user: AppUser) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleResetPasswordClick = (user: AppUser) => {
    setSelectedUser(user);
    setIsResetPasswordModalOpen(true);
  };

  const closeModal = () => {
    setIsAddUserModalOpen(false);
    setIsEditUserModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsResetPasswordModalOpen(false);
    setSelectedUser(null);
  };

  const onConfirmAddUser = (data: AddUserFormData) => {
    onAddUser(data);
    closeModal();
    // Add toast notification for success
  };

  const onConfirmEditUser = (data: EditUserFormData) => {
    if (!selectedUser) return;
    onEditUser(selectedUser.id, data);
    closeModal();
    // Add toast notification for success
  };

  const onConfirmDeleteUser = () => {
    if (!selectedUser) return;
    onDeleteUser(selectedUser.id);
    closeModal();
    // Add toast notification for success
  };

  const onConfirmResetPassword = (data: ResetPasswordFormData) => {
    if (!selectedUser) return;
    onResetPassword(selectedUser.id, data.newPassword_param);
    closeModal();
    // Add toast notification for success
  };


  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gerenciamento de Usuários</h1>
        <button 
          onClick={handleAddUserClick}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Adicionar Usuário
        </button>
      </div>
      
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
              {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Criação</th> */}
              {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Modificação</th> */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <UserCircleIcon className="h-8 w-8 text-gray-400 mr-3 flex-shrink-0"/>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate" title={user.name}>{user.name}</div>
                      <div className="text-xs text-gray-500 truncate" title={user.email}>{user.email}</div>
                    </div>
                  </div>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' // user.status does not exist
                  }`}>
                    {'Ativo'} // Placeholder as user.status is not available
                  </span>
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.role}</td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{formatDate(user.createdAt)}</td> // user.createdAt does not exist */}
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{formatDate(user.lastModifiedAt)}</td> // user.lastModifiedAt does not exist */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                  <button onClick={() => handleEditUserClick(user)} title="Editar" className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-100 transition"><PencilIcon className="h-5 w-5"/></button>
                  <button onClick={() => handleResetPasswordClick(user)} title="Resetar Senha" className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-100 transition"><KeyIcon className="h-5 w-5"/></button>
                  <button onClick={() => handleDeleteUserClick(user)} title="Excluir" className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition"><TrashIcon className="h-5 w-5"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {users.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Nenhum usuário encontrado.
        </div>
      )}

      {isAddUserModalOpen && (
        <AddUserModal 
          isOpen={isAddUserModalOpen} 
          onClose={closeModal} 
          onAddUser={onConfirmAddUser} 
        />
      )}
      {isEditUserModalOpen && selectedUser && (
        <EditUserModal 
          isOpen={isEditUserModalOpen} 
          onClose={closeModal} 
          onEditUser={onConfirmEditUser}
          currentUser={selectedUser}
        />
      )}
      {isDeleteModalOpen && selectedUser && (
        <DeleteConfirmationModal 
          isOpen={isDeleteModalOpen}
          onClose={closeModal}
          onConfirmDelete={onConfirmDeleteUser}
          userName={selectedUser.name}
        />
      )}
      {isResetPasswordModalOpen && selectedUser && (
        <ResetPasswordModal
          isOpen={isResetPasswordModalOpen}
          onClose={closeModal}
          onResetPassword={onConfirmResetPassword}
          userName={selectedUser.name}
        />
      )}
    </div>
  );
};

export default UserManagementPage;