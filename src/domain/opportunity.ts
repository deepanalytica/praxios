import type{ProjectState}from"./types";
export interface OpportunityFactors{demand:number;speedToCash:number;margin:number;ltv:number;recurring:number;advantage:number;scalability:number;distribution:number;risk:number;founderLoad:number;capitalLoad:number;complexity:number}
const clamp=(v:number)=>Math.max(0,Math.min(100,v));
export function calculateOpportunityScore(f:OpportunityFactors):number{
 const positive=f.demand*.20+f.speedToCash*.15+f.margin*.15+f.ltv*.10+f.recurring*.10+f.advantage*.10+f.scalability*.10+f.distribution*.10;
 const penalty=f.risk*.10+f.founderLoad*.15+f.capitalLoad*.10+f.complexity*.10;
 return Math.round(clamp(positive-penalty*.55));
}
export function stateForScore(score:number):ProjectState{
 if(score>=80)return"SCALE";if(score>=65)return"BUILD";if(score>=50)return"TEST";if(score>=30)return"HOLD";return"KILL";
}
