import { describe, expect, it } from "vitest";
import { activities, activityForEvent, representationIsCorrect, transferIsCorrect } from "../src/learningActivities";
import { demoPlan, type PlanEvent } from "../src/learningPlan";

describe("student practice and calendar", () => {
  it("opens the practice assigned to each demo event", () => {
    const plan = demoPlan(new Date(2026, 9, 6));
    expect(plan.filter((event) => event.kind !== "prueba").map((event) => activityForEvent(event)?.id)).toEqual(["partes", "equivalencias", "suma", "ensayo"]);
    expect(activityForEvent(plan.find((event) => event.kind === "prueba"))).toBeUndefined();
  });

  it("does not assign a demo exercise to a teacher's custom event", () => {
    const event: PlanEvent = { id: "custom", date: "2026-10-07", kind: "clase", title: "Otra clase", topic: "Álgebra", detail: "Otro contenido", method: "Leer", origin: "docente" };
    expect(activityForEvent(event)).toBeUndefined();
  });

  it("checks the built representation and the transfer separately", () => {
    expect(representationIsCorrect(activities.equivalencias, 2)).toBe(true);
    expect(representationIsCorrect(activities.equivalencias, 1)).toBe(false);
    expect(transferIsCorrect(activities.equivalencias, "3/6")).toBe(true);
    expect(transferIsCorrect(activities.equivalencias, "2/6")).toBe(false);
  });
});
