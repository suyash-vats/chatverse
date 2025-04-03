
import { useChat } from "@/context/ChatContext";
import type { Message } from "@/context/ChatContext";
import { formatMessageTime } from "@/utils/dateUtils";
import { Check, CheckCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type MessageBubbleProps = {
  message: Message;
};

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { user } = useAuth();
  const isFromMe = message.senderId === user?.id;

  const renderMessageStatus = () => {
    if (!isFromMe) return null;
    
    switch (message.status) {
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
    <div
      className={`flex ${isFromMe ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm ${
          isFromMe
            ? "bg-whatsapp-light rounded-tr-none"
            : "bg-white rounded-tl-none"
        }`}
      >
        <p className="text-sm break-words">{message.text}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs text-gray-500">
            {formatMessageTime(message.timestamp)}
          </span>
          {renderMessageStatus()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
