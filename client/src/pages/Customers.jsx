import { Users } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';

export const Customers = ({ tickets }) => {
  const customers = [...new Map(tickets.filter((ticket) => ticket.customer).map((ticket) => [ticket.customer, { name: ticket.customer, email: ticket.customerEmail }])).values()];

  return <>
    <div className="page-header"><div className="page-title-group"><p className="eyebrow">PEOPLE</p><h1>Customers</h1><p>People who have contacted your support team.</p></div><span className="count-label">{customers.length} {customers.length === 1 ? 'customer' : 'customers'}</span></div>
    {customers.length ? <div className="customers-grid">{customers.map(({ name, email }) => {
      const count = tickets.filter((ticket) => ticket.customer === name).length;
      return <article key={name} className="customer-card"><div className="customer-avatar">{name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div><div className="customer-card-meta"><strong>{name}</strong><span>{email || 'Email not available'}</span></div><div className="customer-ticket-count"><Users size={14} />{count}</div></article>;
    })}</div> : <div className="content-card"><EmptyState title="No customers yet" description="Customer profiles appear here when tickets are created." /></div>}
  </>;
};
