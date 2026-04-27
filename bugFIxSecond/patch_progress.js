// filepath: patch_progress.js
// Patch to replace localStorage progress with Supabase-backed window.smProg.count()

const fs = require('fs');
const path = require('path');

const jsFile = path.join(__dirname, 'index-B7XPMFMR.js');
let content = fs.readFileSync(jsFile, 'utf8');

console.log('Patching progress logic to use Supabase...');

// 1. Dashboard summary stats - replace localStorage.getItem("sm_done_"+k) with window.smProg.count(k)
content = content.replace(
  /let tops=0;\["sp","ch","hu","ma","ee"\]\.forEach\(k=>\{try\{tops\+=\+JSON\.parse\(localStorage\.getItem\("sm_done_"\+k\)\|\|"\[\]"\)\.length\}catch\(e\}\{\}\}\);/g,
  `let tops=0;["sp","ch","hu","ma","ee"].forEach(k=>{try{tops+=window.smProg.count(k)}catch(e){}});`
);

// 2. Dashboard Subject Progress - replace localStorage.getItem("sm_done_"+C.id) with window.smProg.count(C.id)
content = content.replace(
  /const V=\(function\(\)\{try\{let d=JSON\.parse\(localStorage\.getItem\("sm_done_"\+C\.id\)\|\|"\[\]"\)\.length;return Math\.round\(\(d\/C\.topics\.length\)\*100\)\}catch\(e\)\{return 0\}\}\)\(\);/g,
  `const V=(function(){try{let d=window.smProg.count(C.id);return Math.round((d/C.topics.length)*100)}catch(e){return 0}})();`
);

// 3. Study Materials page - replace localStorage.getItem("sm_done_"+r.id) with window.smProg.count(r.id)
content = content.replace(
  /const C=\(function\(\)\{try\{let d=JSON\.parse\(localStorage\.getItem\("sm_done_"\+r\.id\)\|\|"\[\]"\)\.length;return Math\.round\(\(d\/r\.topics\.length\)\*100\)\}catch\(e\)\{return 0\}\}\)\(\),/g,
  `const C=(function(){try{let d=window.smProg.count(r.id);return Math.round((d/r.topics.length)*100)}catch(e){return 0}})(),`
);

// 4. Subject page - replace Xi(`sm_done_${T.id}`,[]) with window.smProg.get(T.id) or []
// The Xi hook uses localStorage, we need to replace it with Supabase cache
content = content.replace(
  /\[r,M\]=Xi\(`sm_done_\$\{T\.id\}`,\[\]\),/g,
  `[r,M]=(function(){const arr=window.smProg.get?window.smProg.get(T.id):[];return[arr,(c)=>c]})(),`
);

fs.writeFileSync(jsFile, content, 'utf8');
console.log('✅ Progress logic patched successfully!');
console.log('Now using window.smProg.count() instead of localStorage for progress data.');