import type{Agent,Deal,Decision,ExecutiveMetric,Experiment,Project}from"../domain/types";
export const executiveMetrics:ExecutiveMetric[]=[
 {label:"Caja",value:"$1,84M",detail:"Disponible para asignar",trend:"up"},
 {label:"Ingresos 30D",value:"$3,46M",detail:"+18% vs. período anterior",trend:"up"},
 {label:"Pipeline",value:"$8,90M",detail:"Ponderado: $3,12M",trend:"up"},
 {label:"MRR",value:"$620K",detail:"Objetivo 90D: $1,5M",trend:"up"},
 {label:"Burn",value:"$410K",detail:"Controlado",trend:"flat"}
];
export const projects:Project[]=[
{id:"visual-art-ai",name:"Visual Art AI",summary:"Visibilidad en Google, Maps y buscadores de IA para pymes y profesionales.",state:"SCALE",score:84,revenue30d:1240000,pipeline:2600000,margin:83,timeToCashDays:3,founderHoursWeek:8,confidence:88,tags:["servicios","LLM SEO","caja"],nextDecision:"Estandarizar diagnóstico de entrada y cerrar 5 clientes."},
{id:"deep-living",name:"Deep Living",summary:"Captación inmobiliaria y corretaje apoyado por diagnóstico, datos y automatización.",state:"SCALE",score:81,revenue30d:860000,pipeline:3300000,margin:78,timeToCashDays:12,founderHoursWeek:6,confidence:80,tags:["real estate","alto ticket","leads"],nextDecision:"Activar embudo de tasación preliminar y captar propietarios."},
{id:"msj",name:"MSJ",summary:"Asistente multicanal independiente para WhatsApp, Instagram y Facebook.",state:"BUILD",score:73,revenue30d:180000,pipeline:880000,margin:71,timeToCashDays:21,founderHoursWeek:10,confidence:70,tags:["SaaS","mensajería","MRR"],nextDecision:"Conseguir 3 pilotos pagados antes de ampliar integraciones."},
{id:"clinia",name:"Clinia",summary:"Vertical operativo para clínicas, agenda, comunicaciones y automatización.",state:"TEST",score:66,revenue30d:0,pipeline:1200000,margin:68,timeToCashDays:35,founderHoursWeek:10,confidence:62,tags:["salud","SaaS","vertical"],nextDecision:"Validar dolor y disposición a pagar con clínicas reales."},
{id:"deep-geo",name:"Deep Geo",summary:"Inteligencia geoespacial y geohazards para minería y sector público.",state:"HOLD",score:61,revenue30d:0,pipeline:4800000,margin:74,timeToCashDays:90,founderHoursWeek:12,confidence:72,tags:["GIS","minería","sector público"],nextDecision:"Priorizar propuestas de alto ticket, no nuevas features."},
{id:"educabot",name:"Educabot",summary:"IA confiable para profesores, estudiantes y apoderados.",state:"TEST",score:59,revenue30d:0,pipeline:420000,margin:62,timeToCashDays:45,founderHoursWeek:9,confidence:55,tags:["edtech","IA","aprendizaje"],nextDecision:"Pre-vender toolkit docente antes de construir plataforma completa."},
{id:"digital-products",name:"Digital Product & IP Factory",summary:"Laboratorio de ebooks, toolkits, microproductos, afiliación y UGC.",state:"TEST",score:72,revenue30d:96000,pipeline:360000,margin:91,timeToCashDays:7,founderHoursWeek:4,confidence:60,tags:["digital","UGC","experimentos"],nextDecision:"Ejecutar 3 tests de preventa y matar lo que no convierta."},
{id:"praxios-core",name:"PRAXIOS Core",summary:"Capa de gobierno, evidencia, decisión y orquestación del ecosistema.",state:"BUILD",score:78,revenue30d:0,pipeline:0,margin:0,timeToCashDays:0,founderHoursWeek:8,confidence:82,tags:["infraestructura","orquestación","evidencia"],nextDecision:"Usarlo internamente antes de convertirlo en producto."}
];
export const agents:Agent[]=[
{id:"ceo",name:"CEO",role:"Capital Allocator",objective:"Maximizar caja, margen y valor estratégico.",status:"ACTIVE",kpi:"Cash generated / founder hour",lastRun:"Hace 4 min",modelClass:"reasoning"},
{id:"cfo",name:"CFO",role:"Finance",objective:"Controlar caja, margen, runway y retorno de capital.",status:"ACTIVE",kpi:"Free cash flow",lastRun:"Hace 8 min",modelClass:"deterministic"},
{id:"cro",name:"CRO",role:"Revenue",objective:"Convertir pipeline en ventas cobradas.",status:"ACTIVE",kpi:"New revenue",lastRun:"Hace 11 min",modelClass:"reasoning"},
{id:"market",name:"Market Intel",role:"Research",objective:"Detectar demanda y evidencia de pago.",status:"WATCHING",kpi:"Validated opportunities",lastRun:"Hace 36 min",modelClass:"research"},
{id:"monetization",name:"Monetization",role:"Offers",objective:"Diseñar packaging, pricing y upsells.",status:"ACTIVE",kpi:"ARPU × conversion",lastRun:"Hace 19 min",modelClass:"reasoning"},
{id:"product",name:"Product",role:"Product",objective:"Construir sólo lo mínimo que desbloquea valor.",status:"WATCHING",kpi:"Time to revenue",lastRun:"Hace 42 min",modelClass:"reasoning"},
{id:"growth",name:"Growth",role:"Distribution",objective:"Encontrar adquisición repetible y rentable.",status:"ACTIVE",kpi:"CAC / payback",lastRun:"Hace 14 min",modelClass:"research"},
{id:"content",name:"Content",role:"Content Factory",objective:"Crear contenido ligado a una oferta y una métrica.",status:"WATCHING",kpi:"Revenue attributed",lastRun:"Hace 27 min",modelClass:"fast"},
{id:"operations",name:"Operations",role:"Automation",objective:"Eliminar trabajo manual y cuellos de botella.",status:"IDLE",kpi:"Cost per operation",lastRun:"Ayer",modelClass:"fast"},
{id:"risk",name:"Risk / QA",role:"Challenge",objective:"Bloquear decisiones sin evidencia o riesgo desproporcionado.",status:"ACTIVE",kpi:"Avoided downside",lastRun:"Hace 6 min",modelClass:"reasoning"}
];
export const decisions:Decision[]=[
{id:"DEC-0281",title:"Lanzar diagnóstico Visual Art AI a $99.000",project:"Visual Art AI",status:"TEST",proposedBy:"Monetization",thesis:"Una oferta estandarizada reduce fricción, acelera cobro y crea entrada natural al servicio mensual.",evidence:["17 prospectos identificados","6 conversaciones","3 clientes anteriores","Margen estimado 83%"],budget:100000,confidence:86,risk:"LOW",votes:[{agent:"CFO",vote:"APPROVE"},{agent:"CRO",vote:"APPROVE"},{agent:"Risk",vote:"APPROVE"}],killCriteria:"0 ventas después de 300 visitas cualificadas.",scaleCriteria:"CAC < $25.000 y conversión > 3%."},
{id:"DEC-0280",title:"Detener nuevas features de Deep Geo por 30 días",project:"Deep Geo",status:"HOLD",proposedBy:"CEO",thesis:"La prioridad es transformar capacidad técnica existente en propuestas comerciales de alto ticket.",evidence:["Pipeline potencial alto","Ciclo comercial largo","12 h/semana de carga del fundador"],budget:0,confidence:79,risk:"LOW",votes:[{agent:"CFO",vote:"APPROVE"},{agent:"Product",vote:"CHALLENGE"},{agent:"CRO",vote:"APPROVE"}],killCriteria:"No aplica: decisión de asignación.",scaleCriteria:"2 oportunidades calificadas con ticket > $2M."}
];
export const experiments:Experiment[]=[
{id:"EXP-014",title:"Toolkit IA práctica para profesores",project:"Digital Product & IP Factory",status:"PROMISING",hypothesis:"Profesores pagarán por un toolkit listo para ahorrar tiempo y mejorar resultados.",spend:92000,revenue:431760,visitors:842,conversions:24,nextAction:"Probar precio $17.990 vs. $29.990."},
{id:"EXP-015",title:"Tasación preliminar como lead magnet",project:"Deep Living",status:"RUNNING",hypothesis:"Una estimación útil convierte mejor que un PDF genérico.",spend:54000,revenue:0,visitors:266,conversions:31,nextAction:"Contactar leads con intención alta y medir reuniones."},
{id:"EXP-016",title:"Auditoría de presencia IA",project:"Visual Art AI",status:"RUNNING",hypothesis:"Mostrar brechas concretas aumenta conversión a implementación.",spend:78000,revenue:396000,visitors:413,conversions:4,nextAction:"Escalar tráfico sólo si CAC permanece bajo $25.000."}
];
export const deals:Deal[]=[
{id:"D-101",company:"Clínica estética — Talca",offer:"Visual Art AI + MSJ",stage:"Proposal",value:420000,probability:65,owner:"CRO"},
{id:"D-102",company:"Propietario — Maule",offer:"Deep Living",stage:"Discovery",value:950000,probability:45,owner:"CRO"},
{id:"D-103",company:"Centro de eventos — Curicó",offer:"Visual Art AI",stage:"Negotiation",value:280000,probability:80,owner:"CRO"},
{id:"D-104",company:"Clínica dental",offer:"MSJ piloto",stage:"Qualified",value:160000,probability:35,owner:"CRO"},
{id:"D-105",company:"Ingeniería minera",offer:"Deep Geo",stage:"Lead",value:2400000,probability:20,owner:"CEO"}
];
