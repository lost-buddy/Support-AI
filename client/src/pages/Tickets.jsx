// src/pages/Tickets.jsx
import { TicketFilters } from '../components/dashboard/TicketFilters';
import { TicketTable } from '../components/dashboard/TicketTable';
import { Button } from '../components/common/Button';

export const Tickets = ({ tickets, filter, setFilter, onSelectTicket, onOpenCreate, customerView = false }) => (
  <>
    <div className="page-header">
      <div className="page-title-group">
        <p className="eyebrow">{customerView ? 'SUPPORT' : 'INBOX'}</p>
        <h1>{customerView ? 'My Tickets' : 'All Tickets'}</h1>
        <p>{customerView ? 'Track your requests and continue the conversation.' : 'Review requests and keep each conversation moving.'}</p>
      </div>
      <span className="count-label">{tickets.length} visible</span>
      <Button onClick={onOpenCreate}>{customerView ? 'New support ticket' : 'Create Ticket'}</Button>
    </div>

    <div className="content-card">
      <TicketFilters filter={filter} setFilter={setFilter} />
      <TicketTable tickets={tickets} onSelectTicket={onSelectTicket} showUpdatedAt={customerView} />
    </div>
  </>
);
