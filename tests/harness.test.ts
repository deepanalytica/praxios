import{describe,expect,it}from"vitest";
import{evaluateAuthority}from"../src/os/harness";

describe("Meta-Harness authority",()=>{
  it("permite lectura reversible",()=>{
    expect(evaluateAuthority({role:"MARKET_INTEL",action:"READ_STATE"}).decision).toBe("allow");
  });
  it("eleva gastos materiales a humano",()=>{
    const result=evaluateAuthority({role:"CEO",action:"SPEND_MONEY",amountClp:250000});
    expect(result.decision).toBe("review");
    expect(result.humanApproval).toBe(true);
  });
  it("bloquea propuestas sin evidencia para revisión",()=>{
    const result=evaluateAuthority({role:"CEO",action:"PROPOSE_DECISION",evidenceCount:0});
    expect(result.decision).toBe("review");
  });
  it("mantiene contratos bajo autoridad humana",()=>{
    expect(evaluateAuthority({role:"CEO",action:"SIGN_CONTRACT"}).humanApproval).toBe(true);
  });
});
