import { RDMPageShell } from "@/components/rdm/RDMPageShell";

export default function RDMGastronomia() {
  return (
    <RDMPageShell
      eyebrow="Sabor Territorial"
      title="Gastronomía"
      description="Selección gastronómica premium: pastes cornish, cocina regional, café de altura y experiencias culinarias únicas a 2,700 metros."
      bullets={[
        "Rutas por especialidad: pastes artesanales, cocina de autor, cafeterías y panaderías tradicionales.",
        "Fichas de negocio con horarios, nivel de demanda, precios estimados y reseñas comunitarias.",
        "Curaduría editorial para elevar el turismo gastronómico con narrativas de origen y tradición.",
      ]}
    />
  );
}
