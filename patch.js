const fs = require('fs');

const html = fs.readFileSync('admin.html', 'utf8');
if (html.includes('Lam Tuyen')) { console.log('STOP'); process.exit(1); }
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// Fix mNav to call showPg instead of showPage
const oldMNav = `function mNav(el,pg){
  // Update active tab
  document.querySelectorAll('.mn-tab').forEach(function(t){t.classList.remove('active');});
  if(el)el.classList.add('active');
  // Navigate to page
  showPage(pg);
  // Update mobile topbar title
  var titles={home:'Dashboard',dinein:'Tables',orders:'Orders',menu:'Menu',customers:'Customers',revenue:'Revenue',settings:'Settings',help:'Guide'};
  var tb=document.querySelector('.mobile-topbar-title');
  if(tb)tb.textContent=titles[pg]||'LETS TACO';
}`;

const newMNav = `function mNav(el,pg){
  document.querySelectorAll('.mn-tab').forEach(function(t){t.classList.remove('active');});
  if(el)el.classList.add('active');
  // Use the correct function name
  showPg(pg);
  var titles={home:'Dashboard',dinein:'Tables',orders:'Orders',menu:'Menu',customers:'Customers',revenue:'Revenue',settings:'Settings',help:'Guide'};
  var tb=document.querySelector('.mobile-topbar-title');
  if(tb)tb.textContent=titles[pg]||'LETS TACO';
}`;

if (fixed.includes(oldMNav)) {
  fixed = fixed.replace(oldMNav, newMNav);
  console.log('✅ Fix: mNav now calls showPg correctly');
} else {
  // Simple replace of the wrong function call
  fixed = fixed.replace('showPage(pg);', 'showPg(pg);');
  console.log('✅ Fix: showPage replaced with showPg via simple replace');
}

// Also make sure showPg updates the mobile nav active state
// Find showPg and add mobile nav sync
const oldShowPg = `function showPg(pg){
  document.querySelectorAll('.pg').forEach(function(p){p.classList.remove('active');});
  document.querySelectorAll('.ni').forEac`;

const showPgIdx = fixed.indexOf('function showPg(pg)');
if (showPgIdx !== -1) {
  const showPgEnd = fixed.indexOf('\n}', showPgIdx) + 2;
  const currentShowPg = fixed.substring(showPgIdx, showPgEnd);
  
  // Add mobile nav sync at the end of showPg
  const newShowPg = currentShowPg.replace(
    /\}$/,
    `  // Sync mobile bottom nav active state
  document.querySelectorAll('.mn-tab').forEach(function(t){
    t.classList.remove('active');
    if(t.getAttribute('data-pg')===pg)t.classList.add('active');
  });
}`
  );
  
  if (currentShowPg !== newShowPg) {
    fixed = fixed.substring(0, showPgIdx) + newShowPg + fixed.substring(showPgEnd);
    console.log('✅ Fix 2: showPg syncs mobile nav active state');
  } else {
    console.log('⚠️  Fix 2: showPg replace did not match');
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
console.log('✅ admin.html saved — mobile nav tabs working');
