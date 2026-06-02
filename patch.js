const fs = require('fs');

const html = fs.readFileSync('admin.html', 'utf8');

if (html.includes('Lam Tuyen')) {
  console.log('STOP — Wrong file detected.');
  process.exit(1);
}
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// Inject MARK PAID handler right after data-adv handler
const oldHandler = `container.querySelectorAll('[data-adv]').forEach(function(b){b.addEventListener('click',function(e){e.stopPropagation();advO(this.getAttribute('data-adv'),this.getAttribute('data-ns'));});});`;

const newHandler = `container.querySelectorAll('[data-adv]').forEach(function(b){b.addEventListener('click',function(e){e.stopPropagation();advO(this.getAttribute('data-adv'),this.getAttribute('data-ns'));});});
  // MARK PAID handler for takeout/delivery orders
  container.querySelectorAll('[data-payid]').forEach(function(b){
    b.addEventListener('click',function(e){
      e.stopPropagation();
      var id=this.getAttribute('data-payid');
      var btn=this;
      btn.textContent='SAVING...';
      btn.disabled=true;
      btn.style.opacity='0.6';
      sbC('/rest/v1/orders?id=eq.'+id,{
        method:'PATCH',
        headers:{'Prefer':'return=minimal'},
        body:JSON.stringify({payment_status:'paid'})
      }).then(function(){
        showToast('✅ Payment Confirmed','Kitchen has been notified — cooking starts now');
        setTimeout(function(){loadOrders();loadHome();},800);
      }).catch(function(){
        btn.textContent='💳 MARK PAID';
        btn.disabled=false;
        btn.style.opacity='1';
        showToast('Error','Could not update. Try again.');
      });
    });
  });`;

if (fixed.includes(oldHandler)) {
  fixed = fixed.replace(oldHandler, newHandler);
  console.log('✅ Fix: MARK PAID click handler injected after data-adv handler');
} else {
  console.log('❌ Pattern not found — check admin.html');
  process.exit(1);
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
console.log('✅ admin.html saved — MARK PAID fully wired');
