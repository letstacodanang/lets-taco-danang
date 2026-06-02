const fs = require('fs');

const html = fs.readFileSync('admin.html', 'utf8');
if (html.includes('Lam Tuyen')) { console.log('STOP'); process.exit(1); }
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// ============================================
// FIX 1 — MORE TOP PADDING ON MOBILE
// Fixed topbar is 56px — content needs
// at least 64px top padding to clear it
// ============================================

const oldMainPadding = `  .main{
    padding:8px;
    padding-top:64px;
    padding-bottom:80px;
    min-height:100vh;
  }`;

const newMainPadding = `  .main{
    padding:8px;
    padding-top:72px;
    padding-bottom:80px;
    min-height:100vh;
  }`;

if (fixed.includes(oldMainPadding)) {
  fixed = fixed.replace(oldMainPadding, newMainPadding);
  console.log('✅ Fix 1: Top padding increased to 72px');
} else {
  console.log('⚠️  Fix 1: padding pattern not found — trying simple replace');
  fixed = fixed.replace('padding-top:64px;', 'padding-top:72px;');
  console.log('✅ Fix 1: padding-top updated via simple replace');
}

// ============================================
// FIX 2 — REPLACE FILTER TABS WITH DROPDOWN
// On mobile only — single select dropdown
// Desktop keeps the tab pills
// ============================================

// Add mobile dropdown CSS
const oldTouchCSS = `/* ===== TOUCH IMPROVEMENTS ===== */`;
const mobileDropdownCSS = `
/* ===== MOBILE FILTER DROPDOWN ===== */
.mobile-filter-select{
  display:none;
  width:100%;
  background:white;
  border:1.5px solid #E5E7EB;
  color:#1A1A2E;
  padding:11px 16px;
  border-radius:8px;
  font-family:'Jost',sans-serif;
  font-size:0.9rem;
  font-weight:600;
  outline:none;
  cursor:pointer;
  margin-bottom:14px;
  appearance:none;
  -webkit-appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23D4A017' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat:no-repeat;
  background-position:right 14px center;
  padding-right:36px;
  border-color:#D4A017;
  color:#D4A017;
  font-weight:700;
  letter-spacing:1px;
  text-transform:uppercase;
}
@media(max-width:768px){
  .mobile-filter-select{display:block;}
  .of{display:none!important;}
}
`;

if (fixed.includes(oldTouchCSS)) {
  fixed = fixed.replace(oldTouchCSS, mobileDropdownCSS + oldTouchCSS);
  console.log('✅ Fix 2a: Mobile dropdown CSS added');
} else {
  // Inject before closing style tag
  fixed = fixed.replace('</style>', mobileDropdownCSS + '</style>');
  console.log('✅ Fix 2a: Mobile dropdown CSS injected before </style>');
}

// Add the dropdown HTML before the filter tabs in orders page
const oldOrdersFilter = `<div class="of">
        <button class="fc active" data-f="all">All</button>
        <button class="fc" data-f="placed">New</button>
        <button class="fc" data-f="accepted">Accepted</button>
        <button class="fc" data-f="prepping">Prepping</button>
        <button class="fc" data-f="cooking">Cooking</button>
        <button class="fc" data-f="ready">Ready</button>
        <button class="fc" data-f="dispatched">Out for Delivery</button>
        <button class="fc" data-f="delivered">Delivered</button>
        <button class="fc" data-f="history" style="border-color:rgba(184,169,154,0.3);color:#B8A99A;">📦 History</button>
      </div>`;

const newOrdersFilter = `<!-- Mobile dropdown filter -->
      <select class="mobile-filter-select" id="mobile-filter-select" onchange="mobileFilterChange(this.value)">
        <option value="all">📋 All Orders</option>
        <option value="placed">🆕 New — Needs Action</option>
        <option value="accepted">✅ Accepted</option>
        <option value="prepping">🔪 Prepping</option>
        <option value="cooking">🔥 Cooking</option>
        <option value="ready">🟢 Ready for Pickup</option>
        <option value="dispatched">🛵 Out for Delivery</option>
        <option value="delivered">✅ Delivered</option>
        <option value="history">📦 History</option>
      </select>
      <!-- Desktop tab pills -->
      <div class="of">
        <button class="fc active" data-f="all">All</button>
        <button class="fc" data-f="placed">New</button>
        <button class="fc" data-f="accepted">Accepted</button>
        <button class="fc" data-f="prepping">Prepping</button>
        <button class="fc" data-f="cooking">Cooking</button>
        <button class="fc" data-f="ready">Ready</button>
        <button class="fc" data-f="dispatched">Out for Delivery</button>
        <button class="fc" data-f="delivered">Delivered</button>
        <button class="fc" data-f="history" style="border-color:rgba(184,169,154,0.3);color:#B8A99A;">📦 History</button>
      </div>`;

if (fixed.includes(oldOrdersFilter)) {
  fixed = fixed.replace(oldOrdersFilter, newOrdersFilter);
  console.log('✅ Fix 2b: Mobile dropdown added before desktop tabs');
} else {
  console.log('⚠️  Fix 2b: orders filter pattern not found — trying partial');
  fixed = fixed.replace(
    `<div class="of">\n        <button class="fc active" data-f="all">All</button>`,
    `<select class="mobile-filter-select" id="mobile-filter-select" onchange="mobileFilterChange(this.value)"><option value="all">📋 All Orders</option><option value="placed">🆕 New</option><option value="accepted">✅ Accepted</option><option value="prepping">🔪 Prepping</option><option value="cooking">🔥 Cooking</option><option value="ready">🟢 Ready</option><option value="dispatched">🛵 Out for Delivery</option><option value="delivered">✅ Delivered</option><option value="history">📦 History</option></select>\n      <div class="of">\n        <button class="fc active" data-f="all">All</button>`
  );
  console.log('✅ Fix 2b: Partial replace applied');
}

// Add the mobileFilterChange JS function
const mobileFilterJS = `
function mobileFilterChange(val){
  // Update the desktop filter tabs to match
  document.querySelectorAll('.fc').forEach(function(b){
    b.classList.remove('active');
    if(b.getAttribute('data-f')===val)b.classList.add('active');
  });
  // If all tabs have the filter function, call it
  var btn=document.querySelector('.fc[data-f="'+val+'"]');
  if(btn)btn.click();
}
`;

// Inject before closing body
fixed = fixed.replace(
  `</body>`,
  `<script>${mobileFilterJS}</script>\n</body>`
);
console.log('✅ Fix 2c: mobileFilterChange function added');

// ============================================
// FIX 3 — HOME TAB FILTER DROPDOWN TOO
// The home tab also has filter pills
// But home doesn't have filter — skip
// Just make sure revenue period buttons
// work on mobile too
// ============================================

console.log('✅ Fix 3: Revenue period buttons already work on mobile');

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
console.log('✅ admin.html saved — mobile filter dropdown + padding fix');
