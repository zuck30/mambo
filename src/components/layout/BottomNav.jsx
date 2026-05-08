import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, Diamond, MessageCircle, User } from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-card/80 backdrop-blur-md border-t border-white/5 h-16 px-6 pb-safe">
      <div className="max-w-md mx-auto h-full flex items-center justify-between">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `p-2 transition-colors ${isActive ? 'text-primary' : 'text-dark-text'}`
          }
        >
          <Flame size={28} className={({ isActive }) => isActive ? 'fill-current' : ''} />
        </NavLink>

        <NavLink
          to="/likes"
          className={({ isActive }) =>
            `p-2 transition-colors ${isActive ? 'text-primary' : 'text-dark-text'}`
          }
        >
          <Diamond size={28} className={({ isActive }) => isActive ? 'fill-current' : ''} />
        </NavLink>

        <NavLink
          to="/messages"
          className={({ isActive }) =>
            `p-2 transition-colors ${isActive ? 'text-primary' : 'text-dark-text'}`
          }
        >
          <MessageCircle size={28} className={({ isActive }) => isActive ? 'fill-current' : ''} />
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `p-2 transition-colors ${isActive ? 'text-primary' : 'text-dark-text'}`
          }
        >
          <User size={28} className={({ isActive }) => isActive ? 'fill-current' : ''} />
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
