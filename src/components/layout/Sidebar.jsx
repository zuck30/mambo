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
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-dark-card border-r border-white/5 flex flex-col p-6 hidden md:flex">
      <div className="flex items-center gap-2 mb-10 px-2">
        <Flame size={32} className="text-primary fill-current" />
        <span className="font-black text-2xl italic tracking-tighter text-white">oa</span>
      </div>

      <nav className="flex-grow space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-dark-text hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={24} className={isActive ? 'fill-current' : ''} />
                <span className="text-lg">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {profile?.role === 'admin' && (
          <NavLink
            to="/app/admin"
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-dark-text hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <ShieldCheck size={24} />
            <span className="text-lg">Admin</span>
          </NavLink>
        )}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
            <img
              src={profile?.photos?.[0] || 'https://via.placeholder.com/40'}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div className="flex-grow min-w-0">
            <p className="font-bold text-white truncate">{profile?.name}</p>
            <p className="text-xs text-dark-text truncate">View Profile</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
