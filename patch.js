const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

if (html.includes('Lam Tuyen')) {
  console.log('STOP — Wrong file detected.');
  process.exit(1);
}
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// Find the tracker-ref div and add headline slot after it
// We search for the unique tracker-ref pattern
const oldRef = `id="tracker-ref">LTD-XXXXXX</div></div>`;
const newRef = `id="tracker-ref">LTD-XXXXXX</div></div>
<div id="tracker-headline" style="margin-bottom:20px;"></div>`;

if (fixed.includes(oldRef)) {
  // Check if already patched
  if (fixed.includes('tracker-headline')) {
    console.log('✅ tracker-headline already exists — no duplicate needed');
  } else {
    fixed = fixed.replace(oldRef, newRef);
    console.log('✅ Fix: tracker-headline slot added');
  }
} else {
  console.log('⚠️  tracker-ref pattern not found — checking what is there');
  // Try to find any reference to tracker-ref
  const idx = fixed.indexOf('tracker-ref');
  if (idx !== -1) {
    console.log('Found tracker-ref at index', idx);
    console.log('Context:', fixed.substring(idx - 20, idx + 80));
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
fs.writeFileSync('index.html', fixed, 'utf8');
console.log('✅ index.html saved — tracker headline slot fixed');
