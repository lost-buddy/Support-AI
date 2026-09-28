// src/components/common/EmptyState.jsx
import { Ticket } from 'lucide-react';

export const EmptyState = ({ title = "No data found", description = "Try adjusting your filters." }) => (
  <div className="empty-state">
    <Ticket size={28} aria-hidden="true" />
    <h4>{title}</h4>
    <p>{description}</p>
  </div>
);
