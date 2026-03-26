import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, Clock, CheckCircle, XCircle,
  User, FileText, Eye, ThumbsUp, ThumbsDown, History,
  Brain, RefreshCw, Activity, Zap
} from "lucide-react";
import { useGuardianActions } from "@/hooks/useGuardianActions";
import { callGateway } from "@/lib/tamv-gateway-client";
import { toast } from "sonner";
import { OperationalReadinessBoard } from "@/components/operations/OperationalReadinessBoard";

export default function Guardian() {
  const { user, loading: authLoading } = useAuth();
  const { pending, resolved, loading, resolveAction, refresh } = useGuardianActions();
  const [activeTab, setActiveTab] = useState("pending");
  const [testingPipeline, setTestingPipeline] = useState(false);

  if (authLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleResolve = (actionId: string, decision: "approved" | "denied") => {
    resolveAction(actionId, decision, user.id);
  };

  const handleTestPipeline = async () => {
    setTestingPipeline(true);
    try {
      const result = await callGateway<{
        decision: string;
        confidence: number;
        explanation: string;
      }>("kernel.isabella.test", {
        intent: "content_moderation",
        payload: "Test content for moderation review",
      });
      toast.success(`Pipeline: ${result.decision} (confianza: ${(result.confidence * 100).toFixed(0)}%)`);
    } catch {
      toast.error("Error de conexión con Isabella via Gateway");
    }
    setTestingPipeline(false);
  };

  const handleTestSentinel = async () => {
    try {
      const result = await callGateway<{
        status: string;
        threat_level: string;
        mode: string;
      }>("security.sentinel.status");
      toast.success(`Sentinel: ${result.threat_level} - ${result.status} (modo: ${result.mode})`);
    } catch {
      toast.error("Error de conexión con Sentinel via Gateway");
    }
  };

  const approvedToday = resolved.filter(a => {
    const d = a.resolved_at ? new Date(a.resolved_at) : null;
    return d && d.toDateString() === new Date().toDateString() && a.status === "approved";
  }).length;

  const deniedToday = resolved.filter(a => {
    const d = a.resolved_at ? new Date(a.resolved_at) : null;
    return d && d.toDateString() === new Date().toDateString() && a.status === "denied";
  }).length;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Guardian Console</h1>
              <p className="text-muted-foreground">HITL via Gateway TAMV DM-X7</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refresh} className="gap-1">
              <RefreshCw className="w-3 h-3" />
              Refresh
            </Button>
            <Badge variant="outline" className="gap-1">
              <Brain className="w-3 h-3" />
              Isabella Activa
            </Badge>
            <Badge className="bg-success/20 text-success border-success/30">
              {pending.length} Pendientes
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="tamv-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-warning" />
                <div>
                  <p className="text-2xl font-bold">{pending.length}</p>
                  <p className="text-xs text-muted-foreground">Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="tamv-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-success" />
                <div>
                  <p className="text-2xl font-bold">{approvedToday}</p>
                  <p className="text-xs text-muted-foreground">Aprobadas hoy</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="tamv-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-destructive" />
                <div>
                  <p className="text-2xl font-bold">{deniedToday}</p>
                  <p className="text-xs text-muted-foreground">Denegadas hoy</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="tamv-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{resolved.length}</p>
                  <p className="text-xs text-muted-foreground">Total resueltas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Test Panel */}
        <Card className="tamv-card tamv-gold-border mb-8">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Diagnóstico via Gateway Unificado</p>
                  <p className="text-xs text-muted-foreground">kernel.isabella.test · security.sentinel.status</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleTestSentinel} className="gap-1">
                  <Shield className="w-3 h-3" />
                  Test Sentinel
                </Button>
                <Button size="sm" onClick={handleTestPipeline} disabled={testingPipeline} className="gap-1">
                  <Zap className="w-3 h-3" />
                  {testingPipeline ? "Procesando..." : "Test Isabella"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <OperationalReadinessBoard />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="w-4 h-4" />
              Pendientes ({pending.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="w-4 h-4" />
              Historial ({resolved.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pending.length === 0 ? (
              <Card className="tamv-card">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                  <p className="font-medium">Sin acciones pendientes</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Todas las solicitudes han sido procesadas. Isabella continúa vigilando.
                  </p>
                </CardContent>
              </Card>
            ) : (
              pending.map((action) => (
                <Card key={action.id} className="tamv-card tamv-gold-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          {action.target_type === "post" ? <FileText className="w-5 h-5" /> : <User className="w-5 h-5" />}
                        </div>
                        <div>
                          <CardTitle className="text-base">{action.action_type}</CardTitle>
                          <CardDescription>
                            {action.target_type}:{action.target_id?.slice(0, 8)} • {action.created_at ? new Date(action.created_at).toLocaleString() : ""}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className={
                        action.isabella_recommendation === "approve"
                          ? "border-success text-success"
                          : action.isabella_recommendation === "deny"
                            ? "border-destructive text-destructive"
                            : "border-warning text-warning"
                      }>
                        <Brain className="w-3 h-3 mr-1" />
                        Isabella: {action.isabella_recommendation || "Pendiente"}
                        {action.isabella_confidence && ` (${(action.isabella_confidence * 100).toFixed(0)}%)`}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {action.explanation && (
                      <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="w-4 h-4 text-accent" />
                          <span className="text-xs font-medium text-accent">Análisis Isabella</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{action.explanation}</p>
                      </div>
                    )}

                    {action.msr_hash && (
                      <div className="tamv-hash text-[10px]">MSR: {action.msr_hash.slice(0, 32)}...</div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <Button onClick={() => handleResolve(action.id, "approved")} className="gap-2">
                        <ThumbsUp className="w-4 h-4" /> Aprobar
                      </Button>
                      <Button variant="destructive" onClick={() => handleResolve(action.id, "denied")} className="gap-2">
                        <ThumbsDown className="w-4 h-4" /> Denegar
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Eye className="w-4 h-4" /> Ver Detalle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {resolved.length === 0 ? (
              <Card className="tamv-card">
                <CardContent className="p-8 text-center">
                  <History className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium">Sin historial</p>
                  <p className="text-sm text-muted-foreground mt-1">Las decisiones resueltas aparecerán aquí.</p>
                </CardContent>
              </Card>
            ) : (
              resolved.map((decision) => (
                <Card key={decision.id} className="tamv-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {decision.status === "approved" ? (
                          <CheckCircle className="w-5 h-5 text-success" />
                        ) : (
                          <XCircle className="w-5 h-5 text-destructive" />
                        )}
                        <div>
                          <p className="font-medium">{decision.action_type}</p>
                          <p className="text-sm text-muted-foreground">{decision.explanation}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={decision.status === "approved" ? "default" : "destructive"}>
                          {decision.status === "approved" ? "Aprobado" : "Denegado"}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {decision.resolved_at ? new Date(decision.resolved_at).toLocaleString() : ""}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
