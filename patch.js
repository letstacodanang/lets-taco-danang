const fs = require('fs');

const html = fs.readFileSync('admin.html', 'utf8');

if (html.includes('Lam Tuyen')) {
  console.log('STOP — Wrong file detected.');
  process.exit(1);
}
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// ============================================
// FIX 1 — CLOSE THE main-wrap DIV PROPERLY
// Find the app div closing and add wrap close
// ============================================

// Check if main-wrap exists and if it's closed
const hasWrap = fixed.includes('class="main-wrap"');
const wrapCloseCount = (fixed.match(/<\/div>\s*<!-- end main-wrap -->/g) || []).length;

console.log('main-wrap exists:', hasWrap);
console.log('main-wrap properly closed:', wrapCloseCount > 0);

if (hasWrap) {
  // Find where .main div closes — it's the large div containing all pages
  // The app structure is: .app > .sb + .main-wrap > .main > [pages]
  // We need to close .main-wrap after .main closes

  // Find the main div open
  const appDiv = fixed.indexOf('<div class="app"');
  const mainWrapDiv = fixed.indexOf('<div class="main-wrap">', appDiv);
  const mainDiv = fixed.indexOf('<div class="main">', mainWrapDiv);

  console.log('app at:', appDiv);
  console.log('main-wrap at:', mainWrapDiv);
  console.log('main at:', mainDiv);

  // Check if already properly nested
  if (mainWrapDiv !== -1 && mainDiv !== -1) {
    // The main-wrap needs to close after the last page div
    // Find the app closing — it should be the last </div> before toast
    const toastIdx = fixed.indexOf('<div class="toast"');
    if (toastIdx !== -1) {
      // Look at what's just before toast
      const beforeToast = fixed.substring(toastIdx - 200, toastIdx);
      console.log('Before toast:', beforeToast);

      // Count if we need an extra </div>
      // main-wrap needs to be closed
      if (!fixed.substring(mainWrapDiv, toastIdx).includes('</div>\n</div>\n</div>')) {
        // Add the closing div before toast
        fixed = fixed.substring(0, toastIdx) +
          '</div><!-- end main -->\n</div><!-- end main-wrap -->\n' +
          fixed.substring(toastIdx);
        console.log('✅ Fix 1: main-wrap closed before toast');
      } else {
        console.log('✅ Fix 1: main-wrap already properly closed');
      }
    }
  }
} else {
  console.log('⚠️  main-wrap not found — skipping close fix');
}

// ============================================
// FIX 2 — ENSURE TOPBAR IS VISIBLE
// The topbar was getting hidden under alerts
// Move it below any fixed position alerts
// ============================================

// Add top padding to main content to account for alert banners
const oldMainPadding = `.main{padding:20px 24px;min-height:100vh;}`;
const newMainPadding = `.main{padding:20px 24px;min-height:100vh;padding-top:20px;}
.has-alert .main{padding-top:60px;}`;

if (fixed.includes(oldMainPadding)) {
  fixed = fixed.replace(oldMainPadding, newMainPadding);
  console.log('✅ Fix 2: Main padding accounts for alerts');
} else {
  console.log('⚠️  Fix 2: main padding pattern not found');
}

// ============================================
// FIX 3 — FORCE CONTENT VISIBLE FROM TOP
// Remove any margin-top that pushes content down
// Make sure stat cards show immediately
// ============================================

// The topbar div needs to be the first thing visible
// Check if there is a large top margin
const oldTopbar = `.topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;}`;
const newTopbar = `.topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-top:4px;}`;

if (fixed.includes(oldTopbar)) {
  fixed = fixed.replace(oldTopbar, newTopbar);
  console.log('✅ Fix 3: Topbar starts from top');
} else {
  console.log('⚠️  Fix 3: topbar CSS not found');
}

// ============================================
// FIX 4 — ADD JAVASCRIPT TO TRACK SIDEBAR
// STATE AND UPDATE main-wrap MARGIN
// CSS :hover doesn't work on touch screens
// Need JS to handle tap-to-expand on mobile
// ============================================

const sidebarJS = `
// Sidebar expand/collapse with JS for touch support
(function(){
  var sb = document.querySelector('.sb');
  var mw = document.querySelector('.main-wrap');
  if(!sb || !mw) return;
  var expanded = false;

  // Desktop: hover handles via CSS
  // Mobile: tap the sidebar to toggle
  sb.addEventListener('click', function(e) {
    // Only toggle if clicking sidebar itself not a nav item
    var isMobile = window.innerWidth <= 768;
    if(!isMobile) return; // CSS hover handles desktop

    // If clicking a nav item let it navigate
    if(e.target.closest('.ni')) return;

    expanded = !expanded;
    if(expanded) {
      sb.style.width = '220px';
      mw.style.marginLeft = '220px';
    } else {
      sb.style.width = '60px';
      mw.style.marginLeft = '60px';
    }
  });

  // Close sidebar when nav item clicked on mobile
  sb.querySelectorAll('.ni').forEach(function(ni) {
    ni.addEventListener('click', function() {
      var isMobile = window.innerWidth <= 768;
      if(!isMobile) return;
      if(expanded) {
        expanded = false;
        sb.style.width = '60px';
        mw.style.marginLeft = '60px';
      }
    });
  });
})();
`;

// Inject before closing body tag
const oldBodyClose = '</body>';
fixed = fixed.replace(
  oldBodyClose,
  `<script>${sidebarJS}</script>\n</body>`
);
console.log('✅ Fix 4: Sidebar JS touch support added');

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
console.log('✅ admin.html saved — layout fully fixed');
