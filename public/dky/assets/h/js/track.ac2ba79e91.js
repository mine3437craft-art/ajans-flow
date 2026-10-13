(function(){
'use strict';
var w=window,d=document;
var C=w.DKY_CONFIG||{};
var T=C.tracking||{};
var DKY=(w.DKY=w.DKY||{});
if(DKY.__trackReady)return;
DKY.__trackReady=true;
var CONSENT_KEY='dky_consent_v1';
var CONSENT_TTL=365*24*3600*1000;
var PENDING_KEY='dky_lead_pending';
var DEBUG_KEY='dky_debug';
function store(kind){try{var s=w[kind];var k='__dky';s.setItem(k,'1');s.removeItem(k);return s;}catch(e){return null;}}
var LS=store('localStorage'),SS=store('sessionStorage');
try{
var qd=new URLSearchParams(location.search).get('dky_debug');
if(qd==='1'&&SS)SS.setItem(DEBUG_KEY,'1');
if(qd==='0'&&SS)SS.removeItem(DEBUG_KEY);
}catch(e){}
function debugOn(){return!!((w.DKY_CONFIG&&w.DKY_CONFIG.debug)||(SS&&SS.getItem(DEBUG_KEY)==='1'));}
function log(){
if(!debugOn()||!w.console)return;
console.log.apply(console,['%c[DKY ölçüm]','color:#c8102e;font-weight:700'].concat([].slice.call(arguments)));
}
function warn(msg){if(debugOn()&&w.console)console.warn('[DKY ölçüm] '+msg);}
function uid(){
try{if(w.crypto&&crypto.randomUUID)return crypto.randomUUID();}catch(e){}
return'e'+Date.now().toString(36)+Math.random().toString(36).slice(2,10);
}
function loadScript(src){
var s=d.createElement('script');
s.async=true;
s.src=src;
(d.head||d.documentElement).appendChild(s);
return s;
}
var ID={
ga4:/^G-[A-Z0-9]{4,}$/i,
googleAds:/^AW-\d{6,}$/i,
metaPixel:/^\d{8,20}$/,
tiktokPixel:/^[A-Z0-9]{10,32}$/i,
clarity:/^[a-z0-9]{6,20}$/i
};
function idOf(key){
var v=String(T[key]||'').trim();
if(!v)return'';
if(!ID[key].test(v)){warn(key+' kimliği geçersiz biçimde, yüklenmedi: '+v);return'';}
return v;
}
var GA4=idOf('ga4'),AW=idOf('googleAds'),META=idOf('metaPixel'),TT=idOf('tiktokPixel'),CLARITY=idOf('clarity');
var LABELS=T.adsLabels||{};
w.dataLayer=w.dataLayer||[];
if(typeof w.gtag!=='function')w.gtag=function(){w.dataLayer.push(arguments);};
function gtag(){w.gtag.apply(w,arguments);}
function gConsent(s){
var a=s&&s.analytics?'granted':'denied';
var m=s&&s.ads?'granted':'denied';
return{analytics_storage:a,ad_storage:m,ad_user_data:m,ad_personalization:m};
}
var dflt=gConsent(null);
dflt.functionality_storage='granted';
dflt.security_storage='granted';
dflt.wait_for_update=500;
gtag('consent','default',dflt);
gtag('set','ads_data_redaction',true);
gtag('set','url_passthrough',true);
function readConsent(){
if(!LS)return null;
try{
var s=JSON.parse(LS.getItem(CONSENT_KEY)||'null');
if(!s||typeof s!=='object'||Date.now()-(s.ts||0)>CONSENT_TTL)return null;
return{analytics:!!s.analytics,ads:!!s.ads,ts:s.ts};
}catch(e){return null;}
}
var state=readConsent();
if(state)gtag('consent','update',gConsent(state));
var ADVANCED=String(C.consentMode||'').toLowerCase()==='advanced';
var googleLoaded=false,gaOn=false,awOn=false;
function loadGoogle(s){
if(!GA4&&!AW)return;
var wantGA=!!GA4&&(ADVANCED||!!(s&&s.analytics));
var wantAW=!!AW&&(ADVANCED||!!(s&&s.ads));
if(!wantGA&&!wantAW)return;
if(!googleLoaded){
googleLoaded=true;
loadScript('https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(wantGA?GA4:AW));
gtag('js',new Date());
}
if(wantGA&&!gaOn){gaOn=true;gtag('config',GA4);}
if(wantAW&&!awOn){awOn=true;gtag('config',AW,{allow_enhanced_conversions:true});}
}
loadGoogle(state);
var loaded={meta:false,tiktok:false,clarity:false};
function loadMeta(){
if(loaded.meta||!META)return;
loaded.meta=true;
if(!w.fbq){
var n=w.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments);};
if(!w._fbq)w._fbq=n;
n.push=n;n.loaded=true;n.version='2.0';n.queue=[];
loadScript('https://connect.facebook.net/en_US/fbevents.js');
}
w.fbq('consent','grant');
w.fbq('init',META);
w.fbq('track','PageView');
}
function loadTikTok(){
if(loaded.tiktok||!TT)return;
loaded.tiktok=true;
w.TiktokAnalyticsObject='ttq';
var ttq=(w.ttq=w.ttq||[]);
ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie','holdConsent','revokeConsent','grantConsent'];
ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat([].slice.call(arguments,0)));};};
for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
ttq.instance=function(t){for(var e=ttq._i[t]||[],k=0;k<ttq.methods.length;k++)ttq.setAndDefer(e,ttq.methods[k]);return e;};
ttq.load=function(e,o){
var r='https://analytics.tiktok.com/i18n/pixel/events.js';
ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;ttq._t=ttq._t||{};ttq._t[e]=+new Date();ttq._o=ttq._o||{};ttq._o[e]=o||{};
loadScript(r+'?sdkid='+encodeURIComponent(e)+'&lib=ttq');
};
ttq.load(TT);
ttq.grantConsent();
ttq.page();
}
function loadClarity(){
if(loaded.clarity||!CLARITY)return;
loaded.clarity=true;
w.clarity=w.clarity||function(){(w.clarity.q=w.clarity.q||[]).push(arguments);};
loadScript('https://www.clarity.ms/tag/'+encodeURIComponent(CLARITY));
w.clarity('consent');
}
function clearCookies(prefixes){
var host=location.hostname,parts=host.split('.');
var domains=['',host,'.'+host];
if(parts.length>2)domains.push('.'+parts.slice(-2).join('.'));
d.cookie.split(';').forEach(function(c){
var name=c.split('=')[0].trim();
if(!name||!prefixes.some(function(p){return name.indexOf(p)===0;}))return;
domains.forEach(function(dm){d.cookie=name+'=; Max-Age=0; path=/'+(dm?'; domain='+dm:'');});
});
}
function applyConsent(s,prev){
gtag('consent','update',gConsent(s));
loadGoogle(s);
if(s.ads){loadMeta();loadTikTok();}
if(s.analytics)loadClarity();
if(prev&&prev.ads&&!s.ads){
if(w.fbq)w.fbq('consent','revoke');
if(w.ttq&&w.ttq.revokeConsent)w.ttq.revokeConsent();
clearCookies(['_gcl','_fbp','_fbc','_ttp','_tt_']);
}
if(prev&&prev.analytics&&!s.analytics){
if(w.clarity)w.clarity('consent',false);
clearCookies(['_ga','_gid','_clck','_clsk']);
}
}
if(state)applyConsent(state,null);
function saveConsent(next){
var prev=state;
state={analytics:!!(next&&next.analytics),ads:!!(next&&next.ads),ts:Date.now()};
if(LS){try{LS.setItem(CONSENT_KEY,JSON.stringify({v:1,analytics:state.analytics,ads:state.ads,ts:state.ts}));}catch(e){}}
applyConsent(state,prev);
w.dataLayer.push({event:'consent_update',consent_analytics:state.analytics?'granted':'denied',consent_ads:state.ads?'granted':'denied'});
log('onay kaydedildi',{analytics:state.analytics,ads:state.ads});
try{d.dispatchEvent(new CustomEvent('dky:consent',{detail:{analytics:state.analytics,ads:state.ads}}));}catch(e){}
hideBand();
}
var band=null,chkA=null,chkM=null,lastFocus=null;
function setupBand(){
band=d.getElementById('consent')||d.querySelector('[data-consent-band]');
if(!band||band.__dky)return;
band.__dky=true;
var more=d.createElement('details');
more.className='consent__more';
more.innerHTML=
'<summary>Tercihleri özelleştir</summary>'+
'<div class="consent__opts">'+
'<label class="check"><input type="checkbox" checked disabled><span><strong>Zorunlu</strong> — sitenin çalışması için gerekli (teklif listesi, çerez tercihiniz). Her zaman açık.</span></label>'+
'<label class="check"><input type="checkbox" data-consent-cat="analytics"><span><strong>Analitik</strong> — ziyaret istatistikleri ve sayfa deneyimi ölçümü (ör. Google Analytics, Microsoft Clarity).</span></label>'+
'<label class="check"><input type="checkbox" data-consent-cat="ads"><span><strong>Pazarlama</strong> — reklam dönüşüm ölçümü ve kişiselleştirilmiş reklam (ör. Google Ads, Meta, TikTok).</span></label>'+
'<button class="btn btn--ghost btn--sm" type="button" data-consent="custom">Seçimi kaydet</button>'+
'</div>';
var actions=band.querySelector('.consent__actions');
if(actions&&actions.parentNode===band)band.insertBefore(more,actions.nextSibling);
else band.appendChild(more);
chkA=more.querySelector('[data-consent-cat="analytics"]');
chkM=more.querySelector('[data-consent-cat="ads"]');
if(!d.getElementById('dky-consent-css')){
var st=d.createElement('style');
st.id='dky-consent-css';
st.textContent=
'.consent__more summary{cursor:pointer;font-size:.875rem;font-weight:600;color:var(--fg-2,inherit);text-decoration:underline;text-underline-offset:3px;list-style:none;min-height:32px;display:inline-flex;align-items:center}'+
'.consent__more summary::-webkit-details-marker{display:none}'+
'.consent__opts{display:grid;gap:10px;margin-top:10px}'+
'.consent__opts .check{font-size:.82rem;line-height:1.45}'+
'.consent__opts .btn{justify-self:start}'+
'@media (max-width:860px){.consent:not(.is-prefs) .consent__more{display:none}}';
d.head.appendChild(st);
}
band.addEventListener('click',function(e){
var b=e.target.closest('[data-consent]');
if(!b)return;
var v=b.getAttribute('data-consent');
if(v==='all')saveConsent({analytics:true,ads:true});
else if(v==='essential'||v==='none')saveConsent({analytics:false,ads:false});
else if(v==='custom')saveConsent({analytics:chkA&&chkA.checked,ads:chkM&&chkM.checked});
else if(v==='analytics')saveConsent({analytics:true,ads:false});
});
if(!state)showBand(false);
}
function showBand(focus){
if(!band)setupBand();
if(!band)return;
if(chkA)chkA.checked=!!(state&&state.analytics);
if(chkM)chkM.checked=!!(state&&state.ads);
band.hidden=false;
band.classList.add('is-on');
band.classList.toggle('is-prefs',!!focus);
band.removeAttribute('aria-hidden');
d.documentElement.classList.add('consent-open');
if(focus){
lastFocus=d.activeElement;
var f=band.querySelector('[data-consent="all"]')||band.querySelector('button');
if(f)setTimeout(function(){f.focus();},30);
}
}
function hideBand(){
if(!band)return;
band.classList.remove('is-on','is-prefs');
band.setAttribute('aria-hidden','true');
d.documentElement.classList.remove('consent-open');
if(lastFocus&&lastFocus.focus){try{lastFocus.focus();}catch(e){}}
lastFocus=null;
}
d.addEventListener('click',function(e){
var t=e.target.closest&&e.target.closest('[data-consent-open]');
if(!t)return;
e.preventDefault();
showBand(true);
var more=band&&band.querySelector('.consent__more');
if(more)more.open=true;
});
d.addEventListener('keydown',function(e){
if(e.key==='Escape'&&state&&band&&band.classList.contains('is-on'))hideBand();
});
DKY.consent={
get:function(){return state?{analytics:state.analytics,ads:state.ads}:null;},
set:saveConsent,
open:function(){showBand(true);}
};
var META_MAP={generate_lead:'Lead',whatsapp_click:'Contact',phone_click:'Contact',view_item:'ViewContent',search:'Search',add_to_quote:'AddToWishlist',store_click:'InitiateCheckout'};
var TIKTOK_MAP={generate_lead:'SubmitForm',whatsapp_click:'Contact',phone_click:'Contact',view_item:'ViewContent',search:'Search',add_to_quote:'AddToWishlist',store_click:'InitiateCheckout'};
var ADS_MAP={generate_lead:'lead',whatsapp_click:'whatsapp',phone_click:'phone'};
var LOCK_MS={whatsapp_click:2500,phone_click:2500,generate_lead:4000,store_click:1500};
var ATTR_EVENTS={generate_lead:1,whatsapp_click:1,phone_click:1,store_click:1};
var locks={};
function attribution(){
var a=null;
try{a=typeof DKY.attribution==='function'?DKY.attribution():JSON.parse((LS&&LS.getItem('dky_attr'))||'null');}catch(e){a=null;}
var out={};
if(!a)return out;
['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','fbclid'].forEach(function(k){
if(a[k])out['attr_'+k.replace('utm_','')]=String(a[k]).slice(0,100);
});
if(a.landing)out.attr_landing=String(a.landing).slice(0,100);
return out;
}
DKY.attributionParams=attribution;
function clean(obj){
var o={};
Object.keys(obj||{}).forEach(function(k){
var v=obj[k];
if(v===undefined||v===null||v===''||k.charAt(0)==='_'||typeof v==='function')return;
if(typeof v==='string')v=v.slice(0,100);
o[String(k).slice(0,40)]=v;
});
return o;
}
function num(v){var n=Number(v);return isFinite(n)&&n>0?Math.round(n*100)/100:0;}
function gaItems(p){
if(Array.isArray(p.items))return p.items;
if(!p.item_id&&!p.item_name)return null;
var it={item_id:String(p.item_id||''),item_name:String(p.item_name||'').slice(0,100)};
if(p.item_brand)it.item_brand=p.item_brand;
if(p.item_category)it.item_category=p.item_category;
if(num(p.price))it.price=num(p.price);
if(p.quantity)it.quantity=Number(p.quantity)||1;
return[it];
}
function metaParams(name,p){
var m={};
var label=p.item_name||p.form||p.label||p.content_name;
if(label)m.content_name=String(label).slice(0,100);
if(p.item_id){m.content_ids=[String(p.item_id)];m.content_type='product';}
if(p.method)m.content_category=String(p.method);
if(name==='search'&&p.search_term)m.search_string=String(p.search_term).slice(0,100);
if(num(p.value)){m.value=num(p.value);m.currency=p.currency||'TRY';}
return m;
}
function track(name,params){
name=String(name||'').trim().toLowerCase().replace(/[^a-z0-9_]/g,'_').slice(0,40);
if(!name)return Promise.resolve(false);
var p={},src=params||{};
for(var k in src)if(Object.prototype.hasOwnProperty.call(src,k))p[k]=src[k];
var lock=LOCK_MS[name];
if(lock){
var now=Date.now();
if(locks[name]&&now-locks[name]<lock){log('tekrar engellendi (kilit)',name,clean(p));return Promise.resolve(false);}
locks[name]=now;
}
var eventId=p.event_id||uid();
p.event_id=eventId;
if(!p.page)p.page=location.pathname;
if(ATTR_EVENTS[name]){
var at=attribution();
for(var ak in at)if(!(ak in p))p[ak]=at[ak];
}
var userData=p._user||null;
var value=num(p.value);
var sent=[],waits=[];
function waitFor(register){waits.push(new Promise(function(res){register(res);}));}
var dl={event:name},cp=clean(p);
for(var dk in cp)dl[dk]=cp[dk];
w.dataLayer.push(dl);
sent.push('dataLayer');
if(googleLoaded){
if(userData&&state&&state.ads){gtag('set','user_data',userData);sent.push('user_data');}
if(GA4&&gaOn){
var gp=clean(p);
var items=gaItems(p);
if(items)gp.items=items;
if(value){gp.value=value;gp.currency=p.currency||'TRY';}
gp.send_to=GA4;
waitFor(function(res){gp.event_callback=res;gp.event_timeout=1500;});
gtag('event',name,gp);
sent.push('GA4');
}
var labelKey=ADS_MAP[name];
var label=labelKey?String(LABELS[labelKey]||'').trim():'';
if(AW&&awOn&&label){
var cv={send_to:AW+'/'+label,transaction_id:eventId};
if(value){cv.value=value;cv.currency=p.currency||'TRY';}
waitFor(function(res){cv.event_callback=res;cv.event_timeout=1500;});
gtag('event','conversion',cv);
sent.push('Google Ads:'+labelKey);
}
}
if(loaded.meta&&w.fbq){
var mName=META_MAP[name],mp=metaParams(name,p);
if(mName)w.fbq('track',mName,mp,{eventID:eventId});
else w.fbq('trackCustom',name,mp,{eventID:eventId});
sent.push('Meta:'+(mName||name));
}
if(loaded.tiktok&&w.ttq&&TIKTOK_MAP[name]){
var tp={};
if(p.item_id){tp.content_id=String(p.item_id);tp.content_type='product';}
if(p.item_name||p.form)tp.content_name=String(p.item_name||p.form).slice(0,100);
if(value){tp.value=value;tp.currency=p.currency||'TRY';}
if(name==='search'&&p.search_term)tp.query=String(p.search_term).slice(0,100);
w.ttq.track(TIKTOK_MAP[name],tp,{event_id:eventId});
sent.push('TikTok:'+TIKTOK_MAP[name]);
}
if(loaded.clarity&&w.clarity&&(ADS_MAP[name]||name==='form_start'||name==='store_click')){
w.clarity('event',name);
sent.push('Clarity');
}
log(name,cp,'→ '+sent.join(', ')+(state?'':(ADVANCED?'  (onay yok: Google çerezsiz modda, Meta/TikTok/Clarity kapalı)':'  (onay yok: hiçbir etiket yüklü değil; olay yalnızca dataLayer\'da)')));
if(!waits.length)return Promise.resolve(true);
var timeout=new Promise(function(res){setTimeout(res,800);});
return Promise.race([Promise.all(waits),timeout]).then(function(){return true;});
}
DKY.setUserData=function(u){
if(!awOn||!state||!state.ads||!u)return false;
var o={};
if(u.email)o.email=String(u.email).trim().toLowerCase();
if(u.phone)o.phone_number=String(u.phone).replace(/[^\d+]/g,'');
if(u.sha256_email_address)o.sha256_email_address=u.sha256_email_address;
if(u.sha256_phone_number)o.sha256_phone_number=u.sha256_phone_number;
if(!Object.keys(o).length)return false;
gtag('set','user_data',o);
return true;
};
var queued=Array.isArray(DKY._q)?DKY._q.splice(0):[];
DKY.track=track;
DKY._q={push:function(a){if(a)track(a[0],a[1]);return 0;}};
queued.forEach(function(a){track(a[0],a[1]);});
var storeHost='';
try{storeHost=C.storeUrl?new URL(C.storeUrl).host:'';}catch(e){}
d.addEventListener('click',function(e){
var a=e.target.closest&&e.target.closest('a[href]');
if(!a||a.closest('[data-track]'))return;
var href=a.getAttribute('href')||'';
if(/^tel:/i.test(href))track('phone_click',{label:'auto',link_url:href});
else if(/wa\.me\/|api\.whatsapp\.com|^whatsapp:/i.test(href))track('whatsapp_click',{label:'auto'});
else if(storeHost&&storeHost!==location.host&&a.host===storeHost)track('store_click',{label:'auto',link_url:a.href});
},true);
function consumePendingLead(){
if(!SS)return;
var t=null;
try{t=JSON.parse(SS.getItem(PENDING_KEY)||'null');}catch(e){}
if(!t)return;
SS.removeItem(PENDING_KEY);
if(!t.ts||Date.now()-t.ts>30*60*1000){log('bekleyen lead zaman aşımına uğradı, sayılmadı');return;}
var p={form:t.form,method:t.method,event_id:t.id};
if(t.vehicle)p.vehicle=t.vehicle;
if(t.value){p.value=t.value;p.currency='TRY';}
if(t.attr)for(var k in t.attr)p[k]=t.attr[k];
if(t.user)p._user=t.user;
track('generate_lead',p);
}
var started=false;
function init(){
if(started)return;
started=true;
setupBand();
consumePendingLead();
}
if(d.readyState==='complete')setTimeout(init,0);
else{d.addEventListener('DOMContentLoaded',init);w.addEventListener('load',init);}
})();
