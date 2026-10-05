import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Bell,
  BookOpenCheck,
  BrainCircuit,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clapperboard,
  Clock3,
  Copy,
  Download,
  FileText,
  GitBranch,
  GraduationCap,
  LayoutDashboard,
  Library,
  Orbit,
  PanelTop,
  Play,
  Plus,
  School,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TriangleAlert,
  Users,
  Video,
  WandSparkles
} from "lucide-react";
import {
  classPulse,
  defaultClassRequest,
  euler,
  oa,
  roleCopy,
  teacherLibrary,
  upcoming,
  type ClassPack,
  type ClassRequest,
  type Role
} from "./data";
import { generateClassPack } from "./api";

type ViewKey = "home" | "prepare" | "studio" | "courses" | "library" | "learn" | "map" | "tasks" | "calendar" | "progress" | "curriculum" | "risk" | "interventions";

const roleNav: Record<Role, Array<{ key: ViewKey; label: string; icon: React.ReactNode }>> = {
  docente: [
    { key: "home", label: "Inicio", icon: <LayoutDashboard size={17} /> },
    { key: "prepare", label: "Preparar clase", icon: <WandSparkles size={17} /> },
    { key: "studio", label: "Studio", icon: <Clapperboard size={17} /> },
    { key: "courses", label: "Mis cursos", icon: <Users size={17} /> },
    { key: "library", label: "Biblioteca", icon: <Library size={17} /> }
  ],
  alumno: [
    { key: "home", label: "Hoy", icon: <LayoutDashboard size={17} /> },
    { key: "learn", label: "Aprender", icon: <Sparkles size={17} /> },
    { key: "map", label: "Mi mapa", icon: <GitBranch size={17} /> },
    { key: "tasks", label: "Tareas", icon: <Target size={17} /> }
  ],
  familia: [
    { key: "home", label: "Resumen", icon: <LayoutDashboard size={17} /> },
    { key: "calendar", label: "Próximas fechas", icon: <CalendarDays size={17} /> },
    { key: "progress", label: "Progreso", icon: <BrainCircuit size={17} /> }
  ],
  centro: [
    { key: "home", label: "Pulso", icon: <LayoutDashboard size={17} /> },
    { key: "curriculum", label: "Currículo", icon: <School size={17} /> },
    { key: "risk", label: "Riesgos", icon: <TriangleAlert size={17} /> },
    { key: "interventions", label: "Intervenciones", icon: <Target size={17} /> }
  ]
};

function TrustPill({ state }: { state: string }) {
  return <span className={"trust " + state.toLowerCase()}>{state.replaceAll("_", " ")}</span>;
}

function RoleSwitcher({ role, onChange }: { role: Role; onChange: (role: Role) => void }) {
  const roles: Role[] = ["docente", "alumno", "familia", "centro"];
  return (
    <div className="role-switch">
      {roles.map((item) => (
        <button key={item} className={role === item ? "active" : ""} onClick={() => onChange(item)}>
          {roleCopy[item].label}
        </button>
      ))}
    </div>
  );
}

function AppShell({ onExit }: { onExit: () => void }) {
  const [role, setRole] = useState<Role>("docente");
  const [view, setView] = useState<ViewKey>("home");

  function changeRole(next: Role) {
    setRole(next);
    setView("home");
  }

  return (
    <div className="shell">
      <aside>
        <button className="brand bare" onClick={onExit}>
          <span className="brandmark"><Orbit size={18} /></span>
          <b>EDUCABOT</b>
        </button>
        <div className="side-caption">ESPACIO</div>
        <RoleSwitcher role={role} onChange={changeRole} />
        <nav>
          {roleNav[role].map((item) => (
            <button key={item.key} className={view === item.key ? "active" : ""} onClick={() => setView(item.key)}>
              {item.icon}{item.label}
            </button>
          ))}
        </nav>
        <div className="side-trust">
          <ShieldCheck size={17} />
          <div><b>PRAXIOS Trust</b><span>La IA no se auto-certifica.</span></div>
        </div>
      </aside>
      <main>
        <header>
          <div><span className="dot" />Catálogo curricular · Chile <span className="demo-badge">MODO DEMO</span></div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Notificaciones"><Bell size={16} /></button>
            <button className="avatar">AR</button>
          </div>
        </header>
        {role === "docente" && <TeacherRouter view={view} setView={setView} />}
        {role === "alumno" && <StudentRouter view={view} setView={setView} />}
        {role === "familia" && <FamilyRouter view={view} />}
        {role === "centro" && <CenterRouter view={view} />}
      </main>
    </div>
  );
}

function TeacherRouter({ view, setView }: { view: ViewKey; setView: (v: ViewKey) => void }) {
  if (view === "prepare") return <TeacherBuilder />;
  if (view === "studio") return <Studio />;
  if (view === "courses") return <TeacherCourses onPrepare={() => setView("prepare")} />;
  if (view === "library") return <TeacherLibrary />;
  return <TeacherHome onPrepare={() => setView("prepare")} onStudio={() => setView("studio")} />;
}

function TeacherHome({ onPrepare, onStudio }: { onPrepare: () => void; onStudio: () => void }) {
  return (
    <div className="page">
      <div className="pagehead">
        <div>
          <span className="eyebrow"><GraduationCap size={14} />EDUCABOT DOCENTE</span>
          <h1>Tu próxima clase, sin empezar de cero.</h1>
          <p>Educabot cruza objetivo, curso, tiempo disponible y lo que ya ocurrió con tus estudiantes para proponerte una clase lista para revisar, adaptar y asignar.</p>
        </div>
        <div className="tomorrow"><Clock3 size={16} /><span>Próxima clase</span><b>7°B · mañana 10:15</b></div>
      </div>

      <div className="teacher-hero-grid">
        <section className="card next-class">
          <span className="cardlabel">ACCIÓN PRINCIPAL</span>
          <h2>Prepara la clase de mañana.</h2>
          <p>Describe qué quieres lograr. Educabot arma secuencia, materiales, evaluación y un control de confiabilidad antes de que llegue a tus alumnos.</p>
          <button className="primary" onClick={onPrepare}>Preparar clase <ArrowRight size={17} /></button>
        </section>
        <section className="card quick-studio">
          <span className="cardlabel">STUDIO</span>
          <h3>¿Necesitas algo visual?</h3>
          <p>Crea una guía, un afiche, un cómic o un guion de video sin aprender a escribir prompts técnicos.</p>
          <button className="secondary" onClick={onStudio}><Video size={16} />Abrir Studio</button>
        </section>
      </div>

      <div className="metricgrid">
        <Metric label="CLASES ESTA SEMANA" value="8" note="3 con material Educabot" />
        <Metric label="META DE PREPARACIÓN" value="<20 min" note="objetivo de diseño, aún por validar" />
        <Metric label="ALERTAS ABIERTAS" value="2" note="dependencias antes del próximo OA" />
        <Metric label="MATERIALES GUARDADOS" value="24" note="6 reutilizables" />
      </div>

      <div className="grid2 wideleft">
        <article className="card">
          <div className="sectiontitle">
            <div><span className="cardlabel">PULSO DE TUS CURSOS</span><h3>Qué conviene mirar antes de planificar.</h3></div>
            <Users size={18} />
          </div>
          <div className="course-pulse">
            {classPulse.map((row) => (
              <div key={row.name}>
                <div><b>{row.name}</b><span>{row.subject}</span></div>
                <div className="progress"><i style={{ width: row.mastery + "%" }} /></div>
                <strong>{row.mastery}%</strong>
                <small className={row.risk === "Sin alerta" ? "ok" : ""}>{row.risk}</small>
              </div>
            ))}
          </div>
        </article>
        <article className="card">
          <span className="cardlabel">SIGUIENTE DECISIÓN</span>
          <div className="alerticon"><TriangleAlert /></div>
          <h2>7°B necesita reparar una idea antes de avanzar.</h2>
          <p className="muted">La relación entre convergencia y subducción todavía es inestable en parte del curso. El próximo objetivo depende de esa representación.</p>
          <button className="secondary full" onClick={onPrepare}>Diseñar refuerzo <ArrowRight size={16} /></button>
        </article>
      </div>
    </div>
  );
}

function TeacherBuilder() {
  const [request, setRequest] = useState<ClassRequest>(defaultClassRequest);
  const [pack, setPack] = useState<ClassPack | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"sequence" | "materials" | "trust" | "teacher">("sequence");

  function toggleOutput(output: string) {
    setRequest((prev) => ({
      ...prev,
      outputs: prev.outputs.includes(output)
        ? prev.outputs.filter((x) => x !== output)
        : [...prev.outputs, output]
    }));
  }

  async function submit() {
    setLoading(true);
    setPack(await generateClassPack(request));
    setLoading(false);
    setTab("sequence");
  }

  function download() {
    if (!pack) return;
    const body = [
      "# " + pack.title,
      "",
      pack.meta,
      "",
      "## Objetivo",
      pack.goal,
      "",
      "## Secuencia",
      ...pack.flow.map((x) => "- " + x.time + " · " + x.name + ": " + x.copy),
      "",
      "## Materiales",
      ...pack.materials.map((x) => "- " + x),
      "",
      "## Notas docentes",
      ...pack.teacherNotes.map((x) => "- " + x),
      "",
      "## Ticket de salida",
      ...pack.exitTicket.map((x) => "- " + x)
    ].join("\n");
    const url = URL.createObjectURL(new Blob([body], { type: "text/markdown" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "educabot-" + pack.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".md";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page">
      <div className="pagehead">
        <div>
          <span className="eyebrow"><WandSparkles size={14} />PREPARAR CLASE</span>
          <h1>Cuéntale a Educabot qué quieres lograr.</h1>
          <p>No necesitas redactar el “prompt perfecto”. Tú das el contexto pedagógico; el sistema estructura la tarea, declara sus límites y deja la decisión final en tus manos.</p>
        </div>
        <div className="builder-status"><span className="dot" />Revisión docente obligatoria</div>
      </div>

      <section className="builder card glow">
        <div className="fieldrow">
          <label>CURSO
            <select value={request.course} onChange={(e) => setRequest({ ...request, course: e.target.value })}>
              <option>7° básico B</option><option>7° básico A</option><option>5° básico A</option><option>6° básico B</option>
            </select>
          </label>
          <label>ASIGNATURA
            <select value={request.subject} onChange={(e) => setRequest({ ...request, subject: e.target.value })}>
              <option>Ciencias Naturales</option><option>Matemática</option><option>Historia</option><option>Lengua y Literatura</option>
            </select>
          </label>
          <label>DURACIÓN
            <select value={request.duration} onChange={(e) => setRequest({ ...request, duration: e.target.value })}>
              <option>45 min</option><option>60 min</option><option>90 min</option>
            </select>
          </label>
        </div>
        <label className="prompt-label">¿QUÉ QUIERES QUE PASE EN ESTA CLASE?
          <textarea value={request.prompt} onChange={(e) => setRequest({ ...request, prompt: e.target.value })} />
        </label>
        <div className="output-title">Incluye en el paquete</div>
        <div className="output-pills">
          {["Planificación", "Presentación", "Guía alumno", "Ticket de salida", "Rúbrica", "Plan B sin internet"].map((output) => (
            <button key={output} className={request.outputs.includes(output) ? "selected" : ""} onClick={() => toggleOutput(output)}>
              {request.outputs.includes(output) && <Check size={13} />}{output}
            </button>
          ))}
        </div>
        <div className="builderfoot">
          <div><span className="chip">OA se valida antes de asignar</span><span className="chip">Tiburón pedagógico</span><span className="chip">Authority Boundary</span></div>
          <button className="primary" onClick={submit} disabled={loading}>
            {loading ? "Construyendo..." : pack ? "Generar otra versión" : "Generar clase"}<ArrowRight size={17} />
          </button>
        </div>
      </section>

      {!pack ? (
        <section className="empty">
          <div className="orb"><Sparkles /></div>
          <h2>De una intención a una experiencia.</h2>
          <p>El paquete no se limita a redactar contenido: organiza secuencia, materiales, evidencia y puntos de decisión.</p>
        </section>
      ) : (
        <section className="pack">
          <div className="packhead">
            <div>
              <span className="eyebrow"><CheckCircle2 size={14} />BORRADOR LISTO PARA REVISAR</span>
              <h2>{pack.title}</h2>
              <p>{pack.meta} · {pack.oaCode}</p>
            </div>
            <div className="packactions">
              <button className="secondary" onClick={download}><Download size={16} />Descargar</button>
              <button className="primary">Asignar al curso <ArrowRight size={16} /></button>
            </div>
          </div>
          <div className="curriculum-banner">
            <BookOpenCheck size={17} />
            <div><span>ALINEACIÓN CURRICULAR</span><b>{pack.oaCode} · {pack.oaLabel}</b></div>
            <TrustPill state={pack.oaCode === "OA PENDIENTE" ? "CONJETURA_DECLARADA" : "VERIFICADO"} />
          </div>

          <div className="tabs">
            <button className={tab === "sequence" ? "active" : ""} onClick={() => setTab("sequence")}>Secuencia</button>
            <button className={tab === "materials" ? "active" : ""} onClick={() => setTab("materials")}>Materiales</button>
            <button className={tab === "trust" ? "active" : ""} onClick={() => setTab("trust")}>¿Cómo sabemos?</button>
            <button className={tab === "teacher" ? "active" : ""} onClick={() => setTab("teacher")}>Notas docentes</button>
          </div>

          {tab === "sequence" && <PackSequence pack={pack} />}
          {tab === "materials" && <PackMaterials pack={pack} />}
          {tab === "trust" && <PackTrust pack={pack} />}
          {tab === "teacher" && <PackTeacher pack={pack} />}
        </section>
      )}
    </div>
  );
}

function PackSequence({ pack }: { pack: ClassPack }) {
  return (
    <div className="grid2 wideleft">
      <article className="card">
        <span className="cardlabel">OBJETIVO COGNITIVO</span>
        <h3 className="goal-copy">{pack.goal}</h3>
        <div className="timeline">
          {pack.flow.map((item) => (
            <div key={item.time + item.name}>
              <span>{item.time}</span><i /><div><b>{item.name}</b><p>{item.copy}</p></div>
            </div>
          ))}
        </div>
      </article>
      <article className="card">
        <span className="cardlabel">RUTA EULER</span>
        <h3>La clase se construyó antes de redactarse.</h3>
        <div className="euler-list">
          {euler.map(([n, name, copy]) => <div key={n}><span>{n}</span><div><b>{name}</b><small>{copy}</small></div></div>)}
        </div>
      </article>
    </div>
  );
}

function PackMaterials({ pack }: { pack: ClassPack }) {
  return (
    <div className="grid2">
      <article className="card">
        <span className="cardlabel">ARTEFACTOS DEL PAQUETE</span>
        <div className="artifactlist">
          {pack.materials.map((item, i) => (
            <button key={item}>
              <span>{i % 2 === 0 ? <FileText size={16} /> : <PanelTop size={16} />}</span>
              <div><b>{item}</b><small>Editable antes de asignar</small></div>
              <ChevronRight size={14} />
            </button>
          ))}
        </div>
      </article>
      <article className="card">
        <span className="cardlabel">TICKET DE SALIDA</span>
        <h3>Queremos evidencia de reconstrucción, no solo reconocimiento.</h3>
        <ol className="ticket-list">{pack.exitTicket.map((item) => <li key={item}>{item}</li>)}</ol>
      </article>
    </div>
  );
}

function PackTrust({ pack }: { pack: ClassPack }) {
  return (
    <div className="evidence-layout">
      <article className="card">
        <span className="cardlabel">AUTHORITY BOUNDARY</span>
        <h3>Ninguna afirmación obtiene autoridad solo porque la IA la escribió bien.</h3>
        <div className="trust-stack">
          {pack.trust.map((item) => (
            <div className="trustrow" key={item.text}>
              <TrustPill state={item.state} />
              <div><b>{item.text}</b><span>{item.detail}</span></div>
            </div>
          ))}
        </div>
      </article>
      <article className="card shark-card">
        <div className="shark-symbol">◢</div>
        <span className="cardlabel">TIBURÓN</span>
        <h3>Antes de emitir, intenta romper la clase.</h3>
        <p>Busca claims sin evidencia, preguntas ambiguas, causalidad demasiado fuerte, material visual incoherente y actividades que hagan el trabajo cognitivo por el alumno.</p>
        <div className="shark-result"><b>MORDIDO → REPARAR → REVISAR</b><span>Sobrevivir no significa “verdadero”.</span></div>
      </article>
    </div>
  );
}

function PackTeacher({ pack }: { pack: ClassPack }) {
  return (
    <div className="grid2">
      <article className="card">
        <span className="cardlabel">NOTAS PARA TI</span>
        <ul className="teacher-notes">{pack.teacherNotes.map((item) => <li key={item}>{item}</li>)}</ul>
      </article>
      <article className="card">
        <span className="cardlabel">ANTES DE ASIGNAR</span>
        <div className="checklist">
          <span><CheckCircle2 />Revisa el OA y la secuencia.</span>
          <span><CheckCircle2 />Edita lenguaje, ejemplos y tiempos según tu curso.</span>
          <span><CheckCircle2 />Confirma materiales reales disponibles.</span>
          <span><TriangleAlert />No delegues una decisión sensible sin contexto docente.</span>
        </div>
      </article>
    </div>
  );
}

function Studio() {
  const [stage, setStage] = useState(2);
  const [format, setFormat] = useState("Video educativo");
  return (
    <div className="page">
      <div className="pagehead">
        <div>
          <span className="eyebrow"><Clapperboard size={14} />EDUCABOT STUDIO</span>
          <h1>Material visual sin convertirte en prompt engineer.</h1>
          <p>Define qué deben comprender tus alumnos. Educabot traduce ese objetivo a guion, storyboard y assets. El profesor revisa antes del render.</p>
        </div>
      </div>
      <section className="studiohero card">
        <div>
          <span className="cardlabel">NUEVO ARTEFACTO</span>
          <h2>¿Qué quieres crear?</h2>
          <div className="format-switch">
            {["Video educativo", "Cómic", "Afiche", "Infografía"].map((item) => (
              <button key={item} className={format === item ? "active" : ""} onClick={() => setFormat(item)}>{item}</button>
            ))}
          </div>
          <p>Ejemplo activo: explicar por qué Chile tiembla tanto en un video de 75 segundos, con lenguaje de 7° básico y una pregunta final de transferencia.</p>
        </div>
        <button className="primary" onClick={() => setStage(Math.min(4, stage + 1))}>Avanzar pipeline <ArrowRight size={16} /></button>
      </section>
      <div className="pipeline">
        {["Objetivo", "Guion", "Storyboard", "Render"].map((s, i) => (
          <div className={i < stage ? "done" : i === stage ? "active" : ""} key={s}><span>{String(i + 1).padStart(2, "0")}</span><b>{s}</b></div>
        ))}
      </div>
      <div className="grid2">
        <article className="card script">
          <span className="cardlabel">GUION · 75 SEG</span>
          <h3>¿Por qué Chile tiembla tanto?</h3>
          <p><b>Escena 1.</b> Un mapa oscuro de Sudamérica muestra puntos sísmicos acumulándose en el borde occidental. Voz: “Antes de explicar, observa: ¿qué patrón ves?”</p>
          <p><b>Escena 2.</b> Corte lateral simplificado. La placa oceánica converge con Sudamérica. La cámara sigue el contacto.</p>
          <p><b>Escena 3.</b> La deformación se acumula. Se evita la metáfora de “choque de autos” porque distorsiona el mecanismo.</p>
          <p><b>Cierre.</b> “Ahora usa el modelo para explicar qué esperarías observar en otro borde activo.”</p>
        </article>
        <article className="card">
          <span className="cardlabel">CONTROL ANTES DE RENDER</span>
          <div className="checklist">
            <span><CheckCircle2 />Objetivo cognitivo definido</span>
            <span><CheckCircle2 />OA enlazado</span>
            <span><CheckCircle2 />Guion revisable</span>
            <span><CheckCircle2 />Storyboard separado del render</span>
            <span><TriangleAlert />1 fuente científica pendiente</span>
          </div>
          <button className="secondary full">Abrir storyboard</button>
        </article>
      </div>
      <div className="studio-note"><ShieldCheck size={16} />El render audiovisual es una etapa posterior. Educabot no gasta créditos de generación antes de que apruebes la estructura.</div>
    </div>
  );
}

function TeacherCourses({ onPrepare }: { onPrepare: () => void }) {
  return (
    <div className="page">
      <div className="pagehead"><div><span className="eyebrow"><Users size={14} />MIS CURSOS</span><h1>Un curso no es un promedio.</h1><p>Observa qué conceptos sostienen lo que viene, dónde se repite un error y qué intervención merece tu tiempo.</p></div><button className="primary" onClick={onPrepare}><Plus size={16} />Preparar clase</button></div>
      <div className="course-cards">
        {classPulse.map((course) => (
          <article className="card" key={course.name}>
            <div className="course-card-head"><div><span>{course.subject}</span><h3>{course.name}</h3></div><strong>{course.mastery}%</strong></div>
            <div className="progress"><i style={{ width: course.mastery + "%" }} /></div>
            <div className="course-meta"><span>Señal principal</span><b className={course.risk === "Sin alerta" ? "good" : ""}>{course.risk}</b></div>
            <div className="course-meta"><span>Siguiente</span><b>{course.next}</b></div>
            <button className="secondary full">Abrir curso <ChevronRight size={15} /></button>
          </article>
        ))}
      </div>
    </div>
  );
}

function TeacherLibrary() {
  const [query, setQuery] = useState("");
  const filtered = teacherLibrary.filter((item) => (item.title + item.type).toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="page">
      <div className="pagehead"><div><span className="eyebrow"><Library size={14} />BIBLIOTECA</span><h1>Lo que ya construiste no debería perderse.</h1><p>Guarda experiencias como objetos reutilizables, no como conversaciones enterradas en un historial de chat.</p></div></div>
      <div className="searchbox"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar clase, OA o material..." /></div>
      <div className="library-grid">
        {filtered.map((item) => (
          <article className="card library-card" key={item.title}>
            <span>{item.type}</span><h3>{item.title}</h3><p>{item.meta}</p>
            <div><button className="secondary"><Copy size={15} />Duplicar</button><button className="secondary">Abrir</button></div>
          </article>
        ))}
      </div>
    </div>
  );
}

function StudentRouter({ view, setView }: { view: ViewKey; setView: (v: ViewKey) => void }) {
  if (view === "learn") return <StudentLearn />;
  if (view === "map") return <StudentMap />;
  if (view === "tasks") return <StudentTasks onLearn={() => setView("learn")} />;
  return <StudentHome onLearn={() => setView("learn")} />;
}

function StudentHome({ onLearn }: { onLearn: () => void }) {
  return (
    <div className="page">
      <div className="pagehead studenthead">
        <div><span className="eyebrow"><Sparkles size={14} />HOY</span><h1>Buenos días, Lucas.</h1><p>No tienes que estudiar “todo”. Hay una dependencia corta que conviene reparar antes de tu prueba.</p></div>
        <div className="streak"><b>12</b><span>min recomendados hoy</span></div>
      </div>
      <div className="todaygrid">
        <article className="todaycard urgent" onClick={onLearn}><span>MATEMÁTICA</span><h3>Fracciones equivalentes</h3><div className="progress"><i style={{ width: "61%" }} /></div><p>61% · conviene reforzar hoy</p></article>
        <article className="todaycard"><span>CIENCIAS</span><h3>Tectónica de placas</h3><div className="progress"><i style={{ width: "76%" }} /></div><p>76% · prueba en 3 días</p></article>
        <article className="todaycard"><span>HISTORIA</span><h3>La Colonia</h3><div className="progress"><i style={{ width: "84%" }} /></div><p>84% · al día</p></article>
      </div>
      <div className="grid2 wideleft">
        <article className="card student-cta">
          <span className="cardlabel">SIGUIENTE MEJOR PASO</span>
          <h2>Primero demuestra equivalencia. Después seguimos.</h2>
          <p>Porcentajes y operaciones con fracciones se vuelven mucho más difíciles si esta idea queda inestable.</p>
          <button className="primary" onClick={onLearn}>Empezar · 12 min <ArrowRight size={16} /></button>
        </article>
        <article className="card">
          <span className="cardlabel">PRÓXIMAS FECHAS</span>
          <EventList compact />
        </article>
      </div>
    </div>
  );
}

function StudentLearn() {
  const [tab, setTab] = useState<"learn" | "proof" | "practice">("learn");
  const [answer, setAnswer] = useState<number | null>(null);
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState(false);

  return (
    <div className="page">
      <div className="pagehead"><div><span className="eyebrow"><Sparkles size={14} />APRENDER</span><h1>Pregunta lo que no entiendes.</h1><p>Educabot intenta convertir tu duda en una representación, una prueba y una forma de demostrar que la entendiste.</p></div></div>
      <div className="student-question card">
        <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ej: ¿por qué 2/4 es lo mismo que 1/2?" />
        <button className="primary" onClick={() => setAsked(Boolean(question.trim()))}>Construir explicación <ArrowRight size={16} /></button>
      </div>
      {asked && <div className="question-response"><Sparkles size={15} /><span>La pregunta quedaría registrada como nueva ruta de aprendizaje. En esta demo mostramos el micromundo instrumentado de fracciones equivalentes.</span></div>}
      <section className="learning card">
        <div className="learninghead"><div><span className="cardlabel">SESIÓN ACTIVA · MA05 OA 07</span><h2>¿Por qué 2/4 puede ser lo mismo que 1/2?</h2></div><TrustPill state="VERIFICADO" /></div>
        <div className="tabs">
          <button className={tab === "learn" ? "active" : ""} onClick={() => setTab("learn")}>Comprender</button>
          <button className={tab === "proof" ? "active" : ""} onClick={() => setTab("proof")}>¿Cómo sabemos?</button>
          <button className={tab === "practice" ? "active" : ""} onClick={() => setTab("practice")}>Demostrarlo</button>
        </div>
        {tab === "learn" && (
          <div className="fractionlab">
            <div className="fraction one"><div /><span>1/2</span></div>
            <div className="equals">=</div>
            <div className="fraction two"><div /><span>2/4</span></div>
            <div className="explain"><span className="cardlabel">OBSERVA</span><h3>La escritura cambió. La cantidad ocupada no.</h3><p>Antes de memorizar una regla, compara las dos representaciones y busca qué se conserva.</p></div>
          </div>
        )}
        {tab === "proof" && (
          <div className="claims">
            <div><TrustPill state="VERIFICADO" /><p>El OA trabaja equivalencia de fracciones mediante representaciones concreta, pictórica y simbólica.</p><span>Fuente curricular del catálogo cargado.</span></div>
            <div><TrustPill state="CORROBORADO" /><p>Multiplicar numerador y denominador por el mismo número distinto de cero conserva el valor.</p><span>En producción: instrumento matemático/recomputación.</span></div>
            <div><TrustPill state="SILENCIO" /><p>“Una fracción con números mayores siempre vale más”.</p><span>Bloqueada: contradice contraejemplos elementales.</span></div>
          </div>
        )}
        {tab === "practice" && (
          <div className="practice">
            <span className="cardlabel">RECONSTRUCCIÓN</span><h3>¿Cuál es equivalente a 1/2?</h3>
            <div>{["2/3", "2/4", "3/4", "1/4"].map((x, i) => <button className={answer === i ? (i === 1 ? "correct" : "wrong") : ""} onClick={() => setAnswer(i)} key={x}>{String.fromCharCode(65 + i)} · {x}</button>)}</div>
            {answer !== null && <p>{answer === 1 ? "Bien. Ahora explica por qué sin repetir una regla memorizada." : "No basta con que los números se parezcan. Vuelve a la representación."}</p>}
          </div>
        )}
      </section>
    </div>
  );
}

function StudentMap() {
  return (
    <div className="page">
      <div className="pagehead"><div><span className="eyebrow"><GitBranch size={14} />MI MAPA</span><h1>Lo que ya sostiene lo que viene.</h1><p>El mapa cambia cuando demuestras algo, no solo porque abriste una explicación.</p></div></div>
      <KnowledgeMap />
      <div className="grid2">
        <article className="card"><span className="cardlabel">FORTALEZA</span><h2>Representar una fracción.</h2><p className="muted">Puedes pasar entre dibujo y símbolo con poca ayuda. Esa evidencia sostiene los nodos siguientes.</p></article>
        <article className="card"><span className="cardlabel">DEPENDENCIA DÉBIL</span><h2>Operar con denominadores distintos.</h2><p className="muted">Antes de repetir ejercicios, el sistema recomienda reconstruir equivalencia y simplificación.</p></article>
      </div>
    </div>
  );
}

function StudentTasks({ onLearn }: { onLearn: () => void }) {
  return (
    <div className="page">
      <div className="pagehead"><div><span className="eyebrow"><Target size={14} />TAREAS Y FECHAS</span><h1>Tu calendario también sabe qué necesitas aprender.</h1><p>No solo recuerda fechas: cruza lo que viene con lo que todavía está débil.</p></div></div>
      <div className="grid2">
        <article className="card"><span className="cardlabel">PRÓXIMOS HITOS</span><EventList /></article>
        <article className="card">
          <span className="cardlabel">PLAN PARA LLEGAR PREPARADO</span>
          <div className="study-plan">
            <div><b>Hoy · 12 min</b><span>Fracciones equivalentes · reconstrucción</span></div>
            <div><b>Mañana · 15 min</b><span>Subducción · modelo visual + explicación</span></div>
            <div><b>Miércoles · 8 min</b><span>Prueba breve de transferencia</span></div>
          </div>
          <button className="primary full" onClick={onLearn}>Empezar lo de hoy <ArrowRight size={16} /></button>
        </article>
      </div>
    </div>
  );
}

function KnowledgeMap() {
  return (
    <section className="card knowledge">
      <div className="sectiontitle"><div><span className="cardlabel">GRAFO DE APRENDIZAJE</span><h3>No todo progreso es lineal.</h3></div><GitBranch size={18} /></div>
      <div className="graph">
        <svg viewBox="0 0 100 50"><line x1="10" y1="25" x2="35" y2="12" /><line x1="35" y1="12" x2="58" y2="28" /><line x1="58" y1="28" x2="82" y2="13" /><line x1="58" y1="28" x2="83" y2="42" /></svg>
        <span className="node n-a solid"><b>92%</b>Parte / todo</span>
        <span className="node n-b solid"><b>82%</b>Equivalencia</span>
        <span className="node n-c learning"><b>64%</b>Números mixtos</span>
        <span className="node n-d risk"><b>41%</b>Operaciones</span>
        <span className="node n-e unknown"><b>—</b>Razón</span>
      </div>
    </section>
  );
}

function FamilyRouter({ view }: { view: ViewKey }) {
  if (view === "calendar") return <FamilyCalendar />;
  if (view === "progress") return <FamilyProgress />;
  return <FamilyHome />;
}

function FamilyHome() {
  return (
    <div className="page">
      <div className="pagehead">
        <div><span className="eyebrow"><Users size={14} />EDUCABOT FAMILIA</span><h1>Lo importante, sin vigilar cada conversación.</h1><p>Progreso, próximas fechas y una recomendación concreta para acompañar esta semana.</p></div>
        <div className="familybadge"><ShieldCheck /><span>Contenido estudiado</span><b>92% con evidencia trazable</b></div>
      </div>
      <div className="metricgrid">
        <Metric label="PROGRESO SEMANAL" value="+8%" note="señal estimada" />
        <Metric label="PRÓXIMAS FECHAS" value="3" note="1 prueba · 2 entregas" />
        <Metric label="FORTALEZA" value="Historia" note="84% de dominio estimado" />
        <Metric label="A REFORZAR" value="Fracciones" note="explicación, no memorización" />
      </div>
      <div className="grid2">
        <article className="card">
          <span className="cardlabel">CÓMO AYUDAR HOY</span>
          <h2>Pídele que te lo enseñe a ti.</h2>
          <p className="muted">Pregunta: “¿Puedes mostrarme con un dibujo por qué 2/4 y 1/2 representan lo mismo?” No le des la regla primero. Queremos observar si puede reconstruirla.</p>
          <div className="tip"><BrainCircuit />Una buena explicación del alumno puede entregar más información que repetir ejercicios mecánicos.</div>
        </article>
        <article className="card"><span className="cardlabel">CALENDARIO VIVO</span><EventList compact /></article>
      </div>
    </div>
  );
}

function FamilyCalendar() {
  return (
    <div className="page">
      <div className="pagehead"><div><span className="eyebrow"><CalendarDays size={14} />PRÓXIMAS FECHAS</span><h1>Fechas con contexto, no solo recordatorios.</h1><p>Cada evento puede conectarse con lo que el alumno ya domina y con lo que conviene reforzar antes.</p></div></div>
      <section className="card calendar-card"><EventList /><div className="calendar-insight"><Sparkles size={16} /><div><b>Preparación sugerida</b><span>Antes de la prueba de Ciencias, una sesión corta de subducción tiene más prioridad que volver a leer toda la unidad.</span></div></div></section>
    </div>
  );
}

function FamilyProgress() {
  return (
    <div className="page">
      <div className="pagehead"><div><span className="eyebrow"><BrainCircuit size={14} />PROGRESO</span><h1>Ver avance sin convertirlo en vigilancia.</h1><p>La familia recibe señales útiles. Las conversaciones completas y el proceso privado del alumno no se muestran por defecto.</p></div></div>
      <KnowledgeMap />
      <div className="privacy-note"><ShieldCheck size={16} /><span>Educabot separa acompañamiento familiar de monitoreo invasivo. El objetivo es ayudar, no fiscalizar cada interacción.</span></div>
    </div>
  );
}

function CenterRouter({ view }: { view: ViewKey }) {
  if (view === "curriculum") return <CenterCurriculum />;
  if (view === "risk") return <CenterRisk />;
  if (view === "interventions") return <CenterInterventions />;
  return <CenterHome />;
}

function CenterHome() {
  return (
    <div className="page">
      <div className="pagehead"><div><span className="eyebrow"><School size={14} />CENTRO DE MANDO</span><h1>Detectar antes de que aparezca en la nota.</h1><p>El sistema cruza currículo, evidencia y dependencias para mostrar dónde conviene mirar y qué intervención vale la pena probar.</p></div><button className="secondary"><CalendarDays size={16} />Semana 41</button></div>
      <div className="metricgrid">
        <Metric label="ALUMNOS ACTIVOS" value="283" note="91% esta semana" />
        <Metric label="OA OBSERVADOS" value="26" note="12 consolidados" />
        <Metric label="CUELLOS DE BOTELLA" value="4" note="2 de alta prioridad" />
        <Metric label="INTERVENCIONES" value="7" note="5 con mejora medible" />
      </div>
      <div className="grid2 wideleft">
        <CurriculumHeat />
        <article className="card alertcard">
          <span className="cardlabel">ALERTA ANTICIPATORIA</span>
          <div className="alerticon"><TriangleAlert /></div>
          <h2>El próximo OA llega antes que el prerrequisito.</h2>
          <p>38% de 7°B todavía no consolida la relación entre convergencia y subducción. La siguiente secuencia asume esa dependencia.</p>
          <button className="primary full">Diseñar intervención <ArrowRight size={16} /></button>
        </article>
      </div>
      <InterventionCard />
    </div>
  );
}

function CenterCurriculum() {
  return (
    <div className="page">
      <div className="pagehead"><div><span className="eyebrow"><BookOpenCheck size={14} />CURRÍCULO</span><h1>De cobertura a estructura.</h1><p>No basta saber qué OA “se pasó”. Necesitamos saber qué conceptos siguen sosteniendo el aprendizaje y cuáles quedaron frágiles.</p></div></div>
      <CurriculumHeat />
    </div>
  );
}

function CenterRisk() {
  return (
    <div className="page">
      <div className="pagehead"><div><span className="eyebrow"><TriangleAlert size={14} />RIESGOS</span><h1>Una alerta debe explicar por qué existe.</h1><p>Las predicciones se muestran como hipótesis con evidencia y nunca como sentencia sobre un estudiante.</p></div></div>
      <div className="risk-list">
        <article className="card"><span className="risk-level high">ALTA PRIORIDAD</span><h3>7°B · Subducción</h3><p>La siguiente secuencia depende de una relación causal que aún no se reconstruye de forma estable.</p><small>Evidencia: 12 tickets de salida + 2 actividades de transferencia.</small></article>
        <article className="card"><span className="risk-level medium">REVISAR</span><h3>5°A · Equivalencia</h3><p>El procedimiento aparece, pero varios alumnos no justifican por qué conserva el valor.</p><small>Evidencia: respuestas correctas con explicación insuficiente.</small></article>
      </div>
    </div>
  );
}

function CenterInterventions() {
  return (
    <div className="page">
      <div className="pagehead"><div><span className="eyebrow"><Target size={14} />INTERVENCIONES</span><h1>Probar, medir, aprender de lo que funciona.</h1><p>Una recomendación no se vuelve verdad porque la IA la proponga. Se aplica, se mide y se conserva su resultado.</p></div></div>
      <InterventionCard />
      <div className="intervention-history">
        <article className="card"><span>APLICADA</span><h3>Representación visual de equivalencia</h3><b>+14 pts</b><p>Mejora observada en reconstrucción, no solo selección múltiple.</p></article>
        <article className="card"><span>EN CURSO</span><h3>Contraste de explicaciones en Ciencias</h3><b>2 sesiones</b><p>Esperando ticket de salida de la segunda sesión.</p></article>
        <article className="card"><span>PROPUESTA</span><h3>Grupo breve de refuerzo</h3><b>8 alumnos</b><p>Hipótesis pendiente de aprobación docente.</p></article>
      </div>
    </div>
  );
}

function CurriculumHeat() {
  return (
    <article className="card curriculum-heat">
      <div className="sectiontitle"><div><span className="cardlabel">MAPA CURRICULAR</span><h3>Señales de dominio por objetivo.</h3></div><BookOpenCheck /></div>
      <div className="heat">
        {oa.map((x) => (
          <div key={x.code}>
            <span><b>{x.code}</b>{x.title}</span>
            <div><i className={x.state} style={{ width: x.mastery + "%" }} /></div>
            <strong>{x.mastery}%</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function InterventionCard() {
  return (
    <article className="card intervention">
      <div><span className="cardlabel">INTERVENCIÓN PROPUESTA</span><h3>18 min · contraste visual + explicación en parejas</h3><p>Objetivo: reparar el modelo causal antes de avanzar. Revaluar con un caso nuevo y comparar contra línea base.</p></div>
      <div><span>IMPACTO ESPERADO</span><b>Hipótesis · no hecho</b><small>se medirá después de aplicar</small></div>
    </article>
  );
}

function EventList({ compact = false }: { compact?: boolean }) {
  return (
    <div className={"events " + (compact ? "compact" : "")}>
      {upcoming.map((event) => (
        <div key={event.date + event.title}>
          <b>{event.date}</b><span>{event.title}</span><small>{event.note}</small>
        </div>
      ))}
    </div>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return <article className="metric"><span>{label}</span><b>{value}</b><small>{note}</small></article>;
}

function Landing({ onEnter }: { onEnter: () => void }) {
  const [faq, setFaq] = useState<number | null>(0);
  const faqs = [
    ["¿Educabot reemplaza al profesor?", "No. El profesor conserva la autoridad pedagógica. Educabot prepara, organiza, verifica hasta donde puede y propone; el docente revisa, adapta y decide."],
    ["¿Es otro chatbot para estudiantes?", "No. El chat puede ser una entrada, pero la respuesta puede transformarse en una simulación, un mapa, una práctica, una línea de tiempo o una experiencia. El sistema guarda aprendizaje y dependencias."],
    ["¿Cómo trata las alucinaciones?", "Separando generación de autoridad. Una afirmación del modelo no se vuelve 'verificada' por sonar bien. Debe enlazarse a evidencia o quedar como corroborada, conjetura declarada o silencio."],
    ["¿Puede generar videos, afiches y cómics?", "Sí, mediante un Studio que parte del objetivo pedagógico. La estructura se revisa antes de gastar generación audiovisual o de imagen."],
    ["¿Qué ve el apoderado?", "Señales útiles: progreso, fechas, conceptos que necesitan apoyo y recomendaciones. No la conversación completa del alumno por defecto."],
    ["¿Es un producto oficial de Mineduc?", "No. Educabot es un producto independiente que puede trabajar con el Currículum Nacional y objetivos de aprendizaje cargados y versionados en su catálogo."]
  ];

  return (
    <div className="landing">
      <nav className="topnav">
        <div className="brand"><span className="brandmark"><Orbit size={18} /></span><b>EDUCABOT</b></div>
        <div className="navlinks"><a href="#problema">Por qué</a><a href="#producto">Producto</a><a href="#confianza">Confianza</a><a href="#docente">Docentes</a></div>
        <button className="secondary" onClick={onEnter}>Ver prototipo</button>
      </nav>

      <section className="hero">
        <div className="gridbg" />
        <div className="herocopy">
          <span className="eyebrow"><Sparkles size={14} />IA PARA ENSEÑAR Y APRENDER MEJOR</span>
          <h1>La IA ya llegó a la sala de clases.<br /><em>Hagamos que sirva para aprender de verdad.</em></h1>
          <p>Educabot ayuda a docentes a preparar clases y materiales, acompaña a estudiantes con experiencias personalizadas y muestra a colegios dónde se está entendiendo —y dónde conviene intervenir— sin convertir la IA en un oráculo.</p>
          <div className="heroactions">
            <button className="primary" onClick={onEnter}>Preparar una clase <ArrowRight size={17} /></button>
            <a href="#producto">Ver cómo funciona <ChevronRight size={16} /></a>
          </div>
          <div className="proof">
            <span><ShieldCheck />Evidencia visible</span>
            <span><GitBranch />Aprendizaje persistente</span>
            <span><BrainCircuit />Intervenciones accionables</span>
          </div>
        </div>

        <div className="heroapp card">
          <div className="fakebar"><span><Orbit size={14} />Educabot Docente</span><small>PRAXIOS activo</small></div>
          <div className="fakeprompt">
            <span>MAÑANA · 7°B · CIENCIAS · 90 MIN</span>
            <h3>“Quiero enseñar tectónica de placas. A este curso le cuesta trabajar con modelos abstractos.”</h3>
            <button onClick={onEnter}>Preparar clase <ArrowRight size={15} /></button>
          </div>
          <div className="fakepack">
            <div><CheckCircle2 /><span><b>Secuencia de clase</b><small>6 momentos · objetivo cognitivo claro</small></span></div>
            <div><PanelTop /><span><b>Micromundo</b><small>convergencia y subducción</small></span></div>
            <div><FileText /><span><b>Guía + ticket de salida</b><small>reconstrucción y transferencia</small></span></div>
            <div className="trustbox"><ShieldCheck /><span><b>¿Cómo sabemos?</b><small>currículo trazable · claims con estado · frontera visible</small></span></div>
          </div>
        </div>
      </section>

      <section className="band">
        <div><b>DOCENTE</b><span>Diseña sin pelear con prompts.</span></div>
        <div><b>ALUMNO</b><span>Aprende sin entregar el pensamiento.</span></div>
        <div><b>FAMILIA</b><span>Acompaña sin vigilar.</span></div>
        <div><b>CENTRO</b><span>Detecta y decide antes.</span></div>
      </section>

      <section id="problema" className="marketing problem-section">
        <span className="eyebrow">EL PROBLEMA NO ES “USAR IA”</span>
        <div className="section-split">
          <h2>Hoy demasiada energía se va en hacer que una IA generalista entienda la clase.</h2>
          <div>
            <p>El profesor copia contexto, corrige respuestas, rehace guías, ajusta niveles, prueba otra vez el afiche y vuelve a explicar qué quería lograr.</p>
            <p>El alumno recibe una respuesta convincente, pero puede no saber si es correcta, si corresponde a su nivel o si realmente la entendió.</p>
            <p><b>Educabot invierte la relación:</b> el profesor define la intención pedagógica y la IA trabaja dentro de un sistema que conserva currículo, evidencia, estado y aprendizaje.</p>
          </div>
        </div>
      </section>

      <section id="docente" className="marketing teacher-wedge">
        <div className="section-split">
          <div><span className="eyebrow">EMPIEZA POR UN DOLOR REAL</span><h2>Prepara la clase de mañana.</h2></div>
          <p>Curso, asignatura, tiempo y una frase sobre lo que quieres lograr. Educabot devuelve un paquete listo para revisar: planificación, materiales, actividades, evaluación y plan B.</p>
        </div>
        <div className="wedge-demo card">
          <div className="wedge-input">
            <span>7° B · Ciencias · 90 minutos</span>
            <h3>“Necesito que entiendan por qué Chile tiembla tanto, pero sin memorizar una definición de tectónica.”</h3>
            <button className="primary" onClick={onEnter}>Generar paquete <ArrowRight size={16} /></button>
          </div>
          <div className="wedge-output">
            <div><b>01</b><span>Observación inicial</span><small>ver patrón antes de explicarlo</small></div>
            <div><b>02</b><span>Micromundo</span><small>modelo visual manipulable</small></div>
            <div><b>03</b><span>Explicación en parejas</span><small>reconstrucción</small></div>
            <div><b>04</b><span>Tiburón de ideas</span><small>buscar qué explicación falla</small></div>
            <div><b>05</b><span>Ticket de salida</span><small>transferencia + duda abierta</small></div>
          </div>
        </div>
      </section>

      <section id="producto" className="marketing">
        <span className="eyebrow">UN SOLO SISTEMA · CUATRO EXPERIENCIAS</span>
        <h2>El aprendizaje no termina cuando la IA entrega un texto.</h2>
        <div className="featuregrid">
          <article><WandSparkles /><span>DOCENTE</span><h3>Diseña, revisa y asigna.</h3><p>Clases, guías, experimentos, evaluaciones, afiches, cómics y videos desde una intención pedagógica.</p></article>
          <article><GraduationCap /><span>ALUMNO</span><h3>Una interfaz que cambia con el concepto.</h3><p>Simulaciones, mapas, líneas de tiempo y práctica guiada en vez de una conversación infinita.</p></article>
          <article><Users /><span>FAMILIA</span><h3>Sabe qué necesita y cómo ayudar.</h3><p>Fechas, progreso, conceptos débiles y una acción concreta sin exponer todo el historial del alumno.</p></article>
          <article><School /><span>CENTRO</span><h3>De reporting a decisión.</h3><p>Detecta dependencias débiles, anticipa riesgo, propone intervenciones y mide qué ocurrió después.</p></article>
        </div>
      </section>

      <section className="marketing learning-loop">
        <span className="eyebrow">EL CICLO COMPLETO</span>
        <h2>Crear material es solo el principio.</h2>
        <div className="loop-grid">
          {[
            ["01", "Diseñar", "El docente define el objetivo y Educabot construye la experiencia."],
            ["02", "Asignar", "La actividad llega al alumno con calendario y contexto."],
            ["03", "Observar", "Se registra evidencia de explicación, práctica y transferencia."],
            ["04", "Detectar", "El grafo muestra dependencias, errores y señales de riesgo."],
            ["05", "Intervenir", "Educabot propone una acción; el docente decide."],
            ["06", "Medir", "El sistema compara antes y después para aprender de la intervención."]
          ].map(([n, title, copy]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section id="confianza" className="marketing trustsection">
        <div className="trustvisual card">
          <div className="organrow"><span>SOÑAR</span><i /><span>DESCOMPONER</span><i /><span>INSTRUMENTAR</span><i /><span>REFUTAR</span></div>
          <div className="sharkline"><span className="shark">◢</span><div><b>Tiburón</b><small>intenta romper la respuesta antes de emitir</small></div></div>
          <div className="authority"><ShieldCheck /><div><b>Authority Boundary</b><small>el modelo no puede declararse verdadero a sí mismo</small></div><TrustPill state="VERIFICADO" /></div>
        </div>
        <div>
          <span className="eyebrow">IA CON LÍMITES VISIBLES</span>
          <h2>Confiar no es poner una cita al final.</h2>
          <p>Educabot separa generación, evidencia y autoridad. Lo que no puede sostenerse se degrada, se declara como deuda o queda en silencio. Y cuando una decisión importa, el humano conserva la autoridad final.</p>
          <div className="trust-copy-list"><span><TrustPill state="VERIFICADO" /> Evidencia instrumentada dentro del alcance.</span><span><TrustPill state="CORROBORADO" /> Hay apoyo, pero falta cerrar verificación.</span><span><TrustPill state="CONJETURA_DECLARADA" /> Hipótesis visible como hipótesis.</span><span><TrustPill state="SILENCIO" /> El sistema no tiene derecho a afirmar.</span></div>
        </div>
      </section>

      <section className="marketing studio-marketing">
        <div className="section-split">
          <div><span className="eyebrow">EDUCABOT STUDIO</span><h2>Un video para mañana no debería costar una noche de prompts.</h2></div>
          <p>Educabot parte por el objetivo cognitivo, crea el guion y el storyboard, verifica la estructura y recién después manda a renderizar. El mismo flujo sirve para cómics, afiches, infografías y presentaciones.</p>
        </div>
        <div className="studio-preview card">
          <div className="pipeline-preview"><span className="done">Objetivo</span><i /><span className="done">Guion</span><i /><span className="active">Storyboard</span><i /><span>Render</span></div>
          <div className="storyboard">
            <article><b>01</b><div className="frame map-frame" /><span>Observa el patrón</span></article>
            <article><b>02</b><div className="frame plate-frame" /><span>Construye el modelo</span></article>
            <article><b>03</b><div className="frame question-frame">?</div><span>Transfiere la idea</span></article>
          </div>
        </div>
      </section>

      <section className="marketing command-marketing">
        <span className="eyebrow">CENTRO DE MANDO</span>
        <h2>No esperes a la prueba para descubrir dónde se rompió la cadena.</h2>
        <div className="command-preview card">
          <div className="command-metrics"><Metric label="OA OBSERVADOS" value="26" note="12 consolidados" /><Metric label="CUELLOS DE BOTELLA" value="4" note="2 prioritarios" /><Metric label="INTERVENCIONES" value="7" note="5 con mejora medible" /></div>
          <div className="command-alert"><TriangleAlert /><div><span>ALERTA</span><b>38% de 7°B no consolida una dependencia del próximo OA.</b><p>Propuesta: 18 min de contraste visual + explicación en parejas. Impacto esperado: hipótesis, no hecho.</p></div></div>
        </div>
      </section>

      <section className="marketing faq">
        <span className="eyebrow">PREGUNTAS IMPORTANTES</span>
        <h2>Lo que Educabot es. Y lo que no pretende ser.</h2>
        <div className="faq-list">
          {faqs.map(([q, a], i) => (
            <button key={q} onClick={() => setFaq(faq === i ? null : i)} className={faq === i ? "open" : ""}>
              <div><b>{q}</b><span>{faq === i ? "−" : "+"}</span></div>
              {faq === i && <p>{a}</p>}
            </button>
          ))}
        </div>
      </section>

      <section className="cta">
        <div><span className="eyebrow">EDUCABOT</span><h2>La IA puede producir más.<br />La meta es que aprendamos mejor.</h2></div>
        <button className="primary" onClick={onEnter}>Entrar al prototipo <ArrowRight size={17} /></button>
      </section>

      <footer>
        <div className="brand"><span className="brandmark"><Orbit size={18} /></span><b>EDUCABOT</b></div>
        <span>Powered by PRAXIOS · Producto independiente · No afiliado oficialmente a Mineduc.</span>
      </footer>
    </div>
  );
}

export default function App() {
  const [entered, setEntered] = useState(false);
  const content = useMemo(() => entered ? <AppShell onExit={() => setEntered(false)} /> : <Landing onEnter={() => setEntered(true)} />, [entered]);
  return content;
}
