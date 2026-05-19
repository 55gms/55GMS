const fs = require('fs').promises;
const path = require('path');

const root = path.join(__dirname, '..', 'static');
const backups = [];
const modified = [];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full);
    else if (e.isFile() && /\.(html|js)$/.test(e.name)) await processFile(full);
  }
}

async function processFile(file) {
  let content = await fs.readFile(file, 'utf8');
  let orig = content;

  // Back up
  const bak = file + '.bak';
  await fs.writeFile(bak, content, 'utf8');
  backups.push(bak);

  // Patterns to remove
  // 1) Remove Adsense script tags
  content = content.replace(/<script[^>]*src=["'][^"']*pagead2\.googlesyndication[^"']*["'][\s\S]*?<\/script>\s*/gi, '');
  // 2) Remove googlesyndication references with double slash src
  content = content.replace(/<script[^>]*src=["']["']?\/\/pagead2\.googlesyndication[^"']*["'][\s\S]*?<\/script>\s*/gi, '');
  // 3) Remove <ins class="adsbygoogle"> blocks
  content = content.replace(/<ins[^>]*class=["']adsbygoogle["'][\s\S]*?<\/ins>\s*/gi, '');
  // 4) Remove inline push scripts that call (adsbygoogle = window.adsbygoogle || []).push({});
  content = content.replace(/<script[^>]*>\s*\(adsbygoogle[\s\S]*?push\([\s\S]*?\);?\s*<\/script>\s*/gi, '');
  // 5) Remove elements that have data-ad-client or data-ad-slot attributes
  content = content.replace(/<[^>]+data-ad-(?:client|slot)[^>]*>\s*<\/[^>]+>\s*/gi, '');
  // 6) Remove small ad iframes/backfills referencing serve.playsaurus or other known ad hosts
  content = content.replace(/<iframe[^>]*(serve\.playsaurus|serve\.|adserver|doubleclick)[^>]*>[\s\S]*?<\/iframe>/gi, '');
  // 7) Remove javascript blocks that insert ad containers by id (simple heuristic)
  content = content.replace(/document\.getElementById\([^\)]*ad[^\)]*\)[\s\S]*?;/gi, '');

  // 8) Remove about:blank popup cloaks occurrences conservatively
  content = content.replace(/open\(\s*["']about:blank["']\s*,[\s\S]*?\);/gi, '/* popup removed */');
  content = content.replace(/location\.replace\([^\)]*google\.[^\)]+\);/gi, '/* popup redirect removed */');
  content = content.replace(/popup\.document\.[\s\S]*?;/gi, '/* popup DOM operations removed */');

  // 9) Remove references to ads.json fetch that trigger injection (optional)
  content = content.replace(/fetch\([^\)]*ads\.json[\s\S]*?\);/gi, '/* ads.json fetch removed */');

  // 10) Remove occurrences of the Adsense URL inside JS files
  content = content.replace(/https?:\/\/[\w\.-]*pagead2\.googlesyndication\.com[^\s"']*/gi, '');

  if (content !== orig) {
    await fs.writeFile(file, content, 'utf8');
    modified.push(file);
    console.log('Modified:', file);
  }
}

(async function main(){
  try {
    await walk(root);

    // Neutralize shared injector file if present
    const adJs = path.join(__dirname, '..', 'static', 'assets', 'js', 'ad.js');
    try {
      const adOrig = await fs.readFile(adJs, 'utf8');
      await fs.writeFile(adJs + '.bak', adOrig, 'utf8');
      const neutral = "// ad.js neutralized by cleanup script\nconsole.log('ad.js neutralized');\n";
      await fs.writeFile(adJs, neutral, 'utf8');
      modified.push(adJs);
      console.log('Neutralized:', adJs);
    } catch (e) {
      // no ad.js found — ignore
    }

    // Neutralize script.js ad injections conservatively
    const scriptJs = path.join(__dirname, '..', 'static', 'assets', 'js', 'script.js');
    try {
      const sOrig = await fs.readFile(scriptJs, 'utf8');
      await fs.writeFile(scriptJs + '.bak', sOrig, 'utf8');
      let s = sOrig.replace(/fetch\([^\)]*ads\.json[\s\S]*?\);/gi, '/* ads.json fetch removed */');
      s = s.replace(/open\(\s*["']about:blank["'][\s\S]*?\);/gi, '/* popup removed */');
      await fs.writeFile(scriptJs, s, 'utf8');
      modified.push(scriptJs);
      console.log('Neutralized:', scriptJs);
    } catch (e) {
      // ignore
    }

    console.log('\nCleanup complete. Files modified:', modified.length);
    if (modified.length) console.log(modified.join('\n'));
  } catch (err) {
    console.error('Error during cleanup:', err);
    process.exit(1);
  }
})();
