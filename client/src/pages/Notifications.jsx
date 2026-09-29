import { Bell, MessageSquareText, RefreshCw } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';

export const Notifications = ({ tickets, preferences, onSelectTicket }) => {
  const notifications = tickets.flatMap((ticket) => {
    const replies = preferences?.supportReplies === false ? [] : (ticket.messages || [])
      .filter((message) => ['admin', 'agent'].includes(message.authorRole))
      .map((message) => ({ id: `reply-${ticket.id}-${message.id}`, type: 'reply', ticket, date: message.createdAt, title: `${message.authorName} replied`, detail: message.body }));
    const changes = preferences?.ticketUpdates === false ? [] : (ticket.statusHistory || [])
      .filter((event) => ['admin', 'agent'].includes(event.changedByRole))
      .map((event) => ({ id: `status-${event.id}`, type: 'status', ticket, date: event.createdAt, title: `Status changed to ${event.status}`, detail: `Updated by ${event.changedByName}` }));
    return [...replies, ...changes];
  }).sort((left, right) => new Date(right.date || 0) - new Date(left.date || 0));

  return <>
    <div className="page-header"><div className="page-title-group"><p className="eyebrow">YOUR ACCOUNT</p><h1>Notifications</h1><p>Replies and status updates from your support team.</p></div></div>
    {notifications.length ? <div className="notification-list">{notifications.map((item) => {
      const Icon = item.type === 'reply' ? MessageSquareText : RefreshCw;
      return <button className="notification-item" type="button" key={item.id} onClick={() => onSelectTicket(item.ticket)}><span className="notification-item-icon"><Icon size={16} /></span><span className="notification-item-copy"><strong>{item.title}</strong><span>{item.ticket.subject}</span><small>{item.detail}</small></span><time>{item.date ? new Date(item.date).toLocaleString() : ''}</time></button>;
    })}</div> : <div className="content-card"><EmptyState icon={Bell} title="No updates yet" description="Support replies and ticket status changes will appear here." /></div>}
  </>;
};
