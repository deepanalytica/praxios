import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BookOpen, CalendarDays, ChartLine, Check, Clock3, Headphones, House, Pause, PenLine, Play } from "lucide-react";
import WorkspaceShell, { type NavItem } from "./WorkspaceShell";
import LearningSession from "./LearningSession";
import { CalendarBoard, EventInspector, kindLabel } from "./CalendarBoard";
import { activities, activityForEvent, evidenceUpdateEvent, readEvidence, type EvidenceMap } from "../learningActivities";
import { addDays, dateKey, loadPlan, longDate, shortDate, startOfWeek, usePlan, type ActivityId, type PlanEvent } from "../learningPlan";

type StudentTab = "hoy" | "calendario" | "progreso" | "practicar";

function tabFromUrl(): StudentTab {
  const requested = new URLSearchParams(window.location.search).get("vista");
  return requested === "calendario" || requested === "progreso" || requested === "practicar" ? requested : "hoy";
}

function activityFromUrl(): ActivityId {
  const requested = new URLSearchParams(window.location.search).get("actividad");
  return requested && requested in activities ? requested as ActivityId : "equivalencias";
}

function useFocusSound() {
  const audio = useRef<AudioContext | null>(null);
  const timer = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const stop = () => { if (timer.current !== null) window.clearInterval(timer.current); timer.current = null; if (audio.current) void audio.current.close(); audio.current = null; setPlaying(false); };
  useEffect(() => () => { if (timer.current !== null) window.clearInterval(timer.current); if (audio.current) void audio.current.close(); }, []);
  const toggle = () => {
    if (playing) { stop(); return; }
    const context = new AudioContext(); audio.current = context;
    let bar = 0;
    const chords = [[174.61, 261.63, 349.23], [196, 293.66, 392], [164.81, 246.94, 329.63], [174.61, 261.63, 349.23]];
    const phrase = () => { const start = context.currentTime; for (const [index, frequency] of chords[bar % chords.length].entries()) { const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.type = "sine"; oscillator.frequency.value = frequency; oscillator.connect(gain).connect(context.destination); gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(index === 0 ? 0.028 : 0.013, start + 1.2); gain.gain.setValueAtTime(index === 0 ? 0.028 : 0.013, start + 6); gain.gain.linearRampToValueAtTime(0, start + 7.8); oscillator.start(start); oscillator.stop(start + 8); } bar += 1; };
    phrase(); timer.current = window.setInterval(phrase, 8000); setPlaying(true);
  };
  return { playing, toggle };
}

function WeekAgenda({ events, onSelect }: { events: PlanEvent[]; onSelect: (date: string) => void }) {
  const monday = startOfWeek(new Date());
  const end = dateKey(addDays(monday, 6));
  const week = events.filter((event) => event.date >= dateKey(monday) && event.date <= end);
  return <div className="v4-agenda">
    {week.length ? week.map((event) => <button type="button" key={event.id} onClick={() => onSelect(event.date)}>
      <time dateTime={event.date}>{shortDate(event.date)}</time>
      <span><strong>{event.title}</strong><small>{kindLabel(event.kind)} · {event.topic}</small></span>
      <ArrowRight size={17}/>
    </button>) : <p>No hay actividades esta semana. Consulta el calendario para ver lo que sigue.</p>}
  </div>;
}

export default function LearnAppV4() {
  const [tab, setTab] = useState<StudentTab>(tabFromUrl);
  const [selectedDate, setSelectedDate] = useState(() => loadPlan().find((event) => event.date >= dateKey(new Date()))?.date || dateKey(new Date()));
  const [activityId, setActivityId] = useState<ActivityId>(activityFromUrl);
  const [evidence, setEvidence] = useState<EvidenceMap>(readEvidence);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const { playing, toggle } = useFocusSound();
  const events = usePlan();
  const today = dateKey(new Date());
  const upcoming = useMemo(() => events.filter((event) => event.date >= today), [events, today]);
  const nextActivity = upcoming.find((event) => event.kind !== "prueba");
  const nextExam = upcoming.find((event) => event.kind === "prueba");
  const featuredActivity = activityForEvent(nextActivity);
  const currentActivity = activities[activityId];
  const nav: NavItem<StudentTab>[] = [
    { key: "hoy", label: "Hoy", icon: <House size={18}/> },
    { key: "calendario", label: "Calendario", icon: <CalendarDays size={18}/> },
    { key: "progreso", label: "Mi aprendizaje", icon: <ChartLine size={18}/> },
    { key: "practicar", label: "Practicar", icon: <PenLine size={18}/> }
  ];

  const navigate = (next: StudentTab, nextActivityId?: ActivityId) => {
    setTab(next);
    if (nextActivityId) setActivityId(nextActivityId);
    const url = new URL(window.location.href);
    if (next === "hoy") url.searchParams.delete("vista"); else url.searchParams.set("vista", next);
    if (next === "practicar") url.searchParams.set("actividad", nextActivityId || activityId); else url.searchParams.delete("actividad");
    window.history.pushState({}, "", url);
  };
  const goToDate = (date: string) => { setSelectedDate(date); navigate("calendario"); };
  useEffect(() => { const refresh = () => setEvidence(readEvidence()); window.addEventListener(evidenceUpdateEvent(), refresh); window.addEventListener("storage", refresh); return () => { window.removeEventListener(evidenceUpdateEvent(), refresh); window.removeEventListener("storage", refresh); }; }, []);
  useEffect(() => { const sync = () => { setTab(tabFromUrl()); setActivityId(activityFromUrl()); }; window.addEventListener("popstate", sync); return () => window.removeEventListener("popstate", sync); }, []);
  useEffect(() => { if (!import.meta.env.PROD) return; fetch("/api/config", { headers: { accept: "application/json" } }).then((response) => response.json()).then((data: { rollout?: { musica?: boolean } }) => { if (data.rollout?.musica === false) setMusicEnabled(false); }).catch(() => {}); }, []);
  const footer = musicEnabled ? <button type="button" className="p-focus-control" onClick={toggle} aria-label={playing ? "Pausar música de enfoque" : "Activar música opcional"}><Headphones size={17}/><span><strong>Sonido opcional</strong><small>{playing ? "Reproduciendo" : "Silencio por defecto"}</small></span>{playing ? <Pause size={15}/> : <Play size={15}/>}</button> : null;

  return <div className="premium-app v4-app v4-student"><WorkspaceShell product="Aprende" eyebrow="ESPACIO ESTUDIANTE" nav={nav} active={tab} onNavigate={navigate} switchHref="/familia" switchLabel="Espacio familia" footer={footer}>
    {tab === "hoy" && <>
      <div className="v4-page-intro"><div><h1>Tu siguiente idea</h1><p>{longDate(today)} · Matemática, 5.º básico</p></div><button type="button" className="v4-secondary" onClick={() => navigate("calendario")}><CalendarDays size={17}/> Abrir calendario</button></div>
      {nextActivity && <div className="v4-today-context"><BookOpen size={17}/><span>{nextActivity.date === today ? "Programado para hoy" : `Programado para el ${shortDate(nextActivity.date)}`}: <strong>{nextActivity.title}</strong></span>{nextExam && <button type="button" onClick={() => goToDate(nextExam.date)}>Prueba {shortDate(nextExam.date)} <ArrowRight size={15}/></button>}</div>}
      {featuredActivity ? <LearningSession key={featuredActivity.id} activity={featuredActivity} embedded onBack={() => navigate("hoy")} onProgress={() => navigate("progreso")}/> : <section className="v4-no-session"><h2>{nextActivity?.title || "Tu plan está al día"}</h2><p>{nextActivity?.detail || "Abre el calendario para explorar próximas actividades."}</p><p>Esta actividad aún no tiene una práctica interactiva. Revisa el contenido y la preparación indicados por el docente.</p><button type="button" className="v4-primary" onClick={() => nextActivity ? goToDate(nextActivity.date) : navigate("calendario")}>Ver la planificación <ArrowRight size={17}/></button></section>}
      <div className="v4-home-below"><section><div className="v4-section-head"><h2>Esta semana</h2><button type="button" onClick={() => navigate("calendario")}>Ver todo el mes <ArrowRight size={16}/></button></div><WeekAgenda events={events} onSelect={goToDate}/></section><section className="v4-next-test"><span>PRÓXIMA EVALUACIÓN</span>{nextExam ? <><h2>{nextExam.title}</h2><strong>{longDate(nextExam.date)}</strong><p>{nextExam.detail}</p><button type="button" onClick={() => goToDate(nextExam.date)}>Qué estudiar y cómo prepararte <ArrowRight size={16}/></button></> : <p>Tu docente aún no ha programado una prueba.</p>}</section></div>
    </>}

    {tab === "calendario" && <>
      <div className="v4-page-intro"><div><h1>Tu calendario</h1><p>En cada fecha encontrarás el contenido y la forma de prepararte.</p></div></div>
      <section className="v4-mobile-week"><div className="v4-section-head"><h2>Esta semana</h2></div><WeekAgenda events={events} onSelect={setSelectedDate}/></section>
      <div className="p-calendar-layout"><CalendarBoard events={events} selected={selectedDate} onSelect={setSelectedDate}/><EventInspector selected={selectedDate} events={events}/></div>
    </>}

    {tab === "progreso" && <>
      <div className="v4-page-intro"><div><h1>Mi aprendizaje</h1><p>Lo que intentaste, lo que aplicaste y tu siguiente paso.</p></div></div>
      <div className="v4-evidence-intro"><Check size={19}/><p>Una práctica completada muestra actividad, no dominio. Tu explicación no se evalúa automáticamente. Estas señales se guardan solo en este navegador.</p></div>
      <div className="v4-learning-list">{Object.values(activities).map((activity) => { const item = evidence[activity.id]; return <article key={activity.id}><div><span className="v4-learning-subject">MATEMÁTICA · FRACCIONES</span><h2>{activity.title}</h2><p>{activity.goal}</p></div><div className="v4-evidence-states"><span className={item?.represented ? "is-achieved" : ""}>{item?.represented ? "✓" : "○"} Representado</span><span className={item?.applied ? "is-achieved" : ""}>{item?.applied ? "✓" : "○"} Aplicado en otro caso</span><small>{item?.applied ? "Practicado; falta comprobar retención" : item?.represented ? "Sigue con un caso nuevo" : "Por comenzar"}</small></div><button type="button" className="v4-secondary" onClick={() => navigate("practicar", activity.id)}>{item?.applied ? "Repetir" : "Practicar"} <ArrowRight size={16}/></button></article>; })}</div>
    </>}

    {tab === "practicar" && <>
      <div className="v4-page-intro"><div><h1>Practicar</h1><p>Elige una idea, constrúyela y aplícala en otro caso.</p></div></div>
      <div className="v4-activity-picker" role="group" aria-label="Elegir actividad">{Object.values(activities).map((activity) => <button type="button" key={activity.id} className={activity.id === activityId ? "is-active" : ""} aria-pressed={activity.id === activityId} onClick={() => navigate("practicar", activity.id)}>{activity.title}</button>)}</div>
      <LearningSession key={currentActivity.id} activity={currentActivity} onBack={() => navigate("hoy")} onProgress={() => navigate("progreso")}/>
    </>}
  </WorkspaceShell></div>;
}
