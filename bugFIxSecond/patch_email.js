const fs = require('fs');
const file = 'SemesterMoon.html';
let content = fs.readFileSync(file, 'utf8');

const target = 'y("Please fill all fields.");return}';
const replacement = 'y("Please fill all fields.");return}if(!/^[\\\\w-\\\\.]+@([\\\\w-]+\\\\.)+[\\\\w-]{2,4}$/.test(M.email)){y("Please enter a valid email.");return}';

// Since there are two occurrences (one for login, one for signup), we want to replace both!
if(content.includes(target)) {
    content = content.replaceAll(target, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed email validation!');
} else {
    console.log('Target not found!');
}
