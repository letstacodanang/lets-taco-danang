const fs = require('fs');

const html = fs.readFileSync('admin.html', 'utf8');

if (html.includes('Lam Tuyen')) {
  console.log('STOP — Wrong file detected.');
  process.exit(1);
}
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// Fix the ADD TO EXISTING ORDER button style in JS
// Found at: rgba(212,160,23,0.06);border:1px dashed rgba(212,160,23,0.25)
const oldExistingStyle = `background:rgba(212,160,23,0.06);border:1px dashed rgba(212,160,23,0.25);color:#D4A017;padding:11px;border-radius:5px;font-family:Bebas Neue,sans-serif;font-size:0.9rem;letter-spacing:2px;cursor:pointer;margin-top:4px">+ ADD TO EXISTING ORDER</button>';`;

const newExistingStyle = `background:white;border:2px solid #D4A017;color:#D4A017;padding:11px;border-radius:5px;font-family:Bebas Neue,sans-serif;font-size:0.9rem;letter-spacing:2px;cursor:pointer;margin-top:4px;width:100%;"><span style=\\"margin-right:6px;\\">📋</span> ADD TO EXISTING ORDER — Same Bill</button>';`;

if (fixed.includes(oldExistingStyle)) {
  fixed = fixed.replace(oldExistingStyle, newExistingStyle);
  console.log('✅ Fix 1: ADD TO EXISTING ORDER styled correctly with same bill label');
} else {
  console.log('⚠️  Fix 1: exact style not found — trying partial');
  fixed = fixed.replace(
    `+ ADD TO EXISTING ORDER</button>';`,
    `📋 ADD TO EXISTING ORDER — Same Bill</button>';`
  );
  console.log('✅ Fix 1: Text updated via partial replace');
}

// Also make sure the divider between the two buttons is clear
// Add a clear separator label above the staff button in HTML
const oldStaffSection = `<div style="border-top:1px solid #E5E7EB;padding-top:14px;margin-top:4px;">
  <div style="font-size:0.68rem;letter-spacing:1px;text-transform:uppercase;color:#9CA3AF;margin-bottom:8px;font-weight:600;">Staff Order — Customer not using the app</div>`;

const newStaffSection = `<div style="border-top:2px solid #F3F4F6;padding-top:14px;margin-top:14px;">
  <div style="font-size:0.68rem;letter-spacing:1px;text-transform:uppercase;color:#9CA3AF;margin-bottom:8px;font-weight:600;">📵 Customer Not Using Phone — Staff Places Order</div>`;

if (fixed.includes(oldStaffSection)) {
  fixed = fixed.replace(oldStaffSection, newStaffSection);
  console.log('✅ Fix 2: Staff section divider made clearer');
} else {
  console.log('⚠️  Fix 2: staff section pattern not found — skipping');
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
console.log('✅ admin.html saved — buttons fully clarified');
