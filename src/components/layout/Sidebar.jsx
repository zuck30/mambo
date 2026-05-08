import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListOrdered,
  Users,
  Car,
  Settings,
  UsersRound,
  BarChart3,
  Package,
  CreditCard,
  Wrench,
  LogOut,
  ChevronRight,
  TrendingDown,
  Coins
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/garidesk.png';

const Sidebar = () => {
  const { profile, signOut } = useAuth();
  const role = profile?.role;

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['admin', 'manager', 'secretary'] },
    { name: 'Queue', icon: ListOrdered, path: '/queue', roles: ['admin', 'manager', 'secretary', 'staff'] },
    { name: 'Customers', icon: Users, path: '/customers', roles: ['admin', 'manager', 'secretary', 'staff'] },
    { name: 'Vehicles', icon: Car, path: '/cars', roles: ['admin', 'manager', 'secretary', 'staff'] },
    { name: 'Payments', icon: CreditCard, path: '/payments', roles: ['admin', 'manager', 'secretary', 'staff'] },
    { name: 'Expenses', icon: TrendingDown, path: '/expenses', roles: ['admin', 'manager'] },
    { name: 'Services', icon: Wrench, path: '/services', roles: ['admin', 'manager', 'secretary'] },
    { name: 'Inventory', icon: Package, path: '/inventory', roles: ['admin', 'manager', 'secretary'] },
    { name: 'Analytics', icon: BarChart3, path: '/reports', roles: ['admin', 'manager'] },
    { name: 'Team', icon: UsersRound, path: '/staff', roles: ['admin', 'secretary'] },
    { name: 'Finances', icon: Coins, path: '/staff/finances', roles: ['admin', 'secretary'] },
    { name: 'Settings', icon: Settings, path: '/settings', roles: ['admin'] },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white h-screen fixed left-0 top-0 z-20 border-r border-slate-200">
      <div className="p-5 flex items-center gap-3 h-16 border-b border-slate-100">
        <img src={logo} alt="GariDesk" className="h-8 w-8 object-cover rounded-lg" />
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          if (item.roles && !item.roles.includes(role)) return null;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all group',
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                )
              }
            >
              <item.icon size={18} />
              <span className="flex-1">{item.name}</span>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-3">
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt={profile.full_name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
              <span className="text-slate-600 font-medium">
                {profile?.full_name?.charAt(0) || 'U'}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{profile?.full_name}</p>
            <p className="text-xs text-slate-500 capitalize">{profile?.role}</p>
          </div>
        </div>
        
        <button 
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;