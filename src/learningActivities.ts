import type { ActivityId, PlanEvent } from "./learningPlan";

export type LearningActivity = {
  id: ActivityId;
  title: string;
  goal: string;
  context: string;
  reference: Array<{ numerator: number; denominator: number; label: string }>;
  task: string;
  denominator: number;
  correctSegments: number;
  targetLabel: string;
  hint: string;
  explain: string;
  model: string;
  transfer: {
    question: string;
    options: string[];
    answer: string;
    hint: string;
    explanation: string;
  };
};

export const activities: Record<ActivityId, LearningActivity> = {
  partes: {
    id: "partes",
    title: "Las partes de un todo",
    goal: "Representar tres cuartos y reconocer qué indica cada número.",
    context: "Una barra se divide en cuatro partes iguales.",
    reference: [{ numerator: 3, denominator: 4, label: "3/4" }],
    task: "Toca las partes necesarias para representar 3/4.",
    denominator: 4,
    correctSegments: 3,
    targetLabel: "3/4",
    hint: "El número de abajo indica cuántas partes iguales tiene la barra; el de arriba, cuántas eliges.",
    explain: "¿Qué significa el 3 y qué significa el 4 en tu barra?",
    model: "El 4 indica las cuatro partes iguales del todo. El 3 indica que elegí tres de esas partes.",
    transfer: {
      question: "Si un dibujo tiene ocho partes iguales y seis coloreadas, ¿qué fracción representa?",
      options: ["6/8", "8/6", "2/8"],
      answer: "6/8",
      hint: "Cuenta primero las partes del todo y luego las partes coloreadas.",
      explanation: "Son seis partes elegidas de un total de ocho partes iguales: 6/8."
    }
  },
  equivalencias: {
    id: "equivalencias",
    title: "Fracciones equivalentes",
    goal: "Mostrar por qué un medio y dos cuartos representan la misma cantidad.",
    context: "La barra de referencia tiene una de dos partes coloreada: 1/2.",
    reference: [{ numerator: 1, denominator: 2, label: "1/2" }],
    task: "Ahora divide el mismo todo en cuatro. Toca las partes que representan la misma cantidad.",
    denominator: 4,
    correctSegments: 2,
    targetLabel: "1/2",
    hint: "Cada mitad se puede partir en dos. ¿Cuántos cuartos quedan coloreados?",
    explain: "¿Por qué tu barra de cuartos representa lo mismo que 1/2?",
    model: "Al dividir cada mitad en dos partes, el todo tiene cuatro cuartos. La mitad coloreada ocupa dos de esos cuartos: 1/2 = 2/4.",
    transfer: {
      question: "En otro dibujo, el todo se divide en seis partes iguales. ¿Cuál representa 1/2?",
      options: ["2/6", "3/6", "4/6"],
      answer: "3/6",
      hint: "Busca la mitad de las seis partes.",
      explanation: "La mitad de seis partes son tres: 3/6 representa la misma cantidad que 1/2."
    }
  },
  suma: {
    id: "suma",
    title: "Sumar con igual denominador",
    goal: "Construir 1/4 + 2/4 con piezas y comprobar el resultado.",
    context: "Tienes un cuarto coloreado y agregas otros dos cuartos del mismo todo.",
    reference: [{ numerator: 1, denominator: 4, label: "1/4" }, { numerator: 2, denominator: 4, label: "2/4" }],
    task: "Toca las partes que quedan coloreadas en total.",
    denominator: 4,
    correctSegments: 3,
    targetLabel: "1/4 + 2/4",
    hint: "Las piezas tienen el mismo tamaño. Cuenta cuántos cuartos hay después de juntarlos.",
    explain: "¿Por qué el denominador sigue siendo cuatro?",
    model: "El todo sigue dividido en cuatro partes iguales. Junté una parte y dos partes: ahora hay tres cuartos, 3/4.",
    transfer: {
      question: "Si agregas 2/5 y 1/5 del mismo todo, ¿cuánto obtienes?",
      options: ["3/5", "3/10", "2/5"],
      answer: "3/5",
      hint: "El tamaño de cada pieza no cambia al juntar piezas del mismo todo.",
      explanation: "Dos quintos más un quinto son tres quintos: 3/5."
    }
  },
  ensayo: {
    id: "ensayo",
    title: "Ensayo de preparación",
    goal: "Resolver una equivalencia nueva antes de la prueba.",
    context: "La referencia muestra dos de tres partes coloreadas: 2/3.",
    reference: [{ numerator: 2, denominator: 3, label: "2/3" }],
    task: "Si cada tercio se divide en dos, toca las partes que representan la misma cantidad.",
    denominator: 6,
    correctSegments: 4,
    targetLabel: "2/3",
    hint: "Cada una de las dos partes coloreadas se divide en dos piezas más pequeñas.",
    explain: "¿Cómo sabes que la cantidad no cambió al dividir las partes?",
    model: "Solo cambié el tamaño de las piezas: cada tercio se dividió en dos. Cuatro de las seis piezas cubren los mismos dos tercios.",
    transfer: {
      question: "En la prueba aparece 1/4 + 2/4. ¿Cuál es el resultado?",
      options: ["3/4", "3/8", "2/4"],
      answer: "3/4",
      hint: "Las partes ya tienen el mismo tamaño. Cuenta las piezas reunidas.",
      explanation: "Un cuarto más dos cuartos son tres cuartos: 3/4."
    }
  }
};

export type ActivityEvidence = {
  represented: boolean;
  applied: boolean;
  explanationWritten: boolean;
  attempts: number;
  updatedAt: string;
};

export type EvidenceMap = Partial<Record<ActivityId, ActivityEvidence>>;

const evidenceKey = "educabot-evidence-v1";
const updateEvent = "educabot:evidence-updated";

export function activityForEvent(event: PlanEvent | undefined): LearningActivity | undefined {
  return event?.activityId ? activities[event.activityId] : undefined;
}

export function representationIsCorrect(activity: LearningActivity, selected: number): boolean {
  return selected === activity.correctSegments;
}

export function transferIsCorrect(activity: LearningActivity, answer: string): boolean {
  return answer === activity.transfer.answer;
}

export function readEvidence(): EvidenceMap {
  try {
    const saved = JSON.parse(localStorage.getItem(evidenceKey) || "{}");
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return {};
    return Object.fromEntries(Object.entries(saved).filter(([id, value]) =>
      id in activities && !!value && typeof value === "object" &&
      typeof (value as ActivityEvidence).represented === "boolean" &&
      typeof (value as ActivityEvidence).applied === "boolean" &&
      typeof (value as ActivityEvidence).attempts === "number"
    )) as EvidenceMap;
  } catch { return {}; }
}

export function saveEvidence(id: ActivityId, patch: Partial<ActivityEvidence>): void {
  const previous = readEvidence()[id];
  const next: ActivityEvidence = {
    represented: patch.represented ?? previous?.represented ?? false,
    applied: patch.applied ?? previous?.applied ?? false,
    explanationWritten: patch.explanationWritten ?? previous?.explanationWritten ?? false,
    attempts: patch.attempts ?? previous?.attempts ?? 0,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(evidenceKey, JSON.stringify({ ...readEvidence(), [id]: next }));
  window.dispatchEvent(new Event(updateEvent));
}

export function evidenceUpdateEvent(): string { return updateEvent; }
