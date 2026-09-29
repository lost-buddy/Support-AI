// src/components/dashboard/TicketTable.jsx
import { TicketStatusBadge } from '../../tickets/TicketStatusBadge';
import { TicketPriorityBadge } from '../../tickets/TicketPriorityBadge';
import { EmptyState } from '../common/EmptyState';

export const TicketTable = ({ tickets, onSelectTicket, showUpdatedAt = false }) => {
  if (tickets.length === 0) return <EmptyState />;

  return (
    <div className="table-container">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Customer</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Date</th>
            {showUpdatedAt && <th>Last updated</th>}
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="ticket-row"
              tabIndex={0}
              aria-label={`Open ticket ${ticket.id}: ${ticket.subject}`}
              onClick={() => onSelectTicket(ticket)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelectTicket(ticket);
                }
              }}
            >
              <td>
                <div className="ticket-title-cell">
                  <strong>{ticket.subject}</strong>
                  <span className="ticket-id-sub">{ticket.id}</span>
                </div>
              </td>
              <td><span className="customer-name">{ticket.customer || '—'}</span>{ticket.customerEmail && <small className="customer-email">{ticket.customerEmail}</small>}</td>
              <td>{ticket.category}</td>
              <td><TicketPriorityBadge priority={ticket.priority} /></td>
              <td><TicketStatusBadge status={ticket.status} /></td>
              <td>{ticket.date}</td>
              {showUpdatedAt && <td>{ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleDateString() : '—'}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
