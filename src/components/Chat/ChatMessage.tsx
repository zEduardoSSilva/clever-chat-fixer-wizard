import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
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
        "flex gap-4 p-6 max-w-[85%]",
        message.isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      <Avatar className="h-10 w-10 flex-shrink-0 shadow-md">
        <AvatarFallback
          className={cn(
            "font-medium border-2",
            message.isUser 
              ? "bg-gradient-primary text-primary-foreground border-primary/20" 
              : "bg-card text-card-foreground border-border/30"
          )}
        >
          {message.isUser ? (
            <User className="h-5 w-5" />
          ) : (
            <Bot className="h-5 w-5" />
          )}
        </AvatarFallback>
      </Avatar>
      
      <div
        className={cn(
          "rounded-3xl px-6 py-4 max-w-full break-words shadow-sm backdrop-blur-sm",
          message.isUser
            ? "bg-gradient-primary text-primary-foreground rounded-br-lg shadow-lg"
            : "bg-card/80 text-card-foreground border border-border/50 rounded-bl-lg"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
          {message.content}
        </p>
        <time className={cn(
          "text-xs mt-2 block opacity-70 font-medium",
          message.isUser ? "text-primary-foreground/80" : "text-muted-foreground"
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