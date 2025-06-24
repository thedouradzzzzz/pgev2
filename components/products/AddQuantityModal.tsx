import React, { useState } from 'react';
import Modal from '../common/Modal';
import type { AddQuantityFormData } from '../../types'; // For onConfirmAdd prop

// Local interface for this modal's form data
interface AddQuantityModalFormState {
  amount: number | string; // Allow string for input field
  priceCost: number | string; // Allow string for input field
}

interface AddQuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmAdd: (data: AddQuantityFormData) => void; 
  productName: string;
}

const AddQuantityModal: React.FC<AddQuantityModalProps> = ({ isOpen, onClose, onConfirmAdd, productName }) => {
  const [formData, setFormData] = useState<AddQuantityModalFormState>({
    amount: 1,
    priceCost: '',
  });
  const [error, setError] = useState<string | null>(null);

  const inputBaseClasses = "mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const numAmount = Number(formData.amount);
    const numPriceCost = Number(formData.priceCost);

    if (isNaN(numAmount) || numAmount < 1) { 
      setError('A quantidade a adicionar deve ser um número positivo.');
      return;
    }
    if (isNaN(numPriceCost) || numPriceCost <= 0) {
      setError('O preço de custo é obrigatório e deve ser um número positivo.');
      return;
    }

    onConfirmAdd({ 
        productId: '', // productId will be injected by the calling component (ProductSearchPage)
        quantity: numAmount, 
        priceCost: numPriceCost 
    });
    setFormData({ amount: 1, priceCost: ''});
  };

  const modalFooter = (
    <>
      <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">Cancelar</button>
      <button type="submit" form="addQuantityForm" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">Adicionar Quantidade</button>
    </>
  );
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Adicionar Quantidade: ${productName}`} footer={modalFooter}>
      <form id="addQuantityForm" onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">{error}</p>}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Quantidade a Adicionar</label>
          <input 
            type="number" 
            name="amount" 
            id="amount" 
            value={formData.amount} 
            onChange={handleChange}
            min="1" 
            required 
            className={inputBaseClasses}/>
        </div>
        <div>
          <label htmlFor="priceCost" className="block text-sm font-medium text-gray-700">Preço de Custo (Unitário)</label>
          <input 
            type="number" 
            name="priceCost" 
            id="priceCost" 
            value={formData.priceCost} 
            onChange={handleChange}
            min="0.01"
            step="0.01"
            required 
            placeholder="Ex: 150.75"
            className={inputBaseClasses}/>
        </div>
      </form>
    </Modal>
  );
};

export default AddQuantityModal;