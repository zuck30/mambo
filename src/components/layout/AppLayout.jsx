import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-dark text-white pb-16">
      <main className="max-w-md mx-auto min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
