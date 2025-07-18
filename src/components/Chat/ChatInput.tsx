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
    <div className="p-6 bg-gradient-to-t from-background/90 to-transparent backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <div className="flex-1 relative">
          <div className="bg-card/95 backdrop-blur-sm rounded-3xl border border-border/30 shadow-xl">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              disabled={disabled || isLoading}
              className={cn(
                "min-h-[60px] max-h-32 resize-none border-0 bg-transparent px-6 py-5 pr-20",
                "focus:ring-0 focus:outline-none placeholder:text-muted-foreground/60",
                "rounded-3xl text-base font-medium"
              )}
              rows={1}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!message.trim() || disabled || isLoading}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 p-0 bg-gradient-primary hover:opacity-90 rounded-2xl shadow-lg transition-all duration-200 hover:scale-105"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Send className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}