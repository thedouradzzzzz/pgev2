import React, { useState, useMemo } from 'react';
import type { Product, AddQuantityFormData, SubtractQuantityFormData } from '../../types'; 
import { COMPANY_OPTIONS } from '../../constants'; // Still used for filter options if Fornecedor names map to these
import AddQuantityModal from '../../components/products/AddQuantityModal';
import SubtractQuantityModal from '../../components/products/SubtractQuantityModal';
import { PlusIcon, MinusIcon } from '../../components/icons/Icons';

interface ProductSearchPageProps {
  products: Product[];
  productTypes: string[]; // These are categoryNames from Category objects
  onUpdateQuantity: (productId: string, amountChange: number, details: { priceCost?: number; reason?: SubtractQuantityFormData['reason'] }) => void;
}

const ProductSearchPage: React.FC<ProductSearchPageProps> = ({ products, productTypes, onUpdateQuantity }) => {
  const [filters, setFilters] = useState({
    name: '', 
    categoryName: '', 
    description: '',
    barcode: '',
    fornecedorName: '', 
    priceMin: '',
    priceMax: '',
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
      const priceMin = parseFloat(filters.priceMin);
      const priceMax = parseFloat(filters.priceMax);
      return (
        (filters.name ? product.name.toLowerCase().includes(filters.name.toLowerCase()) : true) &&
        (filters.categoryName ? product.categoryName === filters.categoryName : true) &&
        (filters.description ? (product.description || '').toLowerCase().includes(filters.description.toLowerCase()) : true) &&
        (filters.barcode ? (product.barcode || '').toLowerCase().includes(filters.barcode.toLowerCase()) : true) &&
        (filters.fornecedorName ? product.fornecedorName === filters.fornecedorName : true) &&
        (filters.priceMin ? product.price >= priceMin : true) &&
        (filters.priceMax ? product.price <= priceMax : true)
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

  const handleConfirmAddQuantity = (data: Omit<AddQuantityFormData, 'productId'>) => { 
    if (selectedProduct) {
      onUpdateQuantity(selectedProduct.id, data.quantity, { priceCost: data.priceCost });
    }
    closeModal();
  };

  const handleConfirmSubtractQuantity = (data: Omit<SubtractQuantityFormData, 'productId'>) => {
    if (selectedProduct) {
      onUpdateQuantity(selectedProduct.id, -data.quantity, { reason: data.reason });
    }
    closeModal();
  };
  
  const clearFilters = () => {
    setFilters({ name: '', categoryName: '', description: '', barcode: '', fornecedorName: '', priceMin: '', priceMax: '' });
  };


  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Buscar Produtos</h1>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
          <input type="text" name="name" placeholder="Nome do Produto" value={filters.name} onChange={handleFilterChange} className={inputBaseClasses}/>
          <select name="categoryName" value={filters.categoryName} onChange={handleFilterChange} className={inputBaseClasses}>
            <option value="">Todas as Categorias</option>
            {productTypes.map(typeName => <option key={typeName} value={typeName}>{typeName}</option>)}
          </select>
          <input type="text" name="description" placeholder="Descrição" value={filters.description} onChange={handleFilterChange} className={inputBaseClasses}/>
          <input type="text" name="barcode" placeholder="Código de Barras" value={filters.barcode} onChange={handleFilterChange} className={inputBaseClasses}/>
          <select name="fornecedorName" value={filters.fornecedorName} onChange={handleFilterChange} className={inputBaseClasses}>
            <option value="">Todos os Fornecedores</option>
            {COMPANY_OPTIONS.map(opt => <option key={opt.value} value={opt.label}>{opt.label}</option>)} 
            {/* Consider populating this from actual Fornecedor names if they don't map to CompanyEnum */}
          </select>
          <input type="number" name="priceMin" placeholder="Preço Mín." value={filters.priceMin} onChange={handleFilterChange} className={inputBaseClasses} min="0" step="0.01"/>
          <input type="number" name="priceMax" placeholder="Preço Máx." value={filters.priceMax} onChange={handleFilterChange} className={inputBaseClasses} min="0" step="0.01"/>
          <button 
            onClick={clearFilters}
            className="xl:col-span-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fornecedor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço (R$)</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cód. Barras</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações de Qtd.</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map(product => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{product.categoryName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{product.fornecedorName || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{product.price.toFixed(2)}</td>
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
        <div className="text-center py-10 text-gray-500">
          Nenhum produto encontrado com os filtros atuais.
        </div>
      )}

      {selectedProduct && (
        <>
          <AddQuantityModal 
            isOpen={isAddModalOpen} 
            onClose={closeModal} 
            onConfirmAdd={(data) => handleConfirmAddQuantity(data)} // Pass productId inside handler
            productName={selectedProduct.name} 
          />
          <SubtractQuantityModal 
            isOpen={isSubtractModalOpen} 
            onClose={closeModal} 
            onConfirmSubtract={(data) => handleConfirmSubtractQuantity(data)} // Pass productId inside handler
            productName={selectedProduct.name}
            currentQuantity={selectedProduct.quantity}
          />
        </>
      )}
    </div>
  );
};

export default ProductSearchPage;