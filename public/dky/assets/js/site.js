(function(){
'use strict';
const C=window.DKY_CONFIG||{};
const DKY=(window.DKY=window.DKY||{});
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=document.documentElement;
const ICON=id=>`<svg aria-hidden="true"><use href="/dky/assets/h/img/icons.9d3a84566c.svg#i-${id}"/></svg>`;
DKY.icon=ICON;
if(!DKY.track)DKY.track=(name,params)=>(DKY._q=DKY._q||[]).push([name,params||{}]);
const mq=q=>(window.matchMedia?window.matchMedia(q):{matches:false,addEventListener(){}});
const mqReduce=mq('(prefers-reduced-motion: reduce)');
const mqFine=mq('(hover: hover) and (pointer: fine)');
const mqSmall=mq('(max-width: 860px)');
const mqDesk=mq('(min-width: 1100px)');
const onMq=(m,fn)=>{try{m.addEventListener('change',fn);}catch(e){try{m.addListener(fn);}catch(_){}}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
DKY.esc=esc;
DKY.fmt=n=>'₺'+Number(n||0).toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2});
DKY.fmtShort=n=>'₺'+Number(n||0).toLocaleString('tr-TR',{maximumFractionDigits:0});
const KEEP=new Set(['HSE','SVR','SV','SE','LED','ABS','ARB','BMW','EGR','DPF','RHD','LHD','VIN','XF','XE','XJ','OEM','ECU','USB','GPS','DKY','SVO','TPMS','AC','DC','PCL','LR','RR','RRS','SDV','TDV','R-L','L-R','R/L','XL','UV','ROCAS','BGA','GKN','NGK','NTK','VDO','AMK','TDI','LCI','EFI','II','III','IV','VI','I','SUV','AWD','PHEV','MHEV','OE','TRW','ZF','INA','SKF','FAG','KYB','SWF','FTE','BWI','PTFE','CNC','PU','ATV','MT','AT','LWB','SWB','HID','DRL','NAS','EU','UK','USA']);
const I_DOT=new Set(('DISCOVERY DISCO DISCVOERY DISOVERY DISCOVERYSPOR DISCOVERYSP SPORTDISCOVERY HILUX MITSUBISHI MITSUB MITSUBI NISSAN NISMO ISUZU MINI VIGO KIT KITI SPOILER SPOILERI '+
'AUTOBIOGRAPHY DIESEL DISESEL TRITON INTERCOOLER INTERCOL MOONVISOR TERRAFIRMA INCH LIMITED EDITION DYNAMIC PREMIUM PLATINUM SILVER WHITE LIGHT PIRELLI '+
'BRITPART VISION GRILLE GRILL MIRROR SIDE CLASSIC CLASIC AIRBAG RUBICON CRUISER WILDTRAK PRESTIGE STICKER SUZUKI MID BIXENON XENON VITARA DISC CABRIO INTENSITY UNIVERSAL '+
'ULTIMATE SERIES RING ORING WESTINGHOUSE PRIVACY PRIMED HIGH OUTRIGER OUTRIGGER FACELIFT ORGANIZER PIANO INJECTION TIVCT PIN LIP AUSTRALIA DESING DESIGN XDRIVE DRIVE AEROTWIN '+
'COMPETITION TWIN SPICER CONVERTIBLE ADAPTIVE TRACTION RAIL JIMNY DIFF DIFFERENTIAL WINCH SNORKEL KINGSIZE KING SKID PIONEER SILICONE SILICON CARBON FIBER FIBRE '+
'BLACK EDITION VELAR EVOQUE SPORT STYLE ILLUMINATED WIND WINDOW WIPER WIRE WIRING SWITCH FILTER INTAKE INLET IGNITION PISTON SPRING KIT '+
'BRAKETI KILIDI KILIT TAKVIYE TAHLIYE FILTRESI UNITESI MERKEZI SINYALI KRIKOSU TAMIR CEKI ÇEKI GIRIŞ MANIFOLDU MANIVELA VALFI DIZEL MIKNATISI').split(/\s+/));
const capAscii=w=>w.charAt(0).toUpperCase()+w.slice(1);
DKY.title=s=>String(s||'').split(/(\s+|[()\/,+]|\.(?!\d)|-(?=\D))/).map(w=>{
if(!w||!w.trim()||/^[()\/,+.\-]$/.test(w))return w;
if(/\d/.test(w))return w;
const up=w.toLocaleUpperCase('tr-TR');
if(KEEP.has(up)||KEEP.has(w))return w;
const key=up.replace(/İ/g,'I');
if(I_DOT.has(key))return capAscii(w.replace(/İ/g,'I').replace(/ı/g,'i').toLowerCase());
const lw=w.toLocaleLowerCase('tr-TR');
return lw.charAt(0).toLocaleUpperCase('tr-TR')+lw.slice(1);
}).join('');
DKY.img=(name,w=400)=>name
?`https://static.ticimax.cloud/cdn-cgi/image/width=${w},quality=85,format=auto/57305/uploads/urunresimleri/buyuk/${name}`
:'/dky/assets/h/img/parca-yok.ce2f22cf9f.svg';
DKY.productUrl=p=>`/dky/urun.html?id=${p.id}`;
DKY.storeUrl=p=>(C.storeUrl||'')+(p.url||'');
const ATTR_KEY='dky_attr';
(function captureAttribution(){
try{
const q=new URLSearchParams(location.search);
const keys=['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid','gbraid','wbraid'];
const found={};
keys.forEach(k=>{if(q.get(k))found[k]=q.get(k);});
if(Object.keys(found).length){
found.landing=location.pathname;
found.ts=Date.now();
localStorage.setItem(ATTR_KEY,JSON.stringify(found));
}
}catch(e){}
})();
DKY.attribution=()=>{try{return JSON.parse(localStorage.getItem(ATTR_KEY)||'null');}catch(e){return null;}};
DKY.waLink=(text='')=>{
const a=DKY.attribution();
let msg=text;
if(a&&(a.utm_source||a.gclid||a.fbclid)){
const src=a.utm_source||(a.gclid?'google':'meta');
msg+=`\n\n[Ref: ${src}${a.utm_campaign?' / '+a.utm_campaign:''}]`;
}
return`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`;
};
function bindWa(r=document){
$$('[data-wa]',r).forEach(a=>{
a.href=DKY.waLink(a.getAttribute('data-wa'));
a.target='_blank';
a.rel='noopener';
});
}
DKY.bindWa=bindWa;
let catalogPromise=null;
DKY.loadCatalog=()=>{
if(catalogPromise)return catalogPromise;
catalogPromise=new Promise((resolve,reject)=>{
const done=()=>resolve(decode(window.DKY_CATALOG));
if(window.DKY_CATALOG)return done();
const s=document.createElement('script');
s.src='/dky/assets/h/js/data/catalog.b88b6861fe.js';
s.async=true;
s.onload=done;
s.onerror=()=>{catalogPromise=null;reject(new Error('Katalog yüklenemedi'));};
document.head.appendChild(s);
});
return catalogPromise;
};
const norm=s=>String(s||'').toLocaleLowerCase('tr-TR')
.replace(/ç/g,'c').replace(/ğ/g,'g').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ş/g,'s').replace(/ü/g,'u').replace(/i̇/g,'i');
const compact=s=>norm(s).replace(/[^a-z0-9]/g,'');
DKY.norm=norm;
function decode(raw){
if(raw.__decoded)return raw.__decoded;
const models=raw.models,groups=raw.groups,gens=raw.gens||[],subs=raw.subs||[];
const all=raw.rows.map(r=>{
const flags=r[9];
const p={
id:r[0],name:r[1],code:r[2],brand:raw.brands[r[3]]||'',category:raw.cats[r[4]]||'',
url:r[5],image:r[6],price:r[7],oldPrice:r[8],
inStock:!!(flags&1),freeShipping:!!(flags&2),isNew:!!(flags&4),bestSeller:!!(flags&8),opportunity:!!(flags&16),tmRisk:!!(flags&32),
models:r[10].map(i=>models[i].key),group:(groups[r[11]]||{}).key||'diger',stock:r[12],
gens:(r[13]||[]).map(i=>(gens[i]||{}).key).filter(Boolean),sub:(subs[r[14]]||{}).key||null
};
p.discount=p.oldPrice>p.price?Math.round((1-p.price/p.oldPrice)*100):0;
p._name=norm(p.name+' '+p.brand+' '+p.category);
p._code=compact(p.code+' '+(p.name.match(/[A-Z]{2,4}\d{3,}[A-Z0-9]*/g)||[]).join(' '));
return p;
});
const products=C.hideTrademarkRisk?all.filter(p=>!p.tmRisk):all;
const byId=new Map(all.map(p=>[p.id,p]));
const out={
products,byId,brands:raw.brands,updatedAt:raw.updatedAt,
models,groups,gens,subs,
modelLabel:k=>(models.find(m=>m.key===k)||{}).label||k,
groupLabel:k=>(groups.find(g=>g.key===k)||{}).label||k,
genLabel:k=>(gens.find(g=>g.key===k)||{}).label||k,
subLabel:k=>(subs.find(s=>s.key===k)||{}).label||k
};
raw.__decoded=out;
return out;
}
DKY.search=(cat,query,{limit=50,filter}={})=>{
const q=norm(query).trim();
if(!q)return[];
const qc=compact(query);
const words=q.split(/\s+/).filter(Boolean);
const res=[];
for(const p of cat.products){
if(filter&&!filter(p))continue;
let s=0;
if(qc.length>=4&&p._code.includes(qc))s+=p._code.startsWith(qc)?120:90;
let all=true,hits=0;
for(const w of words){
if(p._name.includes(w))hits++;
else if(w.length>=4&&p._code.includes(w.replace(/[^a-z0-9]/g,'')))hits++;
else all=false;
}
if(all)s+=40+hits*5;
else if(hits&&words.length>2&&hits>=words.length-1)s+=10+hits*3;
if(!s)continue;
if(p.inStock)s+=6;
if(p.image)s+=2;
res.push([s,p]);
}
res.sort((a,b)=>b[0]-a[0]);
return res.slice(0,limit).map(r=>r[1]);
};
const brandKey=s=>String(s||'').toUpperCase().replace(/İ/g,'I').replace(/\s+/g,' ').trim();
DKY.brandKey=brandKey;
const Q_ORIG=new Set(['LAND ROVER','JAGUAR','BMW','MINI']);
const Q_OEM=new Set(['GARRETT','GARRET','BOSCH','ELRING','LEMFÖRDER','LEMFORDER','MAHLE','NGK','NTK','GKN','DELPHI','VDO','CONTINENTAL','CONTITECH','BORGWARNER','NISSENS','VALEO','PIERBURG','TIMKEN','VICTOR REINZ','GARRET','BREMBO','BWI','MANN','SACHS','TRW','ZF','DAYCO','GATES','INA','SKF','FAG','HELLA','DENSO','BEHR','WAHLER','MOTORCRAFT','AISIN','KYB','BILSTEIN','DUNLOP','AMK']);
const Q_AFTER=new Set(['BLUE PRINT','BRITPART','ALLMAKES','EUROSPARE','BGA','BLUEPRINT','BEARMACH','INGILIZ','FEBI','FILTRON','ARNOTT']);
const Q_ACC_BRANDS=new Set(['ROCAS','ARB','TERRAFIRMA']);
const ACCESSORY_GROUPS=new Set(['logo','basamak','offroad','bodykit','ic','jant']);
DKY.quality=p=>{
const b=brandKey(p.brand);
if(Q_ORIG.has(b))return{key:'orijinal',label:'Orijinal',hint:'Araç üreticisinin kendi parçası'};
if(Q_OEM.has(b))return{key:'oem',label:'OEM üretici',hint:'Araç üreticisine parça tedarik eden firmanın ürünü'};
if(Q_ACC_BRANDS.has(b)&&ACCESSORY_GROUPS.has(p.group))return{key:'aksesuar',label:'Aksesuar',hint:'Aksesuar / görünüm ürünü'};
if(Q_AFTER.has(b)||Q_ACC_BRANDS.has(b))return{key:'muadil',label:'Muadil',hint:'Uyumlu aftermarket parça'};
return null;
};
const MODEL_LABELS={'rr-vogue':'Range Rover Vogue','rr-sport':'Range Rover Sport','rr-velar':'Range Rover Velar','rr-evoque':'Range Rover Evoque','defender-new':'Yeni Defender','defender-classic':'Defender 1987–2016','discovery-2':'Discovery 2','discovery-3':'Discovery 3','discovery-4':'Discovery 4','discovery-5':'Discovery 5','discovery-sport':'Discovery Sport','freelander-1':'Freelander 1','freelander-2':'Freelander 2','ford-ranger':'Ford Ranger','toyota-hilux':'Toyota Hilux','mitsubishi-l200':'Mitsubishi L200','mercedes-x-class':'Mercedes X-Class','vw-amarok':'VW Amarok','isuzu-dmax':'Isuzu D-Max','nissan-navara':'Nissan Navara','jeep':'Jeep','jaguar':'Jaguar','bmw':'BMW','mini':'Mini','jaguar-xe':'Jaguar XE','jaguar-xf':'Jaguar XF','jaguar-xj':'Jaguar XJ','jaguar-s-type':'Jaguar S-Type','jaguar-x-type':'Jaguar X-Type','jaguar-f-pace':'Jaguar F-Pace','jaguar-f-type':'Jaguar F-Type','bmw-1':'BMW 1 Serisi','bmw-3':'BMW 3 Serisi','bmw-5':'BMW 5 Serisi','bmw-7':'BMW 7 Serisi','bmw-x1':'BMW X1','bmw-x3':'BMW X3','bmw-x5':'BMW X5'};
DKY.modelLabels=MODEL_LABELS;
const GKEY='dky_garage',GGEN='dky_garage_kasa';
const GEN_INDEX=new Map();
const genInfo=k=>{
if(!k)return null;
if(typeof k==='object')return k.key?{key:k.key,model:k.model||'',code:k.code||'',years:k.years||'',label:k.label||''}:null;
if(GEN_INDEX.has(k))return GEN_INDEX.get(k);
const raw=window.DKY_CATALOG&&Array.isArray(window.DKY_CATALOG.gens)?window.DKY_CATALOG.gens.find(g=>g.key===k):null;
return raw?{key:raw.key,model:raw.model||'',code:raw.code||'',years:raw.years||'',label:raw.label||''}:null;
};
DKY.genInfo=genInfo;
const readGen=()=>{try{const v=JSON.parse(localStorage.getItem(GGEN)||'null');return v&&v.key?v:null;}catch(e){return null;}};
DKY.garage={
get(){try{return localStorage.getItem(GKEY)||null;}catch(e){return null;}},
gen(){const g=DKY.garage.get(),v=readGen();return g&&v&&v.model===g?v:null;},
set(key,gen){
const gv=key?genInfo(gen):null;
try{
key?localStorage.setItem(GKEY,key):localStorage.removeItem(GKEY);
gv&&gv.model===key?localStorage.setItem(GGEN,JSON.stringify(gv)):localStorage.removeItem(GGEN);
}catch(e){}
const kasa=gv&&gv.model===key?gv.key:null;
document.dispatchEvent(new CustomEvent('dky:garage',{detail:{model:key,kasa}}));
if(key)DKY.track('select_vehicle',{model:key,kasa:kasa||''});
},
label(key){
const k=key===undefined?DKY.garage.get():key;
if(!k)return'';
const base=MODEL_LABELS[k]||(navIndex&&navIndex.model(k)||{}).label||k;
if(key!==undefined)return base;
const g=DKY.garage.gen();
return g?base+' '+(g.code||g.years):base;
},
fits(p){
const g=DKY.garage.get();
if(!g||!p||!p.models||!p.models.includes(g))return false;
const gv=DKY.garage.gen();
if(!gv||!Array.isArray(p.gens)||!p.gens.length)return true;
const own=p.gens.filter(k=>{const i=genInfo(k);return i?i.model===g:false;});
return!own.length||own.includes(gv.key);
}
};
const FAM_LABEL={'range-rover':'Range Rover',defender:'Defender',discovery:'Discovery',freelander:'Freelander',offroad:'Off-road pick-up',other:''};
const famOf=k=>(/^rr-/.test(k)?'range-rover':/^defender/.test(k)?'defender':/^discovery/.test(k)?'discovery':/^freelander/.test(k)?'freelander':'');
const NAV_COLS=[
{key:'land-rover',label:'Land Rover',make:'land-rover',fams:['defender','discovery','freelander'],cat:'land-rover',href:'/dky/arac.html?marka=land-rover'},
{key:'range-rover',label:'Range Rover',make:'land-rover',fams:['range-rover'],cat:'',href:'/dky/arac.html?marka=range-rover'},
{key:'jaguar',label:'Jaguar',makes:['jaguar'],cat:'jaguar',href:'/dky/arac.html?model=jaguar'},
{key:'bmw-mini',label:'BMW & Mini',makes:['bmw','mini'],cat:'',href:'/dky/arac.html?marka=bmw-mini'},
{key:'offroad',label:'Off-road pick-up',makes:['offroad'],cat:'pickup',href:'/dky/arac.html?marka=offroad'}
];
DKY.navCols=NAV_COLS;
const GROUP_ORDER=['fren','suspansiyon','motor','filtre','sogutma','elektrik','aktarma','aydinlatma','kaporta','bodykit','basamak','offroad','jant','ic','logo','diger'];
const GROUP_NAMES={fren:'Fren sistemi',suspansiyon:'Süspansiyon & direksiyon',motor:'Motor & mekanik',filtre:'Filtre & bakım',sogutma:'Soğutma & klima',elektrik:'Elektrik & sensör',aktarma:'Şanzıman & aktarma',aydinlatma:'Aydınlatma & far',kaporta:'Kaporta & dış trim',bodykit:'Body kit & facelift',basamak:'Yan basamak',offroad:'Off-road & kamp',jant:'Jant & lastik',ic:'İç aksesuar',logo:'Logo, yazı & amblem',diger:'Diğer'};
const sentence=s=>{const t=String(s||'').trim();return t?t.charAt(0)+t.slice(1).toLocaleLowerCase('tr-TR'):'';};
DKY.groupName=(k,label)=>GROUP_NAMES[k]||sentence(label)||k;
const nfmt=n=>Number(n||0).toLocaleString('tr-TR');
DKY.nf=nfmt;
DKY.url={
hub:(model,kasa)=>`/dky/arac.html?model=${encodeURIComponent(model)}${kasa?'&kasa='+encodeURIComponent(kasa):''}`,
make:col=>`/dky/arac.html?marka=${encodeURIComponent(col)}`,
cat:({model,kasa,grup,alt,q}={})=>{
const u=new URLSearchParams();
if(model)u.set('model',model);
if(kasa)u.set('kasa',kasa);
if(grup)u.set('grup',grup);
if(alt)u.set('alt',alt);
if(q)u.set('q',q);
const s=u.toString();
return'/dky/urunler.html'+(s?'?'+s:'');
}
};
const BANNER=(file,trim,w)=>`https://static.ticimax.cloud/cdn-cgi/image/trim=${trim},width=${w},quality=82,format=auto/57305/uploads/sayfatasarim/sayfa13/${file}`;
const VEH_PHOTOS={
'range-rover':{file:'vogue-6859b74a-d.jpg',trim:'0;820;0;0',w:1100,h:656,pos:'46% 62%'},
'defender-new':{file:'77a09013-70d9-43e7-a7e3-1a594fc82175.jpg',trim:'0;820;0;0',w:1100,h:656,pos:'30% 62%'},
offroad:{file:'l200-1fda8c7d-a.jpg',trim:'165;0;0;0',w:580,h:315,pos:'58% 60%'},
'mitsubishi-l200':{file:'l200-1fda8c7d-a.jpg',trim:'165;0;0;0',w:580,h:315,pos:'58% 60%'},
'ford-ranger':{file:'ranger-off-road-a123.jpg',trim:'0;152;152;0',w:323,h:170,pos:'30% 55%'},
'toyota-hilux':{file:'toyata-hilux-off-road-acbf.jpg',trim:'0;247;152;0',w:228,h:170,pos:'40% 55%'}
};
const PICKUPS=new Set(['ford-ranger','toyota-hilux','mitsubishi-l200','mercedes-x-class','vw-amarok','isuzu-dmax','nissan-navara','jeep','pickup']);
const VEH_SAME={'rr-vogue':'range-rover'};
const VEH_FAMILY={
discovery:['discovery-5','discovery'],freelander:['freelander-2','freelander'],defender:['defender-new'],
'range-rover':['rr-vogue','range-rover'],jaguar:['jaguar'],bmw:['bmw','bmw-3','bmw-5','bmw-x5'],mini:['mini'],
offroad:['offroad'],pickup:['offroad']
};
const vehMan=()=>(window.DKY_GORSELLER&&window.DKY_GORSELLER.arac)||{};
DKY.vehicleFamilyKeys=fam=>(VEH_FAMILY[fam]||[]).slice();
DKY.vehicleKey=(model,gen,opts)=>{
const M=vehMan();
const k=String(model||'');
if(gen&&M[gen])return gen;
if(M[k])return k;
if(VEH_SAME[k]&&M[VEH_SAME[k]])return VEH_SAME[k];
if(opts&&opts.family)for(const c of VEH_FAMILY[k]||[])if(M[c])return c;
return'';
};
DKY.vehicleBox=model=>{
const k=String(model||'');
if(k==='rr-vogue'||k==='range-rover')return'range-rover';
if(/^discovery-[2-5]$/.test(k))return'discovery';
if(/^freelander/.test(k))return'freelander';
if(/^jaguar/.test(k))return'jaguar';
if(/^bmw/.test(k)||k==='mini'||k==='bmw-mini')return'bmw-mini';
if(k==='land-rover')return'defender-new';
return k;
};
const VEH_SIL={
'defender-new':'sil-offroad','defender-classic':'sil-offroad',defender:'sil-offroad',jeep:'sil-offroad',
'discovery-sport':'sil-suv-compact','freelander-1':'sil-suv-compact','freelander-2':'sil-suv-compact',freelander:'sil-suv-compact',
'rr-evoque':'sil-suv-compact','jaguar-f-pace':'sil-suv-compact','bmw-x1':'sil-suv-compact','bmw-x3':'sil-suv-compact','bmw-x5':'sil-suv',
jaguar:'sil-sedan','jaguar-xe':'sil-sedan','jaguar-xf':'sil-sedan','jaguar-xj':'sil-sedan','jaguar-s-type':'sil-sedan','jaguar-x-type':'sil-sedan','jaguar-f-type':'sil-sedan',
bmw:'sil-sedan','bmw-3':'sil-sedan','bmw-5':'sil-sedan','bmw-7':'sil-sedan','bmw-1':'sil-hatch',mini:'sil-hatch','bmw-mini':'sil-sedan'
};
DKY.vehicleSil=model=>{
const k=String(model||'');
return VEH_SIL[k]||(PICKUPS.has(k)||k==='offroad'?'sil-pickup':'sil-suv');
};
DKY.vehicleImage=(key,width=800)=>{
const M=vehMan();
if(key&&M[key])return{src:'/'+String(M[key]).replace(/^\/+/,''),w:1200,h:800,kind:'ai'};
const ph=VEH_PHOTOS[key];
if(!ph)return null;
const ws=[480,800,1100].filter(x=>x<=ph.w).concat(ph.w<480?[ph.w]:[]);
const w=Math.min(width,ph.w);
return{src:BANNER(ph.file,ph.trim,w),srcset:ws.map(x=>BANNER(ph.file,ph.trim,x)+' '+x+'w').join(', '),w:ph.w,h:ph.h,pos:ph.pos,kind:'photo'};
};
DKY.bandImage=key=>{const B=(window.DKY_GORSELLER&&window.DKY_GORSELLER.marka)||{};return key&&B[key]?'/'+String(B[key]).replace(/^\/+/,''):'';};
let navIndex=null;
function normNav(raw,source){
const models=new Map(),gens=new Map(),groups=new Map(),subs=new Map(),makes=new Map();
const makeList=(raw.makes||[]).map(mk=>{
const key=mk.key==='pickup'?'offroad':mk.key;
const ms=(mk.models||[]).map(m=>{
const fam=m.family||(key==='offroad'?'offroad':key==='land-rover'?famOf(m.key):'other');
const gl=(m.gens||[]).map(g=>{
const parts=String(g.label||'').split(/\s*·\s*/);
const o={
key:g.key,model:m.key,label:g.label||'',count:g.count||0,
code:g.code!=null?g.code:(parts.length>=3?parts[1]:''),
years:g.years||(parts.length>=2?parts[parts.length-1]:'')
};
gens.set(o.key,o);GEN_INDEX.set(o.key,o);
return o;
});
const o={key:m.key,label:m.label||MODEL_LABELS[m.key]||m.key,count:m.count||0,image:m.image||'',family:fam,make:key,gens:gl};
models.set(o.key,o);
return o;
});
const o={key,label:mk.label||key,count:mk.count||0,models:ms};
makes.set(key,o);
if(key!=='land-rover'&&key!=='offroad'&&!models.has(key)){
models.set(key,{key,label:MODEL_LABELS[key]||o.label,count:o.count,image:(ms.find(m=>m.image)||{}).image||mk.image||'',family:'other',make:key,gens:[],isMake:true,subs:ms});
}
return o;
});
const groupList=(raw.groups||[]).map(g=>{
const sl=(g.subs||[]).map(s=>{const o={key:s.key,label:s.label||s.key,count:s.count||0,group:g.key};subs.set(o.key,o);return o;});
const o={key:g.key,label:DKY.groupName(g.key,g.label),count:g.count||0,image:g.image||'',subs:sl};
groups.set(o.key,o);
return o;
}).sort((a,b)=>{
const ia=GROUP_ORDER.indexOf(a.key),ib=GROUP_ORDER.indexOf(b.key);
return(ia<0?99:ia)-(ib<0?99:ib);
});
const cols=NAV_COLS.map(c=>{
let items;
if(c.fams)items=((makes.get(c.make)||{}).models||[]).filter(m=>c.fams.includes(m.family));
else items=c.makes.flatMap(k=>{
const mk=makes.get(k);
if(!mk)return[];
const all=models.get(k);
return(all&&all.isMake?[all]:[]).concat(mk.models.filter(m=>m.key!==k));
});
return Object.assign({},c,{items:items.filter(m=>m.count>0)});
});
const colOfModel=k=>{
const m=models.get(k);
if(!m)return null;
return cols.find(c=>(c.fams?c.make===m.make&&c.fams.includes(m.family):c.makes.includes(m.make)))||null;
};
const nav={
source,updatedAt:raw.updatedAt||'',
makes:makeList,groups:groupList,cols,
modelGroups:raw.modelGroups||{},genGroups:raw.genGroups||{},
model:k=>models.get(k)||null,
gen:k=>gens.get(k)||null,
group:k=>groups.get(k)||null,
sub:k=>subs.get(k)||null,
make:k=>makes.get(k)||null,
col:k=>cols.find(c=>c.key===k)||null,
colOfModel,
groupsOf:(model,kasa)=>((kasa&&raw.genGroups&&raw.genGroups[kasa])||(raw.modelGroups&&raw.modelGroups[model])||[]).filter(x=>x.count>0)
.map((x,i)=>[GROUP_ORDER.indexOf(x.group)<0?99:GROUP_ORDER.indexOf(x.group),i,x]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]).map(r=>r[2])
};
return nav;
}
function navFromCatalog(cat){
const raw=window.DKY_CATALOG||{};
const genList=cat.gens||raw.gens||[];
const subList=cat.subs||raw.subs||[];
const inc=(m,k)=>m.set(k,(m.get(k)||0)+1);
const mCount=new Map(),mImg=new Map(),gCount=new Map(),grCount=new Map(),grImg=new Map(),sCount=new Map(),mkCount=new Map();
const ctxGroups=new Map();
const ctxAdd=(ck,p,good)=>{
let m=ctxGroups.get(ck);
if(!m)ctxGroups.set(ck,(m=new Map()));
const e=m.get(p.group)||{group:p.group,count:0,image:''};
e.count++;
if(good&&!e.image)e.image=p.image;
m.set(p.group,e);
};
const makeOfModel=k=>{const m=(cat.models||[]).find(x=>x.key===k);const fam=m?m.family:'';return fam==='offroad'?'offroad':['range-rover','defender','discovery','freelander'].includes(fam)?'land-rover':k.startsWith('jaguar')?'jaguar':k.startsWith('bmw')?'bmw':k==='mini'?'mini':'other';};
for(const p of cat.products){
const good=!!(p.inStock&&p.image&&!p.tmRisk);
const mk=new Set();
for(const m of p.models){inc(mCount,m);if(good&&!mImg.has(m))mImg.set(m,p.image);ctxAdd('m:'+m,p,good);mk.add(makeOfModel(m));}
mk.forEach(k=>inc(mkCount,k));
for(const g of(Array.isArray(p.gens)?p.gens:[])){inc(gCount,g);ctxAdd('g:'+g,p,good);}
inc(grCount,p.group);
if(good&&!grImg.has(p.group))grImg.set(p.group,p.image);
if(p.sub)inc(sCount,p.sub);
}
const ORDER=['land-rover','jaguar','bmw','mini','offroad'];
const LBL={'land-rover':'Land Rover',jaguar:'Jaguar',bmw:'BMW',mini:'Mini',offroad:'Off-road pick-up'};
const makesRaw=ORDER.map(k=>({
key:k,label:LBL[k],count:mkCount.get(k)||0,
models:(cat.models||[]).filter(m=>makeOfModel(m.key)===k&&m.key!==k).map(m=>({
key:m.key,label:m.label,family:m.family==='other'?'other':m.family,count:mCount.get(m.key)||0,image:mImg.get(m.key)||'',
gens:genList.filter(g=>g.model===m.key).map(g=>({key:g.key,label:g.label,code:g.code,years:g.years,count:gCount.get(g.key)||0}))
}))
}));
makesRaw.forEach(mk=>{if(!mk.models.length&&mImg.has(mk.key))mk.image=mImg.get(mk.key);});
const groupsRaw=(cat.groups||[]).map(g=>({
key:g.key,label:g.label,count:grCount.get(g.key)||0,image:grImg.get(g.key)||'',
subs:subList.filter(s=>s.group===g.key).map(s=>({key:s.key,label:s.label,count:sCount.get(s.key)||0}))
}));
const modelGroups={},genGroups={};
ctxGroups.forEach((m,ck)=>{
const list=[...m.values()].sort((a,b)=>b.count-a.count);
if(ck.startsWith('m:'))modelGroups[ck.slice(2)]=list;else genGroups[ck.slice(2)]=list;
});
return normNav({updatedAt:cat.updatedAt,makes:makesRaw,groups:groupsRaw,modelGroups,genGroups},'catalog');
}
let navPromise=null,navCatPromise=null;
const NAV_SRC='/dky/assets/h/js/data/nav.ce171af89e.js';
function loadNavFile(){
if(navPromise)return navPromise;
navPromise=new Promise((resolve,reject)=>{
const done=()=>(window.DKY_NAV&&window.DKY_NAV.makes?resolve(window.DKY_NAV):reject(new Error('nav.js biçimi')));
if(window.DKY_NAV)return done();
const s=document.createElement('script');
s.src=NAV_SRC;
s.async=true;
s.onload=done;
s.onerror=()=>reject(new Error('nav.js yüklenemedi'));
document.head.appendChild(s);
}).then(raw=>(navIndex=normNav(raw,'nav')));
return navPromise;
}
DKY.loadNav=({fallback=true}={})=>loadNavFile().catch(err=>{
if(!fallback)throw err;
if(!navCatPromise)navCatPromise=DKY.loadCatalog().then(cat=>(navIndex=navIndex||navFromCatalog(cat)));
return navCatPromise;
}).then(nav=>{hydrateNav(nav);return nav;});
DKY.navFromCatalog=cat=>navFromCatalog(cat);
DKY.nav=()=>navIndex;
DKY.showOld=p=>C.showOldPrice!==false&&!!p&&p.oldPrice>p.price;
DKY.card=(p,{eager=false}={})=>{
const flags=[];
if(!p.inStock)flags.push('<span class="tag">Tükendi</span>');
if(p.discount>=5&&DKY.showOld(p))flags.push(`<span class="tag tag--dark">%${p.discount} indirim</span>`);
if(p.isNew)flags.push('<span class="tag">Yeni</span>');
const name=DKY.title(p.name);
const q=DKY.quality(p);
const g=DKY.garage.get();
const fit=g?(DKY.garage.fits(p)
?`<p class="p-card__fit" title="Seçili aracınız: ${esc(DKY.garage.label(g))}">${ICON('check')}Aracınıza uyar</p>`
:'<p class="p-card__fit p-card__fit--none" aria-hidden="true"></p>'):'';
const free=p.freeShipping||p.price>=(C.freeShippingLimit||3000);
const hasOld=DKY.showOld(p);
return`<article class="p-card${p.inStock?'':' is-out'}" data-flip-id="${p.id}">
  <div class="p-card__media">
    <img src="${esc(DKY.img(p.image,400))}" alt="${esc(name)}" width="400" height="400" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async">
    ${flags.length?`<div class="p-card__flags">${flags.slice(0,2).join('')}</div>`:''}
  </div>
  <div class="p-card__body">
    <h3 class="p-card__name"><a href="${DKY.productUrl(p)}">${esc(name)}</a></h3>
    <div class="p-card__code"><span class="code-chip">${esc(p.code)}</span>${p.brand?`<span class="p-card__brand">${esc(p.brand)}</span>`:''}</div>
    ${fit}
    <div class="p-card__meta">${q?`<span class="q-badge q-badge--${q.key}" title="${esc(q.hint)}">${q.label}</span>`:''}<span class="p-card__stock">${ICON(p.inStock?'check':'clock')}${p.inStock?'Stokta':'Tedarik edilir'}</span></div>
    <div class="p-card__foot">
      <div class="price">${hasOld?`<span class="price__old"><span class="sr-only">Önceki fiyat: </span>${DKY.fmt(p.oldPrice)}</span>`:'<span class="price__old" aria-hidden="true"></span>'}<span class="price__now">${DKY.fmt(p.price)}</span><span class="price__vat">KDV dahil${free?' · Ücretsiz kargo':''}</span></div>
      <button class="icon-btn p-card__add" type="button" data-add-quote="${p.id}" aria-label="${esc(name)}: teklif listesine ekle">${ICON('plus')}</button>
    </div>
  </div>
</article>`;
};
const registered=new Map();
DKY.register=list=>(list||[]).forEach(p=>registered.set(p.id,p));
const QKEY='dky_quote';
const quote=DKY.quote={
items(){try{return JSON.parse(localStorage.getItem(QKEY)||'[]');}catch(e){return[];}},
save(list){try{localStorage.setItem(QKEY,JSON.stringify(list));}catch(e){}quote.render();},
add(p,qty=1){
const list=quote.items();
const ex=list.find(i=>i.id===p.id);
if(ex)ex.qty+=qty;
else list.push({id:p.id,qty,name:p.name,code:p.code,price:p.price,image:p.image,brand:p.brand});
quote.save(list);
$$('[data-quote-count]').forEach(el=>{el.classList.remove('is-bump');void el.offsetWidth;el.classList.add('is-bump');});
DKY.toast('Teklif listesine eklendi');
DKY.track('add_to_quote',{item_id:p.id,item_name:p.name,price:p.price,value:p.price*qty,currency:'TRY'});
},
setQty(id,qty){
let list=quote.items();
list=qty<=0?list.filter(i=>i.id!==id):list.map(i=>(i.id===id?{...i,qty}:i));
quote.save(list);
},
total(){return quote.items().reduce((t,i)=>t+i.price*i.qty,0);},
message(){
const list=quote.items();
const lines=list.map((i,n)=>`${n+1}) ${DKY.title(i.name)}\n   Kod: ${i.code} · Adet: ${i.qty} · ${DKY.fmt(i.price)}`);
const g=DKY.garage.label();
return`Merhaba, aşağıdaki parçalar için stok ve fiyat teyidi rica ediyorum:\n\n${lines.join('\n')}\n\nTahmini toplam: ${DKY.fmt(quote.total())}${g?`\nAracım: ${g}`:''}\nŞasi (VIN) no: `;
},
render(){
const list=quote.items();
const n=list.reduce((t,i)=>t+i.qty,0);
$$('[data-quote-count]').forEach(el=>{el.textContent=n||'';el.dataset.n=n;});
const box=$('[data-quote-list]');
if(!box)return;
const foot=$('[data-quote-foot]');
if(!list.length){
box.innerHTML=`<div class="quote__empty">${ICON('clipboard').replace('<svg','<svg style="width:40px;height:40px"')}<p>Listeniz boş. Ürün kartlarındaki <strong>+</strong> ile parça ekleyin, tek mesajla fiyat ve stok teyidi alın.</p><a class="btn btn--secondary btn--sm" href="/dky/urunler.html">Kataloğa git</a></div>`;
if(foot)foot.hidden=true;
return;
}
if(foot)foot.hidden=false;
box.innerHTML=list.map(i=>`<div class="quote__item">
        <img src="${esc(DKY.img(i.image,120))}" alt="" width="56" height="56" loading="lazy">
        <div><div class="quote__item-name">${esc(DKY.title(i.name))}</div><div class="code-chip">${esc(i.code)}</div>
          <div class="qty"><button type="button" data-qty="${i.id}" data-d="-1" aria-label="Azalt">${ICON('minus').replace('<svg','<svg style="width:14px;height:14px"')}</button><span aria-label="Adet">${i.qty}</span><button type="button" data-qty="${i.id}" data-d="1" aria-label="Artır">${ICON('plus').replace('<svg','<svg style="width:14px;height:14px"')}</button></div>
        </div>
        <div style="text-align:right"><div class="price__now" style="font-size:1.05rem">${DKY.fmt(i.price*i.qty)}</div><button class="quote__remove" type="button" data-qty="${i.id}" data-d="-999" aria-label="Kaldır">${ICON('trash').replace('<svg','<svg style="width:16px;height:16px"')}</button></div>
      </div>`).join('');
const t=$('[data-quote-total]');
if(t)t.textContent=DKY.fmt(quote.total());
}
};
let toastT;
DKY.toast=msg=>{
const t=$('#toast');
if(!t)return;
t.innerHTML=ICON('check')+esc(msg);
t.classList.add('is-on');
clearTimeout(toastT);
toastT=setTimeout(()=>t.classList.remove('is-on'),2200);
};
const toList=t=>(!t?[]:typeof t==='string'?$$(t):(t instanceof Element?[t]:[...t]));
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const noop=()=>{};
const plx=new Set();
let plxRaf=0;
const plxUpdate=()=>{
plxRaf=0;
const vh=window.innerHeight||1;
plx.forEach(it=>{
const r=it.el.getBoundingClientRect();
const top=r.top-it.y;
if(top>vh*1.5||top+r.height<-vh*.5)return;
const prog=clamp(((top+r.height/2)-vh/2)/(vh/2+r.height/2),-1,1);
const cap=mqSmall.matches||!mqFine.matches?12:40;
const y=Math.round(-prog*Math.min(it.strength,cap)*10)/10;
if(y!==it.y){it.y=y;it.el.style.setProperty('--parallax-y',y+'px');}
});
};
const plxQueue=()=>{if(!plxRaf)plxRaf=requestAnimationFrame(plxUpdate);};
const motion=DKY.motion={
get reduced(){return mqReduce.matches;},
get fine(){return mqFine.matches;},
get small(){return mqSmall.matches;},
inView(target,cb,{once=true,rootMargin='0px 0px -10% 0px',threshold=0}={}){
const els=toList(target);
if(!els.length)return noop;
if(!('IntersectionObserver'in window)){els.forEach(el=>cb(el,null));return noop;}
const io=new IntersectionObserver(entries=>entries.forEach(en=>{
if(en.isIntersecting){cb(en.target,en);if(once)io.unobserve(en.target);}
else if(!once)cb(en.target,en);
}),{rootMargin,threshold});
els.forEach(el=>io.observe(el));
return()=>io.disconnect();
},
stagger(nodes,step=70,{start=0,max=12}={}){
const list=toList(nodes);
const s=mqSmall.matches?Math.round(step*.6):step;
list.forEach((el,i)=>el.style.setProperty('--d',(start+Math.min(i,max)*s)+'ms'));
return list;
},
parallax(el,strength=24,{apply=true}={}){
if(!el||mqReduce.matches)return noop;
const it={el,strength:Math.abs(strength),y:0};
if(apply)el.classList.add('parallax');
plx.add(it);
if(plx.size===1){window.addEventListener('scroll',plxQueue,{passive:true});window.addEventListener('resize',plxQueue);}
plxQueue();
return()=>{
plx.delete(it);el.style.removeProperty('--parallax-y');if(apply)el.classList.remove('parallax');
if(!plx.size){window.removeEventListener('scroll',plxQueue);window.removeEventListener('resize',plxQueue);}
};
},
tilt(el,max=6){
if(!el||!mqFine.matches||mqReduce.matches)return noop;
el.classList.add('tilt');
let raf=0,ev=null;
const apply=()=>{
raf=0;if(!ev)return;
const r=el.getBoundingClientRect();
const x=clamp((ev.clientX-r.left)/r.width,0,1),y=clamp((ev.clientY-r.top)/r.height,0,1);
el.style.setProperty('--tilt-y',((x-.5)*2*max).toFixed(2)+'deg');
el.style.setProperty('--tilt-x',(-(y-.5)*2*max).toFixed(2)+'deg');
el.style.setProperty('--tilt-mx',(x*100).toFixed(1)+'%');
el.style.setProperty('--tilt-my',(y*100).toFixed(1)+'%');
};
const enter=()=>el.classList.add('is-tilting');
const move=e=>{ev=e;if(!raf)raf=requestAnimationFrame(apply);};
const leave=()=>{ev=null;el.classList.remove('is-tilting');el.style.setProperty('--tilt-x','0deg');el.style.setProperty('--tilt-y','0deg');};
el.addEventListener('pointerenter',enter);
el.addEventListener('pointermove',move);
el.addEventListener('pointerleave',leave);
return()=>{leave();el.removeEventListener('pointerenter',enter);el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);el.classList.remove('tilt');};
},
sheen(el){
if(!el)return el;
el.classList.add('sheen');
if(mqReduce.matches)return el;
el.classList.remove('is-sheening');void el.offsetWidth;el.classList.add('is-sheening');
const done=()=>{el.classList.remove('is-sheening');el.removeEventListener('animationend',done);};
el.addEventListener('animationend',done);
return el;
},
observe(r){return DKY.observe(r);}
};
(function cardTilt(){
let card=null,raf=0,ev=null;
const MAX=5;
const reset=c=>{if(!c)return;c.classList.remove('is-tilting');c.style.removeProperty('--tilt-x');c.style.removeProperty('--tilt-y');};
const apply=()=>{
raf=0;
if(!card||!ev)return;
const r=card.getBoundingClientRect();
const x=clamp((ev.clientX-r.left)/r.width,0,1),y=clamp((ev.clientY-r.top)/r.height,0,1);
card.style.setProperty('--tilt-y',((x-.5)*2*MAX).toFixed(2)+'deg');
card.style.setProperty('--tilt-x',(-(y-.5)*2*MAX).toFixed(2)+'deg');
card.classList.add('is-tilting');
};
document.addEventListener('pointermove',e=>{
if(e.pointerType!=='mouse'||!mqFine.matches||mqReduce.matches)return;
const c=e.target.closest?e.target.closest('.p-card'):null;
if(c!==card){reset(card);card=c;}
if(!card)return;
ev=e;
if(!raf)raf=requestAnimationFrame(apply);
},{passive:true});
root.addEventListener('pointerleave',()=>{reset(card);card=null;});
document.addEventListener('pointerout',e=>{if(card&&(!e.relatedTarget||!card.contains(e.relatedTarget))){reset(card);card=null;}},{passive:true});
})();
let lastFocus=null;
const FOCUSABLE='a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
const openLayers=()=>$$('.drawer.is-open, .search-overlay.is-open, .quote.is-open');
function setExpanded(el,v){if(el&&el.id)$$(`[aria-controls="${el.id}"]`).forEach(b=>b.setAttribute('aria-expanded',String(v)));}
let keepFocus=false;
function openLayer(el,focusSel){
if(!el)return;
if(!openLayers().length&&!keepFocus)lastFocus=document.activeElement;
keepFocus=false;
closeMegas();
el.classList.add('is-open');
el.setAttribute('aria-hidden','false');
setExpanded(el,true);
const f=focusSel?$(focusSel,el):$(FOCUSABLE,el);
setTimeout(()=>f&&f.focus({preventScroll:true}),60);
}
function closeLayer(el,{restore=true}={}){
if(!el||!el.classList.contains('is-open'))return;
el.classList.remove('is-open');
el.setAttribute('aria-hidden','true');
setExpanded(el,false);
if(restore&&!openLayers().length&&lastFocus&&document.contains(lastFocus)){try{lastFocus.focus({preventScroll:true});}catch(e){}}
}
function trapFocus(e){
const layer=openLayers().pop();
if(!layer)return;
const box=$('.drawer__panel, .quote__panel',layer)||layer;
const items=$$(FOCUSABLE,box).filter(x=>x.getClientRects().length>0&&getComputedStyle(x).visibility!=='hidden');
if(!items.length)return;
const first=items[0],last=items[items.length-1];
if(!box.contains(document.activeElement)){e.preventDefault();first.focus();}
else if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
}
DKY.openQuote=()=>{quote.render();openLayer($('#quote'),'[data-close-quote].icon-btn');};
DKY.openSearch=(q='')=>{
const el=$('#search');
openLayer(el,'[data-search-input]');
const input=$('[data-search-input]',el);
if(input&&q){input.value=q;runSearch(q);}
DKY.loadCatalog().catch(()=>{});
};
DKY.openDrawer=(section)=>{
const d=$('#drawer');
if(!d)return;
openLayer(d,section==='cats'?'#drawer-cats-t':null);
if(section==='cats'){
const t=$('#drawer-cats',d),body=$('.drawer__body',d);
if(t&&body)setTimeout(()=>body.scrollTo({top:Math.max(0,t.offsetTop-12),behavior:mqReduce.matches?'auto':'smooth'}),80);
}
};
let searchT;
function runSearch(q){
const box=$('[data-search-results]');
const sug=$('[data-search-suggest]');
if(sug)sug.hidden=q.trim().length>=2;
if(!box)return;
if(q.trim().length<2){box.innerHTML='';return;}
box.innerHTML='<p class="muted">Aranıyor…</p>';
DKY.loadCatalog().then(cat=>{
const hits=DKY.search(cat,q,{limit:8});
if(!hits.length){
box.innerHTML=`<div class="search-empty"><strong>“${esc(q)}” için sonuç bulunamadı.</strong><span class="muted">Parça kataloğumuzda görünmüyor olabilir; 10.000+ ürünün dışında tedarik de yapıyoruz. Parça adı ya da şasi numaranızla yazın.</span><a class="btn btn--wa btn--sm" href="${DKY.waLink('Merhaba, şu parçayı arıyorum: '+q+'\nŞasi (VIN) no: ')}" target="_blank" rel="noopener" data-track="whatsapp_click" data-track-label="search_empty">${ICON('whatsapp')}WhatsApp'tan sor</a></div>`;
DKY.track('search',{search_term:q,results:0});
return;
}
box.innerHTML=hits.map(p=>`<a class="search-hit" href="${DKY.productUrl(p)}">
        <img src="${esc(DKY.img(p.image,120))}" alt="" width="64" height="64" loading="lazy">
        <span><span class="search-hit__name">${esc(DKY.title(p.name))}</span><br><span class="code-chip">${esc(p.code)}</span> <span class="muted" style="font-size:.8125rem">· ${esc(p.brand)}${p.inStock?'':' · Tedarik edilir'}</span></span>
        <span class="search-hit__price">${DKY.fmt(p.price)}</span></a>`).join('')+
`<a class="btn btn--text" style="justify-self:start;margin-top:4px" href="/dky/urunler.html?q=${encodeURIComponent(q)}">Tüm sonuçlar${ICON('arrow')}</a>`;
DKY.track('search',{search_term:q,results:hits.length});
}).catch(()=>{box.innerHTML='<p class="muted">Katalog yüklenemedi, sayfayı yenileyin.</p>';});
}
const closeFromDrawer=()=>{const d=$('#drawer');const was=!!(d&&d.classList.contains('is-open'));closeLayer(d,{restore:false});return was;};
const pendingObserve=[];
DKY.observe=r=>{pendingObserve.push(r);};
const catIco=(k,mod='')=>`<svg class="cat-ico${mod?' cat-ico--'+mod:''}" aria-hidden="true"><use href="/dky/assets/h/img/icons.9d3a84566c.svg#cat-${esc(k)}"/></svg>`;
DKY.catIco=catIco;
const arrowIco='<svg class="arrow" aria-hidden="true"><use href="/dky/assets/h/img/icons.9d3a84566c.svg#i-arrow"/></svg>';
const chevIco=ICON('chevron');
const genMeta=g=>(g.code?`<b>${esc(g.code)}</b> ${esc(g.years)}`:esc(g.years||g.label));
DKY.genMeta=genMeta;
const shortModel=(m,c)=>{
if(m.isMake)return(m.subs&&m.subs.some(x=>x.count>0)?'Tüm ':'')+(MODEL_LABELS[m.key]||m.label);
const pre=c&&c.key==='range-rover'?'Range Rover ':c&&c.key==='jaguar'?'Jaguar ':c&&c.key==='bmw-mini'&&m.key.startsWith('bmw-')?'BMW ':'';
return pre&&m.label.startsWith(pre)?m.label.slice(pre.length):m.label;
};
DKY.shortModel=shortModel;
const liveGens=m=>(m.gens||[]).filter(g=>g.count>0);
DKY.liveGens=liveGens;
const soleGen=m=>{const gs=liveGens(m);const g=gs.length===1?gs[0]:null;return g&&(g.code||!String(m.label).includes(g.years))?g:null;};
DKY.soleGen=soleGen;
const genAria=(m,g)=>m.label+' '+(g.code?g.code+' ':'')+g.years;
function megaCarsHTML(nav){
const list=(items,c)=>`<ul>${items.map(m=>{
const gs=liveGens(m);
const one=soleGen(m);
const row=`<a href="${esc(DKY.url.hub(m.key))}" data-nav-model="${esc(m.key)}" aria-label="${esc(m.isMake?shortModel(m,c)+' modelleri':one?genAria(m,one):m.label)}"><span>${esc(shortModel(m,c))}${one?` <span class="nav-meta">${genMeta(one)}</span>`:''}</span><small>${nfmt(m.count)}</small></a>`;
const sub=gs.length>1?`<ul class="mbrand__gens">${gs.map(g=>`<li><a href="${esc(DKY.url.hub(m.key,g.key))}" data-nav-model="${esc(m.key)}" data-nav-gen="${esc(g.key)}" aria-label="${esc(genAria(m,g))}"><span class="nav-meta">${genMeta(g)}</span><small>${nfmt(g.count)}</small></a></li>`).join('')}</ul>`:'';
return`<li>${row}${sub}</li>`;
}).join('')}</ul>`;
return nav.cols.filter(c=>c.items.length).map(c=>{
const body=c.fams&&c.fams.length>1
?`<div class="mbrand__cols mbrand__cols--stack">${c.fams.map(f=>{const its=c.items.filter(m=>m.family===f);return its.length?`<div><h4>${esc(FAM_LABEL[f])}</h4>${list(its,c)}</div>`:'';}).join('')}</div>`
:list(c.items,c);
const all=c.cat?`<a class="btn btn--text btn--sm" href="${esc(DKY.url.cat({model:c.cat}))}">Tüm ${esc(c.label)} parçaları${arrowIco}</a>`:'';
return`<section class="mbrand mbrand--${esc(c.key)}" data-mo-item aria-labelledby="mb-${esc(c.key)}"><div class="mbrand__head"><h3 id="mb-${esc(c.key)}"><a href="${esc(c.href)}">${esc(c.label)}</a></h3></div>${body}${all}</section>`;
}).join('');
}
function megaCatsHTML(nav){
return nav.groups.filter(g=>g.count>0).map(g=>{
const subs=g.subs.filter(s=>s.count>0).sort((a,b)=>b.count-a.count);
const top=subs.slice(0,4);
const more=subs.length-top.length;
return`<section class="mcat" data-mo-item><a class="mcat__head" href="${esc(DKY.url.cat({grup:g.key}))}">${catIco(g.key)}<strong>${esc(g.label)}</strong><small>${nfmt(g.count)}</small></a>${top.length?`<ul class="mcat__subs">${top.map(s=>`<li><a href="${esc(DKY.url.cat({grup:g.key,alt:s.key}))}">${esc(s.label)} <small>${nfmt(s.count)}</small></a></li>`).join('')}${more>0?`<li class="mcat__more"><a href="/dky/kategoriler.html#k-${esc(g.key)}">+${more} alt kategori</a></li>`:''}</ul>`:''}</section>`;
}).join('');
}
function drawerCarsHTML(nav){
return nav.cols.filter(c=>c.items.length).map(c=>`<details class="dbrand"><summary><span>${esc(c.label)}</span>${chevIco}</summary><div class="dbrand__body">${c.items.map(m=>{
const gs=liveGens(m);
const one=soleGen(m);
return`<a class="dbrand-link" href="${esc(DKY.url.hub(m.key))}" data-nav-model="${esc(m.key)}"><span>${esc(m.isMake?shortModel(m,c):m.label)}${one?` <span class="nav-meta">${genMeta(one)}</span>`:''}</span><small>${nfmt(m.count)}</small></a>`+
(gs.length>1?`<div class="chips chips--gens">${gs.map(g=>`<a class="chip gen-chip" href="${esc(DKY.url.hub(m.key,g.key))}" data-nav-model="${esc(m.key)}" data-nav-gen="${esc(g.key)}" aria-label="${esc(genAria(m,g))}">${g.code?`<strong>${esc(g.code)}</strong>`:''}<small>${esc(g.years)}</small></a>`).join('')}</div>`:'');
}).join('')}<a class="btn btn--text btn--sm" href="${esc(c.href)}">${esc(c.label)}: tüm modeller${arrowIco}</a></div></details>`).join('');
}
function drawerCatsHTML(nav){
return nav.groups.filter(g=>g.count>0).map(g=>{
const subs=g.subs.filter(s=>s.count>0).sort((a,b)=>b.count-a.count);
if(!subs.length)return`<a class="dbrand-link dcat-link" href="${esc(DKY.url.cat({grup:g.key}))}">${catIco(g.key,'sm')}<span>${esc(g.label)}</span><small>${nfmt(g.count)}</small></a>`;
return`<details class="dbrand dcat"><summary>${catIco(g.key,'sm')}<span>${esc(g.label)}</span><small>${nfmt(g.count)}</small>${chevIco}</summary><div class="dbrand__body"><div class="chips"><a class="chip chip--all" href="${esc(DKY.url.cat({grup:g.key}))}">Tümü <small>${nfmt(g.count)}</small></a>${subs.map(s=>`<a class="chip" href="${esc(DKY.url.cat({grup:g.key,alt:s.key}))}">${esc(s.label)} <small>${nfmt(s.count)}</small></a>`).join('')}</div></div></details>`;
}).join('')+`<a class="btn btn--text btn--sm dcat-all" href="/dky/kategoriler.html">Tüm kategoriler${arrowIco}</a>`;
}
let hydrated=null,paintGarageRef=null;
function hydrateNav(nav){
if(!nav||hydrated===nav)return;
hydrated=nav;
const put=(sel,html)=>{if(!html)return;$$(sel).forEach(el=>{el.innerHTML=html;el.setAttribute('data-nav-ready',nav.source);});};
put('[data-nav-cars]',megaCarsHTML(nav));
put('[data-nav-cats]',megaCatsHTML(nav));
put('[data-drawer-cars]',drawerCarsHTML(nav));
put('[data-drawer-cats]',drawerCatsHTML(nav));
if(paintGarageRef)paintGarageRef();
document.dispatchEvent(new CustomEvent('dky:nav',{detail:{source:nav.source}}));
}
let megaT;
let megaTriggers=[];
function closeMegas(except){
megaTriggers.forEach(b=>{
if(b===except)return;
b.setAttribute('aria-expanded','false');
const p=$('#'+b.getAttribute('aria-controls'));
if(p)p.classList.remove('is-open');
});
}
function init(){
bindWa();
quote.render();
$$('[data-year]').forEach(el=>(el.textContent=new Date().getFullYear()));
const header=$('#header');
const setHeaderVars=()=>{
if(!header)return;
const r=header.getBoundingClientRect();
root.style.setProperty('--header-total',Math.round(r.height)+'px');
root.style.setProperty('--mega-top',Math.max(0,Math.round(r.bottom))+'px');
};
setHeaderVars();
if('ResizeObserver'in window&&header)new ResizeObserver(setHeaderVars).observe(header);
window.addEventListener('resize',setHeaderVars,{passive:true});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(setHeaderVars).catch(()=>{});
const path=location.pathname.replace(/index\.html$/,'');
$$('.mega--pop a, .dlinks a').forEach(a=>{if(a.getAttribute('href')===path)a.setAttribute('aria-current','page');});
megaTriggers=$$('[aria-controls^="mega-"]');
megaTriggers.forEach(btn=>{
const panel=$('#'+btn.getAttribute('aria-controls'));
if(!panel)return;
let openedAt=0;
const open=()=>{
clearTimeout(megaT);
if(btn.getAttribute('aria-expanded')==='true')return;
closeMegas(btn);setHeaderVars();
btn.setAttribute('aria-expanded','true');panel.classList.add('is-open');
openedAt=Date.now();
};
const later=()=>{clearTimeout(megaT);megaT=setTimeout(()=>closeMegas(),220);};
btn.addEventListener('click',()=>{
if(btn.getAttribute('aria-expanded')==='true'){if(Date.now()-openedAt>600)closeMegas();}
else{open();DKY.track('menu_open',{menu:btn.getAttribute('aria-controls')});}
});
btn.addEventListener('mouseenter',()=>{if(mqFine.matches){clearTimeout(megaT);megaT=setTimeout(open,90);}});
btn.addEventListener('mouseleave',()=>{if(mqFine.matches)later();});
panel.addEventListener('mouseenter',()=>clearTimeout(megaT));
panel.addEventListener('mouseleave',()=>{if(mqFine.matches)later();});
panel.addEventListener('focusout',e=>{const to=e.relatedTarget;if(to&&!panel.contains(to)&&to!==btn)closeMegas();});
});
onMq(mqDesk,()=>closeMegas());
megaTriggers.forEach(btn=>btn.addEventListener('keydown',e=>{
if(e.key!=='ArrowDown')return;
const panel=$('#'+btn.getAttribute('aria-controls'));
if(!panel)return;
e.preventDefault();
if(btn.getAttribute('aria-expanded')!=='true')btn.click();
const f=$('a[href], button:not([disabled])',panel);
if(f)setTimeout(()=>f.focus(),30);
}));
let warmed=false;
const warm=()=>{if(warmed)return;warmed=true;DKY.loadNav({fallback:false}).catch(()=>{});};
const hnav=$('.hnav');
if(hnav)['pointerenter','focusin','touchstart'].forEach(ev=>hnav.addEventListener(ev,warm,{once:true,passive:true}));
$$('[data-open-drawer]').forEach(b=>b.addEventListener('pointerdown',warm,{once:true,passive:true}));
const idleWarm=()=>(window.requestIdleCallback?requestIdleCallback(warm,{timeout:4000}):setTimeout(warm,1800));
if(document.readyState==='complete')idleWarm();else window.addEventListener('load',idleWarm,{once:true});
const paintGarage=()=>{
const g=DKY.garage.get();
const gv=DKY.garage.gen();
const label=g?DKY.garage.label():'';
$$('[data-garage-text]').forEach(el=>{el.innerHTML=label?'<span class="garage-pre">Aracım: </span><strong>'+esc(label)+'</strong>':esc(el.getAttribute('data-garage-default')||'Araçlar');});
$$('[data-garage-current]').forEach(el=>{
el.innerHTML=label?'Aracım: <strong>'+esc(label)+'</strong>':'Aracınızı seçin; o araca uyan parçalar öne çıksın.';
});
$$('[data-garage-bar]').forEach(el=>{el.hidden=!g;});
$$('[data-garage-hub]').forEach(a=>{if(g)a.href=DKY.url.hub(g,gv&&gv.key);});
$$('[data-garage-parts]').forEach(a=>{if(g)a.href=DKY.url.cat({model:g,kasa:gv&&gv.key});});
$$('[data-garage-reset]').forEach(b=>{b.hidden=!g;});
const mark=(a,on)=>{a.classList.toggle('is-selected',on);if(on)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');};
$$('[data-garage-set]').forEach(a=>mark(a,!!g&&a.getAttribute('data-garage-set')===g));
$$('[data-nav-model]').forEach(a=>{
const gen=a.getAttribute('data-nav-gen');
mark(a,!!g&&a.getAttribute('data-nav-model')===g&&(!gen||(!!gv&&gv.key===gen)));
});
const btn=$('[data-garage-btn]');
if(btn)btn.setAttribute('aria-label',label?'Araçlar · Aracım: '+label:'Araçlar');
};
paintGarageRef=paintGarage;
DKY.paintGarage=paintGarage;
paintGarage();
document.addEventListener('dky:garage',paintGarage);
window.addEventListener('storage',e=>{if(e.key===GKEY||e.key===GGEN)paintGarage();});
const consent=$('#consent');
const setConsentH=()=>{
const on=!!consent&&consent.classList.contains('is-on')&&!consent.hidden;
root.style.setProperty('--consent-h',on?Math.ceil(consent.getBoundingClientRect().height)+'px':'0px');
};
if(consent){
new MutationObserver(setConsentH).observe(consent,{attributes:true,attributeFilter:['class','hidden']});
if('ResizeObserver'in window)new ResizeObserver(setConsentH).observe(consent);
onMq(mqSmall,setConsentH);
setConsentH();
}
$$('[data-store-path]').forEach(a=>{a.href=String(C.storeUrl||'https://www.dkyautoparts.com').replace(/\/$/,'')+a.getAttribute('data-store-path');});
document.addEventListener('click',e=>{
const t=e.target.closest('[data-open-drawer],[data-close-drawer],[data-open-search],[data-close-search],[data-open-quote],[data-close-quote],[data-add-quote],[data-qty],[data-quote-send],[data-garage-set],[data-garage-reset],[data-search-q],[data-track]');
if(!e.target.closest('.mega, [aria-controls^="mega-"]'))closeMegas();
if(!t)return;
if(t.matches('[data-open-drawer]'))DKY.openDrawer(t.getAttribute('data-open-drawer'));
else if(t.matches('[data-close-drawer]'))closeLayer($('#drawer'));
else if(t.matches('[data-open-search]')){keepFocus=closeFromDrawer();DKY.openSearch();}
else if(t.matches('[data-close-search]'))closeLayer($('#search'));
else if(t.matches('[data-open-quote]')){keepFocus=closeFromDrawer();DKY.openQuote();}
else if(t.matches('[data-close-quote]'))closeLayer($('#quote'));
else if(t.matches('[data-add-quote]')){
e.preventDefault();
const id=Number(t.dataset.addQuote);
if(registered.has(id))quote.add(registered.get(id));
else DKY.loadCatalog().then(cat=>{const p=cat.byId.get(id);if(p)quote.add(p);});
}else if(t.matches('[data-qty]')){
const id=Number(t.dataset.qty),d=Number(t.dataset.d);
const it=quote.items().find(i=>i.id===id);
if(it)quote.setQty(id,d<-1?0:it.qty+d);
}else if(t.matches('[data-quote-send]')){
DKY.track('generate_lead',{method:'whatsapp_quote',value:quote.total(),currency:'TRY'});
window.open(DKY.waLink(quote.message()),'_blank','noopener');
}else if(t.matches('[data-garage-set]')){
DKY.garage.set(t.getAttribute('data-garage-set'));
}else if(t.matches('[data-garage-reset]')){
DKY.garage.set(null);
DKY.toast('Araç seçimi kaldırıldı');
}else if(t.matches('[data-search-q]')){
const input=$('[data-search-input]');
if(input){input.value=t.getAttribute('data-search-q');input.focus();runSearch(input.value);}
}
if(t.matches('[data-track]'))DKY.track(t.dataset.track,{label:t.dataset.trackLabel||'',page:location.pathname});
});
document.addEventListener('keydown',e=>{
if(e.key==='Escape'){
const openMega=megaTriggers.find(b=>b.getAttribute('aria-expanded')==='true');
if(openMega){closeMegas();openMega.focus();return;}
closeLayer($('#search'));closeLayer($('#drawer'));closeLayer($('#quote'));
}
if(e.key==='Tab'&&openLayers().length)trapFocus(e);
if(e.key==='/'&&!/input|textarea|select/i.test(document.activeElement.tagName)&&!document.activeElement.isContentEditable){e.preventDefault();DKY.openSearch();}
});
const input=$('[data-search-input]');
if(input)input.addEventListener('input',()=>{clearTimeout(searchT);searchT=setTimeout(()=>runSearch(input.value),140);});
const SEL='.reveal:not(.is-in), .mask-reveal:not(.is-in), .stagger:not(.is-in), .line-reveal:not(.is-in)';
let io=null;
if('IntersectionObserver'in window)io=new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add('is-in');io.unobserve(en.target);}}),{rootMargin:'0px 0px -8% 0px'});
DKY.observe=r=>{
const list=$$(SEL,r||document);
if(r&&r.matches&&r.matches(SEL))list.push(r);
list.forEach(el=>(io&&!mqReduce.matches?io.observe(el):el.classList.add('is-in')));
};
DKY.observe();
pendingObserve.splice(0).forEach(r=>DKY.observe(r));
let lastSc=-1;
const onScroll=()=>{const s=window.scrollY>8;if(s!==lastSc&&header){header.classList.toggle('is-scrolled',s);lastSc=s;}};
onScroll();
window.addEventListener('scroll',onScroll,{passive:true});
document.dispatchEvent(new CustomEvent('dky:ready'));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();
