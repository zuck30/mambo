import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="md:ml-20 pb-16 md:pb-0">
        <div className="max-w-md md:max-w-4xl mx-auto min-h-screen">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default AppLayout;
