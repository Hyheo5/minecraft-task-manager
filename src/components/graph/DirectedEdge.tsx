import { BaseEdge, EdgeProps, getStraightPath, useInternalNode } from '@xyflow/react';

export default function DirectedEdge({
  id,
  source,
  target,
  style = {},
  markerEnd,
}: EdgeProps) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

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

  const [edgePath] = getStraightPath({
    sourceX: finalSx,
    sourceY: finalSy,
    targetX: finalTx,
    targetY: finalTy,
  });

  return (
    <>
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
    </>
  );
}
