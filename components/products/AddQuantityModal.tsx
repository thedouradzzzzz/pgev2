import React, { useState } from 'react';
import Modal from '../common/Modal';
// === ALTERAÇÃO 1: A prop onConfirmAdd agora espera 'purchaseOrderNumber' ===
import type { AddQuantityFormData } from '../../types';

// === ALTERAÇÃO 2: Atualizado o estado local do formulário ===
interface AddQuantityModalFormState {
  amount: number | string;
  purchaseOrderNumber: string; // Trocado de priceCost para string
}

interface AddQuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmAdd: (data: Omit<AddQuantityFormData, 'productId' | 'priceCost'> & { purchaseOrderNumber: string }) => void;
  productName: string;
}

const AddQuantityModal: React.FC<AddQuantityModalProps> = ({ isOpen, onClose, onConfirmAdd, productName }) => {
  // === ALTERAÇÃO 3: Estado inicial atualizado ===
  const [formData, setFormData] = useState<AddQuantityModalFormState>({
    amount: 1,
    purchaseOrderNumber: '',
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

    if (isNaN(numAmount) || numAmount < 1) {
      setError('A quantidade a adicionar deve ser um número positivo.');
      return;
    }
    // === ALTERAÇÃO 4: Validação para o novo campo ===
    if (!formData.purchaseOrderNumber.trim()) {
      setError('O número da solicitação de compra é obrigatório.');
      return;
    }
    
    // === ALTERAÇÃO 5: Passando o dado correto para a função de confirmação ===
    onConfirmAdd({
        quantity: numAmount,
        purchaseOrderNumber: formData.purchaseOrderNumber,
    });
    // Limpa o formulário após o envio
    setFormData({ amount: 1, purchaseOrderNumber: ''});
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
        {/* === ALTERAÇÃO 6: Campo de formulário completamente alterado === */}
        <div>
          <label htmlFor="purchaseOrderNumber" className="block text-sm font-medium text-gray-700">Número da Solicitação de Compra</label>
          <input
            type="text"
            name="purchaseOrderNumber"
            id="purchaseOrderNumber"
            value={formData.purchaseOrderNumber}
            onChange={handleChange}
            required
            placeholder="Ex: SC-12345"
            className={inputBaseClasses}/>
        </div>
      </form>
    </Modal>
  );
};

export default AddQuantityModal;
