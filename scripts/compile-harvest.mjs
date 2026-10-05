import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const harvestDir=path.join(root,"praxios","harvest");
const output=path.join(root,"src","generated","harvest.generated.ts");
const briefOutput=path.join(root,"praxios","state","HARVEST_BRIEF.md");

fs.mkdirSync(harvestDir,{recursive:true});
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.mkdirSync(path.dirname(briefOutput),{recursive:true});

const files=fs.readdirSync(harvestDir)
  .filter(name=>name.endsWith(".json"))
  .sort();

const bundles=[];
const errors=[];
for(const name of files){
  try{
    const raw=fs.readFileSync(path.join(harvestDir,name),"utf8");
    const value=JSON.parse(raw);
    if(value?.schemaVersion!=="1.0"||!value?.sessionId||!Array.isArray(value?.items)){
      errors.push(`${name}: schema inválido`);
      continue;
    }
    bundles.push(value);
  }catch(error){
    errors.push(`${name}: ${error instanceof Error?error.message:String(error)}`);
  }
}
if(errors.length){
  console.error("Harvest compilation failed:");
  for(const error of errors)console.error(" -",error);
  process.exit(1);
}

const ordered=[...bundles].sort((a,b)=>String(b.createdAt||"").localeCompare(String(a.createdAt||"")));
const source=`import type{HarvestBundle}from"../os/types";\nexport const generatedHarvest:HarvestBundle[]=${JSON.stringify(ordered,null,2)};\n`;
fs.writeFileSync(output,source);

const recent=ordered.slice(0,12);
const items=recent.flatMap(bundle=>(bundle.items||[]).map(item=>({...item,sessionTitle:bundle.title,createdAt:bundle.createdAt})));
const sections=[
  ["decision","DECISIONES"],
  ["opportunity","OPORTUNIDADES"],
  ["risk","RIESGOS"],
  ["task","TAREAS ABIERTAS"],
  ["evidence","EVIDENCIA"],
  ["finding","HALLAZGOS"],
  ["idea","IDEAS"],
];
let brief=`# PRAXIOS GENERATED HARVEST BRIEF\n\nGenerated locally from \`praxios/harvest/*.json\`.\n\n## Recent sessions\n\n`;
for(const bundle of recent){
  brief+=`- **${bundle.title}** · ${bundle.source} · ${bundle.project||"transversal"} · ${bundle.createdAt||"sin fecha"}\n  - ${bundle.summary||"Sin resumen"}\n`;
}
for(const [kind,label] of sections){
  const selected=items.filter(item=>item.kind===kind).slice(0,12);
  brief+=`\n## ${label}\n\n`;
  if(!selected.length){brief+="- Sin objetos recientes.\n";continue}
  for(const item of selected){
    brief+=`- **${item.title}**${item.project?` · ${item.project}`:""} · confidence ${item.confidence??70}%\n  - ${item.summary||item.title}\n`;
  }
}
brief+=`\n## Operating rule\n\nThis file is generated context, not human authority. Explicit user decisions and \`STATE_BRIEF.md\` take precedence.\n`;
fs.writeFileSync(briefOutput,brief);

console.log(`Compiled ${bundles.length} PRAXIOS harvest bundle(s) and generated HARVEST_BRIEF.md.`);
