const fs = require('fs');
const file = 'SemesterMoon.html';
const content = fs.readFileSync(file, 'utf8');

const start = content.indexOf('<script type="module">') + '<script type="module">'.length;
const end = content.lastIndexOf('</script>');
const scriptContent = content.substring(start, end);

try {
    new Function(scriptContent);
    console.log("Syntax OK!");
} catch (e) {
    console.error("Syntax Error:", e);
}
