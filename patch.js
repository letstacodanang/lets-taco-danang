const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

if (html.includes('Lam Tuyen')) {
  console.log('STOP — Wrong file detected.');
  process.exit(1);
}
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// FIX 1 — Save customer session after first order placed
// After placeOrder succeeds, save name + table + contact to sessionStorage
// So when they tap ORDER MORE TACOS it pre-fills instantly

const oldPlaceSuccess = "showTracker(ref,d);";
const newPlaceSuccess = `showTracker(ref,d);
  // Save session so ORDER MORE is instant — no re-entry needed
  try{
    var sess={
      name:document.getElementById('c-name').value.trim(),
      table:document.getElementById('c-table')?document.getElementById('c-table').value:'',
      phone:document.getElementById('c-phone')?document.getElementById('c-phone').value.trim():'',
      code:document.getElementById('c-code')?document.getElementById('c-code').value:'+84',
      email:document.getElementById('c-email')?document.getElementById('c-email').value.trim():'',
      address:document.getElementById('c-address')?document.getElementById('c-address').value.trim():'',
      otype:oType,
      cm:contactMethod
    };
    sessionStorage.setItem('lt_sess',JSON.stringify(sess));
  }catch(e){}`;

if (fixed.includes(oldPlaceSuccess)) {
  fixed = fixed.replace(oldPlaceSuccess, newPlaceSuccess);
  console.log('✅ Fix 1: Session saved after order placed');
} else {
  console.log('⚠️  Fix 1: placeOrder success pattern not found');
}

// FIX 2 — When ORDER MORE TACOS is tapped, restore session instantly
// Find newOrder() function and add session restore logic

const oldNewOrder = `function newOrder(){clearInterval(tInt);oId=null;document.getElementById('cart-view-tracker').style.display='none';document.getElementById('cart-view-menu').style.display='flex';document.getElementById('cart-view-checkout').style.display='none';['c-name','c-email','c-phone','c-address','cart-notes'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});document.getElementById('place-btn').textContent='PLACE ORDER 🌮';document.getElementById('place-btn').disabled=false;renderCM();}`;

const newNewOrder = `function newOrder(){
  clearInterval(tInt);oId=null;
  document.getElementById('cart-view-tracker').style.display='none';
  document.getElementById('cart-view-menu').style.display='flex';
  document.getElementById('cart-view-checkout').style.display='none';
  document.getElementById('place-btn').textContent='PLACE ORDER 🌮';
  document.getElementById('place-btn').disabled=false;
  // Restore session — customer should not re-enter anything
  try{
    var raw=sessionStorage.getItem('lt_sess');
    if(raw){
      var sess=JSON.parse(raw);
      // Restore order type first so fields show/hide correctly
      if(sess.otype){setOT(sess.otype);}
      // Restore contact method
      if(sess.cm){setCM(sess.cm);contactMethod=sess.cm;}
      // Restore fields
      var fields={
        'c-name':sess.name,
        'c-phone':sess.phone,
        'c-email':sess.email,
        'c-address':sess.address
      };
      Object.keys(fields).forEach(function(id){
        var el=document.getElementById(id);
        if(el&&fields[id])el.value=fields[id];
      });
      // Restore country code
      if(sess.code){var cd=document.getElementById('c-code');if(cd)cd.value=sess.code;}
      // Restore table for dine-in
      if(sess.table&&sess.otype==='dinein'){
        pickTable(parseInt(sess.table));
        // Re-lock QR mode if they came from QR scan
        if(qrTable)lockQRMode(qrTable);
      }
      console.log('✅ Session restored — customer can order again instantly');
    }
  }catch(e){}
  // Clear notes only — not customer info
  var notes=document.getElementById('cart-notes');
  if(notes)notes.value='';
  renderCM();
}`;

if (fixed.includes(oldNewOrder)) {
  fixed = fixed.replace(oldNewOrder, newNewOrder);
  console.log('✅ Fix 2: ORDER MORE restores session instantly');
} else {
  console.log('⚠️  Fix 2: newOrder pattern not found — trying shorter match');
  // Fallback shorter match
  const fallback = `function newOrder(){clearInterval(tInt);oId=null;`;
  if (fixed.includes(fallback)) {
    console.log('⚠️  Fix 2: Found function but pattern differs — manual check needed');
  }
}

// FIX 3 — Make ORDER MORE TACOS button look premium not cheap
// Find the button and upgrade its style
const oldMoreBtn = `<button onclick="newOrder()" style="width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(212,160,23,0.2);color:#D4A017;padding:14px;font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:2px;border-radius:6px;cursor:pointer;margin-top:5px;">+ ORDER MORE TACOS</button>`;

const newMoreBtn = `<button onclick="newOrder()" style="width:100%;background:linear-gradient(135deg,rgba(212,160,23,0.12),rgba(212,160,23,0.06));border:1px solid rgba(212,160,23,0.4);color:#D4A017;padding:18px;font-family:Bebas Neue,sans-serif;font-size:1.3rem;letter-spacing:4px;border-radius:6px;cursor:pointer;margin-top:10px;transition:all 0.2s;" onmouseover="this.style.background='rgba(212,160,23,0.2)'" onmouseout="this.style.background='linear-gradient(135deg,rgba(212,160,23,0.12),rgba(212,160,23,0.06))'">+ ORDER MORE TACOS</button>`;

if (fixed.includes(oldMoreBtn)) {
  fixed = fixed.replace(oldMoreBtn, newMoreBtn);
  console.log('✅ Fix 3: ORDER MORE button upgraded to premium style');
} else {
  console.log('⚠️  Fix 3: order more button pattern not found — trying partial');
  fixed = fixed.replace(
    '+ ORDER MORE TACOS</button>',
    '+ ORDER MORE TACOS 🌮</button>'
  );
  console.log('✅ Fix 3: Added taco emoji to button at minimum');
}

// FIX 4 — Also save session when QR table is detected on page load
// So even first order on QR knows the table from the start
const oldQRDetect = `if(tParam){\n    qrTable=parseInt(tParam);`;
const newQRDetect = `if(tParam){\n    qrTable=parseInt(tParam);\n    // Pre-save table to session immediately on QR scan\n    try{var s=JSON.parse(sessionStorage.getItem('lt_sess')||'{}');s.table=qrTable;s.otype='dinein';sessionStorage.setItem('lt_sess',JSON.stringify(s));}catch(e){}`;

if (fixed.includes(oldQRDetect)) {
  fixed = fixed.replace(oldQRDetect, newQRDetect);
  console.log('✅ Fix 4: QR table pre-saved to session on scan');
} else {
  console.log('⚠️  Fix 4: QR detect pattern not found — minor, not critical');
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
console.log('✅ index.html saved — instant reorder session live');
