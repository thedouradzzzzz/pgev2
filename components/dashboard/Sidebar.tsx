import React from 'react';
import { NavLink } from 'react-router-dom';
import { SIDEBAR_NAV_ITEMS } from '../../constants';
import type { User } from '../../types';
import { XIcon } from '../icons/Icons';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentUser: User;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, currentUser }) => {
  const filteredNavItems = SIDEBAR_NAV_ITEMS.filter(item => {
    if (item.adminOnly) {
      return currentUser.isAdmin;
    }
    return true;
  });

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 lg:static lg:z-auto transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                          lg:translate-x-0 transition-transform duration-300 ease-in-out 
                          w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-gray-100 flex flex-col shadow-lg`}
            aria-label="Main navigation"
      >
        <div className="flex items-center justify-between p-4 h-20 border-b border-slate-700">
          <span className="text-2xl font-semibold text-white">Menu</span>
          <button 
            onClick={() => setIsOpen(false)} 
            className="lg:hidden text-gray-300 hover:text-white p-2 rounded-md"
            aria-label="Close menu"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => { // Handle side-effects like closing mobile menu
                if (isOpen && window.innerWidth < 1024) {
                    setIsOpen(false);
                }
              }}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors duration-150 group
                 ${isActive 
                    ? 'bg-sky-600 text-white shadow-md' 
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`
              }
            >
              {({ isActive }) => ( // Children as a function to get isActive state
                <>
                  {item.icon && <item.icon className={`h-5 w-5 mr-3 transition-colors duration-150 ${
                                                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                                }`} 
                                aria-hidden="true" />
                  }
                  <span className="text-sm font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 mt-auto">
           {/* Can add user info or logout here if not in header, currently empty */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;