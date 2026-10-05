import { useState } from "react";
import { ArrowRight, CheckCircle2, Download, FileText, SearchCheck, Sparkles, WandSparkles } from "lucide-react";
import { AppHeader } from "../App";
import { generateClassPackResult } from "../api";
import { defaultClassPack, defaultClassRequest, type ClassPack, type ClassRequest } from "../data";

function downloadPack(pack: ClassPack) {
  const text = `# ${pack.title}\n\n${pack.meta}\n\n## Objetivo\n${pack.goal}\n\n## Secuencia\n${pack.flow.map((step) => `- ${step.time} · ${step.name}: ${step.copy}`).join("\n")}\n\n## Materiales\n${pack.materials.map((item) => `- ${item}`).join("\n")}\n\n## Ticket de salida\n${pack.exitTicket.map((item) => `- ${item}`).join("\n")}\n\n## Revisión necesaria\nRevisa todas las afirmaciones, la alineación curricular y el contexto del curso antes de usar este material.`;
  const url = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
  const a = document.createElement("a"); a.href = url; a.download = "educabot-clase.md"; a.click(); URL.revokeObjectURL(url);
}

export default function CreateApp() {
  const [input, setInput] = useState<ClassRequest>(defaultClassRequest);
  const [pack, setPack] = useState<ClassPack>(defaultClassPack);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [mode, setMode] = useState<"ai-assisted" | "deterministic-fallback">("deterministic-fallback");
  const [reviewed, setReviewed] = useState(false);
  const [error, setError] = useState("");
  const update = (key: "course" | "subject" | "duration" | "prompt", value: string) => setInput((prev) => ({...prev, [key]: value}));
  const generate = async () => {
    setLoading(true); setError(""); setReviewed(false);
    try { const result = await generateClassPackResult(input); setPack(result.pack); setMode(result.mode); setGenerated(true); }
    catch { setError("No pudimos generar el borrador. Intenta de nuevo."); }
    finally { setLoading(false); }
  };
  return <div className="create-app"><AppHeader product="Crea"/><div className="workspace create-workspace"><div className="create-heading"><div><span className="eyebrow">TU TALLER DOCENTE</span><h1>De una idea de clase<br/><em>a un borrador útil.</em></h1><p>Genera una primera versión, revisa las afirmaciones y adapta la clase a tus estudiantes. Puedes comenzar por tu cuenta.</p></div><div className="teacher-badge"><Sparkles size={17}/> Diseñado para docentes independientes</div></div><div className="create-layout"><section className="builder-panel"><div className="step-label">01 / CUÉNTANOS QUÉ NECESITAS</div><h2>Prepara tu próxima clase</h2><div className="form-grid"><label>Curso<input value={input.course} onChange={(e) => update("course", e.target.value)}/></label><label>Asignatura<input value={input.subject} onChange={(e) => update("subject", e.target.value)}/></label><label>Duración<input value={input.duration} onChange={(e) => update("duration", e.target.value)}/></label></div><label className="wide-label">¿Qué quieres que comprendan?<textarea rows={5} value={input.prompt} onChange={(e) => update("prompt", e.target.value)}/></label><div className="output-hint"><FileText size={19}/><span>Secuencia de clase, materiales sugeridos y ticket de salida</span></div><button className="button button-dark generate-button" disabled={loading || !input.prompt.trim()} onClick={generate}><WandSparkles size={17}/>{loading ? "Preparando borrador…" : "Generar borrador"}</button>{error && <p role="alert" className="form-error">{error}</p>}</section><section className="pack-panel"><div className="step-label">02 / REVISA Y ADAPTA</div><div className="pack-heading"><div><span className="preview-label">{!generated ? "EJEMPLO DE BORRADOR" : mode === "ai-assisted" ? "BORRADOR ASISTIDO POR IA" : "BORRADOR DE DEMOSTRACIÓN"}</span><h2>{pack.title}</h2><p>{pack.meta}</p></div><span className="draft-pill">Borrador</span></div><div className="pack-goal"><span>OBJETIVO</span><p>{pack.goal}</p></div><div className="sequence"><h3>Secuencia de clase</h3>{pack.flow.slice(0,4).map((step, index) => <div className="sequence-item" key={`${step.time}-${index}`}><span>{step.time}</span><div><strong>{step.name}</strong><p>{step.copy}</p></div></div>)}</div><div className="review-box"><SearchCheck size={21}/><div><strong>Revisión docente obligatoria</strong><p>El modelo no verifica sus propias fuentes. Comprueba hechos, OA y adecuación al curso antes de usar el material.</p></div></div><label className="review-check"><input type="checkbox" checked={reviewed} onChange={(e) => setReviewed(e.target.checked)}/> Ya revisé el contenido y su pertinencia.</label><button className="download-button" disabled={!reviewed} onClick={() => downloadPack(pack)}><Download size={17}/> Descargar borrador <ArrowRight size={16}/></button></section></div><div className="create-bottom"><CheckCircle2 size={18}/><p>Una suscripción individual para crear y reutilizar materiales es la primera hipótesis comercial. La validaremos con docentes antes de fijar precio.</p></div></div></div>;
}
