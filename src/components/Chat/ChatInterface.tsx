import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Button } from "@/components/ui/button";
import { Trash2, Settings, Bot } from "lucide-react";
import { useModernToast } from "@/hooks/use-modern-toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  n8nWebhookUrl?: string;
  title?: string;
  initialMessages?: Message[];
  onMessagesChange?: (messages: Message[]) => void;
}

export function ChatInterface({ 
  n8nWebhookUrl = "", 
  title = "Chat Inteligente",
  initialMessages,
  onMessagesChange
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages || [
      {
        id: "welcome",
        content: "Olá! Sou seu assistente inteligente. Como posso ajudá-lo hoje?",
        isUser: false,
        timestamp: new Date(),
      },
    ]
  );
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast, ToastContainer } = useModernToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    onMessagesChange?.(messages);
  }, [messages, onMessagesChange]);

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

      // Verificar se a resposta tem conteúdo antes de tentar fazer parse
      const rawResponseText = await response.text();
      if (!rawResponseText.trim()) {
        return "Webhook retornou resposta vazia. Verifique a configuração do n8n.";
      }

      let data;
      try {
        data = JSON.parse(rawResponseText);
      } catch (parseError) {
        console.log("Resposta do webhook não é JSON válido:", rawResponseText);
        return rawResponseText; // Retorna o texto puro se não for JSON
      }
      
      // Processar diferentes formatos de resposta do n8n
      let processedResponse = "";
      
      if (data.response) {
        // Formato padrão: {"response": "texto"}
        processedResponse = data.response;
      } else if (data.output) {
        // Formato do seu n8n: {"output": {...}}
        if (data.output.Resumo) {
          processedResponse = data.output.Resumo;
        } else if (data.output.Descricao) {
          processedResponse = data.output.Descricao;
        } else {
          // Se não tem Resumo nem Descrição, pegar todos os campos relevantes
          const campos = [];
          if (data.output.Descricao) campos.push(`**Ingredientes:** ${data.output.Descricao}`);
          if (data.output.Valor) campos.push(`**Porção:** ${data.output.Valor}`);
          if (data.output.Categoria) campos.push(`**Categoria:** ${data.output.Categoria}`);
          if (data.output.Resumo) campos.push(`**Resumo:** ${data.output.Resumo}`);
          processedResponse = campos.length > 0 ? campos.join('\n\n') : JSON.stringify(data.output, null, 2);
        }
      } else if (data.message) {
        // Outro formato possível: {"message": "texto"}
        processedResponse = data.message;
      } else {
        // Fallback: converter o objeto inteiro para texto legível
        processedResponse = JSON.stringify(data, null, 2);
      }
      
      return processedResponse || "Resposta recebida com sucesso!";
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
      
      showToast({
        title: "Erro de conexão",
        description: "Não foi possível conectar com o n8n. Verifique a configuração do webhook.",
        variant: "error",
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
    showToast({
      title: "Chat limpo",
      description: "Todas as mensagens foram removidas.",
      variant: "success",
    });
  };

  return (
    <div className="flex flex-col h-full relative" style={{ background: 'var(--chat-modern-bg)' }}>
      {/* Chat Header */}
      <div className="flex-shrink-0 p-6 border-b border-border/20 bg-card/30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="h-10 w-10 p-0 hover:bg-destructive/20 hover:text-destructive rounded-2xl transition-all duration-200 hover:scale-105"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
        {!n8nWebhookUrl && (
          <p className="text-sm text-muted-foreground mt-3 font-medium">
            Configure o webhook do n8n para ativar respostas inteligentes
          </p>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scroll-smooth px-2">
          <div className="py-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex gap-4 p-6 max-w-[85%] mr-auto">
                <div className="h-10 w-10 rounded-full bg-card/80 border border-border/30 animate-pulse flex-shrink-0 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="bg-card/80 border border-border/50 rounded-3xl rounded-bl-lg px-6 py-4 shadow-sm backdrop-blur-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-muted-foreground/60 rounded-full animate-bounce" />
                    <div className="w-2.5 h-2.5 bg-muted-foreground/60 rounded-full animate-bounce delay-100" />
                    <div className="w-2.5 h-2.5 bg-muted-foreground/60 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <div className="flex-shrink-0">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={false}
          isLoading={isLoading}
        />
      </div>
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}