import{projects}from"../data/seed";
import type{CioBrief,PraxiosState}from"./types";

export function buildCeoBrief(state:PraxiosState):CioBrief{
  const open=(kind:string)=>state.nodes.filter(n=>n.kind===kind&&n.status!=="done"&&n.status!=="dismissed");
  const decisions=open("decision");
  const opportunities=open("opportunity").sort((a,b)=>b.confidence-a.confidence);
  const risks=open("risk").sort((a,b)=>{
    const rank={critical:4,high:3,medium:2,low:1};
    return (rank[b.severity||"medium"]||0)-(rank[a.severity||"medium"]||0);
  });
  const tasks=open("task");
  const topProjects=[...projects].filter(p=>p.id!=="praxios-core").sort((a,b)=>b.score-a.score).slice(0,3);

  const priorities:Array<{title:string;reason:string;project?:string}>=[];
  if(opportunities[0])priorities.push({
    title:`Validar: ${opportunities[0].title}`,
    reason:`Oportunidad con ${opportunities[0].confidence}% de confianza y evidencia acumulada.`,
    project:opportunities[0].project,
  });
  for(const project of topProjects){
    if(priorities.length>=3)break;
    priorities.push({title:project.nextDecision,reason:`${project.name} tiene score ${project.score} y alta prioridad económica.`,project:project.name});
  }
  if(tasks.length>0&&priorities.length<3)priorities.push({title:tasks[0].title,reason:"Acción abierta detectada en una sesión reciente.",project:tasks[0].project});

  const avoid=[
    ...projects.filter(p=>p.state==="HOLD"||p.state==="KILL").slice(0,2).map(p=>`No expandir ${p.name}: estado ${p.state}.`),
    ...risks.slice(0,2).map(r=>`No avanzar sin resolver: ${r.title}`),
  ].slice(0,4);

  const load=Math.min(30,decisions.length*3+risks.length*4+Math.max(0,tasks.length-8));
  const systemHealth=Math.max(40,92-load);
  const thesis=opportunities.length
    ?`El sistema detecta ${opportunities.length} oportunidades abiertas. La prioridad es convertir la mejor señal en evidencia comercial antes de abrir nuevos frentes.`
    :"La prioridad sigue siendo monetizar capacidades existentes y cerrar ciclos abiertos antes de crear nuevos proyectos.";

  return{
    generatedAt:new Date().toISOString(),
    systemHealth,
    thesis,
    priorities:priorities.slice(0,3),
    avoid,
    needsDecision:decisions.slice(0,5).map(d=>d.title),
    opportunities:opportunities.slice(0,5).map(o=>o.title),
  };
}
