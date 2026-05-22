import React from 'react';
import { NavLink } from 'react-router-dom';
import { MapPin, MessageCircle, Aperture, Users, User } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-2xl h-20 px-4 pb-safe z-[100]">
      <div className="max-w-md mx-auto h-full flex items-center justify-between">
        <NavLink to="/app/map" className="group">
          {({ isActive }) => (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive ? 'text-white' : 'text-zinc-500'}`}
            >
              <MapPin size={28} strokeWidth={isActive ? 2.5 : 2} />
            </motion.div>
          )}
        </NavLink>

        <NavLink to="/app/messages" className="group">
          {({ isActive }) => (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive ? 'text-snap-blue' : 'text-zinc-500'}`}
            >
              <MessageCircle size={28} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'fill-snap-blue/10' : ''} />
            </motion.div>
          )}
        </NavLink>

        <NavLink to="/app/home" className="group">
          {({ isActive }) => (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`flex items-center justify-center p-2 transition-all ${isActive ? 'text-snap-yellow' : 'text-zinc-500'}`}
            >
              <div className={`w-14 h-14 rounded-full border-4 ${isActive ? 'border-snap-yellow' : 'border-zinc-500'} flex items-center justify-center`}>
                <Aperture size={32} strokeWidth={2} />
              </div>
            </motion.div>
          )}
        </NavLink>

        <NavLink to="/app/likes" className="group">
          {({ isActive }) => (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive ? 'text-snap-yellow' : 'text-zinc-500'}`}
            >
              <Users size={28} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'fill-snap-yellow/10' : ''} />
            </motion.div>
          )}
        </NavLink>

        <NavLink to="/app/profile" className="group">
          {({ isActive }) => (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center gap-1 p-2 transition-all ${isActive ? 'text-snap-yellow' : 'text-zinc-500'}`}
            >
              <User size={28} strokeWidth={isActive ? 2.5 : 2} />
            </motion.div>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;