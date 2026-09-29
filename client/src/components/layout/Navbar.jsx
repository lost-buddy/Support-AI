import { useState } from 'react';
import { Menu, Bell, RefreshCw } from 'lucide-react';
import { SearchBar } from '../common/SearchBar';
import { Brand } from '../common/Brand';

export const Navbar = ({ activeNav, search, setSearch, onToggleSidebar, openTicketsCount, onRefresh, refreshing, isCustomer, onOpenNotifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="icon-button mobile-menu-btn" aria-label="Open navigation" onClick={onToggleSidebar}><Menu size={17} /></button>
        <Brand compact />
        <div className="breadcrumbs"><span>Workspace</span><span className="breadcrumb-separator">/</span><strong>{activeNav}</strong></div>
      </div>
      <div className="navbar-right">
        <SearchBar value={search} onChange={(event) => setSearch(event.target.value)} />
        <button className="icon-button refresh-button" aria-label="Refresh data" title="Refresh data" onClick={onRefresh} disabled={refreshing}><RefreshCw size={16} className={refreshing ? 'spin' : ''} /></button>
        {isCustomer ? <button className="icon-button" aria-label="Open notifications" title="Notifications" onClick={onOpenNotifications}><Bell size={16} /></button> : <div className="notification-wrap">
          <button className="icon-button" aria-label="Notifications" aria-expanded={showNotifications} onClick={() => setShowNotifications((visible) => !visible)}>
            <Bell size={16} />{openTicketsCount > 0 && <span className="notification-badge" />}
          </button>
          {showNotifications && <div className="notification-dropdown"><h4>Open tickets</h4><p>{openTicketsCount === 0 ? 'You are all caught up.' : `${openTicketsCount} open ${openTicketsCount === 1 ? 'ticket needs' : 'tickets need'} attention.`}</p></div>}
        </div>}
      </div>
    </header>
  );
};
