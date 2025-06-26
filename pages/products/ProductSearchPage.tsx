import React, { useState, useMemo } from 'react';
import type { Product, Category, Fornecedor } from '../../types'; // Adicionado Category e Fornecedor
import AddQuantityModal from '../../components/products/AddQuantityModal';
import SubtractQuantityModal from '../../components/products/SubtractQuantityModal';
import { PlusIcon, MinusIcon } from '../../components/icons/Icons';

interface ProductSearchPageProps {
  products: Product[];
  categories: Category[]; // Alterado de string[] para Category[]
  fornecedores: Fornecedor[]; // Adicionado fornecedores
  onUpdateQuantity: (productId: string, amountChange: number, details: { purchaseOrderNumber?: string; destinationAsset?: string }) => void;
}

const ProductSearchPage: React.FC<ProductSearchPageProps> = ({ products, categories, fornecedores, onUpdateQuantity }) => {
  const [filters, setFilters] = useState({
    name: '',
    categoryName: '',
    description: '',
    barcode: '',
    fornecedorName: '',
    empresa: '',
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubtractModalOpen, setIsSubtractModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const inputBaseClasses = "mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      return (
        (filters.name ? product.name.toLowerCase().includes(filters.name.toLowerCase()) : true) &&
        (filters.categoryName ? product.categoryName === filters.categoryName : true) &&
        (filters.description ? (product.description || '').toLowerCase().includes(filters.description.toLowerCase()) : true) &&
        (filters.barcode ? (product.barcode || '').toLowerCase().includes(filters.barcode.toLowerCase()) : true) &&
        (filters.fornecedorName ? product.fornecedorName === filters.fornecedorName : true) &&
        (filters.empresa ? product.empresa === filters.empresa : true)
      );
    });
  }, [products, filters]);

  const openAddQuantityModal = (product: Product) => {
    setSelectedProduct(product);
    setIsAddModalOpen(true);
  };

  const openSubtractQuantityModal = (product: Product) => {
    setSelectedProduct(product);
    setIsSubtractModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsSubtractModalOpen(false);
    setSelectedProduct(null);
  };
  
  const handleConfirmAddQuantity = (data: { quantity: number; purchaseOrderNumber: string }) => {
    if (selectedProduct) {
      onUpdateQuantity(selectedProduct.id, data.quantity, { purchaseOrderNumber: data.purchaseOrderNumber });
    }
    closeModal();
  };

  const handleConfirmSubtractQuantity = (data: { quantity: number; destinationAsset: string }) => {
    if (selectedProduct) {
      onUpdateQuantity(selectedProduct.id, -data.quantity, { destinationAsset: data.destinationAsset });
    }
    closeModal();
  };

  const clearFilters = () => {
    setFilters({ name: '', categoryName: '', description: '', barcode: '', fornecedorName: '', empresa: '' });
  };

  // CORREÇÃO: Ordenar as listas para os dropdowns
  const sortedCategories = useMemo(() => [...categories].sort((a, b) => a.name.localeCompare(b.name)), [categories]);
  const sortedFornecedores = useMemo(() => [...fornecedores].sort((a, b) => a.name.localeCompare(b.name)), [fornecedores]);

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Buscar Produtos</h1>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
          <input type="text" name="name" placeholder="Nome do Produto" value={filters.name} onChange={handleFilterChange} className={inputBaseClasses}/>
          <select name="categoryName" value={filters.categoryName} onChange={handleFilterChange} className={inputBaseClasses}>
            <option value="">Todas as Categorias</option>
            {sortedCategories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
          </select>
          <input type="text" name="description" placeholder="Descrição" value={filters.description} onChange={handleFilterChange} className={inputBaseClasses}/>
          <input type="text" name="barcode" placeholder="Código de Barras" value={filters.barcode} onChange={handleFilterChange} className={inputBaseClasses}/>
          <select name="fornecedorName" value={filters.fornecedorName} onChange={handleFilterChange} className={inputBaseClasses}>
            <option value="">Todos os Fornecedores</option>
            {sortedFornecedores.map(forn => <option key={forn.id} value={forn.name}>{forn.name}</option>)}
          </select>
          
          <select name="empresa" value={filters.empresa} onChange={handleFilterChange} className={inputBaseClasses}>
            <option value="">Todas as Empresas</option>
            <option value="ABPlast">ABPlast</option>
            <option value="Catarinense Matriz">Catarinense Matriz</option>
            <option value="Catarinense Filial">Catarinense Filial</option>
          </select>

          <button
            onClick={clearFilters}
            className="xl:col-start-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            >
            Limpar Filtros
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Produto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fornecedor</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cód. Barras</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações de Qtd.</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map(product => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{product.name}</div></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{product.empresa}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{product.categoryName || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{product.fornecedorName || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold text-center">{product.quantity}</td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs truncate" title={product.description}>{product.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.barcode || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button onClick={() => openAddQuantityModal(product)} title="Adicionar Quantidade" className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100 transition"><PlusIcon className="h-5 w-5"/></button>
                  <button onClick={() => openSubtractQuantityModal(product)} title="Subtrair Quantidade" className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition" disabled={product.quantity === 0}><MinusIcon className="h-5 w-5"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredProducts.length === 0 && (
        <div className="text-center py-10 text-gray-500">Nenhum produto encontrado com os filtros atuais.</div>
      )}

      {selectedProduct && (
        <>
          <AddQuantityModal isOpen={isAddModalOpen} onClose={closeModal} onConfirmAdd={handleConfirmAddQuantity} productName={selectedProduct.name} />
          <SubtractQuantityModal isOpen={isSubtractModalOpen} onClose={closeModal} onConfirmSubtract={handleConfirmSubtractQuantity} productName={selectedProduct.name} currentQuantity={selectedProduct.quantity} />
        </>
      )}
    </div>
  );
};

export default ProductSearchPage;
