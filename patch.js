const fs = require('fs');

const html = fs.readFileSync('admin.html', 'utf8');
if (html.includes('Lam Tuyen')) { console.log('STOP'); process.exit(1); }
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// ============================================
// FIX 1 — MARK PAID BUTTON
// The button uses onclick="markPaid(id, this)"
// but the data-payid handler also exists
// Standardize on onclick — remove confusion
// Make sure markPaid function works correctly
// ============================================

// Find the MARK PAID button in the card renderer
// It currently has data-payid attribute
// Change it to use onclick directly
const oldPayBtn = `+'<button class="abtn abtn-paid" data-payid="'+o.id+'" style="padding:8px 16px;font-size:0.78rem;border-radius:4px;cursor:pointer;font-family:Jost,sans-serif;font-weight:700;letter-spacing:1px;background:linear-gradient(135deg,#C0392B,#E67E22);color:white;border:none;">💳 MARK PAID</button>'`;

const newPayBtn = `+'<button class="abtn abtn-paid" onclick="event.stopPropagation();markPaid(\''+o.id+'\',this)" style="padding:8px 16px;font-size:0.78rem;border-radius:4px;cursor:pointer;font-family:Jost,sans-serif;font-weight:700;letter-spacing:1px;background:linear-gradient(135deg,#C0392B,#E67E22);color:white;border:none;touch-action:manipulation;">💳 MARK PAID</button>'`;

if (fixed.includes(oldPayBtn)) {
  fixed = fixed.replace(oldPayBtn, newPayBtn);
  console.log('✅ Fix 1a: MARK PAID button uses onclick directly');
} else {
  console.log('⚠️  Fix 1a: pay btn pattern not found — trying alternative');
  // Try finding by data-payid attribute
  fixed = fixed.replace(
    /data-payid="'\+o\.id\+'"/g,
    `onclick="event.stopPropagation();markPaid('"+o.id+"',this)"`
  );
  console.log('✅ Fix 1a: data-payid replaced with onclick via regex');
}

// Fix the markPaid function to also refresh fast
const oldMarkPaid = `  }).then(function() {
    showToast('✅ Payment Confirmed', 'Order marked as paid — kitchen will start cooking');
    setTimeout(function(){loadOrders();loadHome();},800);
  }).catch(function() {
    btn.textContent='💳 MARK PAID';
    btn.disabled=false;
    btn.style.opacity='1';
    showToast('Error','Could not update. Try again.');
  });`;

const newMarkPaid = `  }).then(function() {
    showToast('✅ Payment Confirmed','Kitchen notified — cooking starts now');
    // Immediately update button to show paid
    btn.textContent='✅ PAID';
    btn.style.background='#10B981';
    btn.style.opacity='1';
    btn.disabled=true;
    // Remove the unpaid banner
    var banner=btn.closest('.unpaid-admin-banner');
    if(banner){
      banner.style.background='rgba(16,185,129,0.1)';
      banner.style.borderColor='rgba(16,185,129,0.3)';
      banner.querySelector('.unpaid-admin-label').textContent='✅ PAYMENT CONFIRMED';
      banner.querySelector('.unpaid-admin-label').style.color='#10B981';
      banner.removeChild(btn);
    }
    // Fast refresh
    setTimeout(function(){loadOrders();loadHome();},500);
  }).catch(function() {
    btn.textContent='💳 MARK PAID';
    btn.disabled=false;
    btn.style.opacity='1';
    showToast('Error','Could not update — try again');
  });`;

if (fixed.includes(oldMarkPaid)) {
  fixed = fixed.replace(oldMarkPaid, newMarkPaid);
  console.log('✅ Fix 1b: markPaid function gives instant visual feedback');
} else {
  console.log('⚠️  Fix 1b: markPaid function pattern not found');
}

// ============================================
// FIX 2 — POLLING SPEED
// Orders: 30s → 2s
// Ready alert: 8s → 2s
// Pay alert: 10s → 2s
// ============================================

// Fix order polling
const old30s = 'setInterval(loadO,30000);';
const new2s = 'setInterval(loadO,2000);';
if (fixed.includes(old30s)) {
  fixed = fixed.replace(old30s, new2s);
  console.log('✅ Fix 2a: Order polling 30s → 2s');
} else {
  console.log('⚠️  Fix 2a: 30s interval not found');
}

// Fix ready alert polling
const old8s = 'setInterval(checkReadyAlert,8000);';
const new8s2 = 'setInterval(checkReadyAlert,2000);';
if (fixed.includes(old8s)) {
  fixed = fixed.replace(old8s, new8s2);
  console.log('✅ Fix 2b: Ready alert polling 8s → 2s');
} else {
  console.log('⚠️  Fix 2b: 8s interval not found');
}

// Fix pay alert polling
const old10s = 'setInterval(checkPayAlert,10000);';
const new10s2 = 'setInterval(checkPayAlert,2000);';
if (fixed.includes(old10s)) {
  fixed = fixed.replace(old10s, new10s2);
  console.log('✅ Fix 2c: Pay alert polling 10s → 2s');
} else {
  console.log('⚠️  Fix 2c: 10s interval not found');
}

// Also fix home tab polling if it exists separately
fixed = fixed.replace('setInterval(loadHome,30000)', 'setInterval(loadHome,2000)');
fixed = fixed.replace('setInterval(loadO,15000)', 'setInterval(loadO,2000)');
console.log('✅ Fix 2d: Any remaining slow intervals updated');

// ============================================
// FIX 3 — KITCHEN POLLING SPEED
// kitchen.html currently polls every 8s
// Change to 2s for instant food ready alerts
// ============================================

const kitchen = fs.readFileSync('kitchen.html', 'utf8');
let fixedKitchen = kitchen;

const oldKitchenPoll = 'setInterval(poll,8000);';
const newKitchenPoll = 'setInterval(poll,2000);';

if (fixedKitchen.includes(oldKitchenPoll)) {
  fixedKitchen = fixedKitchen.replace(oldKitchenPoll, newKitchenPoll);
  console.log('✅ Fix 3a: Kitchen polling 8s → 2s');
} else {
  console.log('⚠️  Fix 3a: kitchen 8s poll not found');
}

// Make COLLECTED cards disappear instantly
// Currently has 400ms delay before poll
const oldCollected = `card.style.opacity="0";card.style.transform="scale(0.95)";setTimeout(function(){poll();},400);`;
const newCollected = `card.style.opacity="0";card.style.transform="scale(0.95)";setTimeout(function(){poll();},200);`;

if (fixedKitchen.includes(oldCollected)) {
  fixedKitchen = fixedKitchen.replace(oldCollected, newCollected);
  console.log('✅ Fix 3b: COLLECTED card disappears in 200ms instead of 400ms');
}

// JS Validation — kitchen
const kScripts = [];
let kPos = 0;
while (true) {
  const s = fixedKitchen.indexOf('<script>', kPos);
  if (s === -1) break;
  const e = fixedKitchen.indexOf('<\/script>', s);
  if (e === -1) break;
  kScripts.push(fixedKitchen.substring(s + 8, e));
  kPos = e + 9;
}
let kOk = true;
kScripts.forEach(function(sc, i) {
  try { new Function(sc); }
  catch(e) { console.log('❌ Kitchen JS Error block', i, ':', e.message); kOk = false; }
});
if (!kOk) {
  console.log('❌ Kitchen JS validation failed');
  process.exit(1);
}
console.log('✅ Kitchen JS validation passed');
fs.writeFileSync('kitchen.html', fixedKitchen, 'utf8');
console.log('✅ kitchen.html saved — 2s polling + instant clear');

// JS Validation — admin
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
  catch(e) { console.log('❌ Admin JS Error block', i, ':', e.message); ok = false; }
});
if (!ok) {
  console.log('❌ Admin JS validation failed — file NOT saved.');
  process.exit(1);
}
console.log('✅ Admin JS validation passed');
fs.writeFileSync('admin.html', fixed, 'utf8');
console.log('✅ admin.html saved — MARK PAID fixed + 2s polling live');
