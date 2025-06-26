import React, { useState, useRef } from 'react';
import Modal from '../common/Modal';
import { UploadIcon } from '../icons/Icons';

// Definindo um tipo para o resumo da importação para clareza
interface ImportSummary {
  successfullyAdded: number;
  successfullyUpdated: number;
  errors: string[];
}

interface ImportAssetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Renomeando a prop para refletir a ação
  onImport: (file: File) => Promise<ImportSummary>;
}

const ImportAssetsModal: React.FC<ImportAssetsModalProps> = ({ isOpen, onClose, onImport }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setImportSummary(null);
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        setError('Por favor, selecione um arquivo CSV válido.');
        setSelectedFile(null);
      }
    }
  };
  
  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Nenhum arquivo selecionado.');
      return;
    }
    setIsImporting(true);
    setError(null);
    setImportSummary(null);

    try {
      const summary = await onImport(selectedFile);
      setImportSummary(summary);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro desconhecido.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
        setSelectedFile(null);
        setError(null);
        setIsImporting(false);
        setImportSummary(null);
    }, 300); // Delay para animação
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Importar Ativos de CSV"
      footer={
        <>
          <button onClick={handleClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Fechar</button>
          <button onClick={handleSubmit} disabled={!selectedFile || isImporting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {isImporting ? 'Importando...' : 'Importar Arquivo'}
          </button>
        </>
      }
    >
        <div className="space-y-4">
            <p className="text-sm text-gray-600">
                Selecione um arquivo CSV delimitado por ponto e vírgula (;). A importação usará a coluna "Número de série" para identificar e atualizar ativos existentes.
            </p>
            <div
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
            <div className="space-y-1 text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative font-medium text-blue-600 hover:text-blue-500">
                    <span>Clique para selecionar</span>
                    <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv,text/csv" />
                </label>
                <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs text-gray-500">Apenas arquivos .CSV</p>
            </div>
            </div>
            {selectedFile && <p className="text-sm text-center font-medium text-gray-800">Arquivo: {selectedFile.name}</p>}
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
            {importSummary && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <h4 className="text-md font-semibold text-green-800">Resumo da Importação</h4>
                    <ul className="list-disc list-inside text-sm text-green-700 mt-2">
                        <li>Ativos criados: {importSummary.successfullyAdded}</li>
                        <li>Ativos atualizados: {importSummary.successfullyUpdated}</li>
                        {importSummary.errors.length > 0 && (
                            <li className="text-yellow-800 bg-yellow-100 p-2 rounded-md mt-2">
                                Linhas com erros: {importSummary.errors.length}
                                <ul className="list-['–'] list-inside pl-4 text-xs mt-1">
                                    {importSummary.errors.slice(0, 5).map((e, i) => <li key={i}>{e}</li>)}
                                    {importSummary.errors.length > 5 && <li>...e mais {importSummary.errors.length - 5}.</li>}
                                </ul>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    </Modal>
  );
};

export default ImportAssetsModal;
