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
  physicsEnabled: boolean;
  chargeStrength: number;
  linkDistance: number;
  gravityStrength: number;
  centralForceStrength: number;
  setPhysicsEnabled: (enabled: boolean) => void;
  setChargeStrength: (strength: number) => void;
  setLinkDistance: (distance: number) => void;
  setGravityStrength: (strength: number) => void;
  setCentralForceStrength: (strength: number) => void;
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
  physicsEnabled: false,
  chargeStrength: -800,
  linkDistance: 150,
  gravityStrength: 50,
  centralForceStrength: 0.05,
  setPhysicsEnabled: (enabled) => set({ physicsEnabled: enabled }),
  setChargeStrength: (strength) => set({ chargeStrength: strength }),
  setLinkDistance: (distance) => set({ linkDistance: distance }),
  setGravityStrength: (strength) => set({ gravityStrength: strength }),
  setCentralForceStrength: (strength) => set({ centralForceStrength: strength }),
}));
