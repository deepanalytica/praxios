import { useMemo, useState } from "react";
import {
  activeOpportunities,
  buildSessionProtocol,
  buildStateBrief,
  money,
  projectById,
  systemHealth,
  todayTasks,
  topProjects,
  safeParseHarvest,
} from "../os/engine";
import { usePraxios } from "../os/store";
import type { HarvestEnvelope } from "../os/types";

function Kicker({ children }: { children: string }) {
  return <div className="os-kicker">{children}</div>;
}

function Head({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="os-head">
      <div>
        <Kicker>{eyebrow}</Kicker>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

function ProjectPill({ projectId }: { projectId?: string }) {
  const { state } = usePraxios();
  const project = projectById(state, projectId);
  return project ? <span className="os-project-pill">{project.name}</span> : null;
}

function StateBadge({ value }: { value: string }) {
  return <span className={"os-state os-state-" + value.toLowerCase()}>{value}</span>;
}

function Metric({
  label,
  value,
  sub,
  signal,
}: {
  label: string;
  value: string;
  sub: string;
  signal?: string;
}) {
  return (
    <article className="os-metric">
      <div className="os-metric-top">
        <span>{label}</span>
        {signal ? <i>{signal}</i> : null}
      </div>
      <strong>{value}</strong>
      <p>{sub}</p>
    </article>
  );
}

function Copilot() {
  const { state } = usePraxios();
  const [answer, setAnswer] = useState(
    "Tengo el estado institucional, no sólo el contexto de este chat. Puedo orientarte sobre foco, dinero, bloqueos y siguientes decisiones.",
  );

  const run = (intent: "today" | "money" | "stop" | "claude") => {
    if (intent === "today") {
      const tasks = todayTasks(state);
      setAnswer(
        tasks.length
          ? "Prioridad inmediata: " +
              tasks
                .slice(0, 3)
                .map((task, index) => `${index + 1}. ${task.title}`)
                .join(" · ")
          : "No hay tareas abiertas de alta prioridad.",
      );
    } else if (intent === "money") {
      const opportunities = activeOpportunities(state).slice(0, 3);
      setAnswer(
        "Mejor ruta económica actual: " +
          opportunities
            .map(
              (opportunity) =>
                `${opportunity.title} (score ${opportunity.score}, ${money(opportunity.estimatedValue)})`,
            )
            .join(" · "),
      );
    } else if (intent === "stop") {
      const paused = state.projects.filter(
        (project) => project.state === "HOLD" || project.state === "KILL",
      );
      setAnswer(
        paused.length
          ? "No asignaría capacidad de construcción a: " +
              paused.map((project) => project.name).join(", ") +
              ". Sólo trabajo comercial/evidencia si corresponde."
          : "No hay proyectos formalmente en HOLD/KILL.",
      );
    } else {
      setAnswer(buildSessionProtocol(state, "praxios-core"));
    }
  };

  return (
    <aside className="os-copilot">
      <div className="os-copilot-head">
        <div>
          <Kicker>DECISION COPILOT</Kicker>
          <strong>PRAXIOS</strong>
        </div>
        <span className="os-live">● LIVE STATE</span>
      </div>
      <div className="os-copilot-answer">{answer}</div>
      <div className="os-copilot-actions">
        <button type="button" onClick={() => run("today")}>¿Qué hago hoy?</button>
        <button type="button" onClick={() => run("money")}>¿Dónde está el dinero?</button>
        <button type="button" onClick={() => run("stop")}>¿Qué detengo?</button>
        <button type="button" onClick={() => run("claude")}>Brief para Claude/Codex</button>
      </div>
    </aside>
  );
}

export function OSCommandCenter() {
  const { state, toggleTask } = usePraxios();
  const health = systemHealth(state);
  const tasks = todayTasks(state);
  const opportunities = activeOpportunities(state).slice(0, 4);
  const projects = topProjects(state);

  return (
    <>
      <Head
        eyebrow="PRAXIOS OS / CONTROL PLANE"
        title="Gobierna el sistema. No persigas conversaciones."
        description="Estado vivo, dinero, decisiones, oportunidades, ejecución y memoria institucional en un solo centro de mando."
        action={
          <div className="os-system-score">
            <span>SYSTEM STATE</span>
            <strong>{health}%</strong>
          </div>
        }
      />

      <section className="os-metrics">
        <Metric label="Caja" value={money(state.metrics.cash)} sub="capital visible" signal="↗" />
        <Metric label="Revenue 30D" value={money(state.metrics.revenue30d)} sub="evidencia económica" signal="↗" />
        <Metric label="Pipeline ponderado" value={money(state.metrics.weightedPipeline)} sub="no confundir con caja" />
        <Metric label="MRR" value={money(state.metrics.mrr)} sub="ingreso recurrente" signal="↗" />
        <Metric label="Sesiones cosechadas" value={String(state.sessions.length)} sub="memoria convertida en estado" />
      </section>

      <div className="os-command-layout">
        <div className="os-command-main">
          <section className="os-panel os-mission">
            <Kicker>MISSION</Kicker>
            <h2>{state.mission.title}</h2>
            <p>{state.mission.target}</p>
            <div className="os-mission-footer">
              <span>NORTH STAR</span>
              <strong>{state.mission.northStar.replaceAll("_", " ")}</strong>
            </div>
          </section>

          <section className="os-grid-2">
            <article className="os-panel">
              <div className="os-panel-title">
                <div>
                  <Kicker>TODAY / EXECUTION</Kicker>
                  <h2>Trabajo que mueve el sistema</h2>
                </div>
                <span>{tasks.length} open</span>
              </div>
              <div className="os-task-list">
                {tasks.map((task) => (
                  <button
                    type="button"
                    className={"os-task " + (task.status === "DONE" ? "is-done" : "")}
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                  >
                    <i className={"os-priority os-priority-" + task.priority.toLowerCase()} />
                    <div>
                      <strong>{task.title}</strong>
                      <span>{task.owner} · {task.priority}</span>
                    </div>
                    <ProjectPill projectId={task.projectId} />
                  </button>
                ))}
              </div>
            </article>

            <article className="os-panel">
              <div className="os-panel-title">
                <div>
                  <Kicker>PORTFOLIO</Kicker>
                  <h2>Capital allocation</h2>
                </div>
              </div>
              <div className="os-project-stack">
                {projects.map((project) => (
                  <div className="os-project-row" key={project.id}>
                    <div className="os-score-ring">{project.score}</div>
                    <div>
                      <strong>{project.name}</strong>
                      <p>{project.nextAction}</p>
                    </div>
                    <StateBadge value={project.state} />
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="os-panel">
            <div className="os-panel-title">
              <div>
                <Kicker>OPPORTUNITY RADAR</Kicker>
                <h2>Donde el sistema ve dinero</h2>
              </div>
              <span>ranked by score</span>
            </div>
            <div className="os-opportunity-strip">
              {opportunities.map((opportunity) => (
                <article key={opportunity.id}>
                  <div className="os-opportunity-score">{opportunity.score}</div>
                  <ProjectPill projectId={opportunity.projectId} />
                  <h3>{opportunity.title}</h3>
                  <strong>{money(opportunity.estimatedValue)}</strong>
                  <p>{opportunity.timeToCashDays} días a caja · {opportunity.confidence}% confidence</p>
                  <small>{opportunity.nextAction}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="os-panel">
            <div className="os-panel-title">
              <div>
                <Kicker>LIVE ACTIVITY</Kicker>
                <h2>Qué cambió en el sistema</h2>
              </div>
            </div>
            <div className="os-activity">
              {state.activity.slice(0, 8).map((item) => (
                <div key={item.id}>
                  <span>{new Date(item.createdAt).toLocaleString("es-CL", { hour: "2-digit", minute: "2-digit" })}</span>
                  <i />
                  <strong>{item.message}</strong>
                </div>
              ))}
            </div>
          </section>
        </div>
        <Copilot />
      </div>
    </>
  );
}

const sampleHarvest: HarvestEnvelope = {
  source: "claude-code",
  title: "Implementación del embudo VAI",
  summary: "Se terminó el componente de diagnóstico y apareció una oportunidad de empaquetarlo como oferta pagada.",
  projectId: "visual-art-ai",
  ideas: [
    {
      title: "Diagnóstico instantáneo como lead product",
      summary: "Convertir el diagnóstico en producto de entrada con upsell a implementación.",
      confidence: 74,
      tags: ["offer", "funnel"],
    },
  ],
  decisions: [],
  opportunities: [
    {
      title: "Producto de entrada de diagnóstico",
      score: 78,
      timeToCashDays: 5,
      estimatedValue: 500000,
      confidence: 70,
      nextAction: "Testear precio y conversión con 100 visitas cualificadas",
    },
  ],
  evidence: [
    {
      title: "Diagnóstico completado técnicamente",
      source: "claude-code",
      claim: "La capacidad ya existe y puede probarse comercialmente.",
      strength: "HIGH",
    },
  ],
  tasks: [
    {
      title: "Publicar test de precio del diagnóstico",
      priority: "HIGH",
      owner: "Growth",
    },
  ],
  risks: [],
};

export function HarvestCenter() {
  const { harvest, state } = usePraxios();
  const [raw, setRaw] = useState(JSON.stringify(sampleHarvest, null, 2));
  const [message, setMessage] = useState("Pega aquí el SESSION.CLOSE de cualquier modelo.");
  const [projectId, setProjectId] = useState("praxios-core");

  const ingest = () => {
    try {
      const parsed = safeParseHarvest(raw);
      harvest(parsed);
      setMessage("✓ Sesión cosechada. PRAXIOS actualizó memoria, decisiones, oportunidades, evidencia y tareas.");
    } catch (error) {
      setMessage(error instanceof Error ? "Error: " + error.message : "Harvest inválido.");
    }
  };

  return (
    <>
      <Head
        eyebrow="HARVEST ENGINE"
        title="Cada conversación debe dejar patrimonio."
        description="Claude Code, Codex, ChatGPT, Gemini o cualquier agente devuelve un envelope estructurado. PRAXIOS lo convierte en estado operativo."
      />

      <div className="os-harvest-layout">
        <section className="os-panel os-harvest-editor">
          <div className="os-panel-title">
            <div>
              <Kicker>SESSION.CLOSE</Kicker>
              <h2>Ingestar cosecha</h2>
            </div>
            <button type="button" className="os-primary" onClick={ingest}>Cosechar sesión</button>
          </div>
          <textarea value={raw} onChange={(event) => setRaw(event.target.value)} spellCheck={false} />
          <div className="os-harvest-status">{message}</div>
        </section>

        <aside className="os-panel">
          <Kicker>SESSION.START</Kicker>
          <h2>Generar contrato de contexto</h2>
          <p>Antes de trabajar, dale al modelo el estado vigente. Así no parte desde cero ni contradice decisiones sin saberlo.</p>
          <label className="os-field">
            <span>Proyecto</span>
            <select value={projectId} onChange={(event) => setProjectId(event.target.value)}>
              <option value="">Portfolio completo</option>
              {state.projects.map((project) => (
                <option value={project.id} key={project.id}>{project.name}</option>
              ))}
            </select>
          </label>
          <pre className="os-protocol-preview">{buildSessionProtocol(state, projectId || undefined)}</pre>
          <button
            type="button"
            className="os-secondary"
            onClick={() => navigator.clipboard.writeText(buildSessionProtocol(state, projectId || undefined))}
          >
            Copiar contrato para modelo
          </button>
        </aside>
      </div>
    </>
  );
}

export function SessionCenter() {
  const { state } = usePraxios();

  return (
    <>
      <Head
        eyebrow="SESSION GATEWAY"
        title="Todas las sesiones responden al mismo sistema."
        description="Registro de trabajo de modelos y agentes. El chat deja de ser el lugar donde vive la estrategia."
      />
      <section className="os-panel">
        <div className="os-panel-title">
          <div>
            <Kicker>SESSION HISTORY</Kicker>
            <h2>Sesiones cosechadas</h2>
          </div>
          <span>{state.sessions.length} total</span>
        </div>
        {state.sessions.length === 0 ? (
          <div className="os-empty">
            <strong>Aún no hay sesiones cosechadas.</strong>
            <p>Ve a Harvest y pega el SESSION.CLOSE de la próxima sesión de IA.</p>
          </div>
        ) : (
          <div className="os-session-list">
            {state.sessions.map((session) => (
              <article key={session.id}>
                <div>
                  <span>{session.source}</span>
                  <h3>{session.title}</h3>
                  <p>{session.summary}</p>
                </div>
                <ProjectPill projectId={session.projectId} />
                <div className="os-harvest-counts">
                  <span>{session.harvested.ideas} ideas</span>
                  <span>{session.harvested.decisions} decisions</span>
                  <span>{session.harvested.opportunities} opps</span>
                  <span>{session.harvested.evidence} evidence</span>
                  <span>{session.harvested.tasks} tasks</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export function DecisionCenter() {
  const { state } = usePraxios();

  return (
    <>
      <Head
        eyebrow="DECISION ENGINE"
        title="Decisiones vivas, no recuerdos vagos."
        description="Cada decisión conserva razón, confianza, criterio de muerte y criterio de escala."
      />
      <section className="os-decision-grid">
        {state.decisions.map((decision) => (
          <article className="os-panel os-decision" key={decision.id}>
            <div className="os-decision-top">
              <span>{decision.id}</span>
              <StateBadge value={decision.status} />
            </div>
            <ProjectPill projectId={decision.projectId} />
            <h2>{decision.title}</h2>
            <p>{decision.rationale}</p>
            <div className="os-confidence-line">
              <span>Confidence</span>
              <div><i style={{ width: decision.confidence + "%" }} /></div>
              <strong>{decision.confidence}%</strong>
            </div>
            <div className="os-guardrail-grid">
              <div><span>KILL</span><strong>{decision.killCriteria}</strong></div>
              <div><span>SCALE</span><strong>{decision.scaleCriteria}</strong></div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

export function OpportunityCenter() {
  const { state } = usePraxios();
  const opportunities = activeOpportunities(state);

  return (
    <>
      <Head
        eyebrow="OPPORTUNITY RADAR"
        title="Buscar, puntuar, probar, matar o escalar."
        description="La creatividad entra como hipótesis; la economía decide si recibe recursos."
      />
      <section className="os-radar-table">
        <div className="os-radar-head">
          <span>Score</span><span>Opportunity</span><span>Project</span><span>Value</span><span>Time to cash</span><span>Confidence</span><span>State</span>
        </div>
        {opportunities.map((opportunity) => (
          <div className="os-radar-row" key={opportunity.id}>
            <strong className="os-radar-score">{opportunity.score}</strong>
            <div><strong>{opportunity.title}</strong><small>{opportunity.nextAction}</small></div>
            <ProjectPill projectId={opportunity.projectId} />
            <strong>{money(opportunity.estimatedValue)}</strong>
            <span>{opportunity.timeToCashDays} d</span>
            <span>{opportunity.confidence}%</span>
            <StateBadge value={opportunity.status} />
          </div>
        ))}
      </section>
    </>
  );
}

export function MemoryCenter() {
  const { state } = usePraxios();
  const groups = useMemo(() => {
    const map = new Map<string, typeof state.entities>();
    for (const entity of state.entities) {
      const current = map.get(entity.kind) ?? [];
      current.push(entity);
      map.set(entity.kind, current);
    }
    return [...map.entries()];
  }, [state.entities]);

  return (
    <>
      <Head
        eyebrow="STATE GRAPH"
        title="La memoria institucional tiene estructura."
        description="Ideas, problemas, capacidades, riesgos y relaciones sobreviven al modelo que las originó."
      />
      <div className="os-memory-layout">
        <section className="os-memory-groups">
          {groups.map(([kind, entities]) => (
            <article className="os-panel" key={kind}>
              <div className="os-panel-title">
                <div><Kicker>{kind.toUpperCase()}</Kicker><h2>{entities.length} entities</h2></div>
              </div>
              <div className="os-entity-list">
                {entities.map((entity) => (
                  <div key={entity.id}>
                    <span>{entity.id}</span>
                    <strong>{entity.title}</strong>
                    <p>{entity.summary}</p>
                    {entity.confidence ? <small>{entity.confidence}% confidence</small> : null}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
        <aside className="os-panel">
          <Kicker>RELATIONSHIPS</Kicker>
          <h2>Graph edges</h2>
          <div className="os-relations">
            {state.relations.map((relation) => (
              <div key={relation.id}>
                <code>{relation.from}</code>
                <span>→ {relation.type} →</span>
                <code>{relation.to}</code>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}

export function ExecutionCenter() {
  const { state, toggleTask } = usePraxios();
  const columns = ["TODO", "DOING", "BLOCKED", "DONE"] as const;

  return (
    <>
      <Head
        eyebrow="EXECUTION PIPELINES"
        title="La decisión termina en trabajo verificable."
        description="Tareas y agentes conectados a proyectos. Nada debería existir sólo porque alguien lo escribió en un chat."
      />
      <section className="os-kanban">
        {columns.map((column) => (
          <div className="os-kanban-column" key={column}>
            <div className="os-kanban-title"><span>{column}</span><strong>{state.tasks.filter((task) => task.status === column).length}</strong></div>
            {state.tasks.filter((task) => task.status === column).map((task) => (
              <button type="button" key={task.id} className="os-kanban-card" onClick={() => toggleTask(task.id)}>
                <i className={"os-priority os-priority-" + task.priority.toLowerCase()} />
                <strong>{task.title}</strong>
                <ProjectPill projectId={task.projectId} />
                <span>{task.owner} · {task.priority}</span>
              </button>
            ))}
          </div>
        ))}
      </section>
    </>
  );
}

export function AgentCenter() {
  const { state } = usePraxios();

  return (
    <>
      <Head
        eyebrow="AGENT WORKFORCE"
        title="Los modelos son trabajadores reemplazables."
        description="El poder está en permisos, contexto, evidencia y objetivos compartidos; no en una personalidad de agente."
      />
      <section className="os-agent-grid">
        {state.agents.map((agent) => (
          <article className="os-panel os-agent" key={agent.id}>
            <div className="os-agent-icon">{agent.name.slice(0, 2).toUpperCase()}</div>
            <div className="os-agent-main">
              <div><h2>{agent.name}</h2><span>{agent.role}</span></div>
              <p>{agent.objective}</p>
              <div className="os-agent-authority"><span>AUTHORITY</span><strong>{agent.authority}</strong></div>
            </div>
            <span className={"os-agent-status " + agent.status.toLowerCase()}>{agent.status}</span>
          </article>
        ))}
      </section>
    </>
  );
}

export function EvidenceCenter() {
  const { state } = usePraxios();

  return (
    <>
      <Head
        eyebrow="EVIDENCE LEDGER"
        title="La IA recomienda. La evidencia decide."
        description="Cada afirmación material debería poder remontarse a una señal, experimento, cliente, fuente o resultado."
      />
      <section className="os-evidence-list">
        {state.evidence.map((item) => (
          <article className="os-panel" key={item.id}>
            <div className="os-evidence-top">
              <span>{item.id}</span>
              <span className={"os-strength " + item.strength.toLowerCase()}>{item.strength}</span>
            </div>
            <ProjectPill projectId={item.projectId} />
            <h2>{item.title}</h2>
            <p>{item.claim}</p>
            <small>{item.source} · {new Date(item.createdAt).toLocaleDateString("es-CL")}</small>
          </article>
        ))}
      </section>
    </>
  );
}

export function ResourceCenter() {
  const { state } = usePraxios();

  const blocks = [
    ["CAPABILITIES", state.resources.capabilities],
    ["ASSETS", state.resources.assets],
    ["CONSTRAINTS", state.resources.constraints],
  ] as const;

  return (
    <>
      <Head
        eyebrow="RESOURCE ENGINE"
        title="Saber con qué contamos cambia qué podemos decidir."
        description="Capacidades, activos y restricciones se convierten en variables explícitas de asignación."
      />
      <section className="os-resource-grid">
        {blocks.map(([label, items]) => (
          <article className="os-panel" key={label}>
            <Kicker>{label}</Kicker>
            <div className="os-resource-list">
              {items.map((item, index) => (
                <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

export function SystemCenter() {
  const { state, exportState, importState, resetState } = usePraxios();
  const [snapshot, setSnapshot] = useState("");
  const [status, setStatus] = useState("El navegador mantiene una copia local persistente.");

  const doExport = () => {
    const value = exportState();
    setSnapshot(value);
    setStatus("Snapshot generado. Puedes guardarlo o sincronizarlo con data/praxios-state.json.");
  };

  const doImport = () => {
    try {
      importState(snapshot);
      setStatus("✓ Snapshot importado.");
    } catch (error) {
      setStatus(error instanceof Error ? "Error: " + error.message : "Snapshot inválido.");
    }
  };

  return (
    <>
      <Head
        eyebrow="META-HARNESS / SYSTEM"
        title="Gobierno, portabilidad y control."
        description="El estado no depende de un proveedor de IA. Puede exportarse, auditarse y volver a cargarse."
      />
      <div className="os-system-layout">
        <section className="os-panel">
          <Kicker>STATE SNAPSHOT</Kicker>
          <h2>{state.version}</h2>
          <p>{status}</p>
          <div className="os-button-row">
            <button type="button" className="os-primary" onClick={doExport}>Exportar estado</button>
            <button type="button" className="os-secondary" onClick={doImport}>Importar textarea</button>
            <button type="button" className="os-danger" onClick={resetState}>Restaurar seed</button>
          </div>
          <textarea className="os-system-textarea" value={snapshot} onChange={(event) => setSnapshot(event.target.value)} placeholder="Snapshot JSON..." />
        </section>
        <aside className="os-panel">
          <Kicker>MODEL-AGNOSTIC SESSION</Kicker>
          <h2>Protocolo para CLI</h2>
          <pre className="os-terminal">{`# Start
npm run praxios -- brief visual-art-ai

# Agent works...

# Close
npm run praxios -- harvest harvest/session.json

# Check
npm run praxios -- validate`}</pre>
          <Kicker>STATE BRIEF</Kicker>
          <pre className="os-protocol-preview">{buildStateBrief(state)}</pre>
        </aside>
      </div>
    </>
  );
}
