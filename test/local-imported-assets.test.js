import assert from 'node:assert/strict';
import test from 'node:test';
import express from 'express';
import http from 'node:http';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {mountGameAssetFallback} from '../utils/gameAssets.js';

const request=(port,file,headers={})=>new Promise((resolve,reject)=>{http.get({hostname:'127.0.0.1',port,path:file,headers},r=>{const chunks=[];r.on('data',b=>chunks.push(b));r.on('end',()=>resolve({status:r.statusCode,headers:r.headers,body:Buffer.concat(chunks)}));}).on('error',reject);});

test('imported payloads use local repository bytes, support ranges, and never fetch missing files upstream',async()=>{
 const root=mkdtempSync(path.join(os.tmpdir(),'game-assets-'));const priorRoot=process.env.GAME_ASSETS_ROOT;const priorFetch=globalThis.fetch;let externalRequests=0;
 mkdirSync(path.join(root,'static/misc/nitro-car'),{recursive:true});mkdirSync(path.join(root,'assets/misc/nitro-car'),{recursive:true});writeFileSync(path.join(root,'assets/misc/nitro-car/game.bin'),Buffer.from([0,1,2,3,4,5]));
 const late=path.join(root,'assets/misc/nitro-car/_ext/cdn.jsdelivr.net/gh/nitrocargit/files@7dd72a3bb91b01bab27aed39c0bbdd01b6e89a66/StreamingAssets');mkdirSync(late,{recursive:true});writeFileSync(path.join(late,'late.bin'),Buffer.from([6,7]));
 process.env.GAME_ASSETS_ROOT=path.join(root,'assets');globalThis.fetch=async()=>{externalRequests++;throw new Error('external request forbidden');};mkdirSync(path.join(root,'assets/lib/game-runtime/assets/js'),{recursive:true});writeFileSync(path.join(root,'assets/lib/game-runtime/assets/js/game-loader.js'),'window.fromAssetsRepository=true;');
 const app=express();mountGameAssetFallback(app,path.join(root,'static'));const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 try{
  const port=server.address().port;const shared=await request(port,'/lib/game-runtime/assets/js/game-loader.js');assert.equal(shared.status,200);assert.equal(shared.body.toString(),'window.fromAssetsRepository=true;');const full=await request(port,'/misc/nitro-car/game.bin');assert.equal(full.status,200);assert.deepEqual([...full.body],[0,1,2,3,4,5]);
  const partial=await request(port,'/misc/nitro-car/game.bin',{Range:'bytes=2-4'});assert.equal(partial.status,206);assert.deepEqual([...partial.body],[2,3,4]);assert.equal(partial.headers['content-range'],'bytes 2-4/6');
  const lateResponse=await request(port,'/misc/nitro-car/StreamingAssets/late.bin');assert.equal(lateResponse.status,200);assert.deepEqual([...lateResponse.body],[6,7]);
  assert.equal((await request(port,'/misc/nitro-car/missing.bin')).status,404);assert.equal(externalRequests,0);
 }finally{globalThis.fetch=priorFetch;if(priorRoot===undefined)delete process.env.GAME_ASSETS_ROOT;else process.env.GAME_ASSETS_ROOT=priorRoot;await new Promise(r=>server.close(r));rmSync(root,{recursive:true,force:true});}
});

test('missing files may use only their recorded source backup, without browser redirects',async()=>{
 const root=mkdtempSync(path.join(os.tmpdir(),'game-backup-'));const priorRoot=process.env.GAME_ASSETS_ROOT;const priorFetch=globalThis.fetch;const calls=[];
 mkdirSync(path.join(root,'static/misc/nitro-car'),{recursive:true});mkdirSync(path.join(root,'assets/misc/nitro-car'),{recursive:true});process.env.GAME_ASSETS_ROOT=path.join(root,'assets');globalThis.fetch=async url=>{calls.push(String(url));return new Response(Buffer.from([7,8,9]),{headers:{'content-type':'application/octet-stream'}});};
 const app=express();mountGameAssetFallback(app,path.join(root,'static'));const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 try{const r=await request(server.address().port,'/misc/nitro-car/_ext/cdn.jsdelivr.net/gh/nitrocargit/files@7dd72a3bb91b01bab27aed39c0bbdd01b6e89a66/assets/future.bin');assert.equal(r.status,200);assert.deepEqual([...r.body],[7,8,9]);assert.deepEqual(calls,['https://raw.githubusercontent.com/nitrocargit/files/7dd72a3bb91b01bab27aed39c0bbdd01b6e89a66/assets/future.bin']);assert.equal(r.headers.location,undefined);}finally{globalThis.fetch=priorFetch;if(priorRoot===undefined)delete process.env.GAME_ASSETS_ROOT;else process.env.GAME_ASSETS_ROOT=priorRoot;await new Promise(r=>server.close(r));rmSync(root,{recursive:true,force:true});}
});
