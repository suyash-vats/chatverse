
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { nanoid } from "nanoid";
import { toast } from "sonner";

// Define the allowed message status types
type MessageStatus = "sent" | "delivered" | "read";

// Message type definition
type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  status: MessageStatus;
};

// User type definition
type User = {
  id: string;
  username: string;
  avatar: string;
  status: string;
  lastSeen: string;
  isOnline: boolean;
};

// Chat context type definition
type ChatContextType = {
  user: User | null;
  contacts: User[];
  messages: Record<string, Message[]>;
  activeContact: User | null;
  login: (username: string) => void;
  sendMessage: (text: string) => void;
  setActiveContact: (contact: User | null) => void;
  loading: boolean;
};

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Sample contacts data
const sampleContacts: User[] = [
  {
    id: "1",
    username: "Alice Smith",
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=Alice",
    status: "Just landed in Paris! ✈️",
    lastSeen: new Date().toISOString(),
    isOnline: true,
  },
  {
    id: "2",
    username: "Bob Johnson",
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=Bob",
    status: "At the gym 💪",
    lastSeen: new Date(Date.now() - 15 * 60000).toISOString(),
    isOnline: false,
  },
  {
    id: "3",
    username: "Charlie Brown",
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=Charlie",
    status: "Working from home today",
    lastSeen: new Date(Date.now() - 2 * 3600000).toISOString(),
    isOnline: true,
  },
  {
    id: "4",
    username: "Diana Prince",
    avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=Diana",
    status: "Do not disturb",
    lastSeen: new Date(Date.now() - 30 * 60000).toISOString(),
    isOnline: true,
  },
];

// Sample messages data
const generateSampleMessages = (userId: string): Record<string, Message[]> => {
  const result: Record<string, Message[]> = {};
  
  sampleContacts.forEach((contact) => {
    const messages: Message[] = [];
    // Generate 1-5 messages for each contact
    const count = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < count; i++) {
      const isFromUser = Math.random() > 0.5;
      messages.push({
        id: nanoid(),
        senderId: isFromUser ? userId : contact.id,
        receiverId: isFromUser ? contact.id : userId,
        text: `Sample message ${i + 1}`,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        status: "read" as MessageStatus,
      });
    }
    
    // Sort messages by timestamp
    messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    result[contact.id] = messages;
  });
  
  return result;
};

// Provider component
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<User[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [activeContact, setActiveContact] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem("chatUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setContacts(sampleContacts);
      setMessages(generateSampleMessages(parsedUser.id));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (username: string) => {
    const newUser: User = {
      id: nanoid(),
      username,
      avatar: `https://api.dicebear.com/6.x/avataaars/svg?seed=${username}`,
      status: "Hey there! I'm using ChatterVerse",
      lastSeen: new Date().toISOString(),
      isOnline: true,
    };
    
    setUser(newUser);
    localStorage.setItem("chatUser", JSON.stringify(newUser));
    setContacts(sampleContacts);
    setMessages(generateSampleMessages(newUser.id));
  };

  // Send message function
  const sendMessage = (text: string) => {
    if (!user || !activeContact) return;
    
    const newMessage: Message = {
      id: nanoid(),
      senderId: user.id,
      receiverId: activeContact.id,
      text,
      timestamp: new Date().toISOString(),
      status: "sent" as MessageStatus,
    };
    
    setMessages((prev) => {
      const contactMessages = prev[activeContact.id] || [];
      return {
        ...prev,
        [activeContact.id]: [...contactMessages, newMessage],
      };
    });
    
    // Simulate reply after 1-3 seconds
    setTimeout(() => {
      const reply: Message = {
        id: nanoid(),
        senderId: activeContact.id,
        receiverId: user.id,
        text: `Reply to: ${text}`,
        timestamp: new Date().toISOString(),
        status: "sent" as MessageStatus,
      };
      
      setMessages((prev) => {
        const contactMessages = prev[activeContact.id] || [];
        return {
          ...prev,
          [activeContact.id]: [...contactMessages, reply],
        };
      });
      
      toast.info(`New message from ${activeContact.username}`);
    }, 1000 + Math.random() * 2000);
  };

  // Context value
  const value = {
    user,
    contacts,
    messages,
    activeContact,
    login,
    sendMessage,
    setActiveContact,
    loading,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// Custom hook to use the chat context
export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
