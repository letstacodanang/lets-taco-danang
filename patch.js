const fs = require('fs');

const html = fs.readFileSync('admin.html', 'utf8');
if (html.includes('Lam Tuyen')) { console.log('STOP'); process.exit(1); }
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// Fix markPaid function - replace the entire function with clean version
const oldMarkPaid = `function markPaid(orderId, btnEl) {
  if(!orderId) return;
  btnEl.textContent = 'SAVING...';
  btnEl.disabled = true;
  btnEl.style.opacity = '0.6';
  sbC('/rest/v1/orders?id=eq.'+orderId, {
    method: 'PATCH',
    headers: {'Prefer': 'return=minimal'},
    body: JSON.stringify({payment_status: 'paid'})
  }).then(function() {
    showToast('✅ Payment Confirmed', 'Order marked as paid — kitchen will start cooking');
    // Remove the unpaid banner from this card
    var card = btnEl.closest('.o`;

// Find the full function
const mpStart = fixed.indexOf('function markPaid(orderId, btnEl)');
const mpEnd = fixed.indexOf('\n}', mpStart) + 2;

if (mpStart !== -1) {
  const currentFn = fixed.substring(mpStart, mpEnd);
  console.log('Current markPaid length:', currentFn.length);

  const newMarkPaid = `function markPaid(orderId, btnEl) {
  if(!orderId||!btnEl) return;
  btnEl.textContent='SAVING...';
  btnEl.disabled=true;
  btnEl.style.opacity='0.6';
  sbC('/rest/v1/orders?id=eq.'+orderId,{
    method:'PATCH',
    headers:{'Prefer':'return=minimal'},
    body:JSON.stringify({payment_status:'paid'})
  }).then(function(){
    showToast('Payment Confirmed','Kitchen notified — cooking starts now');
    btnEl.textContent='PAID';
    btnEl.style.background='#10B981';
    btnEl.style.color='white';
    btnEl.style.opacity='1';
    btnEl.disabled=true;
    var banner=btnEl.closest('.unpaid-admin-banner');
    if(banner){
      var lbl=banner.querySelector('.unpaid-admin-label');
      if(lbl){lbl.textContent='PAYMENT CONFIRMED';lbl.style.color='#10B981';}
      banner.style.background='rgba(16,185,129,0.08)';
      banner.style.borderColor='rgba(16,185,129,0.3)';
    }
    setTimeout(function(){loadOrders();loadHome();},500);
  }).catch(function(){
    btnEl.textContent='MARK PAID';
    btnEl.disabled=false;
    btnEl.style.opacity='1';
    showToast('Error','Could not update — try again');
  });
}`;

  fixed = fixed.substring(0, mpStart) + newMarkPaid + fixed.substring(mpEnd);
  console.log('✅ Fix 1: markPaid function completely replaced — clean version');
} else {
  console.log('❌ markPaid function not found');
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
  catch(e) {
    console.log('❌ JS Error block', i, ':', e.message);
    ok = false;
  }
});
if (!ok) {
  console.log('❌ JS validation failed — file NOT saved.');
  process.exit(1);
}
console.log('✅ JS validation passed');
fs.writeFileSync('admin.html', fixed, 'utf8');
console.log('✅ admin.html saved — markPaid fully fixed');
