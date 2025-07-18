import { useState } from "react";
import { ChatInterface } from "@/components/Chat/ChatInterface";
import { ChatSettings } from "@/components/Chat/ChatSettings";
import { AppSidebar } from "@/components/AppSidebar";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

const Index = () => {
  const [webhookUrl, setWebhookUrl] = useState("https://investz.app.n8n.cloud/webhook/WorkFlow");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const createNewConversation = (): string => {
    const newId = Date.now().toString();
    const newConversation: Conversation = {
      id: newId,
      title: "Nova Conversa",
      lastMessage: "Conversa iniciada",
      timestamp: new Date(),
      messages: [{
        id: "welcome",
        content: "Olá! Sou seu assistente inteligente. Como posso ajudá-lo hoje?",
        isUser: false,
        timestamp: new Date(),
      }],
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newId);
    return newId;
  };

  const handleNewChat = () => {
    createNewConversation();
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(undefined);
    }
  };

  const updateConversationTitle = (id: string, firstMessage: string) => {
    const title = firstMessage.length > 30 
      ? firstMessage.substring(0, 30) + "..." 
      : firstMessage;
    
    setConversations(prev => prev.map(conv => 
      conv.id === id ? { ...conv, title } : conv
    ));
  };

  // Se não há conversa ativa e existem conversas, selecionar a primeira
  // Se não há conversas, criar uma nova
  if (!activeConversationId) {
    if (conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    } else {
      createNewConversation();
    }
  }

  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen">
        {/* Sidebar */}
        <AppSidebar
          onNewChat={handleNewChat}
          onOpenSettings={() => setIsSettingsOpen(true)}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <ChatInterface 
              key={activeConversationId}
              n8nWebhookUrl={webhookUrl}
              title={activeConversation.title}
              initialMessages={activeConversation.messages}
              onMessagesChange={(messages) => {
                setConversations(prev => prev.map(conv => 
                  conv.id === activeConversationId 
                    ? { 
                        ...conv, 
                        messages,
                        lastMessage: messages[messages.length - 1]?.content || "Conversa iniciada",
                        timestamp: new Date()
                      } 
                    : conv
                ));
                
                // Atualizar título baseado na primeira mensagem do usuário
                const firstUserMessage = messages.find(m => m.isUser);
                if (firstUserMessage && activeConversation.title === "Nova Conversa") {
                  updateConversationTitle(activeConversationId!, firstUserMessage.content);
                }
              }}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">Selecione uma conversa ou crie uma nova</p>
            </div>
          )}
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-2xl">
          <ChatSettings 
            onWebhookUpdate={setWebhookUrl}
            currentWebhookUrl={webhookUrl}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
