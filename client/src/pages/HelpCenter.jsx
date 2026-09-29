import { BookOpen, MessageSquareText, ShieldCheck } from 'lucide-react';
import { Button } from '../components/common/Button';

const resources = [
  { icon: MessageSquareText, title: 'How do I follow up on a request?', body: 'Open My Tickets, select a request, and reply in its conversation. The support team will see your message on the same ticket.' },
  { icon: BookOpen, title: 'What do ticket statuses mean?', body: 'Open means the team has received your request. In Progress means someone is working on it. Resolved and Closed indicate the request has been completed.' },
  { icon: ShieldCheck, title: 'How is my account protected?', body: 'Your email is used to identify your account and cannot be changed here. Use Settings to update your profile details or change an email/password account password.' },
];

export const HelpCenter = ({ onCreateTicket }) => (
  <>
    <div className="page-header"><div className="page-title-group"><p className="eyebrow">SUPPORT RESOURCES</p><h1>Help Center</h1><p>Quick answers for managing your support requests.</p></div><Button onClick={onCreateTicket}>Contact support</Button></div>
    <div className="help-grid">{resources.map(({ icon: Icon, title, body }) => <article className="content-card help-card" key={title}><div className="help-icon"><Icon size={17} /></div><h2>{title}</h2><p>{body}</p></article>)}</div>
  </>
);
