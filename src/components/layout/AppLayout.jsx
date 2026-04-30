import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[var(--color-background)] selection:bg-primary/20 selection:text-primary overflow-hidden">
      {/* Sidebar with dynamic width */}
      <div className={`transition-all duration-500 ease-in-out ${sidebarOpen ? 'w-72' : 'w-0'} h-full overflow-hidden shrink-0`}>
        <Sidebar isOpen={sidebarOpen} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <div className="mx-auto max-w-7xl animate-in fade-in zoom-in-95 duration-700">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
