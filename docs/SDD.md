# SDD — PRAXIOS Value Factory

## 1. Arquitectura lógica

Owner
→ AI CEO / Capital Allocator
→ Investment Committee
→ Executive Agents
→ Experiments / Revenue / Operations
→ Evidence & Metrics
→ AI CEO

El CEO no ejecuta tareas operativas. Decide asignación, prioridad y estado de cartera.

## 2. Capas

### Presentation
React + TypeScript. Dashboard ejecutivo responsive, orientado a lectura rápida y decisión.

### Domain
Tipos, Opportunity Score, políticas de estado, guardrails y reglas de decisión. Debe mantenerse independiente del proveedor LLM.

### Agent Runtime
AgentModelProvider define un contrato común para OpenAI, Anthropic, Google u otros proveedores. Las salidas deben ser estructuradas, con confidence y evidencia utilizada.

### Data
V1 usa seed data para validar interacción. V2 persiste Projects, Opportunities, Experiments, Products, Offers, Leads, Deals, Revenue, Expenses, Decisions, Evidence, Risks, AgentRuns y Events.

### Event layer
Eventos objetivo:
- lead.created
- deal.won
- payment.received
- expense.created
- experiment.threshold_reached
- opportunity.detected
- decision.requested
- project.deadline_missed

Los eventos activan agentes relevantes en lugar de mantener agentes conversando permanentemente.

## 3. Entidades futuras

organizations
projects
opportunities
products
offers
experiments
agents
agent_runs
agent_outputs
decisions
decision_votes
evidence
leads
contacts
companies
deals
customers
campaigns
content
revenue
expenses
subscriptions
budgets
metrics
events
tasks
workflows
risks
alerts

## 4. Seguridad

- secretos sólo en secret stores;
- mínimo privilegio para conectores;
- acciones externas separadas de recomendaciones;
- aprobación humana para pagos, compromisos contractuales y operaciones irreversibles;
- audit trail para decisiones materiales;
- ningún dato sensible en logs de agente;
- allowlists por herramienta y por agente.

## 5. Observabilidad

Cada AgentRun debe registrar agent_id, input_hash, model/provider, coste, duración, evidence_ids, confidence, output estructurado y decisión resultante.

## 6. Despliegue

Frontend: Cloudflare Pages.
CI/CD: GitHub Actions.
Persistencia futura: PostgreSQL/Supabase.
Storage futuro: Cloudflare R2.
Jobs/eventos futuros: Cloudflare Workers + Queues.

No Vercel.
