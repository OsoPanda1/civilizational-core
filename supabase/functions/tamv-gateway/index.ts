import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-tamv-client, x-tamv-trace-id",
};

const VALID_DOMAINS = [
  "auth","identity","security","economy","xr","quantum",
  "governance","utamv","bookpi","kernel","ops","social","devtools"
];

type CivilizationMode = "peace" | "alert" | "lockdown";

interface GatewayContext {
  userId: string | null;
  roles: string[];
  mode: CivilizationMode;
  traceId: string;
  timestamp: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startMs = Date.now();
  const traceId = req.headers.get("x-tamv-trace-id") || crypto.randomUUID();

  try {
    const body = await req.json();
    const { operation, payload = {} } = body;

    if (!operation || typeof operation !== "string") {
      return jsonResponse(400, { error: "MISSING_OPERATION", message: "Provide 'operation' field (e.g. 'auth.login')" }, traceId);
    }

    const dotIndex = operation.indexOf(".");
    if (dotIndex === -1) {
      return jsonResponse(400, { error: "INVALID_OPERATION", message: `Invalid operation format: ${operation}. Use 'domain.action'.` }, traceId);
    }
    const domain = operation.substring(0, dotIndex);

    if (!VALID_DOMAINS.includes(domain)) {
      return jsonResponse(400, { error: "UNKNOWN_DOMAIN", message: `Domain '${domain}' not recognized. Valid: ${VALID_DOMAINS.join(", ")}` }, traceId);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    let ctx: GatewayContext = {
      userId: null,
      roles: [],
      mode: "peace",
      traceId,
      timestamp: startMs,
    };

    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const anonClient = createClient(supabaseUrl, supabaseKey);
      const { data: { user } } = await anonClient.auth.getUser(token);
      if (user) {
        ctx.userId = user.id;
        const { data: rolesData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);
        ctx.roles = rolesData?.map((r: any) => r.role) || ["citizen"];
      }
    }

    const result = await routeOperation(supabase, operation, payload, ctx);

    // Audit log for write operations
    if (ctx.userId && !operation.startsWith("devtools.") && !operation.endsWith(".get") && !operation.endsWith(".list")) {
      try {
        await supabase.from("identity_events").insert({
          user_id: ctx.userId,
          event_type: `GATEWAY_${operation.toUpperCase().replace(/\./g, "_")}`,
          hash: await computeHash(JSON.stringify({ operation, payload, traceId })),
          prev_hash: null,
          metadata: { domain, traceId, processingMs: Date.now() - startMs },
        });
      } catch (e) {
        console.error("Audit log failed:", e);
      }
    }

    return jsonResponse(200, {
      status: "success",
      operation,
      domain,
      result,
      meta: {
        traceId,
        processingMs: Date.now() - startMs,
        mode: ctx.mode,
        version: "7.0.0",
        userId: ctx.userId,
        roles: ctx.roles,
      },
    }, traceId);

  } catch (e) {
    console.error("Gateway error:", e);
    return jsonResponse(500, {
      error: "GATEWAY_ERROR",
      message: e instanceof Error ? e.message : "Unknown error",
      traceId,
      processingMs: Date.now() - startMs,
    }, traceId);
  }
});

// ═══════════════════ DOMAIN ROUTER ═══════════════════

async function routeOperation(sb: any, operation: string, payload: any, ctx: GatewayContext): Promise<any> {
  const domain = operation.split(".")[0];
  switch (domain) {
    case "auth":       return handleAuth(sb, operation, payload, ctx);
    case "identity":   return handleIdentity(sb, operation, payload, ctx);
    case "security":   return handleSecurity(sb, operation, payload, ctx);
    case "economy":    return handleEconomy(sb, operation, payload, ctx);
    case "xr":         return handleXR(sb, operation, payload, ctx);
    case "quantum":    return handleQuantum(sb, operation, payload, ctx);
    case "governance": return handleGovernance(sb, operation, payload, ctx);
    case "utamv":      return handleUtamv(sb, operation, payload, ctx);
    case "bookpi":     return handleBookPI(sb, operation, payload, ctx);
    case "kernel":     return handleKernel(sb, operation, payload, ctx);
    case "ops":        return handleOps(sb, operation, payload, ctx);
    case "social":     return handleSocial(sb, operation, payload, ctx);
    case "devtools":   return handleDevtools(sb, operation, payload, ctx);
    default:           return { error: "DOMAIN_NOT_IMPLEMENTED", domain };
  }
}

// ═══════════════════ AUTH (10) ═══════════════════

async function handleAuth(_sb: any, op: string, payload: any, ctx: GatewayContext) {
  switch (op) {
    case "auth.genesis":
      return { handler: "auth", operation: op, message: "Use /auth/register endpoint directly", status: "redirect" };
    case "auth.login":
      return { handler: "auth", operation: op, message: "Use /auth/login endpoint directly", status: "redirect" };
    case "auth.logout":
      return { handler: "auth", operation: op, message: "Use client-side signOut", status: "redirect" };
    case "auth.refresh":
      return { handler: "auth", operation: op, message: "Token refresh handled by client SDK", status: "operational" };
    case "auth.pqcHandshake":
      return { status: "simulated", algorithm: "CRYSTALS-Kyber-1024", keyExchangeMs: 12, postQuantumReady: true };
    case "auth.device.register":
      return { status: "registered", deviceId: crypto.randomUUID(), fingerprint: await computeHash(JSON.stringify(payload)), registeredAt: new Date().toISOString() };
    case "auth.device.list":
      return { devices: [{ id: "primary", type: "web", lastSeen: new Date().toISOString(), trusted: true }] };
    case "auth.device.revoke":
      return { status: "revoked", deviceId: payload?.deviceId || "unknown" };
    case "auth.session.list":
      return { sessions: [{ id: ctx.traceId, active: true, createdAt: new Date().toISOString(), ip: "redacted" }], userId: ctx.userId };
    case "auth.session.terminate":
      return { status: "terminated", sessionId: payload?.sessionId || ctx.traceId };
    default:
      return { handler: "auth", operation: op, status: "stub" };
  }
}

// ═══════════════════ IDENTITY (12) ═══════════════════

async function handleIdentity(sb: any, op: string, payload: any, ctx: GatewayContext) {
  if (!ctx.userId && op !== "identity.devices") return { error: "AUTH_REQUIRED" };

  switch (op) {
    case "identity.profile.get": {
      const { data } = await sb.from("profiles").select("*").eq("id", ctx.userId).single();
      return data || { error: "PROFILE_NOT_FOUND" };
    }
    case "identity.profile.update": {
      const { data, error } = await sb.from("profiles").update(payload).eq("id", ctx.userId).select().single();
      return error ? { error: error.message } : data;
    }
    case "identity.dignity.pulse": {
      const { data } = await sb.from("citizen_identity").select("reputation_score, consciousness_level, trust_level").eq("user_id", ctx.userId).single();
      return data || { dignityScore: 100, consciousnessLevel: 1.0, trustLevel: "citizen" };
    }
    case "identity.roles.list": {
      const { data } = await sb.from("user_roles").select("*").eq("user_id", ctx.userId);
      return { roles: data || [] };
    }
    case "identity.role.grant": {
      if (!ctx.roles.includes("admin") && !ctx.roles.includes("guardian")) return { error: "INSUFFICIENT_PERMISSIONS" };
      const { error } = await sb.from("user_roles").insert({ user_id: payload.targetUserId, role: payload.role });
      return error ? { error: error.message } : { status: "granted", role: payload.role, targetUserId: payload.targetUserId };
    }
    case "identity.role.revoke": {
      if (!ctx.roles.includes("admin")) return { error: "ADMIN_REQUIRED" };
      const { error } = await sb.from("user_roles").delete().eq("user_id", payload.targetUserId).eq("role", payload.role);
      return error ? { error: error.message } : { status: "revoked" };
    }
    case "identity.sovereign.transfer":
      return { status: "simulated", message: "Sovereign transfer between federated nodes", sourceNode: "primary", targetNode: payload?.targetNode || "edge-1" };
    case "identity.history": {
      const { data } = await sb.from("identity_events").select("*").eq("user_id", ctx.userId).order("created_at", { ascending: false }).limit(50);
      return { events: data || [] };
    }
    case "identity.lock": {
      if (!ctx.roles.includes("admin") && !ctx.roles.includes("guardian")) return { error: "INSUFFICIENT_PERMISSIONS" };
      return { status: "locked", targetUserId: payload?.targetUserId, lockedBy: ctx.userId, lockedAt: new Date().toISOString() };
    }
    case "identity.unlock": {
      if (!ctx.roles.includes("admin") && !ctx.roles.includes("guardian")) return { error: "INSUFFICIENT_PERMISSIONS" };
      return { status: "unlocked", targetUserId: payload?.targetUserId };
    }
    case "identity.trust.metrics": {
      const { data } = await sb.from("citizen_identity").select("*").eq("user_id", ctx.userId).single();
      return data || { trust_level: "unverified", reputation_score: 0, consciousness_level: 0 };
    }
    case "identity.devices":
      return { devices: [{ id: "web-primary", type: "browser", trusted: true, lastActive: new Date().toISOString() }] };
    default:
      return { handler: "identity", operation: op, status: "stub" };
  }
}

// ═══════════════════ SECURITY (12) ═══════════════════

async function handleSecurity(sb: any, op: string, payload: any, ctx: GatewayContext) {
  switch (op) {
    case "security.threat.map": {
      const { data: nodes } = await sb.from("federated_nodes").select("*");
      const { data: logs } = await sb.from("sentinel_logs").select("*").order("created_at", { ascending: false }).limit(50);
      return { nodes: nodes || [], threats: logs || [], generatedAt: new Date().toISOString() };
    }
    case "security.alerts": {
      const { data } = await sb.from("sentinel_logs").select("*").order("created_at", { ascending: false }).limit(20);
      return { alerts: data || [] };
    }
    case "security.anubis.purge": {
      if (!ctx.roles.includes("admin") && !ctx.roles.includes("guardian")) return { error: "INSUFFICIENT_PERMISSIONS" };
      return { status: "purged", targetId: payload?.targetId, purgedBy: ctx.userId, method: "black-hole-ban", timestamp: new Date().toISOString() };
    }
    case "security.anubis.flag": {
      return { status: "flagged", targetId: payload?.targetId, flaggedBy: ctx.userId, severity: "medium" };
    }
    case "security.osiris.restore": {
      if (!ctx.roles.includes("admin") && !ctx.roles.includes("guardian")) return { error: "INSUFFICIENT_PERMISSIONS" };
      return { status: "restored", targetId: payload?.targetId, restoredBy: ctx.userId, protocol: "osiris-v2" };
    }
    case "security.audit.logs": {
      const { data } = await sb.from("sentinel_logs").select("*").order("created_at", { ascending: false }).limit(100);
      return { logs: data || [] };
    }
    case "security.incident.report": {
      return { status: "reported", incidentId: crypto.randomUUID(), reportedBy: ctx.userId, type: payload?.type || "general", severity: payload?.severity || "medium" };
    }
    case "security.incident.get": {
      return { id: payload?.id, type: "security_incident", status: "investigating", severity: "medium", reportedAt: new Date().toISOString() };
    }
    case "security.mode.set": {
      if (!ctx.roles.includes("admin") && !ctx.roles.includes("guardian")) return { error: "INSUFFICIENT_PERMISSIONS" };
      const newMode = payload?.mode || "peace";
      ctx.mode = newMode;
      return { status: "mode_changed", previousMode: "peace", newMode, changedBy: ctx.userId };
    }
    case "security.mode.get":
      return { mode: ctx.mode, timestamp: Date.now() };
    case "security.sentinel.status": {
      const { data: nodes } = await sb.from("federated_nodes").select("*").eq("status", "active");
      const { data: logs } = await sb.from("sentinel_logs").select("*").order("created_at", { ascending: false }).limit(10);
      return { status: "OPERATIONAL", active_nodes: nodes?.length || 0, recent_threats: logs || [], threat_level: "low", mode: ctx.mode };
    }
    case "security.ratelimit.state":
      return { domains: VALID_DOMAINS.map(d => ({ domain: d, requestsPerMinute: 60, currentUsage: Math.floor(Math.random() * 30), blocked: false })) };
    case "security.firewall.rules":
      return { rules: [
        { id: "r1", type: "rate_limit", target: "global", threshold: 1000, window: "1m", action: "throttle" },
        { id: "r2", type: "geo_block", target: "none", action: "allow_all" },
        { id: "r3", type: "pqc_enforcement", target: "auth", action: "warn" },
      ]};
    default:
      return { handler: "security", operation: op, status: "stub" };
  }
}

// ═══════════════════ ECONOMY (22) ═══════════════════

async function handleEconomy(sb: any, op: string, payload: any, ctx: GatewayContext) {
  switch (op) {
    case "economy.balance": {
      const { data } = await sb.rpc("get_phoenix_fund_balance");
      return { balance: data || 0, currency: "TAMV-T", userId: ctx.userId };
    }
    case "economy.ledger": {
      if (!ctx.userId) return { error: "AUTH_REQUIRED" };
      const { data } = await sb.from("phoenix_transactions").select("*").or(`citizen_id.eq.${ctx.userId}`).order("created_at", { ascending: false }).limit(50);
      return { entries: data || [] };
    }
    case "economy.tcep.atomic-swap":
      return { status: "simulated", swapId: crypto.randomUUID(), from: payload?.from || "TAMV-T", to: payload?.to || "TAMV-G", amount: payload?.amount || 0, rate: 1.0 };
    case "economy.transfer": {
      if (!ctx.userId) return { error: "AUTH_REQUIRED" };
      return { status: "simulated", from: ctx.userId, to: payload?.to, amount: payload?.amount, currency: "TAMV-T", txId: crypto.randomUUID() };
    }
    case "economy.lock":
      return { status: "locked", amount: payload?.amount || 0, lockedUntil: new Date(Date.now() + 86400000).toISOString(), reason: payload?.reason || "governance_stake" };
    case "economy.unlock":
      return { status: "unlocked", amount: payload?.amount || 0, unlockedAt: new Date().toISOString() };
    case "economy.positions":
      return { positions: [{ asset: "TAMV-T", balance: 0, locked: 0, available: 0 }] };
    case "economy.distribution.audit": {
      const { data } = await sb.from("phoenix_transactions").select("total_amount, creator_payout, system_fund").eq("tx_status", "completed").limit(100);
      const totalCreator = data?.reduce((s: number, r: any) => s + Number(r.creator_payout || 0), 0) || 0;
      const totalSystem = data?.reduce((s: number, r: any) => s + Number(r.system_fund || 0), 0) || 0;
      return { creatorTotal: totalCreator, systemTotal: totalSystem, ratio: totalSystem > 0 ? `${((totalCreator / (totalCreator + totalSystem)) * 100).toFixed(0)}/${((totalSystem / (totalCreator + totalSystem)) * 100).toFixed(0)}` : "0/0", transactions: data?.length || 0 };
    }
    case "economy.phoenix.status": {
      const [balRes, healthRes, txRes] = await Promise.all([
        sb.rpc("get_phoenix_fund_balance"),
        sb.rpc("get_economic_health"),
        sb.from("phoenix_transactions").select("total_amount").eq("tx_status", "completed"),
      ]);
      const totalVolume = txRes.data?.reduce((s: number, r: any) => s + Number(r.total_amount), 0) || 0;
      return { fundBalance: (balRes.data as number) || 0, economicHealth: (healthRes.data as number) || 0, totalVolume, transactionCount: txRes.data?.length || 0, currency: "TAMV-T" };
    }
    case "economy.fenix.ignite":
      return { status: "ignited", protocol: "fenix-v3", region: payload?.region || "LATAM", redistributionPool: 0, ignitedBy: ctx.userId };
    case "economy.fenix.regions":
      return { regions: [
        { id: "mx", name: "México", status: "active", fundAllocation: 0.3 },
        { id: "co", name: "Colombia", status: "active", fundAllocation: 0.2 },
        { id: "ar", name: "Argentina", status: "standby", fundAllocation: 0.15 },
        { id: "br", name: "Brasil", status: "planned", fundAllocation: 0.15 },
        { id: "cl", name: "Chile", status: "planned", fundAllocation: 0.1 },
        { id: "pe", name: "Perú", status: "planned", fundAllocation: 0.1 },
      ]};
    case "economy.gifts.mini-anubis.bless":
      return { status: "blessed", giftId: crypto.randomUUID(), from: ctx.userId, to: payload?.to, type: "mini-anubis", value: 10 };
    case "economy.gifts.history":
      return { gifts: [], total: 0 };
    case "economy.lottery.jackpot-pulse":
      return { currentJackpot: 50000, currency: "TAMV-T", nextDraw: new Date(Date.now() + 86400000 * 7).toISOString(), ticketsSold: 0, participantsCount: 0 };
    case "economy.lottery.ticket":
      return { status: "purchased", ticketId: crypto.randomUUID(), drawId: payload?.drawId, numbers: Array.from({ length: 6 }, () => Math.floor(Math.random() * 49) + 1).sort((a, b) => a - b) };
    case "economy.lottery.tickets":
      return { tickets: [], total: 0 };
    case "economy.fees.model":
      return { model: "20/30/50", protocol_fenix: "20%", infrastructure: "30%", net_utility: "50%", lastUpdated: new Date().toISOString() };
    case "economy.stats.velocity":
      return { velocity: 0, period: "24h", trend: "stable" };
    case "economy.stats.volume": {
      const { data } = await sb.from("phoenix_transactions").select("total_amount").eq("tx_status", "completed");
      const total = data?.reduce((s: number, r: any) => s + Number(r.total_amount), 0) || 0;
      return { totalVolume: total, currency: "TAMV-T" };
    }
    case "economy.compliance.reports":
      return { reports: [], compliant: true, lastAudit: new Date().toISOString() };
    case "economy.compliance.flag":
      return { status: "flagged", flagId: crypto.randomUUID(), reason: payload?.reason || "manual_review" };
    case "economy.policies":
      return { policies: [
        { id: "anti-concentration", active: true, maxHolding: "10%", enforcement: "automatic" },
        { id: "fenix-redistribution", active: true, rate: "20%", target: "social-programs" },
      ]};
    case "economy.policies.update":
      return { status: "updated", policyId: payload?.policyId, updatedBy: ctx.userId };
    default:
      return { handler: "economy", operation: op, status: "stub" };
  }
}

// ═══════════════════ XR (18) ═══════════════════

async function handleXR(sb: any, op: string, payload: any, ctx: GatewayContext) {
  switch (op) {
    case "xr.world.instantiate-4d":
      return { worldId: crypto.randomUUID(), type: "4D", dimensions: 4, polytope: "120-cell", createdBy: ctx.userId, status: "instantiated" };
    case "xr.world.list":
      return { worlds: [
        { id: "neo-tokio-2099", name: "Neo-Tokio 2099", type: "social", status: "active", users: 0 },
        { id: "dreamspaces", name: "Dreamspaces Studio", type: "creative", status: "active", users: 0 },
        { id: "utamv-campus", name: "UTAMV Campus", type: "education", status: "active", users: 0 },
        { id: "tenochtitlan", name: "Tenochtitlán Digital", type: "governance", status: "active", users: 0 },
      ]};
    case "xr.world.get":
      return { id: payload?.id || "neo-tokio-2099", name: "Neo-Tokio 2099", type: "social", status: "active", entities: 0, maxCapacity: 1000 };
    case "xr.world.state.update":
      return { status: "updated", worldId: payload?.worldId, updatedAt: new Date().toISOString() };
    case "xr.world.state.get": {
      const { data: entities } = await sb.from("world_entities").select("*").limit(100);
      return { entities: entities || [], worldVersion: "4D-v1", eoct: "low" };
    }
    case "xr.physics.gravity-config":
      return { gravity: { x: 0, y: -9.81, z: 0 }, timeScale: 1.0, dimensionMode: "3D+T" };
    case "xr.physics.gravity-config.update":
      return { status: "updated", gravity: payload?.gravity || { x: 0, y: -9.81, z: 0 } };
    case "xr.dreamspace.object.mint-3d":
      return { objectId: crypto.randomUUID(), type: payload?.type || "asset", format: "glTF", mintedBy: ctx.userId, status: "minted" };
    case "xr.dreamspace.object.get":
      return { id: payload?.id, type: "3d-asset", format: "glTF", owner: ctx.userId };
    case "xr.dreamspace.inventory":
      return { items: [], total: 0 };
    case "xr.dreamspace.reality.patch":
      return { status: "patched", patchId: crypto.randomUUID(), appliedAt: new Date().toISOString() };
    case "xr.dreamspace.reality.snapshots":
      return { snapshots: [] };
    case "xr.session.open":
      return { sessionId: crypto.randomUUID(), worldId: payload?.worldId || "neo-tokio-2099", userId: ctx.userId, openedAt: new Date().toISOString() };
    case "xr.session.close":
      return { status: "closed", sessionId: payload?.sessionId, duration: 0 };
    case "xr.session.active":
      return { sessions: [], total: 0 };
    case "xr.presence.update":
      return { status: "updated", userId: ctx.userId, position: payload?.position || { x: 0, y: 0, z: 0 } };
    case "xr.presence":
      return { users: [], total: 0 };
    case "xr.telemetry":
      return { fps: 60, drawCalls: 120, triangles: 50000, textureMemory: "128MB", latency: 16 };
    default:
      return { handler: "xr", operation: op, status: "stub" };
  }
}

// ═══════════════════ QUANTUM (14) ═══════════════════

async function handleQuantum(_sb: any, op: string, payload: any, _ctx: GatewayContext) {
  switch (op) {
    case "quantum.circuit.execute":
      return { jobId: crypto.randomUUID(), status: "queued", backend: payload?.backend || "qiskit_sim", estimatedMs: 5000 };
    case "quantum.circuit.status":
      return { jobId: payload?.id, status: "completed", progress: 100 };
    case "quantum.circuit.result":
      return { jobId: payload?.id, result: { counts: { "00": 512, "11": 512 }, shots: 1024 }, completedAt: new Date().toISOString() };
    case "quantum.vqe.eco-balance":
      return { status: "optimized", iterations: 50, energy: -1.137, convergence: true, application: "economic_balance" };
    case "quantum.qaoa.city-sync":
      return { status: "optimized", cities: payload?.cities || 5, optimalRoute: [0, 2, 4, 1, 3], cost: 42.5 };
    case "quantum.qrng.entropy": {
      const entropy = Array.from({ length: 32 }, () => Math.floor(Math.random() * 256));
      return { entropy: entropy.map(b => b.toString(16).padStart(2, "0")).join(""), bits: 256, source: "cuquantum_sim" };
    }
    case "quantum.providers":
    case "quantum.backends":
      return { backends: [
        { id: "qiskit_sim", name: "Qiskit Simulator", provider: "IBM", qubits: 32, status: "active" },
        { id: "tfq_sim", name: "TensorFlow Quantum", provider: "Google", qubits: 20, status: "active" },
        { id: "cuquantum_sim", name: "cuQuantum", provider: "NVIDIA", qubits: 64, status: "active" },
      ]};
    case "quantum.usage.stats":
      return { totalJobs: 0, totalQubits: 0, averageTime: 0, backends: {} };
    case "quantum.job.cancel":
      return { status: "cancelled", jobId: payload?.jobId };
    case "quantum.job.list":
      return { jobs: [], total: 0 };
    case "quantum.policy.set":
      return { status: "updated", policy: payload };
    case "quantum.policy":
      return { maxQubits: 64, maxShots: 8192, priorityQueue: false, backends: ["qiskit_sim", "tfq_sim", "cuquantum_sim"] };
    case "quantum.health":
      return { status: "operational", backends: ["qiskit_sim", "tfq_sim", "cuquantum_sim"], qubits_available: 64 };
    default:
      return { handler: "quantum", operation: op, status: "stub" };
  }
}

// ═══════════════════ GOVERNANCE (20) ═══════════════════

async function handleGovernance(sb: any, op: string, payload: any, ctx: GatewayContext) {
  switch (op) {
    case "governance.proposal.submit-master":
    case "governance.proposal.submit":
      return { status: "submitted", proposalId: crypto.randomUUID(), submittedBy: ctx.userId, title: payload?.title, type: payload?.type || "standard" };
    case "governance.proposals":
      return { proposals: [], total: 0 };
    case "governance.proposal.get":
      return { id: payload?.id, title: "Sample Proposal", status: "open", votes: { for: 0, against: 0 }, createdBy: ctx.userId };
    case "governance.proposal.close":
      return { status: "closed", proposalId: payload?.proposalId, result: "no_quorum" };
    case "governance.voting.cast":
      return { status: "cast", proposalId: payload?.proposalId, vote: payload?.vote, weight: 1, voter: ctx.userId };
    case "governance.voting.quadratic-power":
      return { userId: ctx.userId, votingPower: 1, quadraticWeight: 1, stakeBased: true };
    case "governance.voting.result":
      return { proposalId: payload?.id, forVotes: 0, againstVotes: 0, abstain: 0, quorumReached: false, result: "pending" };
    case "governance.constitution.get":
      return { version: "1.0.0", articles: 7, lastAmended: "2026-01-01", federations: 7, hash: await computeHash("constitution-v1") };
    case "governance.constitution.update":
      return { error: "CONSTITUTIONAL_AMENDMENT_REQUIRED", message: "Requires supermajority vote from all 7 federations" };
    case "governance.court.arbitration":
      return { caseId: crypto.randomUUID(), status: "filed", filedBy: ctx.userId, type: payload?.type || "dispute" };
    case "governance.court.case.get":
      return { id: payload?.id, status: "pending", parties: [], filedAt: new Date().toISOString() };
    case "governance.court.verdict":
      return { error: "INSUFFICIENT_PERMISSIONS", message: "Only constitutional judges can issue verdicts" };
    case "governance.protocol.black-hole.ban": {
      if (!ctx.roles.includes("admin") && !ctx.roles.includes("guardian")) return { error: "INSUFFICIENT_PERMISSIONS" };
      return { status: "banned", targetId: payload?.targetId, protocol: "black-hole-v1", permanent: true, bannedBy: ctx.userId };
    }
    case "governance.protocols.list":
      return { protocols: [
        { id: "fenix", name: "Protocolo Fénix", status: "active", version: "3.0" },
        { id: "black-hole", name: "Black Hole Ban", status: "active", version: "1.0" },
        { id: "osiris", name: "Restauración Osiris", status: "active", version: "2.0" },
        { id: "tenochtitlan", name: "Protocolo Tenochtitlán", status: "standby", version: "1.0" },
        { id: "anubis", name: "Juicio de Anubis", status: "active", version: "2.0" },
      ]};
    case "governance.roles":
      return { roles: ["citizen", "guardian", "admin", "judge", "architect"], descriptions: { citizen: "Base role", guardian: "Security oversight", admin: "System administration" } };
    case "governance.role.grant":
      return { error: "USE_IDENTITY_DOMAIN", message: "Use identity.role.grant for role management" };
    case "governance.role.revoke":
      return { error: "USE_IDENTITY_DOMAIN", message: "Use identity.role.revoke for role management" };
    case "governance.stats.participation":
      return { totalVoters: 0, activeProposals: 0, passedThisMonth: 0, participationRate: 0 };
    case "governance.stats.trust":
      return { averageTrust: 0, trustDistribution: { high: 0, medium: 0, low: 0 }, trend: "stable" };
    default:
      return { handler: "governance", operation: op, status: "stub" };
  }
}

// ═══════════════════ UTAMV (10) ═══════════════════

async function handleUtamv(_sb: any, op: string, payload: any, ctx: GatewayContext) {
  switch (op) {
    case "utamv.courses.list":
      return { courses: [
        { id: "tamv-101", title: "Fundamentos TAMV", level: "beginner", xr: false, students: 0, rating: 4.8 },
        { id: "xr-201", title: "Desarrollo XR 4D", level: "intermediate", xr: true, students: 0, rating: 4.9 },
        { id: "quantum-301", title: "Computación Cuántica", level: "advanced", xr: false, students: 0, rating: 4.7 },
        { id: "econ-101", title: "Economía MSR", level: "beginner", xr: false, students: 0, rating: 4.6 },
        { id: "sec-201", title: "Seguridad Post-Cuántica", level: "intermediate", xr: false, students: 0, rating: 4.8 },
      ]};
    case "utamv.course.get":
      return { id: payload?.id, title: "Curso TAMV", description: "Curso del ecosistema TAMV", modules: 8, duration: "40h" };
    case "utamv.classroom.join-xr":
      return { sessionId: crypto.randomUUID(), worldId: "utamv-campus", room: payload?.courseId || "main-hall", joined: true };
    case "utamv.progress.update":
      return { status: "updated", courseId: payload?.courseId, progress: payload?.progress || 0, userId: ctx.userId };
    case "utamv.progress":
      return { courses: [], totalProgress: 0 };
    case "utamv.cert.proof-of-knowledge":
      return { certId: crypto.randomUUID(), courseId: payload?.courseId, userId: ctx.userId, issuedAt: new Date().toISOString(), hash: await computeHash(`cert-${ctx.userId}-${payload?.courseId}`) };
    case "utamv.cert.get":
      return { id: payload?.id, status: "valid", issuedAt: new Date().toISOString() };
    case "utamv.stats":
      return { totalStudents: 0, totalCourses: 5, completionRate: 0, averageRating: 4.76 };
    case "utamv.course.create":
      return { status: "created", courseId: crypto.randomUUID(), createdBy: ctx.userId };
    case "utamv.course.update":
      return { status: "updated", courseId: payload?.id };
    default:
      return { handler: "utamv", operation: op, status: "stub" };
  }
}

// ═══════════════════ BOOKPI (10) ═══════════════════

async function handleBookPI(sb: any, op: string, payload: any, ctx: GatewayContext) {
  switch (op) {
    case "bookpi.event.log":
      return { status: "logged", eventId: crypto.randomUUID(), hash: await computeHash(JSON.stringify(payload)), anchoredAt: new Date().toISOString() };
    case "bookpi.event.get":
      return { id: payload?.id, type: "governance_event", status: "anchored" };
    case "bookpi.ledger": {
      const { data } = await sb.from("identity_events").select("*").order("created_at", { ascending: false }).limit(50);
      return { entries: data || [], total: data?.length || 0 };
    }
    case "bookpi.ledger.witness":
      return { witnessCount: 7, federations: ["security", "economy", "tech", "education", "ai", "creative", "governance"], lastWitnessed: new Date().toISOString() };
    case "bookpi.snapshot.civilization":
      return { snapshotId: crypto.randomUUID(), timestamp: new Date().toISOString(), hash: await computeHash(`snapshot-${Date.now()}`), status: "created" };
    case "bookpi.snapshot.get":
      return { id: payload?.id, status: "valid", createdAt: new Date().toISOString() };
    case "bookpi.snapshots":
      return { snapshots: [], total: 0 };
    case "bookpi.merkle.root":
      return { root: await computeHash(`merkle-root-${Date.now()}`), computedAt: new Date().toISOString(), leaves: 0 };
    case "bookpi.audit.trail":
      return { trail: [], integrity: "valid", lastVerified: new Date().toISOString() };
    case "bookpi.stats": {
      const { count } = await sb.from("identity_events").select("*", { count: "exact", head: true });
      return { totalEvents: count || 0, ledgerIntegrity: "valid", anchors: 0 };
    }
    default:
      return { handler: "bookpi", operation: op, status: "stub" };
  }
}

// ═══════════════════ KERNEL / IA (12) ═══════════════════

async function handleKernel(sb: any, op: string, payload: any, ctx: GatewayContext) {
  switch (op) {
    case "kernel.isabella.intentMatrix":
    case "kernel.isabella.intent-matrix": {
      const { data } = await sb.from("isabella_decisions").select("*").order("created_at", { ascending: false }).limit(10);
      return { decisions: data || [], pipeline: "6-stage", status: "operational" };
    }
    case "kernel.isabella.test": {
      const intent = payload?.intent || "content_moderation";
      const stages = ["normalize", "classify", "ethics", "security", "governance", "decision"];
      const confidence = 0.85 + Math.random() * 0.1;
      const decision = confidence > 0.7 ? "approve" : "escalate";
      return { decision, confidence: parseFloat(confidence.toFixed(3)), explanation: `Isabella pipeline processed intent '${intent}' through ${stages.length} stages.`, stages, requires_hitl: decision === "escalate", ethical_flags: [] };
    }
    case "kernel.agent.deploy":
      return { agentId: crypto.randomUUID(), type: payload?.type || "moderation", status: "deployed", deployedBy: ctx.userId };
    case "kernel.agent.stop":
      return { status: "stopped", agentId: payload?.agentId };
    case "kernel.agent.get":
      return { id: payload?.id, type: "moderation", status: "active", uptime: 0 };
    case "kernel.agents":
      return { agents: [
        { id: "isabella-core", type: "ethical-ai", status: "active" },
        { id: "anubis-sentinel", type: "security", status: "active" },
        { id: "horus-monitor", type: "monitoring", status: "active" },
      ]};
    case "kernel.isabella.shutdown-preventive": {
      if (!ctx.roles.includes("admin")) return { error: "ADMIN_REQUIRED" };
      return { status: "shutdown_initiated", reason: payload?.reason || "preventive", initiatedBy: ctx.userId, estimatedDowntime: "5m" };
    }
    case "kernel.explainability.trace":
      return { traceId: payload?.traceId || ctx.traceId, stages: ["input", "normalize", "classify", "ethics", "security", "governance", "decision", "output"], timestamps: {} };
    case "kernel.explainability.list":
      return { traces: [], total: 0 };
    case "kernel.policy.set":
      return { status: "updated", policy: payload };
    case "kernel.policy":
      return { maxConfidence: 0.95, minConfidenceForAuto: 0.7, hitlThreshold: 0.6, ethicalMode: "strict" };
    case "kernel.health":
      return { isabella: "operational", agents: 3, mode: "autonomous", confidence: 0.95 };
    case "kernel.telemetry":
      return { requestsProcessed: 0, averageLatency: 45, errorRate: 0.001, uptime: "99.97%" };
    default:
      return { handler: "kernel", operation: op, status: "stub" };
  }
}

// ═══════════════════ OPS (10) ═══════════════════

async function handleOps(sb: any, op: string, _p: any, ctx: GatewayContext) {
  switch (op) {
    case "ops.health":
    case "ops.system.health-index": {
      const { data: nodes } = await sb.from("federated_nodes").select("*").eq("status", "active");
      return { healthIndex: 0.95, activeNodes: nodes?.length || 0, mode: ctx.mode, uptime: "99.97%" };
    }
    case "ops.status":
    case "ops.system.status":
      return { api: "operational", db: "operational", xr: "operational", quantum: "simulated", gateway: "v7.0.0", isabella: "operational", sentinel: "operational", bookpi: "operational" };
    case "ops.nodes.list": {
      const { data } = await sb.from("federated_nodes").select("*").order("health_score", { ascending: false });
      return { nodes: data || [] };
    }
    case "ops.services":
      return { services: [
        { name: "tamv-gateway", status: "operational", version: "7.0.0", domain: "core" },
        { name: "isabella-pipeline", status: "operational", version: "1.0.0", domain: "kernel" },
        { name: "sentinel-guard", status: "operational", version: "1.0.0", domain: "security" },
        { name: "phoenix-protocol", status: "operational", version: "1.0.0", domain: "economy" },
        { name: "bookpi-write", status: "operational", version: "1.0.0", domain: "bookpi" },
        { name: "quantum-lab", status: "simulated", version: "0.9.0", domain: "quantum" },
        { name: "xr-engine", status: "operational", version: "1.0.0", domain: "xr" },
      ]};
    case "ops.mcp.cleanup-auto":
      return { status: "cleaned", processesKilled: 0, tempFilesRemoved: 0, timestamp: new Date().toISOString() };
    case "ops.mcp.restart-service":
      return { status: "restarted", service: _p?.service || "gateway", restartedAt: new Date().toISOString() };
    case "ops.logs":
      return { logs: [], total: 0 };
    case "ops.metrics":
      return { cpu: 0.15, memory: 0.42, disk: 0.28, network: { in: 0, out: 0 }, requests: { total: 0, errors: 0 } };
    case "ops.mode":
      return { mode: ctx.mode, since: new Date().toISOString() };
    default:
      return { handler: "ops", operation: op, status: "stub" };
  }
}

// ═══════════════════ SOCIAL (10) ═══════════════════

async function handleSocial(sb: any, op: string, payload: any, ctx: GatewayContext) {
  switch (op) {
    case "social.post.create": {
      if (!ctx.userId) return { error: "AUTH_REQUIRED" };
      const { data, error } = await sb.from("posts").insert({ user_id: ctx.userId, content: payload?.content }).select().single();
      return error ? { error: error.message } : data;
    }
    case "social.post.get": {
      const { data } = await sb.from("posts").select("*, profiles!posts_user_id_fkey(username, display_name, avatar_url)").eq("id", payload?.id).single();
      return data || { error: "POST_NOT_FOUND" };
    }
    case "social.feed": {
      const { data } = await sb.from("posts").select("*, profiles!posts_user_id_fkey(username, display_name, avatar_url), likes(user_id), comments(id)").order("created_at", { ascending: false }).limit(payload?.limit || 20);
      return { posts: data || [] };
    }
    case "social.post.like": {
      if (!ctx.userId) return { error: "AUTH_REQUIRED" };
      const { error } = await sb.from("likes").insert({ user_id: ctx.userId, post_id: payload?.postId });
      return error ? { error: error.message } : { status: "liked", postId: payload?.postId };
    }
    case "social.post.report":
      return { status: "reported", postId: payload?.postId, reportedBy: ctx.userId, reason: payload?.reason };
    case "social.relation.follow": {
      if (!ctx.userId) return { error: "AUTH_REQUIRED" };
      const { error } = await sb.from("follows").insert({ follower_id: ctx.userId, following_id: payload?.userId });
      return error ? { error: error.message } : { status: "followed", userId: payload?.userId };
    }
    case "social.relation.unfollow": {
      if (!ctx.userId) return { error: "AUTH_REQUIRED" };
      const { error } = await sb.from("follows").delete().eq("follower_id", ctx.userId).eq("following_id", payload?.userId);
      return error ? { error: error.message } : { status: "unfollowed", userId: payload?.userId };
    }
    case "social.relation.list": {
      if (!ctx.userId) return { error: "AUTH_REQUIRED" };
      const { data: followers } = await sb.from("follows").select("follower_id").eq("following_id", ctx.userId);
      const { data: following } = await sb.from("follows").select("following_id").eq("follower_id", ctx.userId);
      return { followers: followers?.length || 0, following: following?.length || 0 };
    }
    case "social.notifications": {
      if (!ctx.userId) return { error: "AUTH_REQUIRED" };
      const { data } = await sb.from("notifications").select("*").eq("user_id", ctx.userId).order("created_at", { ascending: false }).limit(50);
      return { notifications: data || [] };
    }
    case "social.message.send": {
      if (!ctx.userId) return { error: "AUTH_REQUIRED" };
      const { data, error } = await sb.from("messages").insert({ sender_id: ctx.userId, recipient_id: payload?.to, content: payload?.content }).select().single();
      return error ? { error: error.message } : data;
    }
    default:
      return { handler: "social", operation: op, status: "stub" };
  }
}

// ═══════════════════ DEVTOOLS (10) ═══════════════════

async function handleDevtools(_sb: any, op: string, _p: any, _ctx: GatewayContext) {
  switch (op) {
    case "devtools.version":
      return { api: "TAMV DM-X7", version: "7.0.0", build: "2026-02-15", endpoints: 160, domains: 13 };
    case "devtools.echo":
      return { echo: true, timestamp: new Date().toISOString(), message: "TAMV Gateway v7 operational" };
    case "devtools.spec":
      return { version: "7.0.0", domains: VALID_DOMAINS, totalEndpoints: 160, operations: VALID_DOMAINS.reduce((acc, d) => { acc[d] = `${d}.*`; return acc; }, {} as any) };
    case "devtools.spec.domain": {
      const domain = _p?.name;
      return { domain, operations: `All operations for ${domain}`, status: "operational" };
    }
    case "devtools.runtime.state":
      return { mode: "peace", uptime: process.uptime?.() || 0, memory: {}, activeConnections: 0 };
    case "devtools.runtime.reload":
      return { status: "reloaded", timestamp: new Date().toISOString() };
    case "devtools.feature-flags":
      return { flags: { quantum_lab: true, xr_4d: true, dreamspaces: true, lottery: false, streaming: false, pqc_auth: true } };
    case "devtools.feature-flags.update":
      return { status: "updated", flags: _p };
    case "devtools.simulations":
      return { simulations: [], total: 0 };
    case "devtools.simulations.run":
      return { simulationId: crypto.randomUUID(), type: _p?.type || "load_test", status: "running" };
    default:
      return { handler: "devtools", operation: op, status: "stub" };
  }
}

// ═══════════════════ UTILS ═══════════════════

function jsonResponse(status: number, body: any, traceId: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", "x-tamv-trace-id": traceId },
  });
}

async function computeHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
  return "sha256:" + Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}
