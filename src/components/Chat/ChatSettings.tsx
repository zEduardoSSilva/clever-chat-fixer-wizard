import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Copy, Save, RefreshCw } from "lucide-react";

interface ChatSettingsProps {
  onWebhookUpdate: (url: string) => void;
  currentWebhookUrl: string;
}

export function ChatSettings({ onWebhookUpdate, currentWebhookUrl }: ChatSettingsProps) {
  const [webhookUrl, setWebhookUrl] = useState(currentWebhookUrl);
  const [autoScroll, setAutoScroll] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const { toast } = useToast();

  const handleSaveSettings = () => {
    onWebhookUpdate(webhookUrl);
    toast({
      title: "Configurações salvas",
      description: "As configurações do chat foram atualizadas com sucesso.",
    });
  };

  const copyExamplePayload = () => {
    const examplePayload = JSON.stringify({
      message: "Sua mensagem aqui",
      timestamp: new Date().toISOString(),
      userId: "user-123"
    }, null, 2);
    
    navigator.clipboard.writeText(examplePayload);
    toast({
      title: "Copiado!",
      description: "Exemplo de payload copiado para a área de transferência.",
    });
  };

  const testWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "URL necessária",
        description: "Por favor, configure uma URL de webhook antes de testar.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Teste de conexão",
          timestamp: new Date().toISOString(),
          userId: "test-user",
        }),
      });

      if (response.ok) {
        toast({
          title: "Teste bem-sucedido!",
          description: "A conexão com o webhook foi estabelecida com sucesso.",
        });
      } else {
        throw new Error(`Status: ${response.status}`);
      }
    } catch (error) {
      toast({
        title: "Falha no teste",
        description: "Não foi possível conectar com o webhook. Verifique a URL e tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">Configurações do Chat</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure a integração com n8n e personalize sua experiência de chat
        </p>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="webhook" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="webhook">Webhook n8n</TabsTrigger>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
          </TabsList>
          
          <TabsContent value="webhook" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">URL do Webhook n8n</Label>
              <div className="flex gap-2">
                <Input
                  id="webhook-url"
                  type="url"
                  placeholder="https://your-n8n-instance.com/webhook/your-webhook-id"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={testWebhook}
                  disabled={!webhookUrl}
                  className="px-3"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Cole aqui a URL do webhook do seu workflow n8n
              </p>
            </div>

            <div className="space-y-3">
              <Label>Formatos de Resposta Suportados</Label>
              <div className="bg-muted p-3 rounded-md font-mono text-sm">
                <div className="mb-3">
                  <strong>Formato 1 (Padrão):</strong>
                  <pre>{`{"response": "Sua resposta aqui"}`}</pre>
                </div>
                <div className="mb-3">
                  <strong>Formato 2 (Seu workflow atual):</strong>
                  <pre>{`{
  "output": {
    "Resumo": "Resposta principal",
    "Descricao": "Detalhes",
    "Valor": "Informações extras"
  }
}`}</pre>
                </div>
                <div>
                  <strong>Formato 3 (Alternativo):</strong>
                  <pre>{`{"message": "Sua resposta"}`}</pre>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={copyExamplePayload}
                className="w-full"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar Exemplo
              </Button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                💡 Dica de Configuração no n8n
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Use o nó "Webhook" como trigger</li>
                <li>• Configure método POST</li>
                <li>• Processe a mensagem com IA (OpenAI, Claude, etc.)</li>
                <li>• Retorne a resposta em JSON: {"{"}"response": "sua resposta"{"}"}</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rolagem automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Rolar automaticamente para novas mensagens
                  </p>
                </div>
                <Switch
                  checked={autoScroll}
                  onCheckedChange={setAutoScroll}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sons de notificação</Label>
                  <p className="text-sm text-muted-foreground">
                    Tocar som quando receber novas mensagens
                  </p>
                </div>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 mt-6">
          <Button onClick={handleSaveSettings} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
}