import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex gap-3 p-4 max-w-[80%]",
        message.isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback
          className={cn(
            "text-xs font-medium",
            message.isUser 
              ? "bg-chat-message-user text-chat-message-user-text" 
              : "bg-muted text-muted-foreground"
          )}
        >
          {message.isUser ? "EU" : "IA"}
        </AvatarFallback>
      </Avatar>
      
      <div
        className={cn(
          "rounded-2xl px-4 py-3 max-w-full break-words shadow-sm backdrop-blur-sm",
          message.isUser
            ? "bg-gradient-primary text-primary-foreground rounded-br-md shadow-lg"
            : "bg-card/80 text-card-foreground border border-border/50 rounded-bl-md"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <time className={cn(
          "text-xs mt-1 block opacity-70",
          message.isUser ? "text-chat-message-user-text" : "text-muted-foreground"
        )}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </time>
      </div>
    </div>
  );
}