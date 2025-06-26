import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import { PlusIcon, TrashIcon, PencilIcon } from '../../components/icons/Icons'; // <-- Adicionado PencilIcon
import type { Category, Fornecedor } from '../../types';

interface ManagementPageProps {
  categories: Category[];
  fornecedores: Fornecedor[];
  onAddProductType: (name: string, description?: string) => Promise<boolean>;
  onEditProductType: (id: string, name: string, description?: string) => Promise<boolean>; // <-- Adicionado
  onDeleteProductType: (id: string, name: string) => Promise<void>;
  onAddFornecedor: (name: string, contact_info?: string) => Promise<boolean>;
  onEditFornecedor: (id: string, name: string, contact_info?: string) => Promise<boolean>; // <-- Adicionado
  onDeleteFornecedor: (id: string, name: string) => Promise<void>;
}

type ActiveTab = 'categories' | 'fornecedores';
type Item = Category | Fornecedor;

const ProductTypeManagementPage: React.FC<ManagementPageProps> = ({
  categories,
  fornecedores,
  onAddProductType,
  onEditProductType,
  onDeleteProductType,
  onAddFornecedor,
  onEditFornecedor,
  onDeleteFornecedor,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('categories');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // <-- Adicionado
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [modalError, setModalError] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null); // <-- Adicionado

  const [categoryFormData, setCategoryFormData] = useState({ id: '', name: '', description: '' });
  const [fornecedorFormData, setFornecedorFormData] = useState({ id: '', name: '', contact_info: '' });

  const inputBaseClasses = "mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
  const textareaBaseClasses = `${inputBaseClasses} min-h-[60px]`;
  
  // Efeito para resetar o formulário de edição quando o modal é aberto com um novo item
  useEffect(() => {
    if (itemToEdit) {
        if ('description' in itemToEdit) { // É uma Categoria
            setCategoryFormData({ id: itemToEdit.id, name: itemToEdit.name, description: itemToEdit.description || '' });
        } else { // É um Fornecedor
            setFornecedorFormData({ id: itemToEdit.id, name: itemToEdit.name, contact_info: itemToEdit.contact_info || '' });
        }
    }
  }, [itemToEdit]);

  const openAddModal = () => {
    setModalError(null);
    setCategoryFormData({ id: '', name: '', description: '' });
    setFornecedorFormData({ id: '', name: '', contact_info: '' });
    setIsAddModalOpen(true);
  };
  
  const openEditModal = (item: Item) => {
    setModalError(null);
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (item: Item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
    setModalError(null);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    let success = false;

    if (activeTab === 'categories') {
      if (!categoryFormData.name.trim()) { setModalError('O nome da categoria não pode ser vazio.'); return; }
      success = await onAddProductType(categoryFormData.name.trim(), categoryFormData.description.trim() || undefined);
    } else {
      if (!fornecedorFormData.name.trim()) { setModalError('O nome do fornecedor não pode ser vazio.'); return; }
      success = await onAddFornecedor(fornecedorFormData.name.trim(), fornecedorFormData.contact_info.trim() || undefined);
    }

    if (success) closeModal();
    else setModalError(`Falha ao adicionar. Verifique se o nome já existe.`);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (!itemToEdit) return;

    let success = false;
    if (activeTab === 'categories') {
        if (!categoryFormData.name.trim()) { setModalError('O nome da categoria não pode ser vazio.'); return; }
        success = await onEditProductType(itemToEdit.id, categoryFormData.name.trim(), categoryFormData.description.trim() || undefined);
    } else {
        if (!fornecedorFormData.name.trim()) { setModalError('O nome do fornecedor não pode ser vazio.'); return; }
        success = await onEditFornecedor(itemToEdit.id, fornecedorFormData.name.trim(), fornecedorFormData.contact_info.trim() || undefined);
    }

    if (success) closeModal();
    else setModalError(`Falha ao editar. Verifique se o nome já existe.`);
  };
  
  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      if(activeTab === 'categories') await onDeleteProductType(itemToDelete.id, itemToDelete.name);
      else await onDeleteFornecedor(itemToDelete.id, itemToDelete.name);
      closeModal();
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gerenciar Cadastros</h1>
        <button onClick={openAddModal} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150">
          <PlusIcon className="h-5 w-5 mr-2" />
          {activeTab === 'categories' ? 'Adicionar Categoria' : 'Adicionar Fornecedor'}
        </button>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button onClick={() => setActiveTab('categories')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${ activeTab === 'categories' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' }`}>Categorias</button>
          <button onClick={() => setActiveTab('fornecedores')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${ activeTab === 'fornecedores' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300' }`}>Fornecedores</button>
        </nav>
      </div>

      <div>
        {activeTab === 'categories' && (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome da Categoria</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th></tr></thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (<tr key={category.id} className="hover:bg-gray-50"><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td><td className="px-6 py-4 text-sm text-gray-500">{category.description || '-'}</td><td className="px-6 py-4 whitespace-nowrap space-x-2"><button onClick={() => openEditModal(category)} title="Editar" className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-100 transition"><PencilIcon className="h-5 w-5"/></button><button onClick={() => openDeleteModal(category)} title="Excluir" className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition"><TrashIcon className="h-5 w-5"/></button></td></tr>))}
              </tbody>
            </table>
            {categories.length === 0 && <p className="text-gray-500 text-center py-8">Nenhuma categoria cadastrada.</p>}
          </div>
        )}
        {activeTab === 'fornecedores' && (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Fornecedor</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Informações de Contato</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th></tr></thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fornecedores.map((fornecedor) => (<tr key={fornecedor.id} className="hover:bg-gray-50"><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fornecedor.name}</td><td className="px-6 py-4 text-sm text-gray-500">{fornecedor.contact_info || '-'}</td><td className="px-6 py-4 whitespace-nowrap space-x-2"><button onClick={() => openEditModal(fornecedor)} title="Editar" className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-100 transition"><PencilIcon className="h-5 w-5"/></button><button onClick={() => openDeleteModal(fornecedor)} title="Excluir" className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition"><TrashIcon className="h-5 w-5"/></button></td></tr>))}
              </tbody>
            </table>
            {fornecedores.length === 0 && <p className="text-gray-500 text-center py-8">Nenhum fornecedor cadastrado.</p>}
          </div>
        )}
      </div>

      {/* Modal de Adição */}
      <Modal isOpen={isAddModalOpen} onClose={closeModal} title={activeTab === 'categories' ? 'Adicionar Nova Categoria' : 'Adicionar Novo Fornecedor'} footer={<><button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Cancelar</button><button type="submit" form="addForm" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Adicionar</button></>}>
        <form id="addForm" onSubmit={handleAddSubmit} className="space-y-4">
          {modalError && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">{modalError}</p>}
          {activeTab === 'categories' ? (
            <>
              <div><label htmlFor="categoryNameAdd" className="block text-sm font-medium text-gray-700">Nome da Categoria</label><input type="text" id="categoryNameAdd" value={categoryFormData.name} onChange={(e) => setCategoryFormData(prev => ({...prev, name: e.target.value}))} required className={inputBaseClasses}/></div>
              <div><label htmlFor="categoryDescAdd" className="block text-sm font-medium text-gray-700">Descrição (Opcional)</label><textarea id="categoryDescAdd" value={categoryFormData.description} onChange={(e) => setCategoryFormData(prev => ({...prev, description: e.target.value}))} className={textareaBaseClasses}/></div>
            </>
          ) : (
            <>
              <div><label htmlFor="fornecedorNameAdd" className="block text-sm font-medium text-gray-700">Nome do Fornecedor</label><input type="text" id="fornecedorNameAdd" value={fornecedorFormData.name} onChange={(e) => setFornecedorFormData(prev => ({...prev, name: e.target.value}))} required className={inputBaseClasses}/></div>
              <div><label htmlFor="fornecedorContactAdd" className="block text-sm font-medium text-gray-700">Informações de Contato (Opcional)</label><textarea id="fornecedorContactAdd" value={fornecedorFormData.contact_info} onChange={(e) => setFornecedorFormData(prev => ({...prev, contact_info: e.target.value}))} className={textareaBaseClasses}/></div>
            </>
          )}
        </form>
      </Modal>

      {/* Modal de Edição */}
      <Modal isOpen={isEditModalOpen} onClose={closeModal} title={activeTab === 'categories' ? 'Editar Categoria' : 'Editar Fornecedor'} footer={<><button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Cancelar</button><button type="submit" form="editForm" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">Salvar Alterações</button></>}>
        <form id="editForm" onSubmit={handleEditSubmit} className="space-y-4">
          {modalError && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">{modalError}</p>}
          {activeTab === 'categories' ? (
            <>
              <div><label htmlFor="categoryNameEdit" className="block text-sm font-medium text-gray-700">Nome da Categoria</label><input type="text" id="categoryNameEdit" value={categoryFormData.name} onChange={(e) => setCategoryFormData(prev => ({...prev, name: e.target.value}))} required className={inputBaseClasses}/></div>
              <div><label htmlFor="categoryDescEdit" className="block text-sm font-medium text-gray-700">Descrição (Opcional)</label><textarea id="categoryDescEdit" value={categoryFormData.description} onChange={(e) => setCategoryFormData(prev => ({...prev, description: e.target.value}))} className={textareaBaseClasses}/></div>
            </>
          ) : (
            <>
              <div><label htmlFor="fornecedorNameEdit" className="block text-sm font-medium text-gray-700">Nome do Fornecedor</label><input type="text" id="fornecedorNameEdit" value={fornecedorFormData.name} onChange={(e) => setFornecedorFormData(prev => ({...prev, name: e.target.value}))} required className={inputBaseClasses}/></div>
              <div><label htmlFor="fornecedorContactEdit" className="block text-sm font-medium text-gray-700">Informações de Contato (Opcional)</label><textarea id="fornecedorContactEdit" value={fornecedorFormData.contact_info} onChange={(e) => setFornecedorFormData(prev => ({...prev, contact_info: e.target.value}))} className={textareaBaseClasses}/></div>
            </>
          )}
        </form>
      </Modal>

      {/* Modal de Exclusão */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeModal} title="Confirmar Exclusão" footer={<><button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Cancelar</button><button type="button" onClick={handleDeleteConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700">Excluir</button></>}>
        <p className="text-sm text-gray-600">Tem certeza que deseja excluir <strong className="font-medium text-gray-800">{itemToDelete?.name}</strong>? Esta ação não pode ser desfeita.</p>
      </Modal>
    </div>
  );
};

export default ProductTypeManagementPage;
