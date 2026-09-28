// src/pages/Tickets.jsx
import { TicketFilters } from '../components/dashboard/TicketFilters';
import { TicketTable } from '../components/dashboard/TicketTable';
import { Button } from '../components/common/Button';

export const Tickets = ({ tickets, filter, setFilter, onSelectTicket, onOpenCreate }) => (
  <>
    <div className="page-header">
      <div className="page-title-group">
        <p className="eyebrow">INBOX</p>
        <h1>All Tickets</h1>
        <p>Review requests and keep each conversation moving.</p>
      </div>
      <span className="count-label">{tickets.length} visible</span>
      <Button onClick={onOpenCreate}>Create Ticket</Button>
    </div>

    <div className="content-card">
      <TicketFilters filter={filter} setFilter={setFilter} />
      <TicketTable tickets={tickets} onSelectTicket={onSelectTicket} />
    </div>
  </>
);
