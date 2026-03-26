import { motion } from "framer-motion";
import { RDMLayout } from "@/components/rdm/RDMLayout";
import { Heart, Star, Zap, Mountain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function RDMApoya() {
  return (
    <RDMLayout>
      <main className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--rdm-amber)/0.1)] flex items-center justify-center mx-auto mb-6">
              <Mountain className="w-8 h-8 text-[hsl(var(--rdm-amber))]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Apoya RDM Digital 🏔️
            </h1>
            <p className="text-lg text-[hsl(215_13%_42%)] max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              Ayúdanos a construir la mejor plataforma turística soberana para Real del Monte.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {[
              { icon: Heart, title: "Impacto Social", desc: "Apoyas el turismo local y la economía de Real del Monte." },
              { icon: Star, title: "Plataforma Mejor", desc: "Tu apoyo nos permite mejorar funcionalidades y contenido." },
              { icon: Zap, title: "Soberanía", desc: "Contribuyes a la independencia tecnológica del pueblo." },
            ].map((item) => (
              <Card key={item.title} className="rdm-glass border-0">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-[hsl(var(--rdm-amber)/0.1)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-[hsl(var(--rdm-amber))]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: "var(--font-display)" }}>{item.title}</h3>
                  <p className="text-sm text-[hsl(215_13%_42%)]" style={{ fontFamily: "var(--font-body)" }}>{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="rdm-glass border-0 max-w-lg mx-auto">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                Formas de Apoyo
              </h2>
              <div className="space-y-3 text-left" style={{ fontFamily: "var(--font-body)" }}>
                {[
                  "💡 Comparte la plataforma con tu comunidad",
                  "🏪 Registra tu negocio en el Directorio",
                  "📸 Contribuye fotos y relatos al Muro de Recuerdos",
                  "🤝 Conviértete en embajador local",
                  "💰 Dona para el desarrollo de nuevas funcionalidades",
                  "🗣️ Propón mejoras y reporta problemas",
                ].map((item) => (
                  <p key={item} className="text-sm text-[hsl(218_24%_18%)] py-2 border-b border-[hsl(220_11%_82%)] last:border-0">
                    {item}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </RDMLayout>
  );
}
