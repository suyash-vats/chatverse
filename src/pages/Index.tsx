
import { ChatProvider, useChat } from "@/context/ChatContext";
import ChatLayout from "@/components/ChatLayout";
import Login from "@/pages/Login";

const ChatApp = () => {
  const { currentUser } = useChat();
  
  return currentUser ? <ChatLayout /> : <Login />;
};

const Index = () => {
  return (
    <ChatProvider>
      <ChatApp />
    </ChatProvider>
  );
};

export default Index;
