const V='savings-v2',LOCAL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
const EXT=['https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js','https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.wasm',
'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(V);await c.addAll(LOCAL);
await Promise.allSettled(EXT.map(u=>c.add(u)));self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==V)await caches.delete(k);await clients.claim()})())});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  const ok=u.origin===location.origin||/cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(u.host);
  if(!ok)return;
  e.respondWith((async()=>{
    const c=await caches.open(V),hit=await c.match(e.request,{ignoreSearch:true});
    const net=fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque'))c.put(e.request,r.clone());return r}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    return (await net)||(e.request.mode==='navigate'?c.match('index.html'):Response.error());
  })())});
