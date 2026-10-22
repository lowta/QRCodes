import {readdir,readFile,writeFile,mkdir,cp,stat,rm} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
export async function collect(root) {
 const counters=[], codes=new Set();
 for(const entry of await readdir(path.join(root,'counters'),{withFileTypes:true})) {
  if(!entry.isDirectory()) continue;
  if(!/^(?:00[1-9]|0[1-9]\d|[1-9]\d{2,})$/.test(entry.name)) throw Error(`ID inválido: ${entry.name}. Usá 001, 002…`);
  const folder=path.join(root,'counters',entry.name), data=JSON.parse(await readFile(path.join(folder,'datos.json'),'utf8'));
  for(const key of ['nombre','direccion','ciudad','codigoManual']) if(typeof data[key]!=='string' || !data[key].trim()) throw Error(`${entry.name}: falta ${key}`);
  if(typeof data.qr!=='string' || !/^[a-zA-Z0-9_-]+\.(png|jpg|jpeg|webp)$/i.test(data.qr)) throw Error(`${entry.name}: imagen QR inválida`);
  const image=await stat(path.join(folder,data.qr)); if(!image.isFile() || image.size>10*1024*1024) throw Error(`${entry.name}: imagen demasiado grande o inválida`);
  if(codes.has(data.codigoManual.trim())) throw Error(`${entry.name}: código manual duplicado`); codes.add(data.codigoManual.trim());
  counters.push({id:entry.name,...Object.fromEntries(['nombre','direccion','ciudad','codigoManual'].map(k=>[k,data[k].trim()])),qr:`counters/${entry.name}/${data.qr}`});
 }
 return counters.sort((a,b)=>Number(a.id)-Number(b.id));
}
async function build() { const root=process.cwd(), counters=await collect(root), output=path.join(root,'dist'); if(path.dirname(output)!==root || path.basename(output)!=='dist') throw Error('Unsafe output path'); await rm(output,{recursive:true,force:true}); await mkdir(output,{recursive:true}); await cp(path.join(root,'public'),output,{recursive:true}); for(const c of counters) { const target=path.join(output,c.qr); await mkdir(path.dirname(target),{recursive:true}); await cp(path.join(root,c.qr),target); } await writeFile(path.join(output,'counters.json'),JSON.stringify(counters,null,2)); await writeFile(path.join(output,'config.json'),JSON.stringify({repository:process.env.GITHUB_REPOSITORY || 'lowta/QRCodes'})); await writeFile(path.join(output,'.nojekyll'),''); console.log(`Build OK: ${counters.length} counters → dist/`); }
if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) await build();


