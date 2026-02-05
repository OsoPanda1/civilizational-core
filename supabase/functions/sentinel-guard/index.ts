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
 
 interface SentinelRequest {
   action: "check" | "report" | "status";
   target_id?: string;
   target_type?: string;
   payload?: Record<string, unknown>;
 }
 
 interface ThreatAnalysis {
   threat_level: "none" | "low" | "medium" | "high" | "critical";
   patterns_detected: string[];
   recommendation: string;
   block_action: boolean;
 }
 
 function analyzePayload(payload: Record<string, unknown>): ThreatAnalysis {
   const patterns: string[] = [];
   let threatScore = 0;
 
   const payloadStr = JSON.stringify(payload).toLowerCase();
 
   // Check for various threat patterns
   if (/<script|javascript:|on\w+=/i.test(payloadStr)) {
     patterns.push("XSS_ATTEMPT");
     threatScore += 40;
   }
 
   if (/union\s+select|drop\s+table|delete\s+from/i.test(payloadStr)) {
     patterns.push("SQL_INJECTION");
     threatScore += 50;
   }
 
   if (/\.\.\//g.test(payloadStr) || /etc\/passwd/i.test(payloadStr)) {
     patterns.push("PATH_TRAVERSAL");
     threatScore += 30;
   }
 
   if (/admin|root|sudo/i.test(payloadStr) && /password|pwd|pass/i.test(payloadStr)) {
     patterns.push("CREDENTIAL_PROBE");
     threatScore += 25;
   }
 
   // Rapid request detection (simplified - in production would use rate limiting)
   if (payload._requestCount && (payload._requestCount as number) > 100) {
     patterns.push("RATE_ABUSE");
     threatScore += 20;
   }
 
   let threatLevel: ThreatAnalysis["threat_level"] = "none";
   if (threatScore >= 50) threatLevel = "critical";
   else if (threatScore >= 30) threatLevel = "high";
   else if (threatScore >= 15) threatLevel = "medium";
   else if (threatScore > 0) threatLevel = "low";
 
   return {
     threat_level: threatLevel,
     patterns_detected: patterns,
     recommendation: threatScore >= 30 
       ? "Block and log for review" 
       : threatScore > 0 
         ? "Monitor closely" 
         : "Allow",
     block_action: threatScore >= 30,
   };
 }
 
 serve(async (req) => {
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
     const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
     const supabase = createClient(supabaseUrl, supabaseServiceKey);
 
     // Extract client IP (simplified)
     const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
 
     const body: SentinelRequest = await req.json();
     const { action, target_id, target_type, payload = {} } = body;
 
     if (action === "status") {
       // Return system status
       const { data: nodes } = await supabase
         .from("federated_nodes")
         .select("*")
         .order("health_score", { ascending: false });
 
       const { data: recentThreats } = await supabase
         .from("sentinel_logs")
         .select("severity, created_at")
         .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
         .order("created_at", { ascending: false })
         .limit(10);
 
       return new Response(
         JSON.stringify({
           status: "OPERATIONAL",
           ast_state: "NORMAL",
           nodes: nodes || [],
           recent_threats: recentThreats || [],
           timestamp: new Date().toISOString(),
         }),
         { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     if (action === "check") {
       // Analyze payload for threats
       const analysis = analyzePayload(payload);
 
       // Log if threat detected
       if (analysis.threat_level !== "none") {
         const msrHash = await sha256(
           `THREAT:${analysis.threat_level}:${JSON.stringify(analysis.patterns_detected)}:${Date.now()}`
         );
 
         await supabase.from("sentinel_logs").insert({
           event_type: "THREAT_DETECTED",
           severity: analysis.threat_level,
           ip_address: clientIP,
           threat_details: {
             patterns: analysis.patterns_detected,
             payload_sample: JSON.stringify(payload).substring(0, 500),
             target_id,
             target_type,
           },
           action_taken: analysis.block_action ? "BLOCKED" : "MONITORED",
           msr_hash: msrHash,
         });
       }
 
       return new Response(
         JSON.stringify({
           allowed: !analysis.block_action,
           threat_level: analysis.threat_level,
           patterns: analysis.patterns_detected,
           recommendation: analysis.recommendation,
         }),
         { 
           status: analysis.block_action ? 403 : 200, 
           headers: { ...corsHeaders, "Content-Type": "application/json" } 
         }
       );
     }
 
     if (action === "report") {
       // Manual threat report
       const msrHash = await sha256(
         `REPORT:${target_type}:${target_id}:${Date.now()}`
       );
 
       await supabase.from("sentinel_logs").insert({
         event_type: "MANUAL_REPORT",
         severity: "medium",
         ip_address: clientIP,
         threat_details: {
           target_id,
           target_type,
           report_details: payload,
         },
         action_taken: "QUEUED_FOR_REVIEW",
         msr_hash: msrHash,
       });
 
       return new Response(
         JSON.stringify({
           success: true,
           message: "Report submitted for Guardian review",
         }),
         { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     return new Response(
       JSON.stringify({ error: "Invalid action" }),
       { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   } catch (error) {
     console.error("Sentinel error:", error);
     return new Response(
       JSON.stringify({ error: "Sentinel processing failed" }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });