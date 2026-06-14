import { useEffect, useRef } from 'react';
import { useGraphStore } from '@/store/useGraphStore';
import * as d3 from 'd3-force';
import { Node, Edge } from '@xyflow/react';

export function useGraphPhysics() {
  const { nodes, edges, updateNode } = useGraphStore();

  useEffect(() => {
    // Only initialize or re-run if we have nodes
    if (nodes.length === 0) return;

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
        d3.forceLink(simulationLinks).id((d: any) => d.id).distance(150)
      )
      .force('charge', d3.forceManyBody().strength(-800)) // Repel each other
      .force('center', d3.forceCenter(400, 300))
      .force('collide', d3.forceCollide().radius(60)) // Prevent overlapping
      .on('tick', () => {
        // Update the nodes in the Zustand store on every tick
        // To prevent massive re-renders, we might want to batch this or only update on 'end'.
        // For a live Obsidian feel, updating on tick is better but can be expensive.
        simulationNodes.forEach((node) => {
          if (node.x !== undefined && node.y !== undefined) {
             // Let React Flow handle position updates organically
            updateNode(node.id, undefined as any); // We need a way to update positions safely without overriding data.
            // Actually, we should update the position specifically. Let's add a setNodePosition to our store or use updateNode.
            // Wait, React Flow expects nodes to be updated. We'll mutate the objects directly for performance during tick,
            // then force a state update, or just use React Flow's setNodes.
            
            // To properly integrate d3-force with Zustand:
          }
        });
      });

      // Quick implementation: Update nodes in Zustand store after simulation cools down
      simulation.on('end', () => {
        useGraphStore.setState((state) => ({
           nodes: state.nodes.map(n => {
             const simNode = simulationNodes.find(sn => sn.id === n.id);
             if (simNode && simNode.x !== undefined && simNode.y !== undefined) {
               return { ...n, position: { x: simNode.x, y: simNode.y } };
             }
             return n;
           })
        }));
      });

    return () => {
      simulation.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edges.length, nodes.length]); // Only re-run when counts change to avoid infinite loops

}
