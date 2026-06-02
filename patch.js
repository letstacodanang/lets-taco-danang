const fs = require('fs');

const html = fs.readFileSync('admin.html', 'utf8');
if (html.includes('Lam Tuyen')) { console.log('STOP'); process.exit(1); }
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// FIX 1 - Add marketing nav item
const oldMenuNav = '<div class="ni" data-pg="menu"><span class="ni-ic">🌮</span><span class="sb-label">Menu</span></div>';
const newMenuNav = '<div class="ni owner-only" data-pg="marketing"><span class="ni-ic">📣</span><span class="sb-label">Marketing</span></div>\n      <div class="ni" data-pg="menu"><span class="ni-ic">🌮</span><span class="sb-label">Menu</span></div>';

if (fixed.includes(oldMenuNav)) {
  fixed = fixed.replace(oldMenuNav, newMenuNav);
  console.log('✅ Fix 1: Marketing nav added');
} else {
  console.log('⚠️  Fix 1: nav pattern not found');
}

// FIX 2 - Add marketing page HTML before menu page
const oldMenuPage = '<div class="pg" id="pg-menu">';

const mktHTML = '<div class="pg owner-only" id="pg-marketing"><div style="max-width:800px;">'
  + '<div style="margin-bottom:24px;">'
  + '<div style="font-family:Bebas Neue,sans-serif;font-size:1.6rem;color:#1A1A2E;letter-spacing:3px;margin-bottom:4px;">📣 MARKETING BROADCASTS</div>'
  + '<div style="font-size:0.82rem;color:#6B7280;">Send promotions directly to your customers via WhatsApp or Zalo.</div>'
  + '</div>'
  + '<div style="background:white;border-radius:12px;border:1px solid #E5E7EB;padding:24px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">'
  + '<div style="font-family:Bebas Neue,sans-serif;font-size:1.1rem;color:#1A1A2E;letter-spacing:2px;margin-bottom:16px;">✍️ COMPOSE YOUR MESSAGE</div>'
  + '<textarea id="mkt-msg" placeholder="Type your promotion here... Example: Special deal today only! 2x Birria Tacos for 200k. Show this message when you arrive." style="width:100%;min-height:140px;background:#F9FAFB;border:1.5px solid #E5E7EB;color:#1A1A2E;padding:14px;border-radius:8px;font-family:Jost,sans-serif;font-size:0.9rem;outline:none;resize:vertical;line-height:1.6;"></textarea>'
  + '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">'
  + '<div style="font-size:0.72rem;color:#9CA3AF;" id="mkt-char-count">0 characters</div>'
  + '<div style="display:flex;gap:8px;">'
  + '<button onclick="mktPreview()" style="background:white;border:1.5px solid #D4A017;color:#D4A017;padding:9px 18px;border-radius:6px;font-family:Jost,sans-serif;font-size:0.82rem;font-weight:700;cursor:pointer;">👁 Preview</button>'
  + '<button onclick="mktClear()" style="background:white;border:1.5px solid #E5E7EB;color:#6B7280;padding:9px 18px;border-radius:6px;font-family:Jost,sans-serif;font-size:0.82rem;cursor:pointer;">Clear</button>'
  + '</div></div>'
  + '<div id="mkt-preview" style="display:none;background:#F0FDF4;border:1px solid #6EE7B7;border-radius:8px;padding:14px;margin-top:12px;font-size:0.88rem;color:#1A1A2E;line-height:1.7;white-space:pre-wrap;"></div>'
  + '</div>'
  + '<div style="background:white;border-radius:12px;border:1px solid #E5E7EB;padding:24px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">'
  + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">'
  + '<div><div style="font-family:Bebas Neue,sans-serif;font-size:1.1rem;color:#1A1A2E;letter-spacing:2px;">💬 WHATSAPP CONTACTS</div>'
  + '<div style="font-size:0.72rem;color:#6B7280;margin-top:2px;" id="mkt-wa-count">Loading...</div></div>'
  + '<button onclick="mktSendAll(\'whatsapp\')" style="background:#25D366;color:white;border:none;padding:11px 20px;border-radius:8px;font-family:Bebas Neue,sans-serif;font-size:1rem;letter-spacing:2px;cursor:pointer;">💬 SEND TO ALL</button>'
  + '</div>'
  + '<div id="mkt-wa-list" style="display:flex;flex-direction:column;gap:8px;max-height:300px;overflow-y:auto;"><div style="color:#9CA3AF;text-align:center;padding:20px;font-size:0.85rem;">Loading...</div></div>'
  + '</div>'
  + '<div style="background:white;border-radius:12px;border:1px solid #E5E7EB;padding:24px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">'
  + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">'
  + '<div><div style="font-family:Bebas Neue,sans-serif;font-size:1.1rem;color:#1A1A2E;letter-spacing:2px;">🔵 ZALO CONTACTS</div>'
  + '<div style="font-size:0.72rem;color:#6B7280;margin-top:2px;" id="mkt-zl-count">Loading...</div></div>'
  + '<button onclick="mktSendAll(\'zalo\')" style="background:linear-gradient(135deg,#0068FF,#0052CC);color:white;border:none;padding:11px 20px;border-radius:8px;font-family:Bebas Neue,sans-serif;font-size:1rem;letter-spacing:2px;cursor:pointer;">🔵 SEND TO ALL</button>'
  + '</div>'
  + '<div id="mkt-zl-list" style="display:flex;flex-direction:column;gap:8px;max-height:300px;overflow-y:auto;"><div style="color:#9CA3AF;text-align:center;padding:20px;font-size:0.85rem;">Loading...</div></div>'
  + '</div>'
  + '<div style="background:#FFFBEB;border:1px solid #FCD34D;border-radius:10px;padding:16px;">'
  + '<div style="font-family:Bebas Neue,sans-serif;font-size:0.9rem;color:#D97706;letter-spacing:2px;margin-bottom:8px;">💡 HOW IT WORKS</div>'
  + '<div style="font-size:0.8rem;color:#6B7280;line-height:1.8;">1. Write your message above<br>2. Tap SEND TO ALL for WhatsApp or Zalo<br>3. Each customer opens one by one — tap Send in the app<br>4. Come back and tap the next customer<br><strong style="color:#D97706;">Keep messages under 160 characters for best results</strong></div>'
  + '</div>'
  + '</div></div>'
  + '\n<div class="pg" id="pg-menu">';

if (fixed.includes(oldMenuPage)) {
  fixed = fixed.replace(oldMenuPage, mktHTML);
  console.log('✅ Fix 2: Marketing page HTML added');
} else {
  console.log('⚠️  Fix 2: menu page not found');
}

// FIX 3 - Hook showPg to load marketing
const oldShowPg = 'function showPg(pg){';
const newShowPg = 'function showPg(pg){\n  if(pg==="marketing")setTimeout(loadMarketing,100);';
if (fixed.includes(oldShowPg)) {
  fixed = fixed.replace(oldShowPg, newShowPg);
  console.log('✅ Fix 3: showPg hooks marketing load');
} else {
  console.log('⚠️  Fix 3: showPg not found');
}

// FIX 4 - Inject marketing JS as separate script block
// Using fs.writeFileSync with a separate JS file approach
// to avoid ALL escaping issues in the patch script itself

const mktJS = [
'var mktContacts={whatsapp:[],zalo:[]};',
'function loadMarketing(){',
'  sbC("/rest/v1/orders?select=customer_name,customer_phone,contact_method&order=created_at.desc")',
'  .then(function(orders){',
'    if(!orders)return;',
'    var seen={},wa=[],zl=[];',
'    orders.forEach(function(o){',
'      if(!o.customer_phone||o.order_type==="dinein")return;',
'      var ph=(o.customer_phone||"").replace(/\\s/g,"");',
'      if(seen[ph])return;',
'      seen[ph]=true;',
'      var c={name:o.customer_name||"Customer",phone:o.customer_phone,phoneClean:ph};',
'      if(o.contact_method==="zalo")zl.push(c);',
'      else wa.push(c);',
'    });',
'    mktContacts.whatsapp=wa;',
'    mktContacts.zalo=zl;',
'    renderMktList("wa",wa);',
'    renderMktList("zl",zl);',
'    var wac=document.getElementById("mkt-wa-count");',
'    var zlc=document.getElementById("mkt-zl-count");',
'    if(wac)wac.textContent=wa.length+" contacts";',
'    if(zlc)zlc.textContent=zl.length+" contacts";',
'  });',
'}',
'function renderMktList(type,contacts){',
'  var el=document.getElementById("mkt-"+type+"-list");',
'  if(!el)return;',
'  if(!contacts.length){el.innerHTML="<div style=\\"color:#9CA3AF;text-align:center;padding:20px;font-size:0.85rem;\\">No contacts yet — customers appear here after ordering</div>";return;}',
'  var h="";',
'  contacts.forEach(function(c){',
'    var platform=type==="wa"?"whatsapp":"zalo";',
'    var bg=type==="wa"?"#25D366":"linear-gradient(135deg,#0068FF,#0052CC)";',
'    var ico=type==="wa"?"💬":"🔵";',
'    h+="<div style=\\"display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;\\">";',
'    h+="<div><div style=\\"font-size:0.88rem;color:#1A1A2E;font-weight:600;\\">"+c.name+"</div>";',
'    h+="<div style=\\"font-size:0.75rem;color:#6B7280;\\">"+c.phone+"</div></div>";',
'    h+="<button onclick=\\"mktSendOne(\'"+platform+"\',\'"+c.phoneClean+"\',\'"+c.name+"\')\\" style=\\"background:"+bg+";color:white;border:none;padding:7px 14px;border-radius:6px;font-family:Jost,sans-serif;font-size:0.75rem;font-weight:700;cursor:pointer;\\">"+ico+" Send</button>";',
'    h+="</div>";',
'  });',
'  el.innerHTML=h;',
'}',
'function getMktMsg(){',
'  var m=document.getElementById("mkt-msg");',
'  if(!m||!m.value.trim()){showToast("No Message","Please write your promotion first");return null;}',
'  return m.value.trim();',
'}',
'function mktSendOne(platform,phone,name){',
'  var msg=getMktMsg();if(!msg)return;',
'  var p=phone.replace(/\\s/g,"");',
'  if(p.charAt(0)==="0")p="+84"+p.substring(1);',
'  if(p.charAt(0)!=="+")p="+84"+p;',
'  p=p.replace(/\\+/g,"");',
'  var enc=encodeURIComponent(msg);',
'  if(platform==="whatsapp")window.open("https://wa.me/"+p+"?text="+enc,"_blank");',
'  else{window.open("https://zalo.me/"+p,"_blank");showToast("Zalo Opened","Go back and paste your message in the chat");}',
'}',
'function mktSendAll(platform){',
'  var msg=getMktMsg();if(!msg)return;',
'  var contacts=platform==="whatsapp"?mktContacts.whatsapp:mktContacts.zalo;',
'  if(!contacts.length){showToast("No Contacts","No "+platform+" customers yet");return;}',
'  showToast("Opening "+contacts.length+" contacts","Tap send in each chat, then come back for the next");',
'  var first=contacts[0];',
'  var p=first.phoneClean.replace(/\\s/g,"");',
'  if(p.charAt(0)==="0")p="+84"+p.substring(1);',
'  if(p.charAt(0)!=="+")p="+84"+p;',
'  p=p.replace(/\\+/g,"");',
'  var enc=encodeURIComponent(msg);',
'  if(platform==="whatsapp")window.open("https://wa.me/"+p+"?text="+enc,"_blank");',
'  else{window.open("https://zalo.me/"+p,"_blank");try{navigator.clipboard.writeText(msg);}catch(e){}}',
'}',
'function mktPreview(){',
'  var msg=document.getElementById("mkt-msg").value;',
'  var prev=document.getElementById("mkt-preview");',
'  if(!prev)return;',
'  if(!msg.trim()){prev.style.display="none";return;}',
'  prev.textContent=msg;prev.style.display="block";',
'}',
'function mktClear(){',
'  var m=document.getElementById("mkt-msg");if(m)m.value="";',
'  var p=document.getElementById("mkt-preview");if(p)p.style.display="none";',
'  var c=document.getElementById("mkt-char-count");if(c)c.textContent="0 characters";',
'}',
'(function(){',
'  var m=document.getElementById("mkt-msg");',
'  if(!m)return;',
'  m.addEventListener("input",function(){',
'    var c=document.getElementById("mkt-char-count");',
'    if(c){var len=this.value.length;c.textContent=len+" characters";c.style.color=len>160?"#EF4444":"#9CA3AF";}',
'  });',
'})();'
].join('\n');

// Write the JS to a temp file to validate it first
fs.writeFileSync('mkt_temp.js', mktJS, 'utf8');
try {
  new Function(mktJS);
  console.log('✅ Marketing JS validates cleanly');
} catch(e) {
  console.log('❌ Marketing JS error:', e.message);
  process.exit(1);
}

// Inject as separate script block before </body>
fixed = fixed.replace('</body>', '<script>\n' + mktJS + '\n</script>\n</body>');
console.log('✅ Fix 4: Marketing JS injected');

// Clean up temp file
try { fs.unlinkSync('mkt_temp.js'); } catch(e) {}

// Full JS Validation
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
console.log('✅ All JS validated — ' + scripts.length + ' blocks');
fs.writeFileSync('admin.html', fixed, 'utf8');
console.log('✅ admin.html saved — marketing system live');
