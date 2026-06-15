import { useState } from 'react';
import { BaseEdge, EdgeProps, getStraightPath, useInternalNode, EdgeLabelRenderer } from '@xyflow/react';
import { useGraphStore } from '@/store/useGraphStore';
import { X } from 'lucide-react';

export default function DirectedEdge({
  id,
  source,
  target,
  style = {},
  markerEnd,
}: EdgeProps) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  const { deleteEdge } = useGraphStore();
  const [isHovered, setIsHovered] = useState(false);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const sx = sourceNode.internals.positionAbsolute.x + (sourceNode.measured?.width || 0) / 2;
  const sy = sourceNode.internals.positionAbsolute.y + (sourceNode.measured?.height || 0) / 2;
  const tx = targetNode.internals.positionAbsolute.x + (targetNode.measured?.width || 0) / 2;
  const ty = targetNode.internals.positionAbsolute.y + (targetNode.measured?.height || 0) / 2;

  const dx = tx - sx;
  const dy = ty - sy;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Offset to prevent the edge/arrow from overlapping the node center
  const targetRadius = 24;
  const sourceRadius = 24;

  let finalSx = sx;
  let finalSy = sy;
  let finalTx = tx;
  let finalTy = ty;

  if (distance > targetRadius + sourceRadius) {
    finalSx = sx + (dx / distance) * sourceRadius;
    finalSy = sy + (dy / distance) * sourceRadius;
    finalTx = tx - (dx / distance) * targetRadius;
    finalTy = ty - (dy / distance) * targetRadius;
  }

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX: finalSx,
    sourceY: finalSy,
    targetX: finalTx,
    targetY: finalTy,
  });

  return (
    <g
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Invisible wider path for easier hovering */}
      <path
        d={edgePath}
        fill="none"
        strokeOpacity={0}
        strokeWidth={20}
        className="react-flow__edge-interaction"
      />
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: '#525252',
        }}
      />
      {/* Optional: Add an animated dot along the path to show flow */}
      <circle r="4" fill="#A3A3A3">
        <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
      </circle>
      
      {isHovered && (
        <EdgeLabelRenderer>
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <button
              onClick={(event) => {
                event.stopPropagation();
                deleteEdge(id);
              }}
              className="w-5 h-5 bg-neutral-800 hover:bg-red-500/90 text-neutral-400 hover:text-white rounded-full flex items-center justify-center border border-neutral-600 transition-colors cursor-pointer shadow-md"
              title="Delete Edge"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </g>
  );
}
