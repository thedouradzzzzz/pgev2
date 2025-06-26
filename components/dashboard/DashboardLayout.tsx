import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import type { User } from '../../types';

interface DashboardLayoutProps {
  currentUser: User;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ currentUser, onLogout }) => {
  return (
    // A div principal agora define o contexto do layout
    <div className="relative min-h-screen">
      
      {/* Sidebar - Fixa e sempre presente */}
      <Sidebar currentUser={currentUser} />

      {/* Conteúdo Principal (Header + Main) */}
      {/* CORREÇÃO: Adicionada a margem esquerda (padding-left) para compensar a largura da sidebar */}
      <div className="pl-64">
        <Header
          username={currentUser.username}
          onLogout={onLogout}
        />
        
        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
