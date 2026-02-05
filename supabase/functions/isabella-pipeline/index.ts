 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
 };
 
 // SHA-256 hash function
 async function sha256(message: string): Promise<string> {
   const msgBuffer = new TextEncoder().encode(message);
   const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
   const hashArray = Array.from(new Uint8Array(hashBuffer));
   return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
 }
 
 interface IsabellaRequest {
   intent: string;
   context?: Record<string, unknown>;
   payload?: string;
 }
 
 interface StageResult {
   stage: string;
   passed: boolean;
   score: number;
   notes: string[];
 }
 
 // Stage 1: Normalize input
 function normalizeInput(payload: string): StageResult {
   const cleaned = payload.trim().toLowerCase();
   const wordCount = cleaned.split(/\s+/).length;
   
   return {
     stage: "normalize",
     passed: wordCount > 0 && wordCount < 10000,
     score: Math.min(wordCount / 100, 1),
     notes: [`Word count: ${wordCount}`, `Cleaned length: ${cleaned.length}`],
   };
 }
 
 // Stage 2: Classify intent
 function classifyIntent(intent: string): StageResult {
   const categories = {
     content: ["post", "comment", "create", "publish", "share"],
     moderation: ["report", "flag", "block", "ban"],
     economic: ["buy", "sell", "transfer", "tip", "subscribe"],
     governance: ["vote", "propose", "delegate"],
     identity: ["verify", "update", "claim"],
   };
 
   let category = "unknown";
   let confidence = 0.5;
 
   for (const [cat, keywords] of Object.entries(categories)) {
     if (keywords.some((k) => intent.toLowerCase().includes(k))) {
       category = cat;
       confidence = 0.85;
       break;
     }
   }
 
   return {
     stage: "classify",
     passed: category !== "unknown",
     score: confidence,
     notes: [`Category: ${category}`, `Confidence: ${confidence}`],
   };
 }
 
 // Stage 3: Ethics evaluation
 function evaluateEthics(payload: string): StageResult {
   const violations: string[] = [];
   const score = 1.0;
 
   // Check for ethical red flags
   const harmfulPatterns = [
     /\b(hate|kill|attack|destroy)\b/i,
     /\b(spam|scam|fraud)\b/i,
     /\b(exploit|manipulate)\b/i,
   ];
 
   for (const pattern of harmfulPatterns) {
     if (pattern.test(payload)) {
       violations.push(`Potential violation: ${pattern.source}`);
     }
   }
 
   const finalScore = Math.max(0, score - violations.length * 0.25);
 
   return {
     stage: "ethics",
     passed: finalScore >= 0.75,
     score: finalScore,
     notes: violations.length > 0 ? violations : ["No ethical violations detected"],
   };
 }
 
 // Stage 4: Security check
 function checkSecurity(payload: string, context: Record<string, unknown>): StageResult {
   const issues: string[] = [];
   let score = 1.0;
 
   // Check for injection patterns
   if (/<script/i.test(payload) || /javascript:/i.test(payload)) {
     issues.push("Potential XSS detected");
     score -= 0.5;
   }
 
   // Check for SQL injection patterns
   if (/(\bor\b|\band\b).*=/i.test(payload) && /['";]/.test(payload)) {
     issues.push("Potential SQL injection pattern");
     score -= 0.3;
   }
 
   return {
     stage: "security",
     passed: score >= 0.7,
     score: Math.max(0, score),
     notes: issues.length > 0 ? issues : ["No security issues detected"],
   };
 }
 
 // Stage 5: Governance check
 function checkGovernance(intent: string, context: Record<string, unknown>): StageResult {
   const requiresApproval = ["ban", "delete", "transfer_large", "modify_rules"];
   const needsHITL = requiresApproval.some((r) => intent.toLowerCase().includes(r));
 
   return {
     stage: "governance",
     passed: true,
     score: needsHITL ? 0.5 : 1.0,
     notes: needsHITL 
       ? ["Action requires Guardian approval (HITL)"] 
       : ["Automatic approval possible"],
   };
 }
 
 // Stage 6: Final decision
 function makeDecision(stages: StageResult[]): {
   decision: "approve" | "deny" | "escalate";
   confidence: number;
   explanation: string;
   requires_hitl: boolean;
 } {
   const avgScore = stages.reduce((sum, s) => sum + s.score, 0) / stages.length;
   const allPassed = stages.every((s) => s.passed);
   const governanceStage = stages.find((s) => s.stage === "governance");
   const needsHITL = governanceStage?.score === 0.5;
 
   if (!allPassed || avgScore < 0.6) {
     return {
       decision: "deny",
       confidence: 1 - avgScore,
       explanation: "Failed quality/ethics/security checks",
       requires_hitl: false,
     };
   }
 
   if (needsHITL || avgScore < 0.8) {
     return {
       decision: "escalate",
       confidence: avgScore,
       explanation: "Requires human oversight",
       requires_hitl: true,
     };
   }
 
   return {
     decision: "approve",
     confidence: avgScore,
     explanation: "All checks passed",
     requires_hitl: false,
   };
 }
 
 serve(async (req) => {
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   const startTime = Date.now();
 
   try {
     const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
     const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
     const supabase = createClient(supabaseUrl, supabaseServiceKey);
 
     // Get user from auth header
     const authHeader = req.headers.get("Authorization");
     let userId: string | null = null;
 
     if (authHeader) {
       const token = authHeader.replace("Bearer ", "");
       const { data: { user } } = await supabase.auth.getUser(token);
       userId = user?.id || null;
     }
 
     const body: IsabellaRequest = await req.json();
     const { intent, context = {}, payload = "" } = body;
 
     if (!intent) {
       return new Response(
         JSON.stringify({ error: "intent is required" }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     // Run 6-stage pipeline
     const stageResults: StageResult[] = [
       normalizeInput(payload),
       classifyIntent(intent),
       evaluateEthics(payload),
       checkSecurity(payload, context),
       checkGovernance(intent, context),
     ];
 
     const finalDecision = makeDecision(stageResults);
     const processingTime = Date.now() - startTime;
 
     // Generate MSR hash for audit
     const msrHash = await sha256(
       `${intent}:${JSON.stringify(stageResults)}:${finalDecision.decision}:${Date.now()}`
     );
 
     // Record decision in database
     if (userId) {
       await supabase.from("isabella_decisions").insert({
         request_type: intent,
         user_id: userId,
         input_payload: { intent, context, payload },
         stage_results: stageResults.reduce((acc, s) => ({ ...acc, [s.stage]: s }), {}),
         final_decision: finalDecision.decision,
         confidence_score: finalDecision.confidence,
         explanation: finalDecision.explanation,
         ethical_violations: stageResults
           .filter((s) => s.stage === "ethics" && !s.passed)
           .flatMap((s) => s.notes),
         requires_hitl: finalDecision.requires_hitl,
         processing_time_ms: processingTime,
         msr_hash: msrHash,
       });
     }
 
     return new Response(
       JSON.stringify({
         decision: finalDecision.decision,
         explanation: finalDecision.explanation,
         confidence: finalDecision.confidence,
         requires_hitl: finalDecision.requires_hitl,
         stages: stageResults,
         processing_time_ms: processingTime,
         msr_hash: msrHash,
       }),
       { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   } catch (error) {
     console.error("Isabella pipeline error:", error);
     return new Response(
       JSON.stringify({ error: "Pipeline processing failed" }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });