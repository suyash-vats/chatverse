
import { useRoom } from "@/context/RoomContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatLastSeen } from "@/utils/dateUtils";

export default function RoomMembersDialog() {
  const { currentRoom, roomMembers } = useRoom();

  if (!currentRoom) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Room Members</h3>
        <p className="text-sm text-gray-500">
          {roomMembers.length} {roomMembers.length === 1 ? 'member' : 'members'}
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {roomMembers.map((member) => (
            <div key={member.id} className="flex items-center">
              <Avatar>
                <AvatarImage src={member.profiles.avatar} />
                <AvatarFallback>
                  {member.profiles.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-medium">{member.profiles.username}</p>
                <p className="text-xs text-gray-500">
                  {member.profiles.is_online 
                    ? "Online" 
                    : formatLastSeen(member.profiles.last_seen || "")}
                </p>
              </div>
              {member.profiles.is_online && (
                <div className="ml-auto">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block"></span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
