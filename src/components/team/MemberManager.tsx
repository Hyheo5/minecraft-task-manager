import { useMultiplayerStore } from '@/store/useMultiplayerStore';

export default function MemberManager() {
  const { teamMembers } = useMultiplayerStore();

  return (
    <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2">
      <div className="bg-neutral-900/80 backdrop-blur-md rounded-xl shadow-2xl p-4 border border-neutral-800 w-48">
        <h3 className="text-white font-bold text-sm mb-3">Team</h3>
        <div className="flex flex-col gap-2">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-3 p-1 rounded hover:bg-neutral-800 transition-colors cursor-pointer group">
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
              <span className="text-sm text-neutral-300 font-medium">{member.name}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-neutral-500 mt-4 leading-tight">
          Drag a team member's icon onto a task to assign them.
        </p>
      </div>
    </div>
  );
}
