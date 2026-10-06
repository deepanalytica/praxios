import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Check, ChevronRight, ClipboardList, Clock3, Download, FileText, House, Layers3, Plus, SearchCheck, Sparkles, WandSparkles } from "lucide-react";
import WorkspaceShell, { type NavItem } from "./WorkspaceShell";
import { CalendarBoard, EventInspector, kindLabel } from "./CalendarBoard";
import { dateKey, deleteCustomEvent, loadPlan, longDate, saveCustomEvent, shortDate, usePlan, type PlanKind } from "../learningPlan";
import { generateClassPackResult } from "../api";
import type { ClassPack, ClassRequest } from "../data";

type TeacherTab = "resumen" | "planificacion" | "materiales" | "evaluaciones";

const initialRequest: ClassRequest = {
  course: "5° básico A",
  subject: "Matemática",
  duration: "45 min",
  prompt: "Quiero que mis estudiantes representen fracciones equivalentes y expliquen por qué dos dibujos muestran la misma cantidad.",
  outputs: ["Secuencia", "Ticket de salida"]
};

const examplePack: ClassPack = {
  title: "Una cantidad, distintas formas",
  meta: "5° básico A · Matemática · 45 min",
  goal: "Representar fracciones equivalentes con modelos visuales y justificar, con palabras propias, por qué expresan la misma cantidad.",
  oaCode: "MA05 OA 07",
  oaLabel: "Fracciones propias, representación y equivalencia. Referencia curricular para revisar.",
  flow: [
    { time: "0–8 min", name: "Observar", copy: "Mostrar dos barras con divisiones distintas. Preguntar si representan la misma cantidad." },
    { time: "8–20 min", name: "Construir", copy: "Doblar y colorear tiras de papel para representar 1/2 y 2/4." },
    { time: "20–35 min", name: "Explicar", copy: "Cada pareja defiende una equivalencia con un dibujo y una frase propia." },
    { time: "35–45 min", name: "Transferir", copy: "Resolver un caso nuevo y señalar qué evidencia convence." }
  ],
  materials: ["Tiras de papel", "Guía visual", "Ticket de salida"],
  trust: [{ state: "CORROBORADO", text: "Referencia curricular sugerida", detail: "Revisar si la actividad cubre efectivamente el OA." }],
  teacherNotes: ["Pedir una explicación antes de entregar una regla.", "Revisar errores de representación en el ticket."],
  exitTicket: ["Dibuja 1/2 y 2/4. ¿Cómo sabes que son equivalentes?", "Propón otra fracción equivalente y justifícala."]
};

function downloadPack(pack: ClassPack) {
  const text = `# ${pack.title}\n\n${pack.meta}\n\n## Objetivo\n${pack.goal}\n\n## Referencia curricular por revisar\n${pack.oaCode}: ${pack.oaLabel}\n\n## Secuencia\n${pack.flow.map((step) => `- ${step.time} · ${step.name}: ${step.copy}`).join("\n")}\n\n## Materiales\n${pack.materials.map((item) => `- ${item}`).join("\n")}\n\n## Ticket de salida\n${pack.exitTicket.map((item) => `- ${item}`).join("\n")}\n\nRevisa las afirmaciones, el OA y la pertinencia para tu curso antes de usarlo.`;
  const url = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url; link.download = "educabot-clase.md"; link.click(); URL.revokeObjectURL(url);
}

export default function CreateApp() {
  const [tab, setTab] = useState<TeacherTab>(() => {
    const requested = new URLSearchParams(window.location.search).get("vista");
    return (["planificacion", "materiales", "evaluaciones"] as string[]).includes(requested || "") ? requested as TeacherTab : "resumen";
  });
  const [selectedDate, setSelectedDate] = useState(() => loadPlan().find((event) => event.date >= dateKey(new Date()))?.date || dateKey(new Date()));
  const [newDate, setNewDate] = useState(selectedDate);
  const [newKind, setNewKind] = useState<PlanKind>("clase");
  const [newTitle, setNewTitle] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newDetail, setNewDetail] = useState("");
  const [newMethod, setNewMethod] = useState("");
  const [planMessage, setPlanMessage] = useState("");
  const [input, setInput] = useState<ClassRequest>(initialRequest);
  const [pack, setPack] = useState<ClassPack>(examplePack);
  const [packRequest, setPackRequest] = useState<ClassRequest>(initialRequest);
  const [mode, setMode] = useState<"example" | "ai-assisted" | "deterministic-fallback">("example");
  const [reviewed, setReviewed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const events = usePlan();
  const today = dateKey(new Date());
  const upcoming = useMemo(() => events.filter((event) => event.date >= today), [events, today]);
  const nextClass = upcoming.find((event) => event.kind === "clase" || event.kind === "practica");
  const nextExam = upcoming.find((event) => event.kind === "prueba");
  const exams = upcoming.filter((event) => event.kind === "prueba");
  const canSharePack = packRequest.course.trim() === "5° básico A" && packRequest.subject.trim().toLowerCase() === "matemática";
  const nav: NavItem<TeacherTab>[] = [
    { key: "resumen", label: "Resumen", icon: <House size={18}/> },
    { key: "planificacion", label: "Planificación", icon: <CalendarDays size={18}/> },
    { key: "materiales", label: "Crear material", icon: <Layers3 size={18}/> },
    { key: "evaluaciones", label: "Evaluaciones", icon: <ClipboardList size={18}/> }
  ];
  useEffect(() => { const url = new URL(window.location.href); if (tab === "resumen") url.searchParams.delete("vista"); else url.searchParams.set("vista", tab); window.history.replaceState({}, "", url); }, [tab]);
  const updateInput = (key: "course" | "subject" | "duration" | "prompt", value: string) => setInput((current) => ({ ...current, [key]: value }));
  const generate = async () => { setLoading(true); setError(""); setReviewed(false); try { const request = { ...input }; const result = await generateClassPackResult(request); setPack(result.pack); setPackRequest(request); setMode(result.mode); } catch { setError("No se pudo preparar el borrador. Intenta de nuevo."); } finally { setLoading(false); } };
  const saveEvent = () => {
    if (!newDate || !newTitle.trim() || !newTopic.trim() || !newDetail.trim() || !newMethod.trim()) { setPlanMessage("Completa fecha, nombre, contenido y preparación."); return; }
    saveCustomEvent({ date: newDate, kind: newKind, title: newTitle.trim(), topic: newTopic.trim(), detail: newDetail.trim(), method: newMethod.trim() });
    setSelectedDate(newDate); setNewTitle(""); setNewTopic(""); setNewDetail(""); setNewMethod("");
    setPlanMessage("Actividad añadida. También aparece en el calendario de Aprende en este navegador.");
  };
  const schedulePack = () => {
    if (!reviewed || !canSharePack) return;
    saveCustomEvent({ date: selectedDate, kind: "clase", title: pack.title, topic: packRequest.subject, detail: pack.goal, method: pack.flow[0]?.copy || "Revisar la secuencia con el curso." });
    setPlanMessage("Clase programada. Ya aparece en el calendario de Aprende en este navegador."); setTab("planificacion");
  };
  const openDate = (date: string) => { setSelectedDate(date); setNewDate(date); setTab("planificacion"); };
  const newExam = () => { setNewKind("prueba"); setTab("planificacion"); setPlanMessage(""); };

  return <div className="premium-app p-teacher"><WorkspaceShell product="Crea" eyebrow="ESPACIO DOCENTE" nav={nav} active={tab} onNavigate={setTab} switchHref="/aprende" switchLabel="Vista estudiante" footer={<div className="p-sidebar-context"><Sparkles size={16}/><span>Tu planificación y los contenidos de Aprende comparten esta demo local.</span></div>}>
    {tab === "resumen" && <><div className="p-page-heading"><div><span className="p-kicker">5° BÁSICO A · MATEMÁTICA</span><h1>Tu semana de clases<span>.</span></h1><p>{longDate(today)} · Planifica, prepara y mantén el contenido a la vista.</p></div><button className="p-solid-action" onClick={() => setTab("materiales")}><Plus size={17}/> Crear material</button></div><div className="p-teacher-overview"><section className="p-teacher-feature"><span className="p-light-kicker">PRÓXIMA ACTIVIDAD</span><h2>{nextClass?.title || "Aún no hay clases"}</h2><p>{nextClass?.detail || "Añade una clase desde Planificación."}</p><div className="p-feature-meta"><span><CalendarDays size={15}/> {nextClass ? longDate(nextClass.date) : "Sin fecha"}</span><span><BookOpen size={15}/> {nextClass?.topic || "Matemática"}</span></div><button onClick={() => nextClass && openDate(nextClass.date)}>Abrir planificación <ArrowRight size={17}/></button><div className="p-feature-glow"/></section><section className="p-teacher-exam"><span className="p-kicker">EVALUACIÓN PROGRAMADA</span>{nextExam ? <><strong>{shortDate(nextExam.date)}</strong><h3>{nextExam.title}</h3><p>{nextExam.detail}</p><button className="p-text-action" onClick={() => openDate(nextExam.date)}>Ver contenidos <ArrowRight size={15}/></button></> : <><h3>Sin pruebas próximas</h3><button className="p-text-action" onClick={newExam}>Programar una prueba <ArrowRight size={15}/></button></>}</section></div><section className="p-agenda-section"><div className="p-section-heading"><div><span className="p-kicker">DEL PLAN AL AULA</span><h2>Próximas fechas</h2></div><button className="p-text-action" onClick={() => setTab("planificacion")}>Ver calendario <ArrowRight size={15}/></button></div><div className="p-agenda-list">{upcoming.slice(0,5).map((event) => <button key={event.id} onClick={() => openDate(event.date)}><span className="p-agenda-date"><strong>{new Date(`${event.date}T12:00:00`).getDate()}</strong><small>{new Intl.DateTimeFormat("es-CL", { month: "short" }).format(new Date(`${event.date}T12:00:00`))}</small></span><span className={`p-kind-label p-kind-${event.kind}`}>{kindLabel(event.kind)}</span><span className="p-agenda-copy"><strong>{event.title}</strong><small>{event.topic} · {event.detail}</small></span><ChevronRight size={18}/></button>)}</div></section></>}
    {tab === "planificacion" && <><div className="p-page-heading"><div><span className="p-kicker">CURSO · 5° BÁSICO A</span><h1>Planificación<span>.</span></h1><p>Lo que programes aquí se verá en el calendario del estudiante en este navegador.</p></div><button className="p-outline-action" onClick={newExam}><Plus size={16}/> Nueva prueba</button></div><div className="p-calendar-layout"><CalendarBoard events={events} selected={selectedDate} onSelect={(date) => { setSelectedDate(date); setNewDate(date); }}/><div className="p-planning-rail"><EventInspector selected={selectedDate} events={events} teacher onDelete={(id) => { deleteCustomEvent(id); setPlanMessage("Actividad retirada del plan."); }}/><section className="p-event-form" aria-label="Añadir al calendario"><span className="p-kicker">AÑADIR AL PLAN</span><h3>{newKind === "prueba" ? "Programa una prueba" : "Programa una actividad"}</h3><div className="p-form-pair"><label>Fecha<input type="date" value={newDate} onChange={(event) => setNewDate(event.target.value)}/></label><label>Tipo<select value={newKind} onChange={(event) => setNewKind(event.target.value as PlanKind)}><option value="clase">Clase</option><option value="practica">Práctica</option><option value="prueba">Prueba</option></select></label></div><label>Nombre<input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="Ej. Prueba de fracciones"/></label><label>Contenido<input value={newTopic} onChange={(event) => setNewTopic(event.target.value)} placeholder="Ej. Fracciones equivalentes"/></label><label>Qué deben aprender<textarea rows={2} value={newDetail} onChange={(event) => setNewDetail(event.target.value)} placeholder="Contenidos concretos para el estudiante"/></label><label>Cómo prepararse<textarea rows={2} value={newMethod} onChange={(event) => setNewMethod(event.target.value)} placeholder="Una indicación práctica y breve"/></label><button className="p-solid-action" onClick={saveEvent}><Plus size={16}/> Guardar en calendario</button>{planMessage && <p className="p-plan-message" role="status">{planMessage}</p>}</section></div></div></>}
    {tab === "materiales" && <><div className="p-page-heading"><div><span className="p-kicker">TALLER DOCENTE</span><h1>Crear material<span>.</span></h1><p>Un borrador para adaptar. Tú revisas el contenido antes de llevarlo al aula.</p></div></div><div className="p-material-layout"><section className="p-builder"><div className="p-builder-head"><span className="p-kicker">01 / INTENCIÓN PEDAGÓGICA</span><h2>Prepara tu clase</h2><p>Parte de lo que quieres que comprendan, no de un prompt perfecto.</p></div><div className="p-form-pair"><label>Curso<input value={input.course} onChange={(event) => updateInput("course", event.target.value)}/></label><label>Duración<input value={input.duration} onChange={(event) => updateInput("duration", event.target.value)}/></label></div><label>Asignatura<input value={input.subject} onChange={(event) => updateInput("subject", event.target.value)}/></label><label>¿Qué deben comprender?<textarea rows={5} value={input.prompt} onChange={(event) => updateInput("prompt", event.target.value)}/></label><div className="p-builder-note"><SearchCheck size={18}/><span>La salida será un borrador. Comprueba hechos y alineación curricular antes de usarla.</span></div><button className="p-solid-action p-generate" disabled={loading || !input.prompt.trim()} onClick={generate}><WandSparkles size={17}/>{loading ? "Preparando borrador…" : "Generar borrador"}</button>{error && <p className="p-plan-message" role="alert">{error}</p>}</section><section className="p-pack-preview"><div className="p-pack-top"><div><span className="p-kicker">02 / BORRADOR PARA REVISAR</span><h2>{pack.title}</h2><p>{pack.meta}</p></div><span className="p-preview-state">{mode === "example" ? "EJEMPLO" : mode === "ai-assisted" ? "ASISTIDO POR IA" : "DEMO"}</span></div><div className="p-pack-goal"><span>OBJETIVO DE APRENDIZAJE</span><p>{pack.goal}</p></div><div className="p-pack-sequence"><span className="p-kicker">SECUENCIA</span>{pack.flow.slice(0,4).map((step, index) => <div key={`${step.time}-${index}`}><span>{step.time}</span><strong>{step.name}</strong><p>{step.copy}</p></div>)}</div><div className="p-pack-review"><SearchCheck size={19}/><p>La IA no verifica sus propias afirmaciones. Revisa los hechos, el OA y la pertinencia para tu curso.</p></div><label className="p-review-check"><input type="checkbox" checked={reviewed} onChange={(event) => setReviewed(event.target.checked)}/> Ya revisé este borrador.</label>{!canSharePack && <p className="p-share-note">Este calendario de demostración corresponde a 5° básico A · Matemática. Puedes descargar el material para otros cursos.</p>}<div className="p-pack-actions"><button disabled={!reviewed} onClick={() => downloadPack(pack)}><Download size={16}/> Descargar</button><button disabled={!reviewed || !canSharePack} onClick={schedulePack}><CalendarDays size={16}/> Programar clase</button></div></section></div></>}
    {tab === "evaluaciones" && <><div className="p-page-heading"><div><span className="p-kicker">5° BÁSICO A · MATEMÁTICA</span><h1>Evaluaciones<span>.</span></h1><p>Fechas, contenidos y preparación que el estudiante verá en su calendario.</p></div><button className="p-solid-action" onClick={newExam}><Plus size={17}/> Programar prueba</button></div><div className="p-assessment-list">{exams.length ? exams.map((exam) => <button key={exam.id} onClick={() => openDate(exam.date)}><span className="p-assessment-date"><strong>{new Date(`${exam.date}T12:00:00`).getDate()}</strong><small>{new Intl.DateTimeFormat("es-CL", { month: "long" }).format(new Date(`${exam.date}T12:00:00`))}</small></span><span className="p-assessment-content"><span className="p-kind-label p-kind-prueba">PRUEBA</span><strong>{exam.title}</strong><small>{exam.detail}</small><em>Preparación: {exam.method}</em></span><ArrowUpRight size={18}/></button>) : <div className="p-empty-day">No hay pruebas próximas. Programa la primera desde Planificación.</div>}</div><div className="p-evidence-note"><Check size={18}/><p>Esta planificación se comparte solo entre las vistas de demostración de este navegador. Todavía no hay cuentas, cursos ni sincronización escolar real.</p></div></>}
  </WorkspaceShell></div>;
}
