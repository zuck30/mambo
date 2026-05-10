import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, Diamond, MessageCircle, User, Search, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { profile } = useAuth();

  const navItems = [
    { to: '/app/home', icon: Flame, label: 'Home' },
    { to: '/app/search', icon: Search, label: 'Search' },
    { to: '/app/likes', icon: Diamond, label: 'Likes', premium: true },
    { to: '/app/messages', icon: MessageCircle, label: 'Messages' },
    { to: '/app/profile', icon: User, label: 'Profile' },
  ];

  return (
    <aside 
      className="fixed left-0 top-0 bottom-0 z-[200] flex flex-col bg-black border-r border-white/5 
                 w-20 hover:w-64 transition-all duration-300 ease-in-out group hidden md:flex overflow-hidden"
    >
      {/* Brand Section */}
      <div className="h-20 flex items-center px-6 mb-4">
        <div className="flex items-center gap-4">
          <Flame size={28} className="text-white fill-white flex-shrink-0" />
          <span className="font-bold text-xl tracking-tight text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            mambo
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-grow px-3 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-white/5 ${
                isActive ? 'text-white' : 'text-zinc-500 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={26} 
                  className={`flex-shrink-0 transition-transform duration-200 ${
                    isActive 
                      ? (item.premium ? 'text-amber-400 fill-amber-400' : 'text-white fill-current') 
                      : 'hover:scale-110'
                  }`} 
                />
                <span className={`text-base font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-white/5">
        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            `flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-white/5 ${
              isActive ? 'text-white' : 'text-zinc-500 hover:text-white'
            }`
          }
        >
          <Settings size={26} className="flex-shrink-0 hover:rotate-45 transition-transform" />
          <span className="text-base font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Settings
          </span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;