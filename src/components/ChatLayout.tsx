
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRoom } from "@/context/RoomContext";
import RoomList from "./RoomList";
import ChatWindow from "./ChatWindow";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import UserAvatar from "./Avatar";

const ChatLayout = () => {
  const { profile, signOut } = useAuth();
  const { currentRoom } = useRoom();
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  
  if (!profile) return null;

  return (
    <div className="flex h-screen bg-whatsapp-gray">
      {/* Rooms sidebar */}
      <div 
        className={`${
          showSidebar ? "block" : "hidden"
        } md:block w-full md:w-1/3 lg:w-1/4 bg-white border-r`}
      >
        <div className="flex items-center justify-between p-4 bg-whatsapp-gray">
          <div className="flex items-center">
            <UserAvatar />
            <span className="ml-3 font-medium">{profile.username}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={signOut}
            className="text-whatsapp-darkGray"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        <RoomList />
      </div>
      
      {/* Chat window */}
      <div className={`${!showSidebar || !isMobile ? "block" : "hidden"} md:block flex-1`}>
        {isMobile && (
          <div className="p-2 bg-whatsapp-gray">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowSidebar(true)}
              className="text-whatsapp-darkGray"
              style={{ display: currentRoom ? "none" : "flex" }}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        )}
        <ChatWindow 
          showBackButton={isMobile && !!currentRoom} 
          onBackClick={() => setShowSidebar(true)} 
        />
      </div>
    </div>
  );
};

export default ChatLayout;
