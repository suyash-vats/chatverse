
import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import ContactList from "./ContactList";
import ChatWindow from "./ChatWindow";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const ChatLayout = () => {
  const { currentUser, logout, selectedContact } = useChat();
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  
  if (!currentUser) return null;

  return (
    <div className="flex h-screen bg-whatsapp-gray">
      {/* Contacts sidebar */}
      <div 
        className={`${
          showSidebar ? "block" : "hidden"
        } md:block w-full md:w-1/3 lg:w-1/4 bg-white border-r`}
      >
        <div className="flex items-center justify-between p-4 bg-whatsapp-gray">
          <div className="flex items-center">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="ml-3 font-medium">{currentUser.name}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={logout}
            className="text-whatsapp-darkGray"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        <ContactList onSelectContact={() => isMobile && setShowSidebar(false)} />
      </div>
      
      {/* Chat window or empty state */}
      <div className={`${!showSidebar || !isMobile ? "block" : "hidden"} md:block flex-1`}>
        {selectedContact ? (
          <>
            {isMobile && (
              <div className="p-2 bg-whatsapp-gray">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowSidebar(true)}
                  className="text-whatsapp-darkGray"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            )}
            <ChatWindow />
          </>
        ) : (
          <div className="h-full flex items-center justify-center p-4">
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-700">Welcome to ChatterVerse</h3>
              <p className="mt-2 text-gray-600">Select a contact to start chatting</p>
              
              {isMobile && !showSidebar && (
                <Button 
                  onClick={() => setShowSidebar(true)} 
                  className="mt-4 bg-whatsapp-green hover:bg-opacity-90 text-white"
                >
                  Show Contacts
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
