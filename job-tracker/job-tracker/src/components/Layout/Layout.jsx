import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children, currentPage, onNavigate }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : true
  );

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900">
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-30 app-background" />
      </div>

      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        currentPage={currentPage}
        onNavigate={onNavigate}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Navbar
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentPage={currentPage}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
