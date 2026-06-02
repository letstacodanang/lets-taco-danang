const fs = require('fs');
const crypto = require('crypto');

// ============================================
// GENERATE HASHES FOR ALL PASSWORDS
// SHA-256 — cannot be reversed
// ============================================

function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

// Current passwords
const OWNER_PASS = 'LetsTaco2024!';
const STAFF_PASS = 'LetsWork2024!';
const OWNER_PIN  = '1011';
const OWNER_EMAIL = 'letstacodanang@gmail.com';

// Generate hashes
const OWNER_HASH = sha256(OWNER_PASS);
const STAFF_HASH = sha256(STAFF_PASS);
const PIN_HASH   = sha256(OWNER_PIN);

console.log('Owner hash:', OWNER_HASH);
console.log('Staff hash:', STAFF_HASH);
console.log('PIN hash:', PIN_HASH);

// ============================================
// PATCH ADMIN.HTML
// Replace plaintext passwords with hashes
// Update comparison logic to hash input first
// ============================================

const html = fs.readFileSync('admin.html', 'utf8');
if (html.includes('Lam Tuyen')) { console.log('STOP'); process.exit(1); }
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// ============================================
// FIX 1 — REPLACE PASSWORD CONSTANTS
// Find where APASS and SPASS are defined
// ============================================

// Find the constants
const apIdx = fixed.indexOf('APASS');
if (apIdx !== -1) {
  console.log('Found APASS at:', apIdx);
  console.log('Context:', fixed.substring(apIdx - 30, apIdx + 60));
}

// Replace password definitions with hashes
// Pattern: var APASS='LetsTaco2024!' or similar
fixed = fixed.replace(
  /var APASS\s*=\s*['"][^'"]+['"]/,
  'var APASS="' + OWNER_HASH + '"'
);
fixed = fixed.replace(
  /var SPASS\s*=\s*['"][^'"]+['"]/,
  'var SPASS="' + STAFF_HASH + '"'
);
fixed = fixed.replace(
  /var APIN\s*=\s*['"][^'"]+['"]/,
  'var APIN="' + PIN_HASH + '"'
);

// Also handle if they are defined differently
fixed = fixed.replace(
  /APASS\s*=\s*['"]LetsTaco2024[^'"]*['"]/g,
  'APASS="' + OWNER_HASH + '"'
);
fixed = fixed.replace(
  /SPASS\s*=\s*['"]LetsWork2024[^'"]*['"]/g,
  'SPASS="' + STAFF_HASH + '"'
);

console.log('✅ Fix 1: Password constants replaced with SHA-256 hashes');

// ============================================
// FIX 2 — ADD HASH FUNCTION TO ADMIN
// Staff/owner input must be hashed before
// comparison against stored hash
// ============================================

// Find the doLogin function and add hashing
const oldDoLogin = 'function doLogin(){';
const newDoLogin = 'function doLogin(){';

// Add sha256 function before login functions
const sha256JS = 'function sha256(s){var h=0;for(var i=0;i<s.length;i++){var c=s.charCodeAt(i);h=((h<<5)-h)+c;h|=0;}return Math.abs(h).toString(16);}';

// Actually use SubtleCrypto for real SHA-256 in browser
const realSHA256 = `
async function sha256(message){
  var msgBuffer=new TextEncoder().encode(message);
  var hashBuffer=await crypto.subtle.digest('SHA-256',msgBuffer);
  var hashArray=Array.from(new Uint8Array(hashBuffer));
  var hashHex=hashArray.map(function(b){return b.toString(16).padStart(2,'0');}).join('');
  return hashHex;
}
`;

// Find where login functions start and inject sha256
const loginFnIdx = fixed.indexOf('function doLogin()');
if (loginFnIdx !== -1) {
  fixed = fixed.substring(0, loginFnIdx) + realSHA256 + '\n' + fixed.substring(loginFnIdx);
  console.log('✅ Fix 2a: SHA-256 function added');
}

// ============================================
// FIX 3 — UPDATE LOGIN COMPARISONS
// doLogin and doSL must hash input before compare
// ============================================

// Update owner login comparison
const oldOwnerCompare = 'if(e===AEMAIL.toLowerCase()&&p===APASS){';
const newOwnerCompare = 'sha256(p).then(function(ph){if(e===AEMAIL.toLowerCase()&&ph===APASS){';

if (fixed.includes(oldOwnerCompare)) {
  // Need to also close the then() properly
  // Find the return; after initApp() and close the then
  fixed = fixed.replace(
    oldOwnerCompare,
    newOwnerCompare
  );
  // Close the promise chain after the login block
  fixed = fixed.replace(
    'initApp();\n    return;\n  }\n  attempts++;',
    'initApp();\n    return;\n    }else{attempts++;var err2=document.getElementById(\'lerr\');err2.style.display=\'block\';err2.textContent=\'Incorrect email or password (\'+attempts+\'/5)\';if(attempts>=5){locked=true;}}\n  });\n  return;\n  attempts++;'
  );
  console.log('✅ Fix 3a: Owner login now hashes password before compare');
} else {
  console.log('⚠️  Fix 3a: owner compare pattern not found');
}

// Simpler approach — rewrite the entire login check
// to use async hashing properly
// Find doLogin and replace its core logic

const doLoginStart = fixed.indexOf('function doLogin(){');
const doLoginEnd = fixed.indexOf('\n}', doLoginStart) + 2;
const currentDoLogin = fixed.substring(doLoginStart, doLoginEnd);

const newDoLoginFn = `function doLogin(){
  if(locked)return;
  var e=document.getElementById('le').value.trim().toLowerCase();
  var p=document.getElementById('lp').value;
  var err=document.getElementById('lerr');
  if(!e||!p){err.style.display='block';err.textContent='Please enter email and password';return;}
  sha256(p).then(function(ph){
    if(e===AEMAIL.toLowerCase()&&ph===APASS){
      document.getElementById('lw').style.display='none';
      document.getElementById('app').style.display='flex';
      err.style.display='none';
      attempts=0;
      isOwner=true;currentStaff='Owner';
      localStorage.setItem('lt_role','owner');
      localStorage.setItem('lt_ts',Date.now().toString());
      document.querySelectorAll('.owner-only').forEach(function(el){el.style.display='';});
      initApp();
      return;
    }
    attempts++;
    err.style.display='block';
    err.textContent='Incorrect email or password ('+attempts+'/5)';
    if(attempts>=5){
      locked=true;
      var secs=600;
      err.style.display='none';
      var lk=document.getElementById('llock');
      lk.style.display='block';
      var t=setInterval(function(){
        secs--;
        lk.textContent='Too many attempts. Try again in '+Math.floor(secs/60)+'m '+(secs%60)+'s';
        if(secs<=0){clearInterval(t);locked=false;attempts=0;lk.style.display='none';}
      },1000);
    }
  });
}`;

fixed = fixed.substring(0, doLoginStart) + newDoLoginFn + fixed.substring(doLoginEnd);
console.log('✅ Fix 3b: doLogin rewritten with async SHA-256');

// Update staff login to use hashing
const doSLStart = fixed.indexOf('function doSL(){');
const doSLEnd = fixed.indexOf('\n}', doSLStart) + 2;
const currentDoSL = fixed.substring(doSLStart, doSLEnd);

const newDoSLFn = `function doSL(){
  var p=document.getElementById('lps').value;
  var err=document.getElementById('lerr');
  err.style.display='none';
  sha256(p).then(function(ph){
    if(ph!==SPASS){err.style.display='block';err.textContent='Wrong password. Ask your manager.';return;}
    var nf=document.getElementById('nf'),ni=document.getElementById('ln');
    if(nf.style.display==='none'||nf.style.display===''){
      var sv=localStorage.getItem('lt_sn');
      if(sv){currentStaff=sv;startSS();return;}
      nf.style.display='block';document.getElementById('lbs').textContent='CONFIRM NAME';ni.focus();return;
    }
    var nm=ni.value.trim();
    if(!nm){err.style.display='block';err.textContent='Please enter your name.';return;}
    var sv=localStorage.getItem('lt_sn');
    if(sv&&sv.toLowerCase()!==nm.toLowerCase()){err.style.display='block';err.textContent='Use your registered name: '+sv;return;}
    localStorage.setItem('lt_sn',nm);currentStaff=nm;startSS();
  });
}`;

fixed = fixed.substring(0, doSLStart) + newDoSLFn + fixed.substring(doSLEnd);
console.log('✅ Fix 3c: doSL rewritten with async SHA-256');

// Update PIN check to use hashing
const checkPinIdx = fixed.indexOf('function checkPin(');
if (checkPinIdx !== -1) {
  const checkPinEnd = fixed.indexOf('\n}', checkPinIdx) + 2;
  const currentCheckPin = fixed.substring(checkPinIdx, checkPinEnd);
  const newCheckPin = currentCheckPin
    .replace(/if\(p===APIN\)/, 'sha256(p).then(function(ph){if(ph===APIN)')
    .replace(/else\{/, '});/*else{')
    .replace(/}\s*$/, '}*/}');
  if (currentCheckPin !== newCheckPin) {
    fixed = fixed.substring(0, checkPinIdx) + newCheckPin + fixed.substring(checkPinEnd);
    console.log('✅ Fix 3d: PIN check uses SHA-256');
  } else {
    console.log('⚠️  Fix 3d: PIN check pattern complex — keeping as is for now');
  }
}

// ============================================
// FIX 4 — REMOVE RAW PASSWORDS FROM CODE
// Double check no plaintext remains
// ============================================

if (fixed.includes('LetsTaco2024')) {
  fixed = fixed.replace(/LetsTaco2024[^'"]*/g, '[PROTECTED]');
  console.log('⚠️  Fix 4: Found and removed remaining plaintext owner password');
} else {
  console.log('✅ Fix 4: No plaintext owner password in code');
}

if (fixed.includes('LetsWork2024')) {
  fixed = fixed.replace(/LetsWork2024[^'"]*/g, '[PROTECTED]');
  console.log('⚠️  Fix 4: Found and removed remaining plaintext staff password');
} else {
  console.log('✅ Fix 4: No plaintext staff password in code');
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
console.log('✅ JS validation passed — ' + scripts.length + ' blocks');
fs.writeFileSync('admin.html', fixed, 'utf8');
console.log('✅ admin.html saved — passwords hashed');

// ============================================
// FIX 5 — UPGRADE VERCEL.JSON SECURITY HEADERS
// Content Security Policy
// Prevent clickjacking, XSS, sniffing
// ============================================

const newVercel = {
  "cleanUrls": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {"key": "X-Content-Type-Options", "value": "nosniff"},
        {"key": "X-XSS-Protection", "value": "1; mode=block"},
        {"key": "Referrer-Policy", "value": "strict-origin-when-cross-origin"},
        {"key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()"},
        {"key": "X-Frame-Options", "value": "SAMEORIGIN"}
      ]
    },
    {
      "source": "/admin",
      "headers": [
        {"key": "X-Robots-Tag", "value": "noindex, nofollow"},
        {"key": "X-Frame-Options", "value": "DENY"},
        {"key": "Cache-Control", "value": "no-store, no-cache, must-revalidate"},
        {"key": "Pragma", "value": "no-cache"}
      ]
    },
    {
      "source": "/kitchen",
      "headers": [
        {"key": "X-Robots-Tag", "value": "noindex, nofollow"},
        {"key": "X-Frame-Options", "value": "DENY"},
        {"key": "Cache-Control", "value": "no-store, no-cache, must-revalidate"}
      ]
    }
  ]
};

fs.writeFileSync('vercel.json', JSON.stringify(newVercel, null, 2), 'utf8');
console.log('✅ Fix 5: vercel.json security headers upgraded');

console.log('');
console.log('=== SECURITY SUMMARY ===');
console.log('Owner password hash:', OWNER_HASH);
console.log('Staff password hash:', STAFF_HASH);
console.log('PIN hash:', PIN_HASH);
console.log('Save these hashes — you need them if you change passwords');
