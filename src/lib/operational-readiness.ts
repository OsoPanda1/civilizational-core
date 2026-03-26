export type ReadinessStatus = "backlog" | "in_progress" | "done";

export type ReadinessOwner = "security" | "platform" | "product" | "ops" | "governance";

export type ReadinessMilestone = "stage" | "production";

export interface ReadinessTask {
  id: string;
  title: string;
  status: ReadinessStatus;
  owner: ReadinessOwner;
  milestone: ReadinessMilestone;
}

export interface ReadinessDomain {
  id: string;
  label: string;
  description: string;
  tasks: ReadinessTask[];
}

const STORAGE_KEY = "tamv-readiness-state";

const defaultDomains: ReadinessDomain[] = [
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

/** Status cycle order used when toggling a task status. */
const STATUS_CYCLE: ReadinessStatus[] = ["backlog", "in_progress", "done"];

/** Load persisted overrides from localStorage and merge with defaults. */
function loadDomains(): ReadinessDomain[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultDomains);

    const overrides = JSON.parse(raw) as Record<string, ReadinessStatus>;
    return defaultDomains.map((domain) => ({
      ...domain,
      tasks: domain.tasks.map((task) => ({
        ...task,
        status: overrides[task.id] ?? task.status,
      })),
    }));
  } catch {
    return structuredClone(defaultDomains);
  }
}

/** Persist all task statuses to localStorage. */
function saveDomains(domains: ReadinessDomain[]): void {
  const overrides: Record<string, ReadinessStatus> = {};
  for (const domain of domains) {
    for (const task of domain.tasks) {
      overrides[task.id] = task.status;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

/** Mutable singleton — call `getReadinessDomains()` to get the live list. */
let _domains: ReadinessDomain[] = loadDomains();

export function getReadinessDomains(): ReadinessDomain[] {
  return _domains;
}

/** Advance a task to the next status in the cycle and persist. */
export function cycleTaskStatus(taskId: string): ReadinessDomain[] {
  for (const domain of _domains) {
    for (const task of domain.tasks) {
      if (task.id === taskId) {
        const idx = STATUS_CYCLE.indexOf(task.status);
        task.status = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
        saveDomains(_domains);
        return _domains;
      }
    }
  }
  return _domains;
}

/** Set a specific status for a task and persist. */
export function setTaskStatus(taskId: string, status: ReadinessStatus): ReadinessDomain[] {
  for (const domain of _domains) {
    for (const task of domain.tasks) {
      if (task.id === taskId) {
        task.status = status;
        saveDomains(_domains);
        return _domains;
      }
    }
  }
  return _domains;
}

/** Reset all tasks to their default statuses. */
export function resetReadiness(): ReadinessDomain[] {
  localStorage.removeItem(STORAGE_KEY);
  _domains = structuredClone(defaultDomains);
  return _domains;
}

// Keep the old export name as a getter for backward compatibility
export const readinessDomains = _domains;

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

export function getMilestoneProgress(domains: ReadinessDomain[], milestone: ReadinessMilestone): number {
  const tasks = domains.flatMap((domain) => domain.tasks).filter((task) => task.milestone === milestone);
  if (tasks.length === 0) {
    return 0;
  }

  const score = tasks.reduce((acc, task) => acc + statusWeight[task.status], 0);
  return Math.round((score / tasks.length) * 100);
}

export function getDomainProgress(domain: ReadinessDomain): number {
  if (domain.tasks.length === 0) {
    return 0;
  }

  const score = domain.tasks.reduce((acc, task) => acc + statusWeight[task.status], 0);
  return Math.round((score / domain.tasks.length) * 100);
}
