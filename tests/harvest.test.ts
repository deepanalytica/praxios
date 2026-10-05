import{describe,expect,it}from"vitest";
import{harvestSession}from"../src/os/harvest";

describe("session harvest",()=>{
  it("extrae objetos desde texto etiquetado",()=>{
    const bundle=harvestSession({
      source:"chatgpt",
      title:"Prueba",
      project:"PRAXIOS Core",
      raw:"Idea: crear un radar comercial\nDecisión: validar antes de construir\nRiesgo: dispersión de proyectos\nTarea: probar con 5 clientes",
    });
    expect(bundle.items).toHaveLength(4);
    expect(bundle.items.map(i=>i.kind)).toEqual(["idea","decision","risk","task"]);
  });

  it("acepta el contrato estructurado",()=>{
    const raw=`PRAXIOS_SESSION_HARVEST
    {
      "schemaVersion":"1.0",
      "sessionId":"SES-TEST",
      "source":"codex",
      "title":"Sesión Codex",
      "project":"MSJ",
      "createdAt":"2026-10-05T00:00:00.000Z",
      "summary":"Resultado",
      "items":[{"kind":"opportunity","title":"Piloto pagado","confidence":88}]
    }`;
    const bundle=harvestSession({source:"other",title:"fallback",raw});
    expect(bundle.sessionId).toBe("SES-TEST");
    expect(bundle.source).toBe("codex");
    expect(bundle.items[0].kind).toBe("opportunity");
    expect(bundle.items[0].confidence).toBe(88);
  });

  it("crea un hallazgo si no reconoce etiquetas",()=>{
    const bundle=harvestSession({source:"human",title:"Nota",raw:"Observación breve que debemos conservar en el sistema."});
    expect(bundle.items.length).toBeGreaterThan(0);
  });
});
