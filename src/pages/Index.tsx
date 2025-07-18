import { useState } from "react";
import { ChatInterface } from "@/components/Chat/ChatInterface";
import { ChatSettings } from "@/components/Chat/ChatSettings";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Settings, MessageSquare } from "lucide-react";

const Index = () => {
  const [webhookUrl, setWebhookUrl] = useState("");

  return (
    <div className="min-h-screen bg-gradient-chat">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-primary">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Clever N8N Chat
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chat inteligente integrado com n8n para automações e respostas personalizadas
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="chat" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <ChatInterface 
              n8nWebhookUrl={webhookUrl}
              title="Assistente Inteligente" 
            />
          </TabsContent>

          <TabsContent value="settings">
            <ChatSettings 
              onWebhookUpdate={setWebhookUrl}
              currentWebhookUrl={webhookUrl}
            />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
            <Bot className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Powered by n8n automation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
