 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
 };
 
 async function sha256(message: string): Promise<string> {
   const msgBuffer = new TextEncoder().encode(message);
   const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
   const hashArray = Array.from(new Uint8Array(hashBuffer));
   return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
 }
 
 interface PhoenixRequest {
   action: "status" | "transaction" | "evolve_world";
   amount?: number;
   asset_type?: string;
   asset_id?: string;
 }
 
 serve(async (req) => {
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
     const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
     const supabase = createClient(supabaseUrl, supabaseServiceKey);
 
     const body: PhoenixRequest = await req.json();
     const { action } = body;
 
     if (action === "status") {
       // Get Phoenix Fund balance using the database function
       const { data: balanceData } = await supabase.rpc("get_phoenix_fund_balance");
       const { data: healthData } = await supabase.rpc("get_economic_health");
 
       // Get recent transactions
       const { data: recentTx } = await supabase
         .from("phoenix_transactions")
         .select("total_amount, creator_payout, system_fund, asset_type, created_at")
         .eq("tx_status", "completed")
         .order("created_at", { ascending: false })
         .limit(10);
 
       // Calculate distribution stats
       const { data: stats } = await supabase
         .from("phoenix_transactions")
         .select("total_amount, creator_payout, system_fund")
         .eq("tx_status", "completed");
 
       const totalVolume = stats?.reduce((sum, tx) => sum + Number(tx.total_amount), 0) || 0;
       const totalCreatorPayouts = stats?.reduce((sum, tx) => sum + Number(tx.creator_payout), 0) || 0;
       const totalSystemFund = stats?.reduce((sum, tx) => sum + Number(tx.system_fund), 0) || 0;
 
       return new Response(
         JSON.stringify({
           protocol: "PHOENIX",
           status: "ACTIVE",
           fund_balance: balanceData || 0,
           economic_health: healthData || 0,
           distribution_rule: "75/25",
           statistics: {
             total_volume: totalVolume,
             total_creator_payouts: totalCreatorPayouts,
             total_system_fund: totalSystemFund,
             transaction_count: stats?.length || 0,
           },
           recent_transactions: recentTx || [],
           timestamp: new Date().toISOString(),
         }),
         { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     if (action === "transaction") {
       // Get user from auth header
       const authHeader = req.headers.get("Authorization");
       if (!authHeader) {
         return new Response(
           JSON.stringify({ error: "Authorization required" }),
           { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
         );
       }
 
       const token = authHeader.replace("Bearer ", "");
       const { data: { user }, error: authError } = await supabase.auth.getUser(token);
       
       if (authError || !user) {
         return new Response(
           JSON.stringify({ error: "Invalid token" }),
           { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
         );
       }
 
       const { amount, asset_type, asset_id } = body;
 
       if (!amount || amount <= 0) {
         return new Response(
           JSON.stringify({ error: "Valid amount required" }),
           { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
         );
       }
 
       // Get or create citizen identity
       let { data: citizen } = await supabase
         .from("citizen_identity")
         .select("id")
         .eq("user_id", user.id)
         .maybeSingle();
 
       if (!citizen) {
         const { data: newCitizen } = await supabase
           .from("citizen_identity")
           .insert({ user_id: user.id })
           .select("id")
           .single();
         citizen = newCitizen;
       }
 
       // Generate MSR hash
       const msrHash = await sha256(
         `TX:${user.id}:${amount}:${asset_type}:${Date.now()}`
       );
 
       // Get previous transaction hash for chain
       const { data: lastTx } = await supabase
         .from("phoenix_transactions")
         .select("msr_hash")
         .eq("citizen_id", citizen?.id)
         .order("created_at", { ascending: false })
         .limit(1)
         .maybeSingle();
 
       // Record transaction
       const { data: newTx, error: txError } = await supabase
         .from("phoenix_transactions")
         .insert({
           citizen_id: citizen?.id,
           asset_id: asset_id || null,
           asset_type: asset_type || "GENERAL",
           total_amount: amount,
           tx_status: "completed",
           msr_hash: msrHash,
           prev_hash: lastTx?.msr_hash || null,
           metadata: { source: "phoenix-protocol", timestamp: new Date().toISOString() },
         })
         .select()
         .single();
 
       if (txError) {
         console.error("Transaction error:", txError);
         return new Response(
           JSON.stringify({ error: "Transaction failed" }),
           { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
         );
       }
 
       return new Response(
         JSON.stringify({
           success: true,
           transaction: {
             id: newTx.id,
             total_amount: newTx.total_amount,
             creator_payout: newTx.creator_payout,
             system_fund: newTx.system_fund,
             msr_hash: newTx.msr_hash,
           },
           message: `Transaction recorded: ${amount} TAMV-T (75% creator, 25% Phoenix Fund)`,
         }),
         { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     if (action === "evolve_world") {
       // Get current economic health and update world entities
       const { data: health } = await supabase.rpc("get_economic_health");
 
       // Update all world entities temporal state based on economic health
       const temporalDelta = (health || 0) * 0.1;
 
       const { error: updateError } = await supabase
         .from("world_entities")
         .update({
           temporal_state: temporalDelta,
           structural_integrity: Math.max(0.5, health || 0),
         })
         .lt("temporal_state", 1.0);
 
       return new Response(
         JSON.stringify({
           success: !updateError,
           economic_health: health,
           world_evolution: temporalDelta,
           message: "World entities evolved based on Phoenix Fund health",
         }),
         { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     return new Response(
       JSON.stringify({ error: "Invalid action" }),
       { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   } catch (error) {
     console.error("Phoenix protocol error:", error);
     return new Response(
       JSON.stringify({ error: "Protocol processing failed" }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });