import type { ClassPack, ClassRequest, EpistemicState } from "../src/data";
import { fallbackPack } from "../src/data";

interface AiBinding {
  run(model: string, input: unknown): Promise<unknown>;
}

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  AI?: AiBinding;
  AI_MODEL?: string;
  ADMIN_TOKEN?: string;
  ADMIN_KV?: { get(key: string, type: "json"): Promise<unknown>; put(key: string, value: string): Promise<void> };
}

type Rollout = { aprende: boolean; crea: boolean; implementa: boolean; musica: boolean };
const defaultRollout: Rollout = { aprende: true, crea: true, implementa: true, musica: true };

async function readRollout(env: Env): Promise<Rollout> {
  if (!env.ADMIN_KV) return defaultRollout;
  const value = await env.ADMIN_KV.get("rollout", "json");
  if (!value || typeof value !== "object") return defaultRollout;
  const candidate = value as Partial<Rollout>;
  return Object.fromEntries(Object.entries(defaultRollout).map(([key, fallback]) => [key, typeof candidate[key as keyof Rollout] === "boolean" ? candidate[key as keyof Rollout] : fallback])) as Rollout;
}

function authorized(request: Request, env: Env): boolean {
  return !!env.ADMIN_TOKEN && request.headers.get("authorization") === `Bearer ${env.ADMIN_TOKEN}`;
}

async function admin(request: Request, env: Env, path: string): Promise<Response> {
  if (!env.ADMIN_TOKEN) return Response.json({ error: "admin_not_configured" }, { status: 503 });
  if (!authorized(request, env)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const headers = { "cache-control": "no-store" };
  if (path === "/api/admin/overview" && request.method === "GET") {
    return Response.json({
      generatedAt: new Date().toISOString(),
      services: { worker: "online", aiBinding: !!env.AI, rolloutStore: !!env.ADMIN_KV, assets: !!env.ASSETS },
      rollout: await readRollout(env),
      usage: null,
      cost: null,
      note: "Uso, costos, usuarios e incidentes requieren integraciones de telemetría. No se inventan métricas."
    }, { headers });
  }
  if (path === "/api/admin/flags" && request.method === "PUT") {
    if (!env.ADMIN_KV) return Response.json({ error: "rollout_store_not_configured" }, { status: 503, headers });
    let body: unknown;
    try { body = await request.json(); } catch { return Response.json({ error: "invalid_json" }, { status: 400, headers }); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return Response.json({ error: "invalid_flags" }, { status: 400, headers });
    const entries = Object.entries(body);
    if (!entries.length || entries.some(([key, value]) => !(key in defaultRollout) || typeof value !== "boolean")) return Response.json({ error: "invalid_flags" }, { status: 400, headers });
    const rollout = { ...(await readRollout(env)), ...body as Partial<Rollout> };
    await env.ADMIN_KV.put("rollout", JSON.stringify(rollout));
    return Response.json({ rollout }, { headers });
  }
  return Response.json({ error: "not_found" }, { status: 404, headers });
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
        // Una etiqueta generada por el modelo no constituye una comprobación.
        return {
          state: state === "SILENCIO" ? "SILENCIO" as const : "CONJETURA_DECLARADA" as const,
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

function curriculumContext(input: ClassRequest) {
  const q = input.prompt.toLowerCase();
  const course = input.course.trim();
  if (/^7(?:\D|$)/.test(course) && /ciencias?/i.test(input.subject) && /tect|sismo|placa|terrem/.test(q)) {
    return {
      oaCode: "CN07 OA 09",
      oaLabel: "Tectónica de placas, patrones de actividad geológica e interacción entre placas.",
      source: "https://www.curriculumnacional.cl/recursos/tectonica-placas"
    };
  }
  if (/^5(?:\D|$)/.test(course) && /matem/i.test(input.subject) && /fracci|equival/.test(q)) {
    return {
      oaCode: "MA05 OA 07",
      oaLabel: "Fracciones propias, representación, equivalencia y comparación.",
      source: "https://www.curriculumnacional.cl/curriculum/1o-6o-basico/matematica/5-basico/ma05-oa-07"
    };
  }
  return null;
}

async function classPack(request: Request, env: Env): Promise<Response> {
  const input = await request.json() as ClassRequest;
  if (!input.prompt?.trim()) {
    return Response.json({ error: "prompt_required" }, { status: 400 });
  }

  const curriculum = curriculumContext(input);

  if (!env.AI) {
    return Response.json({ pack: fallbackPack(input), mode: "deterministic-fallback", curriculum });
  }

  const system = [
    "Eres el motor de planificación de Educabot, un sistema de apoyo docente.",
    "No eres un chatbot generalista: debes devolver un paquete de clase estructurado y revisable.",
    "Diseña con esta secuencia: nombrar, observar, encontrar el invariante, conjeturar explícitamente, verificar donde sea posible, unificar, simplificar sin perder verdad, conservar el proceso y declarar la frontera.",
    "Nunca inventes un código de objetivo de aprendizaje. Usa únicamente el OA incluido en curriculumContext. Si no existe, usa OA PENDIENTE.",
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
          { role: "user", content: JSON.stringify({ input, curriculumContext: curriculum }) }
        ],
        temperature: 0.35,
        max_tokens: 2600
      }
    );
    const parsed = parseJson(raw) as Partial<ClassPack>;
    const normalized = normalizePack(parsed, input);
    if (!curriculum) {
      normalized.oaCode = "OA PENDIENTE";
      normalized.oaLabel = "La alineación exacta debe revisarse contra el currículo oficial antes de asignar.";
    }
    if (curriculum) {
      normalized.oaCode = curriculum.oaCode;
      normalized.oaLabel = curriculum.oaLabel;
      normalized.trust = [
        {
          state: "CORROBORADO",
          text: "Referencia curricular sugerida",
          detail: `OA del catálogo oficial (${curriculum.source}); revisar si la actividad realmente lo cubre.`
        },
        ...normalized.trust.filter((item) => item.text !== "Alineación curricular" && item.text !== "Referencia curricular sugerida")
      ];
    }
    return Response.json({ pack: normalized, mode: "ai-assisted", curriculum });
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
      if (!(await readRollout(env)).crea) return Response.json({ error: "create_paused" }, { status: 503 });
      return classPack(request, env);
    }
    if (url.pathname === "/api/health") {
      return Response.json({ ok: true, product: "Educabot", checkedAt: new Date().toISOString() }, { headers: { "cache-control": "no-store" } });
    }
    if (url.pathname.startsWith("/api/admin/")) return admin(request, env, url.pathname);
    if (url.pathname === "/api/config" && request.method === "GET") return Response.json({ rollout: await readRollout(env) }, { headers: { "cache-control": "no-store" } });
    return env.ASSETS.fetch(request);
  }
};
