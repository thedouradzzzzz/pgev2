import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import { PlusIcon, PencilIcon, TrashIcon } from '../../components/icons/Icons';
import type { Category } from '../../types';

interface CategoryManagementPageProps {
  categories: Category[];
  onAddProductType: (name: string, description?: string) => Promise<boolean>; 
  onEditProductType: (id: string, newName: string, newDescription?: string) => Promise<boolean>; 
  onDeleteProductType: (id: string) => Promise<void>;
}

const ProductTypeManagementPage: React.FC<CategoryManagementPageProps> = ({
  categories,
  onAddProductType,
  onEditProductType,
  onDeleteProductType,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [currentCategoryName, setCurrentCategoryName] = useState('');
  const [currentCategoryDescription, setCurrentCategoryDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const inputBaseClasses = "mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
  const textareaBaseClasses = `${inputBaseClasses} min-h-[60px]`;


  const openAddModal = () => {
    setCurrentCategoryName('');
    setCurrentCategoryDescription('');
    setModalError(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setCurrentCategoryName(category.name);
    setCurrentCategoryDescription(category.description || '');
    setModalError(null);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setModalError(null); // Clear previous errors
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
    setCurrentCategoryName('');
    setCurrentCategoryDescription('');
    setModalError(null);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (!currentCategoryName.trim()) {
      setModalError('O nome da categoria não pode ser vazio.');
      return;
    }
    const success = await onAddProductType(currentCategoryName.trim(), currentCategoryDescription.trim() || undefined);
    if (success) {
      closeModal();
    } else {
      // Error message is typically handled by onAddProductType via toast in App.tsx
      setModalError('Falha ao adicionar categoria. Verifique se já existe ou tente novamente.');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (!selectedCategory || !currentCategoryName.trim()) {
      setModalError('O nome da categoria não pode ser vazio.');
      return;
    }
    const success = await onEditProductType(selectedCategory.id, currentCategoryName.trim(), currentCategoryDescription.trim() || undefined);
    if (success) {
      closeModal();
    } else {
      setModalError('Falha ao editar categoria. Verifique se o novo nome já existe ou tente novamente.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedCategory) {
      await onDeleteProductType(selectedCategory.id);
      // Success/error messages are handled by onDeleteProductType in App.tsx
      // We might want to setModalError here if onDeleteProductType returns a boolean or throws for UI feedback
      closeModal();
    }
  };
  
  const sortedCategories = [...categories].sort((a,b) => a.name.localeCompare(b.name));

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gerenciar Categorias de Produto</h1>
        <button
          onClick={openAddModal}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Adicionar Categoria
        </button>
      </div>

      {sortedCategories.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Nenhuma categoria cadastrada.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome da Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-md truncate" title={category.description}>{category.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                    <button onClick={() => openEditModal(category)} title="Editar" className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-100 transition"><PencilIcon className="h-5 w-5"/></button>
                    <button onClick={() => openDeleteModal(category)} title="Excluir" className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition"><TrashIcon className="h-5 w-5"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={closeModal} 
        title="Adicionar Nova Categoria"
        footer={
          <>
            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Cancelar</button>
            <button type="submit" form="addCategoryForm" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Adicionar</button>
          </>
        }
      >
        <form id="addCategoryForm" onSubmit={handleAddSubmit} className="space-y-4">
          {modalError && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">{modalError}</p>}
          <div>
            <label htmlFor="categoryNameAdd" className="block text-sm font-medium text-gray-700">Nome da Categoria</label>
            <input type="text" name="categoryNameAdd" id="categoryNameAdd" value={currentCategoryName} onChange={(e) => setCurrentCategoryName(e.target.value)} required className={inputBaseClasses}/>
          </div>
          <div>
            <label htmlFor="categoryDescAdd" className="block text-sm font-medium text-gray-700">Descrição (Opcional)</label>
            <textarea name="categoryDescAdd" id="categoryDescAdd" value={currentCategoryDescription} onChange={(e) => setCurrentCategoryDescription(e.target.value)} className={textareaBaseClasses}/>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={closeModal} 
        title={`Editar Categoria: ${selectedCategory?.name}`}
        footer={
          <>
            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Cancelar</button>
            <button type="submit" form="editCategoryForm" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Salvar</button>
          </>
        }
      >
        <form id="editCategoryForm" onSubmit={handleEditSubmit} className="space-y-4">
          {modalError && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">{modalError}</p>}
          <div>
            <label htmlFor="categoryNameEdit" className="block text-sm font-medium text-gray-700">Novo Nome da Categoria</label>
            <input type="text" name="categoryNameEdit" id="categoryNameEdit" value={currentCategoryName} onChange={(e) => setCurrentCategoryName(e.target.value)} required className={inputBaseClasses}/>
          </div>
           <div>
            <label htmlFor="categoryDescEdit" className="block text-sm font-medium text-gray-700">Nova Descrição (Opcional)</label>
            <textarea name="categoryDescEdit" id="categoryDescEdit" value={currentCategoryDescription} onChange={(e) => setCurrentCategoryDescription(e.target.value)} className={textareaBaseClasses}/>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={closeModal} 
        title="Confirmar Exclusão"
        footer={
          <>
            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Cancelar</button>
            <button type="button" onClick={handleDeleteConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700">Excluir</button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Tem certeza que deseja excluir a categoria <strong className="font-medium text-gray-800">{selectedCategory?.name}</strong>? 
          Esta ação não pode ser desfeita. Se esta categoria estiver em uso por produtos, você poderá encontrar erros ou inconsistências.
        </p>
         {modalError && <p className="mt-2 text-sm text-red-600">{modalError}</p>}
      </Modal>
    </div>
  );
};

export default ProductTypeManagementPage;