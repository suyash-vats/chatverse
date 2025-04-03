
import { useChat } from "@/context/ChatContext";
import { formatMessageTime } from "@/utils/dateUtils";
import { Search } from "lucide-react";
import { useState } from "react";

type ContactListProps = {
  onSelectContact?: () => void;
};

const ContactList = ({ onSelectContact }: ContactListProps) => {
  const { contacts, selectContact, messages, selectedContact } = useChat();
  const [searchTerm, setSearchTerm] = useState("");
  
  const getLastMessage = (contactId: string) => {
    const contactMessages = messages[contactId] || [];
    return contactMessages.length > 0
      ? contactMessages[contactMessages.length - 1]
      : null;
  };
  
  const getUnreadCount = (contactId: string) => {
    const contactMessages = messages[contactId] || [];
    return contactMessages.filter(
      msg => msg.senderId === contactId && msg.status !== "read"
    ).length;
  };
  
  const filteredContacts = contacts.filter(contact =>
    contact.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100%-70px)]">
      {/* Search bar */}
      <div className="p-3 bg-white">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search or start new chat"
            className="pl-10 py-2 w-full bg-whatsapp-gray rounded-md focus:outline-none focus:ring-1 focus:ring-whatsapp-green"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Contacts list */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No contacts found</div>
        ) : (
          filteredContacts.map(contact => {
            const lastMessage = getLastMessage(contact.id);
            const unreadCount = getUnreadCount(contact.id);
            const isSelected = selectedContact?.id === contact.id;
            
            return (
              <div
                key={contact.id}
                className={`flex items-center p-3 border-b cursor-pointer hover:bg-gray-50 ${
                  isSelected ? "bg-gray-100" : ""
                }`}
                onClick={() => {
                  selectContact(contact);
                  onSelectContact?.();
                }}
              >
                <div className="relative">
                  <img
                    src={contact.avatar}
                    alt={contact.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {contact.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-medium truncate">{contact.username}</h3>
                    {lastMessage && (
                      <span className="text-xs text-gray-500">
                        {formatMessageTime(lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500 truncate max-w-[180px]">
                      {lastMessage
                        ? lastMessage.text
                        : contact.status || "Available"}
                    </p>
                    {unreadCount > 0 && (
                      <span className="ml-2 flex-shrink-0 bg-whatsapp-green rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ContactList;
