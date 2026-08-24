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
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '28px 24px' }}>
      <div className="aura-panel" style={{ padding: '24px 28px', marginBottom: '20px', background: '#FFFFFF' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--ink)',
          letterSpacing: '-0.02em',
          marginBottom: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <DownloadCloud size={17} color="var(--primary)" /> Academic Paper Ingestion
        </h2>

        {/* Form */}
        <form onSubmit={handleIngest} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink-secondary)', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-display)' }}>
              Search Query / Academic Keyword:
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', color: 'var(--ink-muted)' }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Mamba State Space Models, Graph Neural Networks..."
                className="notion-input"
                style={{
                  width: '100%',
                  paddingLeft: '34px',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            {/* Limit Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--ink-secondary)', fontFamily: 'var(--font-display)' }}>
              <span>Fetch Count:</span>
              {[3, 5, 10, 15].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setLimit(num)}
                  style={{
                    background: limit === num ? 'var(--primary)' : 'var(--canvas-soft)',
                    border: limit === num ? '1px solid var(--primary)' : '1px solid var(--hairline)',
                    color: limit === num ? '#FFFFFF' : 'var(--ink-secondary)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  {num} papers
                </button>
              ))}
            </div>

            {/* Include 1-Hop References checkbox */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--ink-secondary)', cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
              <input
                type="checkbox"
                checked={includeReferences}
                onChange={(e) => setIncludeReferences(e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span>Include 1-Hop References</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="aura-btn-primary"
            style={{
              justifyContent: 'center',
              padding: '10px 18px',
              fontSize: '13px',
              borderRadius: 'var(--radius-pill)',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            <DownloadCloud size={15} />
            {isLoading ? 'Streaming & Ingesting to CognoDB...' : 'Ingest to CognoDB Cloud'}
          </button>
        </form>

        {/* Error Alert */}
        {error && (
          <div style={{
            marginTop: '16px',
            padding: '10px 14px',
            background: '#fff5f5',
            border: '1px solid #ffd1d1',
            borderRadius: 'var(--radius-md)',
            color: '#c53030',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Success / Result Feedback */}
        {result && (
          <div style={{
            marginTop: '16px',
            padding: '14px 16px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius-md)',
            color: '#166534'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CheckCircle2 size={16} color="#16a34a" />
              <strong style={{ fontSize: '13px' }}>Ingestion Complete!</strong>
            </div>

            <div style={{
              display: 'flex',
              gap: '14px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              marginTop: '8px',
              color: '#15803d'
            }}>
              <div>📄 Papers: <strong>{result.imported_papers}</strong></div>
              <div>👥 Authors: <strong>{result.imported_authors}</strong></div>
              <div>🔗 Citations: <strong>{result.imported_citations}</strong></div>
              <div>🏷️ Concepts: <strong>{result.imported_concepts}</strong></div>
            </div>

            {result.message && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#15803d', borderTop: '1px solid #dcfce7', paddingTop: '8px' }}>
                {result.message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
