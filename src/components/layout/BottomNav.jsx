import React from 'react';
import { NavLink } from 'react-router-dom';
import { MapPin, MessageCircle, Flame, Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-3xl border-t border-white/5 h-20 px-4 pb-safe z-[100]">
      <div className="max-w-md mx-auto h-full flex items-center justify-between">
        <NavLink to="/app/home" className="group">
          {({ isActive }) => (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive ? 'text-primary' : 'text-zinc-500'}`}
            >
              <MapPin size={26} className={isActive ? 'fill-current/20' : ''} />
              <span className="text-[10px] font-black uppercase tracking-widest">Map</span>
            </motion.div>
          )}
        </NavLink>

        <NavLink to="/app/messages" className="group">
          {({ isActive }) => (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive ? 'text-primary' : 'text-zinc-500'}`}
            >
              <MessageCircle size={26} className={isActive ? 'fill-current/20' : ''} />
              <span className="text-[10px] font-black uppercase tracking-widest">Chat</span>
            </motion.div>
          )}
        </NavLink>

        <NavLink to="/app/home" className="relative -top-4">
          {({ isActive }) => (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`w-16 h-16 rounded-full bg-black border-4 border-black shadow-2xl flex items-center justify-center transition-all ${isActive ? 'text-primary' : 'text-white'}`}
            >
              <div className={`w-full h-full rounded-full flex items-center justify-center ${isActive ? 'bg-primary/10' : 'bg-white/5'}`}>
                <Flame size={32} className={isActive ? 'fill-current' : ''} />
              </div>
            </motion.div>
          )}
        </NavLink>

        <NavLink to="/app/likes" className="group">
          {({ isActive }) => (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive ? 'text-primary' : 'text-zinc-500'}`}
            >
              <Heart size={26} className={isActive ? 'fill-current/20' : ''} />
              <span className="text-[10px] font-black uppercase tracking-widest">Likes</span>
            </motion.div>
          )}
        </NavLink>

        <NavLink to="/app/profile" className="group">
          {({ isActive }) => (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive ? 'text-primary' : 'text-zinc-500'}`}
            >
              <User size={26} className={isActive ? 'fill-current/20' : ''} />
              <span className="text-[10px] font-black uppercase tracking-widest">Me</span>
            </motion.div>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;