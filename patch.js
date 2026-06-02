const fs = require('fs');

const html = fs.readFileSync('admin.html', 'utf8');

if (html.includes('Lam Tuyen')) {
  console.log('STOP — Wrong file detected.');
  process.exit(1);
}
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// ============================================
// FIX 1 — COLLAPSIBLE SIDEBAR
// Default: 68px wide (icons only)
// Hover: expands to 240px with labels
// Main content adjusts automatically
// ============================================

const oldSbCSS = `.sb{position:fixed;left:0;top:0;bottom:0;width:240px;background:#1A0800;border-right:1px solid rgba(212,160,23,0.15);display:flex;flex-direction:column;z-index:100;}`;

const newSbCSS = `.sb{position:fixed;left:0;top:0;bottom:0;width:68px;background:#1A0800;border-right:1px solid rgba(212,160,23,0.15);display:flex;flex-direction:column;z-index:100;transition:width 0.25s cubic-bezier(0.4,0,0.2,1);overflow:hidden;}
.sb:hover{width:240px;}
.sb:hover .sb-label{opacity:1;width:auto;max-width:160px;}
.sb:hover .sb-top{padding:30px 25px 20px;}
.sb:hover .sb-n{opacity:1;}
.sb:hover .sb-s{opacity:1;}
.sb:hover .sb-clk{opacity:1;padding:15px 25px;}
.sb:hover .sb-bot{padding:20px 25px;}
.sb:hover .btn-out{opacity:1;}
.sb:hover .ni{padding:12px 25px;justify-content:flex-start;}
.sb:hover .nb{display:flex;}`;

if (fixed.includes(oldSbCSS)) {
  fixed = fixed.replace(oldSbCSS, newSbCSS);
  console.log('✅ Fix 1a: Sidebar collapse CSS added');
} else {
  console.log('⚠️  Fix 1a: sidebar CSS not found — trying append');
}

// Update sidebar top section CSS
const oldSbTop = `.sb-top{padding:30px 25px 20px;border-bottom:1px solid rgba(212,160,23,0.15);}`;
const newSbTop = `.sb-top{padding:15px 0 10px;border-bottom:1px solid rgba(212,160,23,0.15);transition:padding 0.25s;overflow:hidden;display:flex;flex-direction:column;align-items:center;}`;
if (fixed.includes(oldSbTop)) {
  fixed = fixed.replace(oldSbTop, newSbTop);
  console.log('✅ Fix 1b: sb-top CSS updated');
}

// Update sb-n (logo text)
const oldSbN = `.sb-n{font-family:'Bebas Neue',sans-serif;font-size:1.6rem;color:#D4A017;letter-spacing:3px;}`;
const newSbN = `.sb-n{font-family:'Bebas Neue',sans-serif;font-size:1.6rem;color:#D4A017;letter-spacing:3px;opacity:0;transition:opacity 0.2s;white-space:nowrap;}`;
if (fixed.includes(oldSbN)) {
  fixed = fixed.replace(oldSbN, newSbN);
  console.log('✅ Fix 1c: sb-n logo hidden when collapsed');
}

// Update sb-s (subtitle)
const oldSbS = `.sb-s{font-size:0.65rem;letter-spacing:2px;text-transform:uppercase;color:#B8A99A;}`;
const newSbS = `.sb-s{font-size:0.65rem;letter-spacing:2px;text-transform:uppercase;color:#B8A99A;opacity:0;transition:opacity 0.2s;white-space:nowrap;}`;
if (fixed.includes(oldSbS)) {
  fixed = fixed.replace(oldSbS, newSbS);
  console.log('✅ Fix 1d: sb-s subtitle hidden when collapsed');
}

// Update clock
const oldSbClk = `.sb-clk{padding:15px 25px;border-bottom:1px solid rgba(212,160,23,0.15);font-size:1.1rem;color:#D4A017;font-family:'Bebas Neue',sans-serif;letter-spacing:2px;}`;
const newSbClk = `.sb-clk{padding:10px 0;border-bottom:1px solid rgba(212,160,23,0.15);font-size:1rem;color:#D4A017;font-family:'Bebas Neue',sans-serif;letter-spacing:2px;text-align:center;opacity:0;transition:opacity 0.2s,padding 0.25s;white-space:nowrap;overflow:hidden;}`;
if (fixed.includes(oldSbClk)) {
  fixed = fixed.replace(oldSbClk, newSbClk);
  console.log('✅ Fix 1e: clock hidden when collapsed');
}

// Update ni (nav item) — collapsed shows only icon centered
const oldNi = `.ni{display:flex;align-items:center;gap:12px;padding:12px 25px;cursor:pointer;color:#B8A99A;font-size:0.85rem;letter-spacing:1px;text-transform:uppercase;position:relative;transition:all 0.2s;}`;
const newNi = `.ni{display:flex;align-items:center;gap:12px;padding:12px 0;justify-content:center;cursor:pointer;color:#B8A99A;font-size:0.85rem;letter-spacing:1px;text-transform:uppercase;position:relative;transition:all 0.25s;}`;
if (fixed.includes(oldNi)) {
  fixed = fixed.replace(oldNi, newNi);
  console.log('✅ Fix 1f: nav items centered when collapsed');
}

// Add label class — hidden when collapsed
const oldNiIc = `.ni-ic{font-size:1.1rem;width:20px;text-align:center;}`;
const newNiIc = `.ni-ic{font-size:1.2rem;width:24px;text-align:center;flex-shrink:0;}
.sb-label{opacity:0;width:0;max-width:0;overflow:hidden;transition:opacity 0.2s,max-width 0.25s;white-space:nowrap;}
.nb{display:none;}`;
if (fixed.includes(oldNiIc)) {
  fixed = fixed.replace(oldNiIc, newNiIc);
  console.log('✅ Fix 1g: label class added');
}

// Update sb-bot
const oldSbBot = `.sb-bot{padding:20px 25px;border-top:1px solid rgba(212,160,23,0.15);}`;
const newSbBot = `.sb-bot{padding:15px 0;border-top:1px solid rgba(212,160,23,0.15);display:flex;justify-content:center;}
.btn-out{opacity:0;transition:opacity 0.2s;white-space:nowrap;}`;
if (fixed.includes(oldSbBot)) {
  fixed = fixed.replace(oldSbBot, newSbBot);
  console.log('✅ Fix 1h: sb-bot updated');
}

// Update main margin — smaller now sidebar is 68px
const oldMain = `.main{margin-left:240px;padding:30px;min-height:100vh;}`;
const newMain = `.main{margin-left:68px;padding:30px;min-height:100vh;transition:margin-left 0.25s;}`;
if (fixed.includes(oldMain)) {
  fixed = fixed.replace(oldMain, newMain);
  console.log('✅ Fix 1i: main content margin updated to 68px');
}

// Update tablet breakpoint
const oldTablet = `.sb{width:180px;}`;
const newTablet = `.sb{width:68px;}`;
if (fixed.includes(oldTablet)) {
  fixed = fixed.replace(oldTablet, newTablet);
}
const oldTabletMain = `.main{margin-left:180px;padding:16px;}`;
const newTabletMain = `.main{margin-left:68px;padding:16px;}`;
if (fixed.includes(oldTabletMain)) {
  fixed = fixed.replace(oldTabletMain, newTabletMain);
  console.log('✅ Fix 1j: tablet breakpoint updated');
}

// ============================================
// FIX 2 — UPDATE SIDEBAR HTML
// Add sb-label spans to nav items
// Add taco icon when collapsed
// ============================================

const oldSbNav = `<div class="sb">
    <div class="sb-top"><div class="sb-n">LETS TACO</div><div class="sb-s">Admin Dashboard</div></div>
    <div class="sb-clk" id="clk">00:00:00</div>
    <nav class="sb-nav">
      <div class="ni active" data-pg="home"><span class="ni-ic">🏠</span><span>Home</span><span class="nb" id="nb">0</span></div>
      <div class="ni" data-pg="dinein"><span class="ni-ic">🍽️</span><span>Dine In</span></div>
      <div class="ni" data-pg="orders"><span class="ni-ic">📋</span><span>Orders</span></div>
      <div class="ni owner-only" data-pg="customers"><span class="ni-ic">👥</span><span>Customers</span></div>
      <div class="ni owner-only" data-pg="revenue"><span class="ni-ic">💰</span><span>Revenue</span></div>
      <div class="ni" data-pg="menu"><span class="ni-ic">🌮</span><span>Menu</span></div>
      <div class="ni owner-only" data-pg="settings"><span class="ni-ic">⚙️</span><span>Settings</span></div>
      <div class="ni" data-pg="help"><span class="ni-ic">📖</span><span>Guide</span></div>
      <a href="/kitchen" target="_blank" class="ni" style="text-decoration:none;border-top:1px solid rgba(212,160,23,0.1);margin-top:4px"><span class="ni-ic">👨‍🍳</span><span>Kitchen</span></a>
      <div class="ni owner-only" onclick="checkPin()" style="border-top:1px solid rgba(212,160,23,0.1);margin-top:4px"><span class="ni-ic">🔐</span><span>Owner</span></div>
    </nav>
    <div class="sb-bot"><button class="btn-out" id="lout">Logout</button></div>`;

const newSbNav = `<div class="sb">
    <div class="sb-top">
      <div style="font-size:1.5rem;text-align:center;margin-bottom:4px;">🌮</div>
      <div class="sb-n">LETS TACO</div>
      <div class="sb-s">Admin Dashboard</div>
    </div>
    <div class="sb-clk" id="clk">00:00:00</div>
    <nav class="sb-nav">
      <div class="ni active" data-pg="home"><span class="ni-ic">🏠</span><span class="sb-label">Home</span><span class="nb" id="nb">0</span></div>
      <div class="ni" data-pg="dinein"><span class="ni-ic">🍽️</span><span class="sb-label">Dine In</span></div>
      <div class="ni" data-pg="orders"><span class="ni-ic">📋</span><span class="sb-label">Orders</span></div>
      <div class="ni owner-only" data-pg="customers"><span class="ni-ic">👥</span><span class="sb-label">Customers</span></div>
      <div class="ni owner-only" data-pg="revenue"><span class="ni-ic">💰</span><span class="sb-label">Revenue</span></div>
      <div class="ni" data-pg="menu"><span class="ni-ic">🌮</span><span class="sb-label">Menu</span></div>
      <div class="ni owner-only" data-pg="settings"><span class="ni-ic">⚙️</span><span class="sb-label">Settings</span></div>
      <div class="ni" data-pg="help"><span class="ni-ic">📖</span><span class="sb-label">Guide</span></div>
      <a href="/kitchen" target="_blank" class="ni" style="text-decoration:none;border-top:1px solid rgba(212,160,23,0.1);margin-top:4px"><span class="ni-ic">👨‍🍳</span><span class="sb-label">Kitchen</span></a>
      <div class="ni owner-only" onclick="checkPin()" style="border-top:1px solid rgba(212,160,23,0.1);margin-top:4px"><span class="ni-ic">🔐</span><span class="sb-label">Owner</span></div>
    </nav>
    <div class="sb-bot"><button class="btn-out" id="lout">Logout</button></div>`;

if (fixed.includes(oldSbNav)) {
  fixed = fixed.replace(oldSbNav, newSbNav);
  console.log('✅ Fix 2: Sidebar HTML updated with sb-label spans');
} else {
  console.log('⚠️  Fix 2: sidebar HTML pattern not found');
}

// ============================================
// FIX 3 — ADD MARK PAID BUTTON TO ORDERS
// Find the renderOrder function and add
// MARK PAID button for takeout/delivery
// when payment_status is not paid
// ============================================

// Find where order action buttons are rendered in admin
// Look for the WhatsApp button pattern in order cards
const oldOActs = `function mkWA(o){var ph=(o.customer_phone||'').replace(/\\D/g,'');`;

// If that exact pattern not found try alternative
if (!fixed.includes(oldOActs)) {
  // Inject a markPaid function before the closing script
  const markPaidFn = `
// MARK PAID function for takeout/delivery orders
function markPaid(orderId, btnEl) {
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
    var card = btnEl.closest('.oc');
    if(card) {
      var banner = card.querySelector('.unpaid-admin-banner');
      if(banner) banner.remove();
    }
    btnEl.textContent = '✅ PAID';
    btnEl.style.background = 'linear-gradient(135deg,#27AE60,#2ECC71)';
    btnEl.style.color = 'white';
    btnEl.style.opacity = '1';
    btnEl.disabled = true;
    // Refresh orders after 1 second
    setTimeout(function(){loadOrders();loadHome();}, 1000);
  }).catch(function() {
    btnEl.textContent = '💳 MARK PAID';
    btnEl.disabled = false;
    btnEl.style.opacity = '1';
    showToast('Error', 'Could not update payment. Try again.');
  });
}
`;
  const lastScript = fixed.lastIndexOf('</script>');
  if (lastScript !== -1) {
    fixed = fixed.substring(0, lastScript) + markPaidFn + '</script>' + fixed.substring(lastScript + 9);
    console.log('✅ Fix 3: markPaid function injected');
  }
}

// ============================================
// FIX 4 — ADD MARK PAID BUTTON CSS
// ============================================

const oldStyleClose = '</style>';
const paidBtnCSS = `
.abtn-paid{background:linear-gradient(135deg,#C0392B,#E67E22);color:white;border:none;}
.abtn-paid:hover{opacity:0.9;}
.unpaid-admin-banner{background:rgba(192,57,43,0.12);border:1px solid rgba(192,57,43,0.4);border-radius:6px;padding:10px 14px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;gap:10px;}
.unpaid-admin-label{font-family:Bebas Neue,sans-serif;font-size:0.9rem;color:#E74C3C;letter-spacing:2px;}
`;

// Only add once
if (!fixed.includes('.unpaid-admin-banner')) {
  fixed = fixed.replace(oldStyleClose, paidBtnCSS + oldStyleClose);
  console.log('✅ Fix 4: MARK PAID CSS added');
} else {
  console.log('✅ Fix 4: CSS already exists');
}

// ============================================
// FIX 5 — INJECT MARK PAID BUTTON INTO
// ORDER CARD RENDERING
// Find where oacts/action buttons are built
// and add MARK PAID for unpaid orders
// ============================================

// Find the pattern where order HTML is built
// Look for the total and actions div
const oldOfoot = `var ofoot='<div class="ofoot"><div class="ototal">'+fV(o.total)+'</div><div class="oacts">'+acts+'</div></div>';`;
const newOfoot = `// Add MARK PAID button for unpaid takeout/delivery
var payBtn='';
if(o.order_type!=='dinein'&&o.payment_status!=='paid'){
  payBtn='<div class="unpaid-admin-banner"><span class="unpaid-admin-label">⛔ AWAITING PAYMENT</span>'
    +'<button class="abtn abtn-paid" onclick="markPaid(\\''+o.id+'\\',this)" style="padding:8px 16px;font-size:0.8rem;border-radius:4px;cursor:pointer;font-family:Jost,sans-serif;font-weight:700;letter-spacing:1px;">💳 MARK PAID</button>'
    +'</div>';
} else if(o.order_type!=='dinein'&&o.payment_status==='paid'){
  payBtn='<div style="background:rgba(39,174,96,0.1);border:1px solid rgba(39,174,96,0.3);border-radius:6px;padding:8px 14px;margin-bottom:10px;font-family:Bebas Neue,sans-serif;font-size:0.85rem;color:#27AE60;letter-spacing:2px;">✅ PAYMENT CONFIRMED</div>';
}
var ofoot='<div class="ofoot">'+payBtn+'<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;"><div class="ototal">'+fV(o.total)+'</div><div class="oacts">'+acts+'</div></div></div>';`;

if (fixed.includes(oldOfoot)) {
  fixed = fixed.replace(oldOfoot, newOfoot);
  console.log('✅ Fix 5: MARK PAID button injected into order cards');
} else {
  console.log('⚠️  Fix 5: ofoot pattern not found — searching for alternative');
  // Try alternative pattern
  const alt = `'<div class="ofoot"><div class="ototal">'+fV(o.total)+'</div><div class="oacts">'+acts+'</div></div>'`;
  if (fixed.includes(alt)) {
    fixed = fixed.replace(alt,
      `(function(){var pb='';if(o.order_type!=='dinein'&&o.payment_status!=='paid'){pb='<div class="unpaid-admin-banner"><span class="unpaid-admin-label">⛔ AWAITING PAYMENT</span><button class="abtn abtn-paid" onclick="markPaid(\\''+o.id+'\\',this)" style="padding:8px 16px;font-size:0.8rem;border-radius:4px;cursor:pointer;font-family:Jost,sans-serif;font-weight:700;">💳 MARK PAID</button></div>';}else if(o.order_type!=='dinein'){pb='<div style="background:rgba(39,174,96,0.1);border:1px solid rgba(39,174,96,0.3);border-radius:6px;padding:8px 14px;margin-bottom:10px;font-family:Bebas Neue,sans-serif;font-size:0.85rem;color:#27AE60;letter-spacing:2px;">✅ PAYMENT CONFIRMED</div>';}return'<div class="ofoot">'+pb+'<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;"><div class="ototal">'+fV(o.total)+'</div><div class="oacts">'+acts+'</div></div></div>';})()`
    );
    console.log('✅ Fix 5: Alternative pattern applied');
  } else {
    console.log('⚠️  Fix 5: Could not find ofoot — markPaid function exists but button not auto-injected');
    console.log('   The markPaid function is ready — order cards may need manual template update');
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
console.log('✅ admin.html saved — collapsible sidebar + MARK PAID live');
