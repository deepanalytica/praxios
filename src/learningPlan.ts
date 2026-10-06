import { useEffect, useState } from "react";

export type PlanKind = "clase" | "practica" | "prueba";
export type PlanEvent = {
  id: string;
  date: string;
  kind: PlanKind;
  title: string;
  topic: string;
  method: string;
  detail: string;
  origin: "demo" | "docente";
};

const storageKey = "educabot-plan-v2";
const updateEvent = "educabot:plan-updated";

export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function fromDateKey(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function startOfWeek(date: Date): Date {
  return addDays(date, -((date.getDay() + 6) % 7));
}

export function longDate(value: string): string {
  const formatted = new Intl.DateTimeFormat("es-CL", { weekday: "long", day: "numeric", month: "long" }).format(fromDateKey(value));
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function shortDate(value: string): string {
  return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "short" }).format(fromDateKey(value));
}

export function monthTitle(date: Date): string {
  const value = new Intl.DateTimeFormat("es-CL", { month: "long", year: "numeric" }).format(date);
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function demoPlan(today = new Date()): PlanEvent[] {
  const monday = startOfWeek(today);
  const make = (offset: number, event: Omit<PlanEvent, "id" | "date" | "origin">): PlanEvent => ({
    ...event, id: `demo-${offset}`, date: dateKey(addDays(monday, offset)), origin: "demo"
  });
  return [
    make(0, { kind: "clase", title: "Las partes de un todo", topic: "Fracciones", method: "Observa un modelo y explica qué representa cada parte.", detail: "Identificar numerador y denominador usando barras divididas en partes iguales." }),
    make(2, { kind: "practica", title: "Fracciones equivalentes", topic: "Equivalencia", method: "Compara representaciones y justifica por qué expresan la misma cantidad.", detail: "Representar 1/2, 2/4 y 3/6; explicar una equivalencia con tus palabras." }),
    make(4, { kind: "clase", title: "Sumar con igual denominador", topic: "Suma de fracciones", method: "Construye la suma con piezas antes de escribirla con números.", detail: "Resolver sumas sencillas y comprobar el resultado con un modelo visual." }),
    make(7, { kind: "practica", title: "Ensayo de preparación", topic: "Fracciones", method: "Resuelve sin pistas al principio; después revisa tus errores.", detail: "Practicar representación, equivalencia y suma; registrar qué conviene repasar." }),
    make(10, { kind: "prueba", title: "Prueba de fracciones", topic: "Fracciones y equivalencia", method: "Repasa un poco cada día. Practica explicando el procedimiento en voz alta.", detail: "Contenidos: partes de un todo, fracciones equivalentes y suma con igual denominador." })
  ];
}

function customPlan(): PlanEvent[] {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]") as unknown;
    if (!Array.isArray(saved)) return [];
    return saved.filter((item): item is PlanEvent => !!item && typeof item === "object" && typeof item.id === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.date) && ["clase", "practica", "prueba"].includes(item.kind) && typeof item.title === "string" && typeof item.topic === "string" && typeof item.method === "string" && typeof item.detail === "string" && item.origin === "docente");
  } catch { return []; }
}

export function loadPlan(): PlanEvent[] {
  return [...demoPlan(), ...customPlan()].sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
}

export function saveCustomEvent(event: Omit<PlanEvent, "id" | "origin">): void {
  const current = customPlan();
  const next = { ...event, id: crypto.randomUUID(), origin: "docente" as const };
  localStorage.setItem(storageKey, JSON.stringify([...current, next]));
  window.dispatchEvent(new Event(updateEvent));
}

export function deleteCustomEvent(id: string): void {
  localStorage.setItem(storageKey, JSON.stringify(customPlan().filter((event) => event.id !== id)));
  window.dispatchEvent(new Event(updateEvent));
}

export function usePlan(): PlanEvent[] {
  const [events, setEvents] = useState(loadPlan);
  useEffect(() => {
    const refresh = () => setEvents(loadPlan());
    window.addEventListener("storage", refresh);
    window.addEventListener(updateEvent, refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener(updateEvent, refresh); };
  }, []);
  return events;
}
