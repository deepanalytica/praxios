import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const harvestDir=path.join(root,"praxios","harvest");
const output=path.join(root,"src","generated","harvest.generated.ts");

fs.mkdirSync(harvestDir,{recursive:true});
fs.mkdirSync(path.dirname(output),{recursive:true});

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
const source=`import type{HarvestBundle}from"../os/types";\nexport const generatedHarvest:HarvestBundle[]=${JSON.stringify(bundles,null,2)};\n`;
fs.writeFileSync(output,source);
console.log(`Compiled ${bundles.length} PRAXIOS harvest bundle(s).`);
