export type Role="docente"|"alumno"|"familia"|"centro";

export const roleCopy:Record<Role,{label:string;desc:string}>={
  docente:{label:"Docente",desc:"Diseña, asigna y decide."},
  alumno:{label:"Alumno",desc:"Aprende, practica y demuestra."},
  familia:{label:"Familia",desc:"Acompaña con señales útiles."},
  centro:{label:"Centro",desc:"Observa, anticipa e interviene."}
};

export const oa=[
  {code:"MA05 OA 07",title:"Fracciones propias y equivalencia",mastery:82,state:"solid"},
  {code:"MA05 OA 08",title:"Fracciones impropias y números mixtos",mastery:64,state:"learning"},
  {code:"MA05 OA 09",title:"Adición y sustracción de fracciones",mastery:41,state:"risk"},
  {code:"CN07 OA 09",title:"Tectónica de placas",mastery:76,state:"learning"}
];

export const euler=[
  ["01","Nombrar","Definir qué debe comprenderse."],
  ["02","Observar","Partir por casos visibles y concretos."],
  ["03","Invariante","Quitar lo accesorio y encontrar la estructura."],
  ["04","Conjeturar","Proponer sin disfrazar hipótesis de hechos."],
  ["05","Verificar","Probar donde ya conocemos la respuesta."],
  ["06","Unificar","Conectar con conocimientos previos."],
  ["07","Simplificar","La exposición más breve que no pierda verdad."],
  ["08","Mostrar proceso","Conservar errores, andamios y decisiones."],
  ["09","Frontera","Declarar qué todavía no sabemos."]
];

export const classPack={
  title:"Chile sobre un borde activo",
  meta:"7° básico · Ciencias Naturales · 90 min · CN07 OA 09",
  goal:"Explicar patrones de sismos y volcanes usando el modelo de tectónica de placas, conectando observación, representación y evidencia.",
  flow:[
    ["0–8 min","Activación","Mapa de sismos: ¿qué patrón ves antes de explicarlo?"],
    ["8–25 min","Micromundo","Simulación guiada de convergencia y subducción."],
    ["25–48 min","Construcción","Parejas explican el modelo con flechas y restricciones."],
    ["48–70 min","Contraste","Dos explicaciones compiten; buscar dónde falla cada una."],
    ["70–84 min","Transferencia","Aplicar el modelo a un caso nuevo."],
    ["84–90 min","Ticket de salida","Explicar en 3 frases + declarar una duda."]
  ],
  materials:["Presentación 11 láminas","Guía alumno 2 páginas","Micromundo interactivo","Ticket de salida","Pauta docente","Plan B sin internet"],
  trust:[
    {state:"VERIFICADO",text:"Alineación curricular CN07 OA 09",detail:"Fuente oficial curricular instrumentada."},
    {state:"CORROBORADO",text:"Explicación geológica principal",detail:"Lista para conectar fuente científica externa."},
    {state:"SILENCIO",text:"Predicción exacta de próximos sismos",detail:"Bloqueada: excede la evidencia disponible."}
  ]
};
