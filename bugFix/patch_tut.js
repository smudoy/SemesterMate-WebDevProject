const fs = require('fs');
const file = 'SemesterMoon.html';
let content = fs.readFileSync(file, 'utf8');

const target = 'const C=O?.[r.id]||[20,35,15,45,10][M];';
const replacement = 'const C=(function(){try{let d=JSON.parse(localStorage.getItem("sm_done_"+r.id)||"[]").length;return Math.round((d/r.topics.length)*100)}catch(e){return 0}})();';

if(content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed Tutorials progress bar!');
} else {
    console.log('Target not found!');
}
