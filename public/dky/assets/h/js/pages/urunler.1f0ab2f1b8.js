(function(){
'use strict';
const D=window.DKY;
if(!D||!D.loadCatalog)return;
const C=window.DKY_CONFIG||{};
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=D.esc;
const ICON=id=>D.icon?D.icon(id):`<svg aria-hidden="true"><use href="/dky/assets/h/img/icons.9d3a84566c.svg#i-${id}"/></svg>`;
const nf=n=>Number(n||0).toLocaleString('tr-TR');
const lower=s=>String(s||'').toLocaleLowerCase('tr-TR');
const norm=D.norm||lower;
const PER=36;
const EAGER=12;
const MAX_CODES=60;
const MULTI_HITS=4;
const ANIM_MAX=24;
const MAKES=[
{key:'land-rover',label:'Land Rover',fams:[['range-rover','Range Rover'],['defender','Defender'],['discovery','Discovery'],['freelander','Freelander']]},
{key:'jaguar',label:'Jaguar',single:true,sub:'jaguar-'},
{key:'bmw',label:'BMW',single:true,sub:'bmw-'},
{key:'mini',label:'Mini',single:true},
{key:'pickup',label:'Off-road pick-up',order:['ford-ranger','toyota-hilux','mitsubishi-l200','isuzu-dmax','nissan-navara','vw-amarok','mercedes-x-class','jeep']}
];
const QUALITIES=[['orijinal','Orijinal'],['oem','OEM üretici'],['muadil','Muadil'],['aksesuar','Aksesuar']];
const Q_HINT={orijinal:'Araç üreticisinin kendi parçası',oem:'Üreticiye parça tedarik eden firma',muadil:'Uyumlu aftermarket parça',aksesuar:'Aksesuar / görünüm ürünü'};
const Q_ORDER={orijinal:0,oem:1,muadil:2,aksesuar:3};
const SHOW_OLD=C.showOldPrice!==false;
const SORTS=SHOW_OLD?['onerilen','fiyat-artan','fiyat-azalan','indirim','yeni']:['onerilen','fiyat-artan','fiyat-azalan','yeni'];
const DEAL=SHOW_OLD?{label:'Fırsat / indirimli',h1:'Fırsat ve indirimli ürünler',title:'Fırsat ve İndirimli Ürünler',set:'Stok ve fırsat'}
:{label:'Seçili ürünler',h1:'Seçili ürünler',title:'Seçili Ürünler',set:'Stok ve seçili ürünler'};
const showOld=p=>(window.DKY.showOld?window.DKY.showOld(p):SHOW_OLD&&p.oldPrice>p.price);
const PART_GROUPS=new Set(['aydinlatma','fren','suspansiyon','motor','sogutma','filtre','aktarma','elektrik','kaporta']);
const SITE=(C.siteUrl||'https://www.dkyautoparts.com').replace(/\/$/,'');
const PHONE=C.phone||'+902122852944';
const PHONE_L=C.phoneLabel||'+90 212 285 29 44';
const RMQ=matchMedia('(prefers-reduced-motion: reduce)');
const FINE=matchMedia('(hover: hover) and (pointer: fine)');
const SMALL=matchMedia('(max-width: 760px)');
const SPRING='cubic-bezier(.34,1.56,.64,1)';
const EASE='cubic-bezier(.2,.7,.2,1)';
const canAnim=()=>!!Element.prototype.animate&&!reduced();
function reduced(){
const m=D.motion;
if(m&&'reduced'in m)return typeof m.reduced==='function'?!!m.reduced():!!m.reduced;
return RMQ.matches;
}
function stagger(nodes,{y=10,step=22,dur=280}={}){
if(!canAnim())return;
const k=SMALL.matches?0.5:1;
nodes.slice(0,ANIM_MAX).forEach((n,i)=>n.animate(
[{opacity:0,transform:`translateY(${y*k}px)`},{opacity:1,transform:'none'}],
{duration:dur,delay:Math.min(i,12)*step*k,easing:EASE,fill:'backwards'}
));
}
const el={
h1:$('[data-cat-h1]'),lead:$('[data-cat-lead]'),crumbs:$('[data-cat-crumbs]'),
form:$('[data-cat-search]'),q:$('[data-cat-q]'),find:$('.cfind'),
make:$('[data-car-make]'),model:$('[data-car-model]'),
gOnly:$('[data-garage-only]'),gToggle:$('[data-garage-toggle]'),gN:$('[data-garage-n]'),
gSave:$('[data-garage-save]'),gClear:$('[data-garage-clear]'),gNote:$('[data-garage-note]'),
flt:$('[data-flt]'),fltPanel:$('[data-flt-panel]'),fltBody:$('[data-flt-body]'),fltShow:$('[data-flt-show]'),
fltOpen:$('[data-flt-open]'),fltCount:$('[data-flt-count]'),
results:$('.cat-results'),count:$('[data-cat-count]'),sort:$('[data-cat-sort]'),tabs:$('[data-sort-tabs]'),
chips:$('[data-cat-chips]'),mcode:$('[data-mcode]'),msg:$('[data-cat-msg]'),grid:$('[data-cat-grid]'),pager:$('[data-cat-pager]')
};
if(!el.grid)return;
if(!SHOW_OLD)$$('[data-sort="indirim"], option[value="indirim"]').forEach(n=>n.remove());
const DEF=()=>({q:'',model:'',grup:'',marka:[],kalite:[],min:null,max:null,stok:false,firsat:false,sirala:'onerilen',sayfa:1});
let S=DEF();
let cat=null,P=[],ORDER={},CODE=new Map(),BRANDS=[],brandByKey=new Map();
let view={from:1};
let R=null;
let QC={key:null};
let optEls=new Map();
let brandAll=false;
let restoreY=null;
let lastTracked='';
let MODEL_KEYS=new Set(),MAKE_OF=new Map(),MAKE_MODELS=new Map();
const brandKey=s=>String(s||'').toLocaleUpperCase('tr-TR').replace(/İ/g,'I').trim();
const uniq=a=>[...new Set(a)];
const splitList=v=>(v||'').split(',').map(s=>s.trim()).filter(Boolean);
const isCodeTok=t=>t.length>=5&&(t.match(/\d/g)||[]).length>=3;
const codeTokens=p=>uniq((String(p.code||'').toUpperCase().match(/[A-Z0-9]+/g)||[]).filter(isCodeTok));
const EN_I=/\b(DISCOVERY|DISCO|HILUX|MITSUBISHI|NISSAN|ISUZU|MINI|VIGO|KIT|SPOILER|AUTOBIOGRAPHY|DIESEL|TRITON|INTERCOOLER|MOONVISOR|TERRAFIRMA|INCH|LIMITED|EDITION|DYNAMIC|PREMIUM|PLATINUM|SILVER|WHITE|LIGHT|PIRELLI|BRITPART|VISION|GRILLE|MIRROR|SIDE)\b/g;
const prepName=s=>String(s||'').replace(EN_I,m=>m[0]+m.slice(1).toLowerCase());
const T=s=>D.title(prepName(s));
const debounce=(fn,ms)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms);};};
S=parse(location.search);
view.from=S.sayfa;
function parse(search){
const u=new URLSearchParams(search);
const s=DEF();
s.q=(u.get('q')||'').trim().slice(0,800);
s.model=(u.get('model')||'').trim();
s.grup=(u.get('grup')||'').trim();
s.marka=splitList(u.get('marka'));
s.kalite=splitList(u.get('kalite'));
const mn=parseFloat(u.get('min')),mx=parseFloat(u.get('max'));
s.min=isFinite(mn)&&mn>0?mn:null;
s.max=isFinite(mx)&&mx>0?mx:null;
s.stok=u.get('stok')==='1';
s.firsat=u.get('firsat')==='1';
s.sirala=SORTS.includes(u.get('sirala'))?u.get('sirala'):'onerilen';
s.sayfa=Math.max(1,parseInt(u.get('sayfa'),10)||1);
return s;
}
const isVirtual=k=>k==='land-rover'||k==='pickup';
const validModel=k=>MODEL_KEYS.has(k)||isVirtual(k);
const makeOf=k=>(isVirtual(k)?k:MAKE_OF.get(k)||'');
const makeDef=k=>MAKES.find(m=>m.key===k);
const vLabel=k=>(isVirtual(k)?makeDef(k).label:cat.modelLabel(k));
const modelMatch=(p,k)=>(isVirtual(k)?p.__mk.includes(k):p.models.includes(k));
function sanitize(){
if(S.model&&!validModel(S.model))S.model='';
if(S.grup&&!cat.groups.some(g=>g.key===S.grup))S.grup='';
S.marka=uniq(S.marka.map(brandKey).filter(k=>brandByKey.has(k)));
S.kalite=uniq(S.kalite.filter(k=>k in Q_ORDER));
if(S.min!=null&&S.max!=null&&S.min>S.max)[S.min,S.max]=[S.max,S.min];
}
function toQuery(s){
const u=new URLSearchParams();
if(s.model)u.set('model',s.model);
if(s.grup)u.set('grup',s.grup);
if(s.q)u.set('q',s.q);
if(s.marka.length)u.set('marka',s.marka.map(k=>(brandByKey.get(k)||{name:k}).name).join(','));
if(s.kalite.length)u.set('kalite',s.kalite.join(','));
if(s.min!=null)u.set('min',s.min);
if(s.max!=null)u.set('max',s.max);
if(s.stok)u.set('stok','1');
if(s.firsat)u.set('firsat','1');
if(s.sirala!=='onerilen')u.set('sirala',s.sirala);
if(s.sayfa>1)u.set('sayfa',s.sayfa);
const str=u.toString().replace(/%2C/gi,',');
return location.pathname+(str?'?'+str:'');
}
function writeURL(){
const url=toQuery(S);
if(url!==location.pathname+location.search){
try{history.replaceState(history.state,'',url);}catch(e){}
}
}
function index(){
P=cat.products;
MODEL_KEYS=new Set(cat.models.map(m=>m.key));
MAKES.forEach(mk=>{
let list;
if(mk.single)list=cat.models.filter(m=>m.key===mk.key||(mk.sub&&m.key.startsWith(mk.sub)));
else if(mk.fams)list=cat.models.filter(m=>mk.fams.some(f=>f[0]===m.family));
else list=mk.order.map(k=>cat.models.find(m=>m.key===k)).filter(Boolean)
.concat(cat.models.filter(m=>m.family==='offroad'&&!mk.order.includes(m.key)));
MAKE_MODELS.set(mk.key,list);
list.forEach(m=>MAKE_OF.set(m.key,mk.key));
});
const bmap=new Map();
for(const p of P){
let q=D.quality(p),fix=false;
if(!q){q=D.quality(Object.assign({},p,{brand:brandKey(p.brand)}));fix=!!q;}
p.__q=q;p.__qk=q?q.key:'';p.__fixq=fix;
p.__bk=brandKey(p.brand);
p.__deal=!!(p.opportunity||p.discount>0);
p.__rec=(p.inStock?4:0)+(p.image?2:0)+(p.bestSeller?1:0);
p.__mk=uniq(p.models.map(m=>MAKE_OF.get(m)).filter(Boolean));
if(p.__bk){
let b=bmap.get(p.__bk);
if(!b)bmap.set(p.__bk,(b={key:p.__bk,names:{},total:0}));
b.total++;
b.names[p.brand]=(b.names[p.brand]||0)+1;
}
for(const t of codeTokens(p)){const a=CODE.get(t);a?a.push(p):CODE.set(t,[p]);}
}
BRANDS=[...bmap.values()].map(b=>({key:b.key,total:b.total,name:Object.entries(b.names).sort((x,y)=>y[1]-x[1])[0][0]}))
.sort((a,b)=>b.total-a.total||a.name.localeCompare(b.name,'tr'));
brandByKey=new Map(BRANDS.map(b=>[b.key,b]));
const idx=P.map((_,i)=>i);
const by=fn=>idx.slice().sort(fn).map(i=>P[i]);
const price=p=>(p.price>0?p.price:Infinity);
ORDER.onerilen=by((a,b)=>P[b].__rec-P[a].__rec||a-b);
ORDER['fiyat-artan']=by((a,b)=>price(P[a])-price(P[b])||a-b);
ORDER['fiyat-azalan']=by((a,b)=>P[b].price-P[a].price||a-b);
ORDER.indirim=by((a,b)=>P[b].discount-P[a].discount||P[b].__rec-P[a].__rec||a-b);
ORDER.yeni=by((a,b)=>(P[b].isNew-P[a].isNew)||(P[b].id-P[a].id));
}
function splitCodes(q){
const parts=q.split(/[\s,;|]+/).map(s=>s.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g,'')).filter(Boolean);
if(parts.length<2)return null;
const out=[],seen=new Set();
for(const raw of parts){
const cmp=raw.toUpperCase().replace(/[^A-Z0-9]/g,'');
if(!isCodeTok(cmp))return null;
if(!seen.has(cmp)){seen.add(cmp);out.push({raw:raw.toUpperCase(),cmp});}
}
return out.length>=2?out.slice(0,MAX_CODES):null;
}
const byQuality=(a,b)=>(b.inStock-a.inStock)||((Q_ORDER[a.__qk]??9)-(Q_ORDER[b.__qk]??9))||(a.price-b.price);
function findCode(cmp){
const exact=(CODE.get(cmp)||[]).slice().sort(byQuality);
const seen=new Set(exact.map(p=>p.id));
const low=cmp.toLowerCase();
const partial=[];
for(const p of P)if(!seen.has(p.id)&&p._code.includes(low))partial.push(p);
return exact.concat(partial.sort(byQuality));
}
function querySet(){
const q=S.q.trim();
if(q.length<2)return null;
if(QC.key===q)return QC;
const codes=splitCodes(q);
if(codes){
const items=codes.map(c=>({code:c.raw,cmp:c.cmp,list:findCode(c.cmp)}));
const rank=new Map();
items.forEach(it=>it.list.forEach(p=>{if(!rank.has(p.id))rank.set(p.id,rank.size);}));
QC={key:q,multi:items,rank};
}else{
const hits=D.search(cat,q.replace(/[,;|]+/g,' '),{limit:1e6});
QC={key:q,multi:null,rank:new Map(hits.map((p,i)=>[p.id,i]))};
}
return QC;
}
function fails(p,mk,kk){
return(S.model&&!modelMatch(p,S.model)?1:0)
|(S.grup&&p.group!==S.grup?2:0)
|(mk.size&&!mk.has(p.__bk)?4:0)
|(kk.size&&!kk.has(p.__qk)?8:0)
|((S.min!=null&&p.price<S.min)||(S.max!=null&&p.price>S.max)?16:0)
|(S.stok&&!p.inStock?32:0)
|(S.firsat&&!p.__deal?64:0);
}
const single=f=>f&&!(f&(f-1));
const inc=(m,k)=>m.set(k,(m.get(k)||0)+1);
function compute(){
const qs=querySet();
const rank=qs?qs.rank:null;
const mk=new Set(S.marka),kk=new Set(S.kalite);
const cnt={model:new Map(),make:new Map(),modelAll:0,grup:new Map(),grupAll:0,marka:new Map(),kalite:new Map(),stok:0,firsat:0,pmin:Infinity,pmax:0};
const list=[];
const src=ORDER[S.sirala]||ORDER.onerilen;
for(let i=0;i<src.length;i++){
const p=src[i];
if(rank&&!rank.has(p.id))continue;
const f=fails(p,mk,kk);
if(f&&!single(f))continue;
if(!f)list.push(p);
if(!f||f===1){
cnt.modelAll++;
for(const m of p.models)inc(cnt.model,m);
for(const m of p.__mk)inc(cnt.make,m);
}
if(!f||f===2){cnt.grupAll++;inc(cnt.grup,p.group);}
if(!f||f===4)inc(cnt.marka,p.__bk);
if(!f||f===8)inc(cnt.kalite,p.__qk);
if((!f||f===16)&&p.price>0){if(p.price<cnt.pmin)cnt.pmin=p.price;if(p.price>cnt.pmax)cnt.pmax=p.price;}
if((!f||f===32)&&p.inStock)cnt.stok++;
if((!f||f===64)&&p.__deal)cnt.firsat++;
}
if(rank&&S.sirala==='onerilen')list.sort((a,b)=>rank.get(a.id)-rank.get(b.id));
else if(!rank&&S.sirala==='onerilen'){
const g=garageKey();
if(g&&S.model!==g){
const fit=[],rest=[];
for(const p of list)(p.models.includes(g)?fit:rest).push(p);
list.length=0;list.push(...fit,...rest);
}
}
return{list,cnt,qs,mk,kk};
}
const countFor=(cnt,k)=>(isVirtual(k)?cnt.make.get(k):cnt.model.get(k))||0;
const garageKey=()=>{const g=D.garage.get();return g&&cat&&MODEL_KEYS.has(g)?g:null;};
const modelFam=k=>(k==='pickup'?'offroad':k==='land-rover'?'range-rover':(cat.models.find(m=>m.key===k)||{}).family||'');
const qLabel=k=>(QUALITIES.find(q=>q[0]===k)||[k,k])[1];
const activeCount=()=>(S.model?1:0)+(S.grup?1:0)+S.marka.length+S.kalite.length+(S.min!=null||S.max!=null?1:0)+(S.stok?1:0)+(S.firsat?1:0);
const priceLabel=()=>S.min!=null&&S.max!=null?`${D.fmtShort(S.min)} – ${D.fmtShort(S.max)}`:S.min!=null?`${D.fmtShort(S.min)} ve üzeri`:`${D.fmtShort(S.max)} ve altı`;
const short=(s,n)=>(s.length>n?s.slice(0,n-1)+'…':s);
function card(p,eager){
const fix={name:prepName(p.name)};
if(p.__fixq)fix.brand=p.__bk;
return D.card(Object.assign({},p,fix),{eager});
}
const capFirst=t=>t.charAt(0).toLocaleUpperCase('tr-TR')+t.slice(1);
function heading(){
const m=S.model?vLabel(S.model):'';
const g=S.grup?cat.groupLabel(S.grup):'';
const gl=lower(g);
const multi=R&&R.qs&&R.qs.multi;
const part=PART_GROUPS.has(S.grup),other=S.grup==='diger';
const gH=other?'diğer parçalar':part?`${gl} parçaları`:gl;
const gT=other?'Diğer Parçalar':part?`${g} Parçaları`:g;
if(m&&g)return{h1:`${m} ${gH}`,title:`${m} ${gT}`};
if(m){
const fam=modelFam(S.model);
const h=fam==='offroad'?'aksesuar ve ekipmanları':fam==='other'?'yedek parçaları':'yedek parça ve aksesuarları';
const t=fam==='offroad'?'Aksesuar ve Ekipmanları':fam==='other'?'Yedek Parçaları':'Yedek Parça ve Aksesuarları';
return{h1:`${m} ${h}`,title:`${m} ${t}`};
}
if(g)return{h1:capFirst(other||part?gH:`${gl} ürünleri`),title:other||part?gT:`${g} Ürünleri`};
if(multi)return{h1:'Parça numarası listesi',title:'Parça Numarası Listesi'};
if(S.q)return{h1:`“${short(S.q,40)}” için arama sonuçları`,title:`“${short(S.q,40)}” Arama Sonuçları`};
if(S.marka.length===1){const b=brandByKey.get(S.marka[0]).name;return{h1:`${b} ürünleri`,title:`${b} Ürünleri`};}
if(S.firsat)return{h1:DEAL.h1,title:DEAL.title};
return{h1:'Yedek parça kataloğu',title:'Yedek Parça ve 4x4 Ekipman Kataloğu'};
}
function scopeCount(){
let n=0;
for(const p of P)if((!S.model||modelMatch(p,S.model))&&(!S.grup||p.group===S.grup))n++;
return n;
}
function leadText(total){
const m=S.model?vLabel(S.model):'';
const gl=S.grup?lower(cat.groupLabel(S.grup)):'';
const tail='Orijinal, OEM üretici ve muadil seçenekler KDV dahil açık fiyatla; stoktaki ürünlerde 15.00’e kadar verilen siparişler aynı gün kargoda. Emin değilseniz şasi numaranızla WhatsApp’tan doğrulatın.';
if(R&&R.qs&&R.qs.multi)return'Yapıştırdığınız her parça numarasının katalogdaki karşılıkları aşağıda. Bulunamayanları tek tıkla WhatsApp’tan sorun; katalogda görünmeyen parçalar için de tedarik desteği veriyoruz.';
if(m||gl){
const n=nf(scopeCount());
const what=m&&gl?`${m} için ${n} ${gl} ürünü.`:m?`${m} için ${n} parça ve aksesuar.`:`Tüm araçlar için ${n} ${gl} ürünü.`;
return`${what} ${tail}`;
}
if(S.q)return`“${short(S.q,60)}” araması için ${nf(total)} sonuç. Aradığınızı göremiyorsanız parça numarasını veya şasi numaranızı WhatsApp’tan gönderin; katalogda görünmeyen parçalar için de tedarik desteği veriyoruz.`;
return`Land Rover, Jaguar, BMW, Mini ve off-road pick-up’lar için ${nf(P.length)} parça ve aksesuar. ${tail}`;
}
function setMeta(sel,attr,val){
let m=$(sel);
if(!m){
m=document.createElement(sel.startsWith('link')?'link':'meta');
const k=sel.match(/\[(\w+(?::\w+)?)="([^"]+)"\]/);
if(k)m.setAttribute(k[1],k[2]);
document.head.appendChild(m);
}
m.setAttribute(attr,val);
}
function renderHead(total){
const h=heading();
if(el.h1.textContent!==h.h1)el.h1.textContent=h.h1;
const lead=leadText(total);
el.lead.textContent=lead;
const title=`${h.title} | DKY Auto Parts`;
document.title=title;
let desc='';
for(const sent of lead.match(/[^.;]+[.;]?/g)||[]){const t=(desc+sent).trim();if(t.length>155)break;desc=t+' ';}
desc=desc.trim()||lead.slice(0,152).replace(/\s+\S*$/,'')+'…';
setMeta('meta[name="description"]','content',desc);
setMeta('meta[property="og:title"]','content',title);
setMeta('meta[property="og:description"]','content',desc);
const cq=new URLSearchParams();
if(S.model)cq.set('model',S.model);
if(S.grup)cq.set('grup',S.grup);
const canon=`${SITE}/urunler.html${cq.toString()?'?'+cq.toString():''}`;
setMeta('link[rel="canonical"]','href',canon);
setMeta('meta[property="og:url"]','content',canon);
const thin=!!S.q||S.marka.length>0||S.kalite.length>0||S.min!=null||S.max!=null||S.sayfa>1;
setMeta('meta[name="robots"]','content','noindex,nofollow');
const crumbs=['<li><a href="/dky/">Ana sayfa</a></li>'];
const any=S.model||S.grup||S.q||activeCount();
crumbs.push(any?'<li><a href="/dky/urunler.html">Ürünler</a></li>':'<li aria-current="page">Ürünler</li>');
if(S.model){
const mk=makeOf(S.model);
if(!isVirtual(S.model)&&mk&&(isVirtual(mk)||mk!==S.model))crumbs.push(`<li><a href="/dky/urunler.html?model=${esc(mk)}">${esc(vLabel(mk))}</a></li>`);
crumbs.push(S.grup?`<li><a href="/dky/urunler.html?model=${esc(S.model)}">${esc(vLabel(S.model))}</a></li>`:`<li aria-current="page">${esc(vLabel(S.model))}</li>`);
}
if(S.grup)crumbs.push(`<li aria-current="page">${esc(cat.groupLabel(S.grup))}</li>`);
el.crumbs.innerHTML=crumbs.join('');
}
const opt=(type,name,value,label,extra='',cls='')=>
`<label class="fopt${cls?' '+cls:''}" data-opt="${name}:${esc(value)}"><input type="${type}" name="${name}" value="${esc(value)}"><span class="fopt__l">${esc(label)}${extra}</span><span class="fopt__n" data-n></span></label>`;
const fset=(key,title,body,open=true)=>
`<details class="fset" data-fset="${key}"${open?' open':''}><summary><span class="fset__t">${title}</span><span class="fset__sel" data-sel></span>${ICON('chevron')}</summary><div class="fset__body">${body}</div></details>`;
function buildFilters(){
const models=opt('radio','f-model','','Tüm araçlar')+MAKES.map(mk=>{
const head=opt('radio','f-model',mk.key,mk.label,'','fopt--make');
if(mk.single&&!mk.sub)return head;
let subs='';
if(mk.fams){
subs=mk.fams.map(([fk,fl])=>{
const ms=MAKE_MODELS.get(mk.key).filter(m=>m.family===fk);
return ms.length?`<p class="fset__sub">${esc(fl)}</p>`+ms.map(m=>opt('radio','f-model',m.key,m.label,'','fopt--sub')).join(''):'';
}).join('');
}else subs=MAKE_MODELS.get(mk.key).filter(m=>m.key!==mk.key).map(m=>opt('radio','f-model',m.key,m.label,'','fopt--sub')).join('');
return head+`<div class="fopt-group">${subs}</div>`;
}).join('');
const gTotals=new Map();
for(const p of P)inc(gTotals,p.group);
const groups=opt('radio','f-grup','','Tüm gruplar')+cat.groups.slice()
.sort((a,b)=>(a.key==='diger')-(b.key==='diger')||(gTotals.get(b.key)||0)-(gTotals.get(a.key)||0))
.map(g=>opt('radio','f-grup',g.key,g.label)).join('');
const status=`
      <label class="switch switch--row" data-opt="f-stok:1"><input type="checkbox" role="switch" name="f-stok" value="1"><span class="switch__ui" aria-hidden="true"></span><span class="switch__text">Stokta olanlar</span><span class="fopt__n" data-n></span></label>
      <label class="switch switch--row" data-opt="f-firsat:1"><input type="checkbox" role="switch" name="f-firsat" value="1"><span class="switch__ui" aria-hidden="true"></span><span class="switch__text">${DEAL.label}</span><span class="fopt__n" data-n></span></label>`;
const quality=QUALITIES.map(([k,l])=>opt('checkbox','f-kalite',k,l,`<small class="fopt__h">${esc(Q_HINT[k])}</small>`)).join('');
const brands=`
      <div class="fsearch"><label class="sr-only" for="f-brand-q">Marka ara</label>${ICON('search')}<input class="input fsearch__in" id="f-brand-q" type="search" placeholder="Marka ara" autocomplete="off" data-brand-q></div>
      <div class="fset__list" data-brand-list>${BRANDS.map(b=>opt('checkbox','f-marka',b.key,b.name)).join('')}</div>
      <p class="fset__none" data-brand-none hidden>Eşleşen marka yok.</p>
      <button class="fset__more" type="button" data-brand-more aria-expanded="false">Tüm markalar (${BRANDS.length})</button>`;
const price=`
      <div class="frange">
        <div class="field"><label for="f-min">En az (₺)</label><input class="input" id="f-min" name="f-min" type="number" inputmode="numeric" min="0" step="1" autocomplete="off"></div>
        <span class="frange__sep" aria-hidden="true">–</span>
        <div class="field"><label for="f-max">En çok (₺)</label><input class="input" id="f-max" name="f-max" type="number" inputmode="numeric" min="0" step="1" autocomplete="off"></div>
      </div>
      <button class="btn btn--secondary btn--ghost btn--sm btn--block" type="button" data-price-apply>Fiyatı uygula</button>
      <p class="field__hint" data-price-hint></p>`;
const plain=(key,title,body)=>`<div class="fset fset--plain" data-fset="${key}"><p class="fset__title">${title}</p><div class="fset__body">${body}</div></div>`;
el.fltBody.innerHTML=
fset('model','Araç',`<div class="fset__list fset__list--scroll">${models}</div>`)+
fset('grup','Parça grubu',`<div class="fset__list fset__list--scroll">${groups}</div>`)+
plain('durum',DEAL.set,status)+
fset('fiyat','Fiyat aralığı',price,S.min!=null||S.max!=null)+
fset('marka','Marka',brands,S.marka.length>0)+
fset('kalite','Kalite',quality,S.kalite.length>0);
optEls=new Map();
$$('[data-opt]',el.fltBody).forEach(l=>optEls.set(l.dataset.opt,{label:l,input:$('input',l),n:$('[data-n]',l)}));
brandVisibility();
}
function setOpt(key,n,checked){
const o=optEls.get(key);
if(!o)return;
o.input.checked=checked;
const t=nf(n);
if(o.n.textContent!==t)o.n.textContent=t;
const zero=!n&&!checked;
o.input.disabled=zero;
o.label.classList.toggle('is-zero',zero);
}
function brandVisibility(){
const qIn=$('[data-brand-q]',el.fltBody);
const term=qIn?norm(qIn.value.trim()):'';
let shown=0;
BRANDS.forEach((b,i)=>{
const o=optEls.get('f-marka:'+b.key);
if(!o)return;
const show=term?norm(b.name).includes(term):(brandAll||i<10||S.marka.includes(b.key));
o.label.hidden=!show;
if(show)shown++;
});
const more=$('[data-brand-more]',el.fltBody),none=$('[data-brand-none]',el.fltBody);
if(more){
more.hidden=!!term||BRANDS.length<=10;
more.textContent=brandAll?'Daha az göster':`Tüm markalar (${BRANDS.length})`;
more.setAttribute('aria-expanded',String(brandAll));
}
if(none)none.hidden=!term||shown>0;
const list=$('[data-brand-list]',el.fltBody);
if(list)list.classList.toggle('fset__list--scroll',brandAll||!!term);
}
function renderFilters(cnt){
setOpt('f-model:',cnt.modelAll,!S.model);
MAKES.forEach(mk=>{
setOpt('f-model:'+mk.key,countFor(cnt,mk.key),S.model===mk.key);
if(!mk.single||mk.sub)MAKE_MODELS.get(mk.key).filter(m=>m.key!==mk.key).forEach(m=>setOpt('f-model:'+m.key,cnt.model.get(m.key)||0,S.model===m.key));
});
setOpt('f-grup:',cnt.grupAll,!S.grup);
cat.groups.forEach(g=>setOpt('f-grup:'+g.key,cnt.grup.get(g.key)||0,S.grup===g.key));
QUALITIES.forEach(([k])=>setOpt('f-kalite:'+k,cnt.kalite.get(k)||0,S.kalite.includes(k)));
BRANDS.forEach(b=>setOpt('f-marka:'+b.key,cnt.marka.get(b.key)||0,S.marka.includes(b.key)));
setOpt('f-stok:1',cnt.stok,S.stok);
setOpt('f-firsat:1',cnt.firsat,S.firsat);
brandVisibility();
const sel=(k,t)=>{const s=$(`[data-fset="${k}"] [data-sel]`,el.fltBody);if(s)s.textContent=t;};
sel('model',S.model?vLabel(S.model):'');
sel('grup',S.grup?cat.groupLabel(S.grup):'');
sel('kalite',S.kalite.length?String(S.kalite.length):'');
sel('marka',S.marka.length?String(S.marka.length):'');
sel('fiyat',S.min!=null||S.max!=null?priceLabel():'');
const mi=$('#f-min'),ma=$('#f-max');
if(mi&&document.activeElement!==mi)mi.value=S.min!=null?S.min:'';
if(ma&&document.activeElement!==ma)ma.value=S.max!=null?S.max:'';
const has=cnt.pmax>0;
if(mi)mi.placeholder=has?Math.floor(cnt.pmin).toString():'0';
if(ma)ma.placeholder=has?Math.ceil(cnt.pmax).toString():'';
const hint=$('[data-price-hint]',el.fltBody);
if(hint)hint.textContent=has?`Bu sonuçlarda ${D.fmtShort(cnt.pmin)} – ${D.fmtShort(cnt.pmax)}`:'';
const n=activeCount();
el.fltCount.textContent=n?`(${n})`:'';
$$('[data-clear-all]',el.flt).forEach(b=>{b.hidden=!n&&!S.q;});
}
function renderCar(cnt){
const g=garageKey();
const vk=S.model||g||'';
const mk=vk?makeOf(vk):'';
el.make.innerHTML='<option value="">Tüm markalar</option>'+
MAKES.map(m=>`<option value="${m.key}">${esc(m.label)} (${nf(countFor(cnt,m.key))})</option>`).join('');
el.make.value=mk;
el.make.disabled=false;
const def=makeDef(mk);
if(!def){
el.model.innerHTML='<option value="">Önce marka seçin</option>';
el.model.disabled=true;
}else if(def.single){
el.model.innerHTML=`<option value="">${esc(def.label)} · tüm modeller</option>`;
el.model.disabled=true;
}else{
el.model.innerHTML=`<option value="">Tüm ${esc(def.label)} modelleri</option>`+
MAKE_MODELS.get(mk).map(m=>`<option value="${m.key}">${esc(m.label)} (${nf(cnt.model.get(m.key)||0)})</option>`).join('');
el.model.disabled=false;
el.model.value=!isVirtual(vk)&&MAKE_OF.get(vk)===mk?vk:'';
}
el.find.classList.toggle('has-car',!!g);
el.gOnly.hidden=!g;
el.gToggle.checked=!!g&&S.model===g;
el.gN.textContent=g?nf(cnt.model.get(g)||0):'';
el.gClear.hidden=!g;
const save=S.model&&!isVirtual(S.model)&&S.model!==g;
el.gSave.hidden=!save;
if(save)el.gSave.textContent=`Garajıma kaydet: ${vLabel(S.model)}`;
el.gNote.textContent=g
?`Aracım: ${vLabel(g)}`
:isVirtual(S.model)?`${vLabel(S.model)} modelinizi seçin; uyumlu parçalar öne çıksın.`:'Aracınızı seçin; uyumlu parçalar öne çıksın.';
}
function renderSort(){
if(el.sort.value!==S.sirala)el.sort.value=S.sirala;
if(!el.tabs)return;
$$('[data-sort]',el.tabs).forEach(b=>{
const on=b.dataset.sort===S.sirala;
b.setAttribute('aria-checked',String(on));
b.tabIndex=on?0:-1;
});
moveInd();
}
function moveInd(instant){
if(!el.tabs)return;
const ind=$('.sorttabs__ind',el.tabs),b=$(`[data-sort="${S.sirala}"]`,el.tabs);
if(!ind||!b||!b.offsetWidth)return;
const still=instant||reduced();
if(still)ind.style.transition='none';
ind.style.transform=`translateX(${b.offsetLeft}px) scaleX(${b.offsetWidth/100})`;
if(still){ind.getBoundingClientRect();ind.style.transition='';}
}
function chipList(){
const chips=[];
if(S.q)chips.push(['q','',`Arama: “${short(S.q,28)}”`]);
if(S.model)chips.push(['model','',vLabel(S.model)]);
if(S.grup)chips.push(['grup','',cat.groupLabel(S.grup)]);
S.kalite.forEach(k=>chips.push(['kalite',k,qLabel(k)]));
S.marka.forEach(k=>chips.push(['marka',k,brandByKey.get(k).name]));
if(S.min!=null||S.max!=null)chips.push(['fiyat','',priceLabel()]);
if(S.stok)chips.push(['stok','','Stokta']);
if(S.firsat)chips.push(['firsat','',DEAL.label]);
return chips;
}
function makeChip([k,v,l]){
const b=document.createElement('button');
b.type='button';
b.className='chip';
b.dataset.id=k+':'+v;
b.dataset.chip=k;
b.dataset.v=v;
b.setAttribute('aria-label',`Filtreyi kaldır: ${l}`);
b.innerHTML=`<span>${esc(l)}</span>${ICON('close')}`;
return b;
}
function renderChips(){
const want=chipList();
const ids=new Set(want.map(c=>c[0]+':'+c[1]));
const live=new Map($$('.chip:not(.is-leave)',el.chips).map(n=>[n.dataset.id,n]));
const anim=canAnim();
let clear=$('.chips__clear',el.chips);
live.forEach((n,id)=>{
if(ids.has(id))return;
if(!anim){n.remove();return;}
n.classList.add('is-leave');n.tabIndex=-1;n.setAttribute('aria-hidden','true');
n.animate([{transform:'scale(1)',opacity:1},{transform:'scale(.6)',opacity:0}],{duration:170,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'})
.onfinish=()=>{n.remove();if(!$('.chip',el.chips)){el.chips.hidden=true;const c=$('.chips__clear',el.chips);if(c)c.remove();}};
});
let prev=null;
want.forEach(c=>{
const id=c[0]+':'+c[1];
let n=live.get(id);
if(!n){
n=makeChip(c);
if(prev)prev.after(n);else el.chips.prepend(n);
if(anim)n.animate([{transform:'scale(.55)',opacity:0},{transform:'scale(1)',opacity:1}],{duration:360,easing:SPRING});
}else{
const sp=$('span',n);
if(sp.textContent!==c[2]){sp.textContent=c[2];n.setAttribute('aria-label',`Filtreyi kaldır: ${c[2]}`);}
if(prev&&prev.nextElementSibling!==n)prev.after(n);
}
prev=n;
});
if(want.length){
el.chips.hidden=false;
if(!clear){
clear=document.createElement('button');
clear.type='button';
clear.className='chips__clear';
clear.setAttribute('data-clear-all','');
clear.textContent='Tümünü temizle';
el.chips.append(clear);
if(anim)clear.animate([{opacity:0},{opacity:1}],{duration:220});
}else el.chips.append(clear);
}else if(!$('.chip',el.chips)){
el.chips.hidden=true;
if(clear)clear.remove();
}
}
function renderMulti(qs,animate){
if(!qs||!qs.multi){el.mcode.hidden=true;el.mcode.innerHTML='';return;}
const mk=new Set(S.marka),kk=new Set(S.kalite);
const rows=qs.multi.map(it=>({...it,vis:it.list.filter(p=>!fails(p,mk,kk))}));
const found=rows.filter(r=>r.list.length),miss=rows.filter(r=>!r.list.length);
const missMsg=`Merhaba, aşağıdaki parça numaraları sitede görünmüyor. Tedarik edebilir misiniz?\n${miss.map(r=>'- '+r.code).join('\n')}\n\nŞasi (VIN) no: `;
const hit=p=>{
const q=p.__q;
return`<li class="mhit${p.inStock?'':' is-out'}">
        <img src="${esc(D.img(p.image,120))}" alt="" width="56" height="56" loading="lazy" decoding="async">
        <div class="mhit__main">
          <a class="mhit__name" href="${D.productUrl(p)}">${esc(T(p.name))}</a>
          <div class="mhit__meta"><span class="code-chip">${esc(p.code)}</span><span class="mhit__brand">${esc(p.brand)}</span>${q?`<span class="q-badge q-badge--${q.key}" title="${esc(q.hint)}">${esc(q.label)}</span>`:''}<span class="mhit__stock">${ICON(p.inStock?'check':'clock')}${p.inStock?'Stokta':'Tedarik edilir'}</span></div>
        </div>
        <div class="mhit__price">${showOld(p)?`<span class="price__old">${D.fmt(p.oldPrice)}</span>`:''}<span class="price__now">${D.fmt(p.price)}</span></div>
        <button class="icon-btn mhit__add" type="button" data-add-quote="${p.id}" aria-label="${esc(T(p.name))} — teklif listesine ekle">${ICON('plus')}</button>
      </li>`;
};
const row=r=>{
if(!r.list.length){
return`<li class="mrow is-miss">
          <div class="mrow__code"><span class="mrow__no mono">${esc(r.code)}</span><span class="mrow__state">${ICON('info')}Katalogda yok</span></div>
          <div class="mrow__miss"><p>Bu numara listede görünmüyor; tedarik edebiliriz.</p>
            <a class="btn btn--wa btn--secondary btn--sm" href="#" data-wa="${esc(`Merhaba, şu parça numarasını arıyorum: ${r.code}\nŞasi (VIN) no: `)}" data-track="whatsapp_click" data-track-label="multi_code_missing">${ICON('whatsapp')}WhatsApp'tan sor</a></div>
        </li>`;
}
const hidden=r.list.length-r.vis.length;
const more=r.vis.length>MULTI_HITS?`<a class="mrow__more" href="/dky/urunler.html?q=${encodeURIComponent(r.code)}">+${r.vis.length-MULTI_HITS} seçenek daha</a>`:'';
return`<li class="mrow">
        <div class="mrow__code"><span class="mrow__no mono">${esc(r.code)}</span><span class="mrow__state">${ICON('check')}${r.list.length} eşleşme</span></div>
        ${r.vis.length?`<ul class="mrow__hits">${r.vis.slice(0,MULTI_HITS).map(hit).join('')}</ul>${more}`:''}
        ${hidden?`<p class="mrow__note">${hidden} eşleşme seçili filtreler nedeniyle gizlendi.</p>`:''}
      </li>`;
};
el.mcode.hidden=false;
el.mcode.innerHTML=`
      <div class="mcode__head">
        <div>
          <p class="eyebrow">Parça numarasıyla hızlı sorgu</p>
          <h2 class="mcode__title">${rows.length} numaradan ${found.length} tanesi bulundu</h2>
        </div>
        <div class="mcode__actions">
          ${found.some(r=>r.vis.length)?`<button class="btn btn--primary btn--red btn--sm" type="button" data-mcode-add>${ICON('clipboard')}Bulunanları listeye ekle</button>`:''}
          ${miss.length?`<a class="btn btn--wa btn--secondary btn--sm" href="#" data-wa="${esc(missMsg)}" data-track="whatsapp_click" data-track-label="multi_code_missing_all">${ICON('whatsapp')}Bulunamayanları sor (${miss.length})</a>`:''}
        </div>
      </div>
      <ol class="mcode__list">${rows.map(row).join('')}</ol>`;
el.mcode._rows=rows;
D.bindWa(el.mcode);
if(animate)stagger($$('.mrow',el.mcode),{y:8,step:40});
}
function waEmptyMsg(){
const parts=['Merhaba, sitede bulamadığım bir parçayı arıyorum.'];
if(S.q)parts.push(`Aranan: ${S.q}`);
if(S.model)parts.push(`Araç: ${vLabel(S.model)}`);
if(S.grup)parts.push(`Parça grubu: ${cat.groupLabel(S.grup)}`);
parts.push('Şasi (VIN) no: ');
return parts.join('\n');
}
function renderMsg(kind){
if(!kind){el.msg.hidden=true;el.msg.innerHTML='';return;}
el.msg.hidden=false;
if(kind==='empty'){
const n=activeCount();
el.msg.innerHTML=`<div class="cat-empty">
        <span class="cat-empty__icon">${ICON('search')}</span>
        <h2>Bu parça listede yok, ama tedarik edebiliriz</h2>
        <p>Kataloğumuzda görünmeyen parçalar için de tedarik desteği veriyoruz. Parça adını, OEM kodunu veya şasi numaranızı WhatsApp’tan gönderin; uzmanımız size dönsün.</p>
        <div class="cat-empty__actions">
          <a class="btn btn--wa btn--secondary" href="#" data-wa="${esc(waEmptyMsg())}" data-track="whatsapp_click" data-track-label="catalog_empty">${ICON('whatsapp')}WhatsApp'tan sor</a>
          <a class="btn btn--secondary btn--ghost" href="tel:${esc(PHONE)}" data-track="phone_click" data-track-label="catalog_empty">${ICON('phone')}${esc(PHONE_L)}</a>
          ${n||S.q?'<button class="btn btn--text cat-empty__clear" type="button" data-clear-all>Filtreleri temizle</button>':''}
        </div>
      </div>`;
stagger([el.msg.firstElementChild],{y:8});
}else if(kind==='error'){
el.msg.innerHTML=`<div class="cat-empty cat-empty--err">
        <span class="cat-empty__icon">${ICON('info')}</span>
        <h2>Katalog şu anda yüklenemedi</h2>
        <p>İnternet bağlantınızı kontrol edip tekrar deneyin. Parçanız acilse WhatsApp’tan ya da telefonla hemen yazın; stok ve fiyatı biz kontrol edelim.</p>
        <div class="cat-empty__actions">
          <button class="btn btn--primary btn--red" type="button" data-retry>Tekrar dene</button>
          <a class="btn btn--wa btn--secondary" href="#" data-wa="${esc('Merhaba, parça arıyorum. Parça adı / kodu: \nŞasi (VIN) no: ')}" data-track="whatsapp_click" data-track-label="catalog_error">${ICON('whatsapp')}WhatsApp</a>
          <a class="btn btn--secondary btn--ghost" href="tel:${esc(PHONE)}" data-track="phone_click" data-track-label="catalog_error">${ICON('phone')}${esc(PHONE_L)}</a>
        </div>
      </div>`;
}
D.bindWa(el.msg);
}
const sharedTilt=()=>!!D.motion;
const applyTilt=()=>{};
let tiltEl=null,tiltRaf=0,tiltEv=null;
function resetTilt(){if(tiltEl){tiltEl.style.removeProperty('--tilt-x');tiltEl.style.removeProperty('--tilt-y');tiltEl.classList.remove('is-tilting');tiltEl=null;}}
function bindLocalTilt(){
el.grid.addEventListener('pointermove',e=>{
if(sharedTilt()||e.pointerType!=='mouse'||!FINE.matches||reduced())return;
const c=e.target.closest('.p-card');
if(c!==tiltEl){resetTilt();tiltEl=c;if(c)c.classList.add('is-tilting');}
if(!c)return;
tiltEv=e;
if(!tiltRaf)tiltRaf=requestAnimationFrame(()=>{
tiltRaf=0;
if(!tiltEl||!tiltEv)return;
const r=tiltEl.getBoundingClientRect();
const x=(tiltEv.clientX-r.left)/r.width-0.5,y=(tiltEv.clientY-r.top)/r.height-0.5;
tiltEl.style.setProperty('--tilt-x',`${(-y*6).toFixed(2)}deg`);
tiltEl.style.setProperty('--tilt-y',`${(x*6).toFixed(2)}deg`);
});
});
el.grid.addEventListener('pointerleave',resetTilt);
}
function renderGrid(list,multi,animate){
el.grid.removeAttribute('aria-busy');
resetTilt();
if(multi||!list.length){el.grid.hidden=true;el.grid.innerHTML='';return;}
el.grid.hidden=false;
const start=(view.from-1)*PER,end=S.sayfa*PER;
el.grid.innerHTML=list.slice(start,end).map((p,i)=>card(p,i<EAGER)).join('');
const cards=[...el.grid.children];
applyTilt(cards);
if(animate&&canAnim()){
el.grid.animate([{opacity:0.35},{opacity:1}],{duration:220,easing:EASE});
stagger(cards);
}
}
function pageList(cur,from,pages){
const set=new Set([1,pages,from,cur,from-1,cur+1]);
if(cur<=3)[2,3,4].forEach(n=>set.add(n));
if(cur>=pages-2)[pages-1,pages-2,pages-3].forEach(n=>set.add(n));
const arr=[...set].filter(n=>n>=1&&n<=pages).sort((a,b)=>a-b);
const out=[];
arr.forEach((n,i)=>{if(i&&n-arr[i-1]>1)out.push(0);out.push(n);});
return out;
}
function renderPager(total,multi){
const pages=Math.ceil(total/PER);
if(multi||pages<=1){el.pager.hidden=true;el.pager.innerHTML='';return;}
el.pager.hidden=false;
const end=Math.min(S.sayfa*PER,total);
const remain=total-end;
const link=(n,label,cls='',aria='')=>`<a class="pager__n ${cls}" href="${esc(toQuery({...S,sayfa:n}))}" data-page="${n}"${aria}>${label}</a>`;
const nums=pageList(S.sayfa,view.from,pages).map(n=>{
if(!n)return'<span class="pager__gap" aria-hidden="true">…</span>';
const inView=n>=view.from&&n<=S.sayfa;
return link(n,nf(n),inView?'is-on':'',n===S.sayfa?' aria-current="page"':'');
}).join('');
const prev=view.from>1?link(view.from-1,ICON('chevron'),'pager__prev',' aria-label="Önceki sayfa"'):'';
const next=S.sayfa<pages?link(S.sayfa+1,ICON('chevron'),'pager__next',' aria-label="Sonraki sayfa"'):'';
el.pager.innerHTML=`
      <p class="pager__info"><span class="pager__num">${nf(end)}</span> / ${nf(total)} ürün gösteriliyor</p>
      <div class="pager__bar" role="presentation"><span style="transform:scaleX(${Math.max(0.02,end/total).toFixed(3)})"></span></div>
      ${remain>0?`<button class="btn btn--secondary btn--ghost pager__more" type="button" data-more>${ICON('plus')}Daha fazla yükle <span class="pager__rest">(${nf(Math.min(PER,remain))})</span></button>`:''}
      <nav class="pager__nav" aria-label="Sayfalar">${prev}${nums}${next}</nav>`;
}
function renderCount(total,qs){
if(qs&&qs.multi){
const f=qs.multi.filter(r=>r.list.length).length;
el.count.innerHTML=`<strong>${qs.multi.length}</strong> kod <span class="cat-count__sub">· ${f} bulundu</span>`;
return;
}
if(!total){el.count.innerHTML='<strong>0</strong> ürün bulundu';return;}
const start=(view.from-1)*PER+1,end=Math.min(S.sayfa*PER,total);
el.count.innerHTML=`<strong>${nf(total)}</strong> ürün${total>PER?` <span class="cat-count__sub">· ${nf(start)}–${nf(end)}</span>`:''}`;
}
function render(opts={}){
if(!cat)return;
R=compute();
const{list,cnt,qs}=R;
const multi=!!(qs&&qs.multi);
const pages=Math.max(1,Math.ceil(list.length/PER));
if(S.sayfa>pages)S.sayfa=pages;
if(view.from>S.sayfa)view.from=S.sayfa;
if(view.from<1)view.from=1;
writeURL();
renderHead(list.length);
renderFilters(cnt);
renderCar(cnt);
renderSort();
renderChips();
renderMulti(qs,opts.animate);
renderGrid(list,multi,opts.animate);
renderMsg(!multi&&!list.length?'empty':null);
renderPager(list.length,multi);
renderCount(list.length,qs);
if(el.fltShow)el.fltShow.textContent=multi?'Sonuçları göster':`${nf(list.length)} ürünü göster`;
if(document.activeElement!==el.q&&el.q.value!==S.q)el.q.value=S.q;
trackSearch(list.length,qs);
}
function loadMore(){
const total=R.list.length;
if(S.sayfa*PER>=total)return;
const start=S.sayfa*PER;
S.sayfa++;
const frag=document.createElement('div');
frag.innerHTML=R.list.slice(start,S.sayfa*PER).map(p=>card(p,false)).join('');
const added=[...frag.children];
el.grid.append(...added);
applyTilt(added);
stagger(added);
writeURL();
renderPager(total,false);
renderCount(total,R.qs);
const a=added[0]&&added[0].querySelector('a');
if(a)a.focus({preventScroll:true});
}
function scrollToResults(force){
const headerH=($('#header')||{}).offsetHeight||72;
const top=el.results.getBoundingClientRect().top+window.scrollY-headerH-12;
if(force||window.scrollY>top)window.scrollTo({top:Math.max(0,top),behavior:'auto'});
}
function changed(opts={}){
S.sayfa=1;
view.from=1;
render({animate:true});
if(!opts.keepScroll&&!isSheetOpen())scrollToResults();
}
function trackSearch(n,qs){
const q=S.q.trim();
if(q.length<3||q===lastTracked)return;
lastTracked=q;
D.track('search',{search_term:q,results:qs&&qs.multi?qs.multi.filter(r=>r.list.length).length:n,multi:!!(qs&&qs.multi)});
}
const mqSheet=matchMedia('(max-width: 960px)');
let lastFocus=null;
const isSheetOpen=()=>el.flt.classList.contains('is-open');
function openSheet(){
if(!mqSheet.matches)return;
lastFocus=document.activeElement;
el.flt.classList.add('is-open');
el.fltPanel.setAttribute('role','dialog');
el.fltPanel.setAttribute('aria-modal','true');
el.fltOpen.setAttribute('aria-expanded','true');
setTimeout(()=>{const f=$('.flt__x',el.fltPanel);if(f)f.focus();},60);
}
function closeSheet(toResults){
if(!isSheetOpen())return;
el.flt.classList.remove('is-open');
el.fltPanel.removeAttribute('role');
el.fltPanel.removeAttribute('aria-modal');
el.fltOpen.setAttribute('aria-expanded','false');
if(toResults)scrollToResults();
if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true});
}
if(mqSheet.addEventListener)mqSheet.addEventListener('change',()=>{if(!mqSheet.matches)closeSheet();});
function setSort(v){
const nv=SORTS.includes(v)?v:'onerilen';
if(nv===S.sirala)return;
S.sirala=nv;
changed({keepScroll:true});
}
function bind(){
const runQ=debounce(()=>{const v=el.q.value.trim();if(v!==S.q){S.q=v;changed({keepScroll:true});}},260);
el.q.addEventListener('input',runQ);
el.q.addEventListener('paste',e=>{
const t=(e.clipboardData||window.clipboardData);
const text=t&&t.getData('text');
if(text&&/[\r\n\t]/.test(text)){
e.preventDefault();
const clean=text.split(/[\r\n\t]+/).map(s=>s.trim()).filter(Boolean).join(', ');
const s=el.q.selectionStart??el.q.value.length,en=el.q.selectionEnd??el.q.value.length;
el.q.value=el.q.value.slice(0,s)+clean+el.q.value.slice(en);
runQ();
}
});
el.form.addEventListener('submit',e=>{
e.preventDefault();
S.q=el.q.value.trim();
changed();
if(mqSheet.matches)el.q.blur();
});
el.sort.addEventListener('change',()=>setSort(el.sort.value));
if(el.tabs){
el.tabs.addEventListener('click',e=>{const b=e.target.closest('[data-sort]');if(b)setSort(b.dataset.sort);});
el.tabs.addEventListener('keydown',e=>{
if(!/^(ArrowLeft|ArrowRight|Home|End)$/.test(e.key))return;
e.preventDefault();
const bs=$$('[data-sort]',el.tabs);
let i=bs.findIndex(b=>b.dataset.sort===S.sirala);
i=e.key==='Home'?0:e.key==='End'?bs.length-1:(i+(e.key==='ArrowRight'?1:-1)+bs.length)%bs.length;
setSort(bs[i].dataset.sort);
bs[i].focus();
});
window.addEventListener('resize',debounce(()=>moveInd(true),120),{passive:true});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>moveInd(true));
}
el.fltBody.addEventListener('change',e=>{
const t=e.target;
const tog=(arr,v,on)=>(on?uniq(arr.concat(v)):arr.filter(x=>x!==v));
switch(t.name){
case'f-model':S.model=t.value;break;
case'f-grup':S.grup=t.value;break;
case'f-kalite':S.kalite=tog(S.kalite,t.value,t.checked);break;
case'f-marka':S.marka=tog(S.marka,t.value,t.checked);break;
case'f-stok':S.stok=t.checked;break;
case'f-firsat':S.firsat=t.checked;break;
case'f-min':case'f-max':applyPrice();return;
default:return;
}
changed();
});
el.fltBody.addEventListener('input',e=>{if(e.target.matches('[data-brand-q]'))brandVisibility();});
el.fltBody.addEventListener('keydown',e=>{
if(e.key==='Enter'&&e.target.matches('#f-min, #f-max')){e.preventDefault();applyPrice();}
});
el.fltBody.addEventListener('click',e=>{
if(e.target.closest('[data-brand-more]')){brandAll=!brandAll;brandVisibility();}
else if(e.target.closest('[data-price-apply]'))applyPrice();
});
el.make.addEventListener('change',()=>{
const v=el.make.value;
const def=makeDef(v);
S.sayfa=1;view.from=1;
if(!v){S.model='';changed({keepScroll:true});return;}
if(def.single){S.model=v;D.garage.set(v);return;}
S.model=v;
changed({keepScroll:true});
if(!el.model.disabled)el.model.focus();
});
el.model.addEventListener('change',()=>{
const v=el.model.value;
S.sayfa=1;view.from=1;
if(!v){S.model=el.make.value||'';changed({keepScroll:true});return;}
S.model=v;
D.garage.set(v);
});
el.gToggle.addEventListener('change',()=>{const g=garageKey();S.model=el.gToggle.checked&&g?g:'';changed({keepScroll:true});});
el.gSave.addEventListener('click',()=>{if(S.model&&!isVirtual(S.model))D.garage.set(S.model);});
el.gClear.addEventListener('click',()=>{const old=garageKey();if(S.model===old)S.model='';S.sayfa=1;view.from=1;D.garage.set(null);});
document.addEventListener('dky:garage',()=>render({animate:true}));
document.addEventListener('click',e=>{
const t=e.target.closest('[data-chip],[data-clear-all],[data-more],[data-page],[data-flt-open],[data-flt-close],[data-retry],[data-mcode-add]');
if(!t)return;
if(t.matches('[data-chip]')){
if(t.classList.contains('is-leave'))return;
const k=t.dataset.chip,v=t.dataset.v;
if(k==='q'){S.q='';el.q.value='';}
else if(k==='model')S.model='';
else if(k==='grup')S.grup='';
else if(k==='kalite')S.kalite=S.kalite.filter(x=>x!==v);
else if(k==='marka')S.marka=S.marka.filter(x=>x!==v);
else if(k==='fiyat'){S.min=null;S.max=null;}
else if(k==='stok')S.stok=false;
else if(k==='firsat')S.firsat=false;
changed({keepScroll:true});
const next=$('.chip:not(.is-leave)',el.chips)||el.q;
if(next)next.focus({preventScroll:true});
}else if(t.matches('[data-clear-all]')){
const sort=S.sirala;
S=DEF();S.sirala=sort;
el.q.value='';
changed({keepScroll:isSheetOpen()});
}else if(t.matches('[data-more]')){
loadMore();
}else if(t.matches('[data-page]')){
if(e.metaKey||e.ctrlKey||e.shiftKey||e.button===1)return;
e.preventDefault();
const n=Number(t.dataset.page);
S.sayfa=n;view.from=n;
render({animate:true});
scrollToResults(true);
const a=el.grid.querySelector('a');
if(a)a.focus({preventScroll:true});
}else if(t.matches('[data-flt-open]')){
openSheet();
}else if(t.matches('[data-flt-close]')){
closeSheet(true);
}else if(t.matches('[data-retry]')){
start();
}else if(t.matches('[data-mcode-add]')){
const rows=el.mcode._rows||[];
const picks=rows.map(r=>r.vis[0]).filter(Boolean);
picks.forEach(p=>D.quote.add(p,1));
if(picks.length){D.toast(`${picks.length} parça teklif listesine eklendi`);D.openQuote();}
}
});
document.addEventListener('keydown',e=>{
if(!isSheetOpen())return;
if(e.key==='Escape'){closeSheet();return;}
if(e.key==='Tab'){
const f=$$('a[href], button:not([disabled]), input:not([disabled]), select, summary, [tabindex]:not([tabindex="-1"])',el.fltPanel).filter(x=>x.offsetParent!==null&&!x.closest('[hidden]'));
if(!f.length)return;
const first=f[0],last=f[f.length-1];
if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
}
});
window.addEventListener('popstate',()=>{
S=parse(location.search);
sanitize();
view.from=S.sayfa;
render();
});
window.addEventListener('pagehide',()=>{
try{sessionStorage.setItem('dky_cat_view',JSON.stringify({u:location.search,y:window.scrollY,from:view.from}));}catch(e){}
});
bindLocalTilt();
}
function applyPrice(){
const rd=id=>{const v=parseFloat(($(id)||{}).value);return isFinite(v)&&v>0?v:null;};
let mn=rd('#f-min'),mx=rd('#f-max');
if(mn!=null&&mx!=null&&mn>mx)[mn,mx]=[mx,mn];
if(mn===S.min&&mx===S.max)return;
S.min=mn;S.max=mx;
changed();
}
let bound=false;
function start(){
el.q.value=S.q;
el.count.textContent='Katalog yükleniyor…';
renderMsg(null);
D.loadCatalog().then(c=>{
cat=c;
if(!P.length)index();
sanitize();
let restoring=false;
try{
const saved=JSON.parse(sessionStorage.getItem('dky_cat_view')||'null');
if(saved&&saved.u===location.search){view.from=Math.min(saved.from||S.sayfa,S.sayfa);restoreY=saved.y;restoring=true;}
}catch(e){}
buildFilters();
if(!bound){bind();bound=true;}
render({animate:!restoring});
moveInd(true);
if(restoreY!=null){const y=restoreY;restoreY=null;requestAnimationFrame(()=>window.scrollTo(0,y));}
D.track('view_item_list',{item_list_name:heading().title,items:R.list.length});
}).catch(()=>{
el.grid.removeAttribute('aria-busy');
el.grid.hidden=true;
el.count.textContent='Katalog yüklenemedi';
renderMsg('error');
const r=el.msg.querySelector('[data-retry]');
if(r)r.addEventListener('click',()=>{el.grid.hidden=false;start();},{once:true});
});
}
const catRoot=$('.cat');
const setHdr=()=>{const h=$('#header');if(h&&catRoot)catRoot.style.setProperty('--hdr',Math.round(h.getBoundingClientRect().height)+'px');};
setHdr();
window.addEventListener('resize',debounce(setHdr,150),{passive:true});
if('scrollRestoration'in history)history.scrollRestoration='manual';
start();
})();
