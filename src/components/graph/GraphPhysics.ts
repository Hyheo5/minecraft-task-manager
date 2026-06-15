import { useEffect, useRef } from 'react';
import { useGraphStore } from '@/store/useGraphStore';
import { useUIStore } from '@/store/useUIStore';
import * as d3 from 'd3-force';
import { Node, Edge } from '@xyflow/react';
import { supabase } from '@/services/supabaseClient';

export function useGraphPhysics() {
  const { nodes, edges, updateNode } = useGraphStore();
  const { physicsEnabled, chargeStrength, linkDistance } = useUIStore();

  useEffect(() => {
    // Only initialize or re-run if we have nodes and physics is enabled
    if (nodes.length === 0 || !physicsEnabled) return;

    // We don't want to constantly re-run the whole simulation on every tiny drag update from React Flow.
    // In a real sophisticated app, we'd sync d3 alpha with React Flow drag events.
    // For this simple implementation, we'll run it once when nodes/edges change significantly
    // or when we want to auto-layout.

    const simulationNodes = nodes.map((n) => ({
      ...n,
      x: n.position.x,
      y: n.position.y,
    })) as (Node & d3.SimulationNodeDatum)[];

    const simulationLinks = edges.map((e) => ({
      ...e,
      source: e.source,
      target: e.target,
    }));

    const simulation = d3
      .forceSimulation(simulationNodes)
      .force(
        'link',
        d3.forceLink(simulationLinks).id((d: any) => d.id).distance(linkDistance)
      )
      .force('charge', d3.forceManyBody().strength(chargeStrength)) // Repel each other
      .force('center', d3.forceCenter(400, 300))
      .force('collide', d3.forceCollide().radius(60)) // Prevent overlapping
      .on('tick', () => {
        // We mutate the objects directly for performance during tick.
        // React Flow picks up the position changes organically if rendered,
        // but we rely on the 'end' event to save the final positions to Zustand/Supabase.
      });

      // Update nodes in Zustand store after simulation cools down
      simulation.on('end', () => {
        useGraphStore.setState((state) => {
           const nextNodes = state.nodes.map(n => {
             const simNode = simulationNodes.find(sn => sn.id === n.id);
             if (simNode && simNode.x !== undefined && simNode.y !== undefined) {
               return { ...n, position: { x: simNode.x, y: simNode.y } };
             }
             return n;
           });
           
           // Push final calculated positions to Supabase
           if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
             nextNodes.forEach(node => {
               supabase.from('nodes').update({
                 position_x: node.position.x,
                 position_y: node.position.y,
               }).eq('id', node.id).then(({ error }) => {
                 if (error) console.error("Failed to update node position on physics end:", error);
               });
             });
           }
           
           return { nodes: nextNodes };
        });
      });

    return () => {
      simulation.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edges.length, nodes.length, physicsEnabled, chargeStrength, linkDistance]); // Re-run when parameters change
}
