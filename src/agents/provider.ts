export type ModelClass="reasoning"|"research"|"fast"|"deterministic";
export interface AgentInput{agentId:string;objective:string;context:Record<string,unknown>;evidence:Array<{source:string;claim:string}>}
export interface AgentOutput{summary:string;recommendation:string;confidence:number;evidenceUsed:string[];actions:Array<{type:"CREATE_EXPERIMENT"|"REQUEST_EVIDENCE"|"PROPOSE_DECISION"|"NO_ACTION";payload:Record<string,unknown>}>}
export interface AgentModelProvider{id:string;supports:ModelClass[];execute(input:AgentInput,modelClass:ModelClass):Promise<AgentOutput>}
export class ProviderRegistry{
 private providers=new Map<string,AgentModelProvider>();
 register(provider:AgentModelProvider){this.providers.set(provider.id,provider)}
 get(id:string){const provider=this.providers.get(id);if(!provider)throw new Error("Proveedor LLM no registrado: "+id);return provider}
}
