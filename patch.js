const fs = require('fs');

const html = fs.readFileSync('admin.html', 'utf8');
if (html.includes('Lam Tuyen')) { console.log('STOP'); process.exit(1); }
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// Fix mobile top padding — increase to clear the topbar fully
// Also add specific padding to the dinein page header
const oldMainPadding = `  .main{
    padding:8px;
    padding-top:72px;
    padding-bottom:80px;
    min-height:100vh;
  }`;

const newMainPadding = `  .main{
    padding:8px;
    padding-top:80px;
    padding-bottom:80px;
    min-height:100vh;
  }`;

if (fixed.includes(oldMainPadding)) {
  fixed = fixed.replace(oldMainPadding, newMainPadding);
  console.log('✅ Fix 1: Top padding increased to 80px');
} else {
  // Try simple replace
  fixed = fixed.replace('padding-top:72px;', 'padding-top:80px;');
  console.log('✅ Fix 1: padding-top updated via simple replace');
}

// Also add explicit margin to the dine-in page header
// so the TABLE STATUS title and NEW TABLE ORDER button
// are never under the topbar
const oldDineInHeader = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:1.3rem;color:#D4A017;letter-spacing:2px">DINE IN - TABLE STATUS</div>
        <button onclick="openNTO(0)"`;

const newDineInHeader = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px;padding-top:4px;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:1.3rem;color:#1A1A2E;letter-spacing:2px;">🍽️ TABLE STATUS</div>
        <button onclick="openNTO(0)"`;

if (fixed.includes(oldDineInHeader)) {
  fixed = fixed.replace(oldDineInHeader, newDineInHeader);
  console.log('✅ Fix 2: Dine-in header styling improved');
} else {
  console.log('⚠️  Fix 2: dine-in header pattern not found');
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
console.log('✅ admin.html saved — tables topbar overlap fixed');
