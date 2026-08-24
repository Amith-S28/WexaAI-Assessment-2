import React, { useState, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import dagre from 'dagre';
import { GitFork, Award } from 'lucide-react';
import type { LineageResponse, SubgraphResponse, GraphNodeData } from '../types';
import { fetchLineage } from '../api';
import { nodeTypes } from './CustomNodes';

interface LineageViewProps {
  subgraph: SubgraphResponse | null;
  initialPaperId?: string;
  onSelectNode: (node: GraphNodeData) => void;
}

const nodeWidth = 260;
const nodeHeight = 90;

function layoutLineage(nodes: Node[], edges: Edge[]) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 50, ranksep: 90 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const pos = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: pos.x - nodeWidth / 2,
        y: pos.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

export const LineageView: React.FC<LineageViewProps> = ({
  subgraph,
  initialPaperId,
  onSelectNode
}) => {
  const papers = (subgraph?.nodes || []).filter((n) => n.group === 'paper');
  const [selectedPaperId, setSelectedPaperId] = useState<string>(
    initialPaperId || papers[0]?.id || ''
  );
  const [maxDepth, setMaxDepth] = useState<number>(4);
  const [lineageData, setLineageData] = useState<LineageResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    if (initialPaperId) {
      setSelectedPaperId(initialPaperId);
    }
  }, [initialPaperId]);

  useEffect(() => {
    if (!selectedPaperId) return;

    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetchLineage(selectedPaperId, maxDepth, 0);
        setLineageData(res);

        const flowNodes: Node[] = res.subgraph.nodes.map((n) => ({
          id: n.id,
          type: n.group,
          data: n as any,
          position: { x: 0, y: 0 },
        }));

        const flowEdges: Edge[] = res.subgraph.edges.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          type: 'straight',
          animated: true,
          style: { stroke: '#E65C00', strokeWidth: 2.5 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 14,
            height: 14,
            color: '#E65C00',
          },
        }));

        const layouted = layoutLineage(flowNodes, flowEdges);
        setNodes(layouted.nodes);
        setEdges(layouted.edges);
      } catch (err) {
        console.error('Failed to load lineage:', err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [selectedPaperId, maxDepth, setNodes, setEdges]);

  return (
    <div style={{ display: 'flex', width: '100%', height: 'calc(100vh - 65px)', overflow: 'hidden' }}>
      {/* Sidebar Controls & Ancestor Chains */}
      <div style={{
        width: '370px',
        borderRight: '1px solid var(--border)',
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10
      }}>
        {/* Top Filter Selection */}
        <div style={{ padding: '20px 20px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <GitFork size={17} color="var(--primary)" /> Multi-Hop Citation Lineage
          </h2>

          {/* Select Paper */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px', fontFamily: 'var(--font-display)' }}>
              Select Origin Paper:
            </label>
            <select
              value={selectedPaperId}
              onChange={(e) => setSelectedPaperId(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                padding: '9px 12px',
                borderRadius: 'var(--radius-control)',
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {papers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.properties?.year || 'N/A'})
                </option>
              ))}
            </select>
          </div>

          {/* Max Depth Slider */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ fontFamily: 'var(--font-display)' }}>Max Ancestry Hops:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="range"
                min="1"
                max="4"
                value={maxDepth}
                onChange={(e) => setMaxDepth(Number(e.target.value))}
                style={{ width: '85px', accentColor: 'var(--primary)' }}
              />
              <strong className="aura-tag-mono">{maxDepth} hops</strong>
            </div>
          </div>
        </div>

        {/* Lineage Paths List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
            Foundational Ancestors ({lineageData?.paths.length || 0})
          </div>

          {isLoading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
              Computing multi-hop Cypher paths...
            </div>
          ) : (
            lineageData?.paths.map((p, idx) => (
              <div
                key={idx}
                className="aura-card"
                style={{
                  padding: '12px 14px',
                  cursor: 'pointer',
                  borderLeft: p.depth === 1 ? '3px solid var(--primary)' : p.depth === 2 ? '3px solid var(--accent)' : '3px solid #9CA3AF',
                  background: 'var(--surface)'
                }}
                onClick={() => {
                  const node = lineageData.subgraph.nodes.find((n) => n.id === p.ancestor_id);
                  if (node) onSelectNode(node);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className="aura-tag-mono" style={{
                    fontSize: '9px',
                    color: p.depth === 1 ? 'var(--primary)' : 'var(--primary)',
                    background: '#FFFFFF'
                  }}>
                    {p.depth} {p.depth === 1 ? 'Hop Direct' : 'Hops Upstream'}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'var(--font-mono)' }}>
                    <Award size={11} color="var(--primary)" /> {p.ancestor_citations.toLocaleString()} cites
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                  {p.ancestor_title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', fontFamily: 'var(--font-body)' }}>
                  Published in {p.ancestor_year || 'N/A'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Lineage Graph Canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => {
            if (node.data) onSelectNode(node.data as unknown as GraphNodeData);
          }}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}
          maxZoom={1.8}
        >
          <Background color="#E5E7EB" gap={24} size={1} variant={BackgroundVariant.Dots} />
          <Controls position="bottom-right" />
        </ReactFlow>
      </div>
    </div>
  );
};
