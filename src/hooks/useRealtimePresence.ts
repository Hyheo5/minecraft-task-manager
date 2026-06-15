import { useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useMultiplayerStore } from '@/store/useMultiplayerStore';
import { User } from '@/types';

export function useRealtimePresence() {
  const { localUser, addTeamMember, setActiveUserIds, updateFlags, setMyFlag } = useMultiplayerStore();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !localUser) return;

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
        const activeIds: string[] = [];
        
        Object.keys(state).forEach((userId) => {
          activeIds.push(userId);
          const presences = state[userId] as any[];
          if (presences.length > 0) {
            const p = presences[0];
            if (p.user) {
              addTeamMember(p.user as User);
            }
            if (p.nodeId) {
              updateFlags(userId, p.nodeId);
            }
          }
        });
        setActiveUserIds(activeIds);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        setActiveUserIds(Object.keys(channel.presenceState()));
        if (newPresences.length > 0) {
          const p = newPresences[0];
          if (p.user) {
            addTeamMember(p.user as User);
          }
          if (p.nodeId) {
            updateFlags(key, p.nodeId);
          }
        }
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setActiveUserIds(Object.keys(channel.presenceState()));
        updateFlags(key, undefined); // Remove flag
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track initial status, not assigned to a node initially
          await channel.track({ user: localUser, nodeId: null });
        }
      });

    // Attach function to the store to allow the local user to broadcast flag moves
    useMultiplayerStore.setState({
      setMyFlag: async (nodeId: string | undefined) => {
        await channel.track({ user: localUser, nodeId });
        updateFlags(localUser.id, nodeId); // Optimistic local update
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [localUser?.id]); // Re-run if local user changes
}
