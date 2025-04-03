
import { useState, useEffect, useRef } from "react";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Send, MoreVertical, Phone, Video } from "lucide-react";
import { formatDetailedTime, formatLastSeen, formatMessageTime } from "@/utils/dateUtils";
import MessageBubble from "./MessageBubble";

const ChatWindow = () => {
  const { currentUser, selectedContact, messages, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedContact]);
  
  if (!currentUser || !selectedContact) return null;
  
  const contactMessages = messages[selectedContact.id] || [];
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between p-3 bg-whatsapp-gray border-b">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={selectedContact.avatar}
              alt={selectedContact.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {selectedContact.isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </div>
          <div className="ml-3">
            <h2 className="font-medium">{selectedContact.name}</h2>
            <p className="text-xs text-gray-500">
              {selectedContact.isOnline
                ? "Online"
                : formatLastSeen(selectedContact.lastSeen)}
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
          <Button variant="ghost" size="icon" className="text-whatsapp-darkGray">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#efeae2] bg-opacity-30 bg-[url('https://i.imgur.com/Gg0LFrd.png')] bg-repeat">
        {contactMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>No messages yet</p>
              <p className="text-sm">Send a message to start the conversation</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {contactMessages.map((message, index) => {
              const showTimestamp = 
                index === 0 || 
                new Date(message.timestamp).getDate() !== 
                new Date(contactMessages[index - 1].timestamp).getDate();
              
              return (
                <div key={message.id}>
                  {showTimestamp && (
                    <div className="flex justify-center my-4">
                      <div className="bg-white bg-opacity-80 rounded-md px-3 py-1 text-xs text-gray-500">
                        {formatDetailedTime(message.timestamp)}
                      </div>
                    </div>
                  )}
                  <MessageBubble message={message} />
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-3 bg-whatsapp-gray flex items-center">
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 py-2 px-4 rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-whatsapp-green"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button 
          type="submit" 
          disabled={!newMessage.trim()} 
          className="ml-2 rounded-full bg-whatsapp-green hover:bg-opacity-90 text-white"
          size="icon"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;
