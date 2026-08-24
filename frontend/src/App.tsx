import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { GraphCanvas } from './components/GraphCanvas';
import { LineageView } from './components/LineageView';
import { GapFinderView } from './components/GapFinderView';
import { BridgeFinderView } from './components/BridgeFinderView';
import { IngestConsole } from './components/IngestConsole';
import { NodeInspectorModal } from './components/NodeInspectorModal';
import type { HealthStatus, SubgraphResponse, GraphNodeData } from './types';
import { fetchHealth, fetchSubgraph, reseedDatabase } from './api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'explorer' | 'lineage' | 'gaps' | 'bridges' | 'ingest'>('explorer');
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [subgraph, setSubgraph] = useState<SubgraphResponse | null>(null);
  const [isLoadingGraph, setIsLoadingGraph] = useState<boolean>(false);
  const [isReseeding, setIsReseeding] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<GraphNodeData | null>(null);
  const [lineagePaperId, setLineagePaperId] = useState<string | undefined>(undefined);

  const loadHealth = async () => {
    try {
      const h = await fetchHealth();
      setHealth(h);
    } catch (err) {
      console.error('Health ping error:', err);
    }
  };

  const loadGraph = async (search?: string, minCitations?: number) => {
    setIsLoadingGraph(true);
    try {
      const data = await fetchSubgraph(search, 80, minCitations || 0);
      setSubgraph(data);
    } catch (err) {
      console.error('Failed to load subgraph:', err);
    } finally {
      setIsLoadingGraph(false);
    }
  };

  useEffect(() => {
    loadHealth();
    loadGraph();

    // Periodic 10s health ping
    const interval = setInterval(loadHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleReseed = async () => {
    setIsReseeding(true);
    try {
      await reseedDatabase();
      await loadGraph();
      await loadHealth();
    } catch (err) {
      console.error('Reseed failed:', err);
    } finally {
      setIsReseeding(false);
    }
  };

  const handleTraceLineage = (paperId: string) => {
    setLineagePaperId(paperId);
    setSelectedNode(null);
    setActiveTab('lineage');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        health={health}
        onReseed={handleReseed}
        isReseeding={isReseeding}
      />

      {/* Main Tab Content */}
      <main style={{ flex: 1, position: 'relative' }}>
        {activeTab === 'explorer' && (
          <GraphCanvas
            data={subgraph}
            isLoading={isLoadingGraph}
            onRefresh={loadGraph}
            onSelectNode={setSelectedNode}
          />
        )}

        {activeTab === 'lineage' && (
          <LineageView
            subgraph={subgraph}
            initialPaperId={lineagePaperId}
            onSelectNode={setSelectedNode}
          />
        )}

        {activeTab === 'gaps' && (
          <GapFinderView
            onSelectPaperTitle={(title) => {
              loadGraph(title);
              setActiveTab('explorer');
            }}
          />
        )}

        {activeTab === 'bridges' && (
          <BridgeFinderView subgraph={subgraph} />
        )}

        {activeTab === 'ingest' && (
          <IngestConsole
            onIngestSuccess={() => {
              loadGraph();
              loadHealth();
            }}
          />
        )}
      </main>

      {/* Slide-over Node Inspector */}
      <NodeInspectorModal
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onTraceLineage={handleTraceLineage}
      />
    </div>
  );
};

export default App;
