import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, HeartHandshake, House } from "lucide-react";
import WorkspaceShell, { type NavItem } from "./WorkspaceShell";
import { CalendarBoard, EventInspector } from "./CalendarBoard";
import { evidenceUpdateEvent, readEvidence, type EvidenceMap } from "../learningActivities";
import { dateKey, loadPlan, longDate, usePlan } from "../learningPlan";

type FamilyTab = "resumen" | "calendario";

export default function FamilyApp() {
  const [tab, setTab] = useState<FamilyTab>(() => new URLSearchParams(window.location.search).get("vista") === "calendario" ? "calendario" : "resumen");
  const [selectedDate, setSelectedDate] = useState(() => loadPlan().find((event) => event.date >= dateKey(new Date()))?.date || dateKey(new Date()));
  const [evidence, setEvidence] = useState<EvidenceMap>(readEvidence);
  const events = usePlan();
  const nextExam = events.find((event) => event.kind === "prueba" && event.date >= dateKey(new Date()));
  const applied = Object.values(evidence).filter((item) => item?.applied).length;
  const nav: NavItem<FamilyTab>[] = [
    { key: "resumen", label: "Resumen", icon: <House size={18}/> },
    { key: "calendario", label: "Fechas", icon: <CalendarDays size={18}/> }
  ];
  const navigate = (next: FamilyTab) => { setTab(next); const url = new URL(window.location.href); if (next === "resumen") url.searchParams.delete("vista"); else url.searchParams.set("vista", next); window.history.pushState({}, "", url); };
  useEffect(() => { const refresh = () => setEvidence(readEvidence()); window.addEventListener(evidenceUpdateEvent(), refresh); window.addEventListener("storage", refresh); return () => { window.removeEventListener(evidenceUpdateEvent(), refresh); window.removeEventListener("storage", refresh); }; }, []);
  useEffect(() => { const sync = () => setTab(new URLSearchParams(window.location.search).get("vista") === "calendario" ? "calendario" : "resumen"); window.addEventListener("popstate", sync); return () => window.removeEventListener("popstate", sync); }, []);

  return <div className="premium-app v4-app v4-family"><WorkspaceShell product="Familia" eyebrow="ACOMPAÑAR SIN INVADIR" nav={nav} active={tab} onNavigate={navigate} switchHref="/" switchLabel="Volver a Educabot" footer={<p className="v4-family-sidebar-note">Esta vista muestra datos de ejemplo guardados en este navegador.</p>}>
    {tab === "resumen" && <>
      <div className="v4-page-intro"><div><h1>Acompañar el aprendizaje</h1><p>Una orientación breve para conversar y ayudar en casa.</p></div></div>
      <div className="v4-family-grid"><section className="v4-family-lead"><HeartHandshake size={30}/><h2>La mejor ayuda comienza con una pregunta.</h2><p>Esta semana el tema es fracciones. Pide que te muestre con dos dibujos por qué 1/2 y 2/4 representan la misma cantidad.</p><blockquote>«¿Cómo sabes que muestran lo mismo?»</blockquote></section><aside className="v4-family-milestones"><h2>Lo que viene</h2>{nextExam ? <><strong>{nextExam.title}</strong><time dateTime={nextExam.date}>{longDate(nextExam.date)}</time><p>{nextExam.detail}</p><button type="button" onClick={() => { setSelectedDate(nextExam.date); navigate("calendario"); }}>Ver preparación <ArrowRight size={16}/></button></> : <p>Sin pruebas próximas en este plan de ejemplo.</p>}</aside></div>
      <section className="v4-family-evidence"><h2>Actividad registrada</h2><p>{applied ? `Hay ${applied} ${applied === 1 ? "práctica aplicada" : "prácticas aplicadas"} en otro caso.` : "Todavía no hay prácticas aplicadas en otro caso."} Esto indica actividad; no permite afirmar dominio ni medir atención o concentración.</p></section>
      <p className="v4-family-privacy">La vista Familia no muestra las respuestas escritas ni las conversaciones del estudiante. En este prototipo no hay cuentas ni datos escolares conectados.</p>
    </>}
    {tab === "calendario" && <><div className="v4-page-intro"><div><h1>Fechas importantes</h1><p>Qué contenido se trabajará y cómo apoyar la preparación.</p></div></div><div className="p-calendar-layout"><CalendarBoard events={events} selected={selectedDate} onSelect={setSelectedDate}/><EventInspector selected={selectedDate} events={events}/></div></>}
  </WorkspaceShell></div>;
}
