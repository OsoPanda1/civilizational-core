export type ReadinessStatus = "backlog" | "in_progress" | "done";

export interface ReadinessTask {
  id: string;
  title: string;
  status: ReadinessStatus;
  owner: "security" | "platform" | "product" | "ops" | "governance";
  milestone: "stage" | "production";
}

export interface ReadinessDomain {
  id: string;
  label: string;
  description: string;
  tasks: ReadinessTask[];
}

export const readinessDomains: ReadinessDomain[] = [
  {
    id: "infra-security",
    label: "Infraestructura y seguridad",
    description: "RLS, secretos, observabilidad y topología multi-entorno.",
    tasks: [
      { id: "rls-audit", title: "Auditoría externa de RLS por tabla", status: "backlog", owner: "security", milestone: "production" },
      { id: "secrets-rotation", title: "Vault + rotación de tokens (GitHub/Supabase/IA)", status: "in_progress", owner: "security", milestone: "production" },
      { id: "edge-observability", title: "Logs + métricas + alertas en edge functions", status: "in_progress", owner: "platform", milestone: "stage" },
      { id: "topology", title: "Topología final dev/stage/prod con TLS", status: "backlog", owner: "platform", milestone: "stage" },
    ],
  },
  {
    id: "product-ux",
    label: "Producto TAMV OS",
    description: "Onboarding de ciudadanía, Atlas y Guardian listos para operación.",
    tasks: [
      { id: "onboarding", title: "Onboarding ciudadano (registro/verificación/roles)", status: "in_progress", owner: "product", milestone: "stage" },
      { id: "atlas-ui", title: "Atlas con estados vacíos y paneles operativos", status: "done", owner: "product", milestone: "stage" },
      { id: "guardian-ui", title: "Guardian con cola, historial y filtros", status: "done", owner: "product", milestone: "stage" },
      { id: "dmx7-v1", title: "Subset público DM-X7 versión 1.0", status: "backlog", owner: "platform", milestone: "production" },
    ],
  },
  {
    id: "xr-rdm",
    label: "XR + RDM Digital",
    description: "Performance visual, fallback 2D y límites de Realito AI.",
    tasks: [
      { id: "xr-stress", title: "Stress tests de TAMVScene/Phoenix en móviles", status: "backlog", owner: "platform", milestone: "production" },
      { id: "fallback-2d", title: "Fallback 2D sin WebGL/WebGPU", status: "backlog", owner: "platform", milestone: "stage" },
      { id: "realito-guardrails", title: "Guardrails de Realito AI (disclaimers y límites)", status: "in_progress", owner: "product", milestone: "stage" },
      { id: "territory-kpis", title: "KPIs territoriales para cabildo/ayuntamiento", status: "backlog", owner: "ops", milestone: "production" },
    ],
  },
  {
    id: "ops-governance",
    label: "Operación y gobernanza",
    description: "Runbooks, incidentes y trazabilidad económica Fénix 75/25.",
    tasks: [
      { id: "runbooks", title: "Runbooks de operación diaria e incidentes", status: "in_progress", owner: "ops", milestone: "stage" },
      { id: "fenix-7525", title: "Automatización de distribución Fénix 75/25", status: "backlog", owner: "governance", milestone: "production" },
      { id: "legal-operational", title: "Políticas ejecutables (legal/economía/seguridad)", status: "backlog", owner: "governance", milestone: "production" },
      { id: "release-protocol", title: "Protocolo de actualización de versiones MD-X4", status: "in_progress", owner: "ops", milestone: "stage" },
    ],
  },
];

export const statusWeight: Record<ReadinessStatus, number> = {
  backlog: 0,
  in_progress: 0.5,
  done: 1,
};

export function getReadinessProgress(domains: ReadinessDomain[]): number {
  const tasks = domains.flatMap((domain) => domain.tasks);
  if (tasks.length === 0) {
    return 0;
  }

  const score = tasks.reduce((acc, task) => acc + statusWeight[task.status], 0);
  return Math.round((score / tasks.length) * 100);
}

export function getMilestoneProgress(domains: ReadinessDomain[], milestone: "stage" | "production"): number {
  const tasks = domains.flatMap((domain) => domain.tasks).filter((task) => task.milestone === milestone);
  if (tasks.length === 0) {
    return 0;
  }

  const score = tasks.reduce((acc, task) => acc + statusWeight[task.status], 0);
  return Math.round((score / tasks.length) * 100);
}
