const fs = require('fs');
const file = 'SemesterMoon.html';
let content = fs.readFileSync(file, 'utf8');

const target = 'y("Please fill all fields.");return}if(!/^[\\\\w-\\\\.]+@([\\\\w-]+\\\\.)+[\\\\w-]{2,4}$/.test(M.email)){y("Please enter a valid email.");return}';
const replacement = 'y("Please fill all fields.");return}if(!/^[^\\\\s@]+@[^\\\\s@]+\\\\.[^\\\\s@]+$/.test(M.email)){y("Please enter a valid email.");return}';

if(content.includes(target)) {
    content = content.replaceAll(target, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed syntax error!');
} else {
    console.log('Target not found!');
}
