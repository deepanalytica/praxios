export type ProjectState = "TEST" | "BUILD" | "SCALE" | "HOLD" | "KILL";
export type EntityKind = "goal" | "problem" | "idea" | "decision" | "opportunity" | "evidence" | "task" | "risk" | "agent" | "session" | "capability" | "asset" | "workflow" | "metric" | "project";
export type WorkStatus = "TODO" | "DOING" | "DONE" | "BLOCKED";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Mission {
  title: string;
  target: string;
  northStar: string;
}

export interface Project {
  id: string;
  name: string;
  state: ProjectState;
  score: number;
  priority: number;
  objective: string;
  nextAction: string;
}

export interface GraphEntity {
  id: string;
  kind: EntityKind;
  title: string;
  summary: string;
  status?: string;
  projectId?: string;
  confidence?: number;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
}

export interface GraphRelation {
  id: string;
  from: string;
  to: string;
  type: string;
  createdAt?: string;
}

export interface SessionRecord {
  id: string;
  source: string;
  title: string;
  summary: string;
  projectId?: string;
  closedAt: string;
  harvested: {
    ideas: number;
    decisions: number;
    opportunities: number;
    evidence: number;
    tasks: number;
    risks: number;
  };
}

export interface Decision {
  id: string;
  title: string;
  projectId?: string;
  status: "ACTIVE" | "SUPERSEDED" | "REVIEW" | "CLOSED";
  confidence: number;
  rationale: string;
  createdAt: string;
  reviewAt?: string;
  killCriteria: string;
  scaleCriteria: string;
}

export interface Opportunity {
  id: string;
  title: string;
  projectId?: string;
  score: number;
  status: ProjectState;
  timeToCashDays: number;
  estimatedValue: number;
  confidence: number;
  nextAction: string;
}

export interface Evidence {
  id: string;
  title: string;
  projectId?: string;
  source: string;
  claim: string;
  strength: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  projectId?: string;
  status: WorkStatus;
  priority: Priority;
  owner: string;
  dueAt?: string;
  source: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: "ACTIVE" | "IDLE" | "BLOCKED";
  authority: string;
  objective: string;
}

export interface AgentJob {
  id: string;
  agentId: string;
  title: string;
  status: WorkStatus;
  projectId?: string;
  createdAt: string;
  output?: string;
}

export interface Activity {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}

export interface PraxiosState {
  version: string;
  mission: Mission;
  metrics: {
    cash: number;
    revenue30d: number;
    weightedPipeline: number;
    mrr: number;
    burn: number;
  };
  projects: Project[];
  entities: GraphEntity[];
  relations: GraphRelation[];
  sessions: SessionRecord[];
  decisions: Decision[];
  opportunities: Opportunity[];
  evidence: Evidence[];
  tasks: Task[];
  agents: Agent[];
  agentJobs: AgentJob[];
  activity: Activity[];
  resources: {
    capabilities: string[];
    assets: string[];
    constraints: string[];
  };
}

export interface HarvestEnvelope {
  source: string;
  title: string;
  summary: string;
  projectId?: string;
  createdAt?: string;
  ideas?: Array<{ title: string; summary: string; confidence?: number; tags?: string[] }>;
  decisions?: Array<{ title: string; rationale: string; confidence?: number; reviewAt?: string; killCriteria?: string; scaleCriteria?: string }>;
  opportunities?: Array<{ title: string; score?: number; timeToCashDays?: number; estimatedValue?: number; confidence?: number; nextAction?: string }>;
  evidence?: Array<{ title: string; source?: string; claim: string; strength?: "LOW" | "MEDIUM" | "HIGH" }>;
  tasks?: Array<{ title: string; priority?: Priority; owner?: string; dueAt?: string }>;
  risks?: Array<{ title: string; summary: string; confidence?: number }>;
}
