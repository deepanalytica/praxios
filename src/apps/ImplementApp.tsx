import { ArrowRight, CircleCheck, CircleDashed, LockKeyhole, ScanEye } from "lucide-react";
import { AppHeader } from "../App";

export default function ImplementApp() {
  const steps = [
    ["01", "Planificar", "Qué aprendizaje se espera y con qué evidencia."],
    ["02", "Usar", "Qué material o experiencia llegó realmente al aula."],
    ["03", "Observar", "Qué pudo explicar o resolver el estudiante."],
    ["04", "Mejorar", "Qué intervención ayuda y si hubo cambio posterior."]
  ];
  return <div className="implement-app"><AppHeader product="Implementa" tone="dark"/><main className="workspace implement-workspace"><div className="implement-hero"><span className="eyebrow light">PRODUCTO INSTITUCIONAL · CONCEPTO</span><h1>Del plan al aula.<br/><em>Del aula a la evidencia.</em></h1><p>Una vista para saber si los contenidos se implementan y dónde apoyar. Se activará después de validar Aprende y Crea con estudiantes y docentes.</p><div className="stage-pill"><CircleDashed size={17}/> Etapa futura · Sin datos reales</div></div><section className="implementation-model"><div><span className="eyebrow">EL CICLO QUE IMPORTA</span><h2>Menos paneles.<br/>Más decisiones claras.</h2><p>Esta maqueta muestra el flujo previsto. Todavía no mide aprendizajes ni recibe información de colegios.</p></div><div className="step-stack">{steps.map(([number, title, description]) => <div className="model-step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div><ArrowRight size={18}/></div>)}</div></section><div className="institution-note"><ScanEye size={22}/><div><strong>Qué se necesita para un piloto real</strong><p>Consentimiento, integración con los sistemas del colegio, rúbricas, comparación antes y después, y explicaciones auditables.</p></div><CircleCheck size={20}/></div><div className="institution-note"><LockKeyhole size={22}/><div><strong>Acceso por definir</strong><p>No hay cuentas institucionales ni datos de estudiantes conectados en este prototipo.</p></div><CircleCheck size={20}/></div></main></div>;
}
