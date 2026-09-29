// src/components/layout/MainLayout.jsx
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const MainLayout = ({ children, activeNav, setActiveNav, search, setSearch, totalTickets, openTicketsCount, user, onLogout, onRefresh, refreshing }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        user={user}
        totalTickets={totalTickets}
        onLogout={onLogout}
      />
      <div className="main-wrapper">
        <Navbar
          activeNav={activeNav}
          search={search}
          setSearch={setSearch}
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
          openTicketsCount={openTicketsCount}
          onRefresh={onRefresh}
          refreshing={refreshing}
          isCustomer={user?.role === 'customer'}
          onOpenNotifications={() => setActiveNav('Notifications')}
        />
        <main className="page-container">{children}</main>
      </div>
    </div>
  );
};
