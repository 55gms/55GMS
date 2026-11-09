#!/usr/bin/env node
// Install the pinned repository at deployment time; games never fetch upstream.
import {readFileSync, existsSync, mkdirSync, writeFileSync, renameSync, rmSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const appRoot=fileURLToPath(new URL('../',import.meta.url));
const pin=JSON.parse(readFileSync(path.join(appRoot,'docs/game-imports/asset-mirror.json'),'utf8'));
if(pin.repository!=='https://github.com/55gms/assets.git'||!/^[a-f0-9]{40}$/.test(pin.commit)||!Array.isArray(pin.folders)||pin.folders.some(f=>!/^[-a-z0-9]+$/.test(f)))throw new Error('Invalid game asset pin');
const destination=path.join(appRoot,'.game-assets',pin.commit);
if(existsSync(path.join(destination,'.mirror-ready'))){console.log(`Game assets ${pin.commit} already installed`);process.exit(0);}
const stage=destination+'.partial-'+process.pid;
mkdirSync(path.dirname(destination),{recursive:true});
const git=(...args)=>execFileSync('git',args,{cwd:stage,stdio:'inherit'});
try{
 mkdirSync(stage);git('init','--quiet');git('remote','add','origin',pin.repository);git('fetch','--depth=1','--filter=blob:none','origin',pin.commit);
 git('sparse-checkout','init','--cone');git('sparse-checkout','set','lib/game-runtime',...pin.folders.map(f=>'misc/'+f));git('checkout','--quiet','--detach','FETCH_HEAD');
 for(const folder of pin.folders)if(!existsSync(path.join(stage,'misc',folder,'index.html')))throw new Error('Missing mirrored entrypoint: '+folder);
 if(!existsSync(path.join(stage,'lib/game-runtime/manifest.json')))throw new Error('Missing shared runtime manifest');
 writeFileSync(path.join(stage,'.mirror-ready'),pin.commit+'\n');renameSync(stage,destination);console.log(`Installed game assets ${pin.commit}`);
}catch(error){rmSync(stage,{recursive:true,force:true});throw error;}
