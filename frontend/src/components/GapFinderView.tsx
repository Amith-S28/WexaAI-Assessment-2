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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', overflowY: 'auto' }}>
      {/* Header Banner */}
      <div className="aura-panel" style={{ padding: '24px 28px', marginBottom: '24px', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="aura-tag-mono" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Sparkles size={12} /> Graph Topology Inference
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
          Research Gap Finder
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '750px', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>
          Discovers unstudied intersections across academic disciplines using openCypher triadic closures and co-citation graph analytics.
        </p>

        {/* Sub-tab switchers */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            onClick={() => setActiveSubTab('triadic')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: 'var(--radius-control)',
              fontSize: '13px',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeSubTab === 'triadic' ? 'var(--primary)' : 'var(--surface)',
              color: activeSubTab === 'triadic' ? '#FFFFFF' : 'var(--text-secondary)',
              border: '1px solid var(--border)',
              transition: 'background-color 0.15s ease'
            }}
          >
            <Lightbulb size={15} />
            1. Triadic Concept Disconnects ({triadicGaps.length})
          </button>

          <button
            onClick={() => setActiveSubTab('cocitation')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: 'var(--radius-control)',
              fontSize: '13px',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeSubTab === 'cocitation' ? 'var(--primary)' : 'var(--surface)',
              color: activeSubTab === 'cocitation' ? '#FFFFFF' : 'var(--text-secondary)',
              border: '1px solid var(--border)',
              transition: 'background-color 0.15s ease'
            }}
          >
            <Layers size={15} />
            2. Co-Citation Paper Gaps ({coCitationGaps.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Triadic Concept Disconnects */}
      {activeSubTab === 'triadic' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
              Concept pairs with shared foundational papers but <strong>zero co-authored literature</strong>:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <Filter size={13} color="var(--primary)" />
              <span style={{ fontFamily: 'var(--font-display)' }}>Min Shared Foundations:</span>
              <input
                type="range"
                min="1"
                max="5"
                value={minShared}
                onChange={(e) => setMinShared(Number(e.target.value))}
                style={{ width: '85px', accentColor: 'var(--primary)' }}
              />
              <strong className="aura-tag-mono">{minShared}</strong>
            </div>
          </div>

          {isLoading ? (
            <div style={{ padding: '50px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Computing graph closures across concepts...
            </div>
          ) : triadicGaps.length === 0 ? (
            <div className="aura-panel" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-secondary)', background: '#FFFFFF' }}>
              No triadic concept gaps found matching the current threshold.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
              {triadicGaps.map((gap, i) => (
                <div key={i} className="aura-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span className="aura-tag-mono" style={{ fontSize: '10px' }}>
                        Untapped Intersection
                      </span>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--primary)',
                        fontSize: '12px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)'
                      }}>
                        <TrendingUp size={13} /> {Math.round(gap.opportunity_score * 100)}% Potential
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <span style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--primary)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-control)',
                        fontSize: '12px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-display)'
                      }}>
                        {gap.concept_a}
                      </span>
                      <span style={{ color: 'var(--primary)', fontWeight: 800 }}>+</span>
                      <span style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-control)',
                        fontSize: '12px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-display)'
                      }}>
                        {gap.concept_b}
                      </span>
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px', fontFamily: 'var(--font-body)' }}>
                      {gap.description}
                    </p>

                    {gap.foundation_examples.length > 0 && (
                      <div style={{ background: 'var(--surface)', padding: '10px 12px', borderRadius: 'var(--radius-control)', border: '1px solid var(--border)', marginBottom: '12px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', fontFamily: 'var(--font-display)' }}>
                          Shared Foundational Literature ({gap.shared_foundations_count}):
                        </div>
                        <ul style={{ paddingLeft: '16px', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4, fontFamily: 'var(--font-body)' }}>
                          {gap.foundation_examples.map((ex, idx) => (
                            <li key={idx} style={{ marginBottom: '3px' }}>{ex}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '10px', fontFamily: 'var(--font-mono)' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
              Papers frequently co-cited in the same bibliographies with <strong>no direct citation edge</strong>:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <Filter size={13} color="var(--primary)" />
              <span style={{ fontFamily: 'var(--font-display)' }}>Min Co-Citing Papers:</span>
              <input
                type="range"
                min="1"
                max="5"
                value={minCoCitations}
                onChange={(e) => setMinCoCitations(Number(e.target.value))}
                style={{ width: '85px', accentColor: 'var(--primary)' }}
              />
              <strong className="aura-tag-mono">{minCoCitations}</strong>
            </div>
          </div>

          {isLoading ? (
            <div style={{ padding: '50px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Scanning co-citation bibliographies...
            </div>
          ) : coCitationGaps.length === 0 ? (
            <div className="aura-panel" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-secondary)', background: '#FFFFFF' }}>
              No co-citation gaps found matching the current threshold.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '18px' }}>
              {coCitationGaps.map((gap, i) => (
                <div key={i} className="aura-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span className="aura-tag-mono" style={{ fontSize: '10px' }}>
                        Co-Citation Cluster
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                        Co-cited <strong style={{ color: 'var(--primary)' }}>{gap.co_citation_strength}x</strong>
                      </span>
                    </div>

                    <div style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-control)',
                      marginBottom: '8px'
                    }}>
                      <div style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>Paper A ({gap.paper1_year || 'N/A'})</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{gap.paper1_title}</div>
                    </div>

                    <div style={{ textAlign: 'center', fontSize: '10px', color: '#DC2626', fontWeight: 600, margin: '4px 0', fontFamily: 'var(--font-mono)' }}>
                      ⚡ No Direct Citation Edge Between Authors
                    </div>

                    <div style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-control)',
                      marginBottom: '12px'
                    }}>
                      <div style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>Paper B ({gap.paper2_year || 'N/A'})</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{gap.paper2_title}</div>
                    </div>

                    {gap.co_citing_examples.length > 0 && (
                      <div style={{ background: 'var(--surface)', padding: '10px 12px', borderRadius: 'var(--radius-control)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>Jointly Cited In:</div>
                        <ul style={{ paddingLeft: '16px', fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
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
