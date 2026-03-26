import { RDMPageShell } from "@/components/rdm/RDMPageShell";

export default function RDMEcoturismo() {
  return (
    <RDMPageShell
      eyebrow="Turismo Regenerativo"
      title="Ecoturismo"
      description="Experiencias sustentables en la Sierra de Pachuca: senderismo, avistamiento de aves, cabalgatas y conexión con la naturaleza."
      bullets={[
        "Rutas eco-certificadas con impacto ambiental mínimo y contribución comunitaria.",
        "Programas de reforestación participativa vinculados a visitas turísticas.",
        "Alojamientos sustentables y prácticas de turismo regenerativo.",
      ]}
    />
  );
}
