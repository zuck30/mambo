import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, Diamond, MessageCircle, User, Search, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

import { motion } from 'framer-motion';

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
      className="fixed left-0 top-0 bottom-0 z-[200] flex flex-col bg-black border-r border-white/10
                 w-20 lg:w-64 transition-all duration-300 ease-in-out hidden md:flex overflow-hidden"
    >
      {/* Brand Section */}
      <div className="h-20 flex items-center px-6 mb-8 mt-4">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center shadow-lg shadow-primary/20"
          >
            <Flame size={24} className="text-white fill-current flex-shrink-0" />
          </motion.div>
          <span className="font-black text-2xl italic tracking-tighter text-white hidden lg:block">
            mambo
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-grow px-3 space-y-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-4 p-3.5 rounded-2xl transition-all group relative ${
                isActive
                  ? 'bg-white/5 text-white'
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <item.icon
                    size={24}
                    className={`flex-shrink-0 transition-colors duration-200 ${
                      isActive
                        ? (item.premium ? 'text-amber-400 fill-amber-400' : 'text-primary fill-current')
                        : 'group-hover:text-white'
                    }`}
                  />
                </motion.div>
                <span className={`text-sm font-bold tracking-tight hidden lg:block transition-all duration-200 ${isActive ? 'translate-x-1' : ''}`}>
                  {item.label}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full lg:hidden"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Profile Section */}
      <div className="p-4 mb-4">
        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            `flex items-center gap-4 p-3.5 rounded-2xl transition-all hover:bg-white/5 group ${
              isActive ? 'text-white bg-white/5' : 'text-zinc-500 hover:text-white'
            }`
          }
        >
          <motion.div
            whileHover={{ rotate: 90 }}
            className="flex-shrink-0"
          >
            <Settings size={24} className="transition-transform duration-300" />
          </motion.div>
          <div className="hidden lg:flex flex-col min-w-0">
             <span className="text-sm font-bold text-white truncate">Settings</span>
             <span className="text-[10px] text-zinc-500 truncate">Account & Privacy</span>
          </div>
        </NavLink>
      </div>

      {/* User Info */}
      <div className="px-6 py-6 border-t border-white/5 flex items-center gap-3">
         <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden shrink-0">
            {profile?.photos?.[0] ? (
              <img src={profile.photos[0]} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-zinc-800" />
            )}
         </div>
         <div className="hidden lg:flex flex-col min-w-0">
            <span className="text-xs font-bold text-white truncate">{profile?.name}</span>
            <span className="text-[10px] text-zinc-500 truncate">{profile?.job || 'User'}</span>
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;