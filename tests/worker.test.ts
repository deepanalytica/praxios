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
