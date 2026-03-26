import { RDMPageShell } from "@/components/rdm/RDMPageShell";

export default function RDMHistoria() {
  return (
    <RDMPageShell
      eyebrow="Memoria de Alta Fidelidad"
      title="Historia"
      description="500 años de legado minero: de la plata novohispana a la migración cornish que trajo el futbol, los pastes y las técnicas de extracción que transformaron la región."
      bullets={[
        "Capas de tiempo interactivas con narrativa guiada desde la era prehispánica hasta el presente.",
        "Museografía digital con archivos históricos, fotografías de época y testimonios comunitarios.",
        "Conexión con lugares, relatos y archivo patrimonial verificable en BookPI.",
      ]}
    />
  );
}
