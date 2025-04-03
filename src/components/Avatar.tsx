
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

export default function UserAvatar() {
  const { profile } = useAuth();
  
  if (!profile) return null;
  
  return (
    <Avatar>
      <AvatarImage src={profile.avatar} />
      <AvatarFallback>
        {profile.username.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
