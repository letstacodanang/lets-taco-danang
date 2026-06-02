const fs = require('fs');

const html = fs.readFileSync('admin.html', 'utf8');
if (html.includes('Lam Tuyen')) { console.log('STOP'); process.exit(1); }
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// Remove the NEW TABLE ORDER button entirely
// Staff taps the table directly instead
const oldDineInHeader = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px;padding-top:4px;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:1.3rem;color:#1A1A2E;letter-spacing:2px;">🍽️ TABLE STATUS</div>
        <button onclick="openNTO(0)"`;

if (fixed.includes(oldDineInHeader)) {
  // Find the full button tag and remove it
  const btnStart = fixed.indexOf(oldDineInHeader);
  const btnEnd = fixed.indexOf('</div>', fixed.indexOf('</button>', btnStart)) + 6;
  const fullBlock = fixed.substring(btnStart, btnEnd);
  console.log('Found block to clean:', fullBlock.substring(0, 100));

  const newDineInHeader = `<div style="margin-bottom:16px;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:1.3rem;color:#1A1A2E;letter-spacing:2px;">🍽️ TABLE STATUS</div>
        <div style="font-size:0.78rem;color:#6B7280;margin-top:4px;">Tap any table to view orders or place a new order for that table</div>
      </div>`;

  fixed = fixed.substring(0, btnStart) + newDineInHeader + fixed.substring(btnEnd);
  console.log('✅ Fix 1: Redundant NEW TABLE ORDER button removed');
} else {
  console.log('⚠️  Fix 1: header pattern not found — trying alternative');
  // Try finding just the button
  const btnIdx = fixed.indexOf('onclick="openNTO(0)"');
  if (btnIdx !== -1) {
    const btnStart = fixed.lastIndexOf('<button', btnIdx);
    const btnEnd = fixed.indexOf('</button>', btnIdx) + 9;
    fixed = fixed.substring(0, btnStart) + fixed.substring(btnEnd);
    console.log('✅ Fix 1: Button removed via alternative pattern');
  } else {
    console.log('⚠️  Fix 1: openNTO(0) button not found');
  }
}

// Also fix the top padding back to a reasonable amount
// 80px was too much — bring it to 68px
fixed = fixed.replace('padding-top:80px;', 'padding-top:68px;');
console.log('✅ Fix 2: Top padding corrected to 68px');

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
console.log('✅ admin.html saved — redundant button removed, layout clean');
