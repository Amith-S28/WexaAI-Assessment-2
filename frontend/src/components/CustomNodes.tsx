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
          : '1px solid #111827',
        background: '#FFFFFF',
        boxShadow: isSelected ? '0 4px 18px rgba(0, 117, 222, 0.2)' : 'var(--shadow-card)',
        borderRadius: 'var(--radius-lg)',
        transition: 'all 0.15s ease',
        zIndex: isSelected ? 30 : isHighlighted ? 20 : 1,
      }}
    >
      {/* 4-Side Closest Connection Handles (Notion Blue) */}
      <Handle type="target" position={Position.Top} id="target-top" style={{ background: '#0075de', width: 7, height: 7, border: '1px solid #111827' }} />
      <Handle type="source" position={Position.Top} id="source-top" style={{ background: '#0075de', width: 7, height: 7, border: '1px solid #111827' }} />

      <Handle type="target" position={Position.Right} id="target-right" style={{ background: '#0075de', width: 7, height: 7, border: '1px solid #111827' }} />
      <Handle type="source" position={Position.Right} id="source-right" style={{ background: '#0075de', width: 7, height: 7, border: '1px solid #111827' }} />

      <Handle type="target" position={Position.Bottom} id="target-bottom" style={{ background: '#0075de', width: 7, height: 7, border: '1px solid #111827' }} />
      <Handle type="source" position={Position.Bottom} id="source-bottom" style={{ background: '#0075de', width: 7, height: 7, border: '1px solid #111827' }} />

      <Handle type="target" position={Position.Left} id="target-left" style={{ background: '#0075de', width: 7, height: 7, border: '1px solid #111827' }} />
      <Handle type="source" position={Position.Left} id="source-left" style={{ background: '#0075de', width: 7, height: 7, border: '1px solid #111827' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{
          background: isSelected ? '#0075de' : '#f6f5f4',
          padding: '7px',
          borderRadius: 'var(--radius-md)',
          color: isSelected ? '#FFFFFF' : '#0075de',
          flexShrink: 0,
          marginTop: '2px',
          border: '1px solid #111827',
          transition: 'all 0.15s ease'
        }}>
          <FileText size={16} />
        </div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '13px',
            color: 'var(--ink)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }} title={nodeData.title}>
            {nodeData.title}
          </div>
          <div style={{
            fontSize: '11px',
            color: 'var(--ink-muted)',
            marginTop: '2px',
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
            background: 'rgba(0, 117, 222, 0.08)',
            color: '#0075de',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            padding: '2px 7px',
            borderRadius: 'var(--radius-pill)',
            marginTop: '6px',
            border: '1px solid rgba(0, 117, 222, 0.25)'
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
        padding: '8px 14px',
        opacity: isDimmed ? 0.25 : 1,
        border: isSelected
          ? '2px solid #0075de'
          : isHighlighted
          ? '2px solid #d6b6f6'
          : '1px solid #111827',
        background: '#FFFFFF',
        borderRadius: 'var(--radius-pill)',
        transition: 'all 0.15s ease',
        zIndex: isSelected ? 30 : isHighlighted ? 20 : 1,
      }}
    >
      <Handle type="target" position={Position.Top} id="target-top" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #111827' }} />
      <Handle type="source" position={Position.Top} id="source-top" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #111827' }} />

      <Handle type="target" position={Position.Right} id="target-right" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #111827' }} />
      <Handle type="source" position={Position.Right} id="source-right" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #111827' }} />

      <Handle type="target" position={Position.Bottom} id="target-bottom" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #111827' }} />
      <Handle type="source" position={Position.Bottom} id="source-bottom" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #111827' }} />

      <Handle type="target" position={Position.Left} id="target-left" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #111827' }} />
      <Handle type="source" position={Position.Left} id="source-left" style={{ background: '#0075de', width: 6, height: 6, border: '1px solid #111827' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          background: '#f7edff',
          padding: '5px',
          borderRadius: '50%',
          color: '#512579',
          border: '1px solid #111827',
          flexShrink: 0
        }}>
          <User size={14} />
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
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
        padding: '10px 16px',
        background: '#FFFFFF',
        border: isSelected
          ? '2px solid #0075de'
          : isHighlighted
          ? '2px solid #2a9d99'
          : '1px solid #111827',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        opacity: isDimmed ? 0.25 : 1,
        transition: 'all 0.15s ease',
        zIndex: isSelected ? 30 : isHighlighted ? 20 : 1,
      }}
    >
      <Handle type="target" position={Position.Top} id="target-top" style={{ background: '#0075de', width: 7, height: 7, border: '1px solid #111827' }} />
      <Handle type="source" position={Position.Top} id="source-top" style={{ background: '#0075de', width: 7, height: 7, border: '1px solid #111827' }} />

      <Handle type="target" position={Position.Right} id="target-right" style={{ background: '#0075de', width: 7, height: 7, border: '1px solid #111827' }} />
      <Handle type="source" position={Position.Right} id="source-right" style={{ background: '#0075de', width: 7, height: 7, border: '1px solid #111827' }} />

      <Handle type="target" position={Position.Bottom} id="target-bottom" style={{ background: '#0075de', width: 7, height: 7, border: '1px solid #111827' }} />
      <Handle type="source" position={Position.Bottom} id="source-bottom" style={{ background: '#0075de', width: 7, height: 7, border: '1px solid #111827' }} />

      <Handle type="target" position={Position.Left} id="target-left" style={{ background: '#0075de', width: 7, height: 7, border: '1px solid #111827' }} />
      <Handle type="source" position={Position.Left} id="source-left" style={{ background: '#0075de', width: 7, height: 7, border: '1px solid #111827' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: '#e6f6f5',
            padding: '5px',
            borderRadius: '6px',
            color: '#1b6360',
            border: '1px solid #111827'
          }}>
            <Layers size={14} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '13px',
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
              fontSize: '10px',
              color: '#2a9d99',
              fontWeight: 700
            }}>
              DOMAIN FIELD
            </div>
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
