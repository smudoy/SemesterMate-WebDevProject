const fs = require('fs');

const jsFile = 'index-B7XPMFMR.js';
const htmlFile = 'SemesterMoon.html';

const hookCode = `const [smTrig, setSmTrig] = Tt.useState(0); Tt.useEffect(() => { const h = () => setSmTrig(x => x + 1); window.addEventListener('sm_progress_loaded', h); return () => window.removeEventListener('sm_progress_loaded', h); }, []); `;

function patchFiles(filename) {
    if (!fs.existsSync(filename)) return;
    let content = fs.readFileSync(filename, 'utf8');
    let changed = false;

    // 1. Dispatch event in smProg.load()
    const loadTarget = /window\.smProgress\[row\.subject_id\]\.push\(row\.topic_id\);\s*\}\);\s*\},/g;
    const loadReplacement = 'window.smProgress[row.subject_id].push(row.topic_id); }); window.dispatchEvent(new Event("sm_progress_loaded")); },';
    if (content.match(loadTarget) && !content.includes('sm_progress_loaded')) {
        content = content.replace(loadTarget, loadReplacement);
        changed = true;
        console.log(`Patched smProg.load in ${filename}`);
    }

    // 2. Add hook to Dashboard (v1)
    const v1Target = /function v1\(\{\s*user:\s*b,\s*setPage:\s*O,\s*progress:\s*T\s*\}\)\s*\{/g;
    if (content.match(v1Target) && !content.includes('setSmTrig')) {
        content = content.replace(v1Target, `function v1({ user: b, setPage: O, progress: T }) { ${hookCode}`);
        changed = true;
        console.log(`Patched v1 (Dashboard) in ${filename}`);
    }

    // 3. Add hook to Study Materials (x1)
    const x1Target = /function x1\(\{\s*setPage:\s*b,\s*progress:\s*O,\s*user:\s*T\s*\}\)\s*\{/g;
    if (content.match(x1Target)) {
        content = content.replace(x1Target, `function x1({ setPage: b, progress: O, user: T }) { ${hookCode}`);
        changed = true;
        console.log(`Patched x1 (Study Materials) in ${filename}`);
    }

    // 4. Add hook to Subject Page (b1)
    const b1Target = /function b1\(\{\s*subjectId:\s*b,\s*setPage:\s*O\s*\}\)\s*\{/g;
    if (content.match(b1Target)) {
        content = content.replace(b1Target, `function b1({ subjectId: b, setPage: O }) { ${hookCode}`);
        changed = true;
        console.log(`Patched b1 (Subject) in ${filename}`);
    }

    if (changed) {
        fs.writeFileSync(filename, content, 'utf8');
        console.log(`✅ Fixed render logic in ${filename}`);
    } else {
        console.log(`No changes made to ${filename} (maybe already patched or targets not found)`);
    }
}

patchFiles(jsFile);
patchFiles(htmlFile);

// Also patch patch_supabase.js so future runs don't revert it
const patchScript = 'patch_supabase.js';
if (fs.existsSync(patchScript)) {
    let pContent = fs.readFileSync(patchScript, 'utf8');
    const pTarget = /window\.smProgress\[row\.subject_id\]\.push\(row\.topic_id\);\s*\}\);\s*\},/g;
    if (pContent.match(pTarget) && !pContent.includes('sm_progress_loaded')) {
        pContent = pContent.replace(pTarget, 'window.smProgress[row.subject_id].push(row.topic_id); }); window.dispatchEvent(new Event("sm_progress_loaded")); },');
        fs.writeFileSync(patchScript, pContent, 'utf8');
        console.log('✅ Patched patch_supabase.js');
    }
}
