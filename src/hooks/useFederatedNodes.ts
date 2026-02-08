import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FederatedNodeData {
  id: string;
  node_name: string;
  node_type: string | null;
  status: string | null;
  ast_state: string | null;
  region: string | null;
  health_score: number | null;
  latency_ms: number | null;
  last_heartbeat: string | null;
  metrics: Record<string, unknown> | null;
}

export function useFederatedNodes() {
  const [nodes, setNodes] = useState<FederatedNodeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("federated_nodes")
        .select("*")
        .order("health_score", { ascending: false });
      if (data) setNodes(data as FederatedNodeData[]);
      setLoading(false);
    };
    fetch();
  }, []);

  return { nodes, loading };
}
