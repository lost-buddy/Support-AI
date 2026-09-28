// src/components/tickets/TicketPriorityBadge.jsx

export const TicketPriorityBadge = ({ priority }) => {
  const formattedPriority = priority.toLowerCase();
  return (
    <div className={`priority-indicator priority-${formattedPriority}`}>
      <span className="priority-dot" />
      <span>{priority}</span>
    </div>
  );
};