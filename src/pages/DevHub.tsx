import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DomainSection } from "@/components/devhub/DomainSection";
import {
  Code, Shield, Key, Terminal, FileJson, Search, Zap, Database,
  BookOpen, Users,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  tamvSpec, getAllDomains, getSpecByDomain, getEndpointCount,
  getDomainCounts, type TamvDomain,
} from "@/lib/tamv-spec";

const API_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export default function DevHub() {
  const [search, setSearch] = useState("");
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testOp, setTestOp] = useState("devtools.echo");

  const domains = getAllDomains();
  const counts = getDomainCounts();
  const totalEndpoints = getEndpointCount();

  const filteredDomains = domains.filter(d => {
    if (!search) return true;
    const s = search.toLowerCase();
    const eps = getSpecByDomain(d);
    return d.includes(s) || eps.some(e =>
      e.id.toLowerCase().includes(s) ||
      e.path.toLowerCase().includes(s) ||
      e.description.toLowerCase().includes(s)
    );
  });

  const getFilteredEndpoints = (domain: TamvDomain) => {
    const eps = getSpecByDomain(domain);
    if (!search) return eps;
    const s = search.toLowerCase();
    return eps.filter(e =>
      e.id.toLowerCase().includes(s) ||
      e.path.toLowerCase().includes(s) ||
      e.description.toLowerCase().includes(s) ||
      domain.includes(s)
    );
  };

  const runTest = async () => {
    setTestLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("tamv-gateway", {
        body: { operation: testOp, payload: {} },
      });
      if (error) throw error;
      setTestResult(data);
      toast.success(`${testOp} ejecutado`);
    } catch (e: any) {
      setTestResult({ error: e.message });
      toast.error("Error al ejecutar operación");
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">TAMV DM-X7 API</h1>
              <p className="text-muted-foreground">Gateway Unificado — {totalEndpoints} Endpoints · {domains.length} Dominios</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline" className="gap-1"><Database className="w-3 h-3" />REST Unificado</Badge>
            <Badge variant="outline" className="gap-1"><Shield className="w-3 h-3" />Zero-Trust</Badge>
            <Badge variant="outline" className="gap-1"><Key className="w-3 h-3" />JWT + PQC</Badge>
            <Badge variant="outline" className="gap-1"><Zap className="w-3 h-3" />v7.0.0</Badge>
            <Badge variant="secondary">{totalEndpoints} endpoints</Badge>
          </div>
        </div>

        {/* Main */}
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="endpoints" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="endpoints" className="gap-2">
                <Terminal className="w-4 h-4" />Endpoints
              </TabsTrigger>
              <TabsTrigger value="console" className="gap-2">
                <Zap className="w-4 h-4" />Consola
              </TabsTrigger>
              <TabsTrigger value="auth" className="gap-2">
                <Key className="w-4 h-4" />Auth
              </TabsTrigger>
              <TabsTrigger value="schemas" className="gap-2">
                <FileJson className="w-4 h-4" />Schemas
              </TabsTrigger>
            </TabsList>

            {/* Endpoints Tab */}
            <TabsContent value="endpoints" className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar endpoints (nombre, path, descripción)..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Domain summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {domains.map(d => (
                  <button
                    key={d}
                    onClick={() => setSearch(d)}
                    className="text-center p-2 rounded-lg border border-border/50 hover:border-primary/50 transition-colors bg-card/50"
                  >
                    <div className="text-lg font-bold">{counts[d]}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">{d}</div>
                  </button>
                ))}
              </div>

              {/* Domain sections */}
              {filteredDomains.map(domain => {
                const eps = getFilteredEndpoints(domain);
                if (eps.length === 0) return null;
                return (
                  <DomainSection
                    key={domain}
                    domain={domain}
                    endpoints={eps}
                    baseUrl={API_BASE}
                    defaultOpen={!!search}
                  />
                );
              })}
            </TabsContent>

            {/* Console Tab */}
            <TabsContent value="console" className="space-y-4">
              <Card className="tamv-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-primary" />
                    Consola TAMV Gateway
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Operation ID (e.g. devtools.echo)"
                      value={testOp}
                      onChange={e => setTestOp(e.target.value)}
                      className="font-mono text-sm"
                    />
                    <Button onClick={runTest} disabled={testLoading}>
                      {testLoading ? "..." : "Ejecutar"}
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {["devtools.echo", "devtools.version", "ops.status", "ops.health",
                      "security.sentinel.status", "economy.phoenix.status",
                      "quantum.health", "quantum.backends", "governance.protocols.list",
                      "bookpi.stats", "economy.fees.model", "kernel.health",
                      "kernel.isabella.test", "ops.nodes.list",
                    ].map(op => (
                      <Badge
                        key={op}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10 text-xs"
                        onClick={() => { setTestOp(op); }}
                      >
                        {op}
                      </Badge>
                    ))}
                  </div>

                  {testResult && (
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-96 overflow-y-auto">
                      {JSON.stringify(testResult, null, 2)}
                    </pre>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Auth Tab */}
            <TabsContent value="auth">
              <Card className="tamv-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Autenticación Zero-Trust + Gateway Unificado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Punto de entrada único</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Todas las operaciones pasan por un solo endpoint gateway:
                    </p>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`POST ${API_BASE}/tamv-gateway
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
X-TAMV-Trace-ID: optional-trace-uuid

{
  "operation": "economy.balance",
  "payload": {}
}`}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Respuesta estándar</h4>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`{
  "status": "success",
  "operation": "economy.balance",
  "domain": "economy",
  "result": { "balance": 1000, "currency": "TAMV-T" },
  "meta": {
    "traceId": "uuid",
    "processingMs": 42,
    "mode": "peace",
    "version": "7.0.0"
  }
}`}
                    </pre>
                  </div>
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <h4 className="font-medium mb-1">Modos Civilizatorios</h4>
                    <p className="text-sm text-muted-foreground">
                      <strong>peace</strong>: operación normal · <strong>alert</strong>: restricciones parciales · <strong>lockdown</strong>: solo lectura + guardianes
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
                    Schemas TypeScript — TAMV DM-X7
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-[600px] overflow-y-auto">
{`// ═══ TAMV DM-X7 Type System ═══

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type TamvDomain =
  | 'auth' | 'identity' | 'security' | 'economy' | 'xr'
  | 'quantum' | 'governance' | 'utamv' | 'bookpi'
  | 'kernel' | 'ops' | 'social' | 'devtools';

interface TamvGatewayRequest {
  operation: string;        // "domain.action"
  payload: Record<string, any>;
  meta?: {
    traceId?: string;
    client?: 'web' | 'xr' | 'cli';
    version?: string;
  };
}

interface TamvGatewayResponse<T = any> {
  status: 'success' | 'error';
  operation: string;
  domain: TamvDomain;
  result: T;
  meta: {
    traceId: string;
    processingMs: number;
    mode: 'peace' | 'alert' | 'lockdown';
    version: string;
    userId: string | null;
    roles: string[];
  };
}

// ═══ Domain Types ═══

interface TAMVIdentity {
  did: string;
  username: string;
  display_name: string | null;
  role: 'citizen' | 'guardian' | 'admin';
  trust_level: string;
  reputation_score: number;
  consciousness_level: number;
}

interface EconomyBalance {
  balance: number;
  currency: 'TAMV-T';
  userId: string;
}

interface QuantumBackend {
  id: string;
  name: string;
  provider: 'IBM' | 'Google' | 'NVIDIA';
  qubits: number;
  status: 'active' | 'maintenance' | 'offline';
}

interface IsabellaDecision {
  decision: 'approve' | 'deny' | 'escalate';
  explanation: string;
  confidence: number;
  ethical_flags: string[];
  requires_hitl: boolean;
}

interface BookPIEntry {
  id: string;
  event_type: string;
  user_id: string;
  hash: string;
  prev_hash: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

type CivilizationMode = 'peace' | 'alert' | 'lockdown';

type TAMVEventType =
  | 'ID_CREATED' | 'ID_REVOKED' | 'ID_ASSERTED' | 'ID_MIGRATED'
  | 'POST_CREATED' | 'POST_EDITED' | 'POST_DELETED'
  | 'GUARDIAN_ACTION' | 'ISABELLA_DECISION'
  | 'ECONOMY_TRANSFER' | 'ECONOMY_LOCK' | 'ECONOMY_UNLOCK'
  | 'XR_SESSION_OPEN' | 'XR_SESSION_CLOSE'
  | 'QUANTUM_CIRCUIT_EXECUTE'
  | 'GOVERNANCE_VOTE' | 'GOVERNANCE_PROPOSAL'
  | 'SECURITY_INCIDENT' | 'SECURITY_MODE_CHANGE';`}
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
                  <p className="text-xs text-muted-foreground">9 volúmenes canónicos</p>
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
                <Shield className="w-5 h-5 text-emerald-500" />
                <div>
                  <h4 className="font-medium">Seguridad</h4>
                  <p className="text-xs text-muted-foreground">Bug bounty · Panteón</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
