import React from 'react';
import { CATARINENSE_PHARMA_HEADER_LOGO_URL, ABPLAST_HEADER_LOGO_URL } from '../../constants';
import { LogoutIcon, UserCircleIcon } from '../icons/Icons';

interface HeaderProps {
  username: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ username, onLogout }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* GRUPO ESQUERDO: Logos */}
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 px-3 py-2 rounded-md flex items-center justify-center h-14">
              <img
                src={CATARINENSE_PHARMA_HEADER_LOGO_URL}
                alt="Catarinense Pharma"
                className="h-8 object-contain"
              />
            </div>
            <div className="bg-blue-600 p-1 rounded-md flex items-center justify-center h-14">
               <img
                src={ABPLAST_HEADER_LOGO_URL}
                alt="ABPlast"
                className="h-12 object-contain"
              />
            </div>
          </div>

          {/* GRUPO DIREITO: Menu do Usuário */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
               <UserCircleIcon className="h-6 w-6 text-gray-600"/>
               <span className="text-gray-600">Olá, <span className="font-medium">{username}</span></span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center text-sm text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-lg transition-colors duration-150"
              title="Sair"
            >
              <LogoutIcon className="h-5 w-5 mr-2" />
              <span>Sair</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
