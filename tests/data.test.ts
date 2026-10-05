import { describe, expect, it } from "vitest";
import { fallbackPack, type ClassRequest } from "../src/data";

const base: ClassRequest = {
  course: "7° básico B",
  subject: "Ciencias Naturales",
  duration: "90 min",
  prompt: "",
  outputs: ["Planificación"]
};

describe("Educabot class-pack fallback", () => {
  it("uses the curated tectonics case when the request matches it", () => {
    const pack = fallbackPack({ ...base, prompt: "Quiero enseñar tectónica de placas y sismos en Chile" });
    expect(pack.oaCode).toBe("CN07 OA 09");
    expect(pack.flow.length).toBeGreaterThan(4);
  });

  it("does not invent an OA outside the curated prototype catalog", () => {
    const pack = fallbackPack({ ...base, subject: "Lengua y Literatura", prompt: "Quiero trabajar poesía chilena contemporánea" });
    expect(pack.oaCode).toBe("OA PENDIENTE");
    expect(pack.trust.some((item) => item.state === "CONJETURA_DECLARADA")).toBe(true);
  });

  it("does not assign the tectonics OA to a different course or subject", () => {
    const prompt = "Quiero enseñar tectónica de placas y sismos en Chile";
    expect(fallbackPack({ ...base, course: "5° básico A", prompt }).oaCode).toBe("OA PENDIENTE");
    expect(fallbackPack({ ...base, subject: "Matemática", prompt }).oaCode).toBe("OA PENDIENTE");
  });

  it("does not label demo curriculum alignment as verified", () => {
    const pack = fallbackPack({ ...base, prompt: "Quiero enseñar tectónica de placas" });
    expect(pack.trust.some((item) => item.state === "VERIFICADO")).toBe(false);
  });

  it("preserves requested output artifacts", () => {
    const pack = fallbackPack({ ...base, prompt: "Quiero enseñar un tema nuevo", outputs: ["Presentación", "Guía alumno"] });
    expect(pack.materials).toContain("Presentación");
    expect(pack.materials).toContain("Guía alumno");
  });
});
