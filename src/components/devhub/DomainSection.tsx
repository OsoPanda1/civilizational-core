import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { EndpointCard } from "./EndpointCard";
import { type TamvDomain, type TamvOperationSpec, DOMAIN_META } from "@/lib/tamv-spec";

interface DomainSectionProps {
  domain: TamvDomain;
  endpoints: TamvOperationSpec[];
  baseUrl: string;
  defaultOpen?: boolean;
}

export function DomainSection({ domain, endpoints, baseUrl, defaultOpen = false }: DomainSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const meta = DOMAIN_META[domain];

  return (
    <Card className="tamv-card overflow-hidden">
      <CardHeader
        className="cursor-pointer hover:bg-muted/30 transition-colors py-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-base">
            <Button variant="ghost" size="sm" className="p-0 h-auto">
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
            <span>{meta.label}</span>
            <Badge variant="secondary" className="text-xs">{endpoints.length}</Badge>
          </CardTitle>
          <div className="flex gap-1">
            {["GET", "POST", "PATCH", "DELETE"].map(m => {
              const count = endpoints.filter(e => e.method === m).length;
              return count > 0 ? (
                <Badge key={m} variant="outline" className="text-[10px] font-mono">
                  {m}:{count}
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="pt-0 space-y-2">
          {endpoints.map(ep => (
            <EndpointCard key={ep.id} spec={ep} baseUrl={baseUrl} />
          ))}
        </CardContent>
      )}
    </Card>
  );
}
