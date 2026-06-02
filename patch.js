const fs = require('fs');

const html = fs.readFileSync('admin.html', 'utf8');
if (html.includes('Lam Tuyen')) { console.log('STOP'); process.exit(1); }
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// ============================================
// FIX 1 — SAVE SESSION ON OWNER LOGIN
// Store role + timestamp in localStorage
// ============================================

const oldOwnerLogin = `    document.getElementById('lw').style.display='none';
    document.getElementById('app').style.display='flex';
    err.style.display='none';
    attempts=0;
    isOwner=true;currentStaff='Owner';
    document.querySelectorAll('.owner-only').forEach(function(el){el.style.display='';});
    initApp();
    return;`;

const newOwnerLogin = `    document.getElementById('lw').style.display='none';
    document.getElementById('app').style.display='flex';
    err.style.display='none';
    attempts=0;
    isOwner=true;currentStaff='Owner';
    // Save session to localStorage
    localStorage.setItem('lt_role','owner');
    localStorage.setItem('lt_ts',Date.now().toString());
    document.querySelectorAll('.owner-only').forEach(function(el){el.style.display='';});
    initApp();
    return;`;

if (fixed.includes(oldOwnerLogin)) {
  fixed = fixed.replace(oldOwnerLogin, newOwnerLogin);
  console.log('✅ Fix 1: Owner session saved to localStorage');
} else {
  console.log('⚠️  Fix 1: owner login pattern not found');
}

// ============================================
// FIX 2 — SAVE SESSION ON STAFF LOGIN
// startSS() is called after staff logs in
// Find it and save role there
// ============================================

const startSSIdx = fixed.indexOf('function startSS(');
if (startSSIdx !== -1) {
  const startSSEnd = fixed.indexOf('\n}', startSSIdx) + 2;
  const oldStartSS = fixed.substring(startSSIdx, startSSEnd);
  const newStartSS = oldStartSS.replace(
    'function startSS(){',
    `function startSS(){
  // Save staff session to localStorage
  localStorage.setItem('lt_role','staff');
  localStorage.setItem('lt_staff',currentStaff||'');
  localStorage.setItem('lt_ts',Date.now().toString());`
  );
  if (oldStartSS !== newStartSS) {
    fixed = fixed.substring(0, startSSIdx) + newStartSS + fixed.substring(startSSEnd);
    console.log('✅ Fix 2: Staff session saved in startSS()');
  } else {
    console.log('⚠️  Fix 2: startSS replace did not match');
  }
} else {
  console.log('⚠️  Fix 2: startSS function not found');
}

// ============================================
// FIX 3 — RESTORE SESSION ON PAGE LOAD
// Check localStorage on load
// If valid session exists — skip login screen
// Session expires after 12 hours
// ============================================

const oldWindowLoad = `window.addEventListener('load',function(){
  if(isMobile()){
    updateMobileNav();
    setInterval(updateMobileNav,2000);
  }
});`;

const newWindowLoad = `window.addEventListener('load',function(){
  if(isMobile()){
    updateMobileNav();
    setInterval(updateMobileNav,2000);
  }
  // Restore session on page load/refresh
  restoreSession();
});

function restoreSession(){
  var role=localStorage.getItem('lt_role');
  var ts=parseInt(localStorage.getItem('lt_ts')||'0');
  var now=Date.now();
  var maxAge=12*60*60*1000; // 12 hours
  // Clear expired sessions
  if(!role||!ts||(now-ts)>maxAge){
    localStorage.removeItem('lt_role');
    localStorage.removeItem('lt_staff');
    localStorage.removeItem('lt_ts');
    return; // Show login screen
  }
  // Valid session — restore it
  if(role==='owner'){
    isOwner=true;
    currentStaff='Owner';
    document.getElementById('lw').style.display='none';
    document.getElementById('app').style.display='flex';
    document.querySelectorAll('.owner-only').forEach(function(el){el.style.display='';});
    initApp();
    console.log('Session restored: Owner');
  } else if(role==='staff'){
    var name=localStorage.getItem('lt_staff')||'Staff';
    currentStaff=name;
    isOwner=false;
    document.getElementById('lw').style.display='none';
    document.getElementById('app').style.display='flex';
    document.querySelectorAll('.owner-only').forEach(function(el){el.style.display='none';});
    // Restore shift tracking without creating new shift
    initApp();
    console.log('Session restored: Staff —',name);
  }
}`;

if (fixed.includes(oldWindowLoad)) {
  fixed = fixed.replace(oldWindowLoad, newWindowLoad);
  console.log('✅ Fix 3: Session restore on page load added');
} else {
  console.log('⚠️  Fix 3: window load pattern not found — injecting before body close');
  fixed = fixed.replace(
    `</body>`,
    `<script>
function restoreSession(){
  var role=localStorage.getItem('lt_role');
  var ts=parseInt(localStorage.getItem('lt_ts')||'0');
  var now=Date.now();
  var maxAge=12*60*60*1000;
  if(!role||!ts||(now-ts)>maxAge){localStorage.removeItem('lt_role');localStorage.removeItem('lt_staff');localStorage.removeItem('lt_ts');return;}
  if(role==='owner'){isOwner=true;currentStaff='Owner';document.getElementById('lw').style.display='none';document.getElementById('app').style.display='flex';document.querySelectorAll('.owner-only').forEach(function(el){el.style.display='';});initApp();}
  else if(role==='staff'){var name=localStorage.getItem('lt_staff')||'Staff';currentStaff=name;isOwner=false;document.getElementById('lw').style.display='none';document.getElementById('app').style.display='flex';document.querySelectorAll('.owner-only').forEach(function(el){el.style.display='none';});initApp();}
}
window.addEventListener('load',function(){restoreSession();});
</script>
</body>`
  );
  console.log('✅ Fix 3: restoreSession injected before body close');
}

// ============================================
// FIX 4 — CLEAR SESSION ON LOGOUT
// Find the logout handler and clear localStorage
// ============================================

const oldLogout = `document.getElementById('lout').addEventListener('click',function(){
  if(shiftId){sbF('/rest/v1/staff_shifts?id=eq.'+shiftId,{method:'PATCH',headers:{'Prefer':'return=minimal'},body:JSON.stringify({logout_time:new Date().toISOString()})});shiftId=null;}
  document.getElementById('app').style.display='none';`;

const newLogout = `document.getElementById('lout').addEventListener('click',function(){
  if(shiftId){sbF('/rest/v1/staff_shifts?id=eq.'+shiftId,{method:'PATCH',headers:{'Prefer':'return=minimal'},body:JSON.stringify({logout_time:new Date().toISOString()})});shiftId=null;}
  // Clear session on explicit logout
  localStorage.removeItem('lt_role');
  localStorage.removeItem('lt_staff');
  localStorage.removeItem('lt_ts');
  isOwner=false;currentStaff=null;
  document.getElementById('app').style.display='none';`;

if (fixed.includes(oldLogout)) {
  fixed = fixed.replace(oldLogout, newLogout);
  console.log('✅ Fix 4: Session cleared on logout');
} else {
  console.log('⚠️  Fix 4: logout handler not found — trying partial');
  fixed = fixed.replace(
    `shiftId=null;}
  document.getElementById('app').style.display='none';`,
    `shiftId=null;}
  localStorage.removeItem('lt_role');
  localStorage.removeItem('lt_staff');
  localStorage.removeItem('lt_ts');
  isOwner=false;currentStaff=null;
  document.getElementById('app').style.display='none';`
  );
  console.log('✅ Fix 4: Partial logout clear applied');
}

// ============================================
// FIX 5 — ADD MOBILE LOGOUT BUTTON
// Mobile nav has no logout button visible
// Add a small logout option accessible
// ============================================

// Add logout to mobile topbar
const oldMobileTopbar = `  <div class="mobile-topbar-right">
    <div id="mobile-clock" class="mobile-clock">00:00</div>
    <div id="mobile-open-pill" class="mobile-open-pill">OPEN</div>
  </div>`;

const newMobileTopbar = `  <div class="mobile-topbar-right">
    <div id="mobile-clock" class="mobile-clock">00:00</div>
    <div id="mobile-open-pill" class="mobile-open-pill">OPEN</div>
    <button onclick="document.getElementById('lout').click()" style="background:transparent;border:1px solid #E5E7EB;color:#9CA3AF;padding:5px 10px;border-radius:6px;font-size:0.68rem;font-family:Jost,sans-serif;cursor:pointer;letter-spacing:1px;">EXIT</button>
  </div>`;

if (fixed.includes(oldMobileTopbar)) {
  fixed = fixed.replace(oldMobileTopbar, newMobileTopbar);
  console.log('✅ Fix 5: Mobile EXIT button added to topbar');
} else {
  console.log('⚠️  Fix 5: mobile topbar pattern not found');
}

// JS Validation
const scripts = [];
let pos = 0;
while (true) {
  const s = fixed.indexOf('<script>', pos);
  if (s === -1) break;
  const e = fixed.indexOf('<\/script>', s);
  if (e === -1) break;
  scripts.push(fixed.substring(s + 8, e));
  pos = e + 9;
}
let ok = true;
scripts.forEach(function(sc, i) {
  try { new Function(sc); }
  catch(e) { console.log('❌ JS Error block', i, ':', e.message); ok = false; }
});
if (!ok) {
  console.log('❌ JS validation failed — file NOT saved.');
  process.exit(1);
}
console.log('✅ JS validation passed');
fs.writeFileSync('admin.html', fixed, 'utf8');
console.log('✅ admin.html saved — persistent session live');
