import { createContext, type ReactNode, useContext, useState } from "react";
import initialData from "../../data/praxios-state.json";
import type { HarvestEnvelope, PraxiosState, Task } from "./types";

const STORAGE_KEY = "praxios.os.state.v2";

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function now() {
  return new Date().toISOString();
}

function loadState(): PraxiosState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as PraxiosState) : (initialData as PraxiosState);
  } catch {
    return initialData as PraxiosState;
  }
}

function mergeHarvest(state: PraxiosState, envelope: HarvestEnvelope): PraxiosState {
  const createdAt = envelope.createdAt ?? now();
  const sessionId = uid("SES");
  const ideas = envelope.ideas ?? [];
  const decisions = envelope.decisions ?? [];
  const opportunities = envelope.opportunities ?? [];
  const evidence = envelope.evidence ?? [];
  const tasks = envelope.tasks ?? [];
  const risks = envelope.risks ?? [];

  const newEntities = [
    ...ideas.map((idea) => ({
      id: uid("IDEA"),
      kind: "idea" as const,
      title: idea.title,
      summary: idea.summary,
      status: "OPEN",
      projectId: envelope.projectId,
      confidence: idea.confidence ?? 60,
      createdAt,
      tags: idea.tags ?? [],
    })),
    ...risks.map((risk) => ({
      id: uid("RSK"),
      kind: "risk" as const,
      title: risk.title,
      summary: risk.summary,
      status: "OPEN",
      projectId: envelope.projectId,
      confidence: risk.confidence ?? 60,
      createdAt,
      tags: ["risk"],
    })),
  ];

  return {
    ...state,
    entities: [...newEntities, ...state.entities],
    sessions: [
      {
        id: sessionId,
        source: envelope.source,
        title: envelope.title,
        summary: envelope.summary,
        projectId: envelope.projectId,
        closedAt: createdAt,
        harvested: {
          ideas: ideas.length,
          decisions: decisions.length,
          opportunities: opportunities.length,
          evidence: evidence.length,
          tasks: tasks.length,
          risks: risks.length,
        },
      },
      ...state.sessions,
    ],
    decisions: [
      ...decisions.map((decision) => ({
        id: uid("DEC"),
        title: decision.title,
        projectId: envelope.projectId,
        status: "ACTIVE" as const,
        confidence: decision.confidence ?? 65,
        rationale: decision.rationale,
        createdAt,
        reviewAt: decision.reviewAt,
        killCriteria: decision.killCriteria ?? "Definir en revisión ejecutiva",
        scaleCriteria: decision.scaleCriteria ?? "Definir en revisión ejecutiva",
      })),
      ...state.decisions,
    ],
    opportunities: [
      ...opportunities.map((opportunity) => ({
        id: uid("OPP"),
        title: opportunity.title,
        projectId: envelope.projectId,
        score: opportunity.score ?? 55,
        status: "TEST" as const,
        timeToCashDays: opportunity.timeToCashDays ?? 14,
        estimatedValue: opportunity.estimatedValue ?? 0,
        confidence: opportunity.confidence ?? 55,
        nextAction: opportunity.nextAction ?? "Diseñar experimento mínimo",
      })),
      ...state.opportunities,
    ],
    evidence: [
      ...evidence.map((item) => ({
        id: uid("EVD"),
        title: item.title,
        projectId: envelope.projectId,
        source: item.source ?? envelope.source,
        claim: item.claim,
        strength: item.strength ?? "MEDIUM",
        createdAt,
      })),
      ...state.evidence,
    ],
    tasks: [
      ...tasks.map((task) => ({
        id: uid("TSK"),
        title: task.title,
        projectId: envelope.projectId,
        status: "TODO" as const,
        priority: task.priority ?? "MEDIUM",
        owner: task.owner ?? "Owner",
        dueAt: task.dueAt,
        source: sessionId,
      })),
      ...state.tasks,
    ],
    activity: [
      {
        id: uid("ACT"),
        type: "harvest",
        message: `Harvested ${envelope.source}: ${envelope.title}`,
        createdAt,
      },
      ...state.activity,
    ],
  };
}

interface PraxiosContextValue {
  state: PraxiosState;
  harvest: (envelope: HarvestEnvelope) => void;
  toggleTask: (taskId: string) => void;
  exportState: () => string;
  importState: (raw: string) => void;
  resetState: () => void;
}

const PraxiosContext = createContext<PraxiosContextValue | undefined>(undefined);

export function PraxiosProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PraxiosState>(() => loadState());

  const persist = (next: PraxiosState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setState(next);
  };

  const value: PraxiosContextValue = {
    state,
    harvest: (envelope) => persist(mergeHarvest(state, envelope)),
    toggleTask: (taskId) => {
      const nextTasks = state.tasks.map((task): Task => {
        if (task.id !== taskId) return task;
        return { ...task, status: task.status === "DONE" ? "TODO" : "DONE" };
      });
      persist({ ...state, tasks: nextTasks });
    },
    exportState: () => JSON.stringify(state, null, 2),
    importState: (raw) => {
      const parsed = JSON.parse(raw) as PraxiosState;
      if (!parsed.version || !parsed.projects || !parsed.mission) {
        throw new Error("Snapshot PRAXIOS inválido.");
      }
      persist(parsed);
    },
    resetState: () => persist(initialData as PraxiosState),
  };

  return <PraxiosContext.Provider value={value}>{children}</PraxiosContext.Provider>;
}

export function usePraxios() {
  const context = useContext(PraxiosContext);
  if (!context) throw new Error("usePraxios must be used inside PraxiosProvider");
  return context;
}
