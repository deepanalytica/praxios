import{createContext,useContext,useEffect,useState,type ReactNode}from"react";
import{buildCeoBrief}from"./decision";
import{harvestSession}from"./harvest";
import{buildSeedState}from"./seed";
import type{HarvestBundle,KnowledgeKind,KnowledgeStatus,PraxiosState,SessionRecord,SessionSource,SystemEvent}from"./types";

const STORAGE_KEY="praxios.os.state.v1";
const kinds:KnowledgeKind[]=["idea","decision","task","risk","opportunity","evidence","goal","resource","finding"];
const id=(prefix:string)=>`${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
const normalize=(value:string)=>value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();

interface PraxiosContextValue{
  state:PraxiosState;
  previewHarvest:(input:{raw:string;source:SessionSource;title:string;project?:string})=>HarvestBundle;
  commitHarvest:(bundle:HarvestBundle)=>void;
  harvestAndCommit:(input:{raw:string;source:SessionSource;title:string;project?:string})=>HarvestBundle;
  runCeoCycle:()=>void;
  updateNodeStatus:(nodeId:string,status:KnowledgeStatus)=>void;
  runWorkflow:(workflowId:string)=>void;
  exportState:()=>string;
  importState:(raw:string)=>{ok:boolean;message:string};
  resetState:()=>void;
}
const PraxiosContext=createContext<PraxiosContextValue|null>(null);

function validState(value:unknown):value is PraxiosState{
  if(!value||typeof value!=="object")return false;
  const v=value as Partial<PraxiosState>;
  return Array.isArray(v.sessions)&&Array.isArray(v.nodes)&&Array.isArray(v.events)&&Array.isArray(v.workflows)&&Array.isArray(v.resources);
}
function loadInitial():PraxiosState{
  const seed=buildSeedState();
  seed.ceoBrief=buildCeoBrief(seed);
  if(typeof window==="undefined")return seed;
  try{
    const raw=window.localStorage.getItem(STORAGE_KEY);
    if(raw){
      const parsed=JSON.parse(raw);
      if(validState(parsed)){
        const merged:PraxiosState={
          ...parsed,
          sessions:[...parsed.sessions],
          nodes:[...parsed.nodes],
          edges:[...(parsed.edges||[])],
          events:[...parsed.events],
          workflows:parsed.workflows.length?parsed.workflows:seed.workflows,
          resources:parsed.resources.length?parsed.resources:seed.resources,
          ceoBrief:parsed.ceoBrief,
        };
        for(const session of seed.sessions)if(!merged.sessions.some(s=>s.id===session.id))merged.sessions.push(session);
        for(const node of seed.nodes)if(!merged.nodes.some(n=>n.id===node.id))merged.nodes.push(node);
        for(const edge of seed.edges)if(!merged.edges.some(e=>e.id===edge.id))merged.edges.push(edge);
        for(const evt of seed.events)if(!merged.events.some(e=>e.id===evt.id))merged.events.push(evt);
        merged.ceoBrief=buildCeoBrief(merged);
        return merged;
      }
    }
  }catch{}
  return seed;
}
function event(type:string,title:string,detail:string,actor:string,project?:string):SystemEvent{
  return{id:id("EVT"),type,title,detail,actor,project,createdAt:new Date().toISOString()};
}
function counts():Record<KnowledgeKind,number>{
  return{idea:0,decision:0,task:0,risk:0,opportunity:0,evidence:0,goal:0,resource:0,finding:0};
}

export function PraxiosProvider({children}:{children:ReactNode}){
  const[state,setState]=useState<PraxiosState>(loadInitial);

  useEffect(()=>{
    try{window.localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch{}
  },[state]);

  const previewHarvest=(input:{raw:string;source:SessionSource;title:string;project?:string})=>harvestSession(input);

  const commitHarvest=(bundle:HarvestBundle)=>{
    setState(previous=>{
      const next: PraxiosState={
        ...previous,
        sessions:[...previous.sessions],
        nodes:[...previous.nodes],
        edges:[...previous.edges],
        events:[...previous.events],
        workflows:previous.workflows.map(w=>({...w,steps:w.steps.map(s=>({...s}))})),
        resources:[...previous.resources],
        ceoBrief:previous.ceoBrief,
      };
      const c=counts();
      let duplicateCount=0;
      const createdIds:string[]=[];
      bundle.items.forEach((item,index)=>{
        c[item.kind]+=1;
        const match=next.nodes.find(n=>n.kind===item.kind&&normalize(n.title)===normalize(item.title));
        if(match){
          duplicateCount+=1;
          next.edges.push({id:id("EDGE"),from:`${bundle.sessionId}-${index}`,to:match.id,type:"same_as",createdAt:new Date().toISOString()});
          return;
        }
        const nodeId=`${bundle.sessionId}-${index}`;
        createdIds.push(nodeId);
        next.nodes.push({
          id:nodeId,
          kind:item.kind,
          title:item.title,
          summary:item.summary||item.title,
          project:item.project||bundle.project,
          status:item.kind==="evidence"||item.kind==="finding"?"active":"open",
          confidence:item.confidence??70,
          severity:item.severity,
          tags:item.tags||[],
          createdAt:bundle.createdAt,
          sourceSessionId:bundle.sessionId,
        });
      });
      const session:SessionRecord={
        id:bundle.sessionId,source:bundle.source,title:bundle.title,project:bundle.project,
        raw:bundle.raw||"",summary:bundle.summary,createdAt:bundle.createdAt,
        harvestedAt:new Date().toISOString(),counts:c,
      };
      next.sessions.unshift(session);
      next.events.unshift(event("session.harvested",`Sesión cosechada: ${bundle.title}`,`${createdIds.length} objetos nuevos · ${duplicateCount} duplicados detectados.`,"Harvest Engine",bundle.project));
      next.workflows=next.workflows.map(w=>w.id==="wf-session"?{...w,lastRun:new Date().toISOString(),status:"completed",steps:w.steps.map(s=>({...s,status:"done"}))}:w);
      next.ceoBrief=buildCeoBrief(next);
      return next;
    });
  };

  const harvestAndCommit=(input:{raw:string;source:SessionSource;title:string;project?:string})=>{
    const bundle=harvestSession(input);
    commitHarvest(bundle);
    return bundle;
  };

  const runCeoCycle=()=>{
    setState(previous=>{
      const brief=buildCeoBrief(previous);
      return{...previous,ceoBrief:brief,events:[event("ceo.cycle","CEO cycle completado",`${brief.priorities.length} prioridades · ${brief.needsDecision.length} decisiones pendientes · health ${brief.systemHealth}%.`,"AI CEO"),...previous.events]};
    });
  };

  const updateNodeStatus=(nodeId:string,status:KnowledgeStatus)=>{
    setState(previous=>{
      const node=previous.nodes.find(n=>n.id===nodeId);
      const next={...previous,nodes:previous.nodes.map(n=>n.id===nodeId?{...n,status}:n)};
      next.events=[event("knowledge.status",`${node?.kind||"objeto"} → ${status}`,node?.title||nodeId,"PRAXIOS",node?.project),...previous.events];
      next.ceoBrief=buildCeoBrief(next);
      return next;
    });
  };

  const runWorkflow=(workflowId:string)=>{
    setState(previous=>{
      const target=previous.workflows.find(w=>w.id===workflowId);
      const workflows=previous.workflows.map(w=>{
        if(w.id!==workflowId)return w;
        const steps=w.steps.map(s=>({...s}));
        const running=steps.find(s=>s.status==="running");
        if(running)running.status="done";
        const nextStep=steps.find(s=>s.status==="queued");
        if(nextStep)nextStep.status="running";
        const completed=steps.every(s=>s.status==="done");
        return{...w,status:completed?("completed" as const):("running" as const),lastRun:new Date().toISOString(),steps};
      });
      return{...previous,workflows,events:[event("workflow.run",target?.name||workflowId,"Pipeline avanzado una etapa.","Workflow Engine",target?.project),...previous.events]};
    });
  };

  const exportState=()=>JSON.stringify(state,null,2);

  const importState=(raw:string)=>{
    try{
      const parsed=JSON.parse(raw);
      if(!validState(parsed))return{ok:false,message:"El JSON no corresponde a un estado PRAXIOS válido."};
      setState(parsed);
      return{ok:true,message:"Estado importado correctamente."};
    }catch{return{ok:false,message:"JSON inválido."}}
  };

  const resetState=()=>{
    const seed=buildSeedState();
    seed.ceoBrief=buildCeoBrief(seed);
    setState(seed);
  };

  const value={state,previewHarvest,commitHarvest,harvestAndCommit,runCeoCycle,updateNodeStatus,runWorkflow,exportState,importState,resetState};
  return <PraxiosContext.Provider value={value}>{children}</PraxiosContext.Provider>;
}

export function usePraxios(){
  const value=useContext(PraxiosContext);
  if(!value)throw new Error("usePraxios debe utilizarse dentro de PraxiosProvider");
  return value;
}
