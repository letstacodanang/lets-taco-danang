const fs = require('fs');

const html = fs.readFileSync('admin.html', 'utf8');
if (html.includes('Lam Tuyen')) { console.log('STOP'); process.exit(1); }
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// ============================================
// FIX 1 — ADD MARKETING PAGE TO SIDEBAR NAV
// Owner only — between Revenue and Menu
// ============================================

const oldMenuNav = `<div class="ni" data-pg="menu"><span class="ni-ic">🌮</span><span class="sb-label">Menu</span></div>`;
const newMenuNav = `<div class="ni owner-only" data-pg="marketing"><span class="ni-ic">📣</span><span class="sb-label">Marketing</span></div>
      <div class="ni" data-pg="menu"><span class="ni-ic">🌮</span><span class="sb-label">Menu</span></div>`;

if (fixed.includes(oldMenuNav)) {
  fixed = fixed.replace(oldMenuNav, newMenuNav);
  console.log('✅ Fix 1: Marketing nav item added');
} else {
  console.log('⚠️  Fix 1: menu nav pattern not found');
}

// ============================================
// FIX 2 — ADD MARKETING PAGE HTML
// Insert before pg-menu
// ============================================

const oldMenuPage = `<div class="pg" id="pg-menu">`;
const newMenuPage = `<div class="pg owner-only" id="pg-marketing">
      <div style="max-width:800px;">

        <!-- Page Header -->
        <div style="margin-bottom:24px;">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:1.6rem;color:#1A1A2E;letter-spacing:3px;margin-bottom:4px;">📣 MARKETING BROADCASTS</div>
          <div style="font-size:0.82rem;color:#6B7280;">Send promotions and deals directly to your customers via WhatsApp or Zalo.</div>
        </div>

        <!-- Message Composer -->
        <div style="background:white;border-radius:12px;border:1px solid #E5E7EB;padding:24px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:1.1rem;color:#1A1A2E;letter-spacing:2px;margin-bottom:16px;">✍️ COMPOSE YOUR MESSAGE</div>
          <textarea id="mkt-msg" placeholder="Type your promotion here...&#10;&#10;Example:&#10;🌮 Special deal today only!&#10;2x Birria Tacos for ₫200k&#10;Show this message when you arrive.&#10;Valid today only — Let's Taco 43 An Thuong 30 🔥" style="width:100%;min-height:140px;background:#F9FAFB;border:1.5px solid #E5E7EB;color:#1A1A2E;padding:14px;border-radius:8px;font-family:'Jost',sans-serif;font-size:0.9rem;outline:none;resize:vertical;line-height:1.6;transition:border-color 0.2s;" onfocus="this.style.borderColor='#D4A017'" onblur="this.style.borderColor='#E5E7EB'"></textarea>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
            <div style="font-size:0.72rem;color:#9CA3AF;" id="mkt-char-count">0 characters</div>
            <div style="display:flex;gap:8px;">
              <button onclick="mktPreview()" style="background:white;border:1.5px solid #D4A017;color:#D4A017;padding:9px 18px;border-radius:6px;font-family:'Jost',sans-serif;font-size:0.82rem;font-weight:700;cursor:pointer;letter-spacing:1px;">👁️ Preview</button>
              <button onclick="mktClear()" style="background:white;border:1.5px solid #E5E7EB;color:#6B7280;padding:9px 18px;border-radius:6px;font-family:'Jost',sans-serif;font-size:0.82rem;cursor:pointer;">Clear</button>
            </div>
          </div>
          <div id="mkt-preview" style="display:none;background:#F0FDF4;border:1px solid #6EE7B7;border-radius:8px;padding:14px;margin-top:12px;font-size:0.88rem;color:#1A1A2E;line-height:1.7;white-space:pre-wrap;"></div>
        </div>

        <!-- WhatsApp Contacts -->
        <div style="background:white;border-radius:12px;border:1px solid #E5E7EB;padding:24px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
            <div>
              <div style="font-family:'Bebas Neue',sans-serif;font-size:1.1rem;color:#1A1A2E;letter-spacing:2px;">💬 WHATSAPP CONTACTS</div>
              <div style="font-size:0.72rem;color:#6B7280;margin-top:2px;" id="mkt-wa-count">Loading...</div>
            </div>
            <button onclick="mktSendAll('whatsapp')" style="background:#25D366;color:white;border:none;padding:11px 20px;border-radius:8px;font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:2px;cursor:pointer;display:flex;align-items:center;gap:8px;"><span>💬</span> SEND TO ALL</button>
          </div>
          <div id="mkt-wa-list" style="display:flex;flex-direction:column;gap:8px;max-height:300px;overflow-y:auto;">
            <div style="color:#9CA3AF;text-align:center;padding:20px;font-size:0.85rem;">Loading contacts...</div>
          </div>
        </div>

        <!-- Zalo Contacts -->
        <div style="background:white;border-radius:12px;border:1px solid #E5E7EB;padding:24px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
            <div>
              <div style="font-family:'Bebas Neue',sans-serif;font-size:1.1rem;color:#1A1A2E;letter-spacing:2px;">🔵 ZALO CONTACTS</div>
              <div style="font-size:0.72rem;color:#6B7280;margin-top:2px;" id="mkt-zl-count">Loading...</div>
            </div>
            <button onclick="mktSendAll('zalo')" style="background:linear-gradient(135deg,#0068FF,#0052CC);color:white;border:none;padding:11px 20px;border-radius:8px;font-family:'Bebas Neue',sans-serif;font-size:1rem;letter-spacing:2px;cursor:pointer;display:flex;align-items:center;gap:8px;"><span>🔵</span> SEND TO ALL</button>
          </div>
          <div id="mkt-zl-list" style="display:flex;flex-direction:column;gap:8px;max-height:300px;overflow-y:auto;">
            <div style="color:#9CA3AF;text-align:center;padding:20px;font-size:0.85rem;">Loading contacts...</div>
          </div>
        </div>

        <!-- Instructions -->
        <div style="background:#FFFBEB;border:1px solid #FCD34D;border-radius:10px;padding:16px;">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:0.9rem;color:#D97706;letter-spacing:2px;margin-bottom:8px;">💡 HOW IT WORKS</div>
          <div style="font-size:0.8rem;color:#6B7280;line-height:1.8;">
            1. Write your message above<br>
            2. Tap SEND TO ALL for WhatsApp or Zalo<br>
            3. Each customer opens one by one — tap Send in WhatsApp/Zalo<br>
            4. Go back to admin and tap the next customer<br>
            <strong style="color:#D97706;">Tip: Keep messages short and exciting — best results under 160 characters</strong>
          </div>
        </div>

      </div>
    </div>

    <div class="pg" id="pg-menu">`;

if (fixed.includes(oldMenuPage)) {
  fixed = fixed.replace(oldMenuPage, newMenuPage);
  console.log('✅ Fix 2: Marketing page HTML added');
} else {
  console.log('⚠️  Fix 2: menu page pattern not found');
}

// ============================================
// FIX 3 — ADD MARKETING JS
// Load contacts from orders table
// Split by contact_method (whatsapp/zalo)
// Build send links
// ============================================

const marketingJS = `
// ===== MARKETING BROADCAST SYSTEM =====

var mktContacts = {whatsapp:[], zalo:[]};

function loadMarketing(){
  // Load all unique customers with phone numbers from orders
  sbC('/rest/v1/orders?select=customer_name,customer_phone,contact_method&order=created_at.desc')
  .then(function(orders){
    if(!orders) return;

    // Deduplicate by phone number
    var seen = {};
    var wa = [], zl = [];

    orders.forEach(function(o){
      if(!o.customer_phone || o.order_type === 'dinein') return;
      var phone = (o.customer_phone||'').replace(/\\s/g,'').replace(/^0/,'+84');
      if(seen[phone]) return;
      seen[phone] = true;

      var contact = {
        name: o.customer_name || 'Customer',
        phone: o.customer_phone,
        phoneClean: phone
      };

      if(o.contact_method === 'zalo'){
        zl.push(contact);
      } else {
        wa.push(contact);
      }
    });

    mktContacts.whatsapp = wa;
    mktContacts.zalo = zl;

    renderMktList('wa', wa);
    renderMktList('zl', zl);

    var wac = document.getElementById('mkt-wa-count');
    var zlc = document.getElementById('mkt-zl-count');
    if(wac) wac.textContent = wa.length + ' contacts';
    if(zlc) zlc.textContent = zl.length + ' contacts';
  });
}

function renderMktList(type, contacts){
  var el = document.getElementById('mkt-'+type+'-list');
  if(!el) return;

  if(!contacts.length){
    el.innerHTML = '<div style="color:#9CA3AF;text-align:center;padding:20px;font-size:0.85rem;">No contacts yet — customers will appear here after ordering</div>';
    return;
  }

  var h = '';
  contacts.forEach(function(c, i){
    var platform = type === 'wa' ? 'whatsapp' : 'zalo';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;">';
    h += '<div>';
    h += '<div style="font-size:0.88rem;color:#1A1A2E;font-weight:600;">'+c.name+'</div>';
    h += '<div style="font-size:0.75rem;color:#6B7280;">'+c.phone+'</div>';
    h += '</div>';
    h += '<button onclick="mktSendOne(\''+platform+'\',\''+c.phoneClean+'\',\''+c.name+'\')" ';
    h += 'style="background:'+(type==='wa'?'#25D366':'linear-gradient(135deg,#0068FF,#0052CC)')+';color:white;border:none;padding:7px 14px;border-radius:6px;font-family:Jost,sans-serif;font-size:0.75rem;font-weight:700;cursor:pointer;white-space:nowrap;">';
    h += (type==='wa'?'💬':'🔵')+' Send</button>';
    h += '</div>';
  });
  el.innerHTML = h;
}

function getMktMessage(){
  var msg = document.getElementById('mkt-msg');
  if(!msg || !msg.value.trim()){
    showToast('No Message','Please write your promotion message first');
    return null;
  }
  return msg.value.trim();
}

function mktSendOne(platform, phone, name){
  var msg = getMktMessage();
  if(!msg) return;

  // Clean phone — ensure starts with country code
  var cleanPhone = phone.replace(/\\s/g,'');
  if(cleanPhone.startsWith('0')) cleanPhone = '+84' + cleanPhone.substring(1);
  if(!cleanPhone.startsWith('+')) cleanPhone = '+84' + cleanPhone;
  cleanPhone = cleanPhone.replace(/\\+/g,'');

  var encodedMsg = encodeURIComponent(msg);

  if(platform === 'whatsapp'){
    window.open('https://wa.me/'+cleanPhone+'?text='+encodedMsg, '_blank');
  } else {
    window.open('https://zalo.me/'+cleanPhone, '_blank');
    // Zalo doesnt support deep link message — just open profile
    showToast('Zalo Opened','Message is copied — paste it in Zalo chat');
    try{ navigator.clipboard.writeText(msg); }catch(e){}
  }
}

function mktSendAll(platform){
  var msg = getMktMessage();
  if(!msg) return;

  var contacts = platform === 'whatsapp' ? mktContacts.whatsapp : mktContacts.zalo;

  if(!contacts.length){
    showToast('No Contacts','No '+platform+' customers found yet');
    return;
  }

  // Confirm before sending
  var confirmed = confirm('Send to all '+contacts.length+' '+platform+' contacts?\\n\\nMessage:\\n'+msg.substring(0,100)+(msg.length>100?'...':''));
  if(!confirmed) return;

  // Open first contact — owner taps send, then comes back for next
  var first = contacts[0];
  var cleanPhone = first.phoneClean.replace(/\\s/g,'').replace(/^0/,'+84').replace(/\\+/g,'');
  var encodedMsg = encodeURIComponent(msg);

  if(platform === 'whatsapp'){
    window.open('https://wa.me/'+cleanPhone+'?text='+encodedMsg, '_blank');
    showToast('Sending 1/'+contacts.length,'After sending, come back and tap each contact individually');
  } else {
    window.open('https://zalo.me/'+cleanPhone, '_blank');
    try{ navigator.clipboard.writeText(msg); }catch(e){}
    showToast('Zalo: 1/'+contacts.length,'Message copied — paste in Zalo, then do next contact');
  }
}

function mktPreview(){
  var msg = document.getElementById('mkt-msg').value;
  var preview = document.getElementById('mkt-preview');
  if(!preview) return;
  if(!msg.trim()){
    preview.style.display='none';
    return;
  }
  preview.textContent = msg;
  preview.style.display='block';
}

function mktClear(){
  var msg = document.getElementById('mkt-msg');
  if(msg) msg.value='';
  var preview = document.getElementById('mkt-preview');
  if(preview) preview.style.display='none';
  var count = document.getElementById('mkt-char-count');
  if(count) count.textContent='0 characters';
}

// Character counter
document.addEventListener('DOMContentLoaded',function(){
  var msg = document.getElementById('mkt-msg');
  if(msg){
    msg.addEventListener('input',function(){
      var count = document.getElementById('mkt-char-count');
      if(count){
        var len = this.value.length;
        count.textContent = len+' characters';
        count.style.color = len > 160 ? '#EF4444' : '#9CA3AF';
      }
    });
  }
});
`;

// Inject before closing body
fixed = fixed.replace(
  `</body>`,
  `<script>${marketingJS}</script>\n</body>`
);
console.log('✅ Fix 3: Marketing JS system added');

// ============================================
// FIX 4 — LOAD MARKETING DATA WHEN PAGE SHOWN
// Hook into showPg to load contacts
// ============================================

const oldShowPg = `function showPg(pg){
  document.querySelectorAll('.pg').forEach(function(p){p.classList.remove('active');});`;

const newShowPg = `function showPg(pg){
  document.querySelectorAll('.pg').forEach(function(p){p.classList.remove('active');});
  // Load marketing contacts when page opens
  if(pg==='marketing') setTimeout(loadMarketing, 100);`;

if (fixed.includes(oldShowPg)) {
  fixed = fixed.replace(oldShowPg, newShowPg);
  console.log('✅ Fix 4: Marketing loads when page opened');
} else {
  console.log('⚠️  Fix 4: showPg pattern not found');
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
console.log('✅ admin.html saved — marketing broadcast system live');
