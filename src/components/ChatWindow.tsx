
import { useRoom } from "@/context/RoomContext";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

type ChatWindowProps = {
  showBackButton?: boolean;
  onBackClick?: () => void;
};

export default function ChatWindow({ showBackButton, onBackClick }: ChatWindowProps) {
  const { currentRoom } = useRoom();
  
  if (!currentRoom) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-700">Welcome to ChatterVerse</h3>
          <p className="mt-2 text-gray-600">Select a room to start chatting or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader showBackButton={showBackButton} onBackClick={onBackClick} />
      
      <div className="flex-1 overflow-y-auto bg-[#efeae2] bg-opacity-30 bg-[url('https://i.imgur.com/Gg0LFrd.png')] bg-repeat">
        <MessageList />
      </div>
      
      <MessageInput />
    </div>
  );
}
