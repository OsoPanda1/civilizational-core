import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, Lock, Unlock } from "lucide-react";
import { toast } from "sonner";
import { type TamvOperationSpec, METHOD_COLORS } from "@/lib/tamv-spec";

interface EndpointCardProps {
  spec: TamvOperationSpec;
  baseUrl: string;
}

export function EndpointCard({ spec, baseUrl }: EndpointCardProps) {
  const [copied, setCopied] = useState(false);

  const curlExample = `curl -X ${spec.method} "${baseUrl}/tamv-gateway" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"operation": "${spec.id}", "payload": {}}'`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(curlExample);
    setCopied(true);
    toast.success("Copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-border/50 rounded-lg p-4 hover:border-primary/30 transition-colors bg-card/50">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={`${METHOD_COLORS[spec.method]} border font-mono text-xs`}>
            {spec.method}
          </Badge>
          <code className="text-xs font-mono text-muted-foreground">{spec.path}</code>
          {spec.authRequired ? (
            <Lock className="w-3 h-3 text-amber-400" />
          ) : (
            <Unlock className="w-3 h-3 text-emerald-400" />
          )}
          {spec.roles && spec.roles.length > 0 && (
            <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
              {spec.roles.join(", ")}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={copyToClipboard} className="shrink-0">
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{spec.description}</p>
      <code className="text-[10px] text-muted-foreground/60 mt-1 block">{spec.id}</code>
    </div>
  );
}
