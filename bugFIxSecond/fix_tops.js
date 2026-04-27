const fs = require('fs');

const jsFile = 'index-B7XPMFMR.js';
const htmlFile = 'SemesterMoon.html';

const targetRegex = /let tops=0;\["sp","ch","hu","ma","ee"\]\.forEach\(k=>\{try\{tops\+=JSON\.parse\(localStorage\.getItem\("sm_done_"\+k\)\|\|"\[\]"\)\.length\}catch\(e\)\{\}\}\);/g;
const replacement = 'let tops=0;["sp","ch","hu","ma","ee"].forEach(k=>{try{tops+=window.smProg.count(k)}catch(e){}});';

function patch(filename) {
    if (fs.existsSync(filename)) {
        let content = fs.readFileSync(filename, 'utf8');
        if (targetRegex.test(content)) {
            content = content.replace(targetRegex, replacement);
            fs.writeFileSync(filename, content);
            console.log(`Replaced tops logic in ${filename}`);
        } else {
            console.log(`No match found in ${filename}`);
        }
    }
}

patch(jsFile);
patch(htmlFile);
