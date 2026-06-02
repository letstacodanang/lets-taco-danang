const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

if (html.includes('Lam Tuyen')) {
  console.log('STOP — Wrong file detected.');
  process.exit(1);
}
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// FIX 1 — Remove blue filter from menu hero image
// The map iframe has a filter applied but it is bleeding visually
// The menu-photo-hero image should never have any filter on it
// We ensure the menu hero img has explicit filter:none
const oldMenuHero = '<div class="menu-photo-hero">';
const newMenuHero = '<div class="menu-photo-hero" style="filter:none!important;">';
if (fixed.includes(oldMenuHero)) {
  fixed = fixed.replace(oldMenuHero, newMenuHero);
  console.log('✅ Fix 1: menu hero image filter removed');
} else {
  console.log('⚠️  Fix 1: menu-photo-hero pattern not found — check manually');
}

// FIX 2 — Move floating taco button higher on mobile
// Currently bottom:30px — move to bottom:90px so it clears phone nav bar
const oldCartBtn = 'id="cart-btn" onclick="toggleCart()" style="position:fixed;bottom:30px;right:30px;';
const newCartBtn = 'id="cart-btn" onclick="toggleCart()" style="position:fixed;bottom:90px;right:20px;';
if (fixed.includes(oldCartBtn)) {
  fixed = fixed.replace(oldCartBtn, newCartBtn);
  console.log('✅ Fix 2: floating taco button moved higher');
} else {
  console.log('⚠️  Fix 2: cart-btn pattern not found — check manually');
}

// FIX 3 — Grilled Steak card has wrong photo (people photo)
// Current: IMG_1779730373040_1779730398556.jpg (people/exterior shot)
// Replace with the birria on grill photo which shows actual meat/food
const oldSteak = 'https://kigqjuxxoeoeezjguuxu.supabase.co/storage/v1/object/public/photos/IMG_1779730373040_1779730398556.jpg" alt="Grilled steak tacos"';
const newSteak = 'https://kigqjuxxoeoeezjguuxu.supabase.co/storage/v1/object/public/photos/IMG_1779730373184_1779730422455.jpg" alt="Grilled steak tacos"';
if (fixed.includes(oldSteak)) {
  fixed = fixed.replace(oldSteak, newSteak);
  console.log('✅ Fix 3: Grilled Steak photo updated to food photo');
} else {
  console.log('⚠️  Fix 3: Grilled Steak pattern not found — check manually');
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
console.log('✅ index.html saved — 3 fixes applied');
