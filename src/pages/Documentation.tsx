import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  FileText, 
  Scale, 
  Cpu, 
  DollarSign, 
  Shield, 
  Map,
  ExternalLink,
  ChevronRight,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";

const volumes = [
  {
    id: "vol-1",
    title: "Volumen I — Constitución",
    description: "Carta Constitucional, derechos fundamentales y obligaciones del sistema",
    icon: Scale,
    file: "VOLUMEN_I_CONSTITUCION.md",
    topics: ["Axioma Cero", "Derechos del Usuario", "Principios Inmutables"]
  },
  {
    id: "vol-2",
    title: "Volumen II — Arquitectura",
    description: "Arquitectura federada de 7 capas con especificaciones técnicas",
    icon: Cpu,
    file: "VOLUMEN_II_ARQUITECTURA.md",
    topics: ["7 Capas", "BookPI", "MSR Ledger", "Isabella AI"]
  },
  {
    id: "vol-3",
    title: "Volumen III — Isabella AI",
    description: "Sistema de inteligencia artificial civilizacional con pipeline ético",
    icon: Shield,
    file: "VOLUMEN_III_ISABELLA.md",
    topics: ["Pipeline 6 Etapas", "KEC", "XAI", "Restricciones"]
  },
  {
    id: "vol-4",
    title: "Volumen IV — Economía",
    description: "Modelo económico TAMV 2026-2035 con tokenomics ética",
    icon: DollarSign,
    file: "VOLUMEN_IV_ECONOMIA.md",
    topics: ["20/30/50", "20+ Fuentes", "TAMV-T", "Protocolo Fénix"]
  },
  {
    id: "vol-5",
    title: "Volumen V — Técnico",
    description: "Especificaciones técnicas profundas y esquemas de base de datos",
    icon: Cpu,
    file: "VOLUMEN_V_TECNICO.md",
    topics: ["Zero-Trust", "Low-Latency", "Edge Functions"]
  },
  {
    id: "vol-6",
    title: "Volumen VI — Seguridad",
    description: "MSR Blockchain, protocolos de seguridad y sistemas sentinela",
    icon: Shield,
    file: "VOLUMEN_VI_SEGURIDAD.md",
    topics: ["MSR", "Anubis", "ORUS", "Post-Cuántico"]
  },
  {
    id: "vol-7",
    title: "Volumen VII — Legal",
    description: "Marco jurídico comparado y compliance internacional",
    icon: Scale,
    file: "VOLUMEN_VII_LEGAL.md",
    topics: ["GDPR", "EU AI Act", "LATAM", "Metaverso Legal"]
  },
  {
    id: "vol-8",
    title: "Volumen VIII — Roadmap",
    description: "Roadmap civilizatorio 2026-2040 con 8 fases",
    icon: Map,
    file: "VOLUMEN_VIII_ROADMAP.md",
    topics: ["8 Fases", "KPIs", "Hitos", "Principios"]
  },
  {
    id: "vol-9",
    title: "Volumen IX — Preproducción",
    description: "Hardening, operación y checklist de salida a producción",
    icon: Target,
    file: "VOLUMEN_IX_PREPRODUCCION.md",
    topics: ["RLS", "Runbooks", "Observabilidad", "QA"]
  }
];

const layers = [
  { id: 0, name: "Infraestructura Física", color: "bg-slate-500" },
  { id: 1, name: "Identidad Soberana (ID-NVIDA)", color: "bg-blue-500" },
  { id: 2, name: "Experiencia XR & Sensorial", color: "bg-purple-500" },
  { id: 3, name: "Sistemas Distribuidos", color: "bg-cyan-500" },
  { id: 4, name: "Isabella AI", color: "bg-pink-500" },
  { id: 5, name: "Economía Digital", color: "bg-amber-500" },
  { id: 6, name: "Gobernanza & Legal", color: "bg-emerald-500" },
  { id: 7, name: "Metacivilización", color: "bg-primary" }
];

export default function Documentation() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Documentación Canónica</h1>
              <p className="text-muted-foreground">TAMV Online — Infraestructura Civilizatoria Digital</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">v2.0.0</Badge>
            <Badge variant="outline" className="text-success border-success/30">Ejecutable</Badge>
            <Badge variant="outline">Federado</Badge>
            <Badge variant="outline">Auditable</Badge>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="volumes" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="volumes">
                <FileText className="w-4 h-4 mr-2" />
                Volúmenes
              </TabsTrigger>
              <TabsTrigger value="layers">
                <Cpu className="w-4 h-4 mr-2" />
                7 Capas
              </TabsTrigger>
              <TabsTrigger value="quick">
                <BookOpen className="w-4 h-4 mr-2" />
                Inicio Rápido
              </TabsTrigger>
            </TabsList>

            {/* Volumes Tab */}
            <TabsContent value="volumes" className="space-y-4">
              {volumes.map((vol) => (
                <Card key={vol.id} className="tamv-card hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <vol.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{vol.title}</CardTitle>
                          <CardDescription>{vol.description}</CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Leer
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {vol.topics.map((topic, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Layers Tab */}
            <TabsContent value="layers">
              <Card className="tamv-card">
                <CardHeader>
                  <CardTitle>Arquitectura Federada de 7 Capas</CardTitle>
                  <CardDescription>
                    Cada capa es autónoma, auditable y versionable
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[...layers].reverse().map((layer) => (
                      <div 
                        key={layer.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className={`w-8 h-8 rounded-md ${layer.color} flex items-center justify-center text-white text-sm font-bold`}>
                          {layer.id}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Capa {layer.id} — {layer.name}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Activa
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quick Start Tab */}
            <TabsContent value="quick">
              <div className="space-y-6">
                <Card className="tamv-card tamv-gold-border">
                  <CardHeader>
                    <CardTitle>¿Qué es TAMV?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      TAMV Online es una <strong>infraestructura civilizatoria digital soberana</strong>, 
                      diseñada para garantizar memoria verificable, identidad soberana y economía anti-concentración.
                    </p>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm italic">
                        "Si el humano siente que 'entra' a TAMV, el sistema ha fallado. 
                        El humano <strong>despierta dentro</strong> de TAMV. 
                        La presencia es continua, no transaccional."
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">— Axioma Cero</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="tamv-card">
                  <CardHeader>
                    <CardTitle>Principios No Negociables</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0">1</span>
                        <span>La dignidad humana no se negocia</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0">2</span>
                        <span>Toda IA debe ser auditable</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0">3</span>
                        <span>Todo poder debe ser reversible</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0">4</span>
                        <span>Ningún sistema debe depender de una sola persona</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0">5</span>
                        <span>La ley precede al código</span>
                      </li>
                    </ol>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  <Link to="/devhub">
                    <Card className="tamv-card h-full hover:border-primary/50 transition-colors cursor-pointer">
                      <CardContent className="p-6 flex items-center gap-4">
                        <Cpu className="w-10 h-10 text-accent" />
                        <div>
                          <h4 className="font-semibold">DevHub API</h4>
                          <p className="text-sm text-muted-foreground">Documentación técnica</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link to="/atlas">
                    <Card className="tamv-card h-full hover:border-primary/50 transition-colors cursor-pointer">
                      <CardContent className="p-6 flex items-center gap-4">
                        <Map className="w-10 h-10 text-primary" />
                        <div>
                          <h4 className="font-semibold">Atlas 3D</h4>
                          <p className="text-sm text-muted-foreground">Mapa de federación</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
