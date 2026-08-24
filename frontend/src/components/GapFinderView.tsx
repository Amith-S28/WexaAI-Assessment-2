import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  TrendingUp,
  Filter,
  Lightbulb
} from 'lucide-react';
import type { GapDiscoveryResponse } from '../types';
import { fetchAllGaps } from '../api';

interface GapFinderViewProps {
  onSelectPaperTitle?: (title: string) => void;
}

export const GapFinderView: React.FC<GapFinderViewProps> = () => {
  const [activeSubTab, setActiveSubTab] = useState<'triadic' | 'cocitation'>('triadic');
  const [data, setData] = useState<GapDiscoveryResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [minShared, setMinShared] = useState<number>(1);
  const [minCoCitations, setMinCoCitations] = useState<number>(1);

  const loadGaps = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAllGaps(minShared, minCoCitations);
      setData(res);
    } catch (err) {
      console.error('Failed to load gaps:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGaps();
  }, [minShared, minCoCitations]);

  const triadicGaps = data?.triadic_concept_gaps || [];
  const coCitationGaps = data?.co_citation_gaps || [];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 24px', overflowY: 'auto' }}>
      {/* Header Banner (Notion Callout Panel) */}
      <div className="aura-panel" style={{ padding: '20px 24px', marginBottom: '20px', background: '#FFFFFF' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--ink)',
          letterSpacing: '-0.02em',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={17} color="var(--primary)" /> Research Gap Finder
        </h2>

        {/* Sub-tab switchers */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveSubTab('triadic')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '13px',
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              cursor: 'pointer',
              background: activeSubTab === 'triadic' ? 'var(--primary)' : 'var(--canvas-soft)',
              color: activeSubTab === 'triadic' ? '#FFFFFF' : 'var(--ink-secondary)',
              border: activeSubTab === 'triadic' ? '1px solid var(--primary)' : '1px solid var(--hairline)',
              transition: 'background-color 0.12s ease'
            }}
          >
            <Lightbulb size={14} />
            Triadic Concept Disconnects ({triadicGaps.length})
          </button>

          <button
            onClick={() => setActiveSubTab('cocitation')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '13px',
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              cursor: 'pointer',
              background: activeSubTab === 'cocitation' ? 'var(--primary)' : 'var(--canvas-soft)',
              color: activeSubTab === 'cocitation' ? '#FFFFFF' : 'var(--ink-secondary)',
              border: activeSubTab === 'cocitation' ? '1px solid var(--primary)' : '1px solid var(--hairline)',
              transition: 'background-color 0.12s ease'
            }}
          >
            <Layers size={14} />
            Co-Citation Paper Gaps ({coCitationGaps.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Triadic Concept Disconnects */}
      {activeSubTab === 'triadic' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ fontSize: '13px', color: 'var(--ink-secondary)', fontFamily: 'var(--font-body)' }}>
              Concept pairs with shared foundational papers but <strong>zero co-authored literature</strong>:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--ink-secondary)' }}>
              <Filter size={12} color="var(--primary)" />
              <span style={{ fontFamily: 'var(--font-display)' }}>Min Shared Foundations:</span>
              <input
                type="range"
                min="1"
                max="5"
                value={minShared}
                onChange={(e) => setMinShared(Number(e.target.value))}
                style={{ width: '70px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <strong className="aura-tag-mono">{minShared}</strong>
            </div>
          </div>

          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '13px' }}>
              Computing graph closures across concepts...
            </div>
          ) : triadicGaps.length === 0 ? (
            <div className="aura-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--ink-muted)', background: '#FFFFFF', fontSize: '13px' }}>
              No triadic concept gaps found matching the current threshold.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {triadicGaps.map((gap, i) => (
                <div key={i} className="aura-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span className="aura-tag-mono" style={{ fontSize: '10px' }}>
                        Untapped Intersection
                      </span>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--primary)',
                        fontSize: '12px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-mono)'
                      }}>
                        <TrendingUp size={12} /> {Math.round(gap.opportunity_score * 100)}% Potential
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      <span className="aura-tag-sticker-teal">
                        {gap.concept_a}
                      </span>
                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>+</span>
                      <span className="aura-tag-sticker-orange">
                        {gap.concept_b}
                      </span>
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: 1.5, marginBottom: '12px', fontFamily: 'var(--font-body)' }}>
                      {gap.description}
                    </p>

                    {gap.foundation_examples.length > 0 && (
                      <div style={{ background: 'var(--canvas-soft)', padding: '9px 12px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--hairline)', marginBottom: '12px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>
                          Shared Foundational Literature ({gap.shared_foundations_count}):
                        </div>
                        <ul style={{ paddingLeft: '16px', fontSize: '11px', color: 'var(--ink-secondary)', lineHeight: 1.4, fontFamily: 'var(--font-body)' }}>
                          {gap.foundation_examples.map((ex, idx) => (
                            <li key={idx} style={{ marginBottom: '2px' }}>{ex}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--ink-faint)', borderTop: '1px solid var(--hairline)', paddingTop: '8px', fontFamily: 'var(--font-mono)' }}>
                    0 Joint Papers Found in Literature
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Co-Citation Gaps */}
      {activeSubTab === 'cocitation' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ fontSize: '13px', color: 'var(--ink-secondary)', fontFamily: 'var(--font-body)' }}>
              Papers frequently co-cited in the same bibliographies with <strong>no direct citation edge</strong>:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--ink-secondary)' }}>
              <Filter size={12} color="var(--primary)" />
              <span style={{ fontFamily: 'var(--font-display)' }}>Min Co-Citations:</span>
              <input
                type="range"
                min="1"
                max="5"
                value={minCoCitations}
                onChange={(e) => setMinCoCitations(Number(e.target.value))}
                style={{ width: '70px', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <strong className="aura-tag-mono">{minCoCitations}</strong>
            </div>
          </div>

          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '13px' }}>
              Scanning co-citation bibliographies...
            </div>
          ) : coCitationGaps.length === 0 ? (
            <div className="aura-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--ink-muted)', background: '#FFFFFF', fontSize: '13px' }}>
              No co-citation gaps found matching the current threshold.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
              {coCitationGaps.map((gap, i) => (
                <div key={i} className="aura-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span className="aura-tag-mono" style={{ fontSize: '10px' }}>
                        Co-Citation Pair
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--ink-secondary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                        Co-cited <strong style={{ color: 'var(--primary)' }}>{gap.co_citation_strength}x</strong>
                      </span>
                    </div>

                    <div style={{
                      background: 'var(--canvas-soft)',
                      border: '1px solid var(--hairline)',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-xs)',
                      marginBottom: '6px'
                    }}>
                      <div style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>Paper A ({gap.paper1_year || 'N/A'})</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>{gap.paper1_title}</div>
                    </div>

                    <div style={{ textAlign: 'center', fontSize: '10px', color: '#e03e3e', fontWeight: 600, margin: '3px 0', fontFamily: 'var(--font-mono)' }}>
                      ⚡ No Direct Citation Edge Between Papers
                    </div>

                    <div style={{
                      background: 'var(--canvas-soft)',
                      border: '1px solid var(--hairline)',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-xs)',
                      marginBottom: '10px'
                    }}>
                      <div style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>Paper B ({gap.paper2_year || 'N/A'})</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>{gap.paper2_title}</div>
                    </div>

                    {gap.co_citing_examples.length > 0 && (
                      <div style={{ background: 'var(--canvas-soft)', padding: '9px 12px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--hairline)' }}>
                        <div style={{ fontSize: '10px', color: 'var(--ink-muted)', marginBottom: '3px', fontFamily: 'var(--font-display)' }}>Jointly Cited In:</div>
                        <ul style={{ paddingLeft: '16px', fontSize: '11px', color: 'var(--ink-secondary)', fontFamily: 'var(--font-body)' }}>
                          {gap.co_citing_examples.map((ex, idx) => (
                            <li key={idx}>{ex}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
