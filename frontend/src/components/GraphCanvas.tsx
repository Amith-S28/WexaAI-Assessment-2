import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Search, Filter, RefreshCw, Layers, LayoutGrid, XCircle, Info } from 'lucide-react';
import type { SubgraphResponse, GraphNodeData } from '../types';
import { nodeTypes } from './CustomNodes';

interface GraphCanvasProps {
  data: SubgraphResponse | null;
  isLoading: boolean;
  onRefresh: (search?: string, minCitations?: number) => void;
  onSelectNode: (node: GraphNodeData) => void;
}

const CARD_WIDTH = 270;
const CARD_HEIGHT = 95;
const COL_WIDTH = 380;
const ROW_HEIGHT = 160;

function getClosestHandles(
  sourcePos: { x: number; y: number },
  sourceSize: { w: number; h: number },
  targetPos: { x: number; y: number },
  targetSize: { w: number; h: number }
): { sourceHandle: string; targetHandle: string } {
  const sourcePoints = {
    'source-top': { x: sourcePos.x + sourceSize.w / 2, y: sourcePos.y },
    'source-bottom': { x: sourcePos.x + sourceSize.w / 2, y: sourcePos.y + sourceSize.h },
    'source-left': { x: sourcePos.x, y: sourcePos.y + sourceSize.h / 2 },
    'source-right': { x: sourcePos.x + sourceSize.w, y: sourcePos.y + sourceSize.h / 2 },
  };

  const targetPoints = {
    'target-top': { x: targetPos.x + targetSize.w / 2, y: targetPos.y },
    'target-bottom': { x: targetPos.x + targetSize.w / 2, y: targetPos.y + targetSize.h },
    'target-left': { x: targetPos.x, y: targetPos.y + targetSize.h / 2 },
    'target-right': { x: targetPos.x + targetSize.w, y: targetPos.y + targetSize.h / 2 },
  };

  let minDistance = Infinity;
  let bestSource = 'source-bottom';
  let bestTarget = 'target-top';

  for (const [sKey, sPt] of Object.entries(sourcePoints)) {
    for (const [tKey, tPt] of Object.entries(targetPoints)) {
      const dist = Math.hypot(sPt.x - tPt.x, sPt.y - tPt.y);
      if (dist < minDistance) {
        minDistance = dist;
        bestSource = sKey;
        bestTarget = tKey;
      }
    }
  }

  return { sourceHandle: bestSource, targetHandle: bestTarget };
}

function computeStrictDomainLayout(
  nodes: Node[],
  edges: Edge[],
  showAuthors: boolean,
  showConcepts: boolean,
  showConceptEdges: boolean
) {
  const paperToConceptsMap: Record<string, string[]> = {};
  const conceptPaperCount: Record<string, number> = {};

  edges.forEach((e) => {
    const isPaperToConcept =
      e.type === 'COVERS_CONCEPT' ||
      (nodes.find((n) => n.id === e.source)?.type === 'paper' && nodes.find((n) => n.id === e.target)?.type === 'concept');

    if (isPaperToConcept) {
      const pId = nodes.find((n) => n.id === e.source)?.type === 'paper' ? e.source : e.target;
      const cId = nodes.find((n) => n.id === e.target)?.type === 'concept' ? e.target : e.source;

      if (!paperToConceptsMap[pId]) paperToConceptsMap[pId] = [];
      if (!paperToConceptsMap[pId].includes(cId)) {
        paperToConceptsMap[pId].push(cId);
        conceptPaperCount[cId] = (conceptPaperCount[cId] || 0) + 1;
      }
    }
  });

  const activeNodes = nodes.filter((n) => {
    if (n.type === 'paper') return true;
    if (n.type === 'author') return showAuthors;
    if (n.type === 'concept') {
      return showConcepts && (conceptPaperCount[n.id] || 0) > 0;
    }
    return true;
  });
  const activeNodeIds = new Set(activeNodes.map((n) => n.id));

  const activeEdges = edges.filter((e) => {
    if (!activeNodeIds.has(e.source) || !activeNodeIds.has(e.target)) return false;
    if (e.type === 'COVERS_CONCEPT' && !showConceptEdges) return false;
    return true;
  });

  const conceptNodes = activeNodes.filter((n) => n.type === 'concept');
  const paperNodes = activeNodes.filter((n) => n.type === 'paper');
  const authorNodes = activeNodes.filter((n) => n.type === 'author');

  const positions: Record<string, { x: number; y: number }> = {};
  const nodeDimensions: Record<string, { w: number; h: number }> = {};
  const conceptIndexMap: Record<string, number> = {};

  const sortedConcepts = [...conceptNodes].sort(
    (a, b) => (conceptPaperCount[b.id] || 0) - (conceptPaperCount[a.id] || 0)
  );

  const numConcepts = Math.max(1, sortedConcepts.length);
  const totalConceptWidth = (numConcepts - 1) * COL_WIDTH;

  sortedConcepts.forEach((c, idx) => {
    const x = idx * COL_WIDTH - totalConceptWidth / 2;
    positions[c.id] = { x, y: 0 };
    nodeDimensions[c.id] = { w: 200, h: 50 };
    conceptIndexMap[c.id] = idx;
  });

  const columnBuckets: Record<string, Node[]> = {};

  const sortedPapers = [...paperNodes].sort((a, b) => {
    const yearA = (a.data as any).properties?.year || 2020;
    const yearB = (b.data as any).properties?.year || 2020;
    if (yearA !== yearB) return yearA - yearB;
    return ((b.data as any).properties?.citation_count || 0) - ((a.data as any).properties?.citation_count || 0);
  });

  sortedPapers.forEach((p, idx) => {
    const connected = paperToConceptsMap[p.id] || [];
    let colKey = '0';

    if (connected.length === 1) {
      const cIdx = conceptIndexMap[connected[0]] ?? (idx % numConcepts);
      colKey = `${cIdx}`;
    } else if (connected.length > 1) {
      const validIndices = connected
        .map((cid) => conceptIndexMap[cid])
        .filter((i) => i !== undefined);

      if (validIndices.length > 0) {
        const avgIdx = validIndices.reduce((sum, i) => sum + i, 0) / validIndices.length;
        const roundedKey = Math.round(avgIdx * 2) / 2;
        colKey = `${roundedKey}`;
      } else {
        colKey = `${idx % numConcepts}`;
      }
    } else {
      colKey = `${idx % numConcepts}`;
    }

    if (!columnBuckets[colKey]) columnBuckets[colKey] = [];
    columnBuckets[colKey].push(p);
  });

  Object.entries(columnBuckets).forEach(([colKeyStr, papersInCol]) => {
    const colIdx = parseFloat(colKeyStr);
    const colX = colIdx * COL_WIDTH - totalConceptWidth / 2;

    papersInCol.forEach((p, tier) => {
      positions[p.id] = {
        x: colX,
        y: 170 + tier * ROW_HEIGHT,
      };
      nodeDimensions[p.id] = { w: CARD_WIDTH, h: CARD_HEIGHT };
    });
  });

  // Collision Relaxation Pass
  const placedPaperIds = paperNodes.map((p) => p.id);
  for (let i = 0; i < placedPaperIds.length; i++) {
    for (let j = i + 1; j < placedPaperIds.length; j++) {
      const idA = placedPaperIds[i];
      const idB = placedPaperIds[j];
      const posA = positions[idA];
      const posB = positions[idB];

      if (posA && posB) {
        const dx = Math.abs(posA.x - posB.x);
        const dy = Math.abs(posA.y - posB.y);

        if (dx < CARD_WIDTH + 20 && dy < CARD_HEIGHT + 20) {
          if (posA.y <= posB.y) {
            posB.y = posA.y + ROW_HEIGHT;
          } else {
            posA.y = posB.y + ROW_HEIGHT;
          }
        }
      }
    }
  }

  // Authors
  authorNodes.forEach((a) => {
    const parentEdge = edges.find((e) => e.target === a.id || e.source === a.id);
    const parentId = parentEdge ? (parentEdge.source === a.id ? parentEdge.target : parentEdge.source) : null;
    const parentPos = parentId ? positions[parentId] : null;

    if (parentPos) {
      positions[a.id] = {
        x: parentPos.x + (Math.random() * 80 - 40),
        y: parentPos.y + 90,
      };
      nodeDimensions[a.id] = { w: 150, h: 40 };
    } else {
      positions[a.id] = { x: 0, y: 1500 };
      nodeDimensions[a.id] = { w: 150, h: 40 };
    }
  });

  const layoutedNodes = activeNodes.map((n) => ({
    ...n,
    position: positions[n.id] || { x: 0, y: 0 },
  }));

  const routedEdges = activeEdges.map((e) => {
    const sPos = positions[e.source] || { x: 0, y: 0 };
    const sSize = nodeDimensions[e.source] || { w: CARD_WIDTH, h: CARD_HEIGHT };
    const tPos = positions[e.target] || { x: 0, y: 0 };
    const tSize = nodeDimensions[e.target] || { w: CARD_WIDTH, h: CARD_HEIGHT };

    const { sourceHandle, targetHandle } = getClosestHandles(sPos, sSize, tPos, tSize);

    return {
      ...e,
      sourceHandle,
      targetHandle,
    };
  });

  return { nodes: layoutedNodes, edges: routedEdges };
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  data,
  isLoading,
  onRefresh,
  onSelectNode
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minCitations, setMinCitations] = useState(0);

  const [showAuthors, setShowAuthors] = useState(false);
  const [showConcepts, setShowConcepts] = useState(true);
  const [showConceptEdges, setShowConceptEdges] = useState(false);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const rawElements = useMemo(() => {
    if (!data) return { rawNodes: [], rawEdges: [] };

    const rawNodes: Node[] = data.nodes.map((n) => ({
      id: n.id,
      type: n.group,
      data: n as any,
      position: { x: 0, y: 0 },
    }));

    const rawEdges: Edge[] = data.edges.map((e) => {
      const isCitation = e.type === 'CITES';
      const isInfluential = !!e.properties?.is_influential;

      let stroke = isCitation ? '#E65C00' : '#FFB380';
      let strokeWidth = isInfluential ? 2.5 : 1.5;

      return {
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'straight',
        animated: isInfluential,
        style: {
          stroke,
          strokeWidth,
          opacity: isCitation ? 0.7 : 0.4,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
          color: stroke,
        },
      };
    });

    return { rawNodes, rawEdges };
  }, [data]);

  useEffect(() => {
    if (!rawElements.rawNodes.length) return;

    const { nodes: layoutedNodes, edges: layoutedEdges } = computeStrictDomainLayout(
      rawElements.rawNodes,
      rawElements.rawEdges,
      showAuthors,
      showConcepts,
      showConceptEdges || !!selectedNodeId
    );

    if (!selectedNodeId) {
      const decoratedNodes = layoutedNodes.map((n) => ({
        ...n,
        data: {
          ...(n.data as any),
          isDimmed: false,
          isHighlighted: false,
          isSelectedNode: false,
        },
      }));
      setNodes(decoratedNodes);
      setEdges(layoutedEdges);
      return;
    }

    const neighborNodeIds = new Set<string>([selectedNodeId]);
    const highlightedEdgeIds = new Set<string>();

    layoutedEdges.forEach((e) => {
      if (e.source === selectedNodeId) {
        neighborNodeIds.add(e.target);
        highlightedEdgeIds.add(e.id);
      } else if (e.target === selectedNodeId) {
        neighborNodeIds.add(e.source);
        highlightedEdgeIds.add(e.id);
      }
    });

    const decoratedNodes = layoutedNodes.map((n) => {
      const isSelected = n.id === selectedNodeId;
      const isNeighbor = neighborNodeIds.has(n.id);
      return {
        ...n,
        data: {
          ...(n.data as any),
          isDimmed: !isNeighbor,
          isHighlighted: isNeighbor && !isSelected,
          isSelectedNode: isSelected,
        },
      };
    });

    const decoratedEdges = layoutedEdges.map((e) => {
      const isHighlighted = highlightedEdgeIds.has(e.id);
      if (isHighlighted) {
        return {
          ...e,
          type: 'straight',
          animated: true,
          style: {
            stroke: '#E65C00',
            strokeWidth: 3,
            opacity: 1.0,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 15,
            height: 15,
            color: '#E65C00',
          },
        };
      } else {
        return {
          ...e,
          type: 'straight',
          animated: false,
          style: {
            stroke: '#E5E7EB',
            strokeWidth: 1,
            opacity: 0.15,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 10,
            height: 10,
            color: '#E5E7EB',
          },
        };
      }
    });

    setNodes(decoratedNodes);
    setEdges(decoratedEdges);
  }, [rawElements, showAuthors, showConcepts, showConceptEdges, selectedNodeId, setNodes, setEdges]);

  const [hoveredNode, setHoveredNode] = useState<{ id: string; x: number; y: number } | null>(null);

  const hoveredConnectionsCount = useMemo(() => {
    if (!hoveredNode) return 0;
    return rawElements.rawEdges.filter(
      (e) => e.source === hoveredNode.id || e.target === hoveredNode.id
    ).length;
  }, [hoveredNode, rawElements.rawEdges]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRefresh(searchTerm, minCitations);
  };

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId((prev) => (prev === node.id ? null : node.id));
      if (node.data && onSelectNode) {
        onSelectNode(node.data as unknown as GraphNodeData);
      }
    },
    [onSelectNode]
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 65px)', overflow: 'hidden' }}>
      {/* Top Control Bar */}
      <div style={{
        position: 'absolute',
        top: '18px',
        left: '24px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: '#FFFFFF',
        padding: '8px 16px',
        borderRadius: 'var(--radius-card)',
        border: '1px solid #111827',
        boxShadow: 'var(--shadow-card)'
      }}>
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search papers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-control)',
                padding: '6px 12px 6px 30px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                width: '180px',
                outline: 'none'
              }}
            />
          </div>
          <button
            type="submit"
            className="aura-btn-primary"
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            Filter
          </button>
        </form>

        <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />

        {/* Edge / Node Filter Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showConcepts}
              onChange={(e) => setShowConcepts(e.target.checked)}
              style={{ accentColor: 'var(--primary)' }}
            />
            <span style={{ color: 'var(--text-primary)' }}>Domains</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }} title="Toggle domain connecting wires">
            <input
              type="checkbox"
              checked={showConceptEdges}
              onChange={(e) => setShowConceptEdges(e.target.checked)}
              style={{ accentColor: 'var(--primary)' }}
            />
            <span>Wires</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showAuthors}
              onChange={(e) => setShowAuthors(e.target.checked)}
              style={{ accentColor: 'var(--primary)' }}
            />
            <span>Authors</span>
          </label>
        </div>

        <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />

        {/* Min Citations Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <Filter size={13} color="var(--primary)" />
          <input
            type="range"
            min="0"
            max="50000"
            step="1000"
            value={minCitations}
            onChange={(e) => {
              const val = Number(e.target.value);
              setMinCitations(val);
              onRefresh(searchTerm, val);
            }}
            style={{ width: '65px', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
          <span className="aura-tag-mono" style={{ fontSize: '10px' }}>
            {minCitations > 0 ? `${(minCitations / 1000).toFixed(0)}k+` : 'All'}
          </span>
        </div>

        {/* Refresh button */}
        <button
          onClick={() => onRefresh(searchTerm, minCitations)}
          title="Reload subgraph"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px'
          }}
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin-slow' : ''} />
        </button>
      </div>

      {/* 1-Hop Focus Indicator */}
      {selectedNodeId && (
        <div style={{
          position: 'absolute',
          top: '74px',
          left: '24px',
          zIndex: 10,
          background: '#FFFFFF',
          border: '1px solid #111827',
          borderRadius: 'var(--radius-pill)',
          padding: '5px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          color: 'var(--primary)',
          fontFamily: 'var(--font-mono)',
          boxShadow: 'var(--shadow-control)'
        }}>
          <span>1-Hop Isolated</span>
          <button
            onClick={() => setSelectedNodeId(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px'
            }}
            title="Reset focus"
          >
            <XCircle size={13} />
          </button>
        </div>
      )}

      {/* React Flow Core */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onNodeMouseEnter={(event, node) => {
          setHoveredNode({
            id: node.id,
            x: event.clientX,
            y: event.clientY,
          });
        }}
        onNodeMouseMove={(event, node) => {
          setHoveredNode({
            id: node.id,
            x: event.clientX,
            y: event.clientY,
          });
        }}
        onNodeMouseLeave={() => {
          setHoveredNode(null);
        }}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2.0}
        defaultEdgeOptions={{ type: 'straight' }}
      >
        <Background color="#E5E7EB" gap={22} size={1} variant={BackgroundVariant.Dots} />
        <Controls position="bottom-right" />
        <MiniMap
          nodeColor={(n) => {
            if (n.type === 'concept') return '#E65C00';
            if (n.type === 'paper') return '#FFB380';
            if (n.type === 'author') return '#D1D5DB';
            return '#E5E7EB';
          }}
          maskColor="rgba(253, 251, 247, 0.7)"
          style={{ background: '#FFFFFF', border: '1px solid #111827', borderRadius: '10px' }}
          position="top-right"
        />
      </ReactFlow>

      {/* Cursor Hover Tooltip Box */}
      {hoveredNode && (
        <div
          style={{
            position: 'fixed',
            left: hoveredNode.x + 14,
            top: hoveredNode.y + 14,
            zIndex: 9999,
            pointerEvents: 'none',
            background: '#111827',
            color: '#FFFFFF',
            padding: '4px 9px',
            borderRadius: '6px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(255,255,255,0.15)'
          }}
        >
          {hoveredConnectionsCount} {hoveredConnectionsCount === 1 ? 'connection' : 'connections'}
        </div>
      )}
    </div>
  );
};
