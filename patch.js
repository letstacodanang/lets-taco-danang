const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

if (html.includes('Lam Tuyen')) {
  console.log('STOP — Wrong file detected.');
  process.exit(1);
}
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// FIX — Hide the "HOW TO PAY" WhatsApp box for dine-in orders
// Currently it always shows in the checkout view
// We need to hide it when order type is dine-in
// The box has a fixed style — we add an id to it so JS can hide it

const oldPayBox = '<div style="background:rgba(212,160,23,0.08);border:1px solid rgba(212,160,23,0.3);border-radius:8px;padding:15px;margin-bottom:20px;"><div style="font-family:\'Bebas Neue\',sans-serif;font-size:1rem;color:#D4A017;letter-spacing:2px;margin-bottom:8px;">💳 HOW TO PAY</div><div style="font-size:0.85rem;color:#FAF0E6;line-height:1.7;">Place your order first, then WhatsApp us to pay. We start cooking once payment is confirmed.</div><a href="https://wa.me/84909923941" target="_blank" style="display:block;margin-top:12px;text-align:center;background:#25D366;color:white;padding:12px;border-radius:6px;text-decoration:none;font-family:\'Jost\',sans-serif;font-size:0.9rem;font-weight:700;letter-spacing:1px;">💬 WhatsApp to Pay: 0909 923 941</a></div>';

const newPayBox = '<div id="how-to-pay-box" style="background:rgba(212,160,23,0.08);border:1px solid rgba(212,160,23,0.3);border-radius:8px;padding:15px;margin-bottom:20px;"><div style="font-family:\'Bebas Neue\',sans-serif;font-size:1rem;color:#D4A017;letter-spacing:2px;margin-bottom:8px;">💳 HOW TO PAY</div><div style="font-size:0.85rem;color:#FAF0E6;line-height:1.7;">Place your order first, then WhatsApp us to pay. We start cooking once payment is confirmed.</div><a href="https://wa.me/84909923941" target="_blank" style="display:block;margin-top:12px;text-align:center;background:#25D366;color:white;padding:12px;border-radius:6px;text-decoration:none;font-family:\'Jost\',sans-serif;font-size:0.9rem;font-weight:700;letter-spacing:1px;">💬 WhatsApp to Pay: 0909 923 941</a></div>';

if (fixed.includes(oldPayBox)) {
  fixed = fixed.replace(oldPayBox, newPayBox);
  console.log('✅ Fix 1: Added id to HOW TO PAY box');
} else {
  console.log('⚠️  Fix 1: HOW TO PAY box pattern not found — will add id via different method');
  // Fallback — find by unique anchor text
  fixed = fixed.replace(
    '💬 WhatsApp to Pay: 0909 923 941</a></div>',
    '💬 WhatsApp to Pay: 0909 923 941</a></div><!-- end how-to-pay -->'
  );
}

// FIX 2 — Update setOT function to show/hide the pay box based on order type
// Find the setOT function and add logic to hide box for dine-in
const oldSetOT = "document.getElementById('table-row').style.display=t==='dinein'?'block':'none';";
const newSetOT = "document.getElementById('table-row').style.display=t==='dinein'?'block':'none';\n  var hpb=document.getElementById('how-to-pay-box');if(hpb)hpb.style.display=t==='dinein'?'none':'block';";

if (fixed.includes(oldSetOT)) {
  fixed = fixed.replace(oldSetOT, newSetOT);
  console.log('✅ Fix 2: setOT now hides HOW TO PAY box for dine-in');
} else {
  console.log('⚠️  Fix 2: setOT pattern not found — check manually');
}

// FIX 3 — Also hide it when QR scan auto-sets to dine-in
// In the goToCheckout function, check order type and hide box
const oldGoCheckout = "function goToCheckout(){if(!gTI())return;";
const newGoCheckout = "function goToCheckout(){if(!gTI())return;\n  setTimeout(function(){var hpb=document.getElementById('how-to-pay-box');if(hpb)hpb.style.display=oType==='dinein'?'none':'block';},50);";

if (fixed.includes(oldGoCheckout)) {
  fixed = fixed.replace(oldGoCheckout, newGoCheckout);
  console.log('✅ Fix 3: goToCheckout hides HOW TO PAY for dine-in');
} else {
  console.log('⚠️  Fix 3: goToCheckout pattern not found — check manually');
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
fs.writeFileSync('index.html', fixed, 'utf8');
console.log('✅ index.html saved — HOW TO PAY hidden for dine-in');
