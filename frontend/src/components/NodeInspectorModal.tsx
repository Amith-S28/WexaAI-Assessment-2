import React from 'react';
import { X, ExternalLink, GitFork, Award, Calendar, BookOpen, User, Tag, Sparkles } from 'lucide-react';
import type { GraphNodeData } from '../types';

interface NodeInspectorModalProps {
  node: GraphNodeData | null;
  onClose: () => void;
  onTraceLineage: (paperId: string) => void;
}

export const NodeInspectorModal: React.FC<NodeInspectorModalProps> = ({
  node,
  onClose,
  onTraceLineage
}) => {
  if (!node) return null;

  const isPaper = node.group === 'paper';
  const isAuthor = node.group === 'author';
  const isConcept = node.group === 'concept';
  const props = node.properties || {};

  return (
    <div className="aura-panel" style={{
      position: 'fixed',
      top: '76px',
      right: '24px',
      width: '410px',
      maxHeight: 'calc(100vh - 100px)',
      background: '#FFFFFF',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-elevated)',
      zIndex: 60,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        background: 'var(--surface)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            padding: '7px',
            borderRadius: 'var(--radius-control)',
            background: '#FFFFFF',
            color: 'var(--primary)',
            border: '1px solid var(--border)'
          }}>
            {isPaper && <BookOpen size={16} />}
            {isAuthor && <User size={16} />}
            {isConcept && <Tag size={16} />}
          </div>
          <div>
            <div className="aura-tag-mono" style={{ fontSize: '10px' }}>
              {node.label} Node
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              ID: {node.id.length > 16 ? `${node.id.substring(0, 16)}...` : node.id}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '16px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.4
        }}>
          {node.title}
        </h3>

        {/* Paper Specific Badges */}
        {isPaper && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {props.year && (
              <span className="aura-tag-mono" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)', background: 'var(--surface)' }}>
                <Calendar size={11} style={{ display: 'inline', marginRight: '4px' }} /> {props.year}
              </span>
            )}
            {props.venue && (
              <span style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                padding: '3px 8px',
                borderRadius: 'var(--radius-control)',
                fontFamily: 'var(--font-body)'
              }}>
                {props.venue}
              </span>
            )}
            <span className="aura-tag-mono">
              <Award size={11} style={{ display: 'inline', marginRight: '4px' }} /> {(props.citation_count || 0).toLocaleString()} citations
            </span>
          </div>
        )}

        {/* TLDR */}
        {props.tldr && (
          <div style={{
            background: 'var(--surface)',
            borderLeft: '3px solid var(--primary)',
            border: '1px solid var(--border)',
            borderLeftWidth: '3px',
            padding: '12px 14px',
            borderRadius: 'var(--radius-control)',
            fontSize: '13px',
            color: 'var(--text-primary)',
            lineHeight: 1.5,
            fontFamily: 'var(--font-body)'
          }}>
            <strong style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>
              <Sparkles size={13} /> S2 TLDR Summary:
            </strong>
            {props.tldr}
          </div>
        )}

        {/* Abstract */}
        {props.abstract && (
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
              Abstract:
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>
              {props.abstract}
            </p>
          </div>
        )}

        {/* Author / Concept properties */}
        {isConcept && (
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Domain field: <strong style={{ color: 'var(--primary)' }}>{props.field || 'General AI'}</strong>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div style={{
        padding: '14px 20px',
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        {isPaper && (
          <button
            onClick={() => onTraceLineage(node.id)}
            className="aura-btn-primary"
            style={{ flex: 1, justifyContent: 'center', fontSize: '12px', padding: '8px 14px' }}
          >
            <GitFork size={14} /> Trace Lineage
          </button>
        )}

        {props.url && (
          <a
            href={props.url}
            target="_blank"
            rel="noopener noreferrer"
            className="aura-btn-secondary"
            style={{ textDecoration: 'none', fontSize: '12px', padding: '8px 14px' }}
          >
            <ExternalLink size={13} /> S2 Link
          </a>
        )}
      </div>
    </div>
  );
};
