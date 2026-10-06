import { describe, expect, it } from "vitest";
import worker from "../worker/index";
import type { ClassPack, ClassRequest } from "../src/data";

const base: ClassRequest = {
  course: "7° básico B",
  subject: "Ciencias Naturales",
  duration: "90 min",
  prompt: "Enseñar tectónica de placas y sismos",
  outputs: ["Planificación"]
};

const env = {
  ASSETS: { fetch: async () => new Response("", { status: 404 }) },
  AI_ENABLED: "true",
  AI: {
    run: async () => ({
      response: JSON.stringify({
        oaCode: "OA INVENTADO",
        oaLabel: "Objetivo no comprobado",
        trust: [{ state: "VERIFICADO", text: "Dato generado", detail: "Lo afirma el modelo" }]
      })
    })
  }
};

async function generate(input: ClassRequest) {
  const response = await worker.fetch(new Request("https://example.test/api/class-pack", {
    method: "POST",
    body: JSON.stringify(input)
  }), env);
  return response.json() as Promise<{ pack: ClassPack }>;
}

describe("Class-pack authority boundary", () => {
  it("serves a concrete local example without invoking AI when public AI is disabled", async () => {
    let invoked = false;
    const local = { ...env, AI_ENABLED: "false", AI: { run: async () => { invoked = true; throw new Error("Unexpected AI call"); } } };
    const response = await worker.fetch(new Request("https://example.test/api/class-pack", {
      method: "POST", body: JSON.stringify({ ...base, course: "5° básico A", subject: "Matemática", prompt: "Fracciones equivalentes" })
    }), local);
    const data = await response.json() as { pack: ClassPack; mode: string; curriculum: { source: string } };
    expect(response.status).toBe(200);
    expect(invoked).toBe(false);
    expect(data.mode).toBe("deterministic-fallback");
    expect(data.pack.oaCode).toBe("MA05 OA 07");
    expect(data.pack.flow.some((step) => step.copy.includes("2/4"))).toBe(true);
    expect(data.curriculum.source).toContain("ma05-oa-07");
  });

  it("rejects malformed and oversized input", async () => {
    const malformed = await worker.fetch(new Request("https://example.test/api/class-pack", { method: "POST", body: "{" }), env);
    expect(malformed.status).toBe(400);
    const oversized = await worker.fetch(new Request("https://example.test/api/class-pack", { method: "POST", body: JSON.stringify({ ...base, prompt: "x".repeat(3001) }) }), env);
    expect(oversized.status).toBe(413);
  });

  it("does not accept a model's invented OA or verified label", async () => {
    const { pack } = await generate({ ...base, course: "8° básico A" });
    expect(pack.oaCode).toBe("OA PENDIENTE");
    expect(pack.trust[0].state).toBe("CONJETURA_DECLARADA");
  });

  it("uses the curated OA without claiming the generated fact is verified", async () => {
    const { pack } = await generate(base);
    expect(pack.oaCode).toBe("CN07 OA 09");
    expect(pack.trust[0].state).toBe("CORROBORADO");
    expect(pack.trust[1].state).toBe("CONJETURA_DECLARADA");
  });
});

describe("Admin controls", () => {
  const makeEnv = () => {
    let stored: unknown = null;
    return {
      ASSETS: env.ASSETS,
      ADMIN_TOKEN: "test-secret",
      ADMIN_KV: {
        get: async () => stored,
        put: async (_key: string, value: string) => { stored = JSON.parse(value); }
      }
    };
  };

  it("rejects unauthenticated access and never returns the token", async () => {
    const local = makeEnv();
    const denied = await worker.fetch(new Request("https://example.test/api/admin/overview"), local);
    expect(denied.status).toBe(401);
    const authorized = await worker.fetch(new Request("https://example.test/api/admin/overview", { headers: { authorization: "Bearer test-secret" } }), local);
    expect(authorized.status).toBe(200);
    expect(await authorized.text()).not.toContain("test-secret");
  });

  it("validates and persists rollout flags", async () => {
    const local = makeEnv();
    const headers = { authorization: "Bearer test-secret", "content-type": "application/json" };
    const invalid = await worker.fetch(new Request("https://example.test/api/admin/flags", { method: "PUT", headers, body: JSON.stringify({ aprende: "false" }) }), local);
    expect(invalid.status).toBe(400);
    const changed = await worker.fetch(new Request("https://example.test/api/admin/flags", { method: "PUT", headers, body: JSON.stringify({ aprende: false }) }), local);
    expect(changed.status).toBe(200);
    const publicConfig = await worker.fetch(new Request("https://example.test/api/config"), local);
    const data = await publicConfig.json() as { rollout: { aprende: boolean; crea: boolean } };
    expect(data.rollout.aprende).toBe(false);
    expect(data.rollout.crea).toBe(true);
    await worker.fetch(new Request("https://example.test/api/admin/flags", { method: "PUT", headers, body: JSON.stringify({ crea: false }) }), local);
    const paused = await worker.fetch(new Request("https://example.test/api/class-pack", { method: "POST", body: JSON.stringify(base) }), local);
    expect(paused.status).toBe(503);
  });
});
