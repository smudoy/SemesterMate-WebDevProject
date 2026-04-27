/**
 * patch_supabase.js
 * ─────────────────────────────────────────────────────────────────
 * SemesterMoon – Full Supabase Integration Patch
 *
 * BEFORE RUNNING:
 *   1. Create a free Supabase project at https://supabase.com
 *   2. Run supabase_setup.sql in your project's SQL Editor
 *   3. Fill in SUPABASE_URL and SUPABASE_ANON_KEY below
 *   4. Run:  node patch_supabase.js
 * ─────────────────────────────────────────────────────────────────
 */

const fs = require("fs");
const path = require("path");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔑  FILL IN YOUR SUPABASE CREDENTIALS HERE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SUPABASE_URL = "https://czjoqtnvqscesxanoocf.supabase.co"; // ← replace
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6am9xdG52cXNjZXN4YW5vb2NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyOTQ5MDEsImV4cCI6MjA5Mjg3MDkwMX0.saMHSVtuKBkK_Q8q7Tjw4cVGKTbEY3XlOMDjnqk9_Ng"; // ← replace
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if (
  SUPABASE_URL.includes("YOUR_PROJECT_ID") ||
  SUPABASE_ANON_KEY.includes("YOUR_ANON_KEY")
) {
  console.error(
    "\n❌  Please fill in SUPABASE_URL and SUPABASE_ANON_KEY before running!\n",
  );
  process.exit(1);
}

const targetFile = path.join(__dirname, "SemesterMoon.html");
let html = fs.readFileSync(targetFile, "utf8");
const originalHtml = html;

console.log(`\n🌙 SemesterMoon – Supabase Integration Patch`);
console.log(`📄 Target: ${targetFile}`);
console.log(`📦 File size: ${(html.length / 1024).toFixed(0)} KB\n`);

// ─────────────────────────────────────────────────────────────────
// STEP 1: Inject Supabase CDN + initialisation BEFORE the React
//         bundle. We insert it right after <head> opens.
// ─────────────────────────────────────────────────────────────────
const supabaseBootstrap = `
  <!-- ▼ Supabase SDK (injected by patch_supabase.js) ▼ -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
  <script>
    // Initialise the global Supabase client
    window.__SM_SUPABASE_URL  = "${SUPABASE_URL}";
    window.__SM_SUPABASE_KEY  = "${SUPABASE_ANON_KEY}";
    window._supabase = supabase.createClient(window.__SM_SUPABASE_URL, window.__SM_SUPABASE_KEY);

    // ─── Auth helpers ────────────────────────────────────────────
    window.smAuth = {
      /** Sign up + create profile row */
      signUp: async function(email, password, name, semester) {
        const { data, error } = await window._supabase.auth.signUp({
          email, password,
          options: { data: { name, semester } }
        });
        if (error) throw error;
        return data.user;
      },

      /** Sign in */
      signIn: async function(email, password) {
        const { data, error } = await window._supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data.user;
      },

      /** Sign out */
      signOut: async function() {
        await window._supabase.auth.signOut();
        window.smProgress = {};
      },

      /** Get current session user (or null) */
      getUser: async function() {
        const { data } = await window._supabase.auth.getSession();
        if (!data.session) return null;
        const u = data.session.user;
        // Fetch profile
        const { data: profile } = await window._supabase
          .from('profiles')
          .select('*')
          .eq('id', u.id)
          .single();
        return profile ? { ...u, ...profile } : u;
      }
    };

    // ─── Progress helpers ─────────────────────────────────────────
    window.smProgress = {};

    window.smProg = {
      /** Load all done topics for the current user into smProgress cache */
      load: async function() {
        const { data: { session } } = await window._supabase.auth.getSession();
        if (!session) return;
        const { data } = await window._supabase
          .from('progress')
          .select('subject_id, topic_id')
          .eq('user_id', session.user.id)
          .eq('done', true);
        window.smProgress = {};
        (data || []).forEach(row => {
          if (!window.smProgress[row.subject_id]) window.smProgress[row.subject_id] = [];
          window.smProgress[row.subject_id].push(row.topic_id); }); window.dispatchEvent(new Event("sm_progress_loaded")); },

      /** Mark a topic done/undone */
      set: async function(subjectId, topicId, done) {
        const { data: { session } } = await window._supabase.auth.getSession();
        if (!session) return;
        await window._supabase.from('progress').upsert({
          user_id: session.user.id,
          subject_id: subjectId,
          topic_id: topicId,
          done: done,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,subject_id,topic_id' });
        // Update local cache
        if (!window.smProgress[subjectId]) window.smProgress[subjectId] = [];
        if (done) {
          if (!window.smProgress[subjectId].includes(topicId))
            window.smProgress[subjectId].push(topicId);
        } else {
          window.smProgress[subjectId] = window.smProgress[subjectId].filter(t => t !== topicId);
        }
      },

      /** Get count of done topics for a subject */
      count: function(subjectId) {
        return (window.smProgress[subjectId] || []).length;
      },

      /** Check if a topic is done */
      isDone: function(subjectId, topicId) {
        return (window.smProgress[subjectId] || []).includes(topicId);
      }
    };

    // Pre-load progress on page init
    window.addEventListener('DOMContentLoaded', async () => {
      const { data: { session } } = await window._supabase.auth.getSession();
      if (session) await window.smProg.load();
    });
  </script>
  <!-- ▲ End Supabase SDK ▲ -->
`;

// Insert Supabase bootstrap right after <head>
if (html.includes(supabaseBootstrap.trim().split("\n")[1].trim())) {
  console.log("ℹ️  Supabase SDK already injected – skipping injection step.");
} else {
  html = html.replace("<head>", "<head>" + supabaseBootstrap);
  console.log("✅  Step 1: Supabase SDK + helpers injected into <head>.");
}

// ─────────────────────────────────────────────────────────────────
// STEP 2: Replace the Login / Register handler inside the bundle
//         Old: localStorage-only sign-in
//         New: Supabase Auth sign-in/sign-up
// ─────────────────────────────────────────────────────────────────

// Pattern for the patched-in login from patch.js (sm_users based)
const loginOld = `ct=Z=>{if(Z){if(!M.email||!M.password){y("Please fill all fields.");return}}else{if(!M.name||!M.email||!M.password){y("Please fill all fields.");return}if(M.password!==M.confirm){y("Passwords don't match.");return}}w(!0),setTimeout(()=>{let users=JSON.parse(localStorage.getItem("sm_users")||"[]");let pt=null;if(Z){pt=users.find(u=>u.email===M.email&&u.password===M.password);if(!pt){w(!1);y("Invalid credentials.");return}}else{pt={name:M.name,email:M.email,password:M.password,semester:M.semester};users.push(pt);localStorage.setItem("sm_users",JSON.stringify(users))}localStorage.setItem("sm_user",JSON.stringify(pt));O(pt);b("dashboard");w(!1)},800)};`;

// Also handle the ORIGINAL localStorage pattern (before patch.js was applied)
const loginOldOriginal = `ct=Z=>{if(Z){if(!M.email||!M.password){y("Please fill all fields.");return}}else{if(!M.name||!M.email||!M.password){y("Please fill all fields.");return}if(M.password!==M.confirm){y("Passwords don't match.");return}}w(!0),setTimeout(()=>{const pt=Z?{name:M.email.split("@")[0],email:M.email,semester:"1st"}:{name:M.name,email:M.email,semester:M.semester};localStorage.setItem("sm_user",JSON.stringify(pt)),O(pt),b("dashboard"),w(!1)},800)};`;

const loginNew = `ct=Z=>{if(Z){if(!M.email||!M.password){y("Please fill all fields.");return}}else{if(!M.name||!M.email||!M.password){y("Please fill all fields.");return}if(M.password!==M.confirm){y("Passwords don't match.");return}}w(!0);(async()=>{try{let pt;if(Z){const usr=await window.smAuth.signIn(M.email,M.password);const full=await window.smAuth.getUser();pt={id:usr.id,name:full.name||M.email.split("@")[0],email:M.email,semester:full.semester||"1st"}}else{const usr=await window.smAuth.signUp(M.email,M.password,M.name,M.semester);pt={id:usr.id,name:M.name,email:M.email,semester:M.semester}}await window.smProg.load();localStorage.setItem("sm_user",JSON.stringify(pt));O(pt);b("dashboard")}catch(err){y(err.message||"Authentication failed. Try again.")}finally{w(!1)}})()};`;

let loginPatched = false;
if (html.includes(loginOld)) {
  html = html.replace(loginOld, loginNew);
  loginPatched = true;
  console.log(
    "✅  Step 2: Login/Register handler replaced (sm_users variant).",
  );
} else if (html.includes(loginOldOriginal)) {
  html = html.replace(loginOldOriginal, loginNew);
  loginPatched = true;
  console.log(
    "✅  Step 2: Login/Register handler replaced (original variant).",
  );
} else {
  console.warn(
    "⚠️   Step 2: Could not find login handler. The bundle may already be patched differently.",
  );
}

// ─────────────────────────────────────────────────────────────────
// STEP 3: Replace localStorage progress reads with Supabase cache
//         sm_done_* → window.smProg.count() / window.smProg.isDone()
// ─────────────────────────────────────────────────────────────────

// 3a. Dashboard progress bars (uses count of done topics)
const dashProgressOld = `const V=(function(){try{let d=JSON.parse(localStorage.getItem("sm_done_"+C.id)||"[]").length;return Math.round((d/C.topics.length)*100)}catch(e){return 0}})();`;
const dashProgressNew = `const V=(function(){try{let d=window.smProg.count(C.id);return Math.round((d/C.topics.length)*100)}catch(e){return 0}})();`;

if (html.includes(dashProgressOld)) {
  html = html.replace(dashProgressOld, dashProgressNew);
  console.log("✅  Step 3a: Dashboard progress bars use Supabase cache.");
} else {
  // Fallback: original pattern
  const dashProgressOldFallback = `const V=T?.[C.id]||[20,35,15,45,10][B];`;
  const dashProgressNewFallback = `const V=(function(){try{let d=window.smProg.count(C.id);return Math.round((d/C.topics.length)*100)}catch(e){return 0}})();`;
  if (html.includes(dashProgressOldFallback)) {
    html = html.replace(dashProgressOldFallback, dashProgressNewFallback);
    console.log(
      "✅  Step 3a: Dashboard progress bars use Supabase cache (fallback).",
    );
  } else {
    console.warn(
      "⚠️   Step 3a: Could not find dashboard progress bar pattern.",
    );
  }
}

// 3b. Tutorial progress bars
const tutProgressOld = `const C=(function(){try{let d=JSON.parse(localStorage.getItem("sm_done_"+r.id)||"[]").length;return Math.round((d/r.topics.length)*100)}catch(e){return 0}})(),`;
const tutProgressNew = `const C=(function(){try{let d=window.smProg.count(r.id);return Math.round((d/r.topics.length)*100)}catch(e){return 0}})(),`;

if (html.includes(tutProgressOld)) {
  html = html.replace(tutProgressOld, tutProgressNew);
  console.log("✅  Step 3b: Tutorial progress bars use Supabase cache.");
} else {
  const tutProgressOldFallback = `const C=O?.[r.id]||[20,35,15,45,10][M],`;
  const tutProgressNewFallback = `const C=(function(){try{let d=window.smProg.count(r.id);return Math.round((d/r.topics.length)*100)}catch(e){return 0}})(),`;
  if (html.includes(tutProgressOldFallback)) {
    html = html.replace(tutProgressOldFallback, tutProgressNewFallback);
    console.log(
      "✅  Step 3b: Tutorial progress bars use Supabase cache (fallback).",
    );
  } else {
    console.warn("⚠️   Step 3b: Could not find tutorial progress bar pattern.");
  }
}

// ─────────────────────────────────────────────────────────────────
// STEP 4: Replace dashboard static stats with Supabase-aware version
// ─────────────────────────────────────────────────────────────────
const dashStaticOld = `(function(){let tops=0;["sp","ch","hu","ma","ee"].forEach(k=>{try{tops+=JSON.parse(localStorage.getItem("sm_done_"+k)||"[]").length}catch(e){}});let streak=1;try{streak=JSON.parse(localStorage.getItem("sm_user"))?.streak||1}catch(e){}return [{icon:"⏱️",val:Math.floor(tops*1.5)+"h",label:"Study Hours",color:"var(--purple)"},{icon:"✅",val:Math.floor(tops/2)+"",label:"Tasks Done",color:"var(--green)"},{icon:"📖",val:tops+"",label:"Topics Done",color:"var(--pink)"},{icon:"🔥",val:streak+"",label:"Day Streak",color:"#f59e0b"}]})()`;

// Also handle original static version
const dashStaticOldOriginal = `[{icon:"⏱️",val:"12h",label:"Study Hours",color:"var(--purple)"},{icon:"✅",val:"8",label:"Tasks Done",color:"var(--green)"},{icon:"📖",val:"23",label:"Topics Done",color:"var(--pink)"},{icon:"🔥",val:"7",label:"Day Streak",color:"#f59e0b"}]`;

const dashStaticNew = `(function(){let tops=0;["sp","ch","hu","ma","ee"].forEach(k=>{tops+=window.smProg.count(k)});let streak=1;try{streak=JSON.parse(localStorage.getItem("sm_user"))?.streak||1}catch(e){}return [{icon:"⏱️",val:Math.floor(tops*1.5)+"h",label:"Study Hours",color:"var(--purple)"},{icon:"✅",val:Math.floor(tops/2)+"",label:"Tasks Done",color:"var(--green)"},{icon:"📖",val:tops+"",label:"Topics Done",color:"var(--pink)"},{icon:"🔥",val:streak+"",label:"Day Streak",color:"#f59e0b"}]})()`;

if (html.includes(dashStaticOld)) {
  html = html.replace(dashStaticOld, dashStaticNew);
  console.log("✅  Step 4: Dashboard stats use Supabase cache.");
} else if (html.includes(dashStaticOldOriginal)) {
  html = html.replace(dashStaticOldOriginal, dashStaticNew);
  console.log(
    "✅  Step 4: Dashboard stats use Supabase cache (original variant).",
  );
} else {
  console.warn("⚠️   Step 4: Could not find dashboard stats pattern.");
}

// ─────────────────────────────────────────────────────────────────
// STEP 5: Add a logout that signs out of Supabase
//         Find wherever localStorage is cleared on logout
// ─────────────────────────────────────────────────────────────────
// The app likely does: localStorage.removeItem("sm_user") and resets state
// We inject a Supabase signOut call alongside it.
const logoutOld = `localStorage.removeItem("sm_user")`;
const logoutNew = `(window.smAuth?window.smAuth.signOut():Promise.resolve()).then(()=>{localStorage.removeItem("sm_user")})&&localStorage.removeItem("sm_user")`;

// Only patch the first occurrence (the logout handler)
if (html.includes(logoutOld)) {
  // Replace only the first occurrence to avoid breaking other things
  html = html.replace(logoutOld, logoutNew);
  console.log("✅  Step 5: Logout now also signs out from Supabase.");
} else {
  console.warn(
    "⚠️   Step 5: Could not find logout localStorage.removeItem pattern.",
  );
}

// ─────────────────────────────────────────────────────────────────
// STEP 6: Auto-restore session on page load
//         If Supabase has an active session, restore the sm_user
//         to localStorage so the React app shows as logged-in
// ─────────────────────────────────────────────────────────────────
const sessionRestoreScript = `
  <script>
    // Auto-restore Supabase session into localStorage for the React app
    (async function() {
      try {
        const { data: { session } } = await window._supabase.auth.getSession();
        if (session) {
          const user = session.user;
          const { data: profile } = await window._supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          const smUser = {
            id: user.id,
            name: profile?.name || user.email.split('@')[0],
            email: user.email,
            semester: profile?.semester || '1st',
            streak: profile?.streak || 0
          };
          localStorage.setItem('sm_user', JSON.stringify(smUser));
          await window.smProg.load();
        } else {
          // No active session – clear any stale localStorage user data
          localStorage.removeItem('sm_user');
        }
      } catch(e) {
        console.warn('Session restore failed:', e);
      }
    })();
  </script>
`;

// Insert before closing </head>
if (!html.includes("Auto-restore Supabase session")) {
  html = html.replace("</head>", sessionRestoreScript + "</head>");
  console.log("✅  Step 6: Auto session-restore script injected.");
}

// ─────────────────────────────────────────────────────────────────
// STEP 7: CLEAR ALL STUDENT ACCOUNT DATA FROM LOCALSTORAGE
//         Add a one-time cleanup script that runs on load
// ─────────────────────────────────────────────────────────────────
const cleanupScript = `
  <script>
    // One-time migration: clear old localStorage auth data
    // so users MUST create a fresh Supabase account
    if (!localStorage.getItem('sm_supabase_migrated')) {
      localStorage.removeItem('sm_user');
      localStorage.removeItem('sm_users');
      // Clear all sm_done_* keys (old progress)
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('sm_done_') || k.startsWith('sm_streak')) {
          localStorage.removeItem(k);
        }
      });
      localStorage.setItem('sm_supabase_migrated', '1');
      console.log('SemesterMoon: localStorage cleared for Supabase migration.');
    }
  </script>
`;

if (!html.includes("sm_supabase_migrated")) {
  // Insert right after <body>
  html = html.replace("<body>", "<body>" + cleanupScript);
  console.log(
    "✅  Step 7: Old localStorage data cleared (one-time migration).",
  );
}

// ─────────────────────────────────────────────────────────────────
// Write output
// ─────────────────────────────────────────────────────────────────
if (html !== originalHtml) {
  fs.writeFileSync(targetFile, html, "utf8");
  console.log(
    `\n🎉  Patch complete! Written to SemesterMoon.html (${(html.length / 1024).toFixed(0)} KB)`,
  );
} else {
  console.log(
    "\n⚠️   No changes were written (all patterns already patched or not found).",
  );
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next steps:
  1. Push SemesterMoon.html to your GitHub repo
  2. Deploy via GitHub Pages / Netlify / Vercel
  3. Make sure Supabase Email Auth is ENABLED:
       Authentication → Providers → Email → Enable
  4. Optional: disable "Confirm email" for easy testing:
       Authentication → Settings → Confirm email → OFF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
