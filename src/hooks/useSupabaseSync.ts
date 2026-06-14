import { useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useGraphStore } from '@/store/useGraphStore';
import { useMultiplayerStore } from '@/store/useMultiplayerStore';

export function useSupabaseSync() {
  useEffect(() => {
    // Only run if supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

    const fetchInitialData = async () => {
      const [nodesRes, edgesRes, propsRes, usersRes] = await Promise.all([
        supabase.from('nodes').select('*'),
        supabase.from('edges').select('*'),
        supabase.from('global_properties').select('*'),
        supabase.from('users').select('*'),
      ]);

      if (nodesRes.data) {
        const mappedNodes = nodesRes.data.map((n) => ({
          id: n.id,
          type: 'pieChart',
          position: { x: n.position_x, y: n.position_y },
          data: {
            title: n.title,
            description: n.description,
            progress: n.progress,
            properties: n.properties,
          },
        }));
        useGraphStore.setState({ nodes: mappedNodes });
      }

      if (edgesRes.data) {
        useGraphStore.setState({ edges: edgesRes.data });
      }

      if (propsRes.data) {
        useGraphStore.setState({ properties: propsRes.data });
      }

      if (usersRes.data) {
        useMultiplayerStore.setState({ teamMembers: usersRes.data });
      }
    };

    fetchInitialData();

    // Subscribe to changes
    const nodesSub = supabase
      .channel('public:nodes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'nodes' }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const n = payload.new as any;
          const mappedNode = {
            id: n.id,
            type: 'pieChart',
            position: { x: n.position_x, y: n.position_y },
            data: {
              title: n.title,
              description: n.description,
              progress: n.progress,
              properties: n.properties,
            },
          };
          useGraphStore.setState((state) => {
            const exists = state.nodes.find((node) => node.id === n.id);
            if (exists) {
              return { nodes: state.nodes.map((node) => node.id === n.id ? { ...node, ...mappedNode } : node) };
            }
            return { nodes: [...state.nodes, mappedNode] };
          });
        } else if (payload.eventType === 'DELETE') {
          useGraphStore.setState((state) => ({
            nodes: state.nodes.filter((node) => node.id !== payload.old.id),
          }));
        }
      })
      .subscribe();

    const edgesSub = supabase
      .channel('public:edges')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'edges' }, (payload) => {
         if (payload.eventType === 'INSERT') {
           useGraphStore.setState((state) => {
             const exists = state.edges.find((e) => e.id === payload.new.id);
             return exists ? state : { edges: [...state.edges, payload.new as any] };
           });
         } else if (payload.eventType === 'DELETE') {
           useGraphStore.setState((state) => ({
             edges: state.edges.filter((e) => e.id !== payload.old.id),
           }));
         }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(nodesSub);
      supabase.removeChannel(edgesSub);
    };
  }, []);
}
