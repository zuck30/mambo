import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, Diamond, MessageCircle, User, Settings, ShieldCheck, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { profile } = useAuth();

  const navItems = [
    { to: '/app/home', icon: Flame, label: 'Discover' },
    { to: '/app/likes', icon: Diamond, label: 'Likes' },
    { to: '/app/messages', icon: MessageCircle, label: 'Messages' },
    { to: '/app/profile', icon: User, label: 'Profile' },
  ];

  return (
    <aside 
      className="fixed left-0 top-0 bottom-0 z-[200] flex flex-col bg-black border-r border-white/10 
                 w-20 hover:w-64 transition-all duration-300 ease-in-out group hidden md:flex"
    >
      {/* Brand Section */}
      <div className="h-20 flex items-center px-6 mb-4">
        <div className="flex items-center gap-4">
          <Flame size={28} className="text-primary fill-current flex-shrink-0" />
          <span className="font-black text-2xl italic tracking-tighter text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            oa
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-grow px-3 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-white/5 group/item ${
                isActive ? 'text-white' : 'text-zinc-500 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={26} 
                  className={`flex-shrink-0 transition-transform duration-200 group-hover/item:scale-110 ${
                    isActive ? 'text-primary fill-current' : ''
                  }`} 
                />
                <span className={`text-base font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}

        {profile?.role === 'admin' && (
          <NavLink
            to="/app/admin"
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-white/5 group/item ${
                isActive ? 'text-white' : 'text-zinc-500 hover:text-white'
              }`
            }
          >
            <ShieldCheck size={26} className="flex-shrink-0 group-hover/item:scale-110" />
            <span className="text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Admin
            </span>
          </NavLink>
        )}
      </nav>

      {/* Footer Section */}
      <div className="p-3 border-t border-white/5 space-y-2">
        {/* Restored Settings Navigation */}
        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            `flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-white/5 group/item ${
              isActive ? 'text-white' : 'text-zinc-500 hover:text-white'
            }`
          }
        >
          <Settings size={26} className="flex-shrink-0 group-hover/item:scale-110" />
          <span className="text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Settings
          </span>
        </NavLink>
        
        <button className="flex items-center gap-4 p-3 w-full rounded-xl text-zinc-500 hover:bg-white/5 hover:text-white transition-all group/item">
          <Menu size={26} className="flex-shrink-0 group-hover/item:scale-110" />
          <span className="text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            More
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;