import type { ClassPack, ClassRequest } from "./data";
import { fallbackPack } from "./data";

export async function generateClassPack(input: ClassRequest): Promise<ClassPack> {
  try {
    const response = await fetch("/api/class-pack", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input)
    });
    if (!response.ok) throw new Error("class-pack backend unavailable");
    const data = await response.json() as { pack?: ClassPack };
    if (!data.pack) throw new Error("invalid class-pack response");
    return data.pack;
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 550));
    return fallbackPack(input);
  }
}
