import { useState } from "react";
import { Bot, Settings, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useModernToast } from "@/hooks/use-modern-toast";

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface AppSidebarProps {
  onNewChat: () => void;
  onOpenSettings: () => void;
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

export function AppSidebar({
  onNewChat,
  onOpenSettings,
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
}: AppSidebarProps) {
  const { showToast, ToastContainer } = useModernToast();

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteConversation(id);
    showToast({
      title: "Conversa excluída",
      description: "A conversa foi removida do histórico.",
      variant: "success",
    });
  };

  return (
    <div className="flex h-screen w-80 flex-col bg-sidebar border-r border-sidebar-border shadow-2xl shadow-black/20">
      {/* Header */}
      <div className="flex flex-col p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-sidebar-foreground">
            Clever N8N Chat
          </h1>
        </div>
        <Button 
          onClick={onNewChat}
          className="w-full justify-start gap-2 bg-sidebar-accent hover:bg-sidebar-accent/80"
        >
          <Plus className="h-4 w-4" />
          Nova Conversa
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {conversations.length === 0 ? (
            <div className="text-center text-sidebar-muted py-8">
              <Bot className="h-8 w-8 mx-auto mb-2 text-sidebar-muted" />
              <p className="text-sm">Nenhuma conversa ainda</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                  activeConversationId === conversation.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate mb-1">
                      {conversation.title}
                    </h3>
                    <p className="text-xs text-sidebar-muted truncate">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-sidebar-muted mt-1">
                      {conversation.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => handleDeleteConversation(e, conversation.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={onOpenSettings}
            className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Settings className="h-4 w-4" />
            Configurações
          </Button>
        </div>
      </div>
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}