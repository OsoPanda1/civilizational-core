import { RDMPageShell } from "@/components/rdm/RDMPageShell";

export default function RDMAventura() {
  return (
    <RDMPageShell
      eyebrow="Sierra Salvaje"
      title="Aventura"
      description="Senderismo, miradores, cascadas y rutas de montaña en uno de los ecosistemas más ricos de la Sierra de Pachuca."
      bullets={[
        "Senderos clasificados por dificultad con GPS, puntos de interés y tiempos estimados de recorrido.",
        "Experiencias guiadas: cuatrimotos, rappel, ciclismo de montaña y senderismo nocturno.",
        "Sistema de reservas integrado con operadores turísticos locales verificados.",
      ]}
    />
  );
}
