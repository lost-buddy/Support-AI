import { useState } from 'react';
import { changePassword, updateNotificationPreferences } from '../api/auth';
import { Button } from '../components/common/Button';

export const Settings = ({ user, onUserUpdated }) => {
  const [preferences, setPreferences] = useState(user?.notificationPreferences || { ticketUpdates: true, supportReplies: true });
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [preferenceMessage, setPreferenceMessage] = useState('');
  const [preferenceError, setPreferenceError] = useState('');
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const savePreferences = async (event) => {
    event.preventDefault();
    setSavingPreferences(true); setPreferenceError(''); setPreferenceMessage('');
    try {
      const updatedUser = await updateNotificationPreferences(preferences);
      onUserUpdated(updatedUser);
      setPreferences(updatedUser.notificationPreferences);
      setPreferenceMessage('Notification preferences saved.');
    } catch (error) {
      setPreferenceError(error.response?.data?.message || 'Could not save preferences. Please try again.');
    } finally { setSavingPreferences(false); }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    setPasswordError(''); setPasswordMessage('');
    if (passwords.newPassword !== passwords.confirmPassword) { setPasswordError('New passwords do not match.'); return; }
    setSavingPassword(true);
    try {
      const result = await changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswordMessage(result.message || 'Password changed successfully.');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Could not change password. Please try again.');
    } finally { setSavingPassword(false); }
  };

  return <>
    <div className="page-header"><div className="page-title-group"><p className="eyebrow">ACCOUNT</p><h1>Settings</h1><p>Manage your account and notification preferences.</p></div></div>
    <div className="settings-sections">
      <section className="content-card settings-card"><div className="card-header"><div><h3>Account</h3><p className="card-caption">Your signed-in identity</p></div></div><dl className="settings-list">
        <div><dt>Name</dt><dd>{user?.name || '—'}</dd></div><div><dt>Email</dt><dd>{user?.email || '—'}</dd></div><div><dt>Access role</dt><dd className="role-label">{user?.role || 'member'}</dd></div>
      </dl></section>

      <form className="content-card settings-card" onSubmit={savePreferences}><div className="card-header"><div><h3>Notification preferences</h3><p className="card-caption">Choose which ticket updates appear in your notifications.</p></div></div>
        <div className="settings-preferences">
          <label className="preference-row"><span><strong>Ticket status updates</strong><small>Show status changes made by the support team.</small></span><input type="checkbox" checked={preferences.ticketUpdates !== false} onChange={(event) => setPreferences({ ...preferences, ticketUpdates: event.target.checked })} /></label>
          <label className="preference-row"><span><strong>Support replies</strong><small>Show replies from agents and administrators.</small></span><input type="checkbox" checked={preferences.supportReplies !== false} onChange={(event) => setPreferences({ ...preferences, supportReplies: event.target.checked })} /></label>
          {preferenceError && <p className="form-error" role="alert">{preferenceError}</p>}{preferenceMessage && <p className="form-success" role="status">{preferenceMessage}</p>}
          <Button type="submit" disabled={savingPreferences}>{savingPreferences ? 'Saving…' : 'Save Changes'}</Button>
        </div>
      </form>

      <section className="content-card settings-card"><div className="card-header"><div><h3>Password</h3><p className="card-caption">{user?.hasPassword ? 'Change your email and password sign-in password.' : 'This account signs in with Google.'}</p></div></div>
        {user?.hasPassword ? <form className="settings-form" onSubmit={savePassword}>
          <div className="form-group"><label htmlFor="current-password">Current password</label><input id="current-password" type="password" autoComplete="current-password" required value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} /></div>
          <div className="form-row"><div className="form-group"><label htmlFor="new-password">New password</label><input id="new-password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} /></div><div className="form-group"><label htmlFor="confirm-password">Confirm new password</label><input id="confirm-password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={passwords.confirmPassword} onChange={(event) => setPasswords({ ...passwords, confirmPassword: event.target.value })} /></div></div>
          {passwordError && <p className="form-error" role="alert">{passwordError}</p>}{passwordMessage && <p className="form-success" role="status">{passwordMessage}</p>}
          <Button type="submit" disabled={savingPassword}>{savingPassword ? 'Updating…' : 'Change Password'}</Button>
        </form> : <p className="settings-note">Password changes are unavailable for Google-only accounts.</p>}
      </section>
      <p className="settings-note">Theme selection is not available in this version; the SupportAI dark appearance is retained.</p>
    </div>
  </>;
};
