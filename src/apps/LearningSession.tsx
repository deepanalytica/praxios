import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { readEvidence, representationIsCorrect, saveEvidence, transferIsCorrect, type LearningActivity } from "../learningActivities";

type Stage = "build" | "explain" | "transfer" | "done";

function FractionBar({ numerator, denominator, interactive = false, selected = [], onToggle }: {
  numerator?: number;
  denominator: number;
  interactive?: boolean;
  selected?: boolean[];
  onToggle?: (index: number) => void;
}) {
  return <div className={`v4-fraction-bar ${interactive ? "is-interactive" : ""}`} role={interactive ? "group" : undefined} aria-label={interactive ? `Barra dividida en ${denominator} partes iguales` : undefined}>
    {Array.from({ length: denominator }, (_, index) => interactive
      ? <button key={index} type="button" className={selected[index] ? "is-filled" : ""} onClick={() => onToggle?.(index)} aria-label={`Parte ${index + 1} de ${denominator}`} aria-pressed={!!selected[index]} />
      : <span key={index} className={index < (numerator || 0) ? "is-filled" : ""} />
    )}
  </div>;
}

export default function LearningSession({ activity, onBack, onProgress, embedded = false }: {
  activity: LearningActivity;
  onBack: () => void;
  onProgress: () => void;
  embedded?: boolean;
}) {
  const [stage, setStage] = useState<Stage>("build");
  const [segments, setSegments] = useState<boolean[]>(() => Array(activity.denominator).fill(false));
  const [explanation, setExplanation] = useState("");
  const [transferAnswer, setTransferAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const selectedCount = segments.filter(Boolean).length;
  const toggleSegment = (index: number) => setSegments((current) => current.map((value, item) => item === index ? !value : value));
  const checkBuild = () => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    saveEvidence(activity.id, { attempts: (readEvidence()[activity.id]?.attempts || 0) + 1 });
    if (!representationIsCorrect(activity, selectedCount)) { setMessage(activity.hint); return; }
    saveEvidence(activity.id, { represented: true });
    setMessage(""); setStage("explain");
  };
  const continueToTransfer = () => {
    if (explanation.trim().length < 15) { setMessage("Escribe una idea más completa antes de continuar. Nadie evaluará automáticamente tu explicación."); return; }
    saveEvidence(activity.id, { explanationWritten: true });
    setMessage(""); setStage("transfer");
  };
  const checkTransfer = () => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    saveEvidence(activity.id, { attempts: (readEvidence()[activity.id]?.attempts || 0) + 1 });
    if (!transferIsCorrect(activity, transferAnswer)) { setMessage(activity.transfer.hint); return; }
    saveEvidence(activity.id, { applied: true });
    setMessage(""); setStage("done");
  };

  return <section className="v4-session" aria-label={`Práctica: ${activity.title}`}>
    <div className="v4-session-header">
      {embedded ? <span className="v4-session-position">SIGUIENTE SESIÓN</span> : <button type="button" className="v4-back" onClick={onBack}><ArrowLeft size={18}/> Volver a Hoy</button>}
      <span className="v4-session-position">{stage === "done" ? "Práctica realizada" : `${stage === "build" ? 1 : stage === "explain" ? 2 : 3} de 3 pasos`}</span>
    </div>
    <div className="v4-session-layout">
      <div className="v4-session-work">
        <div className="v4-step-track" aria-label="Etapas de la práctica">
          {(["Construir", "Explicar", "Aplicar"] as const).map((label, index) => <span key={label} className={index <= (stage === "build" ? 0 : stage === "explain" ? 1 : 2) ? "is-current" : ""}>{label}</span>)}
        </div>
        <h1>{stage === "done" ? "Una idea más clara." : activity.title}</h1>
        <p className="v4-session-goal">{activity.goal}</p>

        {stage === "build" && <div className="v4-task">
          <p className="v4-task-label">OBSERVA</p>
          <p>{activity.context}</p>
          <div className="v4-reference-row">{activity.reference.map((reference) => <div className="v4-reference" key={reference.label}><FractionBar numerator={reference.numerator} denominator={reference.denominator}/><strong>{reference.label}</strong></div>)}</div>
          <p className="v4-task-label">AHORA PRUEBA TÚ</p>
          <h2>{activity.task}</h2>
          <FractionBar denominator={activity.denominator} interactive selected={segments} onToggle={toggleSegment}/>
          <div className="v4-build-footer"><span>{selectedCount} de {activity.denominator} partes elegidas</span><button type="button" className="v4-primary" onClick={checkBuild} disabled={selectedCount === 0}>Comprobar representación <ArrowRight size={17}/></button></div>
        </div>}

        {stage === "explain" && <div className="v4-task">
          <div className="v4-success-inline"><Check size={19}/> Representaste la cantidad correctamente.</div>
          <h2>{activity.explain}</h2>
          <label className="v4-writing-label" htmlFor="v4-explanation">Explica con tus palabras</label>
          <textarea id="v4-explanation" rows={5} value={explanation} onChange={(event) => setExplanation(event.target.value)} placeholder="Creo que… porque…" />
          <p className="v4-fine-print">Tu texto permanece en este dispositivo. La demo registra que escribiste una explicación, pero no puede juzgar si es correcta.</p>
          <button type="button" className="v4-primary" onClick={continueToTransfer}>Comparar y seguir <ArrowRight size={17}/></button>
        </div>}

        {stage === "transfer" && <div className="v4-task">
          <p className="v4-task-label">COMPARA TU EXPLICACIÓN</p>
          <p className="v4-model">{activity.model}</p>
          <p className="v4-task-label">AHORA EN OTRO CASO</p>
          <h2>{activity.transfer.question}</h2>
          <div className="v4-options" role="group" aria-label="Elige una respuesta">{activity.transfer.options.map((option) => <button type="button" key={option} className={transferAnswer === option ? "is-selected" : ""} aria-pressed={transferAnswer === option} onClick={() => { setTransferAnswer(option); setMessage(""); }}>{option}</button>)}</div>
          <button type="button" className="v4-primary" disabled={!transferAnswer} onClick={checkTransfer}>Comprobar otro caso <ArrowRight size={17}/></button>
        </div>}

        {stage === "done" && <div className="v4-task v4-done">
          <div className="v4-done-mark"><Check size={28}/></div>
          <h2>Construiste una representación y resolviste un caso nuevo.</h2>
          <p>{activity.transfer.explanation}</p>
          <p className="v4-fine-print">Esto registra una práctica con aplicación. Para hablar de dominio todavía hacen falta más problemas y una comprobación días después.</p>
          <div className="v4-done-actions"><button type="button" className="v4-primary" onClick={onProgress}>Ver mi aprendizaje <ArrowRight size={17}/></button><button type="button" className="v4-secondary" onClick={() => { setStage("build"); setSegments(Array(activity.denominator).fill(false)); setExplanation(""); setTransferAnswer(""); setMessage(""); }}><RotateCcw size={16}/> Volver a practicar</button></div>
        </div>}
        {message && <p className="v4-feedback" role="status">{message}</p>}
      </div>
      <aside className="v4-session-side" aria-label="Objetivo de esta práctica">
        <span className="v4-side-label">TU OBJETIVO</span>
        <h2>Aprender haciendo.</h2>
        <ol><li className={stage !== "build" ? "is-done" : ""}>Construir la cantidad</li><li className={stage === "transfer" || stage === "done" ? "is-done" : ""}>Explicar tu idea</li><li className={stage === "done" ? "is-done" : ""}>Aplicarla en otro caso</li></ol>
        <p>Una pista te ayuda a pensar. Puedes corregir tu respuesta y volver a intentar.</p>
      </aside>
    </div>
  </section>;
}
