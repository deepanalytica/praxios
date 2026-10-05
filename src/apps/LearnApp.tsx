import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, ChevronRight, Headphones, Lightbulb, Pause, Play, RotateCcw, ShieldCheck, Sparkles, Volume2 } from "lucide-react";
import { AppHeader } from "../App";

type Answer = "" | "1/6" | "2/3" | "2/6";

function useFocusSound() {
  const audio = useRef<AudioContext | null>(null);
  const timer = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const stop = () => {
    if (timer.current !== null) window.clearInterval(timer.current);
    timer.current = null;
    if (audio.current) void audio.current.close();
    audio.current = null;
    setPlaying(false);
  };
  useEffect(() => () => { if (timer.current !== null) window.clearInterval(timer.current); if (audio.current) void audio.current.close(); }, []);
  const toggle = () => {
    if (playing) { stop(); return; }
    const context = new AudioContext();
    audio.current = context;
    let bar = 0;
    const chords = [[174.61, 261.63, 349.23], [196, 293.66, 392], [164.81, 246.94, 329.63], [174.61, 261.63, 349.23]];
    const phrase = () => {
      const start = context.currentTime;
      for (const [index, frequency] of chords[bar % chords.length].entries()) {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        oscillator.connect(gain).connect(context.destination);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(index === 0 ? 0.028 : 0.013, start + 1.2);
        gain.gain.setValueAtTime(index === 0 ? 0.028 : 0.013, start + 6);
        gain.gain.linearRampToValueAtTime(0, start + 7.8);
        oscillator.start(start);
        oscillator.stop(start + 8);
      }
      bar += 1;
    };
    phrase();
    timer.current = window.setInterval(phrase, 8000);
    setPlaying(true);
  };
  return { playing, toggle };
}

export default function LearnApp() {
  const [tab, setTab] = useState<"aprender" | "familia">("aprender");
  const [answer, setAnswer] = useState<Answer>("");
  const [reason, setReason] = useState("");
  const [checked, setChecked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const { playing, toggle } = useFocusSound();
  useEffect(() => { fetch("/api/config", { headers: { accept: "application/json" } }).then((response) => response.json()).then((data: { rollout?: { musica?: boolean } }) => { if (data.rollout?.musica === false) setMusicEnabled(false); }).catch(() => {}); }, []);
  const ready = !!answer && reason.trim().length >= 15;
  const correct = answer === "2/3";
  const check = () => { if (!ready) return; setChecked(true); if (correct) { localStorage.setItem("educabot-practica-fracciones", "completada"); setSaved(true); } };
  return <div className="learn-app"><AppHeader product="Aprende"/><div className="workspace learn-workspace"><div className="workspace-top"><div><span className="eyebrow">TU ESPACIO PARA ENTENDER</span><h1>Hoy, una idea<br/><em>a la vez.</em></h1><p>La IA te acompaña con preguntas y pistas. La respuesta y el razonamiento son tuyos.</p></div><div className="learn-spark" aria-hidden="true"><span>✳</span></div></div>
    <div className="segment-tabs" role="tablist" aria-label="Vistas de Aprende"><button role="tab" aria-selected={tab === "aprender"} className={tab === "aprender" ? "active" : ""} onClick={() => setTab("aprender")}>Para aprender</button><button role="tab" aria-selected={tab === "familia"} className={tab === "familia" ? "active" : ""} onClick={() => setTab("familia")}>Para mi familia</button></div>
    {tab === "aprender" ? <div className="learn-layout"><main className="practice-panel"><div className="panel-kicker"><span>MATEMÁTICA · 5º BÁSICO</span><span>DEMO INTERACTIVA</span></div><h2>¿Cuánto es un tercio<br/>más otro tercio?</h2><p className="muted">Imagina una barra dividida en tres partes iguales. Coloreas una parte, y luego otra.</p><div className="fraction-art" aria-label="Barra dividida en tres partes, dos coloreadas"><span/><span/><span/></div><div className="question-line">¿Qué fracción de la barra quedó coloreada?</div><div className="answers" role="group" aria-label="Elige una fracción">{(["1/6", "2/3", "2/6"] as Answer[]).map((value) => <button key={value} className={answer === value ? "selected" : ""} onClick={() => { setAnswer(value); setChecked(false); }}>{value}</button>)}</div><label className="reason-label" htmlFor="reason">Ahora explícalo con tus palabras</label><textarea id="reason" value={reason} onChange={(e) => {setReason(e.target.value); setChecked(false);}} placeholder="Creo que es… porque…" rows={3}/><div className="practice-footer"><span>Escribe al menos una frase para comprobar tu idea.</span><button className="button button-dark" disabled={!ready} onClick={check}>Comprobar mi idea <ArrowRight size={16}/></button></div>{checked && <div role="status" className={`feedback ${correct ? "feedback-good" : "feedback-try"}`}>{correct ? <><Check size={20}/> Elegiste 2/3. La barra muestra dos de tres partes iguales; compara esa idea con tu explicación.</> : <><RotateCcw size={20}/> Mira la barra otra vez. Cuenta cuántas partes iguales hay en total y cuántas están coloreadas. Luego vuelve a explicarlo.</>}</div>}</main><aside className="learn-aside"><div className="aside-block"><span className="aside-icon"><Lightbulb size={22}/></span><h3>Una pista, no la solución</h3><p>El denominador cuenta todas las partes iguales. El numerador, las que elegiste.</p><button onClick={() => document.getElementById("reason")?.focus()}>Probar mi explicación <ChevronRight size={15}/></button></div>{musicEnabled && <div className="aside-block sound-block"><span className="aside-icon"><Headphones size={22}/></span><h3>Ambiente de estudio</h3><p>Paisaje sonoro original, suave y sin letra. Tú eliges si te ayuda; también puedes estudiar en silencio.</p><button className="sound-toggle" onClick={toggle}>{playing ? <Pause size={16}/> : <Play size={16}/>} {playing ? "Pausar música" : "Escuchar música"}</button><span className="sound-note"><Volume2 size={14}/> Volumen bajo · Sin reproducción automática</span></div>}</aside></div> : <div className="family-layout"><div className="family-main"><span className="eyebrow">PARA ACOMPAÑAR, SIN INVADIR</span><h2>Preguntas mejores<br/>para estudiar juntos.</h2><p>La vista familiar muestra avance y sugerencias útiles. Las respuestas privadas y conversaciones del estudiante no aparecen aquí.</p><div className="family-progress"><span>Actividad de ejemplo</span><strong>Fracciones: partes iguales</strong><div className="progress-rule"><i style={{width: saved || localStorage.getItem("educabot-practica-fracciones") ? "100%" : "36%"}}/></div><small>{saved || localStorage.getItem("educabot-practica-fracciones") ? "Práctica completada en este navegador" : "Práctica por completar"}</small></div></div><div className="family-tip"><ShieldCheck size={25}/><h3>Prueba esta pregunta</h3><p>“¿Cómo sabes que son tercios y no sextos?” Escucha cómo lo explica antes de corregir.</p><span>DATOS LOCALES DE ESTA DEMO</span></div></div>}
    <div className="learn-bottom"><Sparkles size={18}/><span>En una versión real, el progreso se mediría con tareas repetidas, transferencia y revisión humana. Esta demo muestra solo una actividad.</span></div>
  </div></div>;
}
