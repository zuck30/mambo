import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, ChevronDown, LogOut, User, Settings, Trash2, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Menu, Transition, Popover } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { useNotifications } from '../../hooks/useNotifications';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '../../lib/utils';

const TopBar = () => {
  const { profile, signOut } = useAuth();
  useNotifications(); // Initialize notification listeners

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  } = useNotificationStore();

  const [isClearing, setIsClearing] = useState(false);

  const handleClearAll = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearNotifications();
      setIsClearing(false);
    }, 1000);
  };
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/queue') return 'Queue';
    if (path === '/customers') return 'Customers';
    if (path === '/cars') return 'Vehicles';
    if (path === '/payments') return 'Payments';
    if (path === '/services') return 'Services';
    if (path === '/inventory') return 'Inventory';
    if (path === '/reports') return 'Analytics';
    if (path === '/staff') return 'Staff';
    if (path === '/settings') return 'Settings';
    return path.substring(1).charAt(0).toUpperCase() + path.substring(2);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-6 flex-1">
        <h1 className="text-lg font-semibold text-slate-900">{getPageTitle()}</h1>
        
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-0.5 text-[10px] text-slate-400">
              <span className="px-1 py-0.5 bg-white border border-slate-200 rounded">⌘</span>
              <span className="px-1 py-0.5 bg-white border border-slate-200 rounded">K</span>
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">

        {/* Notifications Popover */}
        <Popover className="relative">
          <Popover.Button className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all focus:outline-none">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden focus:outline-none">
              {({ close }) => (
                <>
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Notifications</h3>
                  <p className="text-[10px] text-slate-500 font-bold italic">Stay updated with system events</p>
                </div>
                <div className="flex items-center gap-1">
                  {notifications.length > 0 && (
                    <>
                      <button
                        onClick={markAllAsRead}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Mark all as read"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button
                        onClick={handleClearAll}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Clear all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  {isClearing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-12"
                    >
                      <div className="relative">
                        <motion.div
                          animate={{
                            scale: [1, 2, 0],
                            opacity: [1, 1, 0]
                          }}
                          transition={{ duration: 0.8 }}
                          className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white"
                        >
                          <Trash2 size={24} />
                        </motion.div>
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ x: 0, y: 0, scale: 0 }}
                            animate={{
                              x: (Math.random() - 0.5) * 100,
                              y: (Math.random() - 0.5) * 100,
                              scale: [0, 1, 0],
                              opacity: [0, 1, 0]
                            }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="absolute top-1/2 left-1/2 w-2 h-2 bg-rose-500 rounded-full"
                          />
                        ))}
                      </div>
                      <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-4">Clearing...</p>
                    </motion.div>
                  ) : notifications.length > 0 ? (
                    notifications.map((n, i) => (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: i * 0.05 }}
                        className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative group ${!n.read ? 'bg-blue-50/30' : ''}`}
                        onClick={() => markAsRead(n.id)}
                      >
                        {!n.read && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                        )}
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${!n.read ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                            {n.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <p className={`text-xs font-black truncate ${!n.read ? 'text-slate-900' : 'text-slate-600'}`}>
                                {n.title}
                              </p>
                              <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap ml-2">
                                {formatDate(n.timestamp, 'HH:mm')}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2 italic">
                              {n.message}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                        <Bell size={32} />
                      </div>
                      <h4 className="text-sm font-black text-slate-900 mb-1">All caught up!</h4>
                      <p className="text-[10px] text-slate-400 font-bold italic uppercase tracking-widest">No new notifications</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {notifications.length > 0 && (
                <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    onClick={() => close()}
                    className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors"
                  >
                    Close Panel
                  </button>
                </div>
              )}
                </>
              )}
            </Popover.Panel>
          </Transition>
        </Popover>

        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg transition-all">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-medium text-sm">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-slate-900 leading-tight">{profile?.full_name}</p>
              <p className="text-[10px] text-slate-500 capitalize">{profile?.role}</p>
            </div>
            <ChevronDown size={14} className="hidden lg:block text-slate-400" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-xl shadow-lg border border-slate-200 py-1 focus:outline-none">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-900">{profile?.full_name}</p>
                <p className="text-xs text-slate-500">{profile?.email || profile?.phone}</p>
              </div>
              
              <Menu.Item>
                {({ active }) => (
                  <button 
                    onClick={() => navigate('/staff')}
                    className={`${active ? 'bg-slate-50' : ''} flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700`}
                  >
                    <User size={16} className="text-slate-400" />
                    Profile
                  </button>
                )}
              </Menu.Item>
              
              <Menu.Item>
                {({ active }) => (
                  <button 
                    onClick={() => navigate('/settings')}
                    className={`${active ? 'bg-slate-50' : ''} flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700`}
                  >
                    <Settings size={16} className="text-slate-400" />
                    Settings
                  </button>
                )}
              </Menu.Item>
              
              <div className="border-t border-slate-100 my-1" />
              
              <Menu.Item>
                {({ active }) => (
                  <button 
                    onClick={signOut}
                    className={`${active ? 'bg-rose-50' : ''} flex items-center gap-3 w-full px-4 py-2 text-sm text-rose-600`}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

export default TopBar;