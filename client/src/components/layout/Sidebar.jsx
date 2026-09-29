import { LayoutDashboard, Ticket, Users, BarChart3, Settings, LogOut, CircleHelp, Bell, UserRound } from 'lucide-react';
import { Brand } from '../common/Brand';
import { UserAvatar } from '../common/UserAvatar';

const staffNavItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'All Tickets', icon: Ticket },
  { label: 'Customers', icon: Users },
  { label: 'Analytics', icon: BarChart3 },
];

const customerNavItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'My Tickets', icon: Ticket },
  { label: 'Help Center', icon: CircleHelp },
  { label: 'Notifications', icon: Bell },
  { label: 'Profile', icon: UserRound },
];

export const Sidebar = ({ activeNav, setActiveNav, isOpen, setIsOpen, user, totalTickets, onLogout }) => {
  const isCustomer = user?.role === 'customer';
  const navItems = isCustomer ? customerNavItems : staffNavItems;
  return (
  <>
    {isOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setIsOpen(false)} />}
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand"><Brand /></div>
      <div className="workspace-select">
        <UserAvatar user={user} className="workspace-avatar" />
        <div className="workspace-info"><strong>Support workspace</strong><span>Connected account</span></div>
      </div>
      <div className="nav-section">WORKSPACE</div>
      <nav className="main-nav" aria-label="Main navigation">
        {navItems.map(({ label, icon: Icon }) => (
          <button key={label} className={`nav-item ${activeNav === label ? 'active' : ''}`} aria-current={activeNav === label ? 'page' : undefined} onClick={() => { setActiveNav(label); setIsOpen(false); }}>
            <Icon size={17} strokeWidth={1.8} /><span>{label}</span>{label === 'All Tickets' && <span className="nav-badge">{totalTickets}</span>}
          </button>
        ))}
      </nav>
      <div className="nav-section nav-section-bottom">ACCOUNT</div>
      <nav className="main-nav" aria-label="Account navigation">
        <button className={`nav-item ${activeNav === 'Settings' ? 'active' : ''}`} aria-current={activeNav === 'Settings' ? 'page' : undefined} onClick={() => { setActiveNav('Settings'); setIsOpen(false); }}>
          <Settings size={17} strokeWidth={1.8} /><span>Settings</span>
        </button>
      </nav>
      <div className="sidebar-footer">
        <div className="profile-card">
          <UserAvatar user={user} />
          <div className="profile-meta"><strong>{user?.name || 'Account'}</strong><span>{user?.role || 'Member'}</span></div>
          <button className="icon-button logout-button" aria-label="Sign out" title="Sign out" onClick={onLogout}><LogOut size={16} /></button>
        </div>
      </div>
    </aside>
  </>
  );
};
