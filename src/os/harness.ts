export type AuthorityDecision="allow"|"review"|"block";
export type GovernedAction=
  |"READ_STATE"
  |"WRITE_STATE"
  |"PROPOSE_DECISION"
  |"EXECUTE_WORKFLOW"
  |"MODIFY_CODE"
  |"SEND_EXTERNAL_MESSAGE"
  |"PUBLISH_EXTERNAL"
  |"SPEND_MONEY"
  |"SIGN_CONTRACT"
  |"DELETE_DATA";

export type AgentRole="CEO"|"CFO"|"CRO"|"MARKET_INTEL"|"PRODUCT"|"GROWTH"|"CONTENT"|"ENGINEERING"|"OPERATIONS"|"RISK";

export interface AuthorityRequest{
  role:AgentRole;
  action:GovernedAction;
  amountClp?:number;
  reversible?:boolean;
  evidenceCount?:number;
}
export interface AuthorityResult{
  decision:AuthorityDecision;
  humanApproval:boolean;
  reasons:string[];
}

const humanOnly=new Set<GovernedAction>(["SIGN_CONTRACT"]);
const highRisk=new Set<GovernedAction>(["SPEND_MONEY","SEND_EXTERNAL_MESSAGE","PUBLISH_EXTERNAL","DELETE_DATA"]);
const writeRoles=new Set<AgentRole>(["CEO","CFO","CRO","PRODUCT","GROWTH","CONTENT","ENGINEERING","OPERATIONS","RISK"]);

export function evaluateAuthority(request:AuthorityRequest):AuthorityResult{
  const reasons:string[]=[];
  if(humanOnly.has(request.action)){
    return{decision:"review",humanApproval:true,reasons:["Contrato material: autoridad humana obligatoria."]};
  }
  if(request.action==="SPEND_MONEY"&&(request.amountClp??0)>100000){
    return{decision:"review",humanApproval:true,reasons:["Gasto superior al umbral autónomo de $100.000 CLP."]};
  }
  if(request.action==="DELETE_DATA"&&request.reversible===false){
    return{decision:"review",humanApproval:true,reasons:["Eliminación irreversible requiere aprobación humana."]};
  }
  if(request.action==="WRITE_STATE"&&!writeRoles.has(request.role)){
    return{decision:"block",humanApproval:false,reasons:["El rol no posee permiso de escritura sobre estado institucional."]};
  }
  if(request.action==="PROPOSE_DECISION"&&(request.evidenceCount??0)<1){
    reasons.push("La propuesta carece de evidencia adjunta.");
    return{decision:"review",humanApproval:true,reasons};
  }
  if(highRisk.has(request.action)){
    reasons.push("Acción externa o de riesgo: requiere revisión antes de ejecutar.");
    return{decision:"review",humanApproval:true,reasons};
  }
  reasons.push("Acción dentro de autoridad delegada y reversible.");
  return{decision:"allow",humanApproval:false,reasons};
}

export const authorityMatrix:Array<{action:GovernedAction;defaultDecision:AuthorityDecision;note:string}>=[
  {action:"READ_STATE",defaultDecision:"allow",note:"Lectura de contexto autorizada."},
  {action:"WRITE_STATE",defaultDecision:"allow",note:"Escritura auditada; no equivale a decisión humana."},
  {action:"PROPOSE_DECISION",defaultDecision:"allow",note:"Requiere evidencia para evitar propuestas vacías."},
  {action:"EXECUTE_WORKFLOW",defaultDecision:"allow",note:"Dentro de pipeline preautorizado."},
  {action:"MODIFY_CODE",defaultDecision:"allow",note:"Requiere CI y branch/PR."},
  {action:"SEND_EXTERNAL_MESSAGE",defaultDecision:"review",note:"Puede representar al usuario ante terceros."},
  {action:"PUBLISH_EXTERNAL",defaultDecision:"review",note:"Impacto reputacional externo."},
  {action:"SPEND_MONEY",defaultDecision:"review",note:"Umbral autónomo máximo $100.000 CLP."},
  {action:"SIGN_CONTRACT",defaultDecision:"review",note:"Siempre humano."},
  {action:"DELETE_DATA",defaultDecision:"review",note:"Revisar reversibilidad y backup."},
];
