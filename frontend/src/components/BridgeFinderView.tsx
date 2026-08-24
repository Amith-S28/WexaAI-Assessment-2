import React, { useState } from 'react';
import { Waypoints, Search, ArrowRight, Award } from 'lucide-react';
import type { BridgePaper, SubgraphResponse } from '../types';
import { fetchBridges } from '../api';

interface BridgeFinderViewProps {
  subgraph: SubgraphResponse | null;
}

export const BridgeFinderView: React.FC<BridgeFinderViewProps> = () => {
  const [conceptA, setConceptA] = useState<string>('Natural Language Processing');
  const [conceptB, setConceptB] = useState<string>('Computer Vision');
  const [bridges, setBridges] = useState<BridgePaper[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conceptA || !conceptB) return;
    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await fetchBridges(conceptA, conceptB);
      setBridges(res);
    } catch (err) {
      console.error('Failed to find bridges:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div className="aura-panel" style={{ padding: '24px 28px', marginBottom: '24px', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="aura-tag-mono" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Waypoints size={12} /> Shortest-Path Betweenness Centrality
          </span>
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '24px',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '8px'
        }}>
          Interdisciplinary Bridge Discovery
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px', fontFamily: 'var(--font-body)' }}>
          Finds pivotal papers that act as topological connectors between two distinct research domains across multi-hop citation paths.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px', fontFamily: 'var(--font-display)' }}>
              Domain A:
            </label>
            <input
              type="text"
              value={conceptA}
              onChange={(e) => setConceptA(e.target.value)}
              placeholder="e.g. Natural Language Processing"
              style={{
                width: '100%',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontFamily: 'var(--font-display)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-control)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginTop: '22px', color: 'var(--primary)' }}>
            <ArrowRight size={20} />
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px', fontFamily: 'var(--font-display)' }}>
              Domain B:
            </label>
            <input
              type="text"
              value={conceptB}
              onChange={(e) => setConceptB(e.target.value)}
              placeholder="e.g. Computer Vision"
              style={{
                width: '100%',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontFamily: 'var(--font-display)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-control)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="aura-btn-primary"
            style={{
              marginTop: '22px',
              padding: '10px 20px',
              fontSize: '13px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            <Search size={14} />
            {isLoading ? 'Computing...' : 'Find Bridges'}
          </button>
        </form>

        {/* Quick presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-display)' }}>Try Presets:</span>
          {[
            ['Natural Language Processing', 'Computer Vision'],
            ['Graph Neural Networks', 'Structural Biology'],
            ['Transformers', 'Diffusion Models'],
          ].map(([a, b], idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setConceptA(a);
                setConceptB(b);
              }}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-control)',
                fontSize: '11px',
                fontFamily: 'var(--font-body)',
                cursor: 'pointer'
              }}
            >
              {a} ↔ {b}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div>
        {isLoading ? (
          <div style={{ padding: '50px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Traversing all shortest paths between {conceptA} and {conceptB}...
          </div>
        ) : hasSearched && bridges.length === 0 ? (
          <div className="aura-panel" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-secondary)', background: '#FFFFFF' }}>
            No intermediate bridge papers found connecting these two specific concept terms.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {bridges.map((b, idx) => (
              <div key={idx} className="aura-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
                  <div style={{
                    background: 'var(--surface)',
                    color: 'var(--primary)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-control)',
                    fontWeight: 700,
                    fontSize: '13px',
                    fontFamily: 'var(--font-mono)',
                    border: '1px solid var(--border)'
                  }}>
                    #{idx + 1}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="aura-tag-mono" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)', background: 'var(--surface)' }}>
                        {b.year || 'N/A'}
                      </span>
                      <span className="aura-tag-mono">
                        <Award size={10} style={{ display: 'inline', marginRight: '3px' }} />
                        {b.citation_count.toLocaleString()} citations
                      </span>
                      <span style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontSize: '11px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        Betweenness: {b.bridge_frequency} paths
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                      {b.title}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
