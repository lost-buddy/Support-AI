export const Settings = ({ user }) => (
  <>
    <div className="page-header"><div className="page-title-group"><p className="eyebrow">ACCOUNT</p><h1>Settings</h1><p>Review the profile connected to this workspace.</p></div></div>
    <section className="content-card settings-card">
      <div className="card-header"><div><h3>Account profile</h3><p className="card-caption">Your signed-in identity</p></div></div>
      <dl className="settings-list">
        <div><dt>Name</dt><dd>{user?.name || '—'}</dd></div>
        <div><dt>Email</dt><dd>{user?.email || '—'}</dd></div>
        <div><dt>Access role</dt><dd className="role-label">{user?.role || 'member'}</dd></div>
      </dl>
    </section>
  </>
);
