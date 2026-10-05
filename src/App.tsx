import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Layers3, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import LearnApp from "./apps/LearnApp";
import CreateApp from "./apps/CreateApp";
import ImplementApp from "./apps/ImplementApp";
import AdminApp from "./apps/AdminApp";

export const paths = { home: "/", learn: "/aprende", create: "/crea", implement: "/implementa", admin: "/admin" };

export function Brand({ light = false }: { light?: boolean }) {
  return <a className={`brand ${light ? "brand-light" : ""}`} href="/" aria-label="Educabot, inicio"><span className="brand-mark">e<span>.</span></span><span>educabot</span></a>;
}

export function AppHeader({ product, tone = "light" }: { product: string; tone?: "light" | "dark" }) {
  return <header className={`app-header app-header-${tone}`}><Brand light={tone === "dark"}/><span className="header-divider"/><span className="product-label">{product}</span><nav aria-label="Otras aplicaciones"><a href="/aprende">Aprende</a><a href="/crea">Crea</a><a href="/implementa">Implementa</a></nav></header>;
}

function Home() {
  return <div className="site-home">
    <header className="site-header"><Brand light/><nav aria-label="Productos"><a href="#productos">Productos</a><a href="#enfoque">Enfoque</a><a className="nav-cta" href="/aprende">Explorar Aprende <ArrowRight size={15}/></a></nav></header>
    <main>
      <section className="home-hero"><div className="hero-copy"><div className="eyebrow light">UNA IDEA. EXPERIENCIAS PROPIAS.</div><h1>Aprender de verdad<br/><em>con inteligencia artificial.</em></h1><p>Una IA que ayuda a pensar, practicar y explicar. Para estudiantes que quieren avanzar y docentes que quieren tener más tiempo para enseñar.</p><div className="hero-actions"><a className="button button-coral" href="/aprende">Conocer Educabot Aprende <ArrowRight size={17}/></a><a className="text-link light-link" href="/crea">Soy docente <ArrowRight size={16}/></a></div></div><div className="hero-art" aria-hidden="true"><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/><div className="hero-center">¿Y si lo<br/>entiendo<br/><i>de verdad?</i></div><div className="float-note note-one">Prueba una idea</div><div className="float-note note-two">Explica con tus palabras</div><div className="float-note note-three">Vuelve a intentar</div></div></section>
      <section id="productos" className="product-section"><div className="section-intro"><span className="eyebrow">ELIGE TU ESPACIO</span><h2>Cada persona necesita<br/>una herramienta distinta.</h2><p>Separadas para que cada experiencia se sienta propia. Conectadas por una misma idea: la IA acompaña el aprendizaje, no lo sustituye.</p></div><div className="product-list">
        <article className="product-row learn-row"><div className="product-number">01 / PARA ESTUDIANTES Y FAMILIAS</div><div><span className="product-icon"><Sparkles size={23}/></span><h3>Aprende</h3><p>Comprender un tema, practicar paso a paso y mostrar qué puedes hacer sin que alguien piense por ti.</p><a href="/aprende" className="text-link">Entrar a Aprende <ArrowRight size={17}/></a></div><div className="product-visual learn-visual"><div className="mini-math">⅓ <span>+</span> ⅓ <span>=</span> ?</div><div className="visual-caption">Una pregunta a la vez. Tu razonamiento primero.</div></div></article>
        <article className="product-row create-row"><div className="product-number">02 / PARA DOCENTES</div><div><span className="product-icon"><BookOpen size={23}/></span><h3>Crea</h3><p>Prepara un borrador de clase y su secuencia en minutos. Revisa los hechos y decide tú qué entra al aula. Puedes usarlo aunque tu colegio no lo contrate.</p><a href="/crea" className="text-link">Entrar a Crea <ArrowRight size={17}/></a></div><div className="product-visual create-visual"><span>OBJETIVO DE CLASE</span><strong>De una idea a una clase lista para revisar.</strong><div className="visual-lines"><i/><i/><i/></div></div></article>
        <article className="product-row implement-row"><div className="product-number">03 / PARA INSTITUCIONES · ETAPA POSTERIOR</div><div><span className="product-icon"><Layers3 size={23}/></span><h3>Implementa</h3><p>Una vista institucional para seguir la puesta en práctica de contenidos y detectar dónde hace falta apoyo. Se desarrollará después de validar el aprendizaje.</p><a href="/implementa" className="text-link">Ver concepto <ArrowRight size={17}/></a></div><div className="product-visual implement-visual"><div className="track-line"><b/><b/><b/><b/></div><span>Planificar → Usar → Observar → Mejorar</span></div></article>
      </div></section>
      <section id="enfoque" className="promise-section"><div><span className="eyebrow light">NUESTRO PUNTO DE PARTIDA</span><h2>La pregunta no es si usará IA.<br/><em>Es qué aprenderá al usarla.</em></h2></div><div className="promise-grid"><p><ShieldCheck size={22}/> Mostrar qué se sabe, qué falta comprobar y cuándo es mejor decir “no sé”.</p><p><Wrench size={22}/> Empezar por experiencias útiles para estudiantes y docentes, sin depender de una compra institucional.</p></div></section>
    </main><footer className="site-footer"><Brand/><span>Educabot · Un proyecto de PRAXIOS</span><a href="/admin">Consola interna</a></footer>
  </div>;
}

export default function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  useEffect(() => { document.title = ({ "/": "Educabot — Aprender de verdad con IA", "/aprende": "Aprende · Educabot", "/crea": "Crea · Educabot", "/implementa": "Implementa · Educabot", "/admin": "Consola interna · Educabot" } as Record<string, string>)[path] || "Educabot"; }, [path]);
  const [rollout, setRollout] = useState<Record<string, boolean>>({ aprende: true, crea: true, implementa: true });
  useEffect(() => { fetch("/api/config", { headers: { accept: "application/json" } }).then((response) => response.json()).then((data: { rollout?: Record<string, boolean> }) => { if (data.rollout) setRollout(data.rollout); }).catch(() => {}); }, []);
  const key = path === paths.learn ? "aprende" : path === paths.create ? "crea" : path === paths.implement ? "implementa" : null;
  if (key && rollout[key] === false) return <div className="closed-product"><Brand/><h1>Este espacio está en pausa.</h1><p>El equipo de Educabot lo habilitará cuando esté listo.</p><a className="button button-dark" href="/">Volver al inicio</a></div>;
  if (path === paths.learn) return <LearnApp/>;
  if (path === paths.create) return <CreateApp/>;
  if (path === paths.implement) return <ImplementApp/>;
  if (path === paths.admin) return <AdminApp/>;
  return <Home/>;
}
