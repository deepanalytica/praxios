import{useState}from"react";
import{ActionQueuePage,AgentOfficeOS,DecisionCenter,FinanceOSPage,OpportunityRadar,OSCommandCenter,PortfolioOS,ResourcesPage,RevenueEnginePage,SessionGateway,StateGraphPage,SystemPage,WorkflowsPage}from"./components/OSPages";
import{PraxiosProvider}from"./os/store";

type View="command"|"harvest"|"graph"|"decisions"|"opportunities"|"actions"|"workflows"|"portfolio"|"agents"|"revenue"|"finance"|"resources"|"system";
const nav:Array<{id:View;label:string;code:string}>=[
  {id:"command",label:"Command Center",code:"01"},
  {id:"harvest",label:"Session Harvest",code:"02"},
  {id:"graph",label:"State Graph",code:"03"},
  {id:"decisions",label:"Decision Engine",code:"04"},
  {id:"opportunities",label:"Opportunity Radar",code:"05"},
  {id:"actions",label:"Action Queue",code:"06"},
  {id:"workflows",label:"Pipelines",code:"07"},
  {id:"portfolio",label:"Portfolio",code:"08"},
  {id:"agents",label:"Agent Office",code:"09"},
  {id:"revenue",label:"Revenue",code:"10"},
  {id:"finance",label:"Finance",code:"11"},
  {id:"resources",label:"Resources",code:"12"},
  {id:"system",label:"Meta-Harness",code:"13"},
];

function Screen({view}:{view:View}){
  switch(view){
    case"harvest":return <SessionGateway/>;
    case"graph":return <StateGraphPage/>;
    case"decisions":return <DecisionCenter/>;
    case"opportunities":return <OpportunityRadar/>;
    case"actions":return <ActionQueuePage/>;
    case"workflows":return <WorkflowsPage/>;
    case"portfolio":return <PortfolioOS/>;
    case"agents":return <AgentOfficeOS/>;
    case"revenue":return <RevenueEnginePage/>;
    case"finance":return <FinanceOSPage/>;
    case"resources":return <ResourcesPage/>;
    case"system":return <SystemPage/>;
    default:return <OSCommandCenter/>;
  }
}

function PraxiosShell(){
  const[view,setView]=useState<View>("command");
  const[navOpen,setNavOpen]=useState(false);
  const active=nav.find(i=>i.id===view);
  return <div className="app-shell">
    <aside className={"sidebar "+(navOpen?"sidebar-open":"")}>
      <div className="brand"><div className="brand-mark">P</div><div><strong>PRAXIOS</strong><span>OPERATING SYSTEM</span></div></div>
      <div className="system-state"><i/><span>CONTROL PLANE ONLINE</span></div>
      <nav className="os-nav">{nav.map(i=><button type="button" className={view===i.id?"nav-active":""} key={i.id} onClick={()=>{setView(i.id);setNavOpen(false)}}><span>{i.code}</span>{i.label}</button>)}</nav>
      <div className="sidebar-footer">
        <span>MISSION</span><strong>+$1.000.000 CLP</strong><p>validated additional cash</p>
        <div className="mission-track"><i style={{width:"43%"}}/></div><small>PRAXIOS OS · V1</small>
      </div>
    </aside>
    <main>
      <header className="topbar">
        <button type="button" className="mobile-menu" onClick={()=>setNavOpen(v=>!v)} aria-label="Abrir navegación">☰</button>
        <span className="topbar-path">PRAXIOS OS / {active?.label.toUpperCase()}</span>
        <div className="topbar-right"><div className="live-dot"><i/> STATE LIVE</div><span>LOCAL PERSISTENCE</span></div>
      </header>
      <div className="content"><Screen view={view}/></div>
    </main>
  </div>;
}

export default function App(){return <PraxiosProvider><PraxiosShell/></PraxiosProvider>}
