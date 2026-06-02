const fs = require('fs');
const crypto = require('crypto');

function sha256node(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

const OWNER_HASH = sha256node('LetsTaco2024!');
const STAFF_HASH = sha256node('LetsWork2024!');
const PIN_HASH   = sha256node('1011');

console.log('Owner hash:', OWNER_HASH);
console.log('Staff hash:', STAFF_HASH);
console.log('PIN hash:  ', PIN_HASH);

const html = fs.readFileSync('admin.html', 'utf8');
if (html.includes('Lam Tuyen')) { console.log('STOP'); process.exit(1); }
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// Check current state
console.log('Has plaintext owner pass:', fixed.includes('LetsTaco2024'));
console.log('Has plaintext staff pass:', fixed.includes('LetsWork2024'));
console.log('Has SHA256 function:', fixed.includes('crypto.subtle.digest'));
console.log('Has hashed APASS:', fixed.includes(OWNER_HASH));

// ============================================
// STEP 1 — Replace password constants with hashes
// ============================================
fixed = fixed.replace(/var APASS\s*=\s*['"][^'"]+['"]/g, 'var APASS="'+OWNER_HASH+'"');
fixed = fixed.replace(/var SPASS\s*=\s*['"][^'"]+['"]/g, 'var SPASS="'+STAFF_HASH+'"');
fixed = fixed.replace(/var APIN\s*=\s*['"][^'"]+['"]/g,  'var APIN="'+PIN_HASH+'"');
fixed = fixed.replace(/var OPIN\s*=\s*['"][^'"]+['"]/g,  'var OPIN="'+PIN_HASH+'"');

// Remove any remaining plaintext
fixed = fixed.replace(/['"]LetsTaco2024[^'"]*['"]/g, '"[PROTECTED]"');
fixed = fixed.replace(/['"]LetsWork2024[^'"]*['"]/g, '"[PROTECTED]"');
console.log('✅ Step 1: Password constants replaced with hashes');

// ============================================
// STEP 2 — Add SHA-256 browser function
// Only add if not already present
// ============================================
if (!fixed.includes('crypto.subtle.digest')) {
  const sha256fn = `
async function sha256(message){
  var msgBuffer=new TextEncoder().encode(message);
  var hashBuffer=await crypto.subtle.digest('SHA-256',msgBuffer);
  var hashArray=Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(function(b){return b.toString(16).padStart(2,'0');}).join('');
}
`;
  const loginIdx = fixed.indexOf('function doLogin()');
  if (loginIdx !== -1) {
    fixed = fixed.substring(0, loginIdx) + sha256fn + fixed.substring(loginIdx);
    console.log('✅ Step 2: SHA-256 function added');
  }
} else {
  console.log('✅ Step 2: SHA-256 already present');
}

// ============================================
// STEP 3 — Rewrite doLogin with async hash
// ============================================
const doLoginStart = fixed.indexOf('function doLogin(){');
if (doLoginStart === -1) { console.log('❌ doLogin not found'); process.exit(1); }
const doLoginEnd = fixed.indexOf('\n}', doLoginStart) + 2;

const newDoLogin = `function doLogin(){
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
      attempts=0;isOwner=true;currentStaff='Owner';
      localStorage.setItem('lt_role','owner');
      localStorage.setItem('lt_ts',Date.now().toString());
      document.querySelectorAll('.owner-only').forEach(function(el){el.style.display='';});
      initApp();return;
    }
    attempts++;
    err.style.display='block';
    err.textContent='Incorrect email or password ('+attempts+'/5)';
    if(attempts>=5){
      locked=true;var secs=600;err.style.display='none';
      var lk=document.getElementById('llock');lk.style.display='block';
      var t=setInterval(function(){secs--;lk.textContent='Too many attempts. Try again in '+Math.floor(secs/60)+'m '+(secs%60)+'s';if(secs<=0){clearInterval(t);locked=false;attempts=0;lk.style.display='none';}},1000);
    }
  });
}`;

fixed = fixed.substring(0, doLoginStart) + newDoLogin + fixed.substring(doLoginEnd);
console.log('✅ Step 3: doLogin rewritten with async SHA-256');

// ============================================
// STEP 4 — Rewrite doSL with async hash
// ============================================
const doSLStart = fixed.indexOf('function doSL(){');
if (doSLStart === -1) { console.log('❌ doSL not found'); process.exit(1); }
const doSLEnd = fixed.indexOf('\n}', doSLStart) + 2;

const newDoSL = `function doSL(){
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

fixed = fixed.substring(0, doSLStart) + newDoSL + fixed.substring(doSLEnd);
console.log('✅ Step 4: doSL rewritten with async SHA-256');

// ============================================
// STEP 5 — Rewrite checkPin with async hash
// Find the function and replace cleanly
// ============================================
const cpStart = fixed.indexOf('function checkPin(');
if (cpStart !== -1) {
  const cpEnd = fixed.indexOf('\n}', cpStart) + 2;
  const currentCP = fixed.substring(cpStart, cpEnd);
  console.log('Current checkPin length:', currentCP.length);

  // Build new checkPin
  const newCheckPin = `function checkPin(){
  var p=prompt('Enter owner PIN:');
  if(!p)return;
  sha256(p).then(function(ph){
    if(ph===APIN||ph===OPIN){
      isOwner=true;
      document.querySelectorAll('.owner-only').forEach(function(el){el.style.display='';});
      showToast('Owner Access','PIN accepted');
      pinTimer&&clearTimeout(pinTimer);
      pinTimer=setTimeout(function(){isOwner=false;document.querySelectorAll('.owner-only').forEach(function(el){el.style.display='none';});showToast('Locked','Owner access expired');},30*60*1000);
    } else {
      showToast('Wrong PIN','Incorrect PIN entered');
    }
  });
}`;

  fixed = fixed.substring(0, cpStart) + newCheckPin + fixed.substring(cpEnd);
  console.log('✅ Step 5: checkPin rewritten with async SHA-256');
} else {
  console.log('⚠️  Step 5: checkPin not found');
}

// ============================================
// STEP 6 — Final check no plaintext remains
// ============================================
const hasOwner = fixed.includes('LetsTaco2024');
const hasStaff = fixed.includes('LetsWork2024');
console.log('Plaintext owner password remaining:', hasOwner ? '⚠️  YES' : '✅ No');
console.log('Plaintext staff password remaining:', hasStaff ? '⚠️  YES' : '✅ No');

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
  catch(e) {
    console.log('❌ JS Error block', i, ':', e.message);
    // Show context
    var lines = sc.split('\n');
    var mid = Math.floor(lines.length/2);
    lines.slice(Math.max(0,mid-3),mid+3).forEach(function(l,li){
      console.log(' ', mid-3+li, ':', l.substring(0,100));
    });
    ok = false;
  }
});
if (!ok) {
  console.log('❌ JS validation failed — file NOT saved.');
  process.exit(1);
}
console.log('✅ All JS validated —', scripts.length, 'blocks');
fs.writeFileSync('admin.html', fixed, 'utf8');
console.log('✅ admin.html saved — passwords hashed with SHA-256');
console.log('');
console.log('SAVE THESE HASHES:');
console.log('Owner:', OWNER_HASH);
console.log('Staff:', STAFF_HASH);
console.log('PIN:  ', PIN_HASH);
