export type Role = "docente" | "alumno" | "familia" | "centro";
export type EpistemicState = "VERIFICADO" | "CORROBORADO" | "CONJETURA_DECLARADA" | "SILENCIO";

export type TrustItem = {
  state: EpistemicState;
  text: string;
  detail: string;
};

export type ClassFlowItem = {
  time: string;
  name: string;
  copy: string;
};

export type ClassPack = {
  title: string;
  meta: string;
  goal: string;
  oaCode: string;
  oaLabel: string;
  flow: ClassFlowItem[];
  materials: string[];
  trust: TrustItem[];
  teacherNotes: string[];
  exitTicket: string[];
};

export type ClassRequest = {
  course: string;
  subject: string;
  duration: string;
  prompt: string;
  outputs: string[];
};

export const roleCopy: Record<Role, { label: string; desc: string }> = {
  docente: { label: "Docente", desc: "Diseña, asigna y decide." },
  alumno: { label: "Alumno", desc: "Aprende, practica y demuestra." },
  familia: { label: "Familia", desc: "Acompaña con señales útiles." },
  centro: { label: "Centro", desc: "Observa, anticipa e interviene." }
};

export const oa = [
  { code: "MA05 OA 07", title: "Fracciones propias y equivalencia", mastery: 82, state: "solid" },
  { code: "MA05 OA 08", title: "Fracciones impropias y números mixtos", mastery: 64, state: "learning" },
  { code: "MA05 OA 09", title: "Adición y sustracción de fracciones", mastery: 41, state: "risk" },
  { code: "CN07 OA 09", title: "Tectónica de placas", mastery: 76, state: "learning" }
];

export const euler = [
  ["01", "Nombrar", "Definir qué debe comprenderse."],
  ["02", "Observar", "Partir por casos visibles y concretos."],
  ["03", "Invariante", "Quitar lo accesorio y encontrar la estructura."],
  ["04", "Conjeturar", "Proponer sin disfrazar hipótesis de hechos."],
  ["05", "Verificar", "Probar donde ya conocemos la respuesta."],
  ["06", "Unificar", "Conectar con conocimientos previos."],
  ["07", "Simplificar", "La exposición más breve que no pierda verdad."],
  ["08", "Mostrar proceso", "Conservar errores, andamios y decisiones."],
  ["09", "Frontera", "Declarar qué todavía no sabemos."]
];

export const defaultClassRequest: ClassRequest = {
  course: "7° básico B",
  subject: "Ciencias Naturales",
  duration: "90 min",
  prompt: "Mañana quiero enseñar tectónica de placas. A este curso le cuesta trabajar con modelos abstractos y quiero que comprendan por qué Chile concentra tanta actividad sísmica.",
  outputs: ["Planificación", "Presentación", "Guía alumno", "Ticket de salida"]
};

export const defaultClassPack: ClassPack = {
  title: "Chile sobre un borde activo",
  meta: "7° básico B · Ciencias Naturales · 90 min",
  goal: "Construir un modelo causal sencillo que conecte interacción de placas, deformación y actividad sísmica, y usarlo para explicar un patrón nuevo.",
  oaCode: "CN07 OA 09",
  oaLabel: "Tectónica de placas, patrones de actividad geológica e interacción entre placas.",
  flow: [
    { time: "0–8 min", name: "Observar antes de explicar", copy: "Mapa de sismos: el curso identifica el patrón espacial sin recibir todavía la explicación." },
    { time: "8–22 min", name: "Construir el modelo", copy: "Micromundo visual de convergencia y subducción con pocas variables y lenguaje explícito." },
    { time: "22–45 min", name: "Explicación en parejas", copy: "Cada pareja reconstruye el modelo con flechas, causas y una restricción: no puede usar la palabra “porque” sin completar el mecanismo." },
    { time: "45–65 min", name: "Tiburón de ideas", copy: "Dos explicaciones plausibles compiten. El curso intenta encontrar qué observación contradice a cada una." },
    { time: "65–82 min", name: "Transferencia", copy: "Aplicar el modelo a un caso nuevo y justificar qué elementos se conservan." },
    { time: "82–90 min", name: "Ticket de salida", copy: "Explicar el fenómeno en tres frases, dibujar una relación causal y declarar una duda abierta." }
  ],
  materials: [
    "Presentación · 11 láminas",
    "Guía alumno · 2 páginas",
    "Micromundo interactivo",
    "Ticket de salida",
    "Pauta docente",
    "Plan B sin internet"
  ],
  trust: [
    { state: "CORROBORADO", text: "Referencia curricular sugerida", detail: "OA del ejemplo curado para la demo; el docente debe revisar si la actividad realmente lo cubre." },
    { state: "CONJETURA_DECLARADA", text: "Explicación geológica principal", detail: "Ejemplo para la demo; falta contrastar sus afirmaciones con fuentes científicas antes de usarlo en clase." },
    { state: "SILENCIO", text: "Predicción exacta de próximos sismos", detail: "Bloqueada: la clase no tiene evidencia para sostener esa afirmación." }
  ],
  teacherNotes: [
    "No abrir con definiciones. Primero dejar que el curso vea el patrón.",
    "Preguntar qué observación obliga a cambiar de explicación.",
    "Si el micromundo falla, usar dos hojas rígidas y una espuma como representación física; declarar que es una analogía limitada."
  ],
  exitTicket: [
    "Explica por qué la actividad sísmica no está distribuida al azar.",
    "Dibuja una relación entre dos placas y marca dónde esperas mayor deformación.",
    "Escribe una pregunta que el modelo de hoy todavía no responda."
  ]
};

export const upcoming = [
  { date: "08 OCT", title: "Prueba de Ciencias", note: "reforzar subducción", level: "high" },
  { date: "10 OCT", title: "Guía Matemática", note: "fracciones equivalentes", level: "medium" },
  { date: "11 OCT", title: "Trabajo Historia", note: "al día", level: "low" }
];

export const teacherLibrary = [
  { type: "Clase", title: "Chile sobre un borde activo", meta: "7°B · Ciencias · actualizado hoy" },
  { type: "Guía", title: "Fracciones equivalentes sin memorizar la regla", meta: "5°A · Matemática · 2 páginas" },
  { type: "Experimento", title: "Densidad: predecir antes de medir", meta: "6° · Ciencias · reutilizable" },
  { type: "Video", title: "¿Por qué se producen las estaciones?", meta: "Storyboard aprobado · sin render" }
];

export const classPulse = [
  { name: "7°B", subject: "Ciencias", mastery: 68, risk: "Subducción", next: "OA 10" },
  { name: "5°A", subject: "Matemática", mastery: 74, risk: "Equivalencia", next: "OA 09" },
  { name: "6°B", subject: "Historia", mastery: 81, risk: "Sin alerta", next: "Unidad 4" }
];

export function fallbackPack(input: ClassRequest): ClassPack {
  const lower = input.prompt.toLowerCase();
  if (/^7(?:\D|$)/.test(input.course.trim()) && /ciencias?/i.test(input.subject) && /tect|sismo|placa|terrem/.test(lower)) {
    return {
      ...defaultClassPack,
      meta: `${input.course} · ${input.subject} · ${input.duration}`,
      materials: input.outputs.length ? [...input.outputs, "Pauta docente", "Plan B sin internet"] : defaultClassPack.materials
    };
  }
  return {
    title: "Clase lista para revisar",
    meta: `${input.course} · ${input.subject} · ${input.duration}`,
    goal: "Convertir el objetivo del docente en una secuencia que obligue a observar, explicar, practicar y transferir, sin confundir una respuesta fluida con comprensión.",
    oaCode: "OA PENDIENTE",
    oaLabel: "La alineación exacta debe resolverse contra el catálogo curricular antes de asignar.",
    flow: [
      { time: "0–10 min", name: "Diagnóstico breve", copy: "Un caso pequeño permite observar qué entiende ya el curso y dónde aparece la primera confusión." },
      { time: "10–30 min", name: "Modelo", copy: "Construir la representación mínima del concepto antes de entregar reglas o definiciones largas." },
      { time: "30–55 min", name: "Práctica guiada", copy: "Resolver un caso con apoyo decreciente y registrar el error conceptual si aparece." },
      { time: "55–75 min", name: "Transferencia", copy: "Aplicar la idea a un contexto distinto para evitar confundir reconocimiento con comprensión." },
      { time: "75–90 min", name: "Cierre", copy: "Reconstrucción breve, duda abierta y evidencia para decidir el siguiente paso." }
    ],
    materials: input.outputs.length ? input.outputs : ["Planificación", "Guía", "Ticket de salida"],
    trust: [
      { state: "CONJETURA_DECLARADA", text: "Alineación curricular", detail: "Pendiente de resolver contra el catálogo oficial cargado." },
      { state: "CORROBORADO", text: "Secuencia pedagógica", detail: "Propuesta de trabajo; requiere revisión docente antes de asignar." }
    ],
    teacherNotes: [
      "Revisar el OA exacto antes de asignar.",
      "Conservar al menos una instancia donde el alumno deba explicar sin ver la respuesta.",
      "Registrar el primer error conceptual repetido: puede ser más útil que una nota global."
    ],
    exitTicket: [
      "Explica la idea principal con tus propias palabras.",
      "Aplica la idea a un ejemplo nuevo.",
      "Escribe qué parte todavía no puedes justificar."
    ]
  };
}
