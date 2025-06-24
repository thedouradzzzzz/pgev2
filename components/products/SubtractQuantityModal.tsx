import React, { useState } from 'react';
import Modal from '../common/Modal';
import type { SubtractQuantityFormData } from '../../types'; // For onConfirmSubtract prop

// Local interface for this modal's form data
interface SubtractQuantityModalFormState {
  amount: number | string; // Allow string for input field
  reason: SubtractQuantityFormData['reason'];
  // destinationAssetId and ticketNumber are not part of backend SaidaEstoque directly
}

interface SubtractQuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubtract: (data: SubtractQuantityFormData) => void; 
  productName: string;
  currentQuantity: number;
}

const SubtractQuantityModal: React.FC<SubtractQuantityModalProps> = ({ isOpen, onClose, onConfirmSubtract, productName, currentQuantity }) => {
  const [formData, setFormData] = useState<SubtractQuantityModalFormState>({
    amount: 1,
    reason: 'Ajuste', // Default reason
  });
  const [error, setError] = useState<string | null>(null);

  const inputBaseClasses = "mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const numAmount = Number(formData.amount);

    if (isNaN(numAmount) || numAmount < 1) {
      setError('A quantidade a subtrair deve ser um número positivo.');
      return;
    }
    if (numAmount > currentQuantity) {
      setError(`A quantidade a subtrair (${numAmount}) não pode ser maior que a quantidade atual (${currentQuantity}).`);
      return;
    }
    if (!formData.reason) {
      setError('O motivo da saída é obrigatório.');
      return;
    }

    onConfirmSubtract({ 
        productId: '', // productId will be injected by the calling component
        quantity: numAmount, 
        reason: formData.reason 
    });
    setFormData({ amount: 1, reason: 'Ajuste' }); 
  };
  
  const modalFooter = (
    <>
      <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">Cancelar</button>
      <button type="submit" form="subtractQuantityForm" className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition">Subtrair Quantidade</button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Subtrair Quantidade: ${productName}`} footer={modalFooter}>
      <form id="subtractQuantityForm" onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">{error}</p>}
        <p className="text-sm text-gray-600">Quantidade atual em estoque: <span className="font-semibold">{currentQuantity}</span></p>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Quantidade a Subtrair</label>
          <input 
            type="number" 
            name="amount" 
            id="amount" 
            value={formData.amount} 
            onChange={handleChange}
            min="1" 
            max={currentQuantity} // Can't subtract more than available
            required 
            className={inputBaseClasses}/>
        </div>
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Motivo da Saída</label>
          <select 
            name="reason" 
            id="reason" 
            value={formData.reason} 
            onChange={handleChange} 
            required 
            className={inputBaseClasses}
          >
            <option value="Venda">Venda</option>
            <option value="Ajuste">Ajuste de Estoque</option>
            <option value="Perda">Perda / Dano</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
      </form>
    </Modal>
  );
};

export default SubtractQuantityModal;