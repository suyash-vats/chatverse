import { useRoom } from "@/context/RoomContext";
import { Button } from "@/components/ui/button";
import { Copy, Users } from "lucide-react";
import { toast } from "sonner";

export function RoomHeader() {
  const { currentRoom } = useRoom();

  if (!currentRoom) return null;

  const copyRoomCode = () => {
    navigator.clipboard.writeText(currentRoom.code);
    toast.success("Room code copied to clipboard!");
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">{currentRoom.name}</h2>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{currentRoom.member_count || 0} members</span>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={copyRoomCode}
        className="flex items-center gap-2"
      >
        <Copy className="w-4 h-4" />
        Copy Code
      </Button>
    </div>
  );
} 