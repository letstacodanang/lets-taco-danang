const fs = require('fs');

const html = fs.readFileSync('admin.html', 'utf8');
if (html.includes('Lam Tuyen')) { console.log('STOP'); process.exit(1); }
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// ============================================
// FULL NOTIFICATION SYSTEM
// Different chime for each event type
// Vibration patterns for mobile staff
// Works on iOS and Android
// ============================================

const notificationJS = `
// ===== LETS TACO STAFF NOTIFICATION SYSTEM =====

var _ac = null;
function getAC(){
  if(!_ac){
    try{ _ac = new(window.AudioContext||window.webkitAudioContext)(); }catch(e){}
  }
  // Resume if suspended (browser autoplay policy)
  if(_ac && _ac.state === 'suspended') _ac.resume();
  return _ac;
}

// Unlock audio on first touch (iOS requirement)
document.addEventListener('touchstart', function(){
  var ac = getAC();
  if(ac && ac.state === 'suspended') ac.resume();
}, {once: true});
document.addEventListener('click', function(){
  var ac = getAC();
  if(ac && ac.state === 'suspended') ac.resume();
}, {once: true});

function playTone(freq, start, dur, vol){
  var ac = getAC();
  if(!ac) return;
  try{
    var o = ac.createOscillator();
    var g = ac.createGain();
    o.connect(g);
    g.connect(ac.destination);
    o.frequency.value = freq;
    o.type = 'sine';
    g.gain.setValueAtTime(vol||0.3, start);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    o.start(start);
    o.stop(start + dur + 0.05);
  } catch(e){}
}

function vib(pattern){
  try{
    if(navigator.vibrate) navigator.vibrate(pattern);
  } catch(e){}
}

// NEW ORDER — 3 ascending beeps + buzz
// Staff attention: something needs action
function notifyNewOrder(){
  var ac = getAC();
  if(!ac) return;
  var t = ac.currentTime;
  playTone(440, t,       0.12, 0.4);
  playTone(550, t+0.15,  0.12, 0.4);
  playTone(660, t+0.30,  0.18, 0.5);
  vib([100, 50, 100, 50, 200]);
}

// ORDER READY — 4 happy ascending tones + long buzz
// Food is ready — staff must pick up NOW
function notifyOrderReady(){
  var ac = getAC();
  if(!ac) return;
  var t = ac.currentTime;
  playTone(523, t,       0.15, 0.5); // C5
  playTone(659, t+0.18,  0.15, 0.5); // E5
  playTone(784, t+0.36,  0.15, 0.5); // G5
  playTone(1047,t+0.54,  0.25, 0.6); // C6
  vib([200, 100, 200, 100, 400]);
}

// PAYMENT REQUESTED — 2 soft chimes + short buzz
// Customer wants to pay — go to table
function notifyPaymentRequested(){
  var ac = getAC();
  if(!ac) return;
  var t = ac.currentTime;
  playTone(800, t,      0.12, 0.35);
  playTone(1000,t+0.20, 0.20, 0.4);
  vib([150, 100, 150]);
}

// PAYMENT CONFIRMED — success jingle
// Order paid — kitchen can cook
function notifyPaymentConfirmed(){
  var ac = getAC();
  if(!ac) return;
  var t = ac.currentTime;
  playTone(523, t,       0.1, 0.3);
  playTone(784, t+0.12,  0.1, 0.3);
  playTone(1047,t+0.24,  0.2, 0.4);
  vib([100, 50, 300]);
}

// URGENT — rapid beeps for anything critical
function notifyUrgent(){
  var ac = getAC();
  if(!ac) return;
  var t = ac.currentTime;
  for(var i=0; i<4; i++){
    playTone(880, t + i*0.15, 0.1, 0.5);
  }
  vib([100,50,100,50,100,50,100]);
}

// ===== HOOK INTO EXISTING ALERT SYSTEM =====

// Override the ready alert handler to add sound+vib
var _origHandleReady = typeof handleReadyAlert !== 'undefined' ? handleReadyAlert : null;
function handleReadyAlertWithSound(){
  notifyOrderReady();
  if(_origHandleReady) _origHandleReady();
  else handleReadyAlert_orig && handleReadyAlert_orig();
}

// Override pay alert
var _origHandlePay = typeof handlePayAlert !== 'undefined' ? handlePayAlert : null;
function handlePayAlertWithSound(){
  notifyPaymentRequested();
  if(_origHandlePay) _origHandlePay();
}

// Patch checkReadyAlert to play sound when banner appears
var _lastReadyAlertVisible = false;
var _origCheckReady = typeof checkReadyAlert !== 'undefined' ? checkReadyAlert : null;

// Patch checkPayAlert to play sound when banner appears
var _lastPayAlertVisible = false;

// Monitor alerts and play sounds when they appear
setInterval(function(){
  var readyAlert = document.getElementById('ready-alert');
  var payAlert = document.getElementById('pay-alert');

  if(readyAlert){
    var isVisible = readyAlert.style.display !== 'none' && readyAlert.style.display !== '';
    if(isVisible && !_lastReadyAlertVisible){
      notifyOrderReady();
    }
    _lastReadyAlertVisible = isVisible;
  }

  if(payAlert){
    var isPayVisible = payAlert.style.display !== 'none' && payAlert.style.display !== '';
    if(isPayVisible && !_lastPayAlertVisible){
      notifyPaymentRequested();
    }
    _lastPayAlertVisible = isPayVisible;
  }
}, 1000);

// Also monitor for new orders appearing in the list
var _lastOrderCount = 0;
setInterval(function(){
  var orderCards = document.querySelectorAll('.oc');
  var count = orderCards.length;
  if(count > _lastOrderCount && _lastOrderCount > 0){
    notifyNewOrder();
  }
  _lastOrderCount = count;
}, 2000);

console.log('✅ Lets Taco notification system loaded');
`;

// Inject before closing body
fixed = fixed.replace(
  `</body>`,
  `<script>${notificationJS}</script>\n</body>`
);
console.log('✅ Fix 1: Full notification system injected');

// ============================================
// FIX 2 — UPDATE READY ALERT TO USE NEW SOUND
// The ready alert banner onclick should
// call the sound version
// ============================================

const oldReadyAlert = `onclick="handleReadyAlert()"`;
const newReadyAlert = `onclick="notifyOrderReady();handleReadyAlert()"`;

// Replace in ready alert div
const readyAlertIdx = fixed.indexOf('id="ready-alert"');
if (readyAlertIdx !== -1) {
  const readyAlertEnd = fixed.indexOf('>', readyAlertIdx) + 1;
  const readyAlertTag = fixed.substring(readyAlertIdx - 5, readyAlertEnd);
  if (readyAlertTag.includes('handleReadyAlert')) {
    // Already has handler - add sound
    const fixed2 = fixed.replace(
      `onclick="handleReadyAlert()"`,
      `onclick="notifyOrderReady();handleReadyAlert()"`
    );
    if (fixed2 !== fixed) {
      fixed = fixed2;
      console.log('✅ Fix 2a: Ready alert plays sound on tap');
    }
  }
}

// Fix pay alert
fixed = fixed.replace(
  `onclick="handlePayAlert()"`,
  `onclick="notifyPaymentRequested();handlePayAlert()"`
);
console.log('✅ Fix 2b: Pay alert plays sound on tap');

// ============================================
// FIX 3 — MARK PAID PLAYS SUCCESS SOUND
// When staff confirms payment — play success
// ============================================

const oldMarkPaidSuccess = `showToast('Payment Confirmed','Kitchen notified — cooking starts now');`;
const newMarkPaidSuccess = `showToast('Payment Confirmed','Kitchen notified — cooking starts now');
    notifyPaymentConfirmed();`;

if (fixed.includes(oldMarkPaidSuccess)) {
  fixed = fixed.replace(oldMarkPaidSuccess, newMarkPaidSuccess);
  console.log('✅ Fix 3: MARK PAID plays success sound');
} else {
  console.log('⚠️  Fix 3: markPaid success pattern not found');
}

// ============================================
// FIX 4 — ADD NOTIFICATION PERMISSION REQUEST
// Ask for browser notifications on login
// So alerts work even when screen is off
// ============================================

const oldInitApp = `function initApp(){`;
const newInitApp = `function initApp(){
  // Request notification permission for background alerts
  if('Notification' in window && Notification.permission === 'default'){
    Notification.requestPermission();
  }`;

if (fixed.includes(oldInitApp)) {
  fixed = fixed.replace(oldInitApp, newInitApp);
  console.log('✅ Fix 4: Notification permission requested on login');
} else {
  console.log('⚠️  Fix 4: initApp not found');
}

// Add browser notification for order ready
const sendBrowserNotif = `
function sendBrowserNotif(title, body, icon){
  if('Notification' in window && Notification.permission === 'granted'){
    try{
      new Notification(title, {
        body: body,
        icon: icon || 'data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'%3E%3Ctext y=\\'.9em\\' font-size=\\'90\\'%3E🌮%3C/text%3E%3C/svg%3E',
        badge: 'data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'%3E%3Ctext y=\\'.9em\\' font-size=\\'90\\'%3E🌮%3C/text%3E%3C/svg%3E',
        vibrate: [200, 100, 200]
      });
    }catch(e){}
  }
}
`;

fixed = fixed.replace(
  `</body>`,
  `<script>${sendBrowserNotif}</script>\n</body>`
);
console.log('✅ Fix 4b: Browser notification function added');

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
console.log('✅ admin.html saved — full notification system live');
