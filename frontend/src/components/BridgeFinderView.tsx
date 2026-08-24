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
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '28px 24px' }}>
      {/* Header & Search (Notion Callout Form) */}
      <div className="aura-panel" style={{ padding: '22px 26px', marginBottom: '20px', background: '#FFFFFF' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--ink)',
          letterSpacing: '-0.02em',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Waypoints size={17} color="var(--primary)" /> Interdisciplinary Bridges
        </h2>

        {/* Input Form */}
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <label style={{ fontSize: '12px', color: 'var(--ink-secondary)', fontWeight: 600, display: 'block', marginBottom: '5px', fontFamily: 'var(--font-display)' }}>
              Domain A:
            </label>
            <input
              type="text"
              value={conceptA}
              onChange={(e) => setConceptA(e.target.value)}
              placeholder="e.g. Natural Language Processing"
              className="notion-input"
              style={{
                width: '100%',
                fontWeight: 500,
                fontSize: '13px'
              }}
            />
          </div>

          <div style={{ marginTop: '20px', color: 'var(--primary)' }}>
            <ArrowRight size={18} />
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <label style={{ fontSize: '12px', color: 'var(--ink-secondary)', fontWeight: 600, display: 'block', marginBottom: '5px', fontFamily: 'var(--font-display)' }}>
              Domain B:
            </label>
            <input
              type="text"
              value={conceptB}
              onChange={(e) => setConceptB(e.target.value)}
              placeholder="e.g. Computer Vision"
              className="notion-input"
              style={{
                width: '100%',
                fontWeight: 500,
                fontSize: '13px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="aura-btn-primary"
            style={{
              marginTop: '20px',
              padding: '7px 18px',
              fontSize: '13px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            <Search size={13} />
            {isLoading ? 'Computing...' : 'Find Bridges'}
          </button>
        </form>

        {/* Quick presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', fontSize: '12px', color: 'var(--ink-muted)', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-display)' }}>Presets:</span>
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
                background: 'var(--canvas-soft)',
                border: '1px solid var(--hairline)',
                color: 'var(--ink-secondary)',
                padding: '3px 9px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '11px',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)'
              }}
            >
              {a} ↔ {b}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {isLoading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '13px' }}>
          Traversing shortest paths and computing betweenness centrality...
        </div>
      ) : hasSearched && bridges.length === 0 ? (
        <div className="aura-panel" style={{ padding: '36px', textAlign: 'center', color: 'var(--ink-muted)', background: '#FFFFFF', fontSize: '13px' }}>
          No bridge papers found between <strong>{conceptA}</strong> and <strong>{conceptB}</strong> in current subgraph.
        </div>
      ) : bridges.length > 0 ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', color: 'var(--ink-secondary)', fontFamily: 'var(--font-body)' }}>
              Top connective bridge papers found ({bridges.length}):
            </span>
            <span className="aura-tag-mono" style={{ fontSize: '11px' }}>
              Betweenness Centrality
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {bridges.map((bp, i) => (
              <div key={i} className="aura-card" style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '14px', flex: 1 }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--radius-xs)',
                      background: 'rgba(0, 117, 222, 0.08)',
                      color: 'var(--primary)',
                      border: '1px solid rgba(0, 117, 222, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      fontSize: '12px',
                      flexShrink: 0
                    }}>
                      #{i + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--ink)',
                        letterSpacing: '-0.01em',
                        marginBottom: '4px'
                      }}>
                        {bp.title}
                      </h3>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                        {bp.year && <span>Year: {bp.year}</span>}
                        {bp.citation_count > 0 && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--primary)', fontWeight: 600 }}>
                            <Award size={11} /> {bp.citation_count.toLocaleString()} citations
                          </span>
                        )}
                      </div>

                      {bp.connected_domains && bp.connected_domains.length > 0 && (
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          {bp.connected_domains.map((sc, scIdx) => (
                            <span key={scIdx} className="aura-tag-sticker-teal" style={{ fontSize: '10px' }}>
                              {sc}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Betweenness Score Pill */}
                  <div style={{
                    background: 'var(--canvas-soft)',
                    border: '1px solid var(--hairline)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '6px 12px',
                    textAlign: 'right',
                    flexShrink: 0
                  }}>
                    <div style={{ fontSize: '10px', color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>Bridge Score</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                      {(bp.bridge_frequency || 0)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
