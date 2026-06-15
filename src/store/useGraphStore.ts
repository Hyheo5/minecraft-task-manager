import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { CustomNodeData, GlobalProperty } from '@/types';
import { supabase } from '@/services/supabaseClient';

type GraphState = {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  properties: GlobalProperty[];
  onNodesChange: OnNodesChange<Node<CustomNodeData>>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node<CustomNodeData>) => void;
  updateNode: (id: string, data: Partial<CustomNodeData>) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  // TODO: Add properties management actions
};

const initialNodes: Node<CustomNodeData>[] = [
  {
    id: 'gather_obsidian',
    type: 'pieChart',
    position: { x: 100, y: 300 },
    data: {
      title: 'Gather Obsidian',
      description: 'Need 4 for the enchantment table. Bring water bucket.',
      progress: 75,
      properties: {},
    },
  },
  {
    id: 'make_enchantment_table',
    type: 'pieChart',
    position: { x: 300, y: 100 },
    data: {
      title: 'Make Enchantment Table',
      description: 'Requires obsidian, diamonds, and a book.',
      progress: 20,
      properties: {},
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e_gather_obsidian-make_enchantment_table',
    source: 'gather_obsidian',
    target: 'make_enchantment_table',
    type: 'directed',
  },
];

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  properties: [],
  onNodesChange: (changes: NodeChange<Node<CustomNodeData>>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    const newEdge = { ...connection, type: 'directed' } as Edge;
    set({
      edges: addEdge(newEdge, get().edges),
    });
    // Push to Supabase if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && newEdge.id) {
      supabase.from('edges').insert({
        id: newEdge.id,
        source: newEdge.source,
        target: newEdge.target,
        type: newEdge.type,
      }).then(({ error }) => {
        if (error) console.error("Failed to insert edge:", error);
      });
    }
  },
  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      supabase.from('nodes').insert({
        id: node.id,
        title: node.data.title,
        description: node.data.description || '',
        progress: node.data.progress || 0,
        properties: node.data.properties || {},
        position_x: node.position.x,
        position_y: node.position.y,
      }).then(({ error }) => {
        if (error) console.error("Failed to insert node:", error);
      });
    }
  },
  updateNode: (id, data) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    });
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Find the fully merged node to send to db
      const n = get().nodes.find(n => n.id === id);
      if (n) {
        supabase.from('nodes').update({
          title: n.data.title,
          description: n.data.description || '',
          progress: n.data.progress,
          properties: n.data.properties,
          position_x: n.position.x,
          position_y: n.position.y,
        }).eq('id', id).then(({ error }) => {
          if (error) console.error("Failed to update node:", error);
        });
      }
    }
  },
  deleteNode: (id) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
    });
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      supabase.from('nodes').delete().eq('id', id).then(({ error }) => {
        if (error) console.error("Failed to delete node:", error);
      });
      // also explicitly delete edges if not using cascade
      supabase.from('edges').delete().or(`source.eq.${id},target.eq.${id}`).then(({ error }) => {
        if (error) console.error("Failed to delete edges for node:", error);
      });
    }
  },
  deleteEdge: (id) => {
    set({
      edges: get().edges.filter((e) => e.id !== id),
    });
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      supabase.from('edges').delete().eq('id', id).then(({ error }) => {
        if (error) console.error("Failed to delete edge:", error);
      });
    }
  },
}));
