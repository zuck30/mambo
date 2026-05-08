import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  ListOrdered,
  Users,
  BarChart3,
  LayoutDashboard,
  Car,
  Settings,
  UsersRound,
  Package,
  CreditCard,
  Wrench,
  LogOut,
  MoreHorizontal,
  X,
  Coins
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const BottomNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const role = profile?.role;
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out failed', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['admin', 'manager', 'staff'] },
    { name: 'Queue', icon: ListOrdered, path: '/queue', roles: ['admin', 'manager', 'staff'] },
    { name: 'Customers', icon: Users, path: '/customers', roles: ['admin', 'manager', 'staff'] },
    { name: 'Cars', icon: Car, path: '/cars', roles: ['admin', 'manager', 'staff'] },
    { name: 'Payments', icon: CreditCard, path: '/payments', roles: ['admin', 'manager', 'staff'] },
    { name: 'Services', icon: Wrench, path: '/services', roles: ['admin', 'manager'] },
    { name: 'Inventory', icon: Package, path: '/inventory', roles: ['admin', 'manager'] },
    { name: 'Reports', icon: BarChart3, path: '/reports', roles: ['admin', 'manager'] },
    { name: 'Staff', icon: UsersRound, path: '/staff', roles: ['admin'] },
    { name: 'Finances', icon: Coins, path: '/staff/finances', roles: ['admin', 'secretary'] },
    { name: 'Settings', icon: Settings, path: '/settings', roles: ['admin'] },
  ];

  const bottomTabs = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Queue', icon: ListOrdered, path: '/queue' },
    { name: 'Customers', icon: Users, path: '/customers' },
    { name: 'Reports', icon: BarChart3, path: '/reports' },
    { name: 'More', icon: MoreHorizontal, onClick: () => setIsMenuOpen(true) },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl px-2 py-3 flex justify-around items-center z-50 shadow-xl border border-slate-200">
        {bottomTabs.map((tab) => {
          if (tab.onClick) {
            return (
              <button
                key={tab.name}
                onClick={tab.onClick}
                className="flex flex-col items-center justify-center py-1 px-3 text-slate-400 hover:text-[#d34932] transition-colors"
              >
                <tab.icon size={20} />
                <span className="text-[9px] mt-1 font-black uppercase tracking-widest">{tab.name}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center py-1 px-3 transition-all',
                  isActive ? 'text-[#d34932]' : 'text-slate-400'
                )
              }
            >
              <tab.icon size={20} />
              <span className="text-[9px] mt-1 font-black uppercase tracking-widest">{tab.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl z-[110] md:hidden max-h-[80vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Menu</h3>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 p-4">
                {navItems.map((item) => {
                  if (item.roles && !item.roles.includes(role)) return null;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsMenuOpen(false);
                      }}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-xl transition-all",
                        isActive
                          ? "bg-[#d34932] text-white shadow-lg shadow-orange-200"
                          : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      <item.icon size={20} className="mb-1.5" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-center">{item.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-rose-50 text-rose-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-100 transition-all"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default BottomNav;