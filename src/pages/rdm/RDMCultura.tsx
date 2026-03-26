import { RDMPageShell } from "@/components/rdm/RDMPageShell";

export default function RDMCultura() {
  return (
    <RDMPageShell
      eyebrow="Tradiciones Ancestrales"
      title="Cultura Viva"
      description="Artesanías, festivales, música, Día de Muertos y el legado cornish-mexicano que hace única a esta comunidad serrana."
      bullets={[
        "Calendario cultural con festividades, exposiciones, talleres y eventos comunitarios.",
        "Galería virtual de artesanos locales: plata, textiles, cerámica y arte popular.",
        "Archivo de tradiciones orales, dichos mineros y relatos de la niebla.",
      ]}
    />
  );
}
