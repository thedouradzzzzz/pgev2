import React from 'react';
import Modal from '../common/Modal';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  userName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirmDelete, userName }) => {
  
  const modalFooter = (
    <>
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
      >
        Cancelar
      </button>
      <button
        type="button"
        onClick={onConfirmDelete}
        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
      >
        Excluir
      </button>
    </>
  );
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Exclusão" footer={modalFooter}>
      <p className="text-sm text-gray-600">
        Tem certeza que deseja excluir o usuário <strong className="font-medium text-gray-800">{userName}</strong>? Esta ação não pode ser desfeita.
      </p>
    </Modal>
  );
};

export default DeleteConfirmationModal;