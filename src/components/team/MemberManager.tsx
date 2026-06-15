import { useMultiplayerStore } from '@/store/useMultiplayerStore';
import { useGraphStore } from '@/store/useGraphStore';
import { X } from 'lucide-react';

export default function MemberManager() {
  const { teamMembers, activeUserIds, activeFlags, removeUser, localUser } = useMultiplayerStore();
  const { nodes } = useGraphStore();

  return (
    <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2">
      <div className="bg-neutral-900/80 backdrop-blur-md rounded-xl shadow-2xl p-4 border border-neutral-800 w-56">
        <h3 className="text-white font-bold text-sm mb-3">Team</h3>
        <div className="flex flex-col gap-3">
          {teamMembers.map((member) => {
            const isActive = activeUserIds.includes(member.id) || member.id === localUser?.id;
            
            // Find what node they are working on
            let currentTask = '';
            for (const [nodeId, users] of Object.entries(activeFlags)) {
              if (users.includes(member.id)) {
                const node = nodes.find(n => n.id === nodeId);
                if (node) currentTask = node.data.title;
                break;
              }
            }

            return (
              <div key={member.id} className="flex items-center justify-between group">
                <div className={`flex items-center gap-3 p-1 rounded hover:bg-neutral-800 transition-colors cursor-pointer w-full ${!isActive ? 'opacity-50 grayscale' : ''}`}>
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-neutral-900 shadow-sm transition-transform group-hover:scale-110"
                    style={{ backgroundColor: member.flag_color }}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', member.id);
                      e.dataTransfer.effectAllowed = 'copyMove';
                    }}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm text-neutral-300 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                      {member.name} {member.id === localUser?.id && '(You)'}
                    </span>
                    {currentTask && (
                      <span className="text-[10px] text-neutral-500 whitespace-nowrap overflow-hidden text-ellipsis">
                        {currentTask}
                      </span>
                    )}
                  </div>
                </div>
                {!isActive && (
                  <button 
                    onClick={() => removeUser(member.id)}
                    className="text-neutral-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove user"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-neutral-500 mt-4 leading-tight">
          Drag a team member's icon onto a task to assign them.
        </p>
      </div>
    </div>
  );
}
