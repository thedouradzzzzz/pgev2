import React, { useState } from 'react';
import Modal from '../common/Modal';
// === ALTERAÇÃO 1: A prop onConfirmSubtract agora espera 'destinationAsset' ===
import type { SubtractQuantityFormData } from '../../types';

// === ALTERAÇÃO 2: Atualizado o estado local do formulário ===
interface SubtractQuantityModalFormState {
  amount: number | string;
  destinationAsset: string; // Trocado de 'reason' para 'destinationAsset'
}

interface SubtractQuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubtract: (data: Omit<SubtractQuantityFormData, 'productId' | 'reason'> & { destinationAsset: string }) => void;
  productName: string;
  currentQuantity: number;
}

const SubtractQuantityModal: React.FC<SubtractQuantityModalProps> = ({ isOpen, onClose, onConfirmSubtract, productName, currentQuantity }) => {
  // === ALTERAÇÃO 3: Estado inicial atualizado ===
  const [formData, setFormData] = useState<SubtractQuantityModalFormState>({
    amount: 1,
    destinationAsset: '',
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
      setError('A quantidade a subtrair deve ser um número positivo.');
      return;
    }
    if (numAmount > currentQuantity) {
      setError(`A quantidade a subtrair (${numAmount}) não pode ser maior que a quantidade atual (${currentQuantity}).`);
      return;
    }
    // === ALTERAÇÃO 4: Validação para o novo campo ===
    if (!formData.destinationAsset.trim()) {
      setError('O ativo de destino é obrigatório.');
      return;
    }

    // === ALTERAÇÃO 5: Passando o dado correto para a função de confirmação ===
    onConfirmSubtract({
        quantity: numAmount,
        destinationAsset: formData.destinationAsset
    });
    // Limpa o formulário
    setFormData({ amount: 1, destinationAsset: '' });
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
            max={currentQuantity}
            required
            className={inputBaseClasses}/>
        </div>
        {/* === ALTERAÇÃO 6: Campo de formulário completamente alterado de select para input de texto === */}
        <div>
          <label htmlFor="destinationAsset" className="block text-sm font-medium text-gray-700">Ativo de Destino</label>
          <input
            type="text"
            name="destinationAsset"
            id="destinationAsset"
            value={formData.destinationAsset}
            onChange={handleChange}
            required
            placeholder="Ex: Notebook DELL-1234, Servidor HPE-5678"
            className={inputBaseClasses}/>
        </div>
      </form>
    </Modal>
  );
};

export default SubtractQuantityModal;
