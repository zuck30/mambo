import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, Diamond, MessageCircle, User, Settings, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { profile } = useAuth();

  const navItems = [
    { to: '/app/home', icon: Flame, label: 'Discover' },
    { to: '/app/likes', icon: Diamond, label: 'Likes' },
    { to: '/app/messages', icon: MessageCircle, label: 'Messages' },
    { to: '/app/profile', icon: User, label: 'Profile' },
    { to: '/app/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-20 hover:w-64 bg-dark-card border-r border-white/5 flex flex-col p-4 md:p-6 transition-all duration-300 ease-in-out z-[200] group hidden md:flex overflow-hidden">
      <div className="flex items-center gap-4 mb-10 px-2 overflow-hidden whitespace-nowrap">
        <Flame size={32} className="text-primary fill-current flex-shrink-0" />
        <span className="font-black text-2xl italic tracking-tighter text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">oa</span>
      </div>

      <nav className="flex-grow space-y-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-2 py-3 rounded-xl transition-all overflow-hidden whitespace-nowrap ${
                isActive
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-dark-text hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={28} className={`flex-shrink-0 ${isActive ? 'fill-current' : ''}`} />
                <span className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {profile?.role === 'admin' && (
          <NavLink
            to="/app/admin"
            className={({ isActive }) =>
              `flex items-center gap-4 px-2 py-3 rounded-xl transition-all overflow-hidden whitespace-nowrap ${
                isActive
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-dark-text hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <ShieldCheck size={28} className="flex-shrink-0" />
            <span className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">Admin</span>
          </NavLink>
        )}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5 overflow-hidden whitespace-nowrap">
        <div className="flex items-center gap-4 px-1">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
            <img
              src={profile?.photos?.[0] || 'https://via.placeholder.com/40'}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div className="flex-grow min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="font-bold text-white truncate">{profile?.name}</p>
            <p className="text-xs text-dark-text truncate">View Profile</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
