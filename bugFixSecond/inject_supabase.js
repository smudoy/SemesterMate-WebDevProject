const fs = require('fs');
const file = 'SemesterMoon.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Inject Supabase into <head>
const headTag = '</head>';
const supabaseScripts = `
    <!-- Supabase SDK -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script>
      // ==========================================
      // TODO: REPLACE WITH YOUR SUPABASE URL & KEY
      // ==========================================
      const SUPABASE_URL = 'YOUR_SUPABASE_URL';
      const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
      
      if(SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
          window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      }

      // Sync progress to Supabase when localStorage changes
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = function(key, value) {
          originalSetItem.apply(this, arguments);
          
          if (!window.supabaseClient) return;
          
          const trackedKeys = ['sm_done_sp', 'sm_done_ch', 'sm_done_hu', 'sm_done_ma', 'sm_done_ee', 'sm_drive_links', 'sm_lab_files'];
          
          if (trackedKeys.includes(key)) {
              try {
                  const userStr = localStorage.getItem('sm_user');
                  if (userStr) {
                      const user = JSON.parse(userStr);
                      if (user && user.id) {
                          const progress_data = {};
                          trackedKeys.forEach(k => {
                              const val = localStorage.getItem(k);
                              if (val) progress_data[k] = val;
                          });
                          
                          window.supabaseClient.from('profiles').upsert({ id: user.id, progress_data }).then(({error}) => { if(error) console.error('Sync error:', error); });
                      }
                  }
              } catch(e) {
                  console.error('Error syncing to Supabase:', e);
              }
          }
      };
    </script>
`;

if (!content.includes('cdn.jsdelivr.net/npm/@supabase')) {
    content = content.replace(headTag, supabaseScripts + headTag);
}

const loginNew = `ct=Z=>{if(Z){if(!M.email||!M.password){y("Please fill all fields.");return}if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(M.email)){y("Please enter a valid email.");return}}else{if(!M.name||!M.email||!M.password){y("Please fill all fields.");return}if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(M.email)){y("Please enter a valid email.");return}if(M.password!==M.confirm){y("Passwords don't match.");return}if(!/^(?=.*[A-Za-z])(?=.*\\d).{8,}$/.test(M.password)){y("Password must be 8+ characters with at least 1 letter and 1 number.");return}}w(!0);setTimeout(async ()=>{try {if(!window.supabaseClient){throw new Error("Supabase is not connected. Add URL/Key.");}let pt=null;if(Z){const {data,error}=await window.supabaseClient.auth.signInWithPassword({email:M.email,password:M.password});if(error)throw error;const {data:profile,error:profileErr}=await window.supabaseClient.from('profiles').select('*').eq('id',data.user.id).single();localStorage.clear();if(profile){pt={name:profile.name,email:M.email,semester:profile.semester,id:data.user.id};localStorage.setItem("sm_user",JSON.stringify(pt));if(profile.progress_data){Object.keys(profile.progress_data).forEach(k=>{localStorage.setItem(k,profile.progress_data[k])})}}else{pt={name:M.email.split('@')[0],email:M.email,semester:"1st",id:data.user.id};localStorage.setItem("sm_user",JSON.stringify(pt))}}else{const {data,error}=await window.supabaseClient.auth.signUp({email:M.email,password:M.password});if(error)throw error;pt={name:M.name,email:M.email,semester:M.semester,id:data.user.id};localStorage.clear();await window.supabaseClient.from('profiles').upsert([{id:data.user.id,name:M.name,semester:M.semester,progress_data:{}}]);localStorage.setItem("sm_user",JSON.stringify(pt))}O(pt);b("dashboard");w(!1)}catch(err){w(!1);y(err.message||"Invalid credentials.")}},100)};`;

const exactOriginal = `ct=Z=>{if(Z){if(!M.email||!M.password){y("Please fill all fields.");return}if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(M.email)){y("Please enter a valid email.");return}}else{if(!M.name||!M.email||!M.password){y("Please fill all fields.");return}if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(M.email)){y("Please enter a valid email.");return}if(M.password!==M.confirm){y("Passwords don't match.");return}if(!/^(?=.*[A-Za-z])(?=.*\\d).{8,}$/.test(M.password)){y("Password must be 8+ characters with at least 1 letter and 1 number.");return}}w(!0),setTimeout(()=>{let users=JSON.parse(localStorage.getItem("sm_users")||"[]");let pt=null;if(Z){pt=users.find(u=>u.email===M.email&&u.password===M.password);if(!pt){w(!1);y("Invalid credentials.");return}}else{pt={name:M.name,email:M.email,password:M.password,semester:M.semester};users.push(pt);localStorage.setItem("sm_users",JSON.stringify(users))}localStorage.setItem("sm_user",JSON.stringify(pt));O(pt);b("dashboard");w(!1)},800)};`;

if (content.includes(exactOriginal)) {
    content = content.replace(exactOriginal, loginNew);
    console.log("Login function patched successfully.");
} else {
    console.log("Error: Exact original login function not found. Here is what we found instead:");
    const partialMatch = content.match(/ct=Z=>\{if\(Z\).*?800\)\};/s);
    if(partialMatch) {
        console.log("Found: ", partialMatch[0]);
        content = content.replace(partialMatch[0], loginNew);
        console.log("Patched using partial match.");
    }
}

fs.writeFileSync(file, content, 'utf8');
console.log("Supabase integration added.");
