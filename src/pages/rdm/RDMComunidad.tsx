import { RDMPageShell } from "@/components/rdm/RDMPageShell";

export default function RDMComunidad() {
  return (
    <RDMPageShell
      eyebrow="Tejido Social"
      title="Comunidad"
      description="Espacio colaborativo para residentes, visitantes y negocios de Real del Monte con gobernanza transparente y participación digital."
      bullets={[
        "Foros temáticos con moderación comunitaria y sistema de reputación contextual.",
        "Programas de voluntariado, embajadores locales y participación ciudadana digital.",
        "Integración con el Muro de Recuerdos: historias, fotos y testimonios de la comunidad.",
      ]}
    />
  );
}
