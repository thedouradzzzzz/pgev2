
import React from 'react';
import { CATARINENSE_PHARMA_HEADER_LOGO_URL, ABPLAST_HEADER_LOGO_URL } from '../../constants';
import { LogoutIcon, MenuIcon, XIcon } from '../icons/Icons';


interface HeaderProps {
  username: string;
  onLogout: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ username, onLogout, onToggleSidebar, sidebarOpen }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="text-gray-500 focus:outline-none focus:text-gray-700 lg:hidden mr-4 p-2 rounded-md hover:bg-gray-100"
              aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
            >
              {sidebarOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
            <div className="flex items-center space-x-4">
              {/* Catarinense Pharma Logo Container */}
              <div className="bg-blue-600 px-2 py-4 rounded-md flex items-center justify-center"> {/* Changed p-2 to px-2 py-4 */}
                <img 
                  src={CATARINENSE_PHARMA_HEADER_LOGO_URL} 
                  alt="Catarinense Pharma" 
                  className="h-10 object-contain"
                />
              </div>
              {/* ABPlast Logo Container */}
              <div className="bg-blue-600 p-1 rounded-md flex items-center justify-center">
                 <img 
                  src={ABPLAST_HEADER_LOGO_URL} 
                  alt="ABPlast" 
                  className="h-16 object-contain"
                />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-700 ml-4 hidden md:block">
              Insumos de TI
            </h1>
          </div>
          
          <div className="flex items-center">
            <span className="text-gray-600 mr-2 sm:mr-4 hidden sm:inline">Olá, {username}</span>
            <button
              onClick={onLogout}
              className="flex items-center text-sm text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-lg transition-colors duration-150"
              title="Sair"
            >
              <LogoutIcon className="h-5 w-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
