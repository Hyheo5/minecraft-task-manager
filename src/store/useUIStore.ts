import { create } from 'zustand';

type UIState = {
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  isSettingsOpen: boolean;
  zoomLevel: number;
  setSelectedNodeId: (id: string | null) => void;
  setHoveredNodeId: (id: string | null) => void;
  setIsSettingsOpen: (isOpen: boolean) => void;
  setZoomLevel: (zoom: number) => void;
};

export const useUIStore = create<UIState>((set) => ({
  selectedNodeId: null,
  hoveredNodeId: null,
  isSettingsOpen: false,
  zoomLevel: 1,
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setHoveredNodeId: (id) => set({ hoveredNodeId: id }),
  setIsSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
}));
