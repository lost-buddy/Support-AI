// src/components/tickets/TicketStatusBadge.jsx

export const TicketStatusBadge = ({ status }) => {
  const formattedStatus = status.toLowerCase().replace(" ", "-");
  return (
    <span className={`badge status-${formattedStatus}`}>
      {status}
    </span>
  );
};