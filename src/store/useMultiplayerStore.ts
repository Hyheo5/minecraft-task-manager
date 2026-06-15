import { create } from 'zustand';
import { User } from '@/types';

type MultiplayerState = {
  localUser: User | null;
  teamMembers: User[];
  activeUserIds: string[]; // Track who is currently online
  activeFlags: Record<string, string[]>; // nodeId -> array of userIds
  liveCursors: Record<string, { x: number; y: number }>; // userId -> cursor position
  
  setLocalUser: (user: User) => void;
  setMyFlag: (nodeId: string | undefined) => void;
  updateCursor: (userId: string, position: { x: number; y: number }) => void;
  updateFlags: (userId: string, nodeId?: string) => void;
  setTeamMembers: (members: User[]) => void;
  addTeamMember: (member: User) => void;
  setActiveUserIds: (ids: string[]) => void;
  removeUser: (userId: string) => void;
};

export const useMultiplayerStore = create<MultiplayerState>((set) => ({
  localUser: null,
  teamMembers: [],
  activeUserIds: [],
  activeFlags: {},
  liveCursors: {},
  
  setLocalUser: (user) => set({ localUser: user }),
  
  setMyFlag: (nodeId) => {
    set((state) => {
      if (!state.localUser) return state;
      const newFlags = { ...state.activeFlags };
      // Remove user from all other nodes
      Object.keys(newFlags).forEach((key) => {
        newFlags[key] = newFlags[key].filter((id) => id !== state.localUser!.id);
      });
      if (nodeId) {
        if (!newFlags[nodeId]) newFlags[nodeId] = [];
        newFlags[nodeId].push(state.localUser.id);
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
  
  addTeamMember: (member) => set((state) => {
    if (state.teamMembers.find(m => m.id === member.id)) {
      // Update existing
      return { teamMembers: state.teamMembers.map(m => m.id === member.id ? member : m) };
    }
    return { teamMembers: [...state.teamMembers, member] };
  }),
  
  setActiveUserIds: (ids) => set({ activeUserIds: ids }),
  
  removeUser: (userId) => set((state) => {
    // Also remove their flags and cursors
    const newFlags = { ...state.activeFlags };
    Object.keys(newFlags).forEach((key) => {
      newFlags[key] = newFlags[key].filter((id) => id !== userId);
    });
    const newCursors = { ...state.liveCursors };
    delete newCursors[userId];
    
    return {
      teamMembers: state.teamMembers.filter(m => m.id !== userId),
      activeUserIds: state.activeUserIds.filter(id => id !== userId),
      activeFlags: newFlags,
      liveCursors: newCursors,
    };
  }),
}));
