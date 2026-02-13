import { supabase } from "@/integrations/supabase/client";

export interface GatewayResponse<T = any> {
  status: "success" | "error";
  operation: string;
  domain: string;
  result: T;
  meta: {
    traceId: string;
    processingMs: number;
    mode: "peace" | "alert" | "lockdown";
    version: string;
    userId: string | null;
    roles: string[];
  };
}

export async function callGateway<T = any>(
  operation: string,
  payload: Record<string, any> = {}
): Promise<T> {
  const { data, error } = await supabase.functions.invoke("tamv-gateway", {
    body: { operation, payload },
  });

  if (error) throw error;

  const response = data as GatewayResponse<T>;
  if (response.status === "error") {
    throw new Error((response.result as any)?.error || "Gateway error");
  }

  return response.result;
}
