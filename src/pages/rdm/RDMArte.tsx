import { RDMPageShell } from "@/components/rdm/RDMPageShell";

export default function RDMArte() {
  return (
    <RDMPageShell
      eyebrow="Expresión Creativa"
      title="Arte & Artesanías"
      description="Galería virtual de artesanos, platerías y creadores culturales de Real del Monte."
      bullets={[
        "Catálogo de artesanos con perfiles, técnicas y portafolio visual.",
        "Conexión directa con talleres para visitantes y residentes.",
        "Integración con economía creativa y sistema de apoyo TAMV.",
      ]}
    />
  );
}
