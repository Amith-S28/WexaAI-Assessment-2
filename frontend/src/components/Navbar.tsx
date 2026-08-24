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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          background: 'var(--primary)',
          padding: '8px',
          borderRadius: 'var(--radius-control)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-control)'
        }}>
          <FileSpreadsheet size={18} color="#FFFFFF" strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)'
            }}>
              PaperFlow <span style={{ color: 'var(--primary)', fontWeight: 500 }}>Citation Graph</span>
            </h1>
            <span className="aura-tag-mono" style={{ fontSize: '10px', padding: '2px 6px' }}>
              PRO
            </span>
          </div>
          <div style={{
            fontSize: '11px',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontFamily: 'var(--font-body)'
          }}>
            <span>Powered by</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>CognoDB Cloud</span>
            <span>(openCypher Engine)</span>
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'var(--surface)',
        padding: '4px',
        borderRadius: 'var(--radius-pill)',
        border: '1px solid var(--border)'
      }}>
        {[
          { id: 'explorer', label: 'Graph Explorer', icon: Share2 },
          { id: 'lineage', label: 'Lineage Tracing', icon: GitFork },
          { id: 'gaps', label: 'Gap Finder', icon: Sparkles },
          { id: 'bridges', label: 'Bridge Discovery', icon: Waypoints },
          { id: 'ingest', label: 'Live Ingest', icon: DownloadCloud },
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
                gap: '7px',
                padding: '7px 15px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '13px',
                fontFamily: 'var(--font-display)',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                background: isActive ? 'var(--primary)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? 'var(--shadow-control)' : 'none'
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right Stats & Reseed */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Health status badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'var(--surface)',
          padding: '6px 12px',
          borderRadius: 'var(--radius-control)',
          border: '1px solid var(--border)',
          fontSize: '12px',
          fontFamily: 'var(--font-mono)'
        }}>
          <div style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: health?.status === 'healthy' ? '#10B981' : '#EF4444'
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <span>
              <strong style={{ color: 'var(--text-primary)' }}>{health?.nodes ?? '...'}</strong> nodes
            </span>
            <span style={{ color: '#D1D5DB' }}>|</span>
            <span>
              <strong style={{ color: 'var(--text-primary)' }}>{health?.relationships ?? '...'}</strong> edges
            </span>
            <span style={{ color: '#D1D5DB' }}>|</span>
            <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Activity size={11} /> {health?.latency_ms ? `${health.latency_ms}ms` : '...'}
            </span>
          </div>
        </div>

        {/* Reseed Button */}
        <button
          onClick={onReseed}
          disabled={isReseeding}
          title="Reload curated landmark AI/ML seed dataset"
          className="aura-btn-secondary"
          style={{ fontSize: '12px', padding: '6px 12px' }}
        >
          <RotateCcw size={13} className={isReseeding ? 'animate-spin-slow' : ''} />
          {isReseeding ? 'Seeding...' : 'Reseed Data'}
        </button>
      </div>
    </header>
  );
};
