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
  Eye
} from "lucide-react";

export default function Index() {
  const { user, loading } = useAuth();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 20%, hsl(43 96% 56% / 0.1) 0%, transparent 60%)"
          }}
        />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-gold" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                Sistema Civilizacional v1.0
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-foreground">Territorio Autónomo</span>
              <br />
              <span className="text-gradient-gold">de Memoria Viva</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Donde la memoria limita al poder, y la dignidad dicta lo que la tecnología puede hacer.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!loading && !user ? (
                <>
                  <Link to="/auth/register">
                    <Button size="lg" className="w-full sm:w-auto tamv-glow">
                      Unirse a TAMV
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/devhub">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      <Code className="w-4 h-4 mr-2" />
                      DevHub API
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
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-3">Arquitectura Civilizacional</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Un sistema operativo digital soberano, auditable y no capturable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="tamv-card p-6 tamv-gold-border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">ID-NVIDA</h3>
              <p className="text-sm text-muted-foreground">
                Identidad digital soberana con biometría cancelable y consentimiento granular
              </p>
            </div>

            {/* Feature 2 */}
            <div className="tamv-card p-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">BookPI Ledger</h3>
              <p className="text-sm text-muted-foreground">
                Registro inmutable de eventos con hash encadenado SHA-256 verificable
              </p>
            </div>

            {/* Feature 3 */}
            <div className="tamv-card p-6">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-success" />
              </div>
              <h3 className="font-semibold mb-2">Isabella AI</h3>
              <p className="text-sm text-muted-foreground">
                Gobernanza algorítmica ética con pipeline cognitivo y HITL supervisado
              </p>
            </div>

            {/* Feature 4 */}
            <div className="tamv-card p-6">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                <Code className="w-5 h-5 text-warning" />
              </div>
              <h3 className="font-semibold mb-2">DevHub API</h3>
              <p className="text-sm text-muted-foreground">
                API pública RESTful para integración con ecosistemas externos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-20 border-t border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Principios No Negociables</h2>
            
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
        </div>
      </section>
    </MainLayout>
  );
}
