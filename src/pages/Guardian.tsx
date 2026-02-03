import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  FileText,
  Eye,
  ThumbsUp,
  ThumbsDown,
  History,
  Brain
} from "lucide-react";
import { toast } from "sonner";

// Mock data for demonstration
const pendingActions = [
  {
    id: "1",
    action_type: "content_review",
    target_type: "post",
    target_id: "post-123",
    status: "pending",
    created_at: "2026-02-03T10:30:00Z",
    isabella_recommendation: "approve",
    explanation: "Contenido verificado. No viola principios constitucionales. Confianza: 0.92",
    user: { username: "usuario1", display_name: "Usuario Ejemplo" },
    content_preview: "Este es un post de ejemplo que necesita revisión..."
  },
  {
    id: "2",
    action_type: "identity_verification",
    target_type: "user",
    target_id: "user-456",
    status: "pending",
    created_at: "2026-02-03T09:15:00Z",
    isabella_recommendation: "escalate",
    explanation: "Patrón de comportamiento atípico detectado. Se requiere revisión humana. Banderas: ANOMALY_DETECTED",
    user: { username: "nuevo_usuario", display_name: "Nuevo Usuario" },
    content_preview: "Solicitud de verificación de identidad"
  }
];

const recentDecisions = [
  {
    id: "3",
    action_type: "content_moderation",
    status: "approved",
    resolved_at: "2026-02-03T08:00:00Z",
    guardian: "guardian1",
    explanation: "Aprobado - Contenido cumple con políticas"
  },
  {
    id: "4",
    action_type: "report_review",
    status: "denied",
    resolved_at: "2026-02-02T16:30:00Z",
    guardian: "guardian2",
    explanation: "Denegado - Violación de términos de uso"
  }
];

export default function Guardian() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("pending");

  // Check if user is guardian (in real app, check user_roles or profiles.is_guardian)
  const isGuardian = true; // For demo purposes

  if (loading) {
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

  if (!isGuardian) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Acceso Restringido</h1>
          <p className="text-muted-foreground">
            Esta sección está reservada para Guardianes del sistema TAMV.
          </p>
        </div>
      </MainLayout>
    );
  }

  const handleAction = (actionId: string, decision: "approve" | "deny") => {
    toast.success(
      decision === "approve" 
        ? "Acción aprobada y registrada en BookPI" 
        : "Acción denegada y registrada en BookPI"
    );
  };

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
              <p className="text-muted-foreground">Panel de supervisión HITL (Human-In-The-Loop)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Brain className="w-3 h-3" />
              Isabella AI Activa
            </Badge>
            <Badge className="bg-success/20 text-success border-success/30">
              {pendingActions.length} Pendientes
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
                  <p className="text-2xl font-bold">{pendingActions.length}</p>
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
                  <p className="text-2xl font-bold">24</p>
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
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">Denegadas hoy</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="tamv-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-xs text-muted-foreground">Escaladas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="w-4 h-4" />
              Pendientes ({pendingActions.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="w-4 h-4" />
              Historial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingActions.map((action) => (
              <Card key={action.id} className="tamv-card tamv-gold-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {action.target_type === "post" ? (
                          <FileText className="w-5 h-5" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {action.action_type === "content_review" && "Revisión de Contenido"}
                          {action.action_type === "identity_verification" && "Verificación de Identidad"}
                        </CardTitle>
                        <CardDescription>
                          @{action.user.username} • {new Date(action.created_at).toLocaleString()}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant="outline"
                      className={
                        action.isabella_recommendation === "approve" 
                          ? "border-success text-success" 
                          : "border-warning text-warning"
                      }
                    >
                      <Brain className="w-3 h-3 mr-1" />
                      Isabella: {action.isabella_recommendation === "approve" ? "Aprobar" : "Escalar"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Content Preview */}
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{action.content_preview}</p>
                  </div>

                  {/* Isabella Explanation */}
                  <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="w-4 h-4 text-accent" />
                      <span className="text-xs font-medium text-accent">Análisis Isabella</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{action.explanation}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button 
                      onClick={() => handleAction(action.id, "approve")}
                      className="gap-2"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Aprobar
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => handleAction(action.id, "deny")}
                      className="gap-2"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      Denegar
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Eye className="w-4 h-4" />
                      Ver Detalle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {recentDecisions.map((decision) => (
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
                        por @{decision.guardian}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
