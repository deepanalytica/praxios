import { useState } from "react";
import { ArrowUpRight, Eye, SearchCheck } from "lucide-react";
import type { CurriculumReference } from "../api";
import type { ClassPack } from "../data";

export type ReviewState = { curriculum: boolean; facts: boolean; suitability: boolean };
export const emptyReview: ReviewState = { curriculum: false, facts: false, suitability: false };

export default function PackReview({ pack, curriculum, review, onReview, sourceNote, onSourceNote }: {
  pack: ClassPack;
  curriculum: CurriculumReference | null;
  review: ReviewState;
  onReview: (next: ReviewState) => void;
  sourceNote: string;
  onSourceNote: (next: string) => void;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const checks: Array<{ key: keyof ReviewState; label: string; detail: string }> = [
    { key: "curriculum", label: "Objetivo curricular", detail: "Comprobé el OA y que esta actividad realmente lo trabaja." },
    { key: "facts", label: "Hechos y ejemplos", detail: "Revisé los cálculos, afirmaciones y respuestas esperadas." },
    { key: "suitability", label: "Mi curso", detail: "Revisé el lenguaje, el tiempo y la dificultad para mis estudiantes." }
  ];
  const count = checks.filter((check) => review[check.key]).length;

  return <section className="v4-pack-review" aria-label="Comprobación del borrador">
    <div className="v4-review-heading"><SearchCheck size={21}/><div><h3>Comprueba antes de programar</h3><p>{count} de 3 comprobaciones registradas por ti</p></div></div>
    <div className="v4-curriculum-source"><span>REFERENCIA CURRICULAR SUGERIDA</span><strong>{pack.oaCode} · {pack.oaLabel}</strong>{curriculum?.source ? <a href={curriculum.source} target="_blank" rel="noopener noreferrer">Abrir fuente curricular <ArrowUpRight size={15}/></a> : <p>El sistema no encontró una fuente para este borrador. Busca y registra la referencia que consultaste.</p>}</div>
    <div className="v4-check-list">{checks.map((check) => <label key={check.key}><input type="checkbox" checked={review[check.key]} onChange={(event) => onReview({ ...review, [check.key]: event.target.checked })}/><span><strong>{check.label}</strong><small>{check.detail}</small></span></label>)}</div>
    <label className="v4-source-note">Fuente o documento que consultaste<input value={sourceNote} onChange={(event) => onSourceNote(event.target.value)} placeholder="Ej. Currículum Nacional, MA05 OA 07"/><small>Este registro es una declaración docente; Educabot no puede verificar automáticamente todo el borrador.</small></label>
    <button type="button" className="v4-preview-toggle" aria-expanded={previewOpen} onClick={() => setPreviewOpen((open) => !open)}><Eye size={17}/>{previewOpen ? "Ocultar vista estudiante" : "Ver como estudiante"}</button>
    {previewOpen && <div className="v4-student-preview"><span>VISTA PREVIA · NO PUBLICADA</span><h4>{pack.title}</h4><p>{pack.goal}</p><strong>Primera actividad</strong><p>{pack.flow[0]?.copy || "Sin actividad inicial."}</p><strong>Para comprobar comprensión</strong><p>{pack.exitTicket[0] || "Sin ticket de salida."}</p></div>}
  </section>;
}
