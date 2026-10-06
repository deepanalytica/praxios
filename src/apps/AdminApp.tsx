import { useEffect, useState } from "react";
import { Activity, ArrowUpRight, CheckCircle2, CircleAlert, Cloud, Database, KeyRound, LockKeyhole, RefreshCw, Server, ShieldCheck, ToggleRight } from "lucide-react";
import { Brand } from "../App";

type Rollout = { aprende: boolean; crea: boolean; implementa: boolean; musica: boolean };
type Overview = { generatedAt: string; services: { worker: string; aiBinding: boolean; aiEnabled: boolean; rolloutStore: boolean; assets: boolean }; rollout: Rollout; usage: null; cost: null; note: string };
const preview: Rollout = { aprende: true, crea: true, implementa: true, musica: true };

export default function AdminApp() {
  const [health, setHealth] = useState<"checking" | "online" | "offline">("checking");
  const [token, setToken] = useState("");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const checkHealth = async () => {
    setHealth("checking");
    try { const response = await fetch("/api/health", { headers: { accept: "application/json" }, cache: "no-store" }); const result = await response.json(); setHealth(response.ok && result.ok ? "online" : "offline"); }
    catch { setHealth("offline"); }
  };
  useEffect(() => { void checkHealth(); }, []);
  const connect = async () => {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/overview", { headers: { authorization: `Bearer ${token}`, accept: "application/json" }, cache: "no-store" });
      if (!response.ok) { setMessage(response.status === 401 ? "Clave incorrecta." : "Consola no configurada en este entorno."); setOverview(null); return; }
      setOverview(await response.json() as Overview); setMessage("Conexión segura establecida.");
    } catch { setMessage("La API administrativa no está disponible en esta vista previa."); }
    finally { setBusy(false); }
  };
  const setFlag = async (key: keyof Rollout, value: boolean) => {
    if (!overview?.services.rolloutStore) return;
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/flags", { method: "PUT", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify({ [key]: value }) });
      if (!response.ok) throw new Error();
      const result = await response.json() as { rollout: Rollout };
      setOverview({ ...overview, rollout: result.rollout }); setMessage(`Configuración de ${key} actualizada.`);
    } catch { setMessage("No se pudo guardar el cambio. Revisa la conexión y la configuración."); }
    finally { setBusy(false); }
  };
  const rollout = overview?.rollout ?? preview;
  return <div className="admin-app"><aside className="admin-sidebar"><Brand light/><span className="admin-caption">CONSOLA INTERNA</span><nav aria-label="Administración"><a href="#resumen" className="active"><Activity size={17}/> Resumen</a><a href="#productos"><ToggleRight size={17}/> Productos</a><a href="#servicios"><Server size={17}/> Servicios</a><a href="#seguridad"><ShieldCheck size={17}/> Acceso</a></nav><div className="sidebar-foot"><LockKeyhole size={16}/> Solo operadores autorizados</div></aside><main className="admin-main"><div className="admin-top"><div><span className="eyebrow">OPERACIÓN EDUCABOT</span><h1>Centro de control</h1><p>Estado de servicios, lanzamiento y conexiones. Los campos sin telemetría se muestran como pendientes.</p></div><button onClick={() => void checkHealth()} title="Actualizar salud del servicio"><RefreshCw size={18}/> Actualizar</button></div><div id="resumen" className="admin-statusbar"><div><span className={`status-dot ${health}`}/><strong>API pública</strong><span>{health === "online" ? "En línea" : health === "checking" ? "Comprobando" : "Sin conexión"}</span></div><div><span className={`status-dot ${overview ? "online" : "offline"}`}/><strong>Consola segura</strong><span>{overview ? "Conectada" : "Sin conectar"}</span></div><div><span className="status-dot neutral"/><strong>Datos de uso</strong><span>Integración pendiente</span></div></div><div className="admin-grid"><section id="productos" className="admin-panel rollout-panel"><div className="admin-panel-title"><div><span className="eyebrow">LANZAMIENTO</span><h2>Productos y funciones</h2></div><span className="preview-tag">{overview ? "ESTADO REAL" : "VISTA PREVIA"}</span></div><p>Activa módulos solo cuando exista autenticación y almacenamiento de configuración. La vista previa muestra el plan de salida.</p>{([ ["aprende", "Aprende", "Estudiantes y familias"], ["crea", "Crea", "Docentes individuales"], ["implementa", "Implementa", "Instituciones · más adelante"], ["musica", "Música de estudio", "Opcional dentro de Aprende"] ] as const).map(([key, title, desc]) => <div className="rollout-item" key={key}><div><strong>{title}</strong><span>{desc}</span></div><button disabled={!overview?.services.rolloutStore || busy} aria-label={`${rollout[key] ? "Desactivar" : "Activar"} ${title}`} aria-pressed={rollout[key]} onClick={() => void setFlag(key, !rollout[key])} className={rollout[key] ? "toggle on" : "toggle"}><i/></button></div>)}<small>{overview?.services.rolloutStore ? "Los cambios se guardan en Cloudflare KV." : "Controles desactivados hasta configurar ADMIN_TOKEN y ADMIN_KV."}</small></section><section id="servicios" className="admin-panel infra-panel"><div className="admin-panel-title"><div><span className="eyebrow">INFRAESTRUCTURA</span><h2>Servicios conectados</h2></div><Cloud size={22}/></div><div className="service-row"><Server size={20}/><div><strong>Cloudflare Worker</strong><span>API y entrega de la aplicación</span></div><b>{health === "online" ? "Activo" : "Sin señal"}</b></div><div className="service-row"><Activity size={20}/><div><strong>Workers AI</strong><span>Generación de borradores docentes</span></div><b>{overview ? overview.services.aiEnabled ? "Activo" : overview.services.aiBinding ? "Desactivado en demo" : "No configurado" : "Sin verificar"}</b></div><div className="service-row"><Database size={20}/><div><strong>KV de configuración</strong><span>Control de despliegue por módulo</span></div><b>{overview ? overview.services.rolloutStore ? "Conectado" : "No configurado" : "Sin verificar"}</b></div><div className="service-row"><CircleAlert size={20}/><div><strong>Uso, costos e incidentes</strong><span>Falta integrar telemetría operativa</span></div><b>Pendiente</b></div></section></div><section id="seguridad" className="admin-panel access-panel"><div><KeyRound size={24}/><div><span className="eyebrow">ACCESO PROTEGIDO</span><h2>Conectar consola</h2><p>Introduce la clave administrativa configurada como secreto del Worker. Se mantiene solo en la memoria de esta página.</p></div></div><div className="access-form"><input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Clave administrativa" aria-label="Clave administrativa"/><button className="button button-dark" disabled={!token || busy} onClick={() => void connect()}>{busy ? "Conectando…" : "Conectar"}</button></div>{message && <p role="status" className="access-message">{message}</p>}</section><div className="admin-footer"><span><CheckCircle2 size={17}/> Sin cifras inventadas: se muestran solo señales comprobables.</span><a href="/">Volver al sitio <ArrowUpRight size={16}/></a></div></main></div>;
}
