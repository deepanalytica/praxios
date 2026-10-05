import { useState } from "react";
import {
  AgentCenter,
  DecisionCenter,
  EvidenceCenter,
  ExecutionCenter,
  HarvestCenter,
  MemoryCenter,
  OpportunityCenter,
  OSCommandCenter,
  ResourceCenter,
  SessionCenter,
  SystemCenter,
} from "./components/OperatingPages";
import { Portfolio } from "./components/Pages";

type View =
  | "command"
  | "harvest"
  | "sessions"
  | "memory"
  | "decisions"
  | "opportunities"
  | "execution"
  | "agents"
  | "evidence"
  | "resources"
  | "value"
  | "system";

const nav: Array<{ id: View; label: string; code: string; group: string }> = [
  { id: "command", label: "Command Center", code: "01", group: "GOVERN" },
  { id: "harvest", label: "Harvest", code: "02", group: "GOVERN" },
  { id: "sessions", label: "Sessions", code: "03", group: "GOVERN" },
  { id: "memory", label: "State Graph", code: "04", group: "THINK" },
  { id: "decisions", label: "Decisions", code: "05", group: "THINK" },
  { id: "opportunities", label: "Opportunity Radar", code: "06", group: "THINK" },
  { id: "execution", label: "Execution", code: "07", group: "ACT" },
  { id: "agents", label: "Agent Workforce", code: "08", group: "ACT" },
  { id: "evidence", label: "Evidence", code: "09", group: "ACT" },
  { id: "resources", label: "Resources", code: "10", group: "SYSTEM" },
  { id: "value", label: "Value Factory", code: "11", group: "SYSTEM" },
  { id: "system", label: "Meta-Harness", code: "12", group: "SYSTEM" },
];

function Screen({ view }: { view: View }) {
  switch (view) {
    case "harvest": return <HarvestCenter />;
    case "sessions": return <SessionCenter />;
    case "memory": return <MemoryCenter />;
    case "decisions": return <DecisionCenter />;
    case "opportunities": return <OpportunityCenter />;
    case "execution": return <ExecutionCenter />;
    case "agents": return <AgentCenter />;
    case "evidence": return <EvidenceCenter />;
    case "resources": return <ResourceCenter />;
    case "value": return <Portfolio />;
    case "system": return <SystemCenter />;
    default: return <OSCommandCenter />;
  }
}

export default function App() {
  const [view, setView] = useState<View>("command");
  const [navOpen, setNavOpen] = useState(false);
  const active = nav.find((item) => item.id === view);
  const groups = [...new Set(nav.map((item) => item.group))];

  return (
    <div className="os-shell">
      <aside className={"os-sidebar " + (navOpen ? "is-open" : "")}>
        <div className="os-brand">
          <div className="os-brand-mark">P</div>
          <div>
            <strong>PRAXIOS</strong>
            <span>CONTROL PLANE</span>
          </div>
        </div>

        <div className="os-online"><i /> SYSTEM ONLINE</div>

        <nav>
          {groups.map((group) => (
            <div className="os-nav-group" key={group}>
              <span>{group}</span>
              {nav.filter((item) => item.group === group).map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={item.id === view ? "active" : ""}
                  onClick={() => {
                    setView(item.id);
                    setNavOpen(false);
                  }}
                >
                  <small>{item.code}</small>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="os-sidebar-bottom">
          <span>OPERATING PRINCIPLE</span>
          <strong>Evidence → Decision → Action → Result → Learning</strong>
        </div>
      </aside>

      <main className="os-main">
        <header className="os-topbar">
          <button type="button" className="os-mobile-menu" onClick={() => setNavOpen((value) => !value)}>☰</button>
          <div>
            <span>PRAXIOS / {active?.group} /</span>
            <strong>{active?.label}</strong>
          </div>
          <div className="os-topbar-right">
            <span className="os-live">● LIVE</span>
            <span>{new Date().toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" })}</span>
          </div>
        </header>
        <div className="os-content">
          <Screen view={view} />
        </div>
      </main>
    </div>
  );
}
