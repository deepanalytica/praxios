import type { ClassPack, ClassRequest } from "./data";
import { fallbackPack } from "./data";

export async function generateClassPackResult(input: ClassRequest): Promise<{ pack: ClassPack; mode: "ai-assisted" | "deterministic-fallback" }> {
  try {
    const response = await fetch("/api/class-pack", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input)
    });
    if (!response.ok) throw new Error("class-pack backend unavailable");
    const data = await response.json() as { pack?: ClassPack; mode?: "ai-assisted" | "deterministic-fallback" };
    if (!data.pack) throw new Error("invalid class-pack response");
    return { pack: data.pack, mode: data.mode === "ai-assisted" ? "ai-assisted" : "deterministic-fallback" };
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 550));
    return { pack: fallbackPack(input), mode: "deterministic-fallback" };
  }
}

export async function generateClassPack(input: ClassRequest): Promise<ClassPack> {
  return (await generateClassPackResult(input)).pack;
}
