import{describe,expect,it}from"vitest";
import{buildCeoBrief}from"../src/os/decision";
import{buildSeedState}from"../src/os/seed";

describe("AI CEO decision engine",()=>{
  it("genera un brief con prioridades y health",()=>{
    const state=buildSeedState();
    const brief=buildCeoBrief(state);
    expect(brief.systemHealth).toBeGreaterThan(0);
    expect(brief.priorities.length).toBeGreaterThan(0);
    expect(brief.opportunities.length).toBeGreaterThan(0);
  });

  it("penaliza decisiones y riesgos abiertos",()=>{
    const state=buildSeedState();
    const before=buildCeoBrief(state).systemHealth;
    state.nodes.push({
      id:"risk-test",kind:"risk",title:"Riesgo crítico adicional",summary:"test",status:"open",
      confidence:100,severity:"critical",tags:[],createdAt:new Date().toISOString(),
    });
    const after=buildCeoBrief(state).systemHealth;
    expect(after).toBeLessThan(before);
  });
});
