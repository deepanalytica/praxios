export type SessionSource="chatgpt"|"claude"|"claude-code"|"codex"|"gemini"|"human"|"other";
export type KnowledgeKind="idea"|"decision"|"task"|"risk"|"opportunity"|"evidence"|"goal"|"resource"|"finding";
export type KnowledgeStatus="open"|"active"|"done"|"dismissed"|"blocked";
export type Severity="low"|"medium"|"high"|"critical";

export interface KnowledgeNode{
  id:string;
  kind:KnowledgeKind;
  title:string;
  summary:string;
  project?:string;
  status:KnowledgeStatus;
  confidence:number;
  severity?:Severity;
  tags:string[];
  createdAt:string;
  sourceSessionId?:string;
}
export interface GraphEdge{ id:string; from:string; to:string; type:string; createdAt:string }
export interface SessionRecord{
  id:string;
  source:SessionSource;
  title:string;
  project?:string;
  raw:string;
  summary:string;
  createdAt:string;
  harvestedAt:string;
  counts:Record<KnowledgeKind,number>;
}
export interface HarvestItem{
  kind:KnowledgeKind;
  title:string;
  summary?:string;
  project?:string;
  confidence?:number;
  severity?:Severity;
  tags?:string[];
  relatesTo?:string[];
}
export interface HarvestBundle{
  schemaVersion:"1.0";
  sessionId:string;
  source:SessionSource;
  title:string;
  project?:string;
  createdAt:string;
  summary:string;
  raw?:string;
  items:HarvestItem[];
}
export interface SystemEvent{
  id:string;
  type:string;
  title:string;
  detail:string;
  project?:string;
  actor:string;
  createdAt:string;
}
export interface WorkflowStep{
  id:string;
  label:string;
  agent:string;
  status:"queued"|"running"|"done"|"blocked";
}
export interface Workflow{
  id:string;
  name:string;
  objective:string;
  project?:string;
  status:"idle"|"running"|"completed"|"blocked";
  trigger:string;
  steps:WorkflowStep[];
  lastRun?:string;
}
export type DealStage="Lead"|"Qualified"|"Discovery"|"Proposal"|"Negotiation"|"Won"|"Lost";
export interface RevenueDeal{
  id:string;
  account:string;
  offer:string;
  project:string;
  stage:DealStage;
  value:number;
  probability:number;
  nextAction:string;
  createdAt:string;
  sourceOpportunityId?:string;
}
export interface Resource{
  id:string;
  name:string;
  category:"capability"|"asset"|"channel"|"data"|"capital"|"infrastructure";
  description:string;
  reusableBy:string[];
  leverage:number;
}
export interface CioBrief{
  generatedAt:string;
  systemHealth:number;
  thesis:string;
  priorities:Array<{title:string;reason:string;project?:string}>;
  avoid:string[];
  needsDecision:string[];
  opportunities:string[];
}
export interface PraxiosState{
  sessions:SessionRecord[];
  nodes:KnowledgeNode[];
  edges:GraphEdge[];
  events:SystemEvent[];
  workflows:Workflow[];
  resources:Resource[];
  deals:RevenueDeal[];
  ceoBrief:CioBrief|null;
}
