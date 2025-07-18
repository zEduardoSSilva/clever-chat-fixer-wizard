import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function ChatInput({ onSendMessage, disabled, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 bg-gradient-to-t from-background/80 to-transparent backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <div className="bg-card/90 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              disabled={disabled || isLoading}
              className={cn(
                "min-h-[56px] max-h-32 resize-none border-0 bg-transparent px-4 py-4 pr-16",
                "focus:ring-0 focus:outline-none placeholder:text-muted-foreground/60",
                "rounded-2xl"
              )}
              rows={1}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!message.trim() || disabled || isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 p-0 bg-gradient-primary hover:opacity-90 rounded-xl shadow-md"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}