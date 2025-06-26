import React from 'react';
import Modal from '../common/Modal';
import type { LogEntry } from '../../types';

interface LogDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logEntry: LogEntry;
}

const LogDetailsModal: React.FC<LogDetailsModalProps> = ({ isOpen, onClose, logEntry }) => {
  if (!isOpen || !logEntry.details) return null;

  const modalFooter = (
    <button
      type="button"
      onClick={onClose}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
    >
      Fechar
    </button>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Detalhes do Log: ${logEntry.actionType}`}
      footer={modalFooter}
    >
      <div className="text-sm text-gray-700 max-h-96 overflow-y-auto">
        <p className="mb-2"><strong>ID do Log:</strong> {logEntry.id}</p>
        <p className="mb-2"><strong>Timestamp:</strong> {logEntry.timestamp.toLocaleString('pt-BR')}</p>
        <p className="mb-2"><strong>Usuário:</strong> {logEntry.username} (ID: {logEntry.userId})</p>
        <p className="mb-2"><strong>Descrição:</strong> {logEntry.description}</p>
        <div className="mt-4 p-3 bg-gray-100 rounded-md border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">Dados Adicionais:</h4>
          <pre className="whitespace-pre-wrap break-all text-xs">
            {JSON.stringify(logEntry.details, null, 2)}
          </pre>
        </div>
      </div>
    </Modal>
  );
};

export default LogDetailsModal;
