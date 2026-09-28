// src/components/dashboard/StatCard.jsx

export const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="stat-card">
    <div className="stat-header">
      <span>{label}</span>
      <div className="stat-icon" style={{ '--stat-accent': color }}>
        <Icon size={16} />
      </div>
    </div>
    <div className="stat-value">{value}</div>
  </div>
);
