import { describe, expect, it } from "vitest";
import initialData from "../data/praxios-state.json";
import {
  activeOpportunities,
  buildSessionProtocol,
  safeParseHarvest,
  systemHealth,
  todayTasks,
} from "../src/os/engine";
import type { PraxiosState } from "../src/os/types";

const state = initialData as PraxiosState;

describe("PRAXIOS OS engine", () => {
  it("ranks opportunities by score", () => {
    const ranked = activeOpportunities(state);
    expect(ranked[0]?.score).toBeGreaterThanOrEqual(ranked[1]?.score ?? 0);
  });

  it("returns executable tasks", () => {
    const tasks = todayTasks(state);
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks.some((task) => task.status !== "DONE")).toBe(true);
  });

  it("computes bounded system health", () => {
    const health = systemHealth(state);
    expect(health).toBeGreaterThanOrEqual(45);
    expect(health).toBeLessThanOrEqual(99);
  });

  it("builds a model-agnostic session contract", () => {
    const protocol = buildSessionProtocol(state, "visual-art-ai");
    expect(protocol).toContain("PRAXIOS STATE BRIEF");
    expect(protocol).toContain("SESSION CONTRACT");
    expect(protocol).toContain("Visual Art AI");
  });

  it("validates harvest envelopes", () => {
    const envelope = safeParseHarvest(JSON.stringify({
      source: "test-agent",
      title: "Test",
      summary: "Result",
    }));
    expect(envelope.source).toBe("test-agent");
    expect(() => safeParseHarvest("{}")).toThrow();
  });
});
