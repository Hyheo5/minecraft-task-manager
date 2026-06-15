import { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { CustomNodeData } from '@/types';
import { useMultiplayerStore } from '@/store/useMultiplayerStore';

function PieChartNode({ id, data }: NodeProps<Node<CustomNodeData>>) {
  const { teamMembers, activeFlags, updateFlags } = useMultiplayerStore();
  
  // Calculate SVG stroke-dasharray for pie chart
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (data.progress / 100) * circumference;

  const activeUserIds = activeFlags[id] || [];
  const activeUsers = activeUserIds
    .map((userId) => teamMembers.find((m) => m.id === userId))
    .filter(Boolean);

  return (
    <div 
      className="relative flex items-center group cursor-pointer bg-neutral-900/90 backdrop-blur-md border border-neutral-700/50 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:border-neutral-500 py-1.5 px-2 pr-4"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }}
      onDrop={(e) => {
        e.preventDefault();
        const userId = e.dataTransfer.getData('text/plain');
        const { localUser, setMyFlag } = useMultiplayerStore.getState();
        if (userId) {
          if (localUser && userId === localUser.id) {
            setMyFlag(id);
          } else {
            updateFlags(userId, id);
          }
        }
      }}
    >
      <Handle type="target" position={Position.Left} className="opacity-0 group-hover:opacity-100 -ml-1" />
      
      {/* Node Circle (Small Pie Chart) */}
      <div className="relative flex items-center justify-center w-8 h-8 rounded-full overflow-visible shrink-0">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          {/* Background circle */}
          <circle
            cx="16"
            cy="16"
            r={radius}
            fill="transparent"
            stroke="#262626"
            strokeWidth="3"
          />
          {/* Progress circle */}
          <circle
            cx="16"
            cy="16"
            r={radius}
            fill="transparent"
            stroke="#4ADE80" // Green for progress
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>

        {/* Inner Content (percentage) */}
        <div className="absolute inset-0 flex items-center justify-center text-[8px] font-semibold text-white">
          {Math.round(data.progress)}%
        </div>
      </div>

      {/* Node Title */}
      <div className="ml-2 text-sm font-medium text-neutral-100 max-w-[200px] break-words">
        {data.title}
      </div>

      {/* Team Flags */}
      {activeUsers.length > 0 && (
        <div className="absolute -top-2 -right-2 flex -space-x-1.5 z-20">
          {activeUsers.map((user) => (
            <div
              key={user!.id}
              className="w-5 h-5 rounded-full border border-neutral-800 flex items-center justify-center text-[9px] font-bold text-neutral-900 shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
              style={{ backgroundColor: user!.flag_color }}
              title={user!.name}
              draggable
              onDragStart={(e) => {
                e.stopPropagation();
                e.dataTransfer.setData('text/plain', user!.id);
                e.dataTransfer.effectAllowed = 'move';
              }}
            >
              {user!.name.charAt(0)}
            </div>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Right} className="opacity-0 group-hover:opacity-100 -mr-1" />
    </div>
  );
}

export default memo(PieChartNode);
