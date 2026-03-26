import { RDMPageShell } from "@/components/rdm/RDMPageShell";

export default function RDMRutas() {
  return (
    <RDMPageShell
      eyebrow="Planificación Orquestada"
      title="Rutas"
      description="Constructor de itinerarios inteligentes para viajes memorables en Real del Monte."
      bullets={[
        "Plantillas rápidas por duración: 2 horas, medio día, día completo y fin de semana.",
        "Optimización por clima, movilidad y preferencias personales.",
        "Exportación y compartición colaborativa de itinerarios entre grupos de viajeros.",
      ]}
    />
  );
}
