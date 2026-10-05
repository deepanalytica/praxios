#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const statePath = path.join(root, "data", "praxios-state.json");

function load() {
  return JSON.parse(fs.readFileSync(statePath, "utf8"));
}
function save(state) {
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + "\n");
}
function id(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
function now() {
  return new Date().toISOString();
}
function money(value) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(value);
}
function brief(state, projectId) {
  const project = state.projects.find((item) => item.id === projectId);
  const tasks = state.tasks.filter((item) => item.status !== "DONE").slice(0, 6);
  const opportunities = [...state.opportunities].sort((a,b)=>b.score-a.score).slice(0,5);
  console.log("# PRAXIOS STATE BRIEF");
  console.log("\nMISSION\n" + state.mission.title + "\n" + state.mission.target);
  console.log("\nFOCUS\n" + (project ? `${project.name} — ${project.state}\n${project.objective}\nNext: ${project.nextAction}` : "Portfolio-wide"));
  console.log("\nTOP OPPORTUNITIES");
  opportunities.forEach((opp)=>console.log(`- ${opp.id}: ${opp.title} — score ${opp.score} — ${money(opp.estimatedValue)}`));
  console.log("\nACTIVE TASKS");
  tasks.forEach((task)=>console.log(`- [${task.priority}] ${task.title} — ${task.owner}`));
  console.log("\nSESSION CLOSE");
  console.log("Return a HarvestEnvelope JSON with source, title, summary, projectId, ideas, decisions, opportunities, evidence, tasks and risks.");
}
function harvest(state, file) {
  const payload = JSON.parse(fs.readFileSync(path.resolve(file), "utf8"));
  if (!payload.source || !payload.title || !payload.summary) throw new Error("HarvestEnvelope inválido");
  const createdAt = payload.createdAt || now();
  const sessionId = id("SES");
  state.sessions.unshift({
    id: sessionId,
    source: payload.source,
    title: payload.title,
    summary: payload.summary,
    projectId: payload.projectId,
    closedAt: createdAt,
    harvested: {
      ideas: (payload.ideas || []).length,
      decisions: (payload.decisions || []).length,
      opportunities: (payload.opportunities || []).length,
      evidence: (payload.evidence || []).length,
      tasks: (payload.tasks || []).length,
      risks: (payload.risks || []).length
    }
  });
  for (const idea of payload.ideas || []) state.entities.unshift({id:id("IDEA"),kind:"idea",title:idea.title,summary:idea.summary,status:"OPEN",projectId:payload.projectId,confidence:idea.confidence||60,createdAt,tags:idea.tags||[]});
  for (const risk of payload.risks || []) state.entities.unshift({id:id("RSK"),kind:"risk",title:risk.title,summary:risk.summary,status:"OPEN",projectId:payload.projectId,confidence:risk.confidence||60,createdAt,tags:["risk"]});
  for (const decision of payload.decisions || []) state.decisions.unshift({id:id("DEC"),title:decision.title,projectId:payload.projectId,status:"ACTIVE",confidence:decision.confidence||65,rationale:decision.rationale,createdAt,reviewAt:decision.reviewAt,killCriteria:decision.killCriteria||"Definir",scaleCriteria:decision.scaleCriteria||"Definir"});
  for (const opp of payload.opportunities || []) state.opportunities.unshift({id:id("OPP"),title:opp.title,projectId:payload.projectId,score:opp.score||55,status:"TEST",timeToCashDays:opp.timeToCashDays||14,estimatedValue:opp.estimatedValue||0,confidence:opp.confidence||55,nextAction:opp.nextAction||"Diseñar experimento"});
  for (const item of payload.evidence || []) state.evidence.unshift({id:id("EVD"),title:item.title,projectId:payload.projectId,source:item.source||payload.source,claim:item.claim,strength:item.strength||"MEDIUM",createdAt});
  for (const task of payload.tasks || []) state.tasks.unshift({id:id("TSK"),title:task.title,projectId:payload.projectId,status:"TODO",priority:task.priority||"MEDIUM",owner:task.owner||"Owner",dueAt:task.dueAt,source:sessionId});
  state.activity.unshift({id:id("ACT"),type:"harvest",message:`Harvested ${payload.source}: ${payload.title}`,createdAt});
  save(state);
  console.log(`Harvest complete: ${sessionId}`);
}

const [command, arg] = process.argv.slice(2);
const state = load();

if (command === "brief") brief(state, arg);
else if (command === "harvest") harvest(state, arg);
else if (command === "snapshot") console.log(JSON.stringify(state, null, 2));
else if (command === "validate") {
  if (!state.version || !Array.isArray(state.projects) || !Array.isArray(state.decisions)) process.exit(1);
  console.log("PRAXIOS state valid");
}
else {
  console.log("Usage: npm run praxios -- brief [projectId] | harvest <file.json> | snapshot | validate");
}
