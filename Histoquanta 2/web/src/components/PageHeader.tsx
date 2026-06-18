import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backPath?: string;
  actions?: React.ReactNode;
  badge?: { label: string; color?: string };
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  backPath,
  actions,
  badge,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) navigate(backPath);
    else navigate(-1);
  };

  return (
    <div
      className="flex items-center gap-4 mb-6"
      style={{ paddingBottom: 'var(--sp-6)', borderBottom: '1px solid var(--border)' }}
    >
      {showBack && (
        <button
          className="btn btn-ghost btn-icon"
          onClick={handleBack}
          aria-label="Go back"
          id="page-header-back-btn"
        >
          <ArrowLeft size={18} />
        </button>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="flex items-center gap-3" style={{ flexWrap: 'wrap' }}>
          <h1
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.3px',
              margin: 0,
            }}
          >
            {title}
          </h1>
          {badge && (
            <span
              className={`badge badge-${badge.color || 'blue'}`}
              style={{ fontSize: '11px', flexShrink: 0 }}
            >
              {badge.label}
            </span>
          )}
        </div>
        {subtitle && (
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
              marginTop: '2px',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
          {actions}
        </div>
      )}
    </div>
  );
};
