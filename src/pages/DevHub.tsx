import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Copy, 
  Check, 
  BookOpen, 
  Shield, 
  Users,
  Database,
  Key,
  Terminal,
  FileJson
} from "lucide-react";
import { toast } from "sonner";

const API_BASE = "https://rnjpesjicjrvwkqyfidx.supabase.co/functions/v1";

const endpoints = [
  {
    method: "GET",
    path: "/api/identity/:did",
    description: "Obtener identidad soberana por DID",
    example: `curl -X GET "${API_BASE}/devhub/identity/did:tamv:abc123" \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
    response: `{
  "did": "did:tamv:abc123",
  "username": "anubis",
  "display_name": "Anubis Villaseñor",
  "role": "guardian",
  "created_at": "2026-01-01T00:00:00Z",
  "identity_hash": "sha256:a1b2c3..."
}`
  },
  {
    method: "GET",
    path: "/api/ledger/:hash",
    description: "Verificar entrada en BookPI por hash",
    example: `curl -X GET "${API_BASE}/devhub/ledger/sha256:abc123" \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
    response: `{
  "id": "uuid-here",
  "event_type": "ID_CREATED",
  "hash": "sha256:abc123",
  "prev_hash": "sha256:xyz789",
  "verified": true,
  "timestamp": "2026-01-01T00:00:00Z"
}`
  },
  {
    method: "GET",
    path: "/api/events",
    description: "Listar eventos recientes del sistema",
    example: `curl -X GET "${API_BASE}/devhub/events?limit=10" \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
    response: `{
  "events": [
    {
      "id": "uuid",
      "event_type": "POST_CREATED",
      "user_id": "uuid",
      "hash": "sha256:...",
      "created_at": "2026-01-01T00:00:00Z"
    }
  ],
  "total": 1234,
  "has_more": true
}`
  },
  {
    method: "POST",
    path: "/api/verify",
    description: "Verificar integridad de cadena de eventos",
    example: `curl -X POST "${API_BASE}/devhub/verify" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"user_id": "uuid", "from_hash": "sha256:..."}'`,
    response: `{
  "valid": true,
  "events_verified": 42,
  "chain_intact": true,
  "last_hash": "sha256:latest"
}`
  }
];

export default function DevHub() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copiado al portapapeles");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">DevHub API</h1>
              <p className="text-muted-foreground">Documentación de la API pública TAMV</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            <Badge variant="outline" className="gap-1">
              <Database className="w-3 h-3" />
              REST API
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Shield className="w-3 h-3" />
              Zero-Trust Auth
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Key className="w-3 h-3" />
              JWT Bearer Token
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="endpoints" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="endpoints" className="gap-2">
                <Terminal className="w-4 h-4" />
                Endpoints
              </TabsTrigger>
              <TabsTrigger value="auth" className="gap-2">
                <Key className="w-4 h-4" />
                Autenticación
              </TabsTrigger>
              <TabsTrigger value="schemas" className="gap-2">
                <FileJson className="w-4 h-4" />
                Schemas
              </TabsTrigger>
            </TabsList>

            {/* Endpoints Tab */}
            <TabsContent value="endpoints" className="space-y-6">
              {endpoints.map((endpoint, index) => (
                <Card key={index} className="tamv-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={endpoint.method === "GET" ? "secondary" : "default"}
                          className={endpoint.method === "POST" ? "bg-accent text-accent-foreground" : ""}
                        >
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono">{endpoint.path}</code>
                      </div>
                    </div>
                    <CardDescription>{endpoint.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Example */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Ejemplo curl
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(endpoint.example, index)}
                        >
                          {copiedIndex === index ? (
                            <Check className="w-4 h-4 text-success" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
                        {endpoint.example}
                      </pre>
                    </div>

                    {/* Response */}
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
                        Respuesta
                      </span>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono text-success">
                        {endpoint.response}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Auth Tab */}
            <TabsContent value="auth">
              <Card className="tamv-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Autenticación Zero-Trust
                  </CardTitle>
                  <CardDescription>
                    Todas las peticiones requieren un token JWT válido
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">1. Obtener Token</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Usa las credenciales de usuario para obtener un token JWT:
                    </p>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`curl -X POST "${API_BASE}/auth/token" \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@example.com", "password": "..."}'`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">2. Usar Token en Peticiones</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Incluye el token en el header Authorization:
                    </p>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
                    </pre>
                  </div>

                  <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <h4 className="font-medium text-warning mb-1">Seguridad</h4>
                    <p className="text-sm text-muted-foreground">
                      Los tokens expiran después de 1 hora. Toda acción queda registrada en BookPI con hash verificable.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schemas Tab */}
            <TabsContent value="schemas">
              <Card className="tamv-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileJson className="w-5 h-5 text-accent" />
                    Schemas TypeScript
                  </CardTitle>
                  <CardDescription>
                    Tipos para integración con TypeScript
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`// BookPI Entry
interface BookPIEntry {
  id: string;
  event_type: string;
  user_id: string;
  hash: string;           // SHA-256
  prev_hash: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

// Identity
interface TAMVIdentity {
  did: string;            // did:tamv:...
  username: string;
  display_name: string | null;
  role: 'citizen' | 'guardian' | 'admin';
  is_guardian: boolean;
  created_at: string;
  identity_hash: string;
}

// Isabella Response
interface IsabellaResponse {
  decision: 'approve' | 'deny' | 'escalate';
  explanation: string;
  confidence: number;     // 0-1
  ethical_flags: string[];
  requires_hitl: boolean;
}

// Event Types
type TAMVEventType = 
  | 'ID_CREATED'
  | 'ID_REVOKED'
  | 'ID_ASSERTED'
  | 'ID_MIGRATED'
  | 'POST_CREATED'
  | 'POST_EDITED'
  | 'POST_DELETED'
  | 'GUARDIAN_ACTION'
  | 'ISABELLA_DECISION';`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Resources */}
          <div className="mt-12 grid md:grid-cols-3 gap-4">
            <Card className="tamv-card p-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-primary" />
                <div>
                  <h4 className="font-medium">Documentación</h4>
                  <p className="text-xs text-muted-foreground">Guías completas</p>
                </div>
              </div>
            </Card>
            <Card className="tamv-card p-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-accent" />
                <div>
                  <h4 className="font-medium">Comunidad</h4>
                  <p className="text-xs text-muted-foreground">Discord & Foro</p>
                </div>
              </div>
            </Card>
            <Card className="tamv-card p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-success" />
                <div>
                  <h4 className="font-medium">Seguridad</h4>
                  <p className="text-xs text-muted-foreground">Bug bounty</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
