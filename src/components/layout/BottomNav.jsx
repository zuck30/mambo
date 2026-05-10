import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, Diamond, MessageCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-2xl border-t border-white/5 h-20 px-6 pb-safe z-[100]">
      <div className="max-w-md mx-auto h-full flex items-center justify-between">
        <NavLink to="/app/home" className="group">
          {({ isActive }) => (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`p-3 rounded-2xl transition-all ${isActive ? 'text-primary' : 'text-zinc-500'}`}
            >
              <Flame size={28} className={isActive ? 'fill-current' : ''} />
            </motion.div>
          )}
        </NavLink>

        <NavLink to="/app/likes" className="group">
          {({ isActive }) => (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`p-3 rounded-2xl transition-all ${isActive ? 'text-amber-400' : 'text-zinc-500'}`}
            >
              <Diamond size={28} className={isActive ? 'fill-current' : ''} />
            </motion.div>
          )}
        </NavLink>

        <NavLink to="/app/messages" className="group">
          {({ isActive }) => (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`p-3 rounded-2xl transition-all ${isActive ? 'text-white' : 'text-zinc-500'}`}
            >
              <MessageCircle size={28} className={isActive ? 'fill-current' : ''} />
            </motion.div>
          )}
        </NavLink>

        <NavLink to="/app/profile" className="group">
          {({ isActive }) => (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`p-3 rounded-2xl transition-all ${isActive ? 'text-white' : 'text-zinc-500'}`}
            >
              <User size={28} className={isActive ? 'fill-current' : ''} />
            </motion.div>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;