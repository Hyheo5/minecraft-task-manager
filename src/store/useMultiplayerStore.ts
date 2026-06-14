import { create } from 'zustand';
import { User, Presence } from '@/types';

type MultiplayerState = {
  teamMembers: User[];
  activeFlags: Record<string, string[]>; // nodeId -> array of userIds
  liveCursors: Record<string, { x: number; y: number }>; // userId -> cursor position
  setMyFlag: (nodeId: string | undefined) => void;
  // Methods to update state based on presence events
  updateCursor: (userId: string, position: { x: number; y: number }) => void;
  updateFlags: (userId: string, nodeId?: string) => void;
  setTeamMembers: (members: User[]) => void;
};

const dummyMembers: User[] = [
  {
    id: 'user_1',
    name: 'Steve',
    flag_color: '#4ADE80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'user_2',
    name: 'Alex',
    flag_color: '#3B82F6',
    created_at: new Date().toISOString(),
  },
];

export const useMultiplayerStore = create<MultiplayerState>((set) => ({
  teamMembers: dummyMembers,
  activeFlags: {},
  liveCursors: {},
  setMyFlag: (nodeId) => {
    // In a real app, this would broadcast via Supabase Realtime
    console.log('Broadcasting flag for node:', nodeId);
    set((state) => {
      // Simulate local update
      const newFlags = { ...state.activeFlags };
      // Remove user from all other nodes
      Object.keys(newFlags).forEach((key) => {
        newFlags[key] = newFlags[key].filter((id) => id !== dummyMembers[0].id);
      });
      if (nodeId) {
        if (!newFlags[nodeId]) newFlags[nodeId] = [];
        newFlags[nodeId].push(dummyMembers[0].id);
      }
      return { activeFlags: newFlags };
    });
  },
  updateCursor: (userId, position) => {
    set((state) => ({
      liveCursors: {
        ...state.liveCursors,
        [userId]: position,
      },
    }));
  },
  updateFlags: (userId, nodeId) => {
    set((state) => {
      const newFlags = { ...state.activeFlags };
      Object.keys(newFlags).forEach((key) => {
        newFlags[key] = newFlags[key].filter((id) => id !== userId);
      });
      if (nodeId) {
        if (!newFlags[nodeId]) newFlags[nodeId] = [];
        newFlags[nodeId].push(userId);
      }
      return { activeFlags: newFlags };
    });
  },
  setTeamMembers: (members) => set({ teamMembers: members }),
}));
