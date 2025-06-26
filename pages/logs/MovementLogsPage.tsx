
import React, { useState, useMemo } from 'react';
import type { LogEntry } from '../../types';
import { LogEntryActionType } from '../../types';
import LogDetailsModal from '../../components/logs/LogDetailsModal';

interface MovementLogsPageProps {
  logs: LogEntry[];
}

const ITEMS_PER_PAGE = 15;

const formatDate = (date: Date) => {
  return date.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
};

const MovementLogsPage: React.FC<MovementLogsPageProps> = ({ logs }) => {
  const [filters, setFilters] = useState({
    username: '',
    description: '',
    actionType: '',
  });
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof LogEntry | null; direction: 'ascending' | 'descending' }>({ key: 'timestamp', direction: 'descending' });

  const inputBaseClasses = "mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCurrentPage(1);
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearFilters = () => {
    setCurrentPage(1);
    setFilters({ username: '', description: '', actionType: '' });
  };

  const openDetailsModal = (log: LogEntry) => {
    setSelectedLog(log);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedLog(null);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      return (
        (filters.username ? log.username.toLowerCase().includes(filters.username.toLowerCase()) : true) &&
        (filters.description ? log.description.toLowerCase().includes(filters.description.toLowerCase()) : true) &&
        (filters.actionType ? log.actionType === filters.actionType : true)
      );
    });
  }, [logs, filters]);

  const requestSort = (key: keyof LogEntry) => {
    setCurrentPage(1);
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedLogs = useMemo(() => {
    let sortableLogs = [...filteredLogs];
    if (sortConfig.key !== null) {
      sortableLogs.sort((a, b) => {
        const key = sortConfig.key!;
        const valA = a[key];
        const valB = b[key];

        let comparison = 0;
        if (valA instanceof Date && valB instanceof Date) {
          comparison = valA.getTime() - valB.getTime();
        } else if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB, 'pt-BR', { sensitivity: 'base' });
        } else if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        } else {
            comparison = String(valA).localeCompare(String(valB), 'pt-BR', { sensitivity: 'base' });
        }
        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      });
    }
    return sortableLogs;
  }, [filteredLogs, sortConfig]);

  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedLogs, currentPage]);

  const totalPages = Math.ceil(sortedLogs.length / ITEMS_PER_PAGE);

  const getSortIndicator = (key: keyof LogEntry) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return '';
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Logs de Movimentações</h1>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <input type="text" name="username" placeholder="Nome de Usuário" value={filters.username} onChange={handleFilterChange} className={inputBaseClasses} />
          <input type="text" name="description" placeholder="Descrição da Ação" value={filters.description} onChange={handleFilterChange} className={inputBaseClasses} />
          <select name="actionType" value={filters.actionType} onChange={handleFilterChange} className={inputBaseClasses}>
            <option value="">Todos os Tipos de Ação</option>
            {Object.values(LogEntryActionType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button
            onClick={clearFilters}
            className="sm:col-start-1 lg:col-start-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
          >
            Limpar Filtros
          </button>
        </div>
      </div>


      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="th-cell cursor-pointer hover:bg-gray-100" onClick={() => requestSort('timestamp')}>Data/Hora{getSortIndicator('timestamp')}</th>
              <th className="th-cell cursor-pointer hover:bg-gray-100" onClick={() => requestSort('username')}>Usuário{getSortIndicator('username')}</th>
              <th className="th-cell cursor-pointer hover:bg-gray-100" onClick={() => requestSort('actionType')}>Tipo de Ação{getSortIndicator('actionType')}</th>
              <th className="th-cell cursor-pointer hover:bg-gray-100" onClick={() => requestSort('description')}>Descrição{getSortIndicator('description')}</th>
              <th className="th-cell">Detalhes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedLogs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 text-sm text-gray-800 whitespace-nowrap">{formatDate(log.timestamp)}</td>
                <td className="px-4 py-4 text-sm text-gray-800">{log.username}</td>
                <td className="px-4 py-4 text-sm text-gray-800">{log.actionType}</td>
                <td className="px-4 py-4 text-sm text-gray-800 max-w-md truncate" title={log.description}>{log.description}</td>
                <td className="px-4 py-4 text-sm text-gray-800 text-center">
                  {log.details && Object.keys(log.details).length > 0 && (
                    <button
                      onClick={() => openDetailsModal(log)}
                      className="text-blue-600 hover:text-blue-800 hover:underline text-xs"
                    >
                      Ver Detalhes
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {paginatedLogs.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Nenhum log encontrado com os filtros atuais.
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      )}
      <style>{`
        .th-cell { @apply px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider; }
        .td-cell { @apply px-4 py-4 text-sm text-gray-800; } /* This definition is now effectively overridden for the main table cells by direct utilities */
      `}</style>

      {selectedLog && isDetailsModalOpen && (
        <LogDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
          logEntry={selectedLog}
        />
      )}
    </div>
  );
};

export default MovementLogsPage;
