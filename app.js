const root=document.documentElement;
const pageLang=root.lang==="es"?"es":"en";
const savedTheme=localStorage.getItem("praxios-theme");
const defaultTheme=root.dataset.defaultTheme||"dark";
function applyTheme(theme){
  root.dataset.theme=theme;
  const icon=document.querySelector(".theme-icon");
  const btn=document.querySelector(".theme-toggle");
  if(icon) icon.textContent=theme==="light"?"☾":"☼";
  if(btn) btn.setAttribute("aria-label",theme==="light"?(pageLang==="es"?"Cambiar a modo oscuro":"Switch to dark mode"):(pageLang==="es"?"Cambiar a modo claro":"Switch to light mode"));
}
applyTheme(savedTheme||defaultTheme);
document.addEventListener("click",e=>{
  const btn=e.target.closest(".theme-toggle");
  if(!btn)return;
  const next=root.dataset.theme==="light"?"dark":"light";
  localStorage.setItem("praxios-theme",next);
  applyTheme(next);
});

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.12,rootMargin:"0px 0px -5% 0px"});
$$(".reveal").forEach(el=>{
  if(el.dataset.delay)el.style.setProperty("--delay",el.dataset.delay+"ms");
  revealObserver.observe(el);
});

const glow=$(".cursor-glow");
window.addEventListener("pointermove",e=>{
  if(!glow)return;
  glow.style.left=e.clientX+"px";
  glow.style.top=e.clientY+"px";
},{passive:true});

const menuBtn=$(".menu-btn");
const mobileMenu=$(".mobile-menu");
if(menuBtn&&mobileMenu){
  menuBtn.addEventListener("click",()=>{
    const open=mobileMenu.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded",String(open));
    mobileMenu.setAttribute("aria-hidden",String(!open));
  });
  $$(".mobile-menu a").forEach(a=>a.addEventListener("click",()=>{
    mobileMenu.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded","false");
    mobileMenu.setAttribute("aria-hidden","true");
  }));
}

const organContent=pageLang==="es"?{
  "Objective Compiler":"Traduce una solicitud de negocio a un contrato legible por máquina: resultado esperado, acciones permitidas, requisitos de evidencia, límites, aprobaciones y criterios de éxito.",
  "Context Ledger":"Mantiene contexto operativo versionado y procedencia para distinguir evidencia vigente, evidencia obsoleta, supuestos y decisiones anteriores.",
  "Planner & Router":"Descompone el trabajo y selecciona modelos, herramientas y agentes según tarea, costo, latencia, riesgo e historial de evaluación, sin depender de un único proveedor.",
  "Policy Engine":"Aplica restricciones deterministas antes de ejecutar: permisos, límites de datos, aprobaciones requeridas, topes de gasto, herramientas permitidas y reglas sectoriales.",
  "Evidence Engine":"Vincula afirmaciones materiales con fuentes y metadatos, incluida vigencia y procedencia, para detectar afirmaciones sin respaldo antes de actuar.",
  "Evaluator":"Ejecuta verificaciones independientes de la ruta principal: hechos, esquemas, políticas, rúbricas de calidad y revisión entre modelos.",
  "Human Gateway":"Escala decisiones relevantes o inciertas a personas designadas y registra quién aprobó, rechazó o modificó la acción propuesta.",
  "Execution Bus":"Entrega interfaces acotadas a herramientas y APIs, controlando qué puede modificar un agente y registrando la transición de estado resultante.",
  "Outcome Ledger":"Registra costo, latencia, calidad y resultados de negocio después de ejecutar, generando retroalimentación para mejorar rutas, políticas y evaluaciones."
}:{
  "Objective Compiler":"Translates a business request into a machine-readable contract: intended outcome, allowed actions, evidence requirements, limits, approvals and success criteria.",
  "Context Ledger":"Maintains versioned operational context and provenance so an agent can distinguish current evidence, stale evidence, assumptions and prior decisions.",
  "Planner & Router":"Decomposes work and selects models, tools and agents by task, cost, latency, risk and evaluation history rather than loyalty to one provider.",
  "Policy Engine":"Applies deterministic constraints before execution: permissions, data boundaries, required approvals, spending limits, tool allowlists and sector rules.",
  "Evidence Engine":"Maps material claims to sources and metadata, including freshness and provenance. It is designed to make unsupported claims detectable before action.",
  "Evaluator":"Runs task-specific checks that are independent from the primary generation path: factual checks, schema tests, policy tests, scoring rubrics and cross-model review.",
  "Human Gateway":"Escalates consequential or uncertain decisions to designated people, recording who approved, rejected or modified the proposed action.",
  "Execution Bus":"Provides bounded interfaces to tools and APIs, controlling what an agent can change in the external world and logging the resulting state transition.",
  "Outcome Ledger":"Records cost, latency, quality and business outcomes after execution, creating the feedback needed to improve routing, policies and evaluations."
};
const organDetail=$("#organ-detail");
$$(".organ").forEach(btn=>btn.addEventListener("click",()=>{
  $$(".organ").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active");
  const key=btn.dataset.organ;
  if(organDetail){
    organDetail.innerHTML="<span>"+key.toUpperCase()+"</span><p>"+organContent[key]+"</p>";
  }
}));

const nf=new Intl.NumberFormat("en-IE",{style:"currency",currency:"EUR",maximumFractionDigits:0});
function updateRisk(){
  const decisions=Math.max(0,Number($("#decisions")?.value||0));
  const errorRate=Math.min(100,Math.max(0,Number($("#errorRate")?.value||0)))/100;
  const errorCost=Math.max(0,Number($("#errorCost")?.value||0));
  const reduction=Math.min(100,Math.max(0,Number($("#reduction")?.value||0)))/100;
  const annual=decisions*12*errorRate*errorCost;
  const avoided=annual*reduction;
  if($("#annualExposure"))$("#annualExposure").textContent=nf.format(annual);
  if($("#avoidedExposure"))$("#avoidedExposure").textContent=nf.format(avoided);
}
["#decisions","#errorRate","#errorCost","#reduction"].forEach(id=>$(id)?.addEventListener("input",updateRisk));
updateRisk();

const accessModal=$("#access-modal");
const dataroomModal=$("#dataroom-modal");
function openDialog(dialog){
  if(dialog&&!dialog.open)dialog.showModal();
}
function closeDialog(dialog){
  if(dialog?.open)dialog.close();
}
$$("[data-open-access]").forEach(btn=>btn.addEventListener("click",()=>openDialog(accessModal)));
$$("[data-open-dataroom]").forEach(btn=>btn.addEventListener("click",()=>openDialog(dataroomModal)));
$$("[data-close-modal]").forEach(btn=>btn.addEventListener("click",()=>closeDialog(btn.closest("dialog"))));
$$("dialog").forEach(dialog=>dialog.addEventListener("click",e=>{
  if(e.target===dialog)closeDialog(dialog);
}));

const form=$("#access-form");
const output=$("#request-output");
const requestText=$("#request-text");
if(form){
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const data=new FormData(form);
    const lines=[
      pageLang==="es"?"PRAXIOS — Solicitud de acceso para inversionistas":"PRAXIOS — Investor Access Request",
      "",
      (pageLang==="es"?"Nombre: ":"Name: ")+(data.get("name")||""),
      (pageLang==="es"?"Fondo / empresa: ":"Fund / company: ")+(data.get("company")||""),
      "Email: "+(data.get("email")||""),
      (pageLang==="es"?"Mensaje: ":"Message: ")+(data.get("message")||"—"),
      "",
      pageLang==="es"?"Material solicitado: Deck de inversión, memo de arquitectura, roadmap de producto, modelo financiero, plan de seguridad y gobernanza, evidencia de clientes.":"Requested materials: Investor deck, Architecture memo, Product roadmap, Financial model, Security & governance plan, Customer evidence."
    ];
    requestText.textContent=lines.join("\n");
    output.hidden=false;
    output.scrollIntoView({behavior:"smooth",block:"nearest"});
  });
}
$("#copy-request")?.addEventListener("click",async()=>{
  try{
    await navigator.clipboard.writeText(requestText.textContent);
    const btn=$("#copy-request");
    btn.textContent=pageLang==="es"?"Copiado ✓":"Copied ✓";
    setTimeout(()=>btn.textContent=pageLang==="es"?"Copiar solicitud":"Copy request",1500);
  }catch{
    $("#copy-request").textContent=pageLang==="es"?"Selecciona el texto de arriba para copiarlo":"Select the text above to copy";
  }
});

const sections=$$("main section[id]");
const navLinks=$$(".desktop-nav a");
const sectionObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    navLinks.forEach(link=>link.classList.toggle("is-active",link.getAttribute("href")==="#"+entry.target.id));
  });
},{rootMargin:"-35% 0px -60% 0px",threshold:0});
sections.forEach(section=>sectionObserver.observe(section));
