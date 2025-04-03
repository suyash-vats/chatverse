
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";

export function formatMessageTime(timestamp: string) {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return format(date, "HH:mm");
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else {
    return format(date, "MMM d");
  }
}

export function formatDetailedTime(timestamp: string) {
  const date = new Date(timestamp);
  return format(date, "MMM d, yyyy 'at' HH:mm");
}

export function formatLastSeen(timestamp?: string) {
  if (!timestamp) return "Offline";
  
  const date = new Date(timestamp);
  if (isToday(date)) {
    return `Last seen today at ${format(date, "HH:mm")}`;
  } else if (isYesterday(date)) {
    return `Last seen yesterday at ${format(date, "HH:mm")}`;
  } else {
    return `Last seen ${formatDistanceToNow(date, { addSuffix: true })}`;
  }
}
