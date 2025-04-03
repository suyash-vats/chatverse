
import { useState } from "react";
import { useRoom } from "@/context/RoomContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";

export default function JoinRoomDialog() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { joinRoomWithCode } = useRoom();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    setError(null);
    setIsSubmitting(true);
    
    const success = await joinRoomWithCode(code);
    
    if (success) {
      setOpen(false);
      setCode("");
    } else {
      setError("Failed to join room. Please check your code and try again.");
    }
    
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-whatsapp-green">
          <UserPlus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Join a Chat Room</DialogTitle>
            <DialogDescription>
              Enter a room code to join an existing chat room
            </DialogDescription>
          </DialogHeader>
          <div className="my-6 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 p-2 text-sm rounded">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="room-code">Room Code</Label>
              <Input
                id="room-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter room code"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-whatsapp-green hover:bg-opacity-90"
              disabled={isSubmitting || !code.trim()}
            >
              {isSubmitting ? "Joining..." : "Join Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
