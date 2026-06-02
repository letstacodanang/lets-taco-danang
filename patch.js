const fs = require('fs');

// Safety check — make sure we are working on the right file
const html = fs.readFileSync('index.html', 'utf8');

if (html.includes('Lam Tuyen')) {
  console.log('STOP — Wrong file detected. Contains Lam Tuyen.');
  process.exit(1);
}

if (!html.includes("Let's Taco") && !html.includes("lets-taco")) {
  console.log('STOP — File does not look like the taco restaurant.');
  process.exit(1);
}

console.log('✅ File identity confirmed — Let\'s Taco Da Nang');

// THE FIX — pay-wa-link does not exist in HTML
// showTracker tries to set href on it and crashes silently
// We replace the broken reference with working WhatsApp link logic

const broken = `var wm=encodeURIComponent('Hi! I just placed order '+ref+'. Total: '+fV(d.total)+'. Confirming payment now!');document.getElementById('pay-wa-link').href='https://wa.me/84909923941?text='+wm;`;

const fixed = `var wm=encodeURIComponent('Hi! I just placed order '+ref+'. Total: '+fV(d.total)+'. Confirming payment now!');var waLink=document.getElementById('pay-wa-link');if(waLink)waLink.href='https://wa.me/84909923941?text='+wm;`;

if (!html.includes(broken)) {
  console.log('⚠️  Bug pattern not found — may already be fixed or code changed.');
  console.log('Check index.html manually for pay-wa-link reference.');
  process.exit(0);
}

const fixed_html = html.replace(broken, fixed);

// JS Validation
const scripts = [];
let pos = 0;
while (true) {
  const s = fixed_html.indexOf('<script>', pos);
  if (s === -1) break;
  const e = fixed_html.indexOf('<\/script>', s);
  if (e === -1) break;
  scripts.push(fixed_html.substring(s + 8, e));
  pos = e + 9;
}

let ok = true;
scripts.forEach(function(sc, i) {
  try { new Function(sc); }
  catch(e) { console.log('❌ JS Error in block', i, ':', e.message); ok = false; }
});

if (!ok) {
  console.log('❌ JS validation failed — file NOT saved.');
  process.exit(1);
}

console.log('✅ JS validation passed');

fs.writeFileSync('index.html', fixed_html, 'utf8');
console.log('✅ index.html saved — pay-wa-link bug fixed');
