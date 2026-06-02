const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

if (html.includes('Lam Tuyen')) {
  console.log('STOP — Wrong file detected.');
  process.exit(1);
}
console.log('✅ File confirmed — Lets Taco Da Nang');

let fixed = html;

// ============================================
// FIX 1 — UPGRADE HERO SECTION
// Speaks directly to tourists, hunger-first,
// clear action, no thinking required
// ============================================

const oldHero = `<section class="hero">
  <img class="hero-img" src="https://kigqjuxxoeoeezjguuxu.supabase.co/storage/v1/object/public/photos/IMG_1779729761678_1779730053767.jpg" alt="Let's Taco Da Nang exterior at night">
  <div class="hero-bg"></div>
  <div class="hero-content">
    <p class="hero-eyebrow">Da Nang's Highest Rated Mexican Restaurant</p>
    <h1 class="hero-title"><span class="hl">LET'S</span><br><span class="gd">TACO</span></h1>
    <p class="hero-sub">Real Mexican Grill &middot; Da Nang, Vietnam</p>
    <div class="hero-rating"><span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span><span style="font-size:0.85rem">&nbsp;<strong style="color:var(--gold)">4.9</strong> &middot; 144 Google Reviews &middot; Da Nang's #1</span></div>
    <div class="hero-cta">
      <button onclick="toggleCart()" class="btn-primary" style="border:none;cursor:pointer">Order Now</button>
      <a href="#menu" class="btn-secondary">View Menu</a>
    </div>
  </div>
  <div class="hero-scroll"><div class="scroll-line"></div><span class="scroll-text">Scroll</span></div>
</section>`;

const newHero = `<section class="hero">
  <img class="hero-img" src="https://kigqjuxxoeoeezjguuxu.supabase.co/storage/v1/object/public/photos/IMG_1779729761678_1779730053767.jpg" alt="Let's Taco Da Nang — Best Mexican Restaurant in Da Nang Vietnam — Authentic Birria Tacos">
  <div class="hero-bg"></div>
  <div class="hero-content">
    <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(39,174,96,0.15);border:1px solid rgba(39,174,96,0.4);border-radius:30px;padding:6px 16px;margin-bottom:18px;opacity:0;animation:fade-up 0.8s ease 0.2s forwards;">
      <span id="hero-status-dot" style="width:8px;height:8px;border-radius:50%;background:#27AE60;display:inline-block;animation:pulse-dot 2s infinite;"></span>
      <span id="hero-status-text" style="font-size:0.7rem;letter-spacing:2px;text-transform:uppercase;color:#27AE60;">Open Now — 43 An Thuong 30</span>
    </div>
    <p class="hero-eyebrow" style="opacity:0;animation:fade-up 0.8s ease 0.3s forwards;">Da Nang's #1 Mexican Restaurant · 30+ Countries · 4.9 Stars</p>
    <h1 class="hero-title" style="opacity:0;animation:fade-up 0.8s ease 0.5s forwards;"><span class="hl">LET'S</span><br><span class="gd">TACO</span></h1>
    <p class="hero-sub" style="opacity:0;animation:fade-up 0.8s ease 0.7s forwards;">Real Birria · Grilled Steak · Al Pastor · Da Nang, Vietnam</p>
    <div class="hero-rating" style="opacity:0;animation:fade-up 0.8s ease 0.9s forwards;">
      <span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
      <span style="font-size:0.85rem;">&nbsp;<strong style="color:var(--gold)">4.9</strong> &middot; 144 Google Reviews &middot; Visitors from 30+ Countries</span>
    </div>
    <div class="hero-cta" style="opacity:0;animation:fade-up 0.8s ease 1.1s forwards;">
      <button onclick="toggleCart()" class="btn-primary" style="border:none;cursor:pointer;font-size:1rem;padding:18px 45px;letter-spacing:3px;">🌮 ORDER NOW</button>
      <a href="https://maps.google.com/?q=Lets+Taco+Da+Nang+43+An+Thuong+30" target="_blank" class="btn-secondary" style="display:inline-flex;align-items:center;gap:8px;"><span>📍</span> GET DIRECTIONS</a>
    </div>
    <p style="opacity:0;animation:fade-up 0.8s ease 1.3s forwards;font-size:0.72rem;letter-spacing:1px;color:rgba(250,240,230,0.5);margin-top:15px;">Dine In · Takeout · Delivery · Open Tue–Sun from 4PM</p>
  </div>
  <div class="hero-scroll"><div class="scroll-line"></div><span class="scroll-text">Scroll</span></div>
</section>`;

if (fixed.includes(oldHero)) {
  fixed = fixed.replace(oldHero, newHero);
  console.log('✅ Fix 1: Hero upgraded — tourist-first, hunger-first');
} else {
  console.log('⚠️  Fix 1: Hero pattern not found — check manually');
}

// ============================================
// FIX 2 — UPGRADE HERO STATUS TO SYNC WITH
// REAL OPEN/CLOSED STATUS
// ============================================

const oldCheckOpen = `function checkOpen(){const now=new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Ho_Chi_Minh"}));const day=now.getDay();const totalMins=now.getHours()*60+now.getMinutes();const isMonday=day===1;const isOpen=!isMonday&&totalMins>=960&&totalMins<1440;const dot=document.getElementById("statusDot");const txt=document.getElementById("statusText");`;

const newCheckOpen = `function checkOpen(){const now=new Date(new Date().toLocaleString("en-US",{timeZone:"Asia/Ho_Chi_Minh"}));const day=now.getDay();const totalMins=now.getHours()*60+now.getMinutes();const isMonday=day===1;const isOpen=!isMonday&&totalMins>=960&&totalMins<1440;
  // Sync hero status pill
  var hd=document.getElementById('hero-status-dot');
  var ht=document.getElementById('hero-status-text');
  if(hd&&ht){
    if(isOpen){
      hd.style.background='#27AE60';
      hd.style.animation='pulse-dot 2s infinite';
      ht.style.color='#27AE60';
      ht.textContent='Open Now \u2014 43 An Thuong 30';
      hd.parentElement.style.background='rgba(39,174,96,0.15)';
      hd.parentElement.style.borderColor='rgba(39,174,96,0.4)';
    } else {
      hd.style.background='#C0392B';
      hd.style.animation='none';
      ht.style.color='#C0392B';
      ht.textContent=isMonday?'Closed Monday \u2014 Open Tue\u2013Sun 4PM':'Opens at 4:00 PM \u2014 43 An Thuong 30';
      hd.parentElement.style.background='rgba(192,57,43,0.1)';
      hd.parentElement.style.borderColor='rgba(192,57,43,0.3)';
    }
  }
  const dot=document.getElementById("statusDot");const txt=document.getElementById("statusText");`;

if (fixed.includes(oldCheckOpen)) {
  fixed = fixed.replace(oldCheckOpen, newCheckOpen);
  console.log('✅ Fix 2: Hero status pill synced with real open/closed');
} else {
  console.log('⚠️  Fix 2: checkOpen pattern not found — hero pill will show default');
}

// ============================================
// FIX 3 — SEO META TAGS UPGRADE
// Target: Google top 10, AI referrals,
// Google Maps top 3
// ============================================

const oldTitle = `<title>Let's Taco Da Nang - Real Mexican Grill | Best Tacos in Da Nang Vietnam</title>
<meta name="description" content="Da Nang's highest-rated Mexican restaurant. Authentic birria, grilled steak, carnitas. 4.9 stars. 43 An Thuong 30. Open Tue-Sun 4PM-12AM.">`;

const newTitle = `<title>Let's Taco Da Nang — Best Mexican Restaurant in Da Nang | Authentic Birria Tacos</title>
<meta name="description" content="Da Nang's #1 Mexican restaurant. Authentic birria tacos, grilled steak, al pastor carnitas. 4.9 stars · 144 reviews · Visitors from 30+ countries. 43 An Thuong 30, Ngu Hanh Son. Open Tue–Sun 4PM–12AM. Order online for delivery, takeout or dine in.">
<meta name="keywords" content="best mexican restaurant da nang, tacos da nang, birria da nang, mexican food da nang vietnam, lets taco da nang, an thuong restaurant, ngu hanh son food, da nang expat food, da nang delivery food, authentic tacos vietnam">
<meta name="robots" content="index, follow">
<meta name="author" content="Let's Taco Da Nang">
<meta name="geo.region" content="VN-DN">
<meta name="geo.placename" content="Da Nang, Vietnam">
<meta name="geo.position" content="16.0194;108.2476">
<meta name="ICBM" content="16.0194, 108.2476">
<link rel="canonical" href="https://lets-taco-danang.vercel.app/">`;

if (fixed.includes(oldTitle)) {
  fixed = fixed.replace(oldTitle, newTitle);
  console.log('✅ Fix 3: SEO meta tags upgraded');
} else {
  console.log('⚠️  Fix 3: title pattern not found — check manually');
}

// ============================================
// FIX 4 — UPGRADE OG / SOCIAL SHARE TAGS
// So when shared on Facebook, WhatsApp,
// Line — it looks premium and clickable
// ============================================

const oldOG = `<meta property="og:title" content="Let's Taco Da Nang - Real Mexican Grill">
<meta property="og:image" content="https://kigqjuxxoeoeezjguuxu.supabase.co/storage/v1/object/public/photos/IMG_1779729761678_1779730053767.jpg">`;

const newOG = `<meta property="og:title" content="Let's Taco Da Nang — Da Nang's #1 Mexican Restaurant">
<meta property="og:description" content="Authentic birria, grilled steak & al pastor tacos. 4.9 stars · 144 reviews · Open Tue–Sun from 4PM. Order online or visit us at 43 An Thuong 30.">
<meta property="og:image" content="https://kigqjuxxoeoeezjguuxu.supabase.co/storage/v1/object/public/photos/IMG_1779729761678_1779730053767.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://lets-taco-danang.vercel.app/">
<meta property="og:type" content="restaurant">
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="vi_VN">
<meta property="og:site_name" content="Let's Taco Da Nang">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Let's Taco Da Nang — Best Mexican in Vietnam">
<meta name="twitter:description" content="Real birria tacos in Da Nang. 4.9 stars. Order online now.">
<meta name="twitter:image" content="https://kigqjuxxoeoeezjguuxu.supabase.co/storage/v1/object/public/photos/IMG_1779729761678_1779730053767.jpg">`;

if (fixed.includes(oldOG)) {
  fixed = fixed.replace(oldOG, newOG);
  console.log('✅ Fix 4: OG/social share tags upgraded');
} else {
  console.log('⚠️  Fix 4: OG pattern not found — check manually');
}

// ============================================
// FIX 5 — UPGRADE SCHEMA.ORG STRUCTURED DATA
// This is what Google Maps and AI crawlers
// read to understand the business
// ============================================

const oldSchema = `{"@context":"https://schema.org","@type":"Restaurant","name":"Let's Taco Da Nang","telephone":"+84909923941","address":{"@type":"PostalAddress","streetAddress":"43 An Thuong 30","addressLocality":"Ngu Hanh Son","addressRegion":"Da Nang","postalCode":"550000","addressCountry":"VN"},"geo":{"@type":"GeoCoordinates","latitude":16.0194,"longitude":108.2476},"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],"opens":"16:00","closes":"00:00"}],"aggregateRating":{"@type":"AggregateRating","ratingValue":"4.9","reviewCount":"144"},"servesCuisine":"Mexican","priceRange":"105000-180000 VND","image":"https://kigqjuxxoeoeezjguuxu.supabase.co/storage/v1/object/public/photos/IMG_1779729761678_1779730053767.jpg"}`;

const newSchema = `{
  "@context":"https://schema.org",
  "@type":"Restaurant",
  "@id":"https://lets-taco-danang.vercel.app/",
  "name":"Let's Taco Da Nang",
  "alternateName":["Lets Taco Da Nang","Let's Taco","Lets Taco"],
  "description":"Da Nang's highest-rated Mexican restaurant. Authentic birria tacos, grilled steak, al pastor, carnitas. Hand-pressed tortillas. Slow-cooked meats. Loved by visitors from over 30 countries.",
  "url":"https://lets-taco-danang.vercel.app/",
  "telephone":"+84909923941",
  "email":"letstacodanang@gmail.com",
  "address":{
    "@type":"PostalAddress",
    "streetAddress":"43 An Thuong 30",
    "addressLocality":"Ngu Hanh Son",
    "addressRegion":"Da Nang",
    "postalCode":"550000",
    "addressCountry":"VN"
  },
  "geo":{
    "@type":"GeoCoordinates",
    "latitude":16.0194,
    "longitude":108.2476
  },
  "hasMap":"https://maps.google.com/?q=Lets+Taco+Da+Nang",
  "openingHoursSpecification":[
    {
      "@type":"OpeningHoursSpecification",
      "dayOfWeek":["Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens":"16:00",
      "closes":"23:59"
    }
  ],
  "aggregateRating":{
    "@type":"AggregateRating",
    "ratingValue":"4.9",
    "reviewCount":"144",
    "bestRating":"5"
  },
  "servesCuisine":["Mexican","Tacos","Birria","Street Food"],
  "priceRange":"₫105,000–₫180,000",
  "currenciesAccepted":"VND",
  "paymentAccepted":"Cash, Bank Transfer",
  "image":[
    "https://kigqjuxxoeoeezjguuxu.supabase.co/storage/v1/object/public/photos/IMG_1779729761678_1779730053767.jpg",
    "https://kigqjuxxoeoeezjguuxu.supabase.co/storage/v1/object/public/photos/IMG_1779730373163_1779730420010.jpg",
    "https://kigqjuxxoeoeezjguuxu.supabase.co/storage/v1/object/public/photos/IMG_1779730373184_1779730422455.jpg"
  ],
  "menu":"https://lets-taco-danang.vercel.app/#menu",
  "hasOfferCatalog":{
    "@type":"OfferCatalog",
    "name":"Let's Taco Menu",
    "itemListElement":[
      {"@type":"Offer","itemOffered":{"@type":"MenuItem","name":"Birria Tacos","description":"Slow-cooked beef, melted cheese, crispy golden tortilla, consomme for dipping","offers":{"@type":"Offer","price":"125000","priceCurrency":"VND"}}},
      {"@type":"Offer","itemOffered":{"@type":"MenuItem","name":"Grilled Steak Tacos","description":"Marinated beef chargrilled to perfection, white onion, fresh cilantro, smoky salsa","offers":{"@type":"Offer","price":"115000","priceCurrency":"VND"}}},
      {"@type":"Offer","itemOffered":{"@type":"MenuItem","name":"Al Pastor Grilled Pork Tacos","description":"Authentic al pastor seasoning, grilled until smoky and tender","offers":{"@type":"Offer","price":"110000","priceCurrency":"VND"}}},
      {"@type":"Offer","itemOffered":{"@type":"MenuItem","name":"Grilled Chicken Tacos","description":"Mexican-spiced grilled chicken, white onion, cilantro, smoky house salsa","offers":{"@type":"Offer","price":"105000","priceCurrency":"VND"}}},
      {"@type":"Offer","itemOffered":{"@type":"MenuItem","name":"Carnitas Tacos","description":"Slow-cooked pork braised for hours, crisped on the griddle","offers":{"@type":"Offer","price":"110000","priceCurrency":"VND"}}}
    ]
  },
  "sameAs":[
    "https://www.instagram.com/letstaco43",
    "https://www.tiktok.com/@letstacodanang",
    "https://maps.google.com/?q=Lets+Taco+Da+Nang"
  ],
  "amenityFeature":[
    {"@type":"LocationFeatureSpecification","name":"Dine In","value":true},
    {"@type":"LocationFeatureSpecification","name":"Takeout","value":true},
    {"@type":"LocationFeatureSpecification","name":"Delivery","value":true},
    {"@type":"LocationFeatureSpecification","name":"Online Ordering","value":true},
    {"@type":"LocationFeatureSpecification","name":"QR Code Ordering","value":true}
  ],
  "keywords":"mexican restaurant da nang, tacos da nang, birria da nang, best tacos vietnam, mexican food hoi an nearby, an thuong food, ngu hanh son restaurant"
}`;

if (fixed.includes(oldSchema)) {
  fixed = fixed.replace(oldSchema, newSchema);
  console.log('✅ Fix 5: Schema.org structured data upgraded for Google Maps + AI');
} else {
  console.log('⚠️  Fix 5: Schema pattern not found — check manually');
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
fs.writeFileSync('index.html', fixed, 'utf8');
console.log('✅ index.html saved — hero upgraded + full SEO layer added');
