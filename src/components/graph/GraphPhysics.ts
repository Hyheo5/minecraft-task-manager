import { useEffect, useRef } from 'react';
import { useGraphStore } from '@/store/useGraphStore';
import { useUIStore } from '@/store/useUIStore';
import * as d3 from 'd3-force';
import { Node } from '@xyflow/react';
import { supabase } from '@/services/supabaseClient';

export function useGraphPhysics() {
  const { nodes, edges } = useGraphStore();
  const { physicsEnabled, chargeStrength, linkDistance, gravityStrength, centralForceStrength } = useUIStore();
  
  const simulationRef = useRef<d3.Simulation<any, any> | null>(null);
  const simNodesRef = useRef<any[]>([]);

  // 1. Initialize simulation on nodes length/edges length change
  useEffect(() => {
    if (nodes.length === 0 || !physicsEnabled) return;

    // Create persistent node references for the simulation
    const simulationNodes = nodes.map((n) => {
      const existing = simNodesRef.current.find(sn => sn.id === n.id);
      return {
        ...n,
        x: existing?.x ?? n.position.x,
        y: existing?.y ?? n.position.y,
        fx: existing?.fx ?? null,
        fy: existing?.fy ?? null,
      };
    });
    simNodesRef.current = simulationNodes;

    const simulationLinks = edges.map((e) => ({
      ...e,
      source: e.source,
      target: e.target,
    }));

    const simulation = d3
      .forceSimulation(simulationNodes)
      .force('link', d3.forceLink(simulationLinks).id((d: any) => d.id).distance(linkDistance))
      .force('charge', d3.forceManyBody().strength(chargeStrength))
      .force('universalGravity', d3.forceManyBody().strength(gravityStrength))
      .force('centerX', d3.forceX(400).strength(centralForceStrength))
      .force('centerY', d3.forceY(300).strength(centralForceStrength))
      .force('collide', d3.forceCollide().radius(80)) // slightly larger radius for pie charts
      .alphaDecay(0.05);

    simulation.on('tick', () => {
      useGraphStore.setState((state) => {
        let hasChanges = false;
        const nextNodes = state.nodes.map((n) => {
          if (n.dragging) return n; // Let React Flow control dragged nodes
          const simNode = simulationNodes.find((sn) => sn.id === n.id);
          if (simNode && simNode.x !== undefined && simNode.y !== undefined) {
             // Only update if it moved significantly to avoid jitter
             if (Math.abs(n.position.x - simNode.x) > 0.5 || Math.abs(n.position.y - simNode.y) > 0.5) {
                hasChanges = true;
                return { ...n, position: { x: simNode.x, y: simNode.y } };
             }
          }
          return n;
        });
        // Only trigger React re-render if there are actual position changes
        return hasChanges ? { nodes: nextNodes } : state;
      });
    });

    simulation.on('end', () => {
      // Sync final positions to Supabase
      useGraphStore.setState((state) => {
         const nextNodes = state.nodes.map(n => {
           const simNode = simulationNodes.find(sn => sn.id === n.id);
           if (simNode && simNode.x !== undefined && simNode.y !== undefined) {
             return { ...n, position: { x: simNode.x, y: simNode.y } };
           }
           return n;
         });
         
         if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
           nextNodes.forEach(node => {
             // Only update if no dragging is happening
             if (!node.dragging) {
               supabase.from('nodes').update({
                 position_x: node.position.x,
                 position_y: node.position.y,
               }).eq('id', node.id).then(({ error }) => {
                 if (error) console.error("Failed to update node position on physics end:", error);
               });
             }
           });
         }
         return { nodes: nextNodes };
      });
    });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edges.length, nodes.length, physicsEnabled, chargeStrength, linkDistance, gravityStrength, centralForceStrength]);

  // 2. Sync React Flow dragging state to the simulation
  useEffect(() => {
    if (!simulationRef.current || !physicsEnabled) return;
    
    let isAnyDragging = false;
    
    nodes.forEach(n => {
      const simNode = simNodesRef.current.find(sn => sn.id === n.id);
      if (simNode) {
        if (n.dragging) {
          isAnyDragging = true;
          simNode.fx = n.position.x;
          simNode.fy = n.position.y;
        } else {
          // Release the node if it was previously dragged
          simNode.fx = null;
          simNode.fy = null;
        }
      }
    });

    // If a node is being dragged, keep the simulation 'hot'
    if (isAnyDragging) {
      simulationRef.current.alphaTarget(0.3).restart();
    } else {
      // Let it cool down naturally
      simulationRef.current.alphaTarget(0);
    }
  }, [nodes, physicsEnabled]);
}
