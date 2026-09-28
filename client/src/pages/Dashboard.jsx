// src/pages/Dashboard.jsx
import { Ticket, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { TicketFilters } from '../components/dashboard/TicketFilters';
import { TicketTable } from '../components/dashboard/TicketTable';
import { AIInsights } from '../components/dashboard/AIInsights';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { Button } from '../components/common/Button';

export const Dashboard = ({ tickets, allTickets = tickets, filter, setFilter, onSelectTicket, onOpenCreate, onTryAI, canUseAI }) => {
  const total = allTickets.length;
  const open = allTickets.filter(t => t.status === "Open").length;
  const inProgress = allTickets.filter(t => t.status === "In Progress").length;
  const resolved = allTickets.filter(t => t.status === "Resolved").length;

  return (
    <>
      <div className="page-header">
        <div className="page-title-group">
          <p className="eyebrow">WORKSPACE OVERVIEW</p>
          <h1>Overview</h1>
          <p>A clear view of the requests that need your team.</p>
        </div>
        <Button onClick={onOpenCreate}>Create Ticket</Button>
      </div>

      <div className="stats-grid">
        <StatCard icon={Ticket} label="Total tickets" value={total} color="var(--primary)" />
        <StatCard icon={AlertCircle} label="Open tickets" value={open} color="var(--status-open)" />
        <StatCard icon={Clock} label="In Progress" value={inProgress} color="var(--status-progress)" />
        <StatCard icon={CheckCircle2} label="Resolved" value={resolved} color="var(--status-resolved)" />
      </div>

      <div className="dashboard-layout">
        <div className="content-card">
          <TicketFilters filter={filter} setFilter={setFilter} />
          <TicketTable tickets={tickets} onSelectTicket={onSelectTicket} />
        </div>

        <div className="sidebar-panel">
          <AIInsights onTryAI={onTryAI} disabled={!canUseAI} />
          <RecentActivity tickets={allTickets} />
        </div>
      </div>
    </>
  );
};
