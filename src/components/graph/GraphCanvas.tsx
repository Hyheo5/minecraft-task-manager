'use client';

import { useEffect, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  EdgeTypes,
  Panel,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useGraphStore } from '@/store/useGraphStore';
import { useUIStore } from '@/store/useUIStore';
import { useGraphPhysics } from './GraphPhysics';
import PieChartNode from './PieChartNode';
import DirectedEdge from './DirectedEdge';
import NodeModal from '../notion-panel/NodeModal';
import HoverPopover from '../notion-panel/HoverPopover';
import QuickAddInput from '../command-line/QuickAddInput';
import MemberManager from '../team/MemberManager';
import SettingsMenu from '../ui/SettingsMenu';
import { useMultiplayerStore } from '@/store/useMultiplayerStore';
import { useSupabaseSync } from '@/hooks/useSupabaseSync';
import { useRealtimePresence } from '@/hooks/useRealtimePresence';
import { supabase } from '@/services/supabaseClient';

const nodeTypes: NodeTypes = {
  pieChart: PieChartNode,
};

const edgeTypes: EdgeTypes = {
  directed: DirectedEdge,
};

export default function GraphCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    deleteNode,
    deleteEdge,
  } = useGraphStore();

  const { setSelectedNodeId, setHoveredNodeId } = useUIStore();
  const { updateFlags } = useMultiplayerStore();

  // Initialize Supabase sync and realtime presence
  useSupabaseSync();
  useRealtimePresence();

  // Apply d3-force physics to the nodes and edges
  useGraphPhysics();

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: any) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onNodeMouseEnter = useCallback(
    (_: React.MouseEvent, node: any) => {
      setHoveredNodeId(node.id);
    },
    [setHoveredNodeId]
  );

  const onNodeMouseLeave = useCallback(() => {
    setHoveredNodeId(null);
  }, [setHoveredNodeId]);

  return (
    <ReactFlowProvider>
      <div className="w-full h-full bg-neutral-950 text-neutral-50 relative">
        <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={(deletedNodes) => {
          deletedNodes.forEach((n) => deleteNode(n.id));
        }}
        onEdgesDelete={(deletedEdges) => {
          deletedEdges.forEach((e) => deleteEdge(e.id));
        }}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onDrop={(e) => {
          e.preventDefault();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }}
        onNodeDragStop={(e, node) => {
          // Push new position to Supabase when user finishes dragging
          if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            supabase.from('nodes').update({
              position_x: node.position.x,
              position_y: node.position.y,
            }).eq('id', node.id).then(({ error }) => {
              if (error) console.error("Failed to update node position after drag:", error);
            });
          }
        }}
        fitView
        className="react-flow-dark"
      >
        <Background color="#333" gap={16} />
        <Controls className="fill-white text-black" />
        <MiniMap nodeColor="#444" maskColor="rgba(0,0,0,0.5)" />
        <Panel position="top-left" className="text-xl font-bold p-4 text-white">
          Minecraft Task Manager
        </Panel>
      </ReactFlow>
      
      {/* UI Overlays */}
      <MemberManager />
        <QuickAddInput />
        <NodeModal />
        <HoverPopover />
        <SettingsMenu />
      </div>
    </ReactFlowProvider>
  );
}
