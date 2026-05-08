import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import TopBar from './TopBar';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="md:pl-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export default AppLayout;