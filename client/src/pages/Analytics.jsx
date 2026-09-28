import { Check, CircleDot, Clock3, Archive } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';

const statusRows = [
  { status: 'Open', icon: CircleDot, tone: 'open' },
  { status: 'In Progress', icon: Clock3, tone: 'progress' },
  { status: 'Resolved', icon: Check, tone: 'resolved' },
  { status: 'Closed', icon: Archive, tone: 'closed' },
];

export const Analytics = ({ tickets }) => {
  const total = tickets.length;
  return <>
    <div className="page-header"><div className="page-title-group"><p className="eyebrow">REPORTING</p><h1>Analytics</h1><p>A live view of the tickets in your workspace.</p></div><span className="count-label">{total} total</span></div>
    {!total ? <div className="content-card"><EmptyState title="No ticket data yet" description="Ticket metrics will appear here when requests arrive." /></div> : <section className="content-card analytics-card">
      <div className="card-header"><div><h3>Ticket status</h3><p className="card-caption">Current distribution across your tickets</p></div></div>
      <div className="analytics-list">{statusRows.map(({ status, icon: Icon, tone }) => {
        const count = tickets.filter((ticket) => ticket.status === status).length;
        const percent = total ? Math.round((count / total) * 100) : 0;
        return <div className="analytics-row" key={status}>
          <div className="analytics-row-label"><span className={`analytics-icon tone-${tone}`}><Icon size={16} /></span><strong>{status}</strong></div>
          <div className="analytics-meter"><div className={`analytics-meter-fill tone-${tone}`} style={{ width: `${percent}%` }} /></div>
          <span className="analytics-value">{count}<small>{percent}%</small></span>
        </div>;
      })}</div>
      <div className="analytics-footnote">Counts are based on tickets returned by the API for your account.</div>
    </section>}
  </>;
};
