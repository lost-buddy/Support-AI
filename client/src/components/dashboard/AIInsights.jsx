// src/components/dashboard/AIInsights.jsx
import { Sparkles } from 'lucide-react';

export const AIInsights = ({ onTryAI, disabled = false }) => (
  <div className="ai-card">
    <div className="ai-card-header">
      <Sparkles size={16} />
      <span>AI ASSISTANT</span>
    </div>
    <p>Summarize a customer request and draft a thoughtful next response.</p>
    <button className="primary-button" style={{ width: '100%', justifyContent: 'center' }} onClick={onTryAI} disabled={disabled || !onTryAI}>
      <Sparkles size={14} /> Analyze open ticket
    </button>
  </div>
);
