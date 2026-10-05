import type{ReactNode}from"react";
import type{ProjectState}from"../domain/types";
export const money=(v:number)=>new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(v);
export function SectionHeader({eyebrow,title,description,action}:{eyebrow:string;title:string;description?:string;action?:ReactNode}){return <div className="section-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description?<p className="section-description">{description}</p>:null}</div>{action?<div>{action}</div>:null}</div>}
export function StatusBadge({state}:{state:ProjectState}){return <span className={"status status-"+state.toLowerCase()}>{state}</span>}
export function Score({value}:{value:number}){return <div className="score" role="progressbar" aria-label="Opportunity score" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}><div className="score-value">{value}</div><div className="score-track"><span style={{width:value+"%"}}/></div></div>}
export function Trend({value}:{value:"up"|"down"|"flat"}){return <span className={"trend trend-"+value}>{value==="up"?"↗":value==="down"?"↘":"→"}</span>}
