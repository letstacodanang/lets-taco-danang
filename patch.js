const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

if (html.includes('Lam Tuyen')) {
  console.log('STOP — Wrong file. Contains Lam Tuyen.');
  process.exit(1);
}
console.log('✅ File identity confirmed — Lets Taco Da Nang');

// Fix duplicate photo on Grilled Chicken card
// Currently using the same photo as Grilled Pork (419311.jpg)
// Replace SECOND occurrence of 419311 with the chicken photo (418145)

const duplicatePhoto = 'IMG_1779730373155_1779730419311.jpg';
const chickenPhoto = 'IMG_1779730373148_1779730418145.jpg';

const base = 'https://kigqjuxxoeoeezjguuxu.supabase.co/storage/v1/object/public/photos/';

const oldSrc = base + duplicatePhoto;
const newSrc = base + chickenPhoto;

// Count how many times the duplicate appears
const count = (html.match(new RegExp(oldSrc.replace(/\./g,'\\.'),'g'))||[]).length;
console.log('Found duplicate photo used', count, 'times');

if (count < 2) {
  console.log('⚠️  Expected 2 uses of duplicate photo, found', count);
  console.log('Check index.html manually.');
  process.exit(0);
}

// Replace only the SECOND occurrence (Grilled Chicken card)
let fixed = html;
const firstPos = fixed.indexOf(oldSrc);
const secondPos = fixed.indexOf(oldSrc, firstPos + 1);
fixed = fixed.substring(0, secondPos) + newSrc + fixed.substring(secondPos + oldSrc.length);

console.log('✅ Replaced second occurrence with chicken photo');

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
  catch(e) { console.log('JS Error block', i, ':', e.message); ok = false; }
});

if (!ok) {
  console.log('❌ JS validation failed — file NOT saved.');
  process.exit(1);
}

console.log('✅ JS validation passed');
fs.writeFileSync('index.html', fixed, 'utf8');
console.log('✅ index.html saved — Grilled Chicken now has correct photo');
