const fs = require('fs');
const file = 'SemesterMoon.html';
let content = fs.readFileSync(file, 'utf8');

const target = `if(M.password!==M.confirm){y("Passwords don't match.");return}`;
const replacement = `if(M.password!==M.confirm){y("Passwords don't match.");return}if(!/^(?=.*[A-Za-z])(?=.*\\d).{8,}$/.test(M.password)){y("Password must be 8+ characters with at least 1 letter and 1 number.");return}`;

if(content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed password validation!');
} else {
    console.log('Target not found!');
}
