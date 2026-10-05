import type { ClassPack, ClassRequest, EpistemicState } from "../src/data";
import { fallbackPack } from "../src/data";

interface AiBinding {
  run(model: string, input: unknown): Promise<unknown>;
}

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  AI?: AiBinding;
  AI_MODEL?: string;
}

const allowedStates = new Set<EpistemicState>([
  "VERIFICADO",
  "CORROBORADO",
  "CONJETURA_DECLARADA",
  "SILENCIO"
]);

function asText(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "response" in value) {
    return String((value as { response: unknown }).response);
  }
  return JSON.stringify(value);
}

function parseJson(value: unknown): unknown {
  const text = asText(value);
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("No JSON found");
  return JSON.parse(text.slice(start, end + 1));
}

function normalizePack(candidate: Partial<ClassPack>, input: ClassRequest): ClassPack {
  const base = fallbackPack(input);
  const trust = Array.isArray(candidate.trust)
    ? candidate.trust.map((item) => {
        const state = allowedStates.has(item.state as EpistemicState)
          ? (item.state as EpistemicState)
          : "CONJETURA_DECLARADA";
        // El modelo no puede elevar contenido generado a VERIFICADO.
        return {
          state: state === "VERIFICADO" ? "CORROBORADO" as const : state,
          text: String(item.text || "Afirmación generada"),
          detail: String(item.detail || "Requiere revisión e instrumentación.")
        };
      })
    : base.trust;

  return {
    title: String(candidate.title || base.title),
    meta: String(candidate.meta || base.meta),
    goal: String(candidate.goal || base.goal),
    oaCode: String(candidate.oaCode || base.oaCode),
    oaLabel: String(candidate.oaLabel || base.oaLabel),
    flow: Array.isArray(candidate.flow) && candidate.flow.length
      ? candidate.flow.slice(0, 8).map((x) => ({
          time: String(x.time || ""),
          name: String(x.name || "Etapa"),
          copy: String(x.copy || "")
        }))
      : base.flow,
    materials: Array.isArray(candidate.materials) && candidate.materials.length
      ? candidate.materials.slice(0, 10).map(String)
      : base.materials,
    trust,
    teacherNotes: Array.isArray(candidate.teacherNotes)
      ? candidate.teacherNotes.slice(0, 6).map(String)
      : base.teacherNotes,
    exitTicket: Array.isArray(candidate.exitTicket)
      ? candidate.exitTicket.slice(0, 6).map(String)
      : base.exitTicket
  };
}

async function classPack(request: Request, env: Env): Promise<Response> {
  const input = await request.json() as ClassRequest;
  if (!input.prompt?.trim()) {
    return Response.json({ error: "prompt_required" }, { status: 400 });
  }

  if (!env.AI) {
    return Response.json({ pack: fallbackPack(input), mode: "deterministic-fallback" });
  }

  const system = [
    "Eres el motor de planificación de Educabot, un sistema de apoyo docente.",
    "No eres un chatbot generalista: debes devolver un paquete de clase estructurado y revisable.",
    "Diseña con esta secuencia: nombrar, observar, encontrar el invariante, conjeturar explícitamente, verificar donde sea posible, unificar, simplificar sin perder verdad, conservar el proceso y declarar la frontera.",
    "Nunca inventes un código de objetivo de aprendizaje. Si el OA exacto no está en el contexto, usa OA PENDIENTE.",
    "Nunca marques como VERIFICADO un claim generado por ti. Usa CORROBORADO, CONJETURA_DECLARADA o SILENCIO.",
    "El profesor conserva la decisión final.",
    "Prioriza actividades donde el alumno observe, explique, reconstruya y transfiera; evita sustituir el trabajo cognitivo.",
    "Devuelve JSON puro con: title, meta, goal, oaCode, oaLabel, flow[{time,name,copy}], materials[], trust[{state,text,detail}], teacherNotes[], exitTicket[]."
  ].join("\n");

  try {
    const raw = await env.AI.run(
      env.AI_MODEL || "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
      {
        messages: [
          { role: "system", content: system },
          { role: "user", content: JSON.stringify(input) }
        ],
        temperature: 0.35,
        max_tokens: 2600
      }
    );
    const parsed = parseJson(raw) as Partial<ClassPack>;
    return Response.json({ pack: normalizePack(parsed, input), mode: "ai-assisted" });
  } catch (error) {
    return Response.json({
      pack: fallbackPack(input),
      mode: "deterministic-fallback",
      warning: String(error)
    });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/class-pack" && request.method === "POST") {
      return classPack(request, env);
    }
    if (url.pathname === "/api/health") {
      return Response.json({ ok: true, product: "Educabot" });
    }
    return env.ASSETS.fetch(request);
  }
};
