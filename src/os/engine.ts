import type { HarvestEnvelope, Opportunity, PraxiosState, Priority, Project } from "./types";

const priorityWeight: Record<Priority, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export function money(value: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function projectById(state: PraxiosState, id?: string): Project | undefined {
  return state.projects.find((project) => project.id === id);
}

export function activeOpportunities(state: PraxiosState): Opportunity[] {
  return [...state.opportunities]
    .filter((opportunity) => opportunity.status !== "KILL")
    .sort((a, b) => b.score - a.score);
}

export function todayTasks(state: PraxiosState) {
  return [...state.tasks]
    .filter((task) => task.status !== "DONE")
    .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority])
    .slice(0, 6);
}

export function systemHealth(state: PraxiosState): number {
  const openTasks = state.tasks.filter((task) => task.status !== "DONE").length;
  const blocked = state.tasks.filter((task) => task.status === "BLOCKED").length;
  const decisionReviews = state.decisions.filter((decision) => decision.status === "REVIEW").length;
  const activeSessionsPenalty = state.sessions.length === 0 ? 6 : 0;
  return Math.max(45, Math.min(99, 92 - blocked * 8 - decisionReviews * 4 - Math.max(0, openTasks - 12) - activeSessionsPenalty));
}

export function topProjects(state: PraxiosState): Project[] {
  return [...state.projects]
    .filter((project) => project.id !== "praxios-core" && project.state !== "KILL")
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5);
}

export function buildStateBrief(state: PraxiosState, projectId?: string): string {
  const focus = projectId ? projectById(state, projectId) : undefined;
  const tasks = todayTasks(state);
  const opportunities = activeOpportunities(state).slice(0, 5);
  const decisions = state.decisions.filter((decision) => decision.status === "ACTIVE").slice(0, 8);

  return [
    "# PRAXIOS STATE BRIEF",
    "",
    "MISSION",
    state.mission.title,
    state.mission.target,
    "",
    focus ? `FOCUS PROJECT\n${focus.name} — ${focus.state} — score ${focus.score}\nObjective: ${focus.objective}\nNext action: ${focus.nextAction}` : "FOCUS PROJECT\nPortfolio-wide",
    "",
    "ACTIVE DECISIONS",
    ...decisions.map((decision) => `- ${decision.id}: ${decision.title} [confidence ${decision.confidence}%]`),
    "",
    "TOP OPPORTUNITIES",
    ...opportunities.map((opportunity) => `- ${opportunity.id}: ${opportunity.title} — score ${opportunity.score} — est. ${money(opportunity.estimatedValue)}`),
    "",
    "TODAY",
    ...tasks.map((task) => `- [${task.priority}] ${task.title} — owner: ${task.owner}`),
    "",
    "CONSTRAINTS",
    ...state.resources.constraints.map((constraint) => `- ${constraint}`),
    "",
    "SESSION RULE",
    "Do not create disconnected work. Every action must map to an active project, decision, experiment, opportunity or explicit new hypothesis.",
    "At session close, return a PRAXIOS Harvest Envelope."
  ].join("\n");
}

export function buildSessionProtocol(state: PraxiosState, projectId?: string): string {
  return [
    buildStateBrief(state, projectId),
    "",
    "# SESSION CONTRACT",
    "1. Read the state brief before acting.",
    "2. Distinguish facts, hypotheses, decisions and recommendations.",
    "3. Prefer evidence and economic impact over activity.",
    "4. Do not silently override an active decision.",
    "5. Surface contradictions and duplicated initiatives.",
    "6. When work can be tested before building, propose the smallest test.",
    "7. At the end, output a JSON object compatible with HarvestEnvelope.",
    "",
    "Required close fields: source, title, summary, projectId, ideas, decisions, opportunities, evidence, tasks, risks."
  ].join("\n");
}

export function safeParseHarvest(raw: string): HarvestEnvelope {
  const parsed = JSON.parse(raw) as HarvestEnvelope;
  if (!parsed.source || !parsed.title || !parsed.summary) {
    throw new Error("El Harvest requiere source, title y summary.");
  }
  return parsed;
}
