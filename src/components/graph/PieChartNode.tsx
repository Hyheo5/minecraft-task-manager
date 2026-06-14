import { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { CustomNodeData } from '@/types';
import { useMultiplayerStore } from '@/store/useMultiplayerStore';

function PieChartNode({ id, data }: NodeProps<Node<CustomNodeData>>) {
  const { teamMembers, activeFlags, updateFlags } = useMultiplayerStore();
  
  // Calculate SVG stroke-dasharray for pie chart
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (data.progress / 100) * circumference;

  const activeUserIds = activeFlags[id] || [];
  const activeUsers = activeUserIds
    .map((userId) => teamMembers.find((m) => m.id === userId))
    .filter(Boolean);

  return (
    <div 
      className="relative flex flex-col items-center group cursor-pointer"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }}
      onDrop={(e) => {
        e.preventDefault();
        const userId = e.dataTransfer.getData('text/plain');
        if (userId) {
          updateFlags(userId, id);
        }
      }}
    >
      <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100" />
      
      {/* Node Circle (Pie Chart) */}
      <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-neutral-900 border-2 border-neutral-700 shadow-xl overflow-visible transition-transform hover:scale-110">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          {/* Background circle */}
          <circle
            cx="30"
            cy="30"
            r={radius}
            fill="transparent"
            stroke="#262626"
            strokeWidth="4"
          />
          {/* Progress circle */}
          <circle
            cx="30"
            cy="30"
            r={radius}
            fill="transparent"
            stroke="#4ADE80" // Green for progress
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>

        {/* Inner Content (e.g., icon or percentage) */}
        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
          {Math.round(data.progress)}%
        </div>

        {/* Team Flags */}
        {activeUsers.length > 0 && (
          <div className="absolute -top-3 -right-3 flex -space-x-2">
            {activeUsers.map((user) => (
              <div
                key={user!.id}
                className="w-6 h-6 rounded-full border-2 border-neutral-900 flex items-center justify-center text-[10px] font-bold text-neutral-900"
                style={{ backgroundColor: user!.flag_color }}
                title={user!.name}
              >
                {user!.name.charAt(0)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Node Title */}
      <div className="mt-2 px-3 py-1 bg-neutral-800/80 backdrop-blur-sm rounded-full text-xs font-medium text-white shadow max-w-[120px] text-center truncate">
        {data.title}
      </div>

      <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100" />
    </div>
  );
}

export default memo(PieChartNode);
