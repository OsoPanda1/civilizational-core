import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getReadinessDomains,
  getReadinessProgress,
  getMilestoneProgress,
  getDomainProgress,
  cycleTaskStatus,
  setTaskStatus,
  resetReadiness,
  statusWeight,
} from "../operational-readiness";

// Mock localStorage for test isolation
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

describe("operational-readiness", () => {
  beforeEach(() => {
    localStorageMock.clear();
    resetReadiness();
  });

  it("statusWeight maps correctly", () => {
    expect(statusWeight.backlog).toBe(0);
    expect(statusWeight.in_progress).toBe(0.5);
    expect(statusWeight.done).toBe(1);
  });

  it("getReadinessDomains returns 4 domains with tasks", () => {
    const domains = getReadinessDomains();
    expect(domains).toHaveLength(4);
    for (const domain of domains) {
      expect(domain.tasks.length).toBeGreaterThan(0);
    }
  });

  it("getReadinessProgress returns a number between 0 and 100", () => {
    const domains = getReadinessDomains();
    const progress = getReadinessProgress(domains);
    expect(progress).toBeGreaterThanOrEqual(0);
    expect(progress).toBeLessThanOrEqual(100);
  });

  it("getReadinessProgress returns 0 for empty domains", () => {
    expect(getReadinessProgress([])).toBe(0);
  });

  it("getMilestoneProgress filters by milestone", () => {
    const domains = getReadinessDomains();
    const stagePct = getMilestoneProgress(domains, "stage");
    const prodPct = getMilestoneProgress(domains, "production");
    expect(stagePct).toBeGreaterThanOrEqual(0);
    expect(prodPct).toBeGreaterThanOrEqual(0);
    // Stage has some done tasks by default, production does not
    expect(stagePct).toBeGreaterThan(prodPct);
  });

  it("getDomainProgress calculates per-domain", () => {
    const domains = getReadinessDomains();
    const productDomain = domains.find((d) => d.id === "product-ux");
    expect(productDomain).toBeDefined();
    // product-ux has 2 done + 1 in_progress + 1 backlog = (2 + 0.5 + 0) / 4 * 100 = 63
    expect(getDomainProgress(productDomain!)).toBe(63);
  });

  it("cycleTaskStatus advances backlog → in_progress → done → backlog", () => {
    // rls-audit starts as backlog
    cycleTaskStatus("rls-audit");
    let domains = getReadinessDomains();
    let task = domains.flatMap((d) => d.tasks).find((t) => t.id === "rls-audit");
    expect(task?.status).toBe("in_progress");

    cycleTaskStatus("rls-audit");
    domains = getReadinessDomains();
    task = domains.flatMap((d) => d.tasks).find((t) => t.id === "rls-audit");
    expect(task?.status).toBe("done");

    cycleTaskStatus("rls-audit");
    domains = getReadinessDomains();
    task = domains.flatMap((d) => d.tasks).find((t) => t.id === "rls-audit");
    expect(task?.status).toBe("backlog");
  });

  it("setTaskStatus sets an explicit status", () => {
    setTaskStatus("rls-audit", "done");
    const domains = getReadinessDomains();
    const task = domains.flatMap((d) => d.tasks).find((t) => t.id === "rls-audit");
    expect(task?.status).toBe("done");
  });

  it("resetReadiness restores defaults", () => {
    setTaskStatus("rls-audit", "done");
    resetReadiness();
    const domains = getReadinessDomains();
    const task = domains.flatMap((d) => d.tasks).find((t) => t.id === "rls-audit");
    expect(task?.status).toBe("backlog");
  });

  it("persists state to localStorage", () => {
    setTaskStatus("rls-audit", "done");
    expect(localStorageMock.setItem).toHaveBeenCalled();
    const stored = JSON.parse(
      localStorageMock.setItem.mock.calls.at(-1)![1] as string,
    );
    expect(stored["rls-audit"]).toBe("done");
  });
});
