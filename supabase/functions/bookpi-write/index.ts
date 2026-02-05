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
 
 interface BookPIWriteRequest {
   event_type: string;
   metadata?: Record<string, unknown>;
 }
 
 serve(async (req) => {
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
     const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
     const supabase = createClient(supabaseUrl, supabaseServiceKey);
 
     // Get user from auth header
     const authHeader = req.headers.get("Authorization");
     if (!authHeader) {
       return new Response(
         JSON.stringify({ error: "Missing authorization header" }),
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
 
     const body: BookPIWriteRequest = await req.json();
     const { event_type, metadata = {} } = body;
 
     if (!event_type) {
       return new Response(
         JSON.stringify({ error: "event_type is required" }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     // Get the previous hash for this user (chain integrity)
     const { data: lastEvent } = await supabase
       .from("identity_events")
       .select("hash")
       .eq("user_id", user.id)
       .order("created_at", { ascending: false })
       .limit(1)
       .maybeSingle();
 
     const prev_hash = lastEvent?.hash || null;
     const timestamp = new Date().toISOString();
 
     // Calculate new hash: SHA256(prev_hash + event_type + metadata + timestamp)
     const hashInput = `${prev_hash || "GENESIS"}:${event_type}:${JSON.stringify(metadata)}:${timestamp}`;
     const hash = await sha256(hashInput);
 
     // Insert the new event
     const { data: newEvent, error: insertError } = await supabase
       .from("identity_events")
       .insert({
         user_id: user.id,
         event_type,
         hash,
         prev_hash,
         metadata,
       })
       .select()
       .single();
 
     if (insertError) {
       console.error("Insert error:", insertError);
       return new Response(
         JSON.stringify({ error: "Failed to record event" }),
         { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     return new Response(
       JSON.stringify({
         success: true,
         event: {
           id: newEvent.id,
           event_type: newEvent.event_type,
           hash: newEvent.hash,
           prev_hash: newEvent.prev_hash,
           created_at: newEvent.created_at,
         },
         message: "Event recorded in BookPI Ledger",
       }),
       { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   } catch (error) {
     console.error("BookPI error:", error);
     return new Response(
       JSON.stringify({ error: "Internal server error" }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });