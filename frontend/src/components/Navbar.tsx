import React from 'react';
import {
  Share2,
  GitFork,
  Sparkles,
  Waypoints,
  DownloadCloud,
  Activity,
  RotateCcw,
  FileSpreadsheet
} from 'lucide-react';
import type { HealthStatus } from '../types';

interface NavbarProps {
  activeTab: 'explorer' | 'lineage' | 'gaps' | 'bridges' | 'ingest';
  setActiveTab: (tab: 'explorer' | 'lineage' | 'gaps' | 'bridges' | 'ingest') => void;
  health: HealthStatus | null;
  onReseed: () => void;
  isReseeding: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  health,
  onReseed,
  isReseeding
}) => {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 28px',
      background: '#FFFFFF',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-control)'
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          background: 'var(--primary)',
          padding: '7px',
          borderRadius: 'var(--radius-control)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #111827'
        }}>
          <FileSpreadsheet size={16} color="#FFFFFF" strokeWidth={2.2} />
        </div>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            PaperFlow
          </h1>
        </div>
      </div>

      {/* Nav Tabs */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'var(--surface)',
        padding: '3px',
        borderRadius: 'var(--radius-pill)',
        border: '1px solid var(--border)'
      }}>
        {[
          { id: 'explorer', label: 'Explorer', icon: Share2 },
          { id: 'lineage', label: 'Lineage', icon: GitFork },
          { id: 'gaps', label: 'Gap Finder', icon: Sparkles },
          { id: 'bridges', label: 'Bridges', icon: Waypoints },
          { id: 'ingest', label: 'Ingest', icon: DownloadCloud },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '12px',
                fontFamily: 'var(--font-display)',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                background: isActive ? 'var(--primary)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right Stats & Reseed */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Health status badge & Paper count */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'var(--canvas-soft)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--hairline)',
          fontSize: '12px',
          fontFamily: 'var(--font-mono)'
        }}>
          <div style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: health?.status === 'healthy' ? '#1aae39' : '#e03e3e',
            boxShadow: health?.status === 'healthy' ? '0 0 5px rgba(26,174,57,0.4)' : 'none'
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', color: 'var(--ink-secondary)' }}>
            <span style={{
              background: 'rgba(0, 117, 222, 0.08)',
              color: 'var(--primary)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(0, 117, 222, 0.25)',
              fontWeight: 600
            }}>
              📚 {health?.papers ?? '...'} Papers
            </span>
            <span style={{ color: '#d4d0ca' }}>|</span>
            <span>
              <strong style={{ color: 'var(--ink)' }}>{health?.nodes ?? '...'}</strong> nodes
            </span>
            <span style={{ color: '#d4d0ca' }}>|</span>
            <span>
              <strong style={{ color: 'var(--ink)' }}>{health?.relationships ?? '...'}</strong> edges
            </span>
            <span style={{ color: '#d4d0ca' }}>|</span>
            <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
              <Activity size={12} /> {health?.latency_ms ? `${health.latency_ms}ms` : '...'}
            </span>
          </div>
        </div>

        {/* Reseed Button */}
        <button
          onClick={onReseed}
          disabled={isReseeding}
          title="Reload curated landmark AI/ML seed dataset"
          className="aura-btn-secondary"
          style={{ fontSize: '12px', padding: '6px 14px', borderRadius: 'var(--radius-md)' }}
        >
          <RotateCcw size={13} className={isReseeding ? 'animate-spin-slow' : ''} />
          {isReseeding ? 'Seeding...' : 'Reseed Data'}
        </button>
      </div>
    </header>
  );
};
