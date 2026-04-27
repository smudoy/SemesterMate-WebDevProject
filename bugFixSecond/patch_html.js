const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'SemesterMoon.html');
let content = fs.readFileSync(targetFile, 'utf8');
let originalContent = content;

console.log("Read SemesterMoon.html. Size:", content.length);

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
const startStr = 'u.jsxs("div",{"code-path":"src/App.tsx:798:13",className:"card"';
const endStr = ',u.jsxs("div",{"code-path":"src/App.tsx:807:13"';

const start = content.indexOf(startStr);
const end = content.indexOf(endStr);

if(start !== -1 && end !== -1) {
    content = content.substring(0, start) + 'null' + content.substring(end);
    console.log('Patch 5: Achievements section removed successfully.');
} else {
    console.log('Patch 5: Could not find achievements section!', start, end);
}

if (content !== originalContent) {
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log("Successfully wrote patched file SemesterMoon.html!");
} else {
    console.log("No changes made!");
}
