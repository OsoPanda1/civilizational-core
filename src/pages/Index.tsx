 import React, { Suspense, lazy } from "react";
 import { Link } from "react-router-dom";
 import { useAuth } from "@/hooks/useAuth";
 import { MainLayout } from "@/components/layout/MainLayout";
 import { Button } from "@/components/ui/button";
 import { 
   Shield, 
   Users, 
   BookOpen, 
   Code, 
   ArrowRight,
   CheckCircle,
   Lock,
   Eye,
   Zap,
   Globe,
   Brain,
   Layers,
   Activity,
   Database
 } from "lucide-react";
 
 // Lazy load 3D scene for performance
 const TAMVScene = lazy(() => import("@/components/xr/TAMVScene"));

export default function Index() {
  const { user, loading } = useAuth();

  return (
    <MainLayout>
      {/* Hero Section */}
       <section className="relative py-12 lg:py-20 overflow-hidden">
        {/* Background glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 20%, hsl(43 96% 56% / 0.1) 0%, transparent 60%)"
          }}
        />
        
         <div className="container mx-auto px-4 relative z-10">
           <div className="grid lg:grid-cols-2 gap-8 items-center">
             {/* Left: Text content */}
             <div className="text-center lg:text-left">
            {/* Badge */}
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-gold" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                   Sistema Civilizacional MD-X4 v1.0
              </span>
            </div>

            {/* Headline */}
               <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              <span className="text-foreground">Territorio Autónomo</span>
              <br />
              <span className="text-gradient-gold">de Memoria Viva</span>
            </h1>

            {/* Subtitle */}
               <p className="text-base text-muted-foreground mb-6 max-w-xl lg:mx-0 mx-auto">
                 Infraestructura civilizatoria digital soberana. Donde la memoria limita al poder, 
                 y la dignidad dicta lo que la tecnología puede hacer.
            </p>

            {/* CTA Buttons */}
               <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-3">
              {!loading && !user ? (
                <>
                  <Link to="/auth/register">
                       <Button size="lg" className="tamv-glow">
                      Unirse a TAMV
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                     <Link to="/atlas">
                       <Button variant="outline" size="lg">
                         <Globe className="w-4 h-4 mr-2" />
                         Explorar Atlas
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/feed">
                    <Button size="lg" className="tamv-glow">
                      Ir al Feed
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="outline" size="lg">
                      Mi Perfil
                    </Button>
                  </Link>
                </>
              )}
               </div>
            </div>
             
             {/* Right: 3D Scene */}
             <div className="h-[350px] lg:h-[450px] relative">
               <Suspense fallback={
                 <div className="w-full h-full flex items-center justify-center bg-card/50 rounded-lg border border-border">
                   <div className="text-center">
                     <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                     <p className="text-sm text-muted-foreground">Cargando realidad 4D...</p>
                   </div>
                 </div>
               }>
                 <TAMVScene showNodes={true} showIsabella={true} interactive={true} />
               </Suspense>
             </div>
          </div>
        </div>
      </section>

       {/* Stats Section */}
       <section className="py-8 border-t border-border bg-card/30">
         <div className="container mx-auto px-4">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
             <div>
               <div className="text-2xl font-bold text-primary">7</div>
               <div className="text-xs text-muted-foreground">Capas Federadas</div>
             </div>
             <div>
               <div className="text-2xl font-bold text-accent">22</div>
               <div className="text-xs text-muted-foreground">Capas Seguridad</div>
             </div>
             <div>
               <div className="text-2xl font-bold text-success">75/25</div>
               <div className="text-xs text-muted-foreground">Regla de Oro</div>
             </div>
             <div>
               <div className="text-2xl font-bold text-warning">&lt;30ms</div>
               <div className="text-xs text-muted-foreground">Latencia Global</div>
             </div>
           </div>
         </div>
       </section>
 
      {/* Features Section */}
       <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4">
           <div className="text-center mb-10">
             <h2 className="text-2xl font-bold mb-2">Arquitectura Civilizacional de 7 Capas</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
               Sistema Tenochtitlán: infraestructura soberana, federada y auditable
            </p>
          </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Feature 1 */}
            <div className="tamv-card p-6 tamv-gold-border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-primary" />
              </div>
               <h3 className="font-semibold mb-2">ID-NVIDA™</h3>
              <p className="text-sm text-muted-foreground">
                 Identidad digital soberana con DID W3C, biometría cancelable ZKP y consentimiento multinivel
              </p>
            </div>

            {/* Feature 2 */}
            <div className="tamv-card p-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                 <Database className="w-5 h-5 text-accent" />
              </div>
               <h3 className="font-semibold mb-2">BookPI™ + MSR Ledger</h3>
              <p className="text-sm text-muted-foreground">
                 Registro inmutable con hash SHA-256 encadenado y memoria civilizatoria verificable
              </p>
            </div>

            {/* Feature 3 */}
            <div className="tamv-card p-6">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                 <Brain className="w-5 h-5 text-success" />
              </div>
               <h3 className="font-semibold mb-2">Isabella AI™</h3>
              <p className="text-sm text-muted-foreground">
                 Pipeline cognitivo de 6 etapas con KEC (Kernel Ético Central) y XAI obligatorio
              </p>
            </div>

            {/* Feature 4 */}
            <div className="tamv-card p-6">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                 <Zap className="w-5 h-5 text-warning" />
               </div>
               <h3 className="font-semibold mb-2">Protocolo Fénix</h3>
               <p className="text-sm text-muted-foreground">
                 Economía 75/25 anti-concentración con Fondo de Reserva de Integridad (FRI)
               </p>
             </div>
 
             {/* Feature 5 */}
             <div className="tamv-card p-6">
               <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                 <Activity className="w-5 h-5 text-destructive" />
               </div>
               <h3 className="font-semibold mb-2">Anubis Sentinel™</h3>
               <p className="text-sm text-muted-foreground">
                 Watchdog Zero-Trust con detección de corrupción lógica y safe-mode automático
               </p>
             </div>
 
             {/* Feature 6 */}
             <div className="tamv-card p-6">
               <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center mb-4">
                 <Layers className="w-5 h-5 text-muted-foreground" />
              </div>
               <h3 className="font-semibold mb-2">DreamSpaces™ XR</h3>
              <p className="text-sm text-muted-foreground">
                 Espacios 4D con física procedural, audio espacial y evolución basada en economía
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles Section */}
       <section className="py-16 border-t border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
             <h2 className="text-2xl font-bold mb-6 text-center">Principios No Negociables</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-background border border-border">
                <CheckCircle className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium mb-1">Toda escritura requiere sesión válida</h4>
                  <p className="text-sm text-muted-foreground">Sin autenticación, sin acceso. Cero excepciones.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-background border border-border">
                <Lock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium mb-1">Toda tabla tiene RLS</h4>
                  <p className="text-sm text-muted-foreground">Row Level Security en cada tabla. Sin datos expuestos.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-background border border-border">
                <Eye className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium mb-1">Toda acción genera evento</h4>
                  <p className="text-sm text-muted-foreground">Auditoría completa. Todo hash es verificable.</p>
                </div>
              </div>
            </div>
          </div>
           
           {/* Quick Links */}
           <div className="flex flex-wrap justify-center gap-3 mt-8">
             <Link to="/atlas">
               <Button variant="outline" size="sm">
                 <Globe className="w-4 h-4 mr-2" />
                 Atlas 3D
               </Button>
             </Link>
             <Link to="/devhub">
               <Button variant="outline" size="sm">
                 <Code className="w-4 h-4 mr-2" />
                 DevHub API
               </Button>
             </Link>
             <Link to="/guardian">
               <Button variant="outline" size="sm">
                 <Shield className="w-4 h-4 mr-2" />
                 Guardian Console
               </Button>
             </Link>
             <Link to="/docs">
               <Button variant="outline" size="sm">
                 <BookOpen className="w-4 h-4 mr-2" />
                 Documentación
               </Button>
             </Link>
           </div>
        </div>
      </section>
    </MainLayout>
  );
}
