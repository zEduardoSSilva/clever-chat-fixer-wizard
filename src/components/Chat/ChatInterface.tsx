import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Button } from "@/components/ui/button";
import { Trash2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  n8nWebhookUrl?: string;
  title?: string;
}

export function ChatInterface({ 
  n8nWebhookUrl = "", 
  title = "Chat Inteligente" 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Olá! Sou seu assistente inteligente. Como posso ajudá-lo hoje?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendToN8n = async (message: string): Promise<string> => {
    if (!n8nWebhookUrl) {
      throw new Error("URL do webhook n8n não configurada");
    }

    try {
      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          timestamp: new Date().toISOString(),
          userId: "user-" + Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response || data.message || "Resposta recebida com sucesso!";
    } catch (error) {
      console.error("Erro ao enviar mensagem para n8n:", error);
      throw error;
    }
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let botResponse: string;
      
      if (n8nWebhookUrl) {
        botResponse = await sendToN8n(content);
      } else {
        // Simulação de resposta quando não há webhook configurado
        await new Promise(resolve => setTimeout(resolve, 1000));
        botResponse = `Recebi sua mensagem: "${content}". Configure o webhook do n8n para respostas inteligentes!`;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Verifique se o webhook do n8n está configurado corretamente.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar com o n8n. Verifique a configuração do webhook.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        content: "Olá! Sou seu assistente inteligente. Como posso ajudá-lo hoje?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    toast({
      title: "Chat limpo",
      description: "Todas as mensagens foram removidas.",
    });
  };

  return (
    <Card className="flex flex-col h-[600px] max-w-2xl mx-auto shadow-lg border-chat-border bg-gradient-chat">
      <CardHeader className="flex-shrink-0 pb-3 border-b border-chat-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
            {title}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {!n8nWebhookUrl && (
          <p className="text-xs text-muted-foreground">
            Configure o webhook do n8n para ativar respostas inteligentes
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0 bg-chat-background">
        <div className="h-full overflow-y-auto scroll-smooth">
          <div className="py-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex gap-3 p-4 max-w-[80%] mr-auto">
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse flex-shrink-0" />
                <div className="bg-chat-message-bot border border-chat-border rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </CardContent>

      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={false}
        isLoading={isLoading}
      />
    </Card>
  );
}