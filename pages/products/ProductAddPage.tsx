
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product, ProductFormData, Category, Fornecedor } from '../../types'; 

interface ProductAddPageProps {
  products: Product[]; 
  categories: Category[]; 
  fornecedores: Fornecedor[]; 
  onAddProduct: (data: ProductFormData) => void; 
}

interface ProductAddFormState {
  name: string; 
  description: string;
  price: string; 
  selectedCategoryId: string;
  selectedFornecedorId: string | null;
  barcode: string; // Added barcode to form state
}

const ProductAddPage: React.FC<ProductAddPageProps> = ({ products, categories, fornecedores, onAddProduct }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductAddFormState>({
    name: '',
    description: '',
    price: '',
    selectedCategoryId: categories[0]?.id || '',
    selectedFornecedorId: null,
    barcode: '', // Initialize barcode
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const inputBaseClasses = "mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  useEffect(() => {
    if (categories.length > 0 && !formData.selectedCategoryId) {
        setFormData(prev => ({ ...prev, selectedCategoryId: categories[0].id }));
    }
  }, [categories, formData.selectedCategoryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "selectedFornecedorId" && value === "") {
        setFormData(prev => ({ ...prev, selectedFornecedorId: null }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const parsedPrice = parseFloat(formData.price);

    if (!formData.name.trim() || !formData.description.trim() || !formData.barcode.trim()) {
      setError('Nome, Código de Barras e Descrição são obrigatórios.');
      return;
    }
    if (categories.length > 0 && !formData.selectedCategoryId) {
      setError('Selecione uma categoria válida.');
      return;
    }
     if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Preço deve ser numérico e positivo.');
      return;
    }
    
    // Barcode check (client-side, backend also has unique constraint)
    if (products.some(p => p.barcode === formData.barcode.trim())) {
      setError('Já existe um produto com este código de barras.');
      return;
    }
    
    const productDataToSubmit: ProductFormData = {
        name: formData.name.trim(),
        barcode: formData.barcode.trim(), // Include barcode
        description: formData.description.trim(),
        price: parsedPrice, 
        categoria: formData.selectedCategoryId, 
        fornecedor: formData.selectedFornecedorId || undefined, 
    };

    onAddProduct(productDataToSubmit);
    setSuccessMessage(`Produto "${productDataToSubmit.name}" cadastrado!`);
    setFormData({ 
        name: '', 
        description: '', 
        price: '',
        selectedCategoryId: categories[0]?.id || '', 
        selectedFornecedorId: null,
        barcode: '', 
    }); 
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Cadastrar Novo Produto</h1>
      
      {error && <p className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">{error}</p>}
      {successMessage && <p className="mb-4 text-sm text-green-600 bg-green-100 p-3 rounded-md border border-green-300">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Produto</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required 
                 className={inputBaseClasses} placeholder="Ex: Teclado Logitech K120"/>
        </div>
        
        <div>
          <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">Código de Barras</label>
          <input type="text" name="barcode" id="barcode" value={formData.barcode} onChange={handleChange} required
                 className={inputBaseClasses} placeholder="Ex: 7891234567890"/>
        </div>

        <div>
          <label htmlFor="selectedCategoryId" className="block text-sm font-medium text-gray-700">Categoria</label>
          <select 
            name="selectedCategoryId" 
            id="selectedCategoryId" 
            value={formData.selectedCategoryId} 
            onChange={handleChange} 
            required
            className={inputBaseClasses}
            disabled={categories.length === 0}
          >
            {categories.length === 0 ? (
                <option value="" disabled>Carregando...</option>
            ) : (
                categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
                ))
            )}
          </select>
           {categories.length === 0 && <p className="mt-1 text-xs text-yellow-600">Nenhuma categoria cadastrada.</p>}
        </div>
        
        <div>
          <label htmlFor="selectedFornecedorId" className="block text-sm font-medium text-gray-700">Fornecedor (Opcional)</label>
          <select 
            name="selectedFornecedorId" 
            id="selectedFornecedorId" 
            value={formData.selectedFornecedorId || ''} 
            onChange={handleChange}
            className={inputBaseClasses}
            disabled={fornecedores.length === 0}
          >
            <option value="">Nenhum/Não Especificado</option>
            {fornecedores.map(fornecedor => (
              <option key={fornecedor.id} value={fornecedor.id}>{fornecedor.name}</option>
            ))}
          </select>
           {fornecedores.length === 0 && <p className="mt-1 text-xs text-yellow-600">Nenhum fornecedor cadastrado.</p>}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
          <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0.01" step="0.01"
                 className={inputBaseClasses} placeholder="Ex: 199.90"/>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} required
                    className={inputBaseClasses}></textarea>
        </div>


        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)} 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          >
            Cadastrar Produto
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductAddPage;