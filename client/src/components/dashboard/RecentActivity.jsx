import { MessageSquare, TicketCheck } from 'lucide-react';

const relativeTime = (value) => {
  if (!value) return '';
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export const RecentActivity = ({ tickets = [] }) => {
  const activity = tickets.slice(0, 4).flatMap((ticket) => {
    const latestMessage = ticket.messages?.at(-1);
    return latestMessage
      ? [{ id: `${ticket.id}-${latestMessage.id}`, icon: MessageSquare, title: latestMessage.authorName, detail: ticket.subject, date: latestMessage.createdAt }]
      : [{ id: ticket.id, icon: TicketCheck, title: 'Ticket created', detail: ticket.subject, date: ticket.createdAt }];
  }).slice(0, 4);

  return (
    <section className="content-card activity-card">
      <div className="card-header"><h3>Recent activity</h3><span className="card-caption">Latest updates</span></div>
      {activity.length ? <div className="activity-list">
        {activity.map(({ id, icon: Icon, title, detail, date }) => (
          <div className="activity-item" key={id}>
            <div className="activity-icon"><Icon size={15} /></div>
            <div className="activity-details"><strong>{title}</strong><span>{detail}</span><small>{relativeTime(date)}</small></div>
          </div>
        ))}
      </div> : <p className="activity-empty">Activity will appear here as tickets are updated.</p>}
    </section>
  );
};
