import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RDMLayout } from "@/components/rdm/RDMLayout";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, Star } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  location: string | null;
  category: string | null;
  is_featured: boolean | null;
}

export default function RDMEventos() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    supabase.from("events").select("*").order("event_date").then(({ data }) => {
      if (data) setEvents(data as Event[]);
    });
  }, []);

  return (
    <RDMLayout>
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <p className="text-sm tracking-[0.3em] uppercase text-[hsl(var(--rdm-amber))] mb-2" style={{ fontFamily: "var(--font-body)" }}>
              Agenda Territorial
            </p>
            <h1 className="text-4xl md:text-6xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Eventos</h1>
            <p className="mt-3 text-[hsl(215_13%_42%)] max-w-2xl" style={{ fontFamily: "var(--font-body)" }}>
              Festivales, tradiciones y experiencias que mantienen viva la cultura de Real del Monte.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`rdm-glass rounded-xl p-6 ${event.is_featured ? "border-2 border-[hsl(var(--rdm-amber)/0.3)]" : ""}`}
              >
                {event.is_featured && (
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-3 h-3 text-[hsl(var(--rdm-amber))]" fill="hsl(24 72% 50%)" />
                    <span className="text-[10px] uppercase tracking-wider text-[hsl(var(--rdm-amber))] font-medium" style={{ fontFamily: "var(--font-body)" }}>
                      Destacado
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>{event.title}</h3>
                {event.description && (
                  <p className="text-sm text-[hsl(215_13%_42%)] mb-4 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {event.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 text-xs text-[hsl(215_13%_42%)]" style={{ fontFamily: "var(--font-body)" }}>
                  {event.event_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(event.event_date).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  )}
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </span>
                  )}
                  {event.category && (
                    <span className="px-2 py-0.5 rounded-full bg-[hsl(var(--rdm-amber)/0.1)] text-[hsl(var(--rdm-amber))]">
                      {event.category}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </RDMLayout>
  );
}
