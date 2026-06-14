import { useGraphStore } from '@/store/useGraphStore';
import { useUIStore } from '@/store/useUIStore';
import { useReactFlow } from '@xyflow/react';
import { useEffect, useState } from 'react';

export default function HoverPopover() {
  const { hoveredNodeId } = useUIStore();
  const { nodes } = useGraphStore();
  const { flowToScreenPosition } = useReactFlow();
  
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  const hoveredNode = nodes.find((n) => n.id === hoveredNodeId);

  useEffect(() => {
    if (hoveredNode) {
      // Calculate screen position for the popover
      const { x, y } = flowToScreenPosition({
        x: hoveredNode.position.x + 80, // Offset to the right
        y: hoveredNode.position.y,
      });
      setPosition({ x, y });
    } else {
      setPosition(null);
    }
  }, [hoveredNode, flowToScreenPosition]);

  if (!hoveredNode || !position) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none w-64 bg-neutral-900/90 backdrop-blur-md border border-neutral-700 rounded-lg shadow-2xl p-4 text-white transform -translate-y-1/2"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <h3 className="font-bold text-sm truncate">{hoveredNode.data.title}</h3>
      <p className="text-xs text-neutral-400 mt-1 line-clamp-3">
        {hoveredNode.data.description || 'No description provided.'}
      </p>
      
      <div className="mt-3 flex items-center justify-between text-xs font-medium">
        <span className="text-neutral-500">Progress</span>
        <span className="text-green-400">{Math.round(hoveredNode.data.progress)}%</span>
      </div>
      
      {/* Visual Progress Bar */}
      <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-1 overflow-hidden">
        <div 
          className="h-full bg-green-500 transition-all"
          style={{ width: `${hoveredNode.data.progress}%` }}
        />
      </div>
    </div>
  );
}
