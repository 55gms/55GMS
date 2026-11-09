#!/usr/bin/env node
// Keep imported game entrypoints and their shared static dependency closure in
// the assets repository's existing misc/ and lib/ layout.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import crypto from 'node:crypto';
const site=fileURLToPath(new URL('../',import.meta.url));
const assets=path.resolve(site,'../assets');
const root=path.join(site,'static');
const prefix='/lib/game-runtime';
const games=JSON.parse(fs.readFileSync(path.join(site,'docs/game-imports/metadata.json')));
const files=new Set();
for(const game of games){
 const filename=path.join(root,'misc',game.folder,'index.html');
 let html=fs.readFileSync(filename,'utf8');
 for(const match of html.matchAll(/(?:src|href)=["'](\/assets\/[^"']+)/g))files.add(match[1].split('?')[0]);
 // Only shared script URLs are relocated; nested upstream /assets/ game paths
 // retain the original game's directory structure.
 html=html.replace(/(["'])\/assets\/js\//g,`$1${prefix}/assets/js/`);
 fs.writeFileSync(filename,html);
 fs.copyFileSync(filename,path.join(assets,'misc',game.folder,'index.html'));
}
// Repeated runs discover the already-localized shared script references too.
for(const game of games){
 const html=fs.readFileSync(path.join(root,'misc',game.folder,'index.html'),'utf8');
 for(const m of html.matchAll(/(?:src|href)=["']\/lib\/game-runtime(\/assets\/[^"']+)/g))files.add(m[1].split('?')[0]);
}
const queue=[...files];
for(let i=0;i<queue.length;i++){
 const file=queue[i];const source=file==='/socket.io/socket.io.js'?path.join(site,'node_modules/socket.io/client-dist/socket.io.js'):path.join(root,file);
 if(!fs.existsSync(source))throw Error('Missing shared dependency: '+file);
 if(!/\.(js|css)$/.test(file))continue;
 const text=fs.readFileSync(source,'utf8');
 for(const m of text.matchAll(/["'`](\/assets\/[^"'`?\s${}]+|\/socket\.io\/socket\.io\.js)/g)){
  if(!files.has(m[1])){files.add(m[1]);queue.push(m[1]);}
 }
}
const result=[];
for(const file of files){
 let source=path.join(root,file);
 if(file==='/socket.io/socket.io.js')source=path.join(site,'node_modules/socket.io/client-dist/socket.io.js');
 let data=fs.readFileSync(source);
 if(/\.(js|css)$/.test(file))data=Buffer.from(data.toString().replaceAll('/assets/',prefix+'/assets/').replaceAll('/socket.io/socket.io.js',prefix+'/socket.io/socket.io.js'));
 const destination=path.join(assets,prefix,file);fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,data);
 result.push({path:path.relative(assets,destination),bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex')});
 if(file==='/socket.io/socket.io.js'){
  const map=source+'.map';if(fs.existsSync(map)){fs.copyFileSync(map,destination+'.map');const b=fs.readFileSync(map);result.push({path:path.relative(assets,destination+'.map'),bytes:b.length,sha256:crypto.createHash('sha256').update(b).digest('hex')});}
 }
}
const manifest={sourceRepository:'55gms/55GMS',sourceCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:site,encoding:'utf8'}).trim(),games:games.length,files:result};
fs.writeFileSync(path.join(assets,'lib/game-runtime/manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Mirrored ${result.length} shared runtime files and ${games.length} entrypoints`);
