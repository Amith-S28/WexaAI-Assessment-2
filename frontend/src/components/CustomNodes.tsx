import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { FileText, User, Award, Layers } from 'lucide-react';
import type { GraphNodeData } from '../types';

interface ExtendedNodeData extends GraphNodeData {
  isDimmed?: boolean;
  isHighlighted?: boolean;
  isSelectedNode?: boolean;
  paperCount?: number;
}

export const PaperNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as ExtendedNodeData;
  const props = nodeData.properties || {};
  const citationCount = props.citation_count || 0;
  const year = props.year;
  const venue = props.venue;

  const isDimmed = nodeData.isDimmed;
  const isHighlighted = nodeData.isHighlighted;
  const isSelected = nodeData.isSelectedNode || selected;

  return (
    <div
      className={`flow-node flow-node-paper ${isSelected ? 'selected' : ''}`}
      style={{
        position: 'relative',
        opacity: isDimmed ? 0.25 : 1,
        transform: isSelected ? 'scale(1.02)' : 'none',
        border: isSelected
          ? '2px solid #0075de'
          : isHighlighted
          ? '2px solid #62aef0'
          : '1px solid var(--hairline)',
        background: '#FFFFFF',
        boxShadow: isSelected
          ? '0 4px 16px rgba(0, 117, 222, 0.18)'
          : '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        borderRadius: 'var(--radius-card)',
        transition: 'all 0.15s ease',
        zIndex: isSelected ? 30 : isHighlighted ? 20 : 1,
      }}
    >
      {/* 4-Side Closest Connection Handles (Notion Blue) */}
      <Handle type="target" position={Position.Top} id="target-top" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #ffffff' }} />
      <Handle type="source" position={Position.Top} id="source-top" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #ffffff' }} />

      <Handle type="target" position={Position.Right} id="target-right" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #ffffff' }} />
      <Handle type="source" position={Position.Right} id="source-right" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #ffffff' }} />

      <Handle type="target" position={Position.Bottom} id="target-bottom" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #ffffff' }} />
      <Handle type="source" position={Position.Bottom} id="source-bottom" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #ffffff' }} />

      <Handle type="target" position={Position.Left} id="target-left" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #ffffff' }} />
      <Handle type="source" position={Position.Left} id="source-left" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #ffffff' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        {/* Notion Document Icon Box */}
        <div style={{
          background: isSelected ? '#0075de' : 'var(--surface-hover)',
          padding: '6px',
          borderRadius: 'var(--radius-xs)',
          color: isSelected ? '#FFFFFF' : '#31302e',
          flexShrink: 0,
          marginTop: '2px',
          border: '1px solid var(--hairline)',
          transition: 'all 0.15s ease'
        }}>
          <FileText size={15} />
        </div>

        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '13px',
            color: 'var(--ink)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            letterSpacing: '-0.01em'
          }} title={nodeData.title}>
            {nodeData.title}
          </div>

          {/* Notion Property Row */}
          <div style={{
            fontSize: '11px',
            color: 'var(--ink-muted)',
            marginTop: '3px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-body)'
          }}>
            {year && <span>{year}</span>}
            {venue && <span>• {venue}</span>}
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--canvas-soft)',
            color: 'var(--primary)',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            padding: '2px 7px',
            borderRadius: 'var(--radius-xs)',
            marginTop: '5px',
            border: '1px solid var(--hairline)'
          }}>
            <Award size={11} />
            {citationCount.toLocaleString()} cites
          </div>
        </div>
      </div>
    </div>
  );
});

export const AuthorNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as ExtendedNodeData;
  const isDimmed = nodeData.isDimmed;
  const isHighlighted = nodeData.isHighlighted;
  const isSelected = nodeData.isSelectedNode || selected;

  return (
    <div
      className={`flow-node flow-node-author ${isSelected ? 'selected' : ''}`}
      style={{
        position: 'relative',
        minWidth: '140px',
        padding: '6px 12px',
        opacity: isDimmed ? 0.25 : 1,
        border: isSelected
          ? '2px solid #0075de'
          : isHighlighted
          ? '2px solid #d6b6f6'
          : '1px solid var(--hairline)',
        background: '#FFFFFF',
        borderRadius: 'var(--radius-pill)',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.15s ease',
        zIndex: isSelected ? 30 : isHighlighted ? 20 : 1,
      }}
    >
      <Handle type="target" position={Position.Top} id="target-top" style={{ background: '#0075de', width: 5, height: 5, border: '1px solid #ffffff' }} />
      <Handle type="source" position={Position.Top} id="source-top" style={{ background: '#0075de', width: 5, height: 5, border: '1px solid #ffffff' }} />

      <Handle type="target" position={Position.Right} id="target-right" style={{ background: '#0075de', width: 5, height: 5, border: '1px solid #ffffff' }} />
      <Handle type="source" position={Position.Right} id="source-right" style={{ background: '#0075de', width: 5, height: 5, border: '1px solid #ffffff' }} />

      <Handle type="target" position={Position.Bottom} id="target-bottom" style={{ background: '#0075de', width: 5, height: 5, border: '1px solid #ffffff' }} />
      <Handle type="source" position={Position.Bottom} id="source-bottom" style={{ background: '#0075de', width: 5, height: 5, border: '1px solid #ffffff' }} />

      <Handle type="target" position={Position.Left} id="target-left" style={{ background: '#0075de', width: 5, height: 5, border: '1px solid #ffffff' }} />
      <Handle type="source" position={Position.Left} id="source-left" style={{ background: '#0075de', width: 5, height: 5, border: '1px solid #ffffff' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <div style={{
          background: '#f7edff',
          padding: '4px',
          borderRadius: '50%',
          color: '#512579',
          border: '1px solid rgba(214, 182, 246, 0.4)',
          flexShrink: 0
        }}>
          <User size={12} />
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 500,
          fontSize: '12px',
          color: 'var(--ink)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {nodeData.title}
        </div>
      </div>
    </div>
  );
});

export const ConceptNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as ExtendedNodeData;
  const isDimmed = nodeData.isDimmed;
  const isHighlighted = nodeData.isHighlighted;
  const isSelected = nodeData.isSelectedNode || selected;

  return (
    <div
      className={`flow-node flow-node-concept ${isSelected ? 'selected' : ''}`}
      style={{
        position: 'relative',
        minWidth: '180px',
        padding: '8px 14px',
        background: '#FFFFFF',
        border: isSelected
          ? '2px solid #0075de'
          : isHighlighted
          ? '2px solid #2a9d99'
          : '1px solid var(--hairline)',
        borderRadius: 'var(--radius-card)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        opacity: isDimmed ? 0.25 : 1,
        transition: 'all 0.15s ease',
        zIndex: isSelected ? 30 : isHighlighted ? 20 : 1,
      }}
    >
      <Handle type="target" position={Position.Top} id="target-top" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #ffffff' }} />
      <Handle type="source" position={Position.Top} id="source-top" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #ffffff' }} />

      <Handle type="target" position={Position.Right} id="target-right" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #ffffff' }} />
      <Handle type="source" position={Position.Right} id="source-right" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #ffffff' }} />

      <Handle type="target" position={Position.Bottom} id="target-bottom" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #ffffff' }} />
      <Handle type="source" position={Position.Bottom} id="source-bottom" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #ffffff' }} />

      <Handle type="target" position={Position.Left} id="target-left" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #ffffff' }} />
      <Handle type="source" position={Position.Left} id="source-left" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #ffffff' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          background: '#e6f6f5',
          padding: '4px',
          borderRadius: 'var(--radius-xs)',
          color: '#1b6360',
          border: '1px solid rgba(42, 157, 153, 0.3)',
          flexShrink: 0
        }}>
          <Layers size={13} />
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '12px',
            color: 'var(--ink)',
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {nodeData.title}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: '#2a9d99',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            Domain Tag
          </div>
        </div>
      </div>
    </div>
  );
});

export const nodeTypes = {
  paper: PaperNode,
  author: AuthorNode,
  concept: ConceptNode,
};
