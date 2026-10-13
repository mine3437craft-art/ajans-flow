(function(){
'use strict';
const D=window.DKY;
if(!D||!D.loadNav)return;
const C=window.DKY_CONFIG||{};
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=D.esc;
const nf=D.nf||(n=>Number(n||0).toLocaleString('tr-TR'));
const ICON=id=>(D.icon?D.icon(id):`<svg aria-hidden="true"><use href="/dky/assets/h/img/icons.9d3a84566c.svg#i-${id}"/></svg>`);
const norm=D.norm||(s=>String(s||'').toLocaleLowerCase('tr-TR'));
const SITE=(C.siteUrl||'https://www.dkyautoparts.com').replace(/\/$/,'');
const el={
h1:$('[data-dir-h1]'),lead:$('[data-dir-lead]'),q:$('[data-dir-q]'),view:$('[data-dir-view]'),ctx:$('[data-dir-ctx]'),
body:$('[data-dir-body]'),az:$('[data-az-nav]'),status:$('[data-dir-status]'),empty:$('[data-dir-empty]'),crumbs:$('[data-dir-crumbs]')
};
if(!el.body)return;
const url=new URLSearchParams(location.search);
const ST={
view:url.get('gorunum')==='az'?'az':'tree',
q:'',
model:(url.get('model')||'').trim(),
kasa:(url.get('kasa')||'').trim(),
byCar:false,
fromUrl:false
};
let NAV=null,CARC=null;
const AZ='ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('');
const firstLetter=s=>{const c=String(s||'').trim().charAt(0).toLocaleUpperCase('tr-TR');return AZ.includes(c)?c:'#';};
const cmpTR=(a,b)=>a.localeCompare(b,'tr',{sensitivity:'base'});
function hl(text,term){
const t=String(text||'');
if(!term)return esc(t);
const n=norm(t),i=n.indexOf(term);
if(i<0||n.length!==t.length)return esc(t);
return esc(t.slice(0,i))+'<mark>'+esc(t.slice(i,i+term.length))+'</mark>'+esc(t.slice(i+term.length));
}
const car=()=>{
if(!ST.byCar||!ST.model||!NAV)return null;
const m=NAV.model(ST.model);
if(!m)return null;
const g=ST.kasa?NAV.gen(ST.kasa):null;
return{m,g:g&&g.model===m.key?g:null};
};
const carLabel=c=>(c?c.m.label+(c.g?' '+(c.g.code||c.g.years):''):'');
const ctxParams=()=>{const c=car();return c?{model:c.m.key,kasa:c.g?c.g.key:''}:{};};
function data(){
const c=car();
let groups=NAV.groups.map(g=>({key:g.key,label:g.label,count:g.count,image:g.image,subs:g.subs.map(s=>({key:s.key,label:s.label,count:s.count}))}));
if(c){
const gc=new Map(NAV.groupsOf(c.m.key,c.g&&c.g.key).map(x=>[x.group,x.count]));
const ready=CARC&&CARC.key===c.m.key+'|'+(c.g?c.g.key:'');
groups=groups.map(g=>Object.assign(g,{
count:ready?(CARC.groups.get(g.key)||0):(gc.get(g.key)||0),
subs:ready?g.subs.map(s=>Object.assign(s,{count:CARC.subs.get(s.key)||0})):g.subs.map(s=>Object.assign(s,{count:null}))
}));
}
return groups.filter(g=>g.count>0);
}
const catAI=k=>{const K=(window.DKY_GORSELLER&&window.DKY_GORSELLER.kategori)||{};return K[k]?'/'+String(K[k]).replace(/^\/+/,''):'';};
const catPhoto=(name,lazy)=>`<img src="${esc(D.img(name,400))}" alt="" width="400" height="400"${lazy?' loading="lazy"':''} decoding="async">`;
function cmedia(g,i){
const ai=catAI(g.key);
if(ai)return`<span class="cbox__media cbox__media--ai"${g.image?` data-cat-fb="${esc(g.image)}"`:''} data-cat-key="${esc(g.key)}"><img src="${esc(ai)}" alt="" width="1200" height="900"${i>2?' loading="lazy"':''} decoding="async"></span>`;
if(g.image)return`<span class="cbox__media">${catPhoto(g.image,i>2)}</span>`;
return`<span class="cbox__media cbox__media--icon">${D.catIco(g.key,'lg')}</span>`;
}
el.body.addEventListener('error',e=>{
const im=e.target,box=im&&im.tagName==='IMG'&&im.closest('.cbox__media--ai');
if(!box)return;
const fb=box.dataset.catFb;
box.className=fb?'cbox__media':'cbox__media cbox__media--icon';
box.innerHTML=fb?catPhoto(fb,true):D.catIco(box.dataset.catKey,'lg');
},true);
function renderTree(groups,term){
const ctx=ctxParams();
let n=0;
const items=groups.map(g=>{
const gHit=term&&norm(g.label).includes(term);
let subs=g.subs.filter(s=>s.count===null||s.count>0).sort((a,b)=>(b.count||0)-(a.count||0)||cmpTR(a.label,b.label));
if(term&&!gHit)subs=subs.filter(s=>norm(s.label).includes(term));
if(term&&!gHit&&!subs.length)return'';
const rest=g.count-subs.reduce((t,s)=>t+(s.count||0),0);
return`<li id="k-${esc(g.key)}"><div class="cbox cbox--tree" data-mo-spot>
        <a class="cbox__head" href="${esc(D.url.cat(Object.assign({grup:g.key},ctx)))}">${cmedia(g,n++)}<span class="cbox__row">${D.catIco(g.key,'badge')}<span class="cbox__body"><span class="cbox__name">${hl(g.label,term)}</span><span class="cbox__count">${nf(g.count)} parça</span></span><span class="cbox__go" aria-hidden="true">${ICON('arrow')}</span></span></a>
        ${subs.length?`<ul class="cbox__subs">${subs.map(s=>`<li><a href="${esc(D.url.cat(Object.assign({grup:g.key,alt:s.key},ctx)))}">${hl(s.label,term)} <small>${s.count===null?'':nf(s.count)}</small></a></li>`).join('')}</ul>`:''}
        ${subs.length&&!term&&rest>0&&g.count>rest?`<a class="cbox__all" href="${esc(D.url.cat(Object.assign({grup:g.key},ctx)))}">Tümünü gör (${nf(g.count)})${ICON('arrow')}</a>`:''}
      </div></li>`;
}).join('');
el.az.hidden=true;
return items?`<ul class="cbox-grid cbox-grid--3 dir-grid" data-mo-stagger>${items}</ul>`:'';
}
function renderAZ(groups,term){
const ctx=ctxParams();
const rows=[];
groups.forEach(g=>{
rows.push({label:g.label,href:D.url.cat(Object.assign({grup:g.key},ctx)),count:g.count,meta:'Ana kategori',main:true});
g.subs.filter(s=>s.count===null||s.count>0).forEach(s=>rows.push({label:s.label,href:D.url.cat(Object.assign({grup:g.key,alt:s.key},ctx)),count:s.count,meta:g.label}));
});
const list=(term?rows.filter(r=>norm(r.label).includes(term)):rows).sort((a,b)=>cmpTR(a.label,b.label)||(b.main?1:0)-(a.main?1:0));
const by=new Map();
list.forEach(r=>{const L=firstLetter(r.label);if(!by.has(L))by.set(L,[]);by.get(L).push(r);});
const letters=AZ.concat('#').filter(L=>by.has(L));
el.az.hidden=!letters.length||!!term;
el.az.innerHTML=AZ.map(L=>(by.has(L)?`<a href="#az-${esc(L)}">${esc(L)}</a>`:`<span aria-hidden="true">${esc(L)}</span>`)).join('');
if(!letters.length)return'';
return`<div class="az">${letters.map(L=>`<section class="az-sec" id="az-${esc(L)}" aria-labelledby="az-t-${esc(L)}">
      <h2 class="az-sec__t" id="az-t-${esc(L)}">${esc(L)}</h2>
      <ul class="az-list">${by.get(L).map(r=>`<li${r.main?' class="is-main"':''}><a href="${esc(r.href)}"><span class="az-list__name">${hl(r.label,term)}</span><small class="az-list__meta">${esc(r.meta)}${r.count===null?'':' · '+nf(r.count)}</small></a></li>`).join('')}</ul>
    </section>`).join('')}</div>`;
}
function renderCtx(){
const g=D.garage.get();
const key=ST.fromUrl?ST.model:g;
const m=key&&NAV?NAV.model(key):null;
if(!m){el.ctx.hidden=true;el.ctx.innerHTML='';return;}
const gen=ST.fromUrl?(ST.kasa&&NAV.gen(ST.kasa)):D.garage.gen();
const label=m.label+(gen&&gen.model===m.key?' '+(gen.code||gen.years):'');
el.ctx.hidden=false;
el.ctx.innerHTML=`<div class="garage-bar dir-ctx__bar">
      <p class="garage-bar__label">${ICON('car')}<span>${ST.fromUrl?'Araç':'Aracım'}: <strong>${esc(label)}</strong></span></p>
      <label class="switch dir-ctx__switch"><input type="checkbox" role="switch" data-dir-car${ST.byCar?' checked':''}><span class="switch__ui" aria-hidden="true"></span><span class="switch__text">Sayıları bu araca göre göster</span></label>
      <a class="btn btn--text btn--sm" href="${esc(D.url.hub(m.key,gen&&gen.model===m.key?gen.key:''))}">Araç sayfası${ICON('arrow')}</a>
    </div>`;
}
function render(reason='update'){
if(!NAV)return;
const term=norm(ST.q.trim());
const groups=data();
const html=ST.view==='az'?renderAZ(groups,term):renderTree(groups,term);
el.body.innerHTML=html;
el.empty.hidden=!!html;
if(!html){
el.empty.innerHTML=`<span class="empty-state__icon">${ICON('search')}</span><p class="empty-state__title">“${esc(ST.q)}” için kategori bulunamadı</p><p>Parça adıyla ya da OEM koduyla katalogda arayın; bulamazsanız WhatsApp’tan sorun.</p><div class="empty-state__actions"><a class="btn btn--primary" href="${esc(D.url.cat(Object.assign({q:ST.q},ctxParams())))}">Katalogda “${esc(ST.q)}” ara</a><a class="btn btn--wa" href="#" data-wa="${esc('Merhaba, şu parçayı arıyorum: '+ST.q+'\nŞasi (VIN) numaram: ')}">${ICON('whatsapp')}WhatsApp'tan sor</a></div>`;
D.bindWa(el.empty);
}
const c=car();
const total=groups.reduce((t,g)=>t+g.count,0);
const subsN=groups.reduce((t,g)=>t+g.subs.filter(s=>s.count===null||s.count>0).length,0);
el.status.textContent=term
?(html?`“${ST.q}” için eşleşen kategoriler`:'')
:`${nf(groups.length)} ana kategori${subsN?` · ${nf(subsN)} alt kategori`:''} · ${nf(total)} ürün${c?` · ${carLabel(c)} için`:''}`;
el.h1.textContent=c?`${carLabel(c)} parça kategorileri`:'Tüm parça kategorileri';
document.title=(c?`${carLabel(c)} Parça Kategorileri`:'Tüm Parça Kategorileri | Yedek Parça ve 4x4 Ekipman')+' | DKY Auto Parts';
paintView();
D.observe&&D.observe(el.body);
document.dispatchEvent(new CustomEvent('dky:dir-render',{detail:{reason,view:ST.view}}));
}
function paintView(){
$$('[data-view]',el.view).forEach(b=>{const on=b.dataset.view===ST.view;b.setAttribute('aria-checked',String(on));b.tabIndex=on?0:-1;});
el.view.setAttribute('data-active',ST.view);
}
function writeURL(){
const u=new URLSearchParams();
if(ST.fromUrl&&ST.model){u.set('model',ST.model);if(ST.kasa)u.set('kasa',ST.kasa);}
if(ST.view==='az')u.set('gorunum','az');
const s=u.toString();
try{history.replaceState(history.state,'',location.pathname+(s?'?'+s:'')+location.hash);}catch(e){}
}
function loadCarCounts(){
const c=car();
if(!c)return Promise.resolve();
const key=c.m.key+'|'+(c.g?c.g.key:'');
if(CARC&&CARC.key===key)return Promise.resolve();
el.status.textContent=`${carLabel(c)} için sayılar hesaplanıyor…`;
return D.loadCatalog().then(cat=>{
const groups=new Map(),subs=new Map();
for(const p of cat.products){
if(!p.models.includes(c.m.key))continue;
if(c.g&&!(Array.isArray(p.gens)&&p.gens.includes(c.g.key)))continue;
groups.set(p.group,(groups.get(p.group)||0)+1);
if(p.sub)subs.set(p.sub,(subs.get(p.sub)||0)+1);
}
CARC={key,groups,subs};
}).catch(()=>{CARC=null;});
}
let qT;
el.q.addEventListener('input',()=>{clearTimeout(qT);qT=setTimeout(()=>{ST.q=el.q.value;render('filter');},120);});
el.q.addEventListener('keydown',e=>{
if(e.key==='Enter'){
e.preventDefault();
const first=$('a[href]',el.body);
if(first)first.focus();
}
});
el.view.addEventListener('click',e=>{
const b=e.target.closest('[data-view]');
if(!b||b.dataset.view===ST.view)return;
ST.view=b.dataset.view;writeURL();render('view');
D.track('directory_view',{view:ST.view});
});
el.view.addEventListener('keydown',e=>{
if(!/^(ArrowLeft|ArrowRight|Home|End)$/.test(e.key))return;
e.preventDefault();
ST.view=ST.view==='az'?'tree':'az';
writeURL();render('view');
const b=$(`[data-view="${ST.view}"]`,el.view);if(b)b.focus();
});
el.ctx.addEventListener('change',e=>{
if(!e.target.matches('[data-dir-car]'))return;
ST.byCar=e.target.checked;
if(ST.byCar&&!ST.fromUrl){ST.model=D.garage.get()||'';ST.kasa=(D.garage.gen()||{}).key||'';}
if(ST.byCar)loadCarCounts().then(()=>render('car'));else render('car');
});
document.addEventListener('dky:garage',()=>{
if(ST.fromUrl)return;
ST.model=D.garage.get()||'';ST.kasa=(D.garage.gen()||{}).key||'';
if(!ST.model)ST.byCar=false;
renderCtx();
(ST.byCar?loadCarCounts():Promise.resolve()).then(()=>render('car'));
});
el.status.textContent='Kategoriler yükleniyor…';
D.loadNav({fallback:true}).then(nav=>{
NAV=nav;
if(ST.model&&NAV.model(ST.model)){ST.fromUrl=true;ST.byCar=true;}
else{ST.model=D.garage.get()||'';ST.kasa=(D.garage.gen()||{}).key||'';ST.byCar=false;ST.fromUrl=false;}
renderCtx();
render('init');
document.querySelector('[data-dir]').classList.add('is-ready');
if(location.hash&&/^#k-/.test(location.hash)){const t=document.getElementById(location.hash.slice(1));if(t)t.scrollIntoView({block:'start'});}
if(ST.byCar)loadCarCounts().then(()=>render('car'));
const s=document.createElement('script');
s.type='application/ld+json';
s.textContent=JSON.stringify({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
{'@type':'ListItem',position:1,name:'Ana sayfa',item:SITE+'/'},
{'@type':'ListItem',position:2,name:'Kategoriler',item:SITE+'/kategoriler.html'}]});
document.head.appendChild(s);
D.track('view_item_list',{item_list_name:'Kategoriler',items:NAV.groups.length});
}).catch(()=>{
document.querySelector('[data-dir]').classList.add('is-ready');
el.status.textContent='Kategoriler yüklenemedi; aşağıdaki ana kategorilerden devam edebilirsiniz.';
});
})();
