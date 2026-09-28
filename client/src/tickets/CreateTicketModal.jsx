import { useState } from 'react';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';

const emptyForm = { subject: '', category: 'Technical', priority: 'Medium', description: '' };

export const CreateTicketModal = ({ isOpen, onClose, onCreate, saving = false, error = '' }) => {
  const [form, setForm] = useState(emptyForm);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const ticketData = {
      ...form,
      subject: form.subject.trim(),
      description: form.description.trim(),
    };
    if (!ticketData.subject || !ticketData.description) return;
    const created = await onCreate(ticketData);
    if (created) {
      setForm(emptyForm);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a support ticket">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="ticket-subject">Subject</label>
          <input id="ticket-subject" required maxLength={160} value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} placeholder="Briefly describe the issue" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ticket-category">Category</label>
            <select id="ticket-category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              <option>Payment</option><option>Account</option><option>Technical</option><option>Delivery</option><option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="ticket-priority">Priority</label>
            <select id="ticket-priority" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
              <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="ticket-description">How can we help?</label>
          <textarea id="ticket-description" rows={5} required maxLength={5000} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Add details that will help the team investigate…" />
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <Button type="submit" disabled={saving} className="modal-submit">{saving ? 'Creating…' : 'Create ticket'}</Button>
      </form>
    </Modal>
  );
};
