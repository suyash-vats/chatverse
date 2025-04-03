
import { useRoom } from "@/context/RoomContext";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import CreateRoomDialog from "./CreateRoomDialog";
import JoinRoomDialog from "./JoinRoomDialog";

export default function RoomList() {
  const { rooms, currentRoom, selectRoom, loadingRooms } = useRoom();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => 
      room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rooms, searchTerm]);

  return (
    <div className="flex flex-col h-[calc(100%-70px)]">
      <div className="p-3 bg-white flex items-center justify-between">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search rooms"
            className="pl-10 py-2 w-full bg-whatsapp-gray rounded-md focus:outline-none focus:ring-1 focus:ring-whatsapp-green"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex ml-2">
          <CreateRoomDialog />
          <JoinRoomDialog />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {loadingRooms ? (
          <div className="p-4 text-center">
            <div className="inline-block animate-spin h-6 w-6 border-2 border-whatsapp-green border-t-transparent rounded-full"></div>
            <p className="mt-2 text-gray-500">Loading your rooms...</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No rooms found</p>
            <p className="text-sm mt-1">Create or join a room to start chatting</p>
          </div>
        ) : (
          filteredRooms.map(room => (
            <div
              key={room.id}
              className={`flex items-center p-3 border-b cursor-pointer hover:bg-gray-50 ${
                currentRoom?.id === room.id ? "bg-gray-100" : ""
              }`}
              onClick={() => selectRoom(room.id)}
            >
              <div className="bg-whatsapp-green text-white rounded-full w-12 h-12 flex items-center justify-center">
                <span className="text-lg font-medium">
                  {room.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-medium truncate">{room.name}</h3>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500 truncate max-w-[180px]">
                    {room.is_private ? "Private room" : "Public room"}
                  </p>
                  <span className="ml-2 text-xs text-gray-500">
                    Code: {room.code}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
