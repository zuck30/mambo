import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, Diamond, MessageCircle, User } from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-3xl border-t border-white/5 h-20 px-10 pb-safe z-[100]">
      <div className="max-w-md mx-auto h-full flex items-center justify-between">
        <NavLink to="/app/home" className={({ isActive }) => `p-2 ${isActive ? 'text-white' : 'text-zinc-600'}`}>
          <Flame size={26} className={({ isActive }) => isActive ? 'fill-current' : ''} />
        </NavLink>

        <NavLink to="/app/likes" className={({ isActive }) => `p-2 ${isActive ? 'text-amber-400' : 'text-zinc-600'}`}>
          <Diamond size={26} className={({ isActive }) => isActive ? 'fill-current' : ''} />
        </NavLink>

        <NavLink to="/app/messages" className={({ isActive }) => `p-2 ${isActive ? 'text-white' : 'text-zinc-600'}`}>
          <MessageCircle size={26} className={({ isActive }) => isActive ? 'fill-current' : ''} />
        </NavLink>

        <NavLink to="/app/profile" className={({ isActive }) => `p-2 ${isActive ? 'text-white' : 'text-zinc-600'}`}>
          <User size={26} className={({ isActive }) => isActive ? 'fill-current' : ''} />
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;