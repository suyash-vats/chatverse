
import { useEffect, useRef } from "react";
import { useRoom } from "@/context/RoomContext";
import { useAuth } from "@/context/AuthContext";
import { formatDetailedTime, formatMessageTime } from "@/utils/dateUtils";
import { Check, CheckCheck } from "lucide-react";

export default function MessageList() {
  const { messages, loadingMessages, currentRoom } = useRoom();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  if (loadingMessages) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin h-10 w-10 border-4 border-whatsapp-green border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }
  
  if (!currentRoom) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Select a chat room to start messaging</p>
        </div>
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>No messages yet</p>
          <p className="text-sm">Send a message to start the conversation</p>
        </div>
      </div>
    );
  }
  
  const renderMessageStatus = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-whatsapp-blue" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2 p-4">
      {messages.map((message, index) => {
        const isFromMe = message.sender_id === user?.id;
        const showTimestamp = 
          index === 0 || 
          new Date(message.created_at).getDate() !== 
          new Date(messages[index - 1].created_at).getDate();
          
        return (
          <div key={message.id}>
            {showTimestamp && (
              <div className="flex justify-center my-4">
                <div className="bg-white bg-opacity-80 rounded-md px-3 py-1 text-xs text-gray-500">
                  {formatDetailedTime(message.created_at)}
                </div>
              </div>
            )}
            
            <div className={`flex ${isFromMe ? "justify-end" : "justify-start"} mb-2`}>
              {!isFromMe && (
                <img
                  src={message.profiles.avatar}
                  alt={message.profiles.username}
                  className="w-8 h-8 rounded-full mr-2 self-end"
                />
              )}
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm ${
                  isFromMe
                    ? "bg-whatsapp-light rounded-tr-none"
                    : "bg-white rounded-tl-none"
                }`}
              >
                {!isFromMe && (
                  <p className="text-xs font-medium text-whatsapp-green mb-1">
                    {message.profiles.username}
                  </p>
                )}
                <p className="text-sm break-words">{message.content}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-xs text-gray-500">
                    {formatMessageTime(message.created_at)}
                  </span>
                  {isFromMe && renderMessageStatus(message.status)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
