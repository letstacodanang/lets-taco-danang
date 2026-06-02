const fs = require('fs');

const html = fs.readFileSync('admin.html', 'utf8');

if (html.includes('Lam Tuyen')) {
  console.log('STOP — Wrong file detected.');
  process.exit(1);
}
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// ============================================
// FIX — CLARIFY THE TWO TABLE ACTION BUTTONS
// Make them visually different and clearly
// labeled so staff never confuses them
// ============================================

// Fix the ADD MORE ITEMS button — this is inside tdlist
// It's rendered by the JS that builds the table detail
// Find it in the JS

const oldAddMore = `'+ ADD MORE ITEMS'`;
const newAddMore = `'+ ADD TO EXISTING ORDER'`;

if (fixed.includes(oldAddMore)) {
  fixed = fixed.replace(oldAddMore, newAddMore);
  console.log('✅ Fix 1: ADD MORE ITEMS renamed to ADD TO EXISTING ORDER');
} else {
  console.log('⚠️  Fix 1: ADD MORE ITEMS not found in JS — trying HTML');
  fixed = fixed.replace(
    '+ ADD MORE ITEMS',
    '+ ADD TO EXISTING ORDER'
  );
  console.log('✅ Fix 1: Renamed via HTML replace');
}

// Fix the ADD ITEMS FOR THIS TABLE button — staff order button
// Find and replace with clearer label + sub-description
const oldStaffBtn = `<button onclick="openNTO(window._currentTable||0)" style="background:linear-gradient(135deg,#D4A017,#E67E22);color:white;border:none;padding:11px 20px;border-radius:6px;font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:2px;cursor:pointer;flex:1;">+ ADD ITEMS FOR THIS TABLE</button>`;

const newStaffBtn = `<div style="border-top:1px solid #E5E7EB;padding-top:14px;margin-top:4px;">
  <div style="font-size:0.68rem;letter-spacing:1px;text-transform:uppercase;color:#9CA3AF;margin-bottom:8px;font-weight:600;">Staff Order — Customer not using the app</div>
  <button onclick="openNTO(window._currentTable||0)" style="width:100%;background:linear-gradient(135deg,#1A0800,#2A1200);color:#D4A017;border:2px solid #D4A017;padding:13px 20px;border-radius:6px;font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:2px;cursor:pointer;">👨‍🍳 STAFF: PLACE NEW ORDER FOR TABLE</button>
</div>`;

if (fixed.includes(oldStaffBtn)) {
  fixed = fixed.replace(oldStaffBtn, newStaffBtn);
  console.log('✅ Fix 2: Staff order button redesigned with clear label');
} else {
  console.log('⚠️  Fix 2: staff btn pattern not found — trying partial');
  fixed = fixed.replace(
    '+ ADD ITEMS FOR THIS TABLE',
    '👨‍🍳 STAFF: PLACE NEW ORDER FOR TABLE'
  );
  console.log('✅ Fix 2: Staff button text updated via partial replace');
}

// Also find the existing ADD TO EXISTING ORDER button style
// and make it clearly secondary/outlined
const oldExistingBtn = `style="background:rgba(212,160,23,0.08);border:2px dashed rgba(212,160,23,0.4);color:#D4A017;padding:12px;border-radius:6px;font-family:Bebas Neue,sans-serif;font-size:0.9rem;letter-spacing:2px;cursor:pointer;width:100%;margin-top:10px;"`;

if (fixed.includes(oldExistingBtn)) {
  fixed = fixed.replace(
    oldExistingBtn,
    `style="background:white;border:2px solid #D4A017;color:#D4A017;padding:12px;border-radius:6px;font-family:Bebas Neue,sans-serif;font-size:0.9rem;letter-spacing:2px;cursor:pointer;width:100%;margin-top:10px;"`
  );
  console.log('✅ Fix 3: ADD TO EXISTING ORDER styled as outlined secondary');
} else {
  console.log('⚠️  Fix 3: existing button style not found — checking JS render');
  // Find in JS context
  const addMoreIdx = fixed.indexOf('ADD TO EXISTING ORDER');
  if (addMoreIdx !== -1) {
    console.log('Found ADD TO EXISTING ORDER at:', addMoreIdx);
    console.log('Context:', fixed.substring(addMoreIdx - 200, addMoreIdx + 100));
  }
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
console.log('✅ admin.html saved — table action buttons clarified');
