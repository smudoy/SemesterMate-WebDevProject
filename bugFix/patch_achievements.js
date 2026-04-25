const fs = require('fs');
const file = 'index-B7XPMFMR.js';
let content = fs.readFileSync(file, 'utf8');

const startStr = 'u.jsxs("div",{"code-path":"src/App.tsx:798:13",className:"card"';
const endStr = ',u.jsxs("div",{"code-path":"src/App.tsx:807:13"';

const start = content.indexOf(startStr);
const end = content.indexOf(endStr);

if(start !== -1 && end !== -1) {
    content = content.substring(0, start) + 'null' + content.substring(end);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Achievements section removed!');
} else {
    console.log('Could not find start or end', start, end);
}
