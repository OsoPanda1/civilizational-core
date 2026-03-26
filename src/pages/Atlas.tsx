import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, Server, Activity, Shield, Clock, Cpu, Database, Zap,
  CheckCircle, TrendingUp, Wallet, BarChart3
} from "lucide-react";
import { useFederatedNodes } from "@/hooks/useFederatedNodes";
import { usePhoenixStatus } from "@/hooks/usePhoenixStatus";
import { useState, useEffect } from "react";
import { callGateway } from "@/lib/tamv-gateway-client";
import { OperationalReadinessBoard } from "@/components/operations/OperationalReadinessBoard";

export default function Atlas() {
  const { nodes, loading: nodesLoading } = useFederatedNodes();
  const { status: phoenix } = usePhoenixStatus();
  const [sentinelStatus, setSentinelStatus] = useState<string>("loading");
  const [recentThreats, setRecentThreats] = useState<number>(0);

  // Fetch sentinel status via unified gateway
  useEffect(() => {
    const fetchSentinel = async () => {
      try {
        const result = await callGateway<{
          status: string;
          recent_threats: any[];
        }>("security.sentinel.status");
        setSentinelStatus(result.status || "OPERATIONAL");
        setRecentThreats(result.recent_threats?.length || 0);
      } catch {
        setSentinelStatus("ERROR");
      }
    };
    fetchSentinel();
  }, []);

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "active": return "bg-success";
      case "standby": return "bg-warning";
      case "offline": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const getASTBadge = (state: string | null) => {
    switch (state) {
      case "NORMAL": return <Badge className="bg-success/20 text-success border-success/30">NORMAL</Badge>;
      case "OBLIVION": return <Badge className="bg-destructive/20 text-destructive border-destructive/30">OBLIVION</Badge>;
      case "BUNKER": return <Badge className="bg-warning/20 text-warning border-warning/30">BÚNKER</Badge>;
      case "ORPHAN": return <Badge className="bg-muted text-muted-foreground">ORPHAN</Badge>;
      case "PHOENIX": return <Badge className="bg-primary/20 text-primary border-primary/30">PHOENIX</Badge>;
      default: return <Badge variant="outline">{state || "UNKNOWN"}</Badge>;
    }
  };

  const getNodeIcon = (type: string | null) => {
    switch (type) {
      case "cloud": return <Server className="w-4 h-4" />;
      case "edge": return <Zap className="w-4 h-4" />;
      case "fog": return <Globe className="w-4 h-4" />;
      default: return <Cpu className="w-4 h-4" />;
    }
  };

  const activeNodes = nodes.filter(n => n.status === "active").length;
  const avgHealth = nodes.length > 0
    ? nodes.reduce((s, n) => s + (n.health_score || 0), 0) / nodes.length
    : 0;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <Globe className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Atlas de Federación</h1>
              <p className="text-muted-foreground">Monitoreo via Gateway TAMV DM-X7</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Activity className="w-3 h-3" />
              Gateway v7
            </Badge>
            <Badge className={sentinelStatus === "OPERATIONAL"
              ? "bg-success/20 text-success border-success/30"
              : "bg-destructive/20 text-destructive border-destructive/30"
            }>
              {sentinelStatus === "loading" ? "Conectando..." : sentinelStatus}
            </Badge>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="tamv-card">
            <CardContent className="p-4 text-center">
              <Server className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold">{activeNodes}/{nodes.length}</p>
              <p className="text-xs text-muted-foreground">Nodos Activos</p>
            </CardContent>
          </Card>
          <Card className="tamv-card">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-xl font-bold">{avgHealth.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Salud Promedio</p>
            </CardContent>
          </Card>
          <Card className="tamv-card">
            <CardContent className="p-4 text-center">
              <Wallet className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold">{phoenix.fundBalance.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Fondo Fénix</p>
            </CardContent>
          </Card>
          <Card className="tamv-card">
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-6 h-6 text-success mx-auto mb-2" />
              <p className="text-xl font-bold">{(phoenix.economicHealth * 100).toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Salud Económica</p>
            </CardContent>
          </Card>
          <Card className="tamv-card">
            <CardContent className="p-4 text-center">
              <Database className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-xl font-bold">{phoenix.transactionCount}</p>
              <p className="text-xs text-muted-foreground">Transacciones</p>
            </CardContent>
          </Card>
          <Card className="tamv-card">
            <CardContent className="p-4 text-center">
              <Shield className="w-6 h-6 text-warning mx-auto mb-2" />
              <p className="text-xl font-bold">{recentThreats}</p>
              <p className="text-xs text-muted-foreground">Amenazas 24h</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="nodes">
          <TabsList className="mb-6">
            <TabsTrigger value="nodes" className="gap-2">
              <Server className="w-4 h-4" />
              Nodos Federados
            </TabsTrigger>
            <TabsTrigger value="economy" className="gap-2">
              <Zap className="w-4 h-4" />
              Economía Fénix
            </TabsTrigger>
            <TabsTrigger value="operations" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Preparación
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nodes">
            {/* Visual Map */}
            <Card className="tamv-card mb-8">
              <CardContent className="p-0">
                <div 
                  className="relative h-64 md:h-80 rounded-lg overflow-hidden"
                  style={{ background: "radial-gradient(ellipse at 50% 50%, hsl(222 47% 12%) 0%, hsl(222 47% 5%) 100%)" }}
                >
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `linear-gradient(to right, hsl(173 80% 40% / 0.1) 1px, transparent 1px),linear-gradient(to bottom, hsl(173 80% 40% / 0.1) 1px, transparent 1px)`,
                      backgroundSize: "40px 40px"
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full max-w-lg">
                      {/* Central Isabella Core */}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-primary/20 animate-pulse flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-primary/40 flex items-center justify-center">
                              <Shield className="w-5 h-5 text-primary" />
                            </div>
                          </div>
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-primary font-medium whitespace-nowrap">
                            Isabella Core
                          </span>
                        </div>
                      </div>

                      {/* Live nodes orbiting */}
                      {nodes.map((node, i) => {
                        const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
                        const radius = 110;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;

                        return (
                          <div key={node.id}
                            className="absolute left-1/2 top-1/2"
                            style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
                          >
                            <div className="relative group cursor-pointer">
                              <div className={`w-8 h-8 rounded-full ${getStatusColor(node.status)} flex items-center justify-center transition-transform group-hover:scale-125`}>
                                {getNodeIcon(node.node_type)}
                              </div>
                              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap">
                                {node.node_name}
                              </span>
                              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                                <div className="bg-popover border border-border rounded-md p-2 text-xs shadow-lg whitespace-nowrap">
                                  <p className="font-medium">{node.node_name}</p>
                                  <p className="text-muted-foreground">{node.region}</p>
                                  <p className="text-success">Health: {node.health_score}%</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-muted-foreground">Activo</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-warning" />
                      <span className="text-muted-foreground">Standby</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-muted-foreground">Core</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                    {nodesLoading ? "Cargando..." : `${nodes.length} nodos registrados`}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Node Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {nodes.map((node) => (
                <Card key={node.id} className="tamv-card">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(node.status)}`} />
                        <CardTitle className="text-base">{node.node_name}</CardTitle>
                      </div>
                      {getASTBadge(node.ast_state)}
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{node.node_type}</Badge>
                      <span>{node.region}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Salud del nodo</span>
                        <span className="font-medium">{node.health_score || 0}%</span>
                      </div>
                      <Progress value={node.health_score || 0} className="h-1.5" />
                    </div>
                    {node.latency_ms && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Latencia
                        </span>
                        <span className={(node.latency_ms || 0) < 30 ? "text-success" : "text-warning"}>
                          {node.latency_ms}ms
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">ID</span>
                      <span className="tamv-hash text-[10px]">{node.id.slice(0, 12)}...</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="economy">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="tamv-card tamv-gold-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Protocolo Fénix
                  </CardTitle>
                  <CardDescription>Distribución económica 75/25</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Fondo de Reserva</span>
                      <span className="font-bold text-primary">{phoenix.fundBalance.toFixed(2)} TAMV-T</span>
                    </div>
                    <Progress value={phoenix.economicHealth * 100} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className="text-lg font-bold text-success">75%</p>
                      <p className="text-xs text-muted-foreground">Creadores</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className="text-lg font-bold text-primary">25%</p>
                      <p className="text-xs text-muted-foreground">Fondo Fénix</p>
                    </div>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volumen total</span>
                      <span>{phoenix.totalVolume.toFixed(2)} TAMV-T</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transacciones</span>
                      <span>{phoenix.transactionCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="tamv-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-accent" />
                    Estado del Mundo 4D
                  </CardTitle>
                  <CardDescription>Evolución temporal basada en economía</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg border border-border bg-muted/30 text-center">
                    <p className="text-3xl font-bold" style={{
                      color: phoenix.economicHealth > 0.7 ? "hsl(var(--success))" :
                        phoenix.economicHealth > 0.4 ? "hsl(var(--warning))" : "hsl(var(--destructive))"
                    }}>
                      {(phoenix.economicHealth * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Índice de Salud Civilizacional</p>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    La salud económica dicta la evolución visual del mundo 4D. Valores altos = edificios florecen, 
                    valores bajos = niebla y deterioro procedural.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="operations">
            <OperationalReadinessBoard />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
