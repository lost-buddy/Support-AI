import { useState } from 'react';
import { updateProfile } from '../api/auth';
import { Button } from '../components/common/Button';
import { UserAvatar } from '../components/common/UserAvatar';

export const Profile = ({ user, onUserUpdated }) => {
  const [form, setForm] = useState({ name: user?.name || '', profilePicture: user?.profilePicture || '', phoneNumber: user?.phoneNumber || '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const submit = async (event) => {
    event.preventDefault(); setError(''); setSuccess(''); setSaving(true);
    try {
      const updatedUser = await updateProfile({ name: form.name.trim(), profilePicture: form.profilePicture.trim(), phoneNumber: form.phoneNumber.trim() });
      onUserUpdated(updatedUser);
      setSuccess('Your profile has been updated.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not update your profile. Please try again.');
    } finally { setSaving(false); }
  };

  return <>
    <div className="page-header"><div className="page-title-group"><p className="eyebrow">YOUR ACCOUNT</p><h1>Edit Profile</h1><p>Update the details shown to your support team.</p></div></div>
    <form className="content-card profile-form" onSubmit={submit}>
      <div className="profile-form-heading"><UserAvatar user={{ ...user, name: form.name || user?.name, profilePicture: form.profilePicture }} className="profile-hero-avatar" /><div><h2>Profile information</h2><p>Your email remains read-only.</p></div></div>
      <div className="profile-form-fields">
        <div className="form-group"><label htmlFor="profile-name">Full name</label><input id="profile-name" autoComplete="name" required minLength={1} maxLength={100} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
        <div className="form-group"><label htmlFor="profile-email">Email address</label><input id="profile-email" type="email" value={user?.email || ''} readOnly aria-readonly="true" /></div>
        <div className="form-group"><label htmlFor="profile-picture">Profile picture URL</label><input id="profile-picture" type="url" maxLength={2048} placeholder="https://…" value={form.profilePicture} onChange={(event) => setForm({ ...form, profilePicture: event.target.value })} /><small className="field-hint">Use an HTTPS image URL. Google profile photos are added automatically when available.</small></div>
        <div className="form-group"><label htmlFor="profile-phone">Phone number</label><input id="profile-phone" type="tel" autoComplete="tel" maxLength={32} pattern="[+0-9(). -]{7,32}" placeholder="Optional" value={form.phoneNumber} onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })} /></div>
        {user?.createdAt && <p className="profile-created">Account created {new Date(user.createdAt).toLocaleDateString()}</p>}
        {error && <p className="form-error" role="alert">{error}</p>}{success && <p className="form-success" role="status">{success}</p>}
        <div><Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button></div>
      </div>
    </form>
  </>;
};
