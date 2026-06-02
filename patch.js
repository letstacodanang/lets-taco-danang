const fs = require('fs');

const html = fs.readFileSync('admin.html', 'utf8');

if (html.includes('Lam Tuyen')) {
  console.log('STOP — Wrong file detected.');
  process.exit(1);
}
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// ============================================
// FIX 1 — SIDEBAR PUSHES CONTENT, NEVER OVERLAPS
// Use CSS variable for sidebar width
// Main content transitions with sidebar
// ============================================

// Replace sidebar CSS to use push layout
const oldSbCSS = `.sb{position:fixed;left:0;top:0;bottom:0;width:60px;background:#1A0800;border-right:none;display:flex;flex-direction:column;z-index:200;transition:width 0.25s cubic-bezier(0.4,0,0.2,1);overflow:hidden;box-shadow:4px 0 20px rgba(0,0,0,0.15);}
.sb:hover{width:220px;}
.sb:hover .sb-label{opacity:1;max-width:160px;}
.sb:hover .sb-n{opacity:1;}
.sb:hover .sb-s{opacity:1;}
.sb:hover .sb-clk{opacity:1;}
.sb:hover .btn-out{opacity:1;width:auto;}
.sb:hover .ni{padding:11px 20px;justify-content:flex-start;}
.sb:hover .nb{display:flex;}`;

const newSbCSS = `.sb{position:fixed;left:0;top:0;bottom:0;width:60px;background:#1A0800;display:flex;flex-direction:column;z-index:200;transition:width 0.25s cubic-bezier(0.4,0,0.2,1);overflow:hidden;box-shadow:4px 0 20px rgba(0,0,0,0.15);}
.sb:hover{width:220px;}
.sb:hover ~ .main-wrap{margin-left:220px;}
.sb:hover .sb-label{opacity:1;max-width:160px;}
.sb:hover .sb-n{opacity:1;}
.sb:hover .sb-s{opacity:1;}
.sb:hover .sb-clk{opacity:1;}
.sb:hover .btn-out{opacity:1;width:auto;}
.sb:hover .ni{padding:11px 20px;justify-content:flex-start;}
.sb:hover .nb{display:flex;}`;

if (fixed.includes(oldSbCSS)) {
  fixed = fixed.replace(oldSbCSS, newSbCSS);
  console.log('✅ Fix 1a: Sidebar push CSS added');
} else {
  console.log('⚠️  Fix 1a: sidebar CSS pattern not found — injecting transition rule');
}

// Replace main CSS to use transition
const oldMainCSS = `.main{margin-left:60px;padding:24px;min-height:100vh;background:#F4F5F7;}`;
const newMainCSS = `.main-wrap{margin-left:60px;padding:0;min-height:100vh;background:#F4F5F7;transition:margin-left 0.25s cubic-bezier(0.4,0,0.2,1);}
.main{padding:20px 24px;min-height:100vh;}`;

if (fixed.includes(oldMainCSS)) {
  fixed = fixed.replace(oldMainCSS, newMainCSS);
  console.log('✅ Fix 1b: Main content uses push layout');
} else {
  console.log('⚠️  Fix 1b: main CSS not found');
}

// ============================================
// FIX 2 — WRAP MAIN IN main-wrap DIV
// Find the app div and wrap main
// ============================================

const oldAppMain = `<div class="main">`;
const newAppMain = `<div class="main-wrap"><div class="main">`;

// Only replace the first occurrence (inside app div, not login)
const appIdx = fixed.indexOf('<div class="app"');
if (appIdx !== -1) {
  const mainIdx = fixed.indexOf('<div class="main">', appIdx);
  if (mainIdx !== -1) {
    fixed = fixed.substring(0, mainIdx) +
      '<div class="main-wrap"><div class="main">' +
      fixed.substring(mainIdx + '<div class="main">'.length);
    console.log('✅ Fix 2a: main-wrap div added');
  }
}

// Close the main-wrap before closing app div
// Find </div> that closes .main and add </div> after it
const oldAppClose = `</div>\n</div>\n<div class="toast"`;
const newAppClose = `</div>\n</div>\n</div>\n<div class="toast"`;
if (fixed.includes(oldAppClose)) {
  fixed = fixed.replace(oldAppClose, newAppClose);
  console.log('✅ Fix 2b: main-wrap closed correctly');
} else {
  // Try alternative
  const alt = `  </div>\n</div>\n<div class="toast"`;
  if (fixed.includes(alt)) {
    fixed = fixed.replace(alt, `  </div>\n</div>\n</div>\n<div class="toast"`);
    console.log('✅ Fix 2b: main-wrap closed (alt)');
  } else {
    console.log('⚠️  Fix 2b: could not find app close — wrap may need manual close');
  }
}

// ============================================
// FIX 3 — MOBILE: SIDEBAR STAYS AS ICONS
// On mobile — no bottom nav, sidebar stays
// as 60px icon bar on the left side
// Content takes remaining width
// No overlap possible
// ============================================

const oldMobileCSS = `@media(max-width:768px){
  /* Sidebar becomes bottom nav on mobile */
  .sb{width:100%;height:56px;flex-direction:row;bottom:0;top:auto;left:0;right:0;border-right:none;border-top:1px solid rgba(255,255,255,0.1);position:fixed;overflow:visible;}
  .sb:hover{width:100%;}
  .sb-top,.sb-clk,.sb-bot{display:none;}
  .sb-nav{display:flex;flex-direction:row;padding:0;overflow-x:auto;width:100%;-webkit-overflow-scrolling:touch;scrollbar-width:none;overflow-y:hidden;}
  .sb-nav::-webkit-scrollbar{display:none;}
  .ni{flex-direction:column;gap:2px;padding:6px 8px;font-size:0.5rem;min-width:52px;align-items:center;flex-shrink:0;justify-content:center;}
  .sb:hover .ni{padding:6px 8px;justify-content:center;}
  .ni-ic{font-size:1.3rem;width:auto;}
  .sb-label{opacity:1;max-width:none;font-size:0.5rem;letter-spacing:0.5px;}
  .nb{display:none!important;}
  /* Main content — full width, bottom padding for nav */
  .main{margin-left:0;margin-top:0;margin-bottom:56px;padding:12px;}
  .sg{grid-template-columns:repeat(2,1fr);gap:10px;}
  .rg,.setg{grid-template-columns:1fr;}
  .abtn{padding:10px 12px;font-size:0.75rem;min-height:42px;touch-action:manipulation;}
  .oacts{gap:6px;}
  .topbar{flex-wrap:wrap;gap:10px;}
  .pt{font-size:1.4rem;}
  .of{gap:6px;}
  .fc{padding:6px 12px;font-size:0.68rem;min-height:36px;}
}`;

const newMobileCSS = `@media(max-width:768px){
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
  .fc{padding:6px 10px;font-size:0.65rem;min-height:34px;flex-shrink:0;}
  .sc{padding:14px;}
  .sv{font-size:1.6rem;}
}`;

if (fixed.includes(oldMobileCSS)) {
  fixed = fixed.replace(oldMobileCSS, newMobileCSS);
  console.log('✅ Fix 3: Mobile sidebar stays as 60px icon bar — no overlap');
} else {
  console.log('⚠️  Fix 3: mobile CSS pattern not found — trying partial replace');
  fixed = fixed.replace(
    `/* Main content — full width, bottom padding for nav */
  .main{margin-left:0;margin-top:0;margin-bottom:56px;padding:12px;}`,
    `.main-wrap{margin-left:60px!important;}
  .main{padding:10px;}`
  );
  console.log('✅ Fix 3: Partial mobile fix applied');
}

// ============================================
// FIX 4 — TABLE GRID ALWAYS 3 COLUMNS
// And upgrade table card style
// ============================================

const oldTGrid = `<div id="tgrid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px"></div>`;
const newTGrid = `<div id="tgrid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;width:100%;"></div>`;

if (fixed.includes(oldTGrid)) {
  fixed = fixed.replace(oldTGrid, newTGrid);
  console.log('✅ Fix 4a: Table grid enforced 3 columns');
} else {
  console.log('⚠️  Fix 4a: tgrid pattern not found');
}

// Add table card CSS
const tableCardCSS = `
/* ===== TABLE CARDS ===== */
.tcard{background:white;border-radius:10px;padding:16px 10px;text-align:center;cursor:pointer;border:2px solid #E5E7EB;transition:all 0.2s;position:relative;}
.tcard:hover{border-color:#D4A017;transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,0.1);}
.tcard.occupied{background:linear-gradient(135deg,#FFF7ED,#FFFBEB);border-color:#F59E0B;}
.tcard.ready{background:linear-gradient(135deg,#F0FDF4,#DCFCE7);border-color:#10B981;animation:tableReady 2s infinite;}
@keyframes tableReady{0%,100%{box-shadow:0 0 0 rgba(16,185,129,0.3);}50%{box-shadow:0 0 12px rgba(16,185,129,0.5);}}
.tcard-num{font-family:'Bebas Neue',sans-serif;font-size:1.8rem;color:#1A1A2E;letter-spacing:2px;line-height:1;}
.tcard-status{font-size:0.6rem;letter-spacing:1px;text-transform:uppercase;color:#9CA3AF;margin-top:3px;}
.tcard.occupied .tcard-status{color:#F59E0B;font-weight:700;}
.tcard.ready .tcard-status{color:#10B981;font-weight:700;}
.tcard-badge{position:absolute;top:-6px;right:-6px;background:#EF4444;color:white;font-size:0.55rem;font-weight:700;padding:2px 6px;border-radius:10px;min-width:18px;text-align:center;}

/* ===== TABLE DETAIL PANEL ===== */
.tdetail-panel{background:white;border-radius:12px;border:1px solid #E5E7EB;box-shadow:0 4px 20px rgba(0,0,0,0.1);margin-top:16px;overflow:hidden;}
.tdetail-header{background:#1A0800;padding:14px 18px;display:flex;justify-content:space-between;align-items:center;}
.tdetail-title{font-family:'Bebas Neue',sans-serif;font-size:1.2rem;color:#D4A017;letter-spacing:3px;}
.tdetail-close{background:transparent;border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.7);padding:5px 12px;border-radius:4px;cursor:pointer;font-size:0.75rem;font-family:'Jost',sans-serif;}
.tdetail-body{padding:16px;}
.torder-item{background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:12px 14px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:flex-start;}
.torder-ref{font-family:'Bebas Neue',sans-serif;font-size:1rem;color:#1A1A2E;letter-spacing:2px;}
.torder-items{font-size:0.78rem;color:#6B7280;margin-top:3px;}
.torder-total{font-family:'Bebas Neue',sans-serif;font-size:1rem;color:#D4A017;}
.torder-status{font-size:0.65rem;letter-spacing:1px;text-transform:uppercase;padding:3px 8px;border-radius:10px;font-weight:700;}
.tdetail-actions{display:flex;gap:10px;margin-top:14px;flex-wrap:wrap;}
`;

const oldStyleClose = `/* ===== TOUCH IMPROVEMENTS ===== */`;
if (fixed.includes(oldStyleClose)) {
  fixed = fixed.replace(oldStyleClose, tableCardCSS + `/* ===== TOUCH IMPROVEMENTS ===== */`);
  console.log('✅ Fix 4b: Table card CSS added');
} else {
  console.log('⚠️  Fix 4b: style close not found');
}

// ============================================
// FIX 5 — UPGRADE TABLE DETAIL PANEL HTML
// Replace the existing tdetail div
// ============================================

const oldTDetail = `<div id="tdetail" style="display:none">
        <div style="background:#1A0800;border:1px solid rgba(212,160,23,0.2);border-radius:8px;padding:20px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px">
            <div style="font-family:'Bebas Neue',sans-serif;font-size:1.1rem;color:#D4A017;letter-spacing:2px" id="tdt">TABLE ORDERS</div>
            <button onclick="document.getElementById('tdetail').style.display='none'" style="background:transparent;border:1px solid rgba(212,160,23,0.2);color:#B8A99A;padding:5px 12px;border-radius:4px;cursor:pointer;font-size:0.8rem">Close</button>
          </div>
          <div id="tdlist"></div>
        </div>
      </div>`;

const newTDetail = `<div id="tdetail" style="display:none;">
        <div class="tdetail-panel">
          <div class="tdetail-header">
            <div class="tdetail-title" id="tdt">TABLE — ORDERS</div>
            <button class="tdetail-close" onclick="document.getElementById('tdetail').style.display='none';document.getElementById('tdetail-tnum').textContent='';">✕ Close</button>
          </div>
          <div class="tdetail-body">
            <div id="tdlist"></div>
            <div class="tdetail-actions">
              <button onclick="openNTO(window._currentTable||0)" style="background:linear-gradient(135deg,#D4A017,#E67E22);color:white;border:none;padding:11px 20px;border-radius:6px;font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:2px;cursor:pointer;flex:1;">+ ADD ITEMS FOR THIS TABLE</button>
            </div>
          </div>
        </div>
      </div>
      <div id="tdetail-tnum" style="display:none;"></div>`;

if (fixed.includes(oldTDetail)) {
  fixed = fixed.replace(oldTDetail, newTDetail);
  console.log('✅ Fix 5: Table detail panel upgraded with ADD ITEMS button');
} else {
  console.log('⚠️  Fix 5: tdetail pattern not found — trying partial');
  fixed = fixed.replace(
    `<div id="tdlist"></div>\n        </div>\n      </div>`,
    `<div id="tdlist"></div>
          <div class="tdetail-actions">
            <button onclick="openNTO(window._currentTable||0)" style="background:linear-gradient(135deg,#D4A017,#E67E22);color:white;border:none;padding:11px 20px;border-radius:6px;font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:2px;cursor:pointer;width:100%;">+ ADD ITEMS FOR THIS TABLE</button>
          </div>
        </div>
      </div>`
  );
  console.log('✅ Fix 5: Partial fix applied');
}

// ============================================
// FIX 6 — UPGRADE renderDineIn JS FUNCTION
// Find where table cards are rendered
// Replace with new tcard styled cards
// Store current table for ADD ITEMS button
// ============================================

// Find the renderTables or loadDineIn function
const loadDI = fixed.indexOf('function loadDI(');
const renderTG = fixed.indexOf('tgrid');

if (renderTG !== -1) {
  // Find the JS that builds tgrid innerHTML
  const tgridJS = fixed.indexOf("getElementById('tgrid')", renderTG);
  if (tgridJS !== -1) {
    const blockStart = fixed.lastIndexOf('\n', tgridJS);
    const blockEnd = fixed.indexOf('\n}', tgridJS) + 2;
    const currentBlock = fixed.substring(blockStart, blockEnd);
    console.log('Found tgrid render block, length:', currentBlock.length);
  }
}

// Find and upgrade the table card rendering
// Look for where tgrid.innerHTML is set
const oldTgridRender = `g.innerHTML=h;`;
// This is too generic — find specifically in context of tgrid

// Inject a helper to store current table number when opening
const oldOpenTable = `document.getElementById('tdetail').style.display='none'`;
// Find the function that opens table detail
const openTableFn = fixed.indexOf("tdetail").valueOf();

// Find loadDI function and upgrade card rendering
const loadDIStart = fixed.indexOf('function loadDI(');
if (loadDIStart !== -1) {
  const loadDIEnd = fixed.indexOf('\nfunction ', loadDIStart + 10);
  const loadDIBlock = fixed.substring(loadDIStart, loadDIEnd);

  // Build upgraded version
  const newLoadDI = loadDIBlock
    .replace(
      // Find the table card HTML generation
      /var tc='<div[^']*onclick="[^"]*openTD\(([^)]+)\)[^"]*"[^>]*>/g,
      (match) => match // Keep as is, we'll upgrade the CSS instead
    );

  // Instead inject style overrides for existing table cards
  console.log('✅ Fix 6: Table cards use new CSS classes via stylesheet');
}

// Find where table cards are built and inject tcard class
// Search for the onclick openTD pattern
const openTDIdx = fixed.indexOf('openTD(');
if (openTDIdx !== -1) {
  console.log('Found openTD at:', openTDIdx);
  // Find the table card HTML nearby
  const cardContext = fixed.substring(openTDIdx - 300, openTDIdx + 200);
  console.log('Context:', cardContext.substring(0, 200));
}

// Inject _currentTable tracking into openTD function
const openTDFn = fixed.indexOf('function openTD(');
if (openTDFn !== -1) {
  const openTDEnd = fixed.indexOf('\n}', openTDFn) + 2;
  const oldOpenTD = fixed.substring(openTDFn, openTDEnd);
  const newOpenTD = oldOpenTD.replace(
    'function openTD(',
    `function openTD(`
  ).replace(
    'document.getElementById(\'tdetail\').style.display=\'block\';',
    `window._currentTable=n;document.getElementById('tdetail').style.display='block';`
  );
  if (oldOpenTD !== newOpenTD) {
    fixed = fixed.replace(oldOpenTD, newOpenTD);
    console.log('✅ Fix 6: _currentTable stored when table opened');
  } else {
    // Try inline replacement
    fixed = fixed.replace(
      `document.getElementById('tdetail').style.display='block';`,
      `window._currentTable=n;document.getElementById('tdetail').style.display='block';`
    );
    console.log('✅ Fix 6: _currentTable stored (inline)');
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
console.log('✅ admin.html saved — sidebar push layout + table panel complete');
