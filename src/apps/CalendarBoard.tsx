import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { dateKey, fromDateKey, longDate, monthTitle, startOfWeek, type PlanEvent, type PlanKind } from "../learningPlan";

export function kindLabel(kind: PlanKind): string {
  return kind === "prueba" ? "Prueba" : kind === "practica" ? "Práctica" : "Clase";
}

export function CalendarBoard({ events, selected, onSelect }: { events: PlanEvent[]; selected: string; onSelect: (date: string) => void }) {
  const [month, setMonth] = useState(() => fromDateKey(selected));
  useEffect(() => { setMonth(fromDateKey(selected)); }, [selected]);
  const cells = useMemo(() => {
    const first = startOfWeek(new Date(month.getFullYear(), month.getMonth(), 1));
    return Array.from({ length: 42 }, (_, index) => new Date(first.getFullYear(), first.getMonth(), first.getDate() + index));
  }, [month]);
  const move = (amount: number) => setMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  const today = dateKey(new Date());
  return <section className="p-calendar" aria-label="Calendario de aprendizaje"><div className="p-calendar-head"><div><span className="p-kicker">PLAN DE APRENDIZAJE</span><h2>{monthTitle(month)}</h2></div><div className="p-calendar-controls"><button onClick={() => move(-1)} aria-label="Mes anterior"><ChevronLeft size={18}/></button><button onClick={() => setMonth(new Date())}>Hoy</button><button onClick={() => move(1)} aria-label="Mes siguiente"><ChevronRight size={18}/></button></div></div><div className="p-calendar-weekdays">{["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"].map((day) => <span key={day}>{day}</span>)}</div><div className="p-calendar-grid">{cells.map((date) => { const key = dateKey(date); const items = events.filter((event) => event.date === key); const inMonth = date.getMonth() === month.getMonth(); return <button key={key} className={`p-calendar-cell ${inMonth ? "" : "is-outside"} ${selected === key ? "is-selected" : ""} ${today === key ? "is-today" : ""}`} onClick={() => onSelect(key)} aria-label={`${longDate(key)}: ${items.length ? items.map((item) => item.title).join(", ") : "sin actividades"}`}><span className="p-date-num">{date.getDate()}</span><span className="p-cell-events">{items.slice(0, 2).map((item) => <span key={item.id} className={`p-event-chip p-kind-${item.kind}`}>{item.title}</span>)}{items.length > 2 && <span className="p-more-events">+{items.length - 2} más</span>}</span></button>; })}</div></section>;
}

export function EventInspector({ selected, events, teacher = false, onDelete }: { selected: string; events: PlanEvent[]; teacher?: boolean; onDelete?: (id: string) => void }) {
  const selectedEvents = events.filter((event) => event.date === selected);
  return <aside className="p-inspector"><div className="p-inspector-header"><span className="p-kicker">{teacher ? "PLANIFICACIÓN DEL DÍA" : "TU PLAN DEL DÍA"}</span><h3>{longDate(selected)}</h3><p>{selectedEvents.length ? `${selectedEvents.length} ${selectedEvents.length === 1 ? "actividad programada" : "actividades programadas"}` : "Sin actividades programadas"}</p></div>{selectedEvents.length ? selectedEvents.map((event) => <article className="p-inspector-event" key={event.id}><div className="p-inspector-top"><span className={`p-kind-label p-kind-${event.kind}`}>{kindLabel(event.kind)}</span>{event.origin === "docente" && <span className="p-origin">Añadido por docente</span>}</div><h4>{event.title}</h4><dl><dt>Qué aprender</dt><dd>{event.detail}</dd><dt>Cómo prepararte</dt><dd>{event.method}</dd></dl>{teacher && event.origin === "docente" && onDelete && <button className="p-text-button" onClick={() => onDelete(event.id)}>Quitar del plan</button>}</article>) : <div className="p-empty-day">Selecciona otra fecha o usa este día para repasar a tu ritmo.</div>}</aside>;
}
