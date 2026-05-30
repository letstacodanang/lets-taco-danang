var CACHE = 'letstaco-v2';
var ASSETS = ['/', '/index.html', '/manifest.json'];
self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(cache) {
    return Promise.allSettled(ASSETS.map(function(url) { return cache.add(url); }));
  }));
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function(e) {
  if(e.request.method!=='GET')return;
  if(e.request.url.includes('supabase.co'))return;
  if(e.request.url.includes('ipapi.co'))return;
  e.respondWith(fetch(e.request).then(function(res){
    var clone=res.clone();
    caches.open(CACHE).then(function(cache){cache.put(e.request,clone);});
    return res;
  }).catch(function(){
    return caches.match(e.request).then(function(cached){
      if(cached)return cached;
      if(e.request.mode==='navigate')return caches.match('/');
    });
  }));
});
