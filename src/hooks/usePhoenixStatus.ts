import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PhoenixStatus {
  fundBalance: number;
  economicHealth: number;
  totalVolume: number;
  transactionCount: number;
}

export function usePhoenixStatus() {
  const [status, setStatus] = useState<PhoenixStatus>({
    fundBalance: 0,
    economicHealth: 0,
    totalVolume: 0,
    transactionCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [balRes, healthRes, txRes] = await Promise.all([
        supabase.rpc("get_phoenix_fund_balance"),
        supabase.rpc("get_economic_health"),
        supabase
          .from("phoenix_transactions")
          .select("total_amount")
          .eq("tx_status", "completed"),
      ]);

      setStatus({
        fundBalance: (balRes.data as number) || 0,
        economicHealth: (healthRes.data as number) || 0,
        totalVolume: txRes.data?.reduce((s, t) => s + Number(t.total_amount), 0) || 0,
        transactionCount: txRes.data?.length || 0,
      });
      setLoading(false);
    };
    fetch();
  }, []);

  return { status, loading };
}
