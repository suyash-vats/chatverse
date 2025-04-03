
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { nanoid } from "nanoid";

type Room = {
  id: string;
  name: string;
  created_by: string;
  code: string;
  is_private: boolean;
  created_at: string;
};

type RoomMember = {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
  profiles: {
    username: string;
    avatar: string;
    status: string;
    is_online: boolean;
    last_seen: string | null;
  };
};

type Message = {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  status: string;
  created_at: string;
  profiles: {
    username: string;
    avatar: string;
  };
};

type RoomContextType = {
  rooms: Room[];
  currentRoom: Room | null;
  roomMembers: RoomMember[];
  messages: Message[];
  createRoom: (name: string, isPrivate: boolean) => Promise<Room | null>;
  joinRoomWithCode: (code: string) => Promise<boolean>;
  selectRoom: (roomId: string | null) => void;
  sendMessage: (content: string) => Promise<void>;
  loadingMessages: boolean;
  loadingRooms: boolean;
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [roomMembers, setRoomMembers] = useState<RoomMember[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(true);

  // Load user's rooms
  useEffect(() => {
    if (!user) {
      setRooms([]);
      setCurrentRoom(null);
      setRoomMembers([]);
      setMessages([]);
      return;
    }

    const fetchRooms = async () => {
      try {
        setLoadingRooms(true);
        const { data, error } = await supabase
          .from('room_members')
          .select('room_id')
          .eq('user_id', user.id);

        if (error) throw error;

        if (data.length > 0) {
          const roomIds = data.map(rm => rm.room_id);
          const { data: roomsData, error: roomsError } = await supabase
            .from('chat_rooms')
            .select('*')
            .in('id', roomIds);

          if (roomsError) throw roomsError;
          setRooms(roomsData || []);
        } else {
          setRooms([]);
        }
      } catch (error: any) {
        console.error('Error fetching rooms:', error.message);
        toast.error('Failed to load your chat rooms');
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
    setupRoomsSubscription();

    return () => {
      supabase.removeChannel(roomsChannel);
    };
  }, [user]);

  // Subscribe to room changes
  const roomsChannel = supabase
    .channel('room-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'room_members',
    }, (payload) => {
      if (user && payload.new && typeof payload.new === 'object' && 'user_id' in payload.new && payload.new.user_id === user.id) {
        if (payload.eventType === 'INSERT') {
          const roomId = 'room_id' in payload.new ? payload.new.room_id : undefined;
          if (roomId) {
            fetchRoom(roomId).then(room => {
              if (room) {
                setRooms(prev => [...prev, room]);
              }
            });
          }
        } else if (payload.eventType === 'DELETE' && payload.old && typeof payload.old === 'object' && 'room_id' in payload.old) {
          const oldRoomId = payload.old.room_id;
          setRooms(prev => prev.filter(r => r.id !== oldRoomId));
          if (currentRoom?.id === oldRoomId) {
            setCurrentRoom(null);
          }
        }
      }
    })
    .subscribe();

  const fetchRoom = async (roomId: string) => {
    const { data, error } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (error) {
      console.error('Error fetching room:', error.message);
      return null;
    }
    return data;
  };

  const setupRoomsSubscription = () => {
    // This function sets up real-time subscriptions as needed
  };

  // Load room members when a room is selected
  useEffect(() => {
    if (!currentRoom) {
      setRoomMembers([]);
      setMessages([]);
      return;
    }

    const fetchRoomMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('room_members')
          .select(`
            id,
            room_id,
            user_id,
            joined_at,
            profiles (
              username,
              avatar,
              status,
              is_online,
              last_seen
            )
          `)
          .eq('room_id', currentRoom.id);

        if (error) throw error;
        setRoomMembers(data || []);
      } catch (error: any) {
        console.error('Error fetching room members:', error.message);
      }
    };

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const { data, error } = await supabase
          .from('messages')
          .select(`
            id,
            room_id,
            sender_id,
            content,
            status,
            created_at,
            profiles (
              username,
              avatar
            )
          `)
          .eq('room_id', currentRoom.id)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error: any) {
        console.error('Error fetching messages:', error.message);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchRoomMembers();
    fetchMessages();
    setupMessagesSubscription();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [currentRoom]);

  // Subscribe to new messages
  const messagesChannel = supabase
    .channel('messages-channel')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: currentRoom ? `room_id=eq.${currentRoom.id}` : undefined,
    }, async (payload) => {
      if (!payload.new || !currentRoom || !('room_id' in payload.new) || payload.new.room_id !== currentRoom.id) return;

      // Fetch sender profile info
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, avatar')
        .eq('id', payload.new.sender_id)
        .single();

      const newMessage = {
        ...payload.new,
        profiles: profileData || { username: 'Unknown', avatar: '' }
      } as Message;

      setMessages(prev => [...prev, newMessage]);

      // Update message status to 'read' if it's from someone else
      if (user && payload.new.sender_id !== user.id) {
        await supabase
          .from('messages')
          .update({ status: 'read' })
          .eq('id', payload.new.id);
      }
    })
    .subscribe();

  const setupMessagesSubscription = () => {
    // This function sets up real-time subscriptions to messages
  };

  const createRoom = async (name: string, isPrivate: boolean) => {
    if (!user) {
      toast.error('You must be logged in to create a room');
      return null;
    }

    try {
      // Generate a random 6-character code
      const code = nanoid(6);

      const { data, error } = await supabase
        .from('chat_rooms')
        .insert([
          {
            name,
            created_by: user.id,
            code,
            is_private: isPrivate
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Add the creator as a member of the room
      await supabase
        .from('room_members')
        .insert([
          {
            room_id: data.id,
            user_id: user.id
          }
        ]);

      toast.success(`Room "${name}" created successfully`);
      toast.info(`Your room code is: ${code}`);

      return data;
    } catch (error: any) {
      toast.error(`Error creating room: ${error.message}`);
      return null;
    }
  };

  const joinRoomWithCode = async (code: string) => {
    if (!user) {
      toast.error('You must be logged in to join a room');
      return false;
    }

    try {
      // Find the room with this code
      const { data: roomData, error: roomError } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('code', code)
        .single();

      if (roomError) {
        toast.error('Invalid room code');
        return false;
      }

      // Check if user is already a member
      const { data: memberData, error: memberError } = await supabase
        .from('room_members')
        .select('*')
        .eq('room_id', roomData.id)
        .eq('user_id', user.id)
        .single();

      if (memberData) {
        toast.info('You are already a member of this room');
        setCurrentRoom(roomData);
        return true;
      }

      // Join the room
      const { error: joinError } = await supabase
        .from('room_members')
        .insert([
          {
            room_id: roomData.id,
            user_id: user.id
          }
        ]);

      if (joinError) throw joinError;

      toast.success(`You've joined "${roomData.name}"`);
      setCurrentRoom(roomData);
      return true;
    } catch (error: any) {
      console.error('Error joining room:', error.message);
      toast.error('Failed to join room');
      return false;
    }
  };

  const selectRoom = (roomId: string | null) => {
    if (!roomId) {
      setCurrentRoom(null);
      return;
    }

    const room = rooms.find(r => r.id === roomId);
    setCurrentRoom(room || null);
  };

  const sendMessage = async (content: string) => {
    if (!user || !currentRoom || !content.trim()) return;

    try {
      await supabase
        .from('messages')
        .insert([
          {
            room_id: currentRoom.id,
            sender_id: user.id,
            content: content.trim()
          }
        ]);
    } catch (error: any) {
      console.error('Error sending message:', error.message);
      toast.error('Failed to send message');
    }
  };

  return (
    <RoomContext.Provider value={{
      rooms,
      currentRoom,
      roomMembers,
      messages,
      createRoom,
      joinRoomWithCode,
      selectRoom,
      sendMessage,
      loadingMessages,
      loadingRooms
    }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
}
