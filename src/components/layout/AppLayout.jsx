import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-black text-white antialiased">
      <Sidebar />

      {/* Main content with matching transition for the sidebar expansion */}
      <main className="md:pl-20 lg:pl-64 transition-all duration-300">
        <div className="max-w-4xl mx-auto min-h-screen">
          <Outlet />
        </div>
      </main>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default AppLayout;