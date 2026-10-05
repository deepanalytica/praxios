import{agents,projects}from"../data/seed";
import{generatedHarvest}from"../generated/harvest.generated";
import type{GraphEdge,KnowledgeKind,KnowledgeNode,PraxiosState,Resource,SessionRecord,SystemEvent,Workflow}from"./types";

const now="2026-10-05T15:00:00.000Z";
const zeroCounts=():Record<KnowledgeKind,number>=>({idea:0,decision:0,task:0,risk:0,opportunity:0,evidence:0,goal:0,resource:0,finding:0});

export const baseNodes:KnowledgeNode[]=[
  {id:"goal-cash",kind:"goal",title:"Generar $1M CLP de caja validada",summary:"Misión operativa inicial antes de abrir otra gran construcción.",status:"active",confidence:100,tags:["cash","mission"],createdAt:now},
  {id:"dec-focus",kind:"decision",title:"Máximo tres apuestas activas de crecimiento",summary:"Visual Art AI, Deep Living y una apuesta de crecimiento compiten por el foco principal.",status:"active",confidence:88,tags:["portfolio","focus"],createdAt:now},
  {id:"opp-vai",kind:"opportunity",title:"Estandarizar auditoría de presencia IA",summary:"Oferta de entrada para convertir diagnóstico en implementación y recurrencia.",project:"Visual Art AI",status:"open",confidence:86,tags:["revenue","offer"],createdAt:now},
  {id:"opp-living",kind:"opportunity",title:"Embudo de tasación preliminar para captar propietarios",summary:"Transformar la tasación en un lead magnet transaccional para corretaje.",project:"Deep Living",status:"open",confidence:81,tags:["real-estate","lead"],createdAt:now},
  {id:"risk-fragment",kind:"risk",title:"Fragmentación entre sesiones y modelos",summary:"Decisiones e ideas se pierden cuando no se convierten en estado institucional.",project:"PRAXIOS Core",status:"active",confidence:96,severity:"high",tags:["memory","continuity"],createdAt:now},
];
export const baseEdges:GraphEdge[]=[
  {id:"edge-1",from:"dec-focus",to:"goal-cash",type:"supports",createdAt:now},
  {id:"edge-2",from:"opp-vai",to:"goal-cash",type:"advances",createdAt:now},
  {id:"edge-3",from:"opp-living",to:"goal-cash",type:"advances",createdAt:now},
  {id:"edge-4",from:"risk-fragment",to:"dec-focus",type:"threatens",createdAt:now},
];

export const baseResources:Resource[]=[
  {id:"res-ai",name:"Generative AI",category:"capability",description:"Modelos, prompting, generación visual, agentes y automatización.",reusableBy:projects.map(p=>p.name),leverage:95},
  {id:"res-ux",name:"UI/UX + Web",category:"capability",description:"Diseño, sistemas visuales, React/Tailwind y prototipado rápido.",reusableBy:["Visual Art AI","Deep Living","MSJ","Clinia","Educabot","PRAXIOS Core"],leverage:90},
  {id:"res-gis",name:"GIS / SAR / InSAR",category:"capability",description:"Deep Geo, riesgos, minería y análisis territorial.",reusableBy:["Deep Geo"],leverage:82},
  {id:"res-content",name:"Content Factory",category:"capability",description:"Video, imagen, UGC, copy, SEO y distribución.",reusableBy:["Visual Art AI","Deep Living","Digital Product & IP Factory","Educabot"],leverage:88},
  {id:"res-github",name:"GitHub",category:"infrastructure",description:"Código, CI/CD, documentación y estado operativo versionado.",reusableBy:projects.map(p=>p.name),leverage:92},
];

export const baseWorkflows:Workflow[]=[
  {id:"wf-session",name:"Session Harvest",objective:"Convertir cada sesión de IA en estado institucional.",status:"running",trigger:"session.close",steps:[
    {id:"s1",label:"Ingestar sesión",agent:"Session Gateway",status:"done"},
    {id:"s2",label:"Extraer conocimiento",agent:"Harvest Agent",status:"running"},
    {id:"s3",label:"Resolver duplicados",agent:"Ontology Agent",status:"queued"},
    {id:"s4",label:"Actualizar State Graph",agent:"PRAXIOS Core",status:"queued"},
    {id:"s5",label:"Recalcular CEO brief",agent:"AI CEO",status:"queued"},
  ]},
  {id:"wf-opportunity",name:"Opportunity Radar",objective:"Buscar problemas pagados compatibles con nuestras capacidades.",status:"running",trigger:"daily",steps:[
    {id:"o1",label:"Scan demanda",agent:"Market Intel",status:"running"},
    {id:"o2",label:"Score económico",agent:"CFO",status:"queued"},
    {id:"o3",label:"Diseñar test",agent:"Monetization",status:"queued"},
    {id:"o4",label:"Elevar a CEO",agent:"AI CEO",status:"queued"},
  ]},
  {id:"wf-revenue",name:"Revenue Loop",objective:"Convertir oportunidades en ventas cobradas.",status:"idle",trigger:"opportunity.validated",steps:[
    {id:"r1",label:"Construir oferta",agent:"Monetization",status:"queued"},
    {id:"r2",label:"Generar activos",agent:"Content",status:"queued"},
    {id:"r3",label:"Prospectar",agent:"CRO",status:"queued"},
    {id:"r4",label:"Medir conversión",agent:"Growth",status:"queued"},
  ]},
];

export const baseEvents:SystemEvent[]=[
  {id:"evt-1",type:"system.bootstrap",title:"PRAXIOS OS iniciado",detail:"State Graph, Harvest y Decision Engine disponibles.",actor:"PRAXIOS Core",createdAt:now},
  {id:"evt-2",type:"policy.active",title:"Meta-Harness activo",detail:"Decisiones materiales requieren evidencia y trazabilidad.",actor:"Meta-Harness",createdAt:now},
  {id:"evt-3",type:"agents.ready",title:"Oficina de agentes lista",detail:`${agents.length} roles disponibles para delegación gobernada.`,actor:"Agent Runtime",createdAt:now},
];

export function buildSeedState():PraxiosState{
  const state:PraxiosState={sessions:[],nodes:[...baseNodes],edges:[...baseEdges],events:[...baseEvents],workflows:[...baseWorkflows],resources:[...baseResources],ceoBrief:null};
  for(const bundle of generatedHarvest){
    const counts=zeroCounts();
    for(const item of bundle.items)counts[item.kind]+=1;
    const session:SessionRecord={id:bundle.sessionId,source:bundle.source,title:bundle.title,project:bundle.project,raw:bundle.raw||"",summary:bundle.summary,createdAt:bundle.createdAt,harvestedAt:bundle.createdAt,counts};
    state.sessions.push(session);
    for(const [index,item] of bundle.items.entries()){
      state.nodes.push({id:`${bundle.sessionId}-${index}`,kind:item.kind,title:item.title,summary:item.summary||item.title,project:item.project||bundle.project,status:"open",confidence:item.confidence??70,severity:item.severity,tags:item.tags||[],createdAt:bundle.createdAt,sourceSessionId:bundle.sessionId});
    }
  }
  return state;
}
