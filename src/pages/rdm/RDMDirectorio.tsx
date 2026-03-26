import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RDMLayout } from "@/components/rdm/RDMLayout";
import { supabase } from "@/integrations/supabase/client";
import { Store, MapPin, Search } from "lucide-react";
import { BUSINESS_CATEGORIES } from "@/lib/rdm-data";

interface Business {
  id: string;
  name: string;
  category: string;
  description: string | null;
  lat: number;
  lng: number;
  status: string | null;
  phone: string | null;
}

export default function RDMDirectorio() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    supabase.from("businesses").select("*").order("name").then(({ data }) => {
      if (data) setBusinesses(data as Business[]);
    });
  }, []);

  const filtered = businesses
    .filter((b) => activeCategory === "all" || b.category === activeCategory)
    .filter((b) => !searchTerm || b.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <RDMLayout>
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <p className="text-sm tracking-[0.3em] uppercase text-[hsl(var(--rdm-amber))] mb-2" style={{ fontFamily: "var(--font-body)" }}>
              Infraestructura Comercial
            </p>
            <h1 className="text-4xl md:text-6xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Directorio
            </h1>
            <p className="mt-3 text-[hsl(215_13%_42%)] max-w-2xl" style={{ fontFamily: "var(--font-body)" }}>
              Negocios verificados de Real del Monte. Datos locales, infraestructura local, beneficio local.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(215_13%_42%)]" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar negocio..."
                className="w-full rounded-xl border border-[hsl(220_11%_82%)] bg-white/80 py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--rdm-amber)/0.3)]"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                activeCategory === "all" ? "bg-[hsl(var(--rdm-amber))] text-white border-[hsl(var(--rdm-amber))]" : "bg-white/70 border-[hsl(220_11%_82%)]"
              }`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              Todas
            </button>
            {BUSINESS_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  activeCategory === cat.id ? "bg-[hsl(var(--rdm-amber))] text-white border-[hsl(var(--rdm-amber))]" : "bg-white/70 border-[hsl(220_11%_82%)]"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((biz, i) => (
              <motion.div
                key={biz.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rdm-glass rounded-xl p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>{biz.name}</h3>
                    <p className="text-xs text-[hsl(var(--rdm-amber))] uppercase tracking-wider mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
                      {biz.category}
                    </p>
                  </div>
                  <span className={`w-2 h-2 rounded-full mt-2 ${biz.status === "active" ? "bg-[hsl(var(--rdm-green))]" : "bg-[hsl(215_13%_42%)]"}`} />
                </div>
                {biz.description && (
                  <p className="text-sm text-[hsl(215_13%_42%)] mb-3 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {biz.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-[hsl(215_13%_42%)]" style={{ fontFamily: "var(--font-body)" }}>
                  <MapPin className="w-3 h-3" />
                  {biz.lat.toFixed(3)}°N, {Math.abs(biz.lng).toFixed(3)}°W
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Store className="w-12 h-12 text-[hsl(215_13%_42%)] mx-auto mb-4" />
              <p className="text-[hsl(215_13%_42%)]" style={{ fontFamily: "var(--font-body)" }}>
                No se encontraron negocios. Prueba otro filtro.
              </p>
            </div>
          )}
        </div>
      </main>
    </RDMLayout>
  );
}
