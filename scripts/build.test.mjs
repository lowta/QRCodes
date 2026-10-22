import {test} from 'node:test'; import assert from 'node:assert/strict'; import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises'; import os from 'node:os'; import path from 'node:path'; import {collect} from './build.mjs';
async function fixture(t) { const root=await mkdtemp(path.join(os.tmpdir(),'qrcounter-')); t.after(()=>rm(root,{recursive:true,force:true})); await mkdir(path.join(root,'counters')); return root; }
async function add(root,id,patch={}){const dir=path.join(root,'counters',id);await mkdir(dir);await writeFile(path.join(dir,'qr.png'),'fixture');await writeFile(path.join(dir,'datos.json'),JSON.stringify({nombre:'Counter',direccion:'Calle 1',ciudad:'Madrid',codigoManual:'001abc',qr:'qr.png',...patch}));}
test('empty vault is valid',async t=>{assert.deepEqual(await collect(await fixture(t)),[]);});
test('preserves fixed ID and leading zero in manual code',async t=>{const root=await fixture(t);await add(root,'001');const [c]=await collect(root);assert.equal(c.id,'001');assert.equal(c.codigoManual,'001abc');assert.equal(c.qr,'counters/001/qr.png');});
test('rejects missing required data',async t=>{const root=await fixture(t);await add(root,'001',{ciudad:''});await assert.rejects(collect(root),/ciudad/);});
test('rejects duplicate manual code',async t=>{const root=await fixture(t);await add(root,'001');await add(root,'002');await assert.rejects(collect(root),/duplicado/);});
test('rejects image path traversal',async t=>{const root=await fixture(t);await add(root,'001',{qr:'../qr.png'});await assert.rejects(collect(root),/imagen QR/);});
