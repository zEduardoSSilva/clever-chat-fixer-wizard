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
    <div className="flex h-screen w-80 flex-col bg-sidebar border-r border-sidebar-border/50 shadow-xl shadow-black/10">
      {/* Header */}
      <div className="flex flex-col p-6 border-b border-sidebar-border/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-primary shadow-lg">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-sidebar-foreground">
            Clever AI Chat
          </h1>
        </div>
        <Button 
          onClick={onNewChat}
          className="w-full justify-start gap-3 h-12 bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-accent-foreground rounded-2xl font-medium transition-all duration-200 hover:scale-[1.02]"
        >
          <Plus className="h-5 w-5" />
          Nova Conversa
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2 py-4">
          {conversations.length === 0 ? (
            <div className="text-center text-sidebar-muted py-8">
              <Bot className="h-8 w-8 mx-auto mb-2 text-sidebar-muted" />
              <p className="text-sm">Nenhuma conversa ainda</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                  activeConversationId === conversation.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md"
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
                    className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive rounded-xl transition-all duration-200"
                    onClick={(e) => handleDeleteConversation(e, conversation.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-6 border-t border-sidebar-border/30">
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={onOpenSettings}
            className="w-full justify-start gap-3 h-12 text-sidebar-foreground hover:bg-sidebar-accent rounded-2xl font-medium transition-all duration-200 hover:scale-[1.02]"
          >
            <Settings className="h-5 w-5" />
            Configurações
          </Button>
        </div>
      </div>
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}