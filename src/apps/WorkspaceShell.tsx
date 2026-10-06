import type { ReactNode } from "react";
import { ArrowUpRight, Bell, ChevronDown } from "lucide-react";

export type NavItem<Key extends string> = { key: Key; label: string; icon: ReactNode };

export default function WorkspaceShell<Key extends string>({ product, eyebrow, nav, active, onNavigate, children, switchHref, switchLabel, footer }: {
  product: string;
  eyebrow: string;
  nav: NavItem<Key>[];
  active: Key;
  onNavigate: (key: Key) => void;
  children: ReactNode;
  switchHref: string;
  switchLabel: string;
  footer?: ReactNode;
}) {
  return <div className="p-shell">
    <aside className="p-sidebar">
      <div className="p-sidebar-head"><a className="p-brand" href="/"><span>e<span>.</span></span>educabot</a><div className="p-product"><span>{eyebrow}</span><strong>{product}</strong></div></div>
      <nav className="p-nav" aria-label={`Navegación de ${product}`}>{nav.map((item) => <button key={item.key} className={active === item.key ? "is-active" : ""} onClick={() => onNavigate(item.key)} aria-current={active === item.key ? "page" : undefined}>{item.icon}<span>{item.label}</span></button>)}</nav>
      <div className="p-sidebar-footer">{footer}<a href={switchHref}>{switchLabel}<ArrowUpRight size={15}/></a></div>
    </aside>
    <div className="p-main-wrap"><header className="p-topbar"><div className="p-crumb">Educabot <span>/</span> {product} <ChevronDown size={14}/></div><div className="p-top-actions"><span className="p-demo-tag">ENTORNO DE DEMOSTRACIÓN</span><button className="p-icon-button" aria-label="Avisos de la demo" title="No hay avisos conectados"><Bell size={17}/></button><div className="p-avatar" aria-label="Perfil de demostración">E</div></div></header><main className="p-main">{children}</main></div>
  </div>;
}
