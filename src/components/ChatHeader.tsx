
import { useAuth } from "@/context/AuthContext";
import { useRoom } from "@/context/RoomContext";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, 
  Phone, 
  Users, 
  Video,
  ArrowLeft
} from "lucide-react";
import RoomMembersDialog from "./RoomMembersDialog";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type ChatHeaderProps = {
  showBackButton?: boolean;
  onBackClick?: () => void;
};

export default function ChatHeader({ showBackButton, onBackClick }: ChatHeaderProps) {
  const { currentRoom } = useRoom();
  const [showRoomMembers, setShowRoomMembers] = useState(false);
  
  if (!currentRoom) return null;
  
  return (
    <div className="flex items-center justify-between p-3 bg-whatsapp-gray border-b">
      <div className="flex items-center">
        {showBackButton && (
          <Button variant="ghost" size="icon" className="mr-2" onClick={onBackClick}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="bg-whatsapp-green text-white rounded-full w-10 h-10 flex items-center justify-center">
          <span className="text-lg font-medium">
            {currentRoom.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="ml-3">
          <h2 className="font-medium">{currentRoom.name}</h2>
          <p className="text-xs text-gray-500">
            Room Code: {currentRoom.code}
          </p>
        </div>
      </div>
      <div className="flex">
        <Button variant="ghost" size="icon" className="text-whatsapp-darkGray">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-whatsapp-darkGray">
          <Video className="h-5 w-5" />
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-whatsapp-darkGray">
              <Users className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <RoomMembersDialog />
          </SheetContent>
        </Sheet>
        <Button variant="ghost" size="icon" className="text-whatsapp-darkGray">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
