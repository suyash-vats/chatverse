
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { nanoid } from "nanoid";

// Types
export type User = {
  id: string;
  name: string;
  avatar: string;
  status: string;
  isOnline: boolean;
  lastSeen?: string;
};

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
};

export type Contact = User;

type ChatContextType = {
  currentUser: User | null;
  contacts: Contact[];
  messages: Record<string, Message[]>;
  selectedContact: Contact | null;
  login: (username: string) => void;
  logout: () => void;
  selectContact: (contact: Contact) => void;
  sendMessage: (text: string) => void;
  markMessageAsRead: (messageId: string) => void;
};

// Create initial mock data
const mockUsers: User[] = [
  {
    id: "user1",
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    status: "Available",
    isOnline: true,
  },
  {
    id: "user2",
    name: "Jane Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    status: "At work",
    isOnline: true,
  },
  {
    id: "user3",
    name: "Mike Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    status: "Busy",
    isOnline: false,
    lastSeen: "Today at 14:30",
  },
  {
    id: "user4",
    name: "Sarah Williams",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    status: "Hey there! I'm using ChatterVerse",
    isOnline: true,
  },
  {
    id: "user5",
    name: "David Brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    status: "In a meeting",
    isOnline: false,
    lastSeen: "Yesterday",
  },
];

// Initial messages
const initialMessages: Record<string, Message[]> = {
  user1: [
    {
      id: "msg1",
      senderId: "user1",
      receiverId: "currentUser",
      text: "Hey there! How are you?",
      timestamp: "2023-04-03T10:30:00",
      status: "read",
    },
    {
      id: "msg2",
      senderId: "currentUser",
      receiverId: "user1",
      text: "I'm good! How about you?",
      timestamp: "2023-04-03T10:32:00",
      status: "read",
    },
    {
      id: "msg3",
      senderId: "user1",
      receiverId: "currentUser",
      text: "Doing great! Just wanted to check in.",
      timestamp: "2023-04-03T10:33:00",
      status: "read",
    },
  ],
  user2: [
    {
      id: "msg4",
      senderId: "user2",
      receiverId: "currentUser",
      text: "Hello! Did you get the documents I sent?",
      timestamp: "2023-04-02T15:20:00",
      status: "read",
    },
    {
      id: "msg5",
      senderId: "currentUser",
      receiverId: "user2",
      text: "Yes, I got them. Thanks!",
      timestamp: "2023-04-02T15:22:00",
      status: "delivered",
    },
  ],
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>(mockUsers);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Login function
  const login = (username: string) => {
    const user: User = {
      id: "currentUser",
      name: username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      status: "Online",
      isOnline: true,
    };
    setCurrentUser(user);
    toast.success(`Welcome, ${username}!`);
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setSelectedContact(null);
    toast.info("You've been logged out");
  };

  // Select contact
  const selectContact = (contact: Contact) => {
    setSelectedContact(contact);
    
    // Mark messages from this contact as read
    if (messages[contact.id]) {
      const updatedMessages = { ...messages };
      updatedMessages[contact.id] = updatedMessages[contact.id].map(msg => 
        msg.senderId === contact.id && msg.status !== "read" 
          ? { ...msg, status: "read" } 
          : msg
      );
      setMessages(updatedMessages);
    }
  };

  // Send message
  const sendMessage = (text: string) => {
    if (!currentUser || !selectedContact || !text.trim()) return;

    const newMessage: Message = {
      id: nanoid(),
      senderId: "currentUser",
      receiverId: selectedContact.id,
      text,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    setMessages(prev => {
      const contactMessages = prev[selectedContact.id] || [];
      return {
        ...prev,
        [selectedContact.id]: [...contactMessages, newMessage],
      };
    });

    // Simulate message delivery after a short delay
    setTimeout(() => {
      setMessages(prev => {
        const updatedContactMessages = prev[selectedContact.id].map(msg =>
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
        );
        return {
          ...prev,
          [selectedContact.id]: updatedContactMessages,
        };
      });
    }, 1000);

    // Simulate reply for demo purposes
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const replies = [
          "Got it, thanks!",
          "I'll check and get back to you",
          "Sounds good!",
          "Nice! 👍",
          "Interesting...",
          "Thank you for letting me know",
          "I appreciate that",
        ];
        
        const replyMessage: Message = {
          id: nanoid(),
          senderId: selectedContact.id,
          receiverId: "currentUser",
          text: replies[Math.floor(Math.random() * replies.length)],
          timestamp: new Date().toISOString(),
          status: "delivered",
        };

        setMessages(prev => {
          const contactMessages = prev[selectedContact.id] || [];
          return {
            ...prev,
            [selectedContact.id]: [...contactMessages, replyMessage],
          };
        });
      }, 2000 + Math.random() * 3000);
    }
  };

  // Mark message as read
  const markMessageAsRead = (messageId: string) => {
    if (!selectedContact) return;
    
    setMessages(prev => {
      const updatedContactMessages = prev[selectedContact.id].map(msg =>
        msg.id === messageId ? { ...msg, status: "read" } : msg
      );
      return {
        ...prev,
        [selectedContact.id]: updatedContactMessages,
      };
    });
  };

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        contacts,
        messages,
        selectedContact,
        login,
        logout,
        selectContact,
        sendMessage,
        markMessageAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
