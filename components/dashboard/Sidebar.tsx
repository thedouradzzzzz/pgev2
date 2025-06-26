import React from 'react';
import { NavLink } from 'react-router-dom';
import { SIDEBAR_NAV_ITEMS } from '../../constants';
import type { User } from '../../types';

interface SidebarProps {
  currentUser: User;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser }) => {
  const filteredNavItems = SIDEBAR_NAV_ITEMS.filter(item => {
    if (item.adminOnly) {
      return currentUser.isAdmin;
    }
    return true;
  });

  return (
    // Sidebar agora é sempre fixa e visível
    <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-gray-100 flex flex-col shadow-lg"
          aria-label="Main navigation"
    >
      <div className="flex items-center justify-start p-4 h-20 border-b border-slate-700">
        <span className="text-2xl font-semibold text-white">Menu Principal</span>
      </div>

      <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors duration-150 group
               ${isActive
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`
            }
          >
            {({ isActive }) => (
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
         {/* Placeholder para versão ou info do sistema */}
      </div>
    </aside>
  );
};

export default Sidebar;
