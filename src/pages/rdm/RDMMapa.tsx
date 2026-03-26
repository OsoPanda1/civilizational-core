import { RDMLayout } from "@/components/rdm/RDMLayout";
import { RDMInteractiveMap } from "@/components/rdm/RDMInteractiveMap";

export default function RDMMapa() {
  return (
    <RDMLayout>
      <div className="pt-20">
        <RDMInteractiveMap />
      </div>
    </RDMLayout>
  );
}
