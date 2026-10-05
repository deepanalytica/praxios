import{useMemo,useState}from"react";
import{agents,projects}from"../data/seed";
import{authorityMatrix}from"../os/harness";
import{metaHarnessRules,sessionCloseProtocol,sessionStartProtocol}from"../os/protocol";
import{routingMatrix}from"../os/router";
import{usePraxios}from"../os/store";
import type{HarvestBundle,KnowledgeKind,SessionSource}from"../os/types";
import{money,Score,SectionHeader,StatusBadge}from"./Ui";

const kindLabel:Record<KnowledgeKind,string>={
  idea:"Ideas",decision:"Decisiones",task:"Tareas",risk:"Riesgos",opportunity:"Oportunidades",
  evidence:"Evidencia",goal:"Objetivos",resource:"Recursos",finding:"Hallazgos",
};
const kinds=Object.keys(kindLabel) as KnowledgeKind[];
const fmt=(value:string)=>new Intl.DateTimeFormat("es-CL",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}).format(new Date(value));

function NodeBadge({kind}:{kind:KnowledgeKind}){return <span className={"node-kind kind-"+kind}>{kindLabel[kind]}</span>}

export function OSCommandCenter(){
  const{state,runCeoCycle}=usePraxios();
  const brief=state.ceoBrief;
  const openDecisions=state.nodes.filter(n=>n.kind==="decision"&&n.status!=="done"&&n.status!=="dismissed");
  const opportunities=state.nodes.filter(n=>n.kind==="opportunity"&&n.status!=="done"&&n.status!=="dismissed");
  const openRisks=state.nodes.filter(n=>n.kind==="risk"&&n.status!=="done"&&n.status!=="dismissed");
  const running=state.workflows.filter(w=>w.status==="running").length;
  return <>
    <SectionHeader eyebrow="PRAXIOS CONTROL PLANE" title="Gobierna el sistema. No persigas conversaciones."
      description="Estado vivo, decisiones, oportunidades, agentes y ejecución reunidos en un mismo centro de mando."
      action={<button type="button" className="primary-button" onClick={runCeoCycle}>Ejecutar CEO cycle</button>}/>
    <section className="os-metrics">
      <article><span>System health</span><strong>{brief?.systemHealth??0}%</strong><i style={{width:(brief?.systemHealth??0)+"%"}}/></article>
      <article><span>Sesiones cosechadas</span><strong>{state.sessions.length}</strong><small>memoria institucional</small></article>
      <article><span>Decisiones abiertas</span><strong>{openDecisions.length}</strong><small>requieren gobierno</small></article>
      <article><span>Oportunidades</span><strong>{opportunities.length}</strong><small>señales activas</small></article>
      <article><span>Pipelines activos</span><strong>{running}</strong><small>{openRisks.length} riesgos abiertos</small></article>
    </section>

    <section className="os-command-grid">
      <article className="panel ceo-brief">
        <div className="panel-kicker">AI CEO / CAPITAL ALLOCATOR</div>
        <h2>{brief?.thesis||"Ejecuta el CEO cycle para recalcular el estado."}</h2>
        <div className="health-line"><span>Estado del sistema</span><strong>{brief?.systemHealth??0}/100</strong></div>
        <div className="ceo-priorities">
          {(brief?.priorities||[]).map((p,index)=><div key={p.title}><span>0{index+1}</span><div><strong>{p.title}</strong><p>{p.reason}</p>{p.project?<small>{p.project}</small>:null}</div></div>)}
        </div>
      </article>

      <article className="panel decision-inbox">
        <div className="panel-kicker">NEEDS YOUR DECISION</div>
        {openDecisions.length===0?<p className="empty">No hay decisiones pendientes.</p>:openDecisions.slice(0,5).map(n=>
          <div className="inbox-row" key={n.id}><div><strong>{n.title}</strong><p>{n.project||"Sistema"}</p></div><span>{n.confidence}%</span></div>)}
        <div className="panel-kicker spacer-kicker">DO NOT DO</div>
        <ul className="avoid-list">{(brief?.avoid||[]).map(v=><li key={v}>{v}</li>)}</ul>
      </article>

      <article className="panel live-activity">
        <div className="panel-kicker">LIVE ACTIVITY</div>
        {state.events.slice(0,8).map(e=><div className="activity-row" key={e.id}>
          <span className="activity-dot"/><div><strong>{e.title}</strong><p>{e.detail}</p><small>{fmt(e.createdAt)} · {e.actor}</small></div>
        </div>)}
      </article>
    </section>

    <section className="panel state-brief">
      <div className="panel-heading"><div><div className="panel-kicker">STATE BRIEF</div><h2>Qué sabe el sistema ahora</h2></div><span className="microcopy">Se recalcula después de cada cosecha</span></div>
      <div className="state-brief-grid">
        <div><span>OBJETIVO PRINCIPAL</span><strong>{state.nodes.find(n=>n.kind==="goal"&&n.status==="active")?.title||"Sin objetivo activo"}</strong></div>
        <div><span>MEJOR OPORTUNIDAD</span><strong>{[...opportunities].sort((a,b)=>b.confidence-a.confidence)[0]?.title||"Sin oportunidad validada"}</strong></div>
        <div><span>RIESGO DOMINANTE</span><strong>{openRisks[0]?.title||"Sin riesgo crítico"}</strong></div>
        <div><span>ÚLTIMA COSECHA</span><strong>{state.sessions[0]?.title||"Aún no has cosechado una sesión"}</strong></div>
      </div>
    </section>
  </>;
}

export function SessionGateway(){
  const{state,previewHarvest,commitHarvest}=usePraxios();
  const[source,setSource]=useState<SessionSource>("chatgpt");
  const[project,setProject]=useState("");
  const[title,setTitle]=useState("");
  const[raw,setRaw]=useState("");
  const[preview,setPreview]=useState<HarvestBundle|null>(null);
  const[message,setMessage]=useState("");

  const makePreview=()=>{
    if(!raw.trim()){setMessage("Pega una conversación, resumen o payload PRAXIOS_SESSION_HARVEST.");return}
    setPreview(previewHarvest({raw,source,title:title||"Sesión sin título",project:project||undefined}));
    setMessage("");
  };
  const commit=()=>{
    if(!preview)return;
    commitHarvest(preview);
    setMessage(`Cosecha incorporada: ${preview.items.length} objetos procesados.`);
    setPreview(null);setRaw("");setTitle("");
  };

  return <>
    <SectionHeader eyebrow="SESSION GATEWAY" title="Cada sesión debe aumentar el patrimonio intelectual."
      description="Pega una conversación completa, un resumen de Claude/Codex/ChatGPT o un payload estructurado. PRAXIOS lo convierte en estado institucional."/>
    <section className="gateway-layout">
      <article className="panel ingest-panel">
        <div className="form-grid">
          <label><span>Fuente</span><select value={source} onChange={e=>setSource(e.target.value as SessionSource)}>
            <option value="chatgpt">ChatGPT</option><option value="claude">Claude</option><option value="claude-code">Claude Code</option>
            <option value="codex">Codex</option><option value="gemini">Gemini</option><option value="human">Humano</option><option value="other">Otro</option>
          </select></label>
          <label><span>Proyecto</span><select value={project} onChange={e=>setProject(e.target.value)}>
            <option value="">Sistema / transversal</option>{projects.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}
          </select></label>
        </div>
        <label className="field"><span>Título de sesión</span><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Ej: Validación de oferta MSJ para clínicas"/></label>
        <label className="field"><span>Contenido</span><textarea className="session-input" value={raw} onChange={e=>setRaw(e.target.value)}
          placeholder={"Pega aquí la conversación o usa líneas como:\nIdea: ...\nDecisión: ...\nOportunidad: ...\nTarea: ...\nRiesgo: ...\nEvidencia: ..."}/></label>
        <div className="gateway-actions"><button type="button" className="primary-button" onClick={makePreview}>Cosechar sesión</button><span>{raw.length.toLocaleString("es-CL")} caracteres</span></div>
        {message?<p className="form-message">{message}</p>:null}
      </article>

      <article className="panel harvest-preview">
        <div className="panel-heading"><div><div className="panel-kicker">HARVEST PREVIEW</div><h2>{preview?.title||"Esperando una sesión"}</h2></div>{preview?<span className="harvest-count">{preview.items.length}</span>:null}</div>
        {!preview?<div className="empty-state"><strong>La conversación no es la memoria.</strong><p>La memoria son los objetos estructurados que sobreviven a ella.</p></div>:
        <>
          <p className="preview-summary">{preview.summary}</p>
          <div className="harvest-items">{preview.items.map(item=><div key={`${item.kind}-${item.project||"system"}-${item.title}-${item.summary||""}`}><NodeBadge kind={item.kind}/><div><strong>{item.title}</strong><p>{item.summary}</p></div><span>{item.confidence??70}%</span></div>)}</div>
          <button type="button" className="primary-button full-button" onClick={commit}>Incorporar al State Graph</button>
        </>}
      </article>
    </section>
    <section className="panel recent-sessions"><div className="panel-heading"><div><div className="panel-kicker">SESSION MEMORY</div><h2>Últimas cosechas</h2></div><span className="microcopy">{state.sessions.length} sesiones persistidas</span></div>
      {state.sessions.length===0?<p className="empty">Todavía no hay sesiones cosechadas.</p>:state.sessions.slice(0,8).map(s=><div className="session-row" key={s.id}><div><strong>{s.title}</strong><p>{s.summary}</p></div><div><span>{s.source}</span><small>{s.project||"transversal"} · {fmt(s.harvestedAt)}</small></div></div>)}
    </section>
  </>;
}

export function StateGraphPage(){
  const{state}=usePraxios();
  const[filter,setFilter]=useState<KnowledgeKind|"all">("all");
  const nodes=useMemo(()=>state.nodes.filter(n=>filter==="all"||n.kind===filter).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)),[state.nodes,filter]);
  return <>
    <SectionHeader eyebrow="STATE GRAPH" title="La organización recuerda objetos, no conversaciones."
      description="Ideas, decisiones, tareas, riesgos, evidencia y oportunidades permanecen conectados aunque cambie el modelo que las produjo."/>
    <section className="ontology-strip">
      <button type="button" className={filter==="all"?"ontology-active":""} onClick={()=>setFilter("all")}><strong>{state.nodes.length}</strong><span>Todo</span></button>
      {kinds.map(k=><button type="button" className={filter===k?"ontology-active":""} key={k} onClick={()=>setFilter(k)}><strong>{state.nodes.filter(n=>n.kind===k).length}</strong><span>{kindLabel[k]}</span></button>)}
    </section>
    <section className="graph-layout">
      <article className="panel graph-canvas">
        <div className="graph-head"><span>{nodes.length} nodos visibles</span><span>{state.edges.length} relaciones</span></div>
        <div className="node-grid">{nodes.map(node=><article className={"knowledge-node node-"+node.kind} key={node.id}>
          <div className="node-top"><NodeBadge kind={node.kind}/><span>{node.confidence}%</span></div>
          <h3>{node.title}</h3><p>{node.summary}</p>
          <div className="node-footer"><span>{node.project||"PRAXIOS"}</span><span>{node.status}</span></div>
        </article>)}</div>
      </article>
      <aside className="panel graph-inspector">
        <div className="panel-kicker">ONTOLOGY</div><h2>Relaciones vivas</h2>
        {state.edges.slice(-12).reverse().map(edge=>{
          const from=state.nodes.find(n=>n.id===edge.from);const to=state.nodes.find(n=>n.id===edge.to);
          return <div className="edge-row" key={edge.id}><strong>{from?.title||edge.from}</strong><span>{edge.type}</span><strong>{to?.title||edge.to}</strong></div>
        })}
      </aside>
    </section>
  </>;
}

export function DecisionCenter(){
  const{state,updateNodeStatus,runCeoCycle}=usePraxios();
  const decisions=state.nodes.filter(n=>n.kind==="decision"||n.kind==="risk").sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
  return <>
    <SectionHeader eyebrow="DECISION ENGINE" title="Decisiones explícitas, revisables y trazables."
      description="PRAXIOS distingue una idea de una decisión y una decisión de evidencia. Nada importante debería quedar implícito en un chat."
      action={<button type="button" className="primary-button" onClick={runCeoCycle}>Recalcular recomendación</button>}/>
    <section className="decision-os-list">{decisions.map(node=><article className="panel decision-os-card" key={node.id}>
      <div className="decision-os-head"><div><NodeBadge kind={node.kind}/><h2>{node.title}</h2></div><span className={"decision-status ds-"+node.status}>{node.status}</span></div>
      <p>{node.summary}</p><div className="decision-os-meta"><span>Proyecto <strong>{node.project||"Sistema"}</strong></span><span>Confianza <strong>{node.confidence}%</strong></span>{node.severity?<span>Severidad <strong>{node.severity}</strong></span>:null}</div>
      <div className="decision-actions"><button type="button" onClick={()=>updateNodeStatus(node.id,"active")}>Activar</button><button type="button" onClick={()=>updateNodeStatus(node.id,"done")}>Resolver</button><button type="button" onClick={()=>updateNodeStatus(node.id,"dismissed")}>Descartar</button></div>
    </article>)}</section>
  </>;
}

export function OpportunityRadar(){
  const{state,updateNodeStatus}=usePraxios();
  const opportunities=state.nodes.filter(n=>n.kind==="opportunity").sort((a,b)=>b.confidence-a.confidence);
  return <>
    <SectionHeader eyebrow="OPPORTUNITY RADAR" title="El sistema también debe salir a buscar."
      description="Problemas pagados, activos subutilizados y nuevas combinaciones de capacidades se convierten en hipótesis económicas, no en proyectos automáticos."/>
    <section className="radar-grid">
      <article className="panel radar-scope"><div className="radar-circle"><div><strong>{opportunities.length}</strong><span>señales</span></div></div>
        <h2>Mandato de exploración</h2><p>Buscar demanda compatible con capacidades actuales y priorizar time-to-cash, margen, distribución y ventaja existente.</p>
        <div className="radar-missions"><span>Problemas pagados</span><span>Servicios productizables</span><span>Productos digitales</span><span>Clientes de alto intent</span><span>Automatización vendible</span></div>
      </article>
      <div className="opportunity-stack">{opportunities.map(o=><article className="panel opportunity-card" key={o.id}>
        <div className="opportunity-head"><div><span className="opp-project">{o.project||"Transversal"}</span><h2>{o.title}</h2></div><Score value={o.confidence}/></div>
        <p>{o.summary}</p><div className="opp-tags">{o.tags.map(t=><span key={t}>{t}</span>)}</div>
        <div className="opportunity-actions"><button type="button" onClick={()=>updateNodeStatus(o.id,"active")}>Validar</button><button type="button" onClick={()=>updateNodeStatus(o.id,"dismissed")}>Descartar</button></div>
      </article>)}</div>
    </section>
  </>;
}

export function WorkflowsPage(){
  const{state,runWorkflow}=usePraxios();
  return <>
    <SectionHeader eyebrow="EXECUTION PIPELINES" title="Delegación gobernada, no agentes conversando sin fin."
      description="Cada pipeline tiene trigger, objetivo, agentes responsables y estado observable."/>
    <section className="workflow-grid">{state.workflows.map(w=><article className="panel workflow-card" key={w.id}>
      <div className="workflow-head"><div><span className="workflow-trigger">{w.trigger}</span><h2>{w.name}</h2></div><span className={"workflow-status wf-"+w.status}>{w.status}</span></div>
      <p>{w.objective}</p><div className="workflow-steps">{w.steps.map((s,index)=><div className={"workflow-step step-"+s.status} key={s.id}><span>{String(index+1).padStart(2,"0")}</span><div><strong>{s.label}</strong><small>{s.agent}</small></div><i>{s.status}</i></div>)}</div>
      <button type="button" className="secondary-button full-button" onClick={()=>runWorkflow(w.id)}>Avanzar pipeline</button>
    </article>)}</section>
  </>;
}

export function ActionQueuePage(){
  const{state,updateNodeStatus,addKnowledgeNode}=usePraxios();
  const[title,setTitle]=useState("");
  const[project,setProject]=useState("");
  const tasks=state.nodes.filter(n=>n.kind==="task").sort((a,b)=>{
    const rank={active:0,open:1,blocked:2,done:3,dismissed:4};
    return rank[a.status]-rank[b.status]||b.createdAt.localeCompare(a.createdAt);
  });
  const createTask=()=>{
    if(!title.trim())return;
    addKnowledgeNode({kind:"task",title,summary:title,project:project||undefined,confidence:90});
    setTitle("");
  };
  return <>
    <SectionHeader eyebrow="ACTION QUEUE" title="Las conversaciones terminan en acciones o aprendizaje."
      description="Tareas cosechadas, acciones manuales y bloqueos visibles en un único frente de ejecución."/>
    <section className="action-summary">
      {(["active","open","blocked","done"] as const).map(status=><article key={status}><span>{status}</span><strong>{tasks.filter(t=>t.status===status).length}</strong></article>)}
    </section>
    <section className="action-layout">
      <article className="panel quick-action">
        <div className="panel-kicker">QUICK CAPTURE</div><h2>Crear acción</h2>
        <label className="field"><span>Tarea</span><input value={title} onChange={e=>setTitle(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")createTask()}} placeholder="Ej: contactar 5 prospectos VAI"/></label>
        <label className="field"><span>Proyecto</span><select value={project} onChange={e=>setProject(e.target.value)}><option value="">Transversal</option>{projects.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select></label>
        <button type="button" className="primary-button full-button" onClick={createTask}>Agregar a ejecución</button>
        <div className="execution-rule"><span>REGLA</span><p>Si una acción no produce revenue, evidencia, reducción de riesgo o capacidad reutilizable, debe justificar por qué consume tiempo.</p></div>
      </article>
      <div className="task-stack">
        {tasks.length===0?<article className="panel empty-state"><strong>Sin tareas cosechadas.</strong><p>Las próximas sesiones pueden alimentar automáticamente esta cola.</p></article>:tasks.map(task=><article className={"panel task-card task-"+task.status} key={task.id}>
          <div className="task-card-head"><div><NodeBadge kind="task"/><h2>{task.title}</h2></div><span>{task.status}</span></div>
          <p>{task.summary}</p><div className="task-meta"><span>{task.project||"Transversal"}</span><span>{task.confidence}% confidence</span><span>{fmt(task.createdAt)}</span></div>
          <div className="decision-actions">
            <button type="button" onClick={()=>updateNodeStatus(task.id,"active")}>En curso</button>
            <button type="button" onClick={()=>updateNodeStatus(task.id,"done")}>Completar</button>
            <button type="button" onClick={()=>updateNodeStatus(task.id,"blocked")}>Bloquear</button>
            <button type="button" onClick={()=>updateNodeStatus(task.id,"dismissed")}>Descartar</button>
          </div>
        </article>)}
      </div>
    </section>
  </>;
}

export function ResourcesPage(){
  const{state}=usePraxios();
  return <>
    <SectionHeader eyebrow="RESOURCE ENGINE" title="Conocer lo que ya tenemos antes de construir más."
      description="Capacidades, activos, canales, infraestructura y datos deben reutilizarse transversalmente."/>
    <section className="resource-grid">{[...state.resources].sort((a,b)=>b.leverage-a.leverage).map(r=><article className="panel resource-card" key={r.id}>
      <div className="resource-top"><span>{r.category}</span><strong>{r.leverage}</strong></div><h2>{r.name}</h2><p>{r.description}</p><div className="leverage-bar"><i style={{width:r.leverage+"%"}}/></div><div className="resource-projects">{r.reusableBy.slice(0,6).map(p=><span key={p}>{p}</span>)}</div>
    </article>)}</section>
  </>;
}

export function SystemPage(){
  const{state,exportState,importState,resetState}=usePraxios();
  const[importRaw,setImportRaw]=useState("");
  const[notice,setNotice]=useState("");
  const copy=async(value:string)=>{await navigator.clipboard.writeText(value);setNotice("Copiado al portapapeles.")};
  const download=()=>{
    const blob=new Blob([exportState()],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");
    a.href=url;a.download=`praxios-state-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);setNotice("Backup exportado.");
  };
  const doImport=()=>{const result=importState(importRaw);setNotice(result.message);if(result.ok)setImportRaw("")};
  return <>
    <SectionHeader eyebrow="META-HARNESS" title="Gobernar a los modelos, no depender de ellos."
      description="PRAXIOS conserva el estado. Meta-Harness define permisos, evidencia, límites y protocolo común para ChatGPT, Claude, Codex, Gemini y futuros modelos."/>
    <section className="system-grid">
      <article className="panel protocol-card"><div className="panel-kicker">SESSION START</div><h2>Context contract</h2><pre>{sessionStartProtocol}</pre><button type="button" className="secondary-button" onClick={()=>copy(sessionStartProtocol)}>Copiar protocolo</button></article>
      <article className="panel protocol-card"><div className="panel-kicker">SESSION CLOSE</div><h2>Harvest contract</h2><pre>{sessionCloseProtocol}</pre><button type="button" className="secondary-button" onClick={()=>copy(sessionCloseProtocol)}>Copiar contrato</button></article>
    </section>
    <section className="panel harness-rules"><div className="panel-kicker">META-HARNESS POLICIES</div><div className="rule-grid">{metaHarnessRules.map((rule,index)=><div key={rule}><span>{String(index+1).padStart(2,"0")}</span><strong>{rule}</strong></div>)}</div></section>
    <section className="system-grid governance-grid">
      <article className="panel"><div className="panel-kicker">AUTHORITY MATRIX</div><h2>Qué puede ejecutar la IA</h2><div className="matrix-list">{authorityMatrix.map(row=><div key={row.action}><span>{row.action}</span><strong className={"matrix-"+row.defaultDecision}>{row.defaultDecision}</strong><p>{row.note}</p></div>)}</div></article>
      <article className="panel"><div className="panel-kicker">MODEL ROUTER</div><h2>El modelo es una dependencia reemplazable</h2><div className="matrix-list">{routingMatrix.map(row=><div key={row.task}><span>{row.task}</span><strong>{row.modelClass}</strong><p>{row.rationale}{row.secondOpinion?" · second opinion":""}</p></div>)}</div></article>
    </section>
    <section className="system-grid persistence-grid">
      <article className="panel"><div className="panel-kicker">STATE BACKUP</div><h2>{state.nodes.length} objetos · {state.sessions.length} sesiones</h2><p>La V1 persiste localmente. Exporta el estado para respaldo o migración futura a PostgreSQL.</p><button type="button" className="primary-button" onClick={download}>Exportar estado JSON</button></article>
      <article className="panel"><div className="panel-kicker">STATE RESTORE</div><textarea value={importRaw} onChange={e=>setImportRaw(e.target.value)} placeholder="Pega aquí un backup PRAXIOS JSON"/><div className="persistence-actions"><button type="button" className="secondary-button" onClick={doImport}>Importar</button><button type="button" className="danger-button" onClick={()=>{if(window.confirm("¿Restablecer PRAXIOS al estado inicial?"))resetState()}}>Reset</button></div></article>
    </section>
    {notice?<div className="toast">{notice}</div>:null}
  </>;
}

export function PortfolioOS(){
  return <><SectionHeader eyebrow="PORTFOLIO" title="Cada proyecto compite por foco y capital." description="El portfolio existente sigue disponible dentro de PRAXIOS OS."/><section className="project-grid">{projects.map(p=><article className="project-card" key={p.id}><div className="project-top"><div><div className="project-title-row"><h2>{p.name}</h2><StatusBadge state={p.state}/></div><p>{p.summary}</p></div><Score value={p.score}/></div><div className="project-economics"><div><span>Revenue 30D</span><strong>{money(p.revenue30d)}</strong></div><div><span>Pipeline</span><strong>{money(p.pipeline)}</strong></div><div><span>Margen</span><strong>{p.margin}%</strong></div><div><span>Time to cash</span><strong>{p.timeToCashDays||"—"} d</strong></div><div><span>Founder load</span><strong>{p.founderHoursWeek} h</strong></div><div><span>Confidence</span><strong>{p.confidence}%</strong></div></div><div className="next-decision"><span>NEXT DECISION</span><strong>{p.nextDecision}</strong></div></article>)}</section></>;
}

export function AgentOfficeOS(){
  return <><SectionHeader eyebrow="AGENT RUNTIME" title="Modelos reemplazables. Roles persistentes." description="El cargo conserva objetivo, KPI y permisos aunque cambie el modelo que lo ejecuta."/><section className="agent-grid">{agents.map(a=><article className="agent-card" key={a.id}><div className="agent-head"><div className="agent-avatar">{a.name.slice(0,2).toUpperCase()}</div><div><h2>{a.name}</h2><p>{a.role}</p></div><span className={"agent-status agent-"+a.status.toLowerCase()}>{a.status}</span></div><p className="agent-objective">{a.objective}</p><div className="agent-meta"><div><span>KPI</span><strong>{a.kpi}</strong></div><div><span>Clase</span><strong>{a.modelClass}</strong></div><div><span>Run</span><strong>{a.lastRun}</strong></div></div></article>)}</section></>;
}
