
import { useState } from "react";
import { useRoom } from "@/context/RoomContext";
import { Button } from "@/components/ui/button";
import { Send, Smile, Paperclip } from "lucide-react";

export default function MessageInput() {
  const [newMessage, setNewMessage] = useState("");
  const { sendMessage, currentRoom } = useRoom();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && currentRoom) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  if (!currentRoom) return null;

  return (
    <form onSubmit={handleSendMessage} className="p-3 bg-whatsapp-gray flex items-center">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-whatsapp-darkGray"
      >
        <Smile className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-whatsapp-darkGray mr-2"
      >
        <Paperclip className="h-5 w-5" />
      </Button>
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
  );
}
