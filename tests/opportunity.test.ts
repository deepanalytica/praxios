import{describe,expect,it}from"vitest";
import{calculateOpportunityScore,stateForScore}from"../src/domain/opportunity";
describe("opportunity scoring",()=>{
 it("favorece demanda, margen y velocidad",()=>{const score=calculateOpportunityScore({demand:95,speedToCash:90,margin:90,ltv:80,recurring:70,advantage:85,scalability:80,distribution:85,risk:20,founderLoad:30,capitalLoad:20,complexity:25});expect(score).toBeGreaterThanOrEqual(70)});
 it("penaliza riesgo y carga operativa",()=>{const score=calculateOpportunityScore({demand:60,speedToCash:40,margin:55,ltv:50,recurring:30,advantage:45,scalability:40,distribution:45,risk:90,founderLoad:90,capitalLoad:85,complexity:90});expect(score).toBeLessThan(50)});
 it("mapea score a estado",()=>{expect(stateForScore(85)).toBe("SCALE");expect(stateForScore(70)).toBe("BUILD");expect(stateForScore(55)).toBe("TEST");expect(stateForScore(40)).toBe("HOLD");expect(stateForScore(20)).toBe("KILL")});
});
