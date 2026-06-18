import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showProfileInfo?: boolean;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, subtitle, actions }) => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      {/* Top Bar */}
      <div
        style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            padding: 'var(--sp-4) var(--sp-6)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--sp-4)',
          }}
        >
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-icon"
            aria-label="Go back"
            id="layout-back-btn"
          >
            <ArrowLeft size={18} />
          </button>

          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
                letterSpacing: '-0.2px',
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '1px' }}>
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-2">{actions}</div>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className="animate-fade-in"
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: 'var(--sp-6)',
          paddingBottom: 'var(--sp-12)',
        }}
      >
        {children}
      </div>
    </div>
  );
};
