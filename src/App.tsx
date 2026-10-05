import {useMemo,useState} from "react";
import {ArrowRight,BookOpenCheck,BrainCircuit,CalendarDays,CheckCircle2,ChevronRight,Clapperboard,Clock3,FileText,GitBranch,GraduationCap,LayoutDashboard,Library,Orbit,PanelTop,Play,School,ShieldCheck,Sparkles,Target,TriangleAlert,Users,Video,WandSparkles} from "lucide-react";
import {classPack,euler,oa,roleCopy,type Role} from "./data";

const roles:Role[]=["docente","alumno","familia","centro"];

function RoleSwitcher({role,setRole}:{role:Role;setRole:(r:Role)=>void}){
  return <div className="role-switch">{roles.map(r=><button key={r} className={role===r?"active":""} onClick={()=>setRole(r)}>{roleCopy[r].label}</button>)}</div>
}

function TrustPill({state}:{state:string}){return <span className={"trust "+state.toLowerCase()}>{state.replaceAll("_"," ")}</span>}

function AppShell({role,setRole,onExit}:{role:Role;setRole:(r:Role)=>void;onExit:()=>void}){
  return <div className="shell">
    <aside>
      <button className="brand bare" onClick={onExit}><span className="brandmark"><Orbit size={18}/></span><b>EDUCABOT</b></button>
      <div className="side-caption">ESPACIO</div>
      <RoleSwitcher role={role} setRole={setRole}/>
      <nav>
        <a className="active"><LayoutDashboard size={17}/>Inicio</a>
        {role==="docente"&&<><a><WandSparkles size={17}/>Preparar clase</a><a><Clapperboard size={17}/>Studio</a><a><Users size={17}/>Mis cursos</a><a><Library size={17}/>Biblioteca</a></>}
        {role==="alumno"&&<><a><Sparkles size={17}/>Aprender</a><a><GitBranch size={17}/>Mi mapa</a><a><Target size={17}/>Tareas</a></>}
        {role==="familia"&&<><a><CalendarDays size={17}/>Próximas fechas</a><a><BrainCircuit size={17}/>Progreso</a></>}
        {role==="centro"&&<><a><School size={17}/>Currículo</a><a><TriangleAlert size={17}/>Riesgos</a><a><Target size={17}/>Intervenciones</a></>}
      </nav>
      <div className="side-trust"><ShieldCheck size={17}/><div><b>PRAXIOS Trust</b><span>La IA no se auto-certifica.</span></div></div>
    </aside>
    <main>
      <header><div><span className="dot"/>Currículum Nacional · Chile</div><button className="avatar">AR</button></header>
      {role==="docente"&&<Teacher/>}
      {role==="alumno"&&<Student/>}
      {role==="familia"&&<Family/>}
      {role==="centro"&&<Center/>}
    </main>
  </div>
}

function Teacher(){
  const [prompt,setPrompt]=useState("Mañana tengo 7° básico, 90 minutos. Quiero enseñar tectónica de placas y a este curso le cuesta pensar con modelos abstractos.");
  const [generated,setGenerated]=useState(false);
  const [studio,setStudio]=useState<"class"|"video">("class");
  return <div className="page">
    <div className="pagehead"><div><span className="eyebrow"><GraduationCap size={14}/>EDUCABOT DOCENTE</span><h1>¿Qué necesitas para tu próxima clase?</h1><p>Describe la situación pedagógica. Educabot arma el paquete, conserva el OA, muestra la evidencia y deja todo editable.</p></div><div className="tomorrow"><Clock3 size={16}/><span>Mañana</span><b>7°B · 10:15</b></div></div>
    <div className="teacher-tabs"><button className={studio==="class"?"active":""} onClick={()=>setStudio("class")}><WandSparkles size={16}/>Preparar clase</button><button className={studio==="video"?"active":""} onClick={()=>setStudio("video")}><Video size={16}/>Studio audiovisual</button></div>
    {studio==="class"?<>
      <section className="builder card glow">
        <div className="fieldrow"><label>CURSO<select><option>7° básico B</option></select></label><label>ASIGNATURA<select><option>Ciencias Naturales</option></select></label><label>DURACIÓN<select><option>90 min</option></select></label></div>
        <textarea value={prompt} onChange={e=>setPrompt(e.target.value)}/>
        <div className="builderfoot"><div><span className="chip">OA sugerido · CN07 OA 09</span><span className="chip">32 alumnos</span><span className="chip">Plan B sin internet</span></div><button className="primary" onClick={()=>setGenerated(true)}>{generated?"Regenerar paquete":"Generar clase"}<ArrowRight size={17}/></button></div>
      </section>
      {!generated?<section className="empty"><div className="orb"><Sparkles/></div><h2>De una intención a una experiencia.</h2><p>Genera el paquete para ver planificación, materiales, verificación y asignación.</p></section>:<ClassPack/>}
    </>:<Studio/>}
  </div>
}

function ClassPack(){
  return <section className="pack">
    <div className="packhead"><div><span className="eyebrow"><CheckCircle2 size={14}/>PAQUETE LISTO PARA REVISAR</span><h2>{classPack.title}</h2><p>{classPack.meta}</p></div><div className="packactions"><button className="secondary">Editar</button><button className="primary">Asignar a 7°B<ArrowRight size={16}/></button></div></div>
    <div className="grid2">
      <article className="card"><span className="cardlabel">OBJETIVO COGNITIVO</span><h3>{classPack.goal}</h3><div className="euler-mini">{euler.slice(0,5).map(([n,t])=><span key={n}><i>{n}</i>{t}</span>)}</div></article>
      <article className="card trustcard"><span className="cardlabel">AUTHORITY BOUNDARY</span><h3>¿Qué tiene derecho a afirmarse?</h3>{classPack.trust.map(x=><div className="trustrow" key={x.text}><TrustPill state={x.state}/><div><b>{x.text}</b><span>{x.detail}</span></div></div>)}</article>
    </div>
    <div className="grid2 wideleft">
      <article className="card"><div className="sectiontitle"><div><span className="cardlabel">SECUENCIA</span><h3>90 minutos con propósito</h3></div><Play size={18}/></div><div className="timeline">{classPack.flow.map(([time,name,copy])=><div key={time}><span>{time}</span><i/><div><b>{name}</b><p>{copy}</p></div></div>)}</div></article>
      <article className="card"><span className="cardlabel">ARTEFACTOS</span><h3>Todo sale del mismo diseño.</h3><div className="artifactlist">{classPack.materials.map((m,i)=><button key={m}><span>{i<2?<FileText size={16}/>:i===2?<PanelTop size={16}/>:<BookOpenCheck size={16}/>}</span>{m}<ChevronRight size={14}/></button>)}</div></article>
    </div>
  </section>
}

function Studio(){
  const [stage,setStage]=useState(2);
  return <section className="studio">
    <div className="studiohero card"><div><span className="eyebrow"><Clapperboard size={14}/>STUDIO</span><h2>Convierte una clase en material audiovisual.</h2><p>El profesor define el objetivo pedagógico. Educabot diseña guion, storyboard, prompts y evaluación posterior. El render se activa solo después de aprobar.</p></div><button className="primary" onClick={()=>setStage(Math.min(4,stage+1))}>Avanzar pipeline<ArrowRight size={16}/></button></div>
    <div className="pipeline">{["Objetivo","Guion","Storyboard","Render"].map((s,i)=><div className={i<stage?"done":i===stage?"active":""} key={s}><span>{String(i+1).padStart(2,"0")}</span><b>{s}</b></div>)}</div>
    <div className="grid2">
      <article className="card script"><span className="cardlabel">VIDEO · 75 SEG</span><h3>¿Por qué Chile tiembla tanto?</h3><p><b>Escena 1.</b> Un mapa nocturno de Sudamérica muestra puntos sísmicos acumulándose en el borde occidental.</p><p><b>Escena 2.</b> Corte lateral simplificado: una placa se introduce bajo otra. La cámara sigue el contacto.</p><p><b>Escena 3.</b> La deformación se acumula. El relato evita decir que las placas “chocan como autos”.</p><p><b>Cierre.</b> El alumno debe explicar qué observación hizo necesario el modelo.</p></article>
      <article className="card"><span className="cardlabel">CONTROL ANTES DE RENDER</span><div className="checklist"><span><CheckCircle2/>OA enlazado</span><span><CheckCircle2/>Guion revisable</span><span><CheckCircle2/>3 claims con estado</span><span><CheckCircle2/>Tiburón pedagógico ejecutado</span><span><TriangleAlert/>1 fuente científica pendiente</span></div><button className="secondary full">Abrir storyboard</button></article>
    </div>
  </section>
}

function Student(){
  const [tab,setTab]=useState<"learn"|"proof"|"practice">("learn");
  const [answer,setAnswer]=useState<number|null>(null);
  return <div className="page">
    <div className="pagehead studenthead"><div><span className="eyebrow"><Sparkles size={14}/>HOY</span><h1>Buenos días, Lucas.</h1><p>Tienes una prueba en 3 días. Antes de avanzar, conviene reparar una dependencia corta.</p></div><div className="streak"><b>12</b><span>min recomendados hoy</span></div></div>
    <div className="todaygrid">
      <article className="todaycard urgent"><span>MATEMÁTICA</span><h3>Fracciones equivalentes</h3><div className="progress"><i style={{width:"61%"}}/></div><p>61% · dependencia activa</p></article>
      <article className="todaycard"><span>CIENCIAS</span><h3>Tectónica de placas</h3><div className="progress"><i style={{width:"76%"}}/></div><p>76% · prueba en 3 días</p></article>
      <article className="todaycard"><span>HISTORIA</span><h3>La Colonia</h3><div className="progress"><i style={{width:"84%"}}/></div><p>84% · al día</p></article>
    </div>
    <section className="learning card">
      <div className="learninghead"><div><span className="cardlabel">SESIÓN ACTIVA · MA05 OA 07</span><h2>¿Por qué 2/4 puede ser lo mismo que 1/2?</h2></div><TrustPill state="VERIFICADO"/></div>
      <div className="tabs"><button className={tab==="learn"?"active":""} onClick={()=>setTab("learn")}>Comprender</button><button className={tab==="proof"?"active":""} onClick={()=>setTab("proof")}>¿Cómo sabemos?</button><button className={tab==="practice"?"active":""} onClick={()=>setTab("practice")}>Demostrarlo</button></div>
      {tab==="learn"&&<div className="fractionlab"><div className="fraction one"><div/><span>1/2</span></div><div className="equals">=</div><div className="fraction two"><div/><span>2/4</span></div><div className="explain"><span className="cardlabel">OBSERVA</span><h3>La escritura cambió. La cantidad ocupada no.</h3><p>Antes de memorizar una regla, compara las dos representaciones y busca qué se conserva.</p></div></div>}
      {tab==="proof"&&<div className="claims"><div><TrustPill state="VERIFICADO"/><p>El OA trabaja equivalencia de fracciones mediante representaciones concreta, pictórica y simbólica.</p><span>Fuente curricular oficial enlazada.</span></div><div><TrustPill state="CORROBORADO"/><p>Multiplicar numerador y denominador por el mismo número no cero conserva el valor.</p><span>En producción: instrumento matemático/recomputación.</span></div><div><TrustPill state="SILENCIO"/><p>“Una fracción con números mayores siempre vale más”.</p><span>Bloqueada: contradice casos básicos.</span></div></div>}
      {tab==="practice"&&<div className="practice"><span className="cardlabel">RECONSTRUCCIÓN</span><h3>¿Cuál es equivalente a 1/2?</h3><div>{["2/3","2/4","3/4","1/4"].map((x,i)=><button className={answer===i?(i===1?"correct":"wrong"):""} onClick={()=>setAnswer(i)} key={x}>{String.fromCharCode(65+i)} · {x}</button>)}</div>{answer!==null&&<p>{answer===1?"Bien. Ahora explica por qué sin usar la regla.":"No basta con parecer cercana: vuelve a la representación."}</p>}</div>}
    </section>
    <KnowledgeMap/>
  </div>
}

function KnowledgeMap(){
  return <section className="card knowledge"><div className="sectiontitle"><div><span className="cardlabel">MI MAPA</span><h3>Lo que ya sostiene lo que viene.</h3></div><GitBranch size={18}/></div><div className="graph"><svg viewBox="0 0 100 50"><line x1="10" y1="25" x2="35" y2="12"/><line x1="35" y1="12" x2="58" y2="28"/><line x1="58" y1="28" x2="82" y2="13"/><line x1="58" y1="28" x2="83" y2="42"/></svg><span className="node n-a solid"><b>92%</b>Parte / todo</span><span className="node n-b solid"><b>82%</b>Equivalencia</span><span className="node n-c learning"><b>64%</b>Números mixtos</span><span className="node n-d risk"><b>41%</b>Operaciones</span><span className="node n-e unknown"><b>—</b>Razón</span></div></section>
}

function Family(){
  return <div className="page">
    <div className="pagehead"><div><span className="eyebrow"><Users size={14}/>EDUCABOT FAMILIA</span><h1>Lo importante, sin vigilar cada conversación.</h1><p>Progreso, fechas y una recomendación concreta para acompañar esta semana.</p></div><div className="familybadge"><ShieldCheck/><span>Contenido estudiado</span><b>92% con evidencia trazable</b></div></div>
    <div className="metricgrid"><Metric label="PROGRESO SEMANAL" value="+8%" note="mejor que semana anterior"/><Metric label="PRÓXIMAS FECHAS" value="3" note="1 prueba · 2 entregas"/><Metric label="FORTALEZA" value="Historia" note="84% de dominio"/><Metric label="A REFORZAR" value="Fracciones" note="explicación, no memorización"/></div>
    <div className="grid2">
      <article className="card"><span className="cardlabel">CÓMO AYUDAR HOY</span><h2>Pídele que te lo enseñe a ti.</h2><p className="muted">Pregunta: “¿Puedes mostrarme con un dibujo por qué 2/4 y 1/2 representan lo mismo?” No le des la regla primero. Queremos observar si puede reconstruirla.</p><div className="tip"><BrainCircuit/>Esta conversación puede dar evidencia más útil que repetir 10 ejercicios iguales.</div></article>
      <article className="card"><span className="cardlabel">CALENDARIO VIVO</span><div className="events"><div><b>08 OCT</b><span>Prueba de Ciencias</span><small>reforzar subducción</small></div><div><b>10 OCT</b><span>Guía Matemática</span><small>fracciones equivalentes</small></div><div><b>11 OCT</b><span>Trabajo Historia</span><small>al día</small></div></div></article>
    </div>
  </div>
}

function Center(){
  return <div className="page">
    <div className="pagehead"><div><span className="eyebrow"><School size={14}/>CENTRO DE MANDO</span><h1>Detectar antes de que aparezca en la nota.</h1><p>El sistema cruza currículo, evidencia y dependencias para proponer dónde conviene intervenir.</p></div><button className="secondary"><CalendarDays size={16}/>Semana 41</button></div>
    <div className="metricgrid"><Metric label="ALUMNOS ACTIVOS" value="283" note="91% esta semana"/><Metric label="OA OBSERVADOS" value="26" note="12 consolidados"/><Metric label="CUELLOS DE BOTELLA" value="4" note="2 de alta prioridad"/><Metric label="INTERVENCIONES" value="7" note="5 con mejora medible"/></div>
    <div className="grid2 wideleft">
      <article className="card"><div className="sectiontitle"><div><span className="cardlabel">MAPA CURRICULAR</span><h3>7° básico · Ciencias</h3></div><BookOpenCheck/></div><div className="heat">{oa.map(x=><div key={x.code}><span><b>{x.code}</b>{x.title}</span><div><i className={x.state} style={{width:x.mastery+"%"}}/></div><strong>{x.mastery}%</strong></div>)}</div></article>
      <article className="card alertcard"><span className="cardlabel">ALERTA ANTICIPATORIA</span><div className="alerticon"><TriangleAlert/></div><h2>El próximo OA llega antes que el prerrequisito.</h2><p>38% de 7°B no consolida la relación entre convergencia y subducción. La siguiente secuencia asume esa dependencia.</p><button className="primary full">Diseñar intervención<ArrowRight size={16}/></button></article>
    </div>
    <article className="card intervention"><div><span className="cardlabel">INTERVENCIÓN PROPUESTA</span><h3>18 min · contraste visual + explicación en parejas</h3><p>Objetivo: reparar el modelo causal antes de avanzar. Revaluar con un caso nuevo y comparar contra línea base.</p></div><div><span>IMPACTO ESPERADO</span><b>Hipótesis · no hecho</b><small>se medirá después de aplicar</small></div></article>
  </div>
}

function Metric({label,value,note}:{label:string;value:string;note:string}){return <article className="metric"><span>{label}</span><b>{value}</b><small>{note}</small></article>}

function Landing({onEnter}:{onEnter:()=>void}){
  return <div className="landing">
    <nav className="topnav"><div className="brand"><span className="brandmark"><Orbit size={18}/></span><b>EDUCABOT</b></div><div className="navlinks"><a href="#producto">Producto</a><a href="#confianza">Confianza</a><a href="#docente">Docentes</a></div><button className="secondary" onClick={onEnter}>Ver prototipo</button></nav>
    <section className="hero"><div className="gridbg"/><div className="herocopy"><span className="eyebrow"><Sparkles size={14}/>IA PARA ENSEÑAR Y APRENDER MEJOR</span><h1>La IA puede responder.<br/><em>El aprendizaje necesita más.</em></h1><p>Educabot convierte currículo, preguntas y evidencia en experiencias de aprendizaje, materiales listos y decisiones pedagógicas accionables.</p><div className="heroactions"><button className="primary" onClick={onEnter}>Preparar la clase de mañana<ArrowRight size={17}/></button><a href="#producto">Ver el sistema <ChevronRight size={16}/></a></div><div className="proof"><span><ShieldCheck/>Evidencia visible</span><span><GitBranch/>Aprendizaje persistente</span><span><BrainCircuit/>Intervenciones anticipadas</span></div></div><div className="heroapp card"><div className="fakebar"><span><Orbit size={14}/>Educabot Docente</span><small>PRAXIOS activo</small></div><div className="fakeprompt"><span>MAÑANA · 7°B · CIENCIAS</span><h3>“Quiero enseñar tectónica de placas en 90 minutos...”</h3><button>Generar clase <ArrowRight size={15}/></button></div><div className="fakepack"><div><CheckCircle2/><span><b>Planificación</b><small>90 min · OA trazable</small></span></div><div><PanelTop/><span><b>Micromundo</b><small>convergencia y subducción</small></span></div><div><FileText/><span><b>Guía + ticket</b><small>reconstrucción y transferencia</small></span></div><div className="trustbox"><ShieldCheck/><span><b>¿Cómo sabemos?</b><small>2 verificados · 1 corroborado · 1 bloqueado</small></span></div></div></div></section>
    <section className="band"><div><b>DOCENTE</b><span>Diseña sin pelear con prompts.</span></div><div><b>ALUMNO</b><span>Aprende sin entregar el pensamiento.</span></div><div><b>FAMILIA</b><span>Acompaña con señales claras.</span></div><div><b>CENTRO</b><span>Anticipa e interviene.</span></div></section>
    <section id="producto" className="marketing"><span className="eyebrow">UN SOLO CEREBRO · CUATRO EXPERIENCIAS</span><h2>El aprendizaje no termina cuando la IA entrega un texto.</h2><div className="featuregrid"><article><WandSparkles/><span>DOCENTE</span><h3>Prepara la clase de mañana.</h3><p>Planificación, guías, experimentos, evaluaciones, afiches, cómics y videos desde una intención pedagógica.</p></article><article><GraduationCap/><span>ALUMNO</span><h3>Una interfaz que cambia con el concepto.</h3><p>Simulaciones, mapas, líneas de tiempo y práctica guiada en vez de un chat infinito.</p></article><article><Users/><span>FAMILIA</span><h3>Sabe qué necesita sin invadir.</h3><p>Fechas, progreso, conceptos débiles y una acción útil para ayudar hoy.</p></article><article><School/><span>CENTRO</span><h3>De reporting a decisión.</h3><p>Detecta dependencias débiles, anticipa riesgo y mide el impacto de la intervención.</p></article></div></section>
    <section id="confianza" className="marketing trustsection"><div className="trustvisual card"><div className="organrow"><span>SOÑAR</span><i/> <span>DESCOMPONER</span><i/> <span>INSTRUMENTAR</span><i/> <span>REFUTAR</span></div><div className="sharkline"><span className="shark">◢</span><div><b>Tiburón</b><small>intenta romper la respuesta antes de emitir</small></div></div><div className="authority"><ShieldCheck/><div><b>Authority Boundary</b><small>un modelo no puede declararse verdadero a sí mismo</small></div><TrustPill state="VERIFICADO"/></div></div><div><span className="eyebrow">PRAXIOS + META-HARNESS</span><h2>Confiar no es poner una cita al final.</h2><p>Educabot separa generación, evidencia y autoridad. Lo que no puede sostenerse se degrada, se declara como deuda o queda en silencio.</p></div></section>
    <section id="docente" className="cta"><div><span className="eyebrow">TEACHER WEDGE</span><h2>Prepara la clase de mañana.<br/>Después, descubre qué aprendieron.</h2></div><button className="primary" onClick={onEnter}>Entrar al prototipo<ArrowRight size={17}/></button></section>
    <footer><div className="brand"><span className="brandmark"><Orbit size={18}/></span><b>EDUCABOT</b></div><span>Powered by PRAXIOS · Prototipo de producto</span></footer>
  </div>
}

export default function App(){
  const [entered,setEntered]=useState(false);
  const [role,setRole]=useState<Role>("docente");
  const content=useMemo(()=>entered?<AppShell role={role} setRole={setRole} onExit={()=>setEntered(false)}/>:<Landing onEnter={()=>setEntered(true)}/>,[entered,role]);
  return content;
}
