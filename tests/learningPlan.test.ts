import { afterEach, describe, expect, it, vi } from "vitest";
import { dateKey, deleteCustomEvent, demoPlan, loadPlan, saveCustomEvent } from "../src/learningPlan";

afterEach(() => vi.unstubAllGlobals());

describe("shared learning plan", () => {
  it("places the sample evaluation in the teacher and student calendar week", () => {
    const plan = demoPlan(new Date(2026, 9, 6));
    expect(plan.find((event) => event.kind === "prueba")?.date).toBe("2026-10-15");
    expect(plan.find((event) => event.kind === "prueba")?.detail).toContain("fracciones equivalentes");
    expect(dateKey(new Date(2026, 9, 6))).toBe("2026-10-06");
  });

  it("persists and removes an event scheduled by a teacher", () => {
    const values = new Map<string, string>();
    vi.stubGlobal("localStorage", { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) });
    vi.stubGlobal("window", { dispatchEvent: vi.fn() });
    saveCustomEvent({ date: "2026-10-19", kind: "prueba", title: "Nueva prueba", topic: "Equivalencia", detail: "Representar equivalencias", method: "Resolver dos casos nuevos" });
    const created = loadPlan().find((event) => event.title === "Nueva prueba");
    expect(created).toMatchObject({ date: "2026-10-19", origin: "docente", kind: "prueba" });
    deleteCustomEvent(created!.id);
    expect(loadPlan().find((event) => event.title === "Nueva prueba")).toBeUndefined();
  });
});
