import type{HarvestBundle,HarvestItem,KnowledgeKind,SessionSource}from"./types";

const now=()=>new Date().toISOString();
const makeId=(prefix:string)=>`${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
const kinds:KnowledgeKind[]=["idea","decision","task","risk","opportunity","evidence","goal","resource","finding"];

const prefixMap:Array<[RegExp,KnowledgeKind]>=[
  [/^(idea|idea nueva|hip[oó]tesis)\s*[:\-]/i,"idea"],
  [/^(decisi[oó]n|decidimos|decision)\s*[:\-]/i,"decision"],
  [/^(tarea|acci[oó]n|next action|todo)\s*[:\-]/i,"task"],
  [/^(riesgo|risk|bloqueo)\s*[:\-]/i,"risk"],
  [/^(oportunidad|opportunity|negocio)\s*[:\-]/i,"opportunity"],
  [/^(evidencia|evidence|dato|resultado)\s*[:\-]/i,"evidence"],
  [/^(objetivo|goal|meta)\s*[:\-]/i,"goal"],
  [/^(recurso|resource|activo)\s*[:\-]/i,"resource"],
  [/^(hallazgo|finding|aprendizaje|insight)\s*[:\-]/i,"finding"],
];

function normalizeItem(item:Partial<HarvestItem>,project?:string):HarvestItem{
  const kind=kinds.includes(item.kind as KnowledgeKind)?item.kind as KnowledgeKind:"finding";
  const title=(item.title||item.summary||"Hallazgo sin título").trim().slice(0,180);
  return{
    kind,title,
    summary:(item.summary||title).trim().slice(0,700),
    project:item.project||project,
    confidence:Math.max(0,Math.min(100,Number(item.confidence??70))),
    severity:item.severity,
    tags:Array.isArray(item.tags)?item.tags.slice(0,8):[],
    relatesTo:Array.isArray(item.relatesTo)?item.relatesTo.slice(0,12):[],
  };
}

function tryStructured(raw:string,source:SessionSource,title:string,project?:string):HarvestBundle|null{
  const marker="PRAXIOS_SESSION_HARVEST";
  const candidate=raw.includes(marker)?raw.slice(raw.indexOf(marker)+marker.length).trim():raw.trim();
  const first=candidate.indexOf("{");
  const last=candidate.lastIndexOf("}");
  if(first<0||last<=first)return null;
  try{
    const parsed=JSON.parse(candidate.slice(first,last+1)) as Partial<HarvestBundle>;
    if(!Array.isArray(parsed.items))return null;
    return{
      schemaVersion:"1.0",
      sessionId:parsed.sessionId||makeId("SES"),
      source:parsed.source||source,
      title:parsed.title||title,
      project:parsed.project||project,
      createdAt:parsed.createdAt||now(),
      summary:parsed.summary||"Sesión cosechada mediante payload estructurado.",
      raw:parsed.raw||raw,
      items:parsed.items.map(item=>normalizeItem(item,parsed.project||project)),
    };
  }catch{return null}
}

export function harvestSession(input:{raw:string;source:SessionSource;title:string;project?:string}):HarvestBundle{
  const structured=tryStructured(input.raw,input.source,input.title,input.project);
  if(structured)return structured;

  const lines=input.raw.split(/\r?\n/).map(v=>v.trim()).filter(Boolean);
  const items:HarvestItem[]=[];
  for(const line of lines){
    for(const [pattern,kind] of prefixMap){
      if(pattern.test(line)){
        const clean=line.replace(pattern,"").trim();
        if(clean)items.push(normalizeItem({kind,title:clean,summary:clean},input.project));
        break;
      }
    }
  }

  if(items.length===0){
    const signals=[
      {re:/\b(vender|venta|cliente|mercado|monetiz|ingreso|negocio)\b/i,kind:"opportunity" as KnowledgeKind},
      {re:/\b(decid|prioriz|descart|mantener|detener)\b/i,kind:"decision" as KnowledgeKind},
      {re:/\b(riesgo|bloqueo|problema|amenaza)\b/i,kind:"risk" as KnowledgeKind},
      {re:/\b(hacer|crear|construir|probar|contactar|lanzar)\b/i,kind:"task" as KnowledgeKind},
    ];
    const sentences=input.raw.split(/(?<=[.!?])\s+/).map(v=>v.trim()).filter(v=>v.length>35);
    for(const sentence of sentences.slice(0,30)){
      const hit=signals.find(s=>s.re.test(sentence));
      if(hit)items.push(normalizeItem({kind:hit.kind,title:sentence.slice(0,150),summary:sentence},input.project));
      if(items.length>=8)break;
    }
  }

  if(items.length===0&&input.raw.trim()){
    items.push(normalizeItem({kind:"finding",title:input.raw.trim().slice(0,150),summary:input.raw.trim().slice(0,700)},input.project));
  }

  const summary=input.raw.replace(/\s+/g," ").trim().slice(0,320)||"Sesión sin contenido.";
  return{
    schemaVersion:"1.0",
    sessionId:makeId("SES"),
    source:input.source,
    title:input.title||"Sesión sin título",
    project:input.project,
    createdAt:now(),
    summary,
    raw:input.raw,
    items,
  };
}
