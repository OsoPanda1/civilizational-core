import { useState, useEffect } from "react";
import { callGateway } from "@/lib/tamv-gateway-client";

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
    const fetchNodes = async () => {
      try {
        const result = await callGateway<{ nodes: FederatedNodeData[] }>("ops.nodes.list");
        setNodes(result.nodes || []);
      } catch (e) {
        console.error("Failed to fetch nodes via gateway:", e);
      }
      setLoading(false);
    };
    fetchNodes();
  }, []);

  return { nodes, loading };
}
