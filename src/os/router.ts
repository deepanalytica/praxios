import type{ModelClass}from"../agents/provider";

export type TaskKind="strategy"|"research"|"finance"|"risk"|"code"|"content"|"classification"|"summarization";
export interface ModelRoute{
  task:TaskKind;
  modelClass:ModelClass;
  requiresTools:boolean;
  secondOpinion:boolean;
  rationale:string;
}

const routes:Record<TaskKind,Omit<ModelRoute,"task">>={
  strategy:{modelClass:"reasoning",requiresTools:false,secondOpinion:true,rationale:"Decisiones de portfolio necesitan razonamiento fuerte y contraste."},
  research:{modelClass:"research",requiresTools:true,secondOpinion:false,rationale:"Investigación requiere fuentes y navegación."},
  finance:{modelClass:"deterministic",requiresTools:true,secondOpinion:true,rationale:"Cálculo determinista primero; modelo razona sobre el resultado."},
  risk:{modelClass:"reasoning",requiresTools:false,secondOpinion:true,rationale:"Riesgo material exige una segunda revisión independiente."},
  code:{modelClass:"reasoning",requiresTools:true,secondOpinion:false,rationale:"Ingeniería necesita contexto de repo, tests y ejecución."},
  content:{modelClass:"fast",requiresTools:false,secondOpinion:false,rationale:"Variantes creativas frecuentes deben optimizar coste/velocidad."},
  classification:{modelClass:"fast",requiresTools:false,secondOpinion:false,rationale:"Clasificación estructurada no requiere el modelo más caro."},
  summarization:{modelClass:"fast",requiresTools:false,secondOpinion:false,rationale:"Harvest preliminar puede usar modelos rápidos con validación de esquema."},
};

export function routeTask(task:TaskKind):ModelRoute{return{task,...routes[task]}}
export const routingMatrix=(Object.keys(routes)as TaskKind[]).map(routeTask);
