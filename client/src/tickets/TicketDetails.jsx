import { useState } from 'react';
import { Sparkles, Send, MessageSquareText } from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { TicketStatusBadge } from './TicketStatusBadge';
import { TicketPriorityBadge } from './TicketPriorityBadge';

export const TicketDetails = ({ ticket, user, onClose, onUpdateTicket, onAnalyze, onSendReply, analyzing, canManage, saving }) => {
  if (!ticket) return null;
  return <TicketDetailsContent key={ticket.id} ticket={ticket} user={user} onClose={onClose} onUpdateTicket={onUpdateTicket} onAnalyze={onAnalyze} onSendReply={onSendReply} analyzing={analyzing} canManage={canManage} saving={saving} />;
};

const TicketDetailsContent = ({ ticket, user, onClose, onUpdateTicket, onAnalyze, onSendReply, analyzing, canManage, saving }) => {
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const messages = [...(ticket.messages || [])].sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt));

  const sendReply = async (event) => {
    event.preventDefault();
    if (!replyText.trim()) return;
    setReplying(true);
    const sent = await onSendReply(ticket.id, replyText.trim());
    if (sent) setReplyText('');
    setReplying(false);
  };

  return (
    <Modal isOpen onClose={onClose} title={`Ticket ${ticket.id}`}>
      <article className="ticket-detail">
        <header className="ticket-detail-heading">
          <div><p className="eyebrow">{ticket.category || 'Support request'} · {ticket.date}</p><h2>{ticket.subject}</h2><p className="ticket-customer">{ticket.customer || 'Customer'}{ticket.customerEmail ? ` · ${ticket.customerEmail}` : ''}</p></div>
          <div className="ticket-badges"><TicketStatusBadge status={ticket.status} /><TicketPriorityBadge priority={ticket.priority} /></div>
        </header>

        <section className="ticket-description"><h3>Request details</h3><p>{ticket.description}</p></section>

        {canManage && <section className="ticket-controls" aria-label="Ticket controls">
          <div className="form-group"><label htmlFor="ticket-status">Status</label><select id="ticket-status" value={ticket.status} disabled={saving} onChange={(event) => onUpdateTicket(ticket.id, { status: event.target.value })}><option>Open</option><option>In Progress</option><option>Resolved</option><option>Closed</option></select></div>
          <div className="form-group"><label htmlFor="ticket-priority-control">Priority</label><select id="ticket-priority-control" value={ticket.priority} disabled={saving} onChange={(event) => onUpdateTicket(ticket.id, { priority: event.target.value })}><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></div>
        </section>}

        <section className="conversation-section">
          <div className="section-heading"><div><MessageSquareText size={17} /><h3>Conversation</h3></div><span>{messages.length} {messages.length === 1 ? 'reply' : 'replies'}</span></div>
          {messages.length ? <div className="message-list">{messages.map((message) => (
            <article className={`message-bubble ${String(message.author?._id || message.author) === user?.id ? 'message-own' : ''}`} key={message.id}>
              <div className="message-meta"><strong>{message.authorName}</strong><span>{message.authorRole}</span><time>{message.createdAt ? new Date(message.createdAt).toLocaleString() : ''}</time></div>
              <p>{message.body}</p>
            </article>
          ))}</div> : <p className="conversation-empty">No replies yet. Send a message to start the conversation.</p>}
          <form className="reply-form" onSubmit={sendReply}>
            <label className="sr-only" htmlFor="ticket-reply">Your reply</label>
            <textarea id="ticket-reply" rows={3} maxLength={5000} value={replyText} onChange={(event) => setReplyText(event.target.value)} placeholder="Write a reply…" />
            <div className="reply-form-footer"><span>{replyText.length}/5000</span><Button type="submit" disabled={replying || !replyText.trim()}>{replying ? 'Sending…' : 'Send reply'}<Send size={14} /></Button></div>
          </form>
        </section>

        {canManage && <section className="ai-analysis">
          <div className="section-heading"><div><Sparkles size={17} /><h3>AI assist</h3></div><span>Private draft</span></div>
          {ticket.summary ? <div className="ai-result"><p>{ticket.summary}</p><div className="ai-result-meta"><span>{ticket.sentiment || 'Sentiment pending'}</span><span>{ticket.category}</span></div>
            {ticket.response && <div className="suggested-response"><div><strong>Suggested response</strong><button type="button" onClick={() => setReplyText(ticket.response)}>Use draft</button></div><p>{ticket.response}</p></div>}
          </div> : <p className="ai-placeholder">Generate a concise summary and suggested response from the ticket context.</p>}
          <Button variant="secondary" onClick={() => onAnalyze(ticket)} disabled={analyzing}>{analyzing ? 'Analyzing…' : <><Sparkles size={15} /> {ticket.summary ? 'Refresh analysis' : 'Analyze ticket'}</>}</Button>
        </section>}
      </article>
    </Modal>
  );
};
