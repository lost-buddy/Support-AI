// src/components/dashboard/TicketFilters.jsx

export const TicketFilters = ({ filter, setFilter }) => {
  const statuses = ["All", "Open", "In Progress", "Resolved", "Closed"];
  return (
    <div className="filter-toolbar">
      <div className="filter-tabs">
        {statuses.map((status) => (
          <button
            key={status}
            className={`filter-tab ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};
