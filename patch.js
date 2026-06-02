const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

if (html.includes('Lam Tuyen')) {
  console.log('STOP — Wrong file detected.');
  process.exit(1);
}
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// ============================================
// FIX 1 — ADD ORDER TYPE WELCOME SCREEN
// First thing customer sees when cart opens
// Choose how they want to eat BEFORE menu
// ============================================

// Find the cart sidebar opening div and inject welcome screen
// We insert a new view BEFORE the cart-view-menu div

const oldCartMenuStart = `<div id="cart-view-menu" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;">`;

const newCartMenuStart = `<div id="cart-view-welcome" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;padding:30px 25px;">
  <div style="text-align:center;margin-bottom:35px;margin-top:20px;">
    <div style="font-size:2.5rem;margin-bottom:12px;">🌮</div>
    <div style="font-family:Bebas Neue,sans-serif;font-size:2rem;color:#D4A017;letter-spacing:4px;margin-bottom:8px;">LET'S TACO</div>
    <div style="font-family:Playfair Display,serif;font-style:italic;color:#B8A99A;font-size:0.95rem;">First things first — how are you eating today?</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:14px;margin-bottom:30px;">
    <button onclick="selectOrderType('dinein')" style="background:rgba(255,255,255,0.03);border:1px solid rgba(212,160,23,0.2);border-radius:10px;padding:22px 20px;display:flex;align-items:center;gap:18px;cursor:pointer;transition:all 0.2s;text-align:left;width:100%;" onmouseover="this.style.borderColor='#D4A017';this.style.background='rgba(212,160,23,0.06)'" onmouseout="this.style.borderColor='rgba(212,160,23,0.2)';this.style.background='rgba(255,255,255,0.03)'">
      <span style="font-size:2.2rem;flex-shrink:0;">🍽️</span>
      <div>
        <div style="font-family:Bebas Neue,sans-serif;font-size:1.3rem;color:#FAF0E6;letter-spacing:2px;margin-bottom:3px;">DINE IN</div>
        <div style="font-size:0.78rem;color:#B8A99A;line-height:1.5;">Sit down, scan QR, we bring the food to you. Pay when you are ready.</div>
      </div>
      <span style="margin-left:auto;color:#D4A017;font-size:1.2rem;flex-shrink:0;">›</span>
    </button>
    <button onclick="selectOrderType('pickup')" style="background:rgba(255,255,255,0.03);border:1px solid rgba(212,160,23,0.2);border-radius:10px;padding:22px 20px;display:flex;align-items:center;gap:18px;cursor:pointer;transition:all 0.2s;text-align:left;width:100%;" onmouseover="this.style.borderColor='#D4A017';this.style.background='rgba(212,160,23,0.06)'" onmouseout="this.style.borderColor='rgba(212,160,23,0.2)';this.style.background='rgba(255,255,255,0.03)'">
      <span style="font-size:2.2rem;flex-shrink:0;">🏃</span>
      <div>
        <div style="font-family:Bebas Neue,sans-serif;font-size:1.3rem;color:#FAF0E6;letter-spacing:2px;margin-bottom:3px;">TAKEOUT</div>
        <div style="font-size:0.78rem;color:#B8A99A;line-height:1.5;">Order now, pick up at 43 An Thuong 30. Pay when you collect.</div>
      </div>
      <span style="margin-left:auto;color:#D4A017;font-size:1.2rem;flex-shrink:0;">›</span>
    </button>
    <button onclick="selectOrderType('delivery')" style="background:rgba(255,255,255,0.03);border:1px solid rgba(212,160,23,0.2);border-radius:10px;padding:22px 20px;display:flex;align-items:center;gap:18px;cursor:pointer;transition:all 0.2s;text-align:left;width:100%;" onmouseover="this.style.borderColor='#D4A017';this.style.background='rgba(212,160,23,0.06)'" onmouseout="this.style.borderColor='rgba(212,160,23,0.2)';this.style.background='rgba(255,255,255,0.03)'">
      <span style="font-size:2.2rem;flex-shrink:0;">🛵</span>
      <div>
        <div style="font-family:Bebas Neue,sans-serif;font-size:1.3rem;color:#FAF0E6;letter-spacing:2px;margin-bottom:3px;">DELIVERY</div>
        <div style="font-size:0.78rem;color:#B8A99A;line-height:1.5;">We bring it to you. Da Nang area. Pay via WhatsApp or Zalo before cooking starts.</div>
      </div>
      <span style="margin-left:auto;color:#D4A017;font-size:1.2rem;flex-shrink:0;">›</span>
    </button>
  </div>
  <div style="text-align:center;border-top:1px solid rgba(212,160,23,0.1);padding-top:20px;">
    <div style="font-size:0.7rem;letter-spacing:2px;text-transform:uppercase;color:#B8A99A;margin-bottom:8px;">Open Tue–Sun · 4:00 PM – 12:00 AM</div>
    <div style="font-size:0.75rem;color:rgba(184,169,154,0.5);">43 An Thuong 30 · Ngu Hanh Son · Da Nang</div>
  </div>
</div>
<div id="cart-view-menu" style="flex:1;overflow-y:auto;display:none;flex-direction:column;">`;

if (fixed.includes(oldCartMenuStart)) {
  fixed = fixed.replace(oldCartMenuStart, newCartMenuStart);
  console.log('✅ Fix 1: Welcome screen injected before menu');
} else {
  console.log('⚠️  Fix 1: cart-view-menu pattern not found');
}

// ============================================
// FIX 2 — ADD selectOrderType FUNCTION
// Sets order type then shows menu
// Skips welcome screen for QR scans
// ============================================

const oldToggleCart = `function toggleCart(){`;

const newToggleCart = `function selectOrderType(type){
  // Set the order type globally
  oType=type;
  setOT(type);
  // Hide welcome, show menu
  var w=document.getElementById('cart-view-welcome');
  var m=document.getElementById('cart-view-menu');
  if(w)w.style.display='none';
  if(m){m.style.display='flex';}
  renderCM();
}
function toggleCart(){`;

if (fixed.includes(oldToggleCart)) {
  fixed = fixed.replace(oldToggleCart, newToggleCart);
  console.log('✅ Fix 2: selectOrderType function added');
} else {
  console.log('⚠️  Fix 2: toggleCart pattern not found');
}

// ============================================
// FIX 3 — SHOW WELCOME SCREEN WHEN CART OPENS
// Unless it is a QR scan (already dine-in)
// ============================================

const oldRenderCM = `function toggleCart(){
  if(qrTable){
    setTimeout(function(){
      setOT('dinein');
      pickTable(qrTable);
      lockQRMode(qrTable);
    },100);
  }var sb=document.getElementById('cart-sidebar');var ov=document.getElementById('cart-overlay');var open=sb.style.right==='0px';if(open){sb.style.right='-460px';ov.style.display='none';ov.style.background='rgba(0,0,0,0)';}else{sb.style.right='0px';ov.style.display='block';setTimeout(function(){ov.style.background='rgba(0,0,0,0.7)';},10);renderCM();}`;

const newRenderCM = `function toggleCart(){
  if(qrTable){
    setTimeout(function(){
      setOT('dinein');
      pickTable(qrTable);
      lockQRMode(qrTable);
    },100);
  }
  var sb=document.getElementById('cart-sidebar');
  var ov=document.getElementById('cart-overlay');
  var open=sb.style.right==='0px';
  if(open){
    sb.style.right='-460px';
    ov.style.display='none';
    ov.style.background='rgba(0,0,0,0)';
  } else {
    sb.style.right='0px';
    ov.style.display='block';
    setTimeout(function(){ov.style.background='rgba(0,0,0,0.7)';},10);
    // Show welcome screen unless QR scan (already knows order type)
    if(!qrTable){
      var w=document.getElementById('cart-view-welcome');
      var m=document.getElementById('cart-view-menu');
      var co=document.getElementById('cart-view-checkout');
      var ct=document.getElementById('cart-view-tracker');
      // Only show welcome if not mid-order
      var hasItems=Object.keys(cart).length>0;
      var inCheckout=co&&co.style.display==='flex';
      var inTracker=ct&&ct.style.display==='flex';
      if(!hasItems&&!inCheckout&&!inTracker&&w){
        w.style.display='flex';
        if(m)m.style.display='none';
      } else {
        if(w)w.style.display='none';
        if(m)m.style.display='flex';
        renderCM();
      }
    } else {
      renderCM();
    }
  }`;

if (fixed.includes(oldRenderCM)) {
  fixed = fixed.replace(oldRenderCM, newRenderCM);
  console.log('✅ Fix 3: Cart now shows welcome screen on open');
} else {
  console.log('⚠️  Fix 3: toggleCart full pattern not found — trying partial fix');
  // Partial fallback
  fixed = fixed.replace(
    `sb.style.right='0px';ov.style.display='block';setTimeout(function(){ov.style.background='rgba(0,0,0,0.7)';},10);renderCM();}`,
    `sb.style.right='0px';ov.style.display='block';setTimeout(function(){ov.style.background='rgba(0,0,0,0.7)';},10);
    if(!qrTable&&Object.keys(cart).length===0){
      var w=document.getElementById('cart-view-welcome');
      var m=document.getElementById('cart-view-menu');
      if(w)w.style.display='flex';
      if(m)m.style.display='none';
    } else {renderCM();}
  }`
  );
  console.log('✅ Fix 3: Partial fallback applied');
}

// ============================================
// FIX 4 — HIDE WELCOME ON BACK TO MENU
// When customer goes back from checkout
// skip welcome screen — they already chose
// ============================================

const oldBackToMenu = `function backToMenu(){document.getElementById('cart-view-menu').style.display='flex';document.getElementById('cart-view-checkout').style.display='none';}`;

const newBackToMenu = `function backToMenu(){
  var w=document.getElementById('cart-view-welcome');
  if(w)w.style.display='none';
  document.getElementById('cart-view-menu').style.display='flex';
  document.getElementById('cart-view-checkout').style.display='none';
}`;

if (fixed.includes(oldBackToMenu)) {
  fixed = fixed.replace(oldBackToMenu, newBackToMenu);
  console.log('✅ Fix 4: Back to menu skips welcome screen');
} else {
  console.log('⚠️  Fix 4: backToMenu pattern not found');
}

// ============================================
// FIX 5 — ADD BACK BUTTON ON MENU VIEW
// So customer can change their order type
// if they made the wrong choice
// ============================================

const oldMenuHeader = `<div style="padding:15px 15px 0;"><div style="font-size:0.7rem;letter-spacing:2px;text-transform:uppercase;color:#B8A99A;margin-bottom:12px;">Tap + to add items</div>`;

const newMenuHeader = `<div style="padding:15px 15px 0;">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
    <button onclick="showWelcome()" style="background:transparent;border:none;color:#B8A99A;font-size:0.75rem;letter-spacing:1px;text-transform:uppercase;cursor:pointer;padding:0;display:flex;align-items:center;gap:5px;">‹ Change</button>
    <div id="order-type-badge" style="font-size:0.65rem;letter-spacing:2px;text-transform:uppercase;color:#D4A017;background:rgba(212,160,23,0.1);border:1px solid rgba(212,160,23,0.2);padding:4px 12px;border-radius:20px;"></div>
  </div>
  <div style="font-size:0.7rem;letter-spacing:2px;text-transform:uppercase;color:#B8A99A;margin-bottom:12px;">Tap + to add items</div>`;

if (fixed.includes(oldMenuHeader)) {
  fixed = fixed.replace(oldMenuHeader, newMenuHeader);
  console.log('✅ Fix 5: Change button + order type badge added to menu');
} else {
  console.log('⚠️  Fix 5: menu header pattern not found');
}

// ============================================
// FIX 6 — ADD showWelcome + badge update
// ============================================

const oldSelectFn = `function selectOrderType(type){`;

const newSelectFn = `function showWelcome(){
  var w=document.getElementById('cart-view-welcome');
  var m=document.getElementById('cart-view-menu');
  if(w)w.style.display='flex';
  if(m)m.style.display='none';
}
function updateOrderBadge(){
  var b=document.getElementById('order-type-badge');
  if(!b)return;
  var labels={dinein:'🍽️ Dine In',pickup:'🏃 Takeout',delivery:'🛵 Delivery'};
  b.textContent=labels[oType]||'';
}
function selectOrderType(type){`;

if (fixed.includes(oldSelectFn)) {
  fixed = fixed.replace(oldSelectFn, newSelectFn);
  console.log('✅ Fix 6: showWelcome and badge functions added');
} else {
  console.log('⚠️  Fix 6: selectOrderType not found for prepend');
}

// Update selectOrderType to call badge update
fixed = fixed.replace(
  `function selectOrderType(type){
  // Set the order type globally
  oType=type;
  setOT(type);
  // Hide welcome, show menu
  var w=document.getElementById('cart-view-welcome');
  var m=document.getElementById('cart-view-menu');
  if(w)w.style.display='none';
  if(m){m.style.display='flex';}
  renderCM();
}`,
  `function selectOrderType(type){
  oType=type;
  setOT(type);
  var w=document.getElementById('cart-view-welcome');
  var m=document.getElementById('cart-view-menu');
  if(w)w.style.display='none';
  if(m)m.style.display='flex';
  updateOrderBadge();
  renderCM();
}`
);

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
console.log('✅ index.html saved — order type welcome screen live');
