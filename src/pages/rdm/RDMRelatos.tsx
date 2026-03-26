import { RDMPageShell } from "@/components/rdm/RDMPageShell";

export default function RDMRelatos() {
  return (
    <RDMPageShell
      eyebrow="Narrativa Territorial"
      title="Relatos & Leyendas"
      description="Historias de la niebla, dichos mineros y leyendas que habitan los callejones de Real del Monte."
      bullets={[
        "Archivo de narrativas orales recopiladas con la comunidad.",
        "Leyendas ilustradas: El Duende de la Mina, La Llorona de la Sierra, El Cornish Fantasma.",
        "Contribuye tus propios relatos y memorias del pueblo.",
      ]}
    />
  );
}
