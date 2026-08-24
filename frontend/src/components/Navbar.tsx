import React from 'react';
import {
  Share2,
  GitFork,
  Sparkles,
  Waypoints,
  DownloadCloud,
  Activity,
  RotateCcw,
  ChevronRight,
  Database
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
      padding: '10px 24px',
      background: '#FFFFFF',
      borderBottom: '1px solid var(--hairline)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
    }}>
      {/* PaperFlow Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          background: 'var(--primary)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <Share2 size={15} strokeWidth={2.2} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--ink)',
            letterSpacing: '-0.02em'
          }}>
            PaperFlow
          </span>
          <span style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--ink-muted)',
            background: 'var(--canvas-soft)',
            border: '1px solid var(--hairline)',
            padding: '1px 6px',
            borderRadius: 'var(--radius-xs)',
            fontWeight: 500
          }}>
            Knowledge Graph
          </span>
        </div>
      </div>

      {/* Notion Navigation Views Switcher */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        background: 'var(--canvas-soft)',
        padding: '3px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--hairline)'
      }}>
        {[
          { id: 'explorer', label: 'Graph Explorer', icon: Share2 },
          { id: 'lineage', label: 'Citation Lineage', icon: GitFork },
          { id: 'gaps', label: 'Research Gaps', icon: Sparkles },
          { id: 'bridges', label: 'Domain Bridges', icon: Waypoints },
          { id: 'ingest', label: 'Ingest Papers', icon: DownloadCloud },
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
                padding: '5px 12px',
                borderRadius: 'var(--radius-control)',
                fontSize: '13px',
                fontFamily: 'var(--font-display)',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--primary)' : 'var(--ink-secondary)',
                background: isActive ? '#FFFFFF' : 'transparent',
                border: isActive ? '1px solid var(--hairline)' : '1px solid transparent',
                boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.04)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.12s ease'
              }}
            >
              <Icon size={13} color={isActive ? 'var(--primary)' : 'var(--ink-muted)'} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right Stats & Notion CTAs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Database Metric Strip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--canvas-soft)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--hairline)',
          fontSize: '12px',
          fontFamily: 'var(--font-mono)'
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: health?.status === 'healthy' ? '#1aae39' : '#e03e3e',
            boxShadow: health?.status === 'healthy' ? '0 0 4px rgba(26,174,57,0.5)' : 'none'
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ink-secondary)' }}>
            <span style={{
              background: '#FFFFFF',
              color: 'var(--primary)',
              padding: '1px 6px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--hairline)',
              fontWeight: 600
            }}>
              📄 {health?.papers ?? '...'}
            </span>
            <span style={{ color: '#d4d0ca' }}>•</span>
            <span>
              <strong style={{ color: 'var(--ink)' }}>{health?.nodes ?? '...'}</strong> nodes
            </span>
            <span style={{ color: '#d4d0ca' }}>•</span>
            <span>
              <strong style={{ color: 'var(--ink)' }}>{health?.relationships ?? '...'}</strong> edges
            </span>
            <span style={{ color: '#d4d0ca' }}>•</span>
            <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
              <Activity size={11} /> {health?.latency_ms ? `${health.latency_ms}ms` : '...'}
            </span>
          </div>
        </div>

        {/* Reseed Button */}
        <button
          onClick={onReseed}
          disabled={isReseeding}
          title="Reload curated landmark AI/ML seed dataset"
          className="aura-btn-utility"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}
        >
          <RotateCcw size={12} className={isReseeding ? 'animate-spin-slow' : ''} />
          {isReseeding ? 'Seeding...' : 'Reseed'}
        </button>
      </div>
    </header>
  );
};
