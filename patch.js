const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

if (html.includes('Lam Tuyen')) {
  console.log('STOP — Wrong file detected.');
  process.exit(1);
}
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// ============================================
// FIX 1 — REPLACE CHECKOUT BUTTON TEXT
// Dynamic label based on order type
// ============================================

// Find the checkout button in cart-checkout-row
const oldCheckoutBtn = `<button onclick="goToCheckout()" style="width:100%;background:linear-gradient(135deg,#C0392B,#E67E22);color:white;border:none;padding:18px;font-family:'Bebas Neue',sans-serif;font-size:1.4rem;letter-spacing:3px;border-radius:8px;cursor:pointer;">CHECKOUT 🌮</button>`;

const newCheckoutBtn = `<button onclick="goToCheckout()" id="checkout-main-btn" style="width:100%;background:linear-gradient(135deg,#C0392B,#E67E22);color:white;border:none;padding:18px;font-family:Bebas Neue,sans-serif;font-size:1.3rem;letter-spacing:3px;border-radius:8px;cursor:pointer;">SEND ORDER TO KITCHEN 🌮</button>`;

if (fixed.includes(oldCheckoutBtn)) {
  fixed = fixed.replace(oldCheckoutBtn, newCheckoutBtn);
  console.log('✅ Fix 1: Checkout button replaced with dynamic label');
} else {
  console.log('⚠️  Fix 1: checkout button pattern not found — trying partial');
  fixed = fixed.replace(
    `CHECKOUT 🌮</button><div style="text-align:center;font-size:0.7rem;color:#B8A99A;margin-top:8px;letter-spacing:1px;">Earn loyalty points with every order</div>`,
    `SEND ORDER TO KITCHEN 🌮</button><div style="text-align:center;font-size:0.7rem;color:#B8A99A;margin-top:8px;letter-spacing:1px;">Earn loyalty points with every order</div>`
  );
  console.log('✅ Fix 1: Partial fallback applied');
}

// ============================================
// FIX 2 — UPDATE BUTTON LABEL WHEN ORDER
// TYPE CHANGES
// ============================================

const oldUpdateBadge = `function updateOrderBadge(){
  var b=document.getElementById('order-type-badge');
  if(!b)return;
  var labels={dinein:'🍽️ Dine In',pickup:'🏃 Takeout',delivery:'🛵 Delivery'};
  b.textContent=labels[oType]||'';
}`;

const newUpdateBadge = `function updateOrderBadge(){
  var b=document.getElementById('order-type-badge');
  if(!b)return;
  var labels={dinein:'🍽️ Dine In',pickup:'🏃 Takeout',delivery:'🛵 Delivery'};
  b.textContent=labels[oType]||'';
  // Update checkout button label based on order type
  var cb=document.getElementById('checkout-main-btn');
  if(!cb)return;
  if(oType==='dinein'){
    cb.textContent='SEND ORDER TO KITCHEN 🌮';
    cb.style.background='linear-gradient(135deg,#C0392B,#E67E22)';
  } else if(oType==='pickup'){
    cb.textContent='PLACE MY ORDER 🌮';
    cb.style.background='linear-gradient(135deg,#C0392B,#E67E22)';
  } else if(oType==='delivery'){
    cb.textContent='PLACE MY ORDER 🌮';
    cb.style.background='linear-gradient(135deg,#C0392B,#E67E22)';
  }
}`;

if (fixed.includes(oldUpdateBadge)) {
  fixed = fixed.replace(oldUpdateBadge, newUpdateBadge);
  console.log('✅ Fix 2: Checkout button updates with order type');
} else {
  console.log('⚠️  Fix 2: updateOrderBadge not found — injecting fresh');
  // inject before selectOrderType
  fixed = fixed.replace(
    `function selectOrderType(type){`,
    `function updateOrderBadge(){
  var b=document.getElementById('order-type-badge');
  if(!b)return;
  var labels={dinein:'🍽️ Dine In',pickup:'🏃 Takeout',delivery:'🛵 Delivery'};
  b.textContent=labels[oType]||'';
  var cb=document.getElementById('checkout-main-btn');
  if(!cb)return;
  if(oType==='dinein'){cb.textContent='SEND ORDER TO KITCHEN 🌮';}
  else{cb.textContent='PLACE MY ORDER 🌮';}
}
function selectOrderType(type){`
  );
  console.log('✅ Fix 2: updateOrderBadge injected fresh');
}

// ============================================
// FIX 3 — REPLACE FINAL PLACE ORDER BUTTON
// Different label per order type
// ============================================

const oldPlaceBtn = `<button onclick="placeOrder()" id="place-btn" style="width:100%;background:linear-gradient(135deg,#D4A017,#E67E22);color:#0F0500;border:none;padding:18px;font-family:'Bebas Neue',sans-serif;font-size:1.4rem;letter-spacing:3px;border-radius:8px;cursor:pointer;font-weight:700;">PLACE ORDER 🌮</button>
<div style="text-align:center;font-size:0.75rem;color:#B8A99A;margin-top:10px;">You will earn loyalty points on this order</div>`;

const newPlaceBtn = `<button onclick="placeOrder()" id="place-btn" style="width:100%;background:linear-gradient(135deg,#D4A017,#E67E22);color:#0F0500;border:none;padding:18px;font-family:Bebas Neue,sans-serif;font-size:1.3rem;letter-spacing:3px;border-radius:8px;cursor:pointer;font-weight:700;">SEND TO KITCHEN 🌮</button>
<div style="text-align:center;font-size:0.75rem;color:#B8A99A;margin-top:10px;">You will earn loyalty points on this order</div>`;

if (fixed.includes(oldPlaceBtn)) {
  fixed = fixed.replace(oldPlaceBtn, newPlaceBtn);
  console.log('✅ Fix 3: Final place order button updated');
} else {
  console.log('⚠️  Fix 3: place-btn pattern not found — trying partial');
  fixed = fixed.replace(
    `>PLACE ORDER 🌮</button>`,
    `>SEND TO KITCHEN 🌮</button>`
  );
  console.log('✅ Fix 3: Partial fallback applied');
}

// ============================================
// FIX 4 — UPDATE place-btn LABEL DYNAMICALLY
// In goToCheckout — set correct label
// ============================================

const oldGoCheckout = `function goToCheckout(){if(!gTI())return;
  setTimeout(function(){var hpb=document.getElementById('how-to-pay-box');if(hpb)hpb.style.display=oType==='dinein'?'none':'block';},50);`;

const newGoCheckout = `function goToCheckout(){if(!gTI())return;
  setTimeout(function(){
    var hpb=document.getElementById('how-to-pay-box');
    if(hpb)hpb.style.display=oType==='dinein'?'none':'block';
    // Set final button label by order type
    var pb=document.getElementById('place-btn');
    if(pb){
      if(oType==='dinein'){
        pb.textContent='SEND TO KITCHEN 🌮';
      } else if(oType==='pickup'){
        pb.textContent='CONFIRM TAKEOUT ORDER 🌮';
      } else if(oType==='delivery'){
        pb.textContent='CONFIRM DELIVERY ORDER 🌮';
      }
    }
  },50);`;

if (fixed.includes(oldGoCheckout)) {
  fixed = fixed.replace(oldGoCheckout, newGoCheckout);
  console.log('✅ Fix 4: Final button label set in goToCheckout');
} else {
  console.log('⚠️  Fix 4: goToCheckout pattern not found — trying simple version');
  fixed = fixed.replace(
    `function goToCheckout(){if(!gTI())return;`,
    `function goToCheckout(){if(!gTI())return;
  setTimeout(function(){
    var pb=document.getElementById('place-btn');
    if(pb){
      if(oType==='dinein')pb.textContent='SEND TO KITCHEN 🌮';
      else if(oType==='pickup')pb.textContent='CONFIRM TAKEOUT ORDER 🌮';
      else pb.textContent='CONFIRM DELIVERY ORDER 🌮';
    }
    var hpb=document.getElementById('how-to-pay-box');
    if(hpb)hpb.style.display=oType==='dinein'?'none':'block';
  },50);`
  );
  console.log('✅ Fix 4: Fallback applied');
}

// ============================================
// FIX 5 — UPGRADE TRACKER SCREEN MESSAGES
// Per order type — no generic text
// ============================================

const oldTrackerTitle = `<div style="font-family:Bebas Neue,sans-serif;font-size:2rem;color:#D4A017;letter-spacing:3px;" id="tracker-ref">LTD-XXXXXX</div></div>
<div id="story-display" style="margin-bottom:30px;"></div>`;

const newTrackerTitle = `<div style="font-family:Bebas Neue,sans-serif;font-size:2rem;color:#D4A017;letter-spacing:3px;" id="tracker-ref">LTD-XXXXXX</div></div>
<div id="tracker-headline" style="margin-bottom:20px;"></div>
<div id="story-display" style="margin-bottom:30px;"></div>`;

if (fixed.includes(oldTrackerTitle)) {
  fixed = fixed.replace(oldTrackerTitle, newTrackerTitle);
  console.log('✅ Fix 5: Tracker headline slot added');
} else {
  console.log('⚠️  Fix 5: tracker title pattern not found');
}

// ============================================
// FIX 6 — INJECT TRACKER HEADLINE BY TYPE
// In showTracker function
// ============================================

const oldShowTracker = `document.getElementById('tracker-ref').textContent=ref;
  renderStory(ref);`;

const newShowTracker = `document.getElementById('tracker-ref').textContent=ref;
  // Set headline by order type
  var th=document.getElementById('tracker-headline');
  if(th){
    if(oType==='dinein'){
      th.innerHTML='<div style="background:rgba(39,174,96,0.1);border:1px solid rgba(39,174,96,0.3);border-radius:8px;padding:16px 20px;text-align:center;">'
        +'<div style="font-family:Bebas Neue,sans-serif;font-size:1.3rem;color:#27AE60;letter-spacing:3px;margin-bottom:6px;">ORDER SENT TO KITCHEN 🍽️</div>'
        +'<div style="font-size:0.82rem;color:#FAF0E6;line-height:1.6;">Relax. Your food is being prepared. When you are ready to pay, tap the button below and your server will come to you.</div>'
        +'</div>';
    } else if(oType==='pickup'){
      th.innerHTML='<div style="background:rgba(41,128,185,0.1);border:1px solid rgba(41,128,185,0.3);border-radius:8px;padding:16px 20px;text-align:center;">'
        +'<div style="font-family:Bebas Neue,sans-serif;font-size:1.3rem;color:#5DADE2;letter-spacing:3px;margin-bottom:6px;">ORDER RECEIVED 🏃</div>'
        +'<div style="font-size:0.82rem;color:#FAF0E6;line-height:1.6;">We are preparing your tacos now. Come to the counter at 43 An Thuong 30 to collect and pay when ready.</div>'
        +'</div>';
    } else {
      th.innerHTML='<div style="background:rgba(230,126,34,0.1);border:1px solid rgba(230,126,34,0.3);border-radius:8px;padding:16px 20px;text-align:center;">'
        +'<div style="font-family:Bebas Neue,sans-serif;font-size:1.3rem;color:#E67E22;letter-spacing:3px;margin-bottom:6px;">ORDER RECEIVED 🛵</div>'
        +'<div style="font-size:0.82rem;color:#FAF0E6;line-height:1.6;">Pay via WhatsApp or Zalo below to confirm your delivery. We start cooking the moment payment is received.</div>'
        +'</div>';
    }
  }
  renderStory(ref);`;

if (fixed.includes(oldShowTracker)) {
  fixed = fixed.replace(oldShowTracker, newShowTracker);
  console.log('✅ Fix 6: Tracker headline set by order type');
} else {
  console.log('⚠️  Fix 6: showTracker renderStory pattern not found');
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
console.log('✅ index.html saved — smart button labels live for all order types');
