const fs = require('fs');

const html = fs.readFileSync('admin.html', 'utf8');
if (html.includes('Lam Tuyen')) { console.log('STOP'); process.exit(1); }
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// ============================================
// COMPLETE MOBILE REDESIGN
// Bottom tab bar navigation
// Full width content
// App-style cards and interactions
// ============================================

const oldMobileCSS = `@media(max-width:768px){
  /* Sidebar stays as 60px icon bar — never overlaps */
  .sb{width:60px;height:100vh;flex-direction:column;top:0;bottom:0;left:0;position:fixed;overflow:hidden;}
  .sb:hover{width:60px;}
  .sb:hover ~ .main-wrap{margin-left:60px;}
  .sb:hover .ni{padding:11px 0;justify-content:center;}
  .sb:hover .sb-label{opacity:0;max-width:0;}
  .sb:hover .sb-n{opacity:0;}
  .sb:hover .sb-clk{opacity:0;}
  .sb:hover .btn-out{opacity:0;width:0;}
  .sb-top{min-height:60px;}
  .sb-clk{display:none;}
  .sb-bot{display:none;}
  .sb-nav{display:flex;flex-direction:column;padding:4px 0;overflow-y:auto;overflow-x:hidden;width:100%;}
  .ni{flex-direction:column;gap:1px;padding:10px 0;font-size:0.45rem;align-items:center;flex-shrink:0;justify-content:center;width:100%;}
  .ni-ic{font-size:1.3rem;width:auto;}
  .sb-label{opacity:0;max-width:0;font-size:0.45rem;}
  .nb{right:4px;top:6px;}
  /* Main content — push 60px for sidebar */
  .main-wrap{margin-left:60px!important;}
  .main{padding:10px;}
  .sg{grid-template-columns:repeat(2,1fr);gap:8px;}
  .rg,.setg{grid-template-columns:1fr;}
  .abtn{padding:10px 10px;font-size:0.72rem;min-height:40px;touch-action:manipulation;}
  .oacts{gap:5px;}
  .topbar{flex-wrap:wrap;gap:8px;}
  .pt{font-size:1.3rem;}
  .of{gap:5px;overflow-x:auto;flex-wrap:nowrap;padding-bottom:4px;}
  .fc{padding:6px 10px;font-size:0.65rem;min-height:`;

// Find the full mobile CSS block end
const mobileStart = fixed.indexOf('@media(max-width:768px)');
const mobileEnd = fixed.indexOf('\n/* ===== TOUCH', mobileStart);

if (mobileStart !== -1 && mobileEnd !== -1) {
  const currentMobile = fixed.substring(mobileStart, mobileEnd);
  console.log('Current mobile CSS length:', currentMobile.length);

  const newMobileCSS = `@media(max-width:768px){
  /* ===== HIDE DESKTOP SIDEBAR COMPLETELY ===== */
  .sb{display:none!important;}
  .main-wrap{margin-left:0!important;}

  /* ===== MOBILE BOTTOM TAB BAR ===== */
  .mobile-nav{
    display:flex!important;
    position:fixed;
    bottom:0;left:0;right:0;
    height:64px;
    background:#1A0800;
    border-top:1px solid rgba(212,160,23,0.2);
    z-index:500;
    align-items:stretch;
    box-shadow:0 -4px 20px rgba(0,0,0,0.2);
  }
  .mn-tab{
    flex:1;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:3px;
    cursor:pointer;
    color:rgba(255,255,255,0.4);
    font-size:0.48rem;
    letter-spacing:0.5px;
    text-transform:uppercase;
    font-family:'Jost',sans-serif;
    font-weight:600;
    position:relative;
    -webkit-tap-highlight-color:transparent;
    touch-action:manipulation;
    user-select:none;
    transition:color 0.15s;
    padding:8px 4px;
  }
  .mn-tab.active{color:#D4A017;}
  .mn-tab.active .mn-ic{transform:scale(1.1);}
  .mn-ic{font-size:1.4rem;line-height:1;transition:transform 0.15s;}
  .mn-badge{
    position:absolute;
    top:6px;right:calc(50% - 18px);
    background:#EF4444;
    color:white;
    font-size:0.55rem;
    font-weight:700;
    padding:1px 5px;
    border-radius:10px;
    min-width:16px;
    text-align:center;
    display:none;
  }
  .mn-badge.show{display:block;}

  /* ===== MOBILE TOPBAR ===== */
  .mobile-topbar{
    display:flex!important;
    position:fixed;
    top:0;left:0;right:0;
    height:56px;
    background:white;
    border-bottom:1px solid #E5E7EB;
    z-index:400;
    align-items:center;
    padding:0 16px;
    justify-content:space-between;
    box-shadow:0 1px 8px rgba(0,0,0,0.08);
  }
  .mobile-topbar-title{
    font-family:'Bebas Neue',sans-serif;
    font-size:1.3rem;
    color:#1A1A2E;
    letter-spacing:2px;
  }
  .mobile-topbar-right{
    display:flex;
    align-items:center;
    gap:10px;
  }
  .mobile-open-pill{
    background:#D1FAE5;
    color:#059669;
    font-size:0.65rem;
    font-weight:700;
    letter-spacing:1px;
    text-transform:uppercase;
    padding:5px 10px;
    border-radius:20px;
    border:1px solid #6EE7B7;
  }
  .mobile-open-pill.closed{
    background:#FEE2E2;
    color:#DC2626;
    border-color:#FCA5A5;
  }
  .mobile-clock{
    font-family:'Bebas Neue',sans-serif;
    font-size:1rem;
    color:#6B7280;
    letter-spacing:1px;
  }

  /* ===== MAIN CONTENT ===== */
  .main{
    padding:8px;
    padding-top:64px;
    padding-bottom:80px;
    min-height:100vh;
  }
  .topbar{display:none!important;}

  /* ===== STAT CARDS — 2 COL COMPACT ===== */
  .sg{
    grid-template-columns:repeat(2,1fr);
    gap:8px;
    margin-bottom:16px;
  }
  .sc{padding:14px 12px;}
  .sv{font-size:1.6rem;}
  .sl{font-size:0.58rem;}
  .si{font-size:1.2rem;right:10px;top:10px;}

  /* ===== ORDER CARDS — FULL WIDTH ===== */
  .oc{border-radius:10px;margin-bottom:8px;}
  .oc-hdr{padding:14px 14px;}
  .oref{font-size:1.1rem;}
  .otime{font-size:0.68rem;}
  .onm{font-size:0.88rem;}

  /* ===== ACTION BUTTONS — THUMB SIZE ===== */
  .abtn{
    padding:12px 14px;
    font-size:0.78rem;
    min-height:44px;
    touch-action:manipulation;
    -webkit-tap-highlight-color:transparent;
    border-radius:8px;
  }
  .oacts{gap:6px;flex-wrap:wrap;}

  /* ===== FILTER TABS — SCROLLABLE ===== */
  .of{
    display:flex;
    gap:6px;
    overflow-x:auto;
    flex-wrap:nowrap;
    padding-bottom:8px;
    margin-bottom:12px;
    -webkit-overflow-scrolling:touch;
    scrollbar-width:none;
  }
  .of::-webkit-scrollbar{display:none;}
  .fc{
    padding:8px 14px;
    font-size:0.68rem;
    min-height:36px;
    flex-shrink:0;
    border-radius:20px;
    white-space:nowrap;
  }

  /* ===== TABLE GRID — 3 COLS ALWAYS ===== */
  #tgrid{
    grid-template-columns:repeat(3,1fr)!important;
    gap:8px!important;
  }

  /* ===== REVENUE / SETTINGS ===== */
  .rg,.setg{grid-template-columns:1fr;}
  .rc,.setc{padding:16px;}

  /* ===== MODAL — FULL SCREEN ON MOBILE ===== */
  .mb{
    margin:0;
    border-radius:16px 16px 0 0;
    position:fixed;
    bottom:0;
    left:0;
    right:0;
    max-height:90vh;
    overflow-y:auto;
    padding:24px 20px;
  }
  .mo{align-items:flex-end;}

  /* ===== UNPAID BANNER ===== */
  .unpaid-admin-banner{flex-wrap:wrap;gap:8px;}

  /* ===== HIDE DESKTOP TOPBAR ===== */
  .topbar{display:none;}
}
`;

  fixed = fixed.substring(0, mobileStart) + newMobileCSS + fixed.substring(mobileEnd);
  console.log('✅ Fix 1: Mobile CSS completely replaced — app-style layout');
} else {
  console.log('⚠️  Could not find mobile CSS block boundaries');
}

// ============================================
// FIX 2 — ADD MOBILE NAV HTML
// Bottom tab bar + mobile topbar
// Inject into app div after alerts
// ============================================

const oldAppNav = `<div class="sb">`;

const newAppNav = `<!-- MOBILE TOP BAR -->
<div class="mobile-topbar" style="display:none;">
  <div style="display:flex;align-items:center;gap:10px;">
    <span style="font-size:1.4rem;">🌮</span>
    <div class="mobile-topbar-title">LETS TACO</div>
  </div>
  <div class="mobile-topbar-right">
    <div id="mobile-clock" class="mobile-clock">00:00</div>
    <div id="mobile-open-pill" class="mobile-open-pill">OPEN</div>
  </div>
</div>

<!-- MOBILE BOTTOM NAV -->
<nav class="mobile-nav" style="display:none;">
  <div class="mn-tab active" data-pg="home" onclick="mNav(this,'home')">
    <div class="mn-ic">🏠</div>
    <div>Home</div>
    <div class="mn-badge" id="mn-badge">0</div>
  </div>
  <div class="mn-tab" data-pg="dinein" onclick="mNav(this,'dinein')">
    <div class="mn-ic">🍽️</div>
    <div>Tables</div>
  </div>
  <div class="mn-tab" data-pg="orders" onclick="mNav(this,'orders')">
    <div class="mn-ic">📋</div>
    <div>Orders</div>
  </div>
  <div class="mn-tab" data-pg="menu" onclick="mNav(this,'menu')">
    <div class="mn-ic">🌮</div>
    <div>Menu</div>
  </div>
  <div class="mn-tab" onclick="window.open('/kitchen','_blank')">
    <div class="mn-ic">👨‍🍳</div>
    <div>Kitchen</div>
  </div>
</nav>

<div class="sb">`;

if (fixed.includes(oldAppNav)) {
  fixed = fixed.replace(oldAppNav, newAppNav);
  console.log('✅ Fix 2: Mobile nav HTML injected');
} else {
  console.log('⚠️  Fix 2: sidebar div not found');
}

// ============================================
// FIX 3 — ADD MOBILE NAV JS
// Show mobile nav on mobile devices
// Sync with existing page navigation
// ============================================

const mobileNavJS = `
// ===== MOBILE APP NAV =====
function isMobile(){return window.innerWidth<=768;}

function mNav(el,pg){
  // Update active tab
  document.querySelectorAll('.mn-tab').forEach(function(t){t.classList.remove('active');});
  if(el)el.classList.add('active');
  // Navigate to page
  showPage(pg);
  // Update mobile topbar title
  var titles={home:'Dashboard',dinein:'Tables',orders:'Orders',menu:'Menu',customers:'Customers',revenue:'Revenue',settings:'Settings',help:'Guide'};
  var tb=document.querySelector('.mobile-topbar-title');
  if(tb)tb.textContent=titles[pg]||'LETS TACO';
}

function updateMobileNav(){
  if(!isMobile())return;
  // Show mobile elements
  var mNav=document.querySelector('.mobile-nav');
  var mTop=document.querySelector('.mobile-topbar');
  if(mNav)mNav.style.display='flex';
  if(mTop)mTop.style.display='flex';
  // Update badge
  var nb=document.getElementById('nb');
  var mb=document.getElementById('mn-badge');
  if(nb&&mb){
    var count=nb.textContent;
    if(count&&count!=='0'){
      mb.textContent=count;
      mb.classList.add('show');
    } else {
      mb.classList.remove('show');
    }
  }
  // Update mobile clock
  var mc=document.getElementById('mobile-clock');
  var clk=document.getElementById('clk');
  if(mc&&clk)mc.textContent=clk.textContent.substring(0,5);
}

// Initialize mobile on load
window.addEventListener('load',function(){
  if(isMobile()){
    updateMobileNav();
    setInterval(updateMobileNav,2000);
  }
});

window.addEventListener('resize',function(){
  if(isMobile()){updateMobileNav();}
});
`;

// Inject before closing body
fixed = fixed.replace(
  `</body>`,
  `<script>${mobileNavJS}</script>\n</body>`
);
console.log('✅ Fix 3: Mobile nav JS injected');

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
console.log('✅ admin.html saved — mobile app layout complete');
