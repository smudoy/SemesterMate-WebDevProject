const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'index-B7XPMFMR.js');
let content = fs.readFileSync(targetFile, 'utf8');
let originalContent = content;

console.log("Read index-B7XPMFMR.js. Size:", content.length);

// 1. Fix Login Logic
const loginOriginal = `ct=Z=>{if(Z){if(!M.email||!M.password){y("Please fill all fields.");return}}else{if(!M.name||!M.email||!M.password){y("Please fill all fields.");return}if(M.password!==M.confirm){y("Passwords don't match.");return}}w(!0),setTimeout(()=>{const pt=Z?{name:M.email.split("@")[0],email:M.email,semester:"1st"}:{name:M.name,email:M.email,semester:M.semester};localStorage.setItem("sm_user",JSON.stringify(pt)),O(pt),b("dashboard"),w(!1)},800)};`;

const loginNew = `ct=Z=>{if(Z){if(!M.email||!M.password){y("Please fill all fields.");return}}else{if(!M.name||!M.email||!M.password){y("Please fill all fields.");return}if(M.password!==M.confirm){y("Passwords don't match.");return}}w(!0),setTimeout(()=>{let users=JSON.parse(localStorage.getItem("sm_users")||"[]");let pt=null;if(Z){pt=users.find(u=>u.email===M.email&&u.password===M.password);if(!pt){w(!1);y("Invalid credentials.");return}}else{pt={name:M.name,email:M.email,password:M.password,semester:M.semester};users.push(pt);localStorage.setItem("sm_users",JSON.stringify(users))}localStorage.setItem("sm_user",JSON.stringify(pt));O(pt);b("dashboard");w(!1)},800)};`;

if (content.includes(loginOriginal)) {
    content = content.replace(loginOriginal, loginNew);
    console.log("Patch 1: Login logic replaced successfully.");
} else {
    console.log("Patch 1: Could not find login logic!");
}

// 2. Fix Dashboard Static Data
const dashStaticOriginal = `[{icon:"⏱️",val:"12h",label:"Study Hours",color:"var(--purple)"},{icon:"✅",val:"8",label:"Tasks Done",color:"var(--green)"},{icon:"📖",val:"23",label:"Topics Done",color:"var(--pink)"},{icon:"🔥",val:"7",label:"Day Streak",color:"#f59e0b"}]`;

const dashStaticNew = `(function(){let tops=0;["sp","ch","hu","ma","ee"].forEach(k=>{try{tops+=JSON.parse(localStorage.getItem("sm_done_"+k)||"[]").length}catch(e){}});let streak=1;try{streak=JSON.parse(localStorage.getItem("sm_user"))?.streak||1}catch(e){}return [{icon:"⏱️",val:Math.floor(tops*1.5)+"h",label:"Study Hours",color:"var(--purple)"},{icon:"✅",val:Math.floor(tops/2)+"",label:"Tasks Done",color:"var(--green)"},{icon:"📖",val:tops+"",label:"Topics Done",color:"var(--pink)"},{icon:"🔥",val:streak+"",label:"Day Streak",color:"#f59e0b"}]})()`;

if (content.includes(dashStaticOriginal)) {
    content = content.replace(dashStaticOriginal, dashStaticNew);
    console.log("Patch 2: Dashboard static data replaced successfully.");
} else {
    console.log("Patch 2: Could not find dashboard static data!");
}

// 3. Fix Dashboard Subject Progress Bars
const dashProgressOriginal = `const V=T?.[C.id]||[20,35,15,45,10][B];`;
const dashProgressNew = `const V=(function(){try{let d=JSON.parse(localStorage.getItem("sm_done_"+C.id)||"[]").length;return Math.round((d/C.topics.length)*100)}catch(e){return 0}})();`;

if (content.includes(dashProgressOriginal)) {
    content = content.replace(dashProgressOriginal, dashProgressNew);
    console.log("Patch 3: Dashboard progress bars replaced successfully.");
} else {
    console.log("Patch 3: Could not find dashboard progress bars!");
}

// 4. Fix Tutorials Subject Progress Bars
const tutProgressOriginal = `const C=O?.[r.id]||[20,35,15,45,10][M],`;
const tutProgressNew = `const C=(function(){try{let d=JSON.parse(localStorage.getItem("sm_done_"+r.id)||"[]").length;return Math.round((d/r.topics.length)*100)}catch(e){return 0}})(),`;

if (content.includes(tutProgressOriginal)) {
    content = content.replace(tutProgressOriginal, tutProgressNew);
    console.log("Patch 4: Tutorials progress bars replaced successfully.");
} else {
    console.log("Patch 4: Could not find tutorials progress bars!");
}

// 5. Remove Achievements Section
const achievementsOriginal = `u.jsxs("div",{"code-path":"src/App.tsx:798:13",className:"card",style:{padding:22},children:[u.jsx("h3",{"code-path":"src/App.tsx:799:15",style:{fontSize:15,fontWeight:700,marginBottom:14},children:"Achievements"}),M.map(C=>u.jsxs("div",{"code-path":"src/App.tsx:801:17",style:{display:"flex",alignItems:"center",gap:11,marginBottom:11,opacity:C.earned?1:.4},children:[u.jsx("div",{"code-path":"src/App.tsx:802:19",style:{width:34,height:34,borderRadius:10,background:C.earned?"linear-gradient(135deg,var(--purple),var(--pink))":"var(--card2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0},children:C.icon}),u.jsxs("div",{"code-path":"src/App.tsx:803:19",children:[u.jsx("div",{"code-path":"src/App.tsx:803:24",style:{fontSize:14,fontWeight:600},children:C.label}),u.jsx("div",{"code-path":"src/App.tsx:803:98",style:{fontSize:11,color:"var(--text3)",marginTop:2},children:C.earned?"Unlocked":"Locked"})]})]},C.label))]})`;

// Also need to remove the surrounding array structure carefully?
// The actual parent is:
// `u.jsxs("div",{"code-path":"src/App.tsx:797:11",style:{display:"flex",flexDirection:"column",gap:24},children:[u.jsxs("div",{"code-path":"src/App.tsx:798:13", ... })]})`
// If we replace `u.jsxs("div",{"code-path":"src/App.tsx:798:13", ... ` with `null`, it will be `children:[null]` which React handles fine.

if (content.includes(achievementsOriginal)) {
    content = content.replace(achievementsOriginal, 'null');
    console.log("Patch 5: Achievements section removed successfully.");
} else {
    console.log("Patch 5: Could not find achievements section!");
}

if (content !== originalContent) {
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log("Successfully wrote patched file!");
} else {
    console.log("No changes made!");
}
