import type { ClassPack, ClassRequest } from "./data";
import { curatedCurriculum, fallbackPack } from "./data";
export type { CurriculumReference } from "./data";
import type { CurriculumReference } from "./data";

export async function generateClassPackResult(input: ClassRequest): Promise<{ pack: ClassPack; mode: "ai-assisted" | "deterministic-fallback"; curriculum: CurriculumReference | null }> {
  if (!import.meta.env.PROD) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return { pack: fallbackPack(input), mode: "deterministic-fallback", curriculum: curatedCurriculum(input) };
  }
  try {
    const response = await fetch("/api/class-pack", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input)
    });
    if (!response.ok) throw new Error("class-pack backend unavailable");
    const data = await response.json() as { pack?: ClassPack; mode?: "ai-assisted" | "deterministic-fallback"; curriculum?: CurriculumReference | null };
    if (!data.pack) throw new Error("invalid class-pack response");
    return { pack: data.pack, mode: data.mode === "ai-assisted" ? "ai-assisted" : "deterministic-fallback", curriculum: data.curriculum || null };
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 550));
    return { pack: fallbackPack(input), mode: "deterministic-fallback", curriculum: curatedCurriculum(input) };
  }
}

export async function generateClassPack(input: ClassRequest): Promise<ClassPack> {
  return (await generateClassPackResult(input)).pack;
}
