const fs = require('fs');

const html = fs.readFileSync('admin.html', 'utf8');

if (html.includes('Lam Tuyen')) {
  console.log('STOP — Wrong file detected.');
  process.exit(1);
}
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// ============================================
// REPLACE ENTIRE CSS BLOCK
// Modern S&P500 corporate restaurant style
// Dark sidebar + bright content area
// High contrast, fast to read, professional
// ============================================

const styleStart = fixed.indexOf('<style>');
const styleEnd = fixed.indexOf('</style>') + 8;
const oldCSS = fixed.substring(styleStart, styleEnd);

const newCSS = `<style>
/* ===== RESET & BASE ===== */
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#F4F5F7;color:#1A1A2E;font-family:'Jost',sans-serif;min-height:100vh;}

/* ===== LOGIN SCREEN ===== */
.lw{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1A0800,#2A1200);}
.lb{width:100%;max-width:420px;padding:50px 40px;background:white;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.3);}
.ll{font-family:'Bebas Neue',sans-serif;font-size:2.2rem;color:#D4A017;letter-spacing:4px;text-align:center;margin-bottom:4px;}
.ls{text-align:center;color:#6B7280;font-size:0.78rem;letter-spacing:2px;text-transform:uppercase;margin-bottom:35px;}
.fg{margin-bottom:18px;}
.fg label{display:block;font-size:0.72rem;letter-spacing:2px;text-transform:uppercase;color:#6B7280;margin-bottom:6px;font-weight:600;}
.fg input{width:100%;background:#F9FAFB;border:1.5px solid #E5E7EB;color:#1A1A2E;padding:13px 16px;border-radius:8px;font-family:'Jost',sans-serif;font-size:0.95rem;outline:none;transition:border-color 0.2s;}
.fg input:focus{border-color:#D4A017;background:white;}
.btn-l{width:100%;background:linear-gradient(135deg,#D4A017,#E67E22);color:white;border:none;padding:15px;font-family:'Bebas Neue',sans-serif;font-size:1.2rem;letter-spacing:3px;border-radius:8px;cursor:pointer;margin-top:8px;}
.err{color:#DC2626;font-size:0.82rem;text-align:center;margin-top:12px;display:none;}

/* ===== APP LAYOUT ===== */
.app{display:none;min-height:100vh;}

/* ===== SIDEBAR ===== */
.sb{position:fixed;left:0;top:0;bottom:0;width:60px;background:#1A0800;border-right:none;display:flex;flex-direction:column;z-index:200;transition:width 0.25s cubic-bezier(0.4,0,0.2,1);overflow:hidden;box-shadow:4px 0 20px rgba(0,0,0,0.15);}
.sb:hover{width:220px;}
.sb:hover .sb-label{opacity:1;max-width:160px;}
.sb:hover .sb-n{opacity:1;}
.sb:hover .sb-s{opacity:1;}
.sb:hover .sb-clk{opacity:1;}
.sb:hover .btn-out{opacity:1;width:auto;}
.sb:hover .ni{padding:11px 20px;justify-content:flex-start;}
.sb:hover .nb{display:flex;}
.sb-top{padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;flex-direction:column;align-items:center;min-height:80px;justify-content:center;}
.sb-n{font-family:'Bebas Neue',sans-serif;font-size:1.3rem;color:#D4A017;letter-spacing:3px;opacity:0;transition:opacity 0.2s;white-space:nowrap;margin-top:4px;}
.sb-s{font-size:0.6rem;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.4);opacity:0;transition:opacity 0.2s;white-space:nowrap;}
.sb-clk{padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.08);font-size:0.9rem;color:#D4A017;font-family:'Bebas Neue',sans-serif;letter-spacing:2px;text-align:center;opacity:0;transition:opacity 0.2s;white-space:nowrap;overflow:hidden;}
.sb-nav{flex:1;padding:8px 0;overflow-y:auto;overflow-x:hidden;}
.ni{display:flex;align-items:center;gap:12px;padding:11px 0;justify-content:center;cursor:pointer;color:rgba(255,255,255,0.5);font-size:0.75rem;letter-spacing:1px;text-transform:uppercase;position:relative;transition:all 0.2s;white-space:nowrap;}
.ni:hover{background:rgba(255,255,255,0.06);color:white;}
.ni.active{background:rgba(212,160,23,0.15);color:#D4A017;border-right:3px solid #D4A017;}
.ni-ic{font-size:1.2rem;width:24px;text-align:center;flex-shrink:0;}
.sb-label{opacity:0;max-width:0;overflow:hidden;transition:opacity 0.2s,max-width 0.25s;white-space:nowrap;font-weight:500;}
.nb{display:none;position:absolute;right:12px;background:#DC2626;color:white;font-size:0.6rem;font-weight:700;padding:2px 6px;border-radius:10px;min-width:18px;text-align:center;}
.sb-bot{padding:12px 0;border-top:1px solid rgba(255,255,255,0.08);display:flex;justify-content:center;}
.btn-out{background:transparent;border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.5);padding:8px 16px;font-family:'Jost',sans-serif;font-size:0.75rem;letter-spacing:1px;text-transform:uppercase;border-radius:6px;cursor:pointer;opacity:0;transition:opacity 0.2s;white-space:nowrap;width:0;overflow:hidden;}
.btn-out:hover{border-color:#C0392B;color:#C0392B;}

/* ===== MAIN CONTENT ===== */
.main{margin-left:60px;padding:24px;min-height:100vh;background:#F4F5F7;}

/* ===== TOP BAR ===== */
.topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;}
.pt{font-family:'Bebas Neue',sans-serif;font-size:1.8rem;color:#1A1A2E;letter-spacing:2px;}
.rtog{display:flex;align-items:center;gap:8px;background:white;border:1.5px solid #E5E7EB;border-radius:30px;padding:8px 18px;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,0.08);}
.rdot{width:10px;height:10px;border-radius:50%;background:#10B981;}
.rtxt{font-size:0.75rem;letter-spacing:1px;text-transform:uppercase;color:#10B981;font-weight:600;}

/* ===== PAGES ===== */
.pg{display:none;}
.pg.active{display:block;}

/* ===== STAT CARDS ===== */
.sg{display:grid;grid-template-columns:repeat(5,1fr);gap:16px;margin-bottom:24px;}
.sc{background:white;border-radius:10px;padding:20px;position:relative;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);border:1px solid #E5E7EB;}
.sc::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(to right,#D4A017,#E67E22);}
.sl{font-size:0.65rem;letter-spacing:2px;text-transform:uppercase;color:#6B7280;margin-bottom:8px;font-weight:600;}
.sv{font-family:'Bebas Neue',sans-serif;font-size:2rem;color:#1A1A2E;line-height:1;}
.ss{font-size:0.72rem;color:#9CA3AF;margin-top:4px;}
.si{position:absolute;right:16px;top:16px;font-size:1.6rem;opacity:0.12;}

/* ===== FILTER TABS ===== */
.of{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;}
.fc{padding:7px 16px;border-radius:20px;border:1.5px solid #E5E7EB;background:white;color:#6B7280;font-family:'Jost',sans-serif;font-size:0.75rem;letter-spacing:1px;text-transform:uppercase;cursor:pointer;font-weight:500;transition:all 0.15s;}
.fc.active,.fc:hover{border-color:#D4A017;color:#D4A017;background:#FFFBEB;}

/* ===== ORDER CARDS ===== */
.ol{display:flex;flex-direction:column;gap:10px;}
.oc{background:white;border-radius:10px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);border:1px solid #E5E7EB;border-left:4px solid #E5E7EB;}
.oc-hdr{padding:14px 16px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;}
.oc-hdr:hover{background:#FAFAFA;}
.oc-body{background:#F9FAFB;border-top:1px solid #E5E7EB;padding:16px;}

/* Order type left border colors */
.oc.sp{border-left-color:#F59E0B;}
.oc.sa{border-left-color:#3B82F6;}
.oc.sr{border-left-color:#8B5CF6;}
.oc.sk{border-left-color:#F59E0B;}
.oc.sd{border-left-color:#10B981;}
.oc.sv2{border-left-color:#9CA3AF;}
.oc.sd2{border-left-color:#10B981;}
.oc.sc2{border-left-color:#EF4444;}

/* ===== ORDER HEADER ===== */
.oh{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;flex-wrap:wrap;gap:8px;}
.oref{font-family:'Bebas Neue',sans-serif;font-size:1.2rem;color:#1A1A2E;letter-spacing:2px;}
.otime{font-size:0.72rem;color:#9CA3AF;margin-top:2px;}
.onm{font-size:0.9rem;color:#374151;font-weight:600;margin-bottom:2px;}
.oph{font-size:0.78rem;color:#6B7280;margin-top:3px;}

/* ===== STATUS BADGES ===== */
.sbadge{padding:4px 12px;border-radius:20px;font-size:0.65rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:1.5px solid;}
.sb-p{background:#FEF3C7;color:#D97706;border-color:#FCD34D;}
.sb-a{background:#DBEAFE;color:#2563EB;border-color:#93C5FD;}
.sb-r{background:#EDE9FE;color:#7C3AED;border-color:#C4B5FD;}
.sb-k{background:#FEF9C3;color:#CA8A04;border-color:#FDE047;}
.sb-d{background:#D1FAE5;color:#059669;border-color:#6EE7B7;}
.sb-v{background:#F3F4F6;color:#6B7280;border-color:#D1D5DB;}
.sb-c{background:#FEE2E2;color:#DC2626;border-color:#FCA5A5;}
.sb-g{background:#D1FAE5;color:#059669;border-color:#6EE7B7;}

/* ===== ORDER ITEMS ===== */
.oitems{background:white;border-radius:8px;padding:12px;margin:12px 0;border:1px solid #E5E7EB;}
.oirow{display:flex;justify-content:space-between;font-size:0.85rem;padding:5px 0;border-bottom:1px solid #F3F4F6;color:#374151;}
.oirow:last-child{border-bottom:none;}
.oirow span:first-child{color:#1A1A2E;font-weight:500;}

/* ===== ORDER FOOTER ===== */
.ofoot{margin-top:14px;}
.ototal{font-family:'Bebas Neue',sans-serif;font-size:1.3rem;color:#1A1A2E;}
.oacts{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;}

/* ===== ACTION BUTTONS ===== */
.abtn{padding:9px 16px;border-radius:6px;border:none;font-family:'Jost',sans-serif;font-size:0.78rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all 0.15s;text-decoration:none;display:inline-block;}
.abtn-gold{background:linear-gradient(135deg,#D4A017,#E67E22);color:white;}
.abtn-gold:hover{opacity:0.9;transform:translateY(-1px);}
.abtn-wa{background:#25D366;color:white;}
.abtn-red{background:white;border:1.5px solid #EF4444;color:#EF4444;}
.abtn-muted{background:white;border:1.5px solid #E5E7EB;color:#6B7280;}
.abtn-muted:hover{border-color:#D4A017;color:#D4A017;}
.abtn-paid{background:linear-gradient(135deg,#C0392B,#E67E22);color:white;}

/* ===== UNPAID BANNER ===== */
.unpaid-admin-banner{background:#FEF2F2;border:1.5px solid #FCA5A5;border-radius:8px;padding:10px 14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;gap:10px;}
.unpaid-admin-label{font-family:'Bebas Neue',sans-serif;font-size:0.9rem;color:#DC2626;letter-spacing:2px;}

/* ===== ORDER TRACKER ===== */
.tracker{display:flex;align-items:center;margin:12px 0;overflow-x:auto;}
.tstep{display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;min-width:60px;}
.tdot{width:28px;height:28px;border-radius:50%;border:2px solid #E5E7EB;background:white;display:flex;align-items:center;justify-content:center;font-size:0.72rem;position:relative;z-index:1;}
.tdot.done{background:#D4A017;border-color:#D4A017;color:white;}
.tdot.curr{background:#E67E22;border-color:#E67E22;color:white;box-shadow:0 0 12px rgba(230,126,34,0.4);}
.tlbl{font-size:0.58rem;letter-spacing:1px;text-transform:uppercase;color:#9CA3AF;text-align:center;}
.tlbl.done{color:#D4A017;}
.tlbl.curr{color:#E67E22;}
.tline{flex:1;height:2px;background:#E5E7EB;margin:0 -5px;margin-top:-19px;z-index:0;}
.tline.done{background:#D4A017;}

/* ===== CUSTOMERS ===== */
.cg{display:grid;gap:12px;}
.cc{background:white;border-radius:10px;padding:18px;display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;box-shadow:0 1px 4px rgba(0,0,0,0.08);border:1px solid #E5E7EB;}
.cname{font-size:0.95rem;color:#1A1A2E;font-weight:700;margin-bottom:2px;}
.cemail{font-size:0.78rem;color:#6B7280;}
.cstats{display:flex;gap:16px;margin-top:8px;flex-wrap:wrap;}
.cstat{font-size:0.72rem;color:#6B7280;}
.cstat strong{color:#D4A017;}
.pbadge{background:linear-gradient(135deg,#D4A017,#E67E22);color:white;padding:6px 14px;border-radius:20px;font-family:'Bebas Neue',sans-serif;font-size:0.9rem;letter-spacing:2px;text-align:center;}

/* ===== REVENUE ===== */
.rg{display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-bottom:24px;}
.rc{background:white;border-radius:10px;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,0.08);border:1px solid #E5E7EB;}
.rt{font-family:'Bebas Neue',sans-serif;font-size:1.1rem;color:#1A1A2E;letter-spacing:2px;margin-bottom:16px;}
.chart-w{display:flex;align-items:flex-end;gap:8px;height:140px;}
.cbar-w{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;height:100%;}
.cbar{width:100%;background:linear-gradient(to top,#D4A017,#E67E22);border-radius:3px 3px 0 0;min-height:4px;position:relative;cursor:pointer;}
.cbar:hover::after{content:attr(data-val);position:absolute;top:-28px;left:50%;transform:translateX(-50%);background:#1A1A2E;color:white;padding:3px 8px;border-radius:4px;font-size:0.65rem;white-space:nowrap;}
.clbl{font-size:0.62rem;color:#9CA3AF;}
.top-items{display:flex;flex-direction:column;gap:10px;}
.top-item{display:flex;justify-content:space-between;align-items:center;font-size:0.82rem;color:#374151;}

/* ===== MENU PAGE ===== */
.mig{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;}
.mic{background:white;border-radius:10px;padding:18px;display:flex;justify-content:space-between;align-items:center;gap:14px;box-shadow:0 1px 4px rgba(0,0,0,0.08);border:1px solid #E5E7EB;}
.mi-nm{font-family:'Bebas Neue',sans-serif;font-size:1.1rem;color:#1A1A2E;letter-spacing:1px;}
.mi-pr{font-size:0.82rem;color:#D4A017;font-weight:600;}
.mi-ds{font-size:0.72rem;color:#9CA3AF;margin-top:2px;}
.tsw{position:relative;width:50px;height:26px;flex-shrink:0;}
.tsw input{opacity:0;width:0;height:0;position:absolute;}
.tsl{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#E5E7EB;border-radius:26px;transition:0.3s;}
.tsl:before{content:'';position:absolute;height:18px;width:18px;left:4px;bottom:4px;background:white;border-radius:50%;transition:0.3s;box-shadow:0 1px 3px rgba(0,0,0,0.2);}
.tsw input:checked + .tsl{background:#10B981;}
.tsw input:checked + .tsl:before{transform:translateX(24px);}

/* ===== SETTINGS ===== */
.setg{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.setc{background:white;border-radius:10px;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,0.08);border:1px solid #E5E7EB;}
.set-t{font-family:'Bebas Neue',sans-serif;font-size:1rem;color:#1A1A2E;letter-spacing:2px;margin-bottom:16px;}
.set-r{display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid #F3F4F6;}
.set-r:last-child{border-bottom:none;}
.set-l{font-size:0.85rem;color:#374151;font-weight:500;}
.set-v{font-size:0.82rem;color:#9CA3AF;}

/* ===== DINE IN TABLE GRID ===== */
.pg#pg-dinein .sc{cursor:pointer;}

/* ===== MODAL ===== */
.mo{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px);}
.mo.show{display:flex;}
.mb{background:white;border-radius:12px;padding:32px;max-width:500px;width:100%;margin:20px;box-shadow:0 20px 60px rgba(0,0,0,0.2);}
.mt{font-family:'Bebas Neue',sans-serif;font-size:1.4rem;color:#1A1A2E;letter-spacing:2px;margin-bottom:18px;}
.mi2{width:100%;background:#F9FAFB;border:1.5px solid #E5E7EB;color:#1A1A2E;padding:11px 14px;border-radius:8px;font-family:'Jost',sans-serif;font-size:0.9rem;outline:none;margin-bottom:12px;display:block;transition:border-color 0.2s;}
.mi2:focus{border-color:#D4A017;}
.ma{display:flex;gap:10px;justify-content:flex-end;margin-top:16px;}
.mc{background:linear-gradient(135deg,#D4A017,#E67E22);color:white;border:none;padding:10px 24px;font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:2px;border-radius:6px;cursor:pointer;}
.mx{background:white;border:1.5px solid #E5E7EB;color:#6B7280;padding:10px 24px;font-family:'Jost',sans-serif;font-size:0.85rem;border-radius:6px;cursor:pointer;}

/* ===== ALERTS ===== */
@keyframes alertPulse{0%,100%{opacity:1;}50%{opacity:0.85;}}
@keyframes pd{0%,100%{opacity:1;}50%{opacity:0.4;}}

/* ===== TOAST ===== */
.toast{position:fixed;bottom:24px;right:24px;background:#1A1A2E;border-radius:8px;padding:14px 20px;color:white;font-size:0.82rem;z-index:9999;transform:translateX(200%);transition:transform 0.3s;max-width:300px;box-shadow:0 8px 24px rgba(0,0,0,0.2);}
.toast.show{transform:translateX(0);}
.toast-t{font-family:'Bebas Neue',sans-serif;font-size:0.95rem;color:#D4A017;margin-bottom:3px;}

/* ===== EMPTY STATE ===== */
.empty{color:#9CA3AF;text-align:center;padding:40px;font-size:0.88rem;}

/* ===== READY & PAY ALERTS ===== */
#ready-alert{animation:alertPulse 1s infinite;}
#pay-alert{box-shadow:0 4px 20px rgba(212,160,23,0.4);}

/* ===== GROUP HEADERS ===== */
.group-header{font-family:'Bebas Neue',sans-serif;font-size:0.85rem;letter-spacing:3px;padding:6px 0;border-bottom:2px solid #E5E7EB;margin-bottom:10px;color:#6B7280;}

/* ===== REVENUE PERIOD BUTTONS ===== */
.rp-btn{padding:7px 16px;border-radius:20px;border:1.5px solid #E5E7EB;background:white;color:#6B7280;font-family:'Jost',sans-serif;font-size:0.72rem;letter-spacing:2px;text-transform:uppercase;cursor:pointer;font-weight:500;transition:all 0.15s;}
.rp-btn.active{border-color:#D4A017;color:#D4A017;background:#FFFBEB;}

/* ===== TABLET ===== */
@media(max-width:1024px) and (min-width:769px){
  .sg{grid-template-columns:repeat(3,1fr);}
  .rg,.setg{grid-template-columns:1fr;}
  .abtn{padding:10px 14px;font-size:0.78rem;min-height:40px;}
}

/* ===== MOBILE ===== */
@media(max-width:768px){
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
}

/* ===== TOUCH IMPROVEMENTS ===== */
.abtn{touch-action:manipulation;-webkit-tap-highlight-color:transparent;}
.ni{-webkit-tap-highlight-color:transparent;user-select:none;}
.fc{touch-action:manipulation;}
*{-webkit-font-smoothing:antialiased;}

/* ===== INPUT FOCUS ===== */
input:focus{outline:none;}
</style>`;

fixed = fixed.substring(0, styleStart) + newCSS + fixed.substring(styleEnd);
console.log('✅ Fix 1: Full CSS replaced — modern S&P500 corporate style');

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
console.log('✅ admin.html saved — full visual redesign complete');
