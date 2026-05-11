import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';

const AppLayout = () => {
  const location = useLocation();
  const isChatPage = location.pathname.includes('/app/chat/');

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      <Sidebar />

      {/* Main content with matching transition for the sidebar expansion */}
      <main className={`${isChatPage ? '' : 'md:pl-20'} transition-all duration-300`}>
        <div className={`${isChatPage ? '' : 'max-w-4xl mx-auto'} min-h-screen`}>
          <Outlet />
        </div>
      </main>

      {!isChatPage && (
        <div className="md:hidden">
          <BottomNav />
        </div>
      )}
    </div>
  );
};

export default AppLayout;