import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product, ProductFormData, Category, Fornecedor } from '../../types';

interface ProductAddPageProps {
  products: Product[];
  categories: Category[];
  fornecedores: Fornecedor[];
  onAddProduct: (data: Omit<ProductFormData, 'price'> & { empresa: string }) => void;
}

interface ProductAddFormState {
  name: string;
  description: string;
  empresa: string;
  categoria_id: string;
  fornecedor_id: string;
  barcode: string;
}

const ProductAddPage: React.FC<ProductAddPageProps> = ({ products, categories, fornecedores, onAddProduct }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductAddFormState>({
    name: '',
    description: '',
    empresa: 'ABPlast',
    categoria_id: '',
    fornecedor_id: '',
    barcode: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const inputBaseClasses = "mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  useEffect(() => {
    if (categories.length > 0 && !formData.categoria_id) {
        setFormData(prev => ({ ...prev, categoria_id: categories[0].id }));
    }
  }, [categories, formData.categoria_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!formData.name.trim() || !formData.barcode.trim() || !formData.empresa) {
      setError('Nome, Código de Barras e Empresa são obrigatórios.');
      return;
    }
    if (categories.length > 0 && !formData.categoria_id) {
      setError('Selecione uma categoria válida.');
      return;
    }
    if (products.some(p => p.barcode === formData.barcode.trim())) {
      setError('Já existe um produto com este código de barras.');
      return;
    }

    const productDataToSubmit = {
        name: formData.name.trim(),
        barcode: formData.barcode.trim(),
        description: formData.description.trim(),
        empresa: formData.empresa,
        categoria_id: formData.categoria_id,
        fornecedor_id: formData.fornecedor_id || undefined,
    };

    onAddProduct(productDataToSubmit);
    setSuccessMessage(`Produto "${productDataToSubmit.name}" cadastrado com sucesso!`);
    setFormData({
        name: '',
        description: '',
        empresa: 'ABPlast',
        categoria_id: categories[0]?.id || '',
        fornecedor_id: '',
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
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={inputBaseClasses} placeholder="Ex: Teclado Logitech K120"/>
        </div>
        <div>
          <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">Código de Barras</label>
          <input type="text" name="barcode" id="barcode" value={formData.barcode} onChange={handleChange} required className={inputBaseClasses} placeholder="Ex: 7891234567890"/>
        </div>
        <div>
          <label htmlFor="empresa" className="block text-sm font-medium text-gray-700">Empresa</label>
          <select name="empresa" id="empresa" value={formData.empresa} onChange={handleChange} required className={inputBaseClasses}>
            <option value="ABPlast">ABPlast</option>
            <option value="Catarinense Matriz">Catarinense Matriz</option>
            <option value="Catarinense Filial">Catarinense Filial</option>
          </select>
        </div>
        <div>
          <label htmlFor="categoria_id" className="block text-sm font-medium text-gray-700">Categoria</label>
          <select name="categoria_id" id="categoria_id" value={formData.categoria_id} onChange={handleChange} required className={inputBaseClasses} disabled={categories.length === 0}>
            {categories.length === 0 ? (<option value="" disabled>Carregando...</option>) : (categories.map(category => (<option key={category.id} value={category.id}>{category.name}</option>)))}
          </select>
           {categories.length === 0 && <p className="mt-1 text-xs text-yellow-600">Nenhuma categoria cadastrada.</p>}
        </div>
        <div>
          <label htmlFor="fornecedor_id" className="block text-sm font-medium text-gray-700">Fornecedor (Opcional)</label>
          <select name="fornecedor_id" id="fornecedor_id" value={formData.fornecedor_id || ''} onChange={handleChange} className={inputBaseClasses} disabled={fornecedores.length === 0}>
            <option value="">Nenhum/Não Especificado</option>
            {fornecedores.map(fornecedor => (<option key={fornecedor.id} value={fornecedor.id}>{fornecedor.name}</option>))}
          </select>
           {fornecedores.length === 0 && <p className="mt-1 text-xs text-yellow-600">Nenhum fornecedor cadastrado.</p>}
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className={inputBaseClasses}></textarea>
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Cancelar</button>
          <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">Cadastrar Produto</button>
        </div>
      </form>
    </div>
  );
};

export default ProductAddPage;
