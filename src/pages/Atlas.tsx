import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Globe, 
  Server, 
  Activity, 
  Shield, 
  Clock,
  Cpu,
  Database,
  Zap,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

// Mock data for federated nodes
const federatedNodes = [
  {
    id: "node-1",
    name: "TAMV-Central",
    type: "cloud",
    status: "active",
    ast_state: "NORMAL",
    region: "North America",
    latency: 12,
    load: 45,
    events_processed: 125420
  },
  {
    id: "node-2",
    name: "TAMV-LATAM",
    type: "edge",
    status: "active",
    ast_state: "NORMAL",
    region: "Latin America",
    latency: 28,
    load: 62,
    events_processed: 89340
  },
  {
    id: "node-3",
    name: "TAMV-EU",
    type: "fog",
    status: "active",
    ast_state: "NORMAL",
    region: "Europe",
    latency: 45,
    load: 38,
    events_processed: 67890
  },
  {
    id: "node-4",
    name: "TAMV-Backup",
    type: "cloud",
    status: "standby",
    ast_state: "ORPHAN",
    region: "Global",
    latency: 0,
    load: 0,
    events_processed: 0
  }
];

const systemMetrics = {
  totalEvents: 282650,
  activeUsers: 1247,
  uptime: 99.97,
  isabellaDecisions: 4521,
  bookpiEntries: 156890,
  averageLatency: 28
};

export default function Atlas() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success";
      case "standby": return "bg-warning";
      case "offline": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const getASTBadge = (state: string) => {
    switch (state) {
      case "NORMAL": return <Badge className="bg-success/20 text-success border-success/30">NORMAL</Badge>;
      case "OBLIVION": return <Badge className="bg-destructive/20 text-destructive border-destructive/30">OBLIVION</Badge>;
      case "BUNKER": return <Badge className="bg-warning/20 text-warning border-warning/30">BÚNKER</Badge>;
      case "ORPHAN": return <Badge className="bg-muted text-muted-foreground">ORPHAN</Badge>;
      case "PHOENIX": return <Badge className="bg-primary/20 text-primary border-primary/30">PHOENIX</Badge>;
      default: return <Badge variant="outline">{state}</Badge>;
    }
  };

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
              <h1 className="text-2xl font-bold">Atlas 3D</h1>
              <p className="text-muted-foreground">Mapa de Federación TAMV en tiempo real</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Activity className="w-3 h-3" />
              En vivo
            </Badge>
            <Badge className="bg-success/20 text-success border-success/30">
              Sistema Operativo
            </Badge>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="tamv-card">
            <CardContent className="p-4 text-center">
              <Database className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold">{systemMetrics.totalEvents.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Eventos Totales</p>
            </CardContent>
          </Card>
          <Card className="tamv-card">
            <CardContent className="p-4 text-center">
              <Cpu className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-xl font-bold">{systemMetrics.activeUsers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Usuarios Activos</p>
            </CardContent>
          </Card>
          <Card className="tamv-card">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 text-success mx-auto mb-2" />
              <p className="text-xl font-bold">{systemMetrics.uptime}%</p>
              <p className="text-xs text-muted-foreground">Uptime</p>
            </CardContent>
          </Card>
          <Card className="tamv-card">
            <CardContent className="p-4 text-center">
              <Shield className="w-6 h-6 text-warning mx-auto mb-2" />
              <p className="text-xl font-bold">{systemMetrics.isabellaDecisions.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Decisiones Isabella</p>
            </CardContent>
          </Card>
          <Card className="tamv-card">
            <CardContent className="p-4 text-center">
              <Database className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold">{systemMetrics.bookpiEntries.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Entradas BookPI</p>
            </CardContent>
          </Card>
          <Card className="tamv-card">
            <CardContent className="p-4 text-center">
              <Zap className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-xl font-bold">{systemMetrics.averageLatency}ms</p>
              <p className="text-xs text-muted-foreground">Latencia Promedio</p>
            </CardContent>
          </Card>
        </div>

        {/* Visual Map Placeholder */}
        <Card className="tamv-card mb-8">
          <CardContent className="p-0">
            <div 
              className="relative h-64 md:h-80 rounded-lg overflow-hidden"
              style={{
                background: "radial-gradient(ellipse at 50% 50%, hsl(222 47% 12%) 0%, hsl(222 47% 5%) 100%)"
              }}
            >
              {/* Animated background grid */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, hsl(173 80% 40% / 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, hsl(173 80% 40% / 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: "40px 40px"
                }}
              />
              
              {/* Node visualizations */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full max-w-lg">
                  {/* Central node (Isabella) */}
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

                  {/* Orbiting nodes */}
                  {federatedNodes.slice(0, 3).map((node, i) => {
                    const angle = (i * 120 - 90) * (Math.PI / 180);
                    const radius = 100;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    
                    return (
                      <div 
                        key={node.id}
                        className="absolute left-1/2 top-1/2"
                        style={{
                          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                        }}
                      >
                        <div className="relative group cursor-pointer">
                          <div className={`w-8 h-8 rounded-full ${getStatusColor(node.status)} flex items-center justify-center`}>
                            <Server className="w-4 h-4 text-white" />
                          </div>
                          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
                            {node.name}
                          </span>
                          
                          {/* Connection line */}
                          <div 
                            className="absolute left-1/2 top-1/2 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
                            style={{
                              width: `${radius - 20}px`,
                              transform: `rotate(${(i * 120 + 90)}deg)`,
                              transformOrigin: "left center"
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
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
            </div>
          </CardContent>
        </Card>

        {/* Nodes List */}
        <div className="grid md:grid-cols-2 gap-4">
          {federatedNodes.map((node) => (
            <Card key={node.id} className="tamv-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(node.status)}`} />
                    <CardTitle className="text-base">{node.name}</CardTitle>
                  </div>
                  {getASTBadge(node.ast_state)}
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {node.type}
                  </Badge>
                  <span>{node.region}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {node.status === "active" && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Latencia
                      </span>
                      <span className={node.latency < 30 ? "text-success" : "text-warning"}>
                        {node.latency}ms
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Carga</span>
                        <span>{node.load}%</span>
                      </div>
                      <Progress value={node.load} className="h-1.5" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Eventos procesados</span>
                      <span className="font-mono text-xs">{node.events_processed.toLocaleString()}</span>
                    </div>
                  </>
                )}
                {node.status === "standby" && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Nodo en espera - Disponible para failover</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
