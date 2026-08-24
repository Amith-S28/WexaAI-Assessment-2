import React, { useState } from 'react';
import {
  DownloadCloud,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import type { IngestResponse } from '../types';
import { ingestFromSearch } from '../api';

interface IngestConsoleProps {
  onIngestSuccess: () => void;
}

export const IngestConsole: React.FC<IngestConsoleProps> = ({ onIngestSuccess }) => {
  const [query, setQuery] = useState<string>('State Space Models Mamba');
  const [limit, setLimit] = useState<number>(5);
  const [includeReferences, setIncludeReferences] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<IngestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await ingestFromSearch(query, limit, includeReferences);
      setResult(res);
      if (res.success) {
        onIngestSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during ingestion.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', padding: '32px 24px' }}>
      <div className="aura-panel" style={{ padding: '28px 32px', marginBottom: '24px', background: '#FFFFFF' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <DownloadCloud size={18} color="var(--primary)" /> Ingest Papers
        </h2>

        {/* Form */}
        <form onSubmit={handleIngest} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-display)' }}>
              Search Query / Keyword:
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={15} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Mamba State Space Models, Graph Neural Networks, NeRF..."
                style={{
                  width: '100%',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-control)',
                  padding: '11px 14px 11px 40px',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            {/* Limit Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>
              <span>Fetch Count:</span>
              {[3, 5, 10, 15].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setLimit(num)}
                  style={{
                    background: limit === num ? 'var(--primary)' : 'var(--surface)',
                    border: limit === num ? '1px solid var(--primary)' : '1px solid var(--border)',
                    color: limit === num ? '#FFFFFF' : 'var(--text-secondary)',
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-control)',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {num} papers
                </button>
              ))}
            </div>

            {/* Include 1-Hop References checkbox */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
              <input
                type="checkbox"
                checked={includeReferences}
                onChange={(e) => setIncludeReferences(e.target.checked)}
                style={{ accentColor: 'var(--primary)', width: '15px', height: '15px' }}
              />
              <span>Include 1-Hop Reference Links</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="aura-btn-primary"
            style={{
              justifyContent: 'center',
              padding: '12px 20px',
              fontSize: '13px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            <DownloadCloud size={16} />
            {isLoading ? 'Streaming & Upserting to CognoDB...' : 'Ingest to CognoDB Cloud'}
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '18px', fontSize: '11px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-display)' }}>Try topics:</span>
          {[
            'DeepSeek V3 Architecture',
            'Diffusion Models in Healthcare',
            'Graph Neural Networks for Drug Discovery',
            'FlashAttention IO-aware',
          ].map((topic, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setQuery(topic)}
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
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Result Status Box */}
      {result && (
        <div className="aura-panel" style={{
          padding: '20px 24px',
          border: result.success ? '1px solid #10B981' : '1px solid #EF4444',
          background: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            {result.success ? (
              <CheckCircle2 size={20} color="#10B981" />
            ) : (
              <AlertCircle size={20} color="#EF4444" />
            )}
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '15px',
              fontWeight: 700,
              color: result.success ? '#065F46' : '#991B1B'
            }}>
              {result.success ? 'Ingestion Batch Succeeded' : 'Ingestion Notice'}
            </h3>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', fontFamily: 'var(--font-body)' }}>
            {result.message}
          </p>

          {result.success && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <div className="aura-card" style={{ padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{result.imported_papers}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>Papers</div>
              </div>
              <div className="aura-card" style={{ padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{result.imported_authors}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>Authors</div>
              </div>
              <div className="aura-card" style={{ padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#10B981', fontFamily: 'var(--font-mono)' }}>{result.imported_concepts}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>Concepts</div>
              </div>
              <div className="aura-card" style={{ padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{result.imported_citations}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>Citations</div>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="aura-panel" style={{ padding: '18px', border: '1px solid #EF4444', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', fontWeight: 700, marginBottom: '6px', fontFamily: 'var(--font-display)' }}>
            <AlertCircle size={16} /> Ingestion Error
          </div>
          <p style={{ fontSize: '12px', color: '#991B1B', fontFamily: 'var(--font-body)' }}>{error}</p>
        </div>
      )}
    </div>
  );
};
