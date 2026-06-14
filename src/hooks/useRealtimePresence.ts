import { useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useMultiplayerStore } from '@/store/useMultiplayerStore';

export function useRealtimePresence() {
  const { teamMembers, updateFlags } = useMultiplayerStore();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || teamMembers.length === 0) return;

    // For simplicity, pretend the first user is the "current" local user
    const localUser = teamMembers[0]; 

    const channel = supabase.channel('minecraft-workspace', {
      config: {
        presence: {
          key: localUser.id,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        // Extract flags from state and update store
        // e.g. state: { 'user_1': [{ nodeId: 'gather_obsidian' }] }
        Object.keys(state).forEach((userId) => {
          const presences = state[userId] as any[];
          if (presences.length > 0 && presences[0].nodeId) {
            updateFlags(userId, presences[0].nodeId);
          }
        });
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        if (newPresences.length > 0 && newPresences[0].nodeId) {
          updateFlags(key, newPresences[0].nodeId);
        }
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        updateFlags(key, undefined); // Remove flag
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track initial status, not assigned to a node initially
          await channel.track({ nodeId: null });
        }
      });

    // We can also attach a function to the store to allow the local user to broadcast flag moves
    useMultiplayerStore.setState({
      setMyFlag: async (nodeId: string | undefined) => {
        await channel.track({ nodeId });
        updateFlags(localUser.id, nodeId); // Optimistic local update
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamMembers.length]); // Re-run if team members load
}
