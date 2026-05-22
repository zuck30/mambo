import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MessageCircle, User, Settings, Heart, Compass, Flame } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { profile } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const navItems = [
    { to: '/app/home', icon: Compass, label: 'Discover' },
    { to: '/app/messages', icon: MessageCircle, label: 'Chat' },
    { to: '/app/home', icon: Flame, label: 'For You' },
    { to: '/app/likes', icon: Heart, label: 'Likes' },
    { to: '/app/profile', icon: User, label: 'Me' },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-black/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-40 md:hidden">
        <div className="flex items-center gap-2">
          <Flame size={28} className="text-primary fill-current" />
          <span className="text-xl font-black italic tracking-tighter text-white">mambo</span>
        </div>
      </div>

      {/* Desktop Sidebar - Collapsible on Hover */}
      <motion.aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ width: isHovered ? 240 : 72 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed left-0 top-0 bottom-0 bg-black border-r border-white/10 hidden md:flex flex-col z-40 overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 mb-8 mt-2 overflow-hidden">
          <div className="flex items-center gap-3">
            <Flame size={32} className="text-primary fill-current flex-shrink-0" />
            <motion.span
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.15 }}
              className="text-2xl font-black italic tracking-tighter text-white whitespace-nowrap uppercase"
            >
              mambo
            </motion.span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-4 px-3 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
                  <motion.span
                    animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                    transition={{ duration: 0.15 }}
                    className="text-base whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="pt-6 pb-8 px-3 border-t border-white/10">
          <NavLink
            to="/app/settings"
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Settings size={24} className="flex-shrink-0" />
            <motion.span
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
              transition={{ duration: 0.15 }}
              className="text-base whitespace-nowrap"
            >
              Settings
            </motion.span>
          </NavLink>

          {/* User Info */}
          <div className="flex items-center gap-3 px-3 pt-4 mt-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
              {profile?.photos?.[0] ? (
                <img src={profile.photos[0]} className="w-full h-full object-cover" />
              ) : (
                <User size={16} className="w-full h-full p-1.5 text-white/40" />
              )}
            </div>
            <motion.div
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
              transition={{ duration: 0.15 }}
              className="flex-1 min-w-0"
            >
              <p className="text-sm font-medium text-white truncate">
                {profile?.name || 'User'}
              </p>
              <p className="text-xs text-white/50 truncate">
                {profile?.name?.toLowerCase() || 'user'}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.aside>

      {/* Offset content for desktop */}
      <div className="hidden md:block md:pl-[72px]">
        {/* Your main content goes here */}
      </div>

      {/* Mobile content (no sidebar offset) */}
      <div className="md:hidden pt-14">
        {/* Your main content goes here */}
      </div>
    </>
  );
};

export default Sidebar;