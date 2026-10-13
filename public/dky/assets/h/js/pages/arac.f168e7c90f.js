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
const SITE=(C.siteUrl||'https://www.dkyautoparts.com').replace(/\/$/,'');
const el={
root:$('[data-hub]'),crumbs:$('[data-hub-crumbs]'),eyebrow:$('[data-hub-eyebrow]'),h1:$('[data-hub-h1]'),
meta:$('[data-hub-meta]'),lead:$('[data-hub-lead]'),gens:$('[data-hub-gens]'),actions:$('[data-hub-actions]'),
all:$('[data-hub-all]'),save:$('[data-hub-save]'),saveT:$('[data-hub-save-t]'),wa:$('[data-hub-wa]'),
media:$('[data-hub-media]'),body:$('[data-hub-body]'),skel:$('[data-hub-skel]')
};
if(!el.root||!el.body)return;
const q=new URLSearchParams(location.search);
const P={model:(q.get('model')||'').trim(),kasa:(q.get('kasa')||'').trim(),marka:(q.get('marka')||'').trim()};
const FAMILY={discovery:{label:'Discovery'},freelander:{label:'Freelander'},defender:{label:'Defender'}};
const MAKE_ALIAS={pickup:'offroad','off-road':'offroad',bmw:'bmw-mini',mini:'bmw-mini',lr:'land-rover',rr:'range-rover'};
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
let ldEl=null;
function setLD(obj){
if(!ldEl){ldEl=document.createElement('script');ldEl.type='application/ld+json';ldEl.setAttribute('data-hub-ld','');document.head.appendChild(ldEl);}
ldEl.textContent=JSON.stringify(obj).replace(/</g,'\\u003c');
}
function setCrumbs(list){
el.crumbs.innerHTML=list.map(([n,u],i)=>(i===list.length-1||!u?`<li aria-current="page">${esc(n)}</li>`:`<li><a href="${esc(u)}">${esc(n)}</a></li>`)).join('');
setLD({
'@context':'https://schema.org','@type':'BreadcrumbList',
itemListElement:list.map(([n,u],i)=>({'@type':'ListItem',position:i+1,name:n,item:SITE+(u||location.pathname+location.search)}))
});
}
function setSEO({title,desc,path,index=true}){
const full=`${title} | DKY Auto Parts`;
document.title=full;
const d=desc.length>158?desc.slice(0,155).replace(/\s+\S*$/,'')+'…':desc;
setMeta('meta[name="description"]','content',d);
setMeta('link[rel="canonical"]','href',SITE+path);
setMeta('meta[property="og:title"]','content',full);
setMeta('meta[property="og:description"]','content',d);
setMeta('meta[property="og:url"]','content',SITE+path);
setMeta('meta[name="robots"]','content','noindex,nofollow');
}
const firstSentences=(txt,max=155)=>{
let out='';
for(const s of txt.split(/(?<=[.!?])\s+/)){const t=(out+s).trim();if(t.length>max)break;out=t+' ';}
return out.trim()||txt;
};
const img=(name,w=400)=>D.img(name,w);
const offroadish=m=>m&&(m.family==='offroad'||m.make==='offroad');
const partsWord=m=>(offroadish(m)?'aksesuar ve ekipman':'parça ve aksesuar');
const catAI=k=>{const K=(window.DKY_GORSELLER&&window.DKY_GORSELLER.kategori)||{};return K[k]?'/'+String(K[k]).replace(/^\/+/,''):'';};
const catPhoto=name=>`<img src="${esc(img(name,400))}" alt="" width="400" height="400" loading="lazy" decoding="async">`;
function cbox(nav,g,ctx,i){
const grp=nav.group(g.group)||{key:g.group,label:D.groupName(g.group)};
const ai=catAI(grp.key);
const media=ai
?`<span class="cbox__media cbox__media--ai"${g.image?` data-cat-fb="${esc(g.image)}"`:''} data-cat-key="${esc(grp.key)}"><img src="${esc(ai)}" alt="" width="1200" height="900"${i>3?' loading="lazy"':''} decoding="async"></span>`
:g.image
?`<span class="cbox__media">${catPhoto(g.image)}</span>`
:`<span class="cbox__media cbox__media--icon">${D.catIco(grp.key,'lg')}</span>`;
return`<li><a class="cbox" href="${esc(D.url.cat(Object.assign({grup:grp.key},ctx)))}" data-mo-spot>${media}<span class="cbox__body"><span class="cbox__name">${D.catIco(grp.key,'sm')}${esc(grp.label)}</span><span class="cbox__count">${nf(g.count)} parça</span></span><span class="cbox__go" aria-hidden="true">${ICON('arrow')}</span></a></li>`;
}
const vimg=k=>{const vi=k&&D.vehicleImage?D.vehicleImage(k,1100):null;return vi&&vi.kind==='ai'?vi:null;};
const vkey=(model,gen,family)=>(D.vehicleKey?D.vehicleKey(model,gen,{family}):'');
const silSym=model=>(D.vehicleSil?D.vehicleSil(model):'sil-suv');
const unitOf=m=>(offroadish(m)?'ürün':'parça');
function silMedia(cls,model,label,sub){
return`<span class="${cls} vmedia vmedia--sil" aria-hidden="true"><span class="vmedia__name">${esc(label)}</span>${sub?`<span class="vmedia__sub">${esc(sub)}</span>`:''}<svg class="vmedia__sil"><use href="/dky/assets/h/img/icons.9d3a84566c.svg#${silSym(model)}"/></svg></span>`;
}
function vmedia(cls,k,model,label,sub,lazy){
const vi=vimg(k);
if(!vi)return silMedia(cls,model,label,sub);
return`<span class="${cls} vmedia vmedia--ai" aria-hidden="true" data-sil-model="${esc(model)}" data-sil-label="${esc(label)}" data-sil-sub="${esc(sub||'')}"><img src="${esc(vi.src)}" alt="" width="${vi.w}" height="${vi.h}"${lazy?' loading="lazy"':''} decoding="async"></span>`;
}
const yearSpan=gs=>{
if(!gs.length)return'';
if(gs.length===1)return gs[0].years||'';
const a=String(gs[0].years||'').split(/[–-]/)[0].trim(),z=String(gs[gs.length-1].years||'').trim();
const end=/\+$/.test(z)?'günümüz':z.split(/[–-]/).pop().trim();
return a&&end?`${a}–${end}`:'';
};
function vcard(nav,m,col,i){
const sg=D.soleGen?D.soleGen(m):null;
const list=sg?[sg]:D.liveGens(m);
const codes=list.map(g=>g.code).filter(Boolean);
const years=yearSpan(list);
const name=m.isMake?D.shortModel(m,col):m.label;
return`<li class="vcard-item"><a class="vcard" href="${esc(D.url.hub(m.key))}" data-nav-model="${esc(m.key)}" data-mo-spot>${vmedia('vcard__media',vkey(m.key,'',!!m.isMake),m.key,name,codes.join(' · '),i>2)}<span class="vcard__body"><span class="vcard__name">${esc(name)}</span><span class="vcard__meta">${codes.map(c=>`<span class="vcard__code">${esc(c)}</span>`).join('')}${years?`<span class="vcard__years">${esc(years)}</span>`:''}</span><span class="vcard__foot"><span class="vcard__count">${nf(m.count)} ${unitOf(m)}</span><span class="vcard__go" aria-hidden="true">${ICON('arrow')}</span></span></span></a></li>`;
}
function genSection(m,g,gs){
if(gs.length<2)return'';
const card=(href,cur,k,label,sub,code,years,count,gen,i)=>`<li><a class="gcard" href="${esc(href)}"${cur?' aria-current="page"':''} data-gen-card="${esc(gen||'all')}">${vmedia('gcard__media',k,m.key,label,sub,i>3)}<span class="gcard__body"><span class="gcard__code">${esc(code)}</span>${years?`<span class="gcard__years">${esc(years)}</span>`:''}<span class="gcard__count">${nf(count)} ${unitOf(m)}</span></span></a></li>`;
const all=card(D.url.hub(m.key),!g,vkey(m.key,'',false),m.label,'','Tüm nesiller',yearSpan(gs),m.count,'',0);
const items=gs.map((x,i)=>card(D.url.hub(m.key,x.key),!!(g&&g.key===x.key),vimg(x.key)?x.key:'',x.code||x.years,x.code?x.years:'',x.code||x.years,x.code?x.years:'',x.count,x.key,i+1));
return`<section class="section hub-gens" aria-labelledby="hub-gens-t">
      <div class="wrap">
        <div class="sec-head hub-sec-head"><div><h2 id="hub-gens-t" data-mo-split>Kasa kodunu seçin</h2><p class="hub-sec-head__sub">${esc(m.label)} nesilleri — parçalar kasa koduna göre değişir.</p></div></div>
        <ul class="gcard-grid" data-mo-stagger>${all}${items.join('')}</ul>
      </div>
    </section>`;
}
function subsSection(nav,mk,col){
const subs=(mk.subs||[]).filter(x=>x.count>0);
if(!subs.length)return'';
return`<section class="section hub-make" aria-labelledby="hub-subs-t">
      <div class="wrap">
        <div class="sec-head hub-sec-head"><div><h2 id="hub-subs-t" data-mo-split>${esc(mk.label)} modelleri</h2><p class="hub-sec-head__sub">Modelinizi seçin; o modele uyan kategoriler ve parçalar açılır.</p></div></div>
        <ul class="vcard-grid" data-mo-stagger>${subs.map((x,i)=>vcard(nav,x,col,i)).join('')}</ul>
      </div>
    </section>`;
}
function colSection(nav,c,{heading='h2',id,title}={}){
if(!c.items.length)return'';
const H=heading;
let inner;
if(c.fams&&c.fams.length>1){
let n=0;
inner=c.fams.map(f=>{
const its=c.items.filter(m=>m.family===f);
return its.length?`<div class="hub-fam"><h3 class="hub-fam__title">${esc(({defender:'Defender',discovery:'Discovery',freelander:'Freelander'})[f]||f)}</h3><ul class="vcard-grid" data-mo-stagger>${its.map(m=>vcard(nav,m,c,n++)).join('')}</ul></div>`:'';
}).join('');
}else inner=`<ul class="vcard-grid" data-mo-stagger>${c.items.map((m,i)=>vcard(nav,m,c,i)).join('')}</ul>`;
const cta=c.cat?`<a class="btn btn--text" href="${esc(D.url.cat({model:c.cat}))}">Tüm ${esc(c.label)} parçaları${ICON('arrow')}</a>`:'';
return`<section class="section hub-make" aria-labelledby="${esc(id||'hm-'+c.key)}">
      <div class="wrap">
        <div class="sec-head hub-sec-head"><${H} id="${esc(id||'hm-'+c.key)}" data-mo-split>${title?esc(title):`<a href="${esc(c.href)}">${esc(c.label)}</a>`}</${H}>${cta}</div>
        ${inner}
      </div>
    </section>`;
}
function showActions(on){el.actions.hidden=!on;}
let bandOn=false,panelOn=false,panelArgs=null;
const headEl=()=>el.root.querySelector('.hub-head');
const bandFrom=(kind,band,src)=>(src?{kind,band,src}:null);
const aracBand=k=>{const vi=vimg(k);return vi?{kind:'arac',band:k,src:vi.src}:null;};
function setBand(b){
const h=headEl();
if(!h||!b||!b.src)return false;
const[w,hh]=b.kind==='arac'?[1200,800]:[1600,900];
const cur=h.querySelector('.hub-band');
const ci=cur&&cur.querySelector('.hub-band__car');
if(ci&&ci.getAttribute('src')===b.src&&ci.complete&&!ci.naturalWidth)return false;
h.classList.add('hub-head--band');h.classList.remove('hub-head--media');
h.dataset.band=b.band;h.dataset.bandKind=b.kind;
if(!cur)h.insertAdjacentHTML('afterbegin',`<div class="hub-band" aria-hidden="true"><span class="hub-band__fill"><img class="hub-band__bg" src="${esc(b.src)}" alt="" width="${w}" height="${hh}" decoding="async"></span><img class="hub-band__car" src="${esc(b.src)}" alt="" width="${w}" height="${hh}" fetchpriority="high" decoding="async"></div>`);
else cur.querySelectorAll('img').forEach(im=>{if(im.getAttribute('src')!==b.src){im.setAttribute('width',w);im.setAttribute('height',hh);im.setAttribute('src',b.src);}});
el.media.hidden=true;
el.media.innerHTML='';
bandOn=true;
return true;
}
function dropBandEl(h){
const b=h.querySelector('.hub-band');
if(b)b.remove();
h.classList.remove('hub-head--band');delete h.dataset.band;delete h.dataset.bandKind;
}
function setPanel(model,label,sub){
const h=headEl();
if(!h)return;
if(bandOn){dropBandEl(h);bandOn=false;}
h.classList.add('hub-head--media');
el.media.hidden=false;
el.media.className='hub-head__media hub-head__media--sil';
el.media.innerHTML=silMedia('hub-vis',model,label,sub);
panelOn=true;
}
function setHeadVisual(b,model,label,sub){
panelArgs=[model,label,sub];
if(!(b&&setBand(b)))setPanel(model,label,sub);
}
function settleHead(){
const h=headEl();
if(!h)return;
if(!bandOn)dropBandEl(h);
if(!panelOn)h.classList.remove('hub-head--media');
}
el.root.addEventListener('error',e=>{
const im=e.target;
if(!im||im.tagName!=='IMG')return;
const cat=im.closest('.cbox__media--ai');
if(cat){
const fb=cat.dataset.catFb;
cat.className=fb?'cbox__media':'cbox__media cbox__media--icon';
cat.innerHTML=fb?catPhoto(fb):D.catIco(cat.dataset.catKey,'lg');
return;
}
const box=im.closest('.vmedia--ai');
if(box){box.outerHTML=silMedia([...box.classList].filter(c=>!/^vmedia/.test(c)).join(' '),box.dataset.silModel,box.dataset.silLabel,box.dataset.silSub);return;}
if(im.closest('.hub-band')&&bandOn&&panelArgs)setPanel(...panelArgs);
},true);
function modelChips(items,col){
return items.filter(m=>m.count>0&&!(m.isMake&&(m.subs||[]).length)).map(m=>`<a class="chip gen-chip" href="${esc(D.url.hub(m.key))}" data-nav-model="${esc(m.key)}"><strong>${esc(D.shortModel(m,col))}</strong><small>${nf(m.count)}</small></a>`).join('');
}
function renderModel(nav,m,g){
const col=nav.colOfModel(m.key);
const gs=D.liveGens(m);
const one=!g&&D.soleGen?D.soleGen(m):null;
const gen=g||one;
const baseName=m.label;
const title=g?(g.code?`${baseName} ${g.code}`:baseName):baseName;
const years=gen?gen.years:'';
const count=g?g.count:m.count;
const ctx={model:m.key,kasa:g?g.key:''};
el.eyebrow.textContent=col?col.label:'Araca göre parça';
if(col)el.eyebrow.lang='en';else el.eyebrow.removeAttribute('lang');
el.h1.textContent=title;
const metaTxt=gen?`${gen.code?'Kasa kodu '+gen.code+' · ':''}${gen.years}`:gs.length>1?`Nesiller: ${gs.map(x=>x.code||x.years).join(' · ')}`:'';
el.meta.hidden=!metaTxt;
el.meta.textContent=metaTxt;
const lead=`${title}${years?` (${years})`:''} için ${nf(count)} ${partsWord(m)}: kategoriyi seçin, parçayı kodu ve KDV dahil fiyatıyla görün. Kasa kodundan ya da uyumdan emin değilseniz şasi numaranızla WhatsApp’tan sorun.`;
el.lead.textContent=lead;
let chips='';
if(gs.length<2){
const makeModel=m.isMake?m:nav.model(m.make);
const subs=makeModel&&makeModel.isMake?(makeModel.subs||[]).filter(x=>x.count>0):[];
if(subs.length){
chips=`<a class="chip gen-chip gen-chip--all" href="${esc(D.url.hub(makeModel.key))}"${m.isMake?' aria-current="true"':''}><strong>Tüm ${esc(makeModel.label)}</strong><small>${nf(makeModel.count)}</small></a>`+
subs.map(x=>`<a class="chip gen-chip" href="${esc(D.url.hub(x.key))}"${x.key===m.key?' aria-current="true"':''}><strong>${esc(D.shortModel(x,col))}</strong><small>${nf(x.count)}</small></a>`).join('');
}
}
el.gens.hidden=!chips;
el.gens.innerHTML=chips;
showActions(true);
el.all.href=D.url.cat(ctx);
el.all.innerHTML=`${esc(offroadish(m)?'Bu aracın tüm ürünleri':'Bu aracın tüm parçaları')} (${nf(count)})${ICON('arrow')}`;
el.wa.setAttribute('data-wa',`Merhaba, ${title}${years?' ('+years+')':''} için parça arıyorum. Şasi (VIN) numaram: `);
D.bindWa(el.actions);
paintSave(m,g);
el.save.onclick=()=>{
const on=D.garage.get()===m.key&&(!g||((D.garage.gen()||{}).key===g.key));
if(on){D.garage.set(null);D.toast('Araç seçimi kaldırıldı');}
else{D.garage.set(m.key,g||null);D.toast(`Aracım: ${title}`);}
};
document.addEventListener('dky:garage',()=>paintSave(m,g));
let band=m.isMake&&!g?bandFrom('marka',m.key,D.bandImage&&D.bandImage(m.key)):null;
if(!band)band=aracBand(vkey(m.key,g&&g.key,!!m.isMake));
setHeadVisual(band,m.key,title,gen?[gen.code,gen.years].filter(Boolean).join(' · '):'');
const groups=nav.groupsOf(m.key,g&&g.key);
const catsTitle=`${title} kategorileri`;
el.body.innerHTML=`${genSection(m,g,gs)}${m.isMake?subsSection(nav,m,col):''}
    <section class="section hub-cats" aria-labelledby="hub-cats-t">
      <div class="wrap">
        <div class="sec-head hub-sec-head">
          <div><h2 id="hub-cats-t" data-mo-split>${esc(catsTitle)}</h2><p class="hub-sec-head__sub">${groups.length?`${nf(groups.length)} kategoride ${nf(count)} ${partsWord(m)}`:'Bu seçimde henüz listelenmiş parça yok.'}</p></div>
          <p class="vat-note">${ICON('info')}Fiyatlar KDV dahildir</p>
        </div>
        ${groups.length
?`<ul class="cbox-grid cbox-grid--4" data-mo-stagger>${groups.map((x,i)=>cbox(nav,x,ctx,i)).join('')}</ul>`
:emptyState(m,g)}
        ${g?`<p class="cat-note" data-hub-gen-note hidden></p>`:''}
      </div>
    </section>
    <section class="section section--paper hub-pop" aria-labelledby="hub-pop-t" data-hub-pop hidden>
      <div class="wrap">
        <div class="sec-head hub-sec-head">
          <div><h2 id="hub-pop-t" data-mo-split>${esc(title)}: stoktaki popüler ${offroadish(m)?'ürünler':'parçalar'}</h2><p class="hub-sec-head__sub">Stokta, 15.00’e kadar verilen siparişte aynı gün kargoda.</p></div>
          <a class="btn btn--text" href="${esc(D.url.cat(ctx))}">Tümünü gör${ICON('arrow')}</a>
        </div>
        <div class="p-grid hub-pop__grid" data-hub-products></div>
      </div>
    </section>`;
D.bindWa(el.body);
D.paintGarage&&D.paintGarage();
const crumbs=[['Ana sayfa','/']];
if(col&&col.href!==D.url.hub(m.key))crumbs.push([col.label,col.href]);
const short=m.isMake?m.label:D.shortModel(m,col);
if(g){crumbs.push([short,D.url.hub(m.key)]);crumbs.push([g.code||g.years,null]);}
else crumbs.push([short,null]);
setCrumbs(crumbs);
const seoTitle=`${title}${g&&g.years?' ('+g.years+')':''} ${offroadish(m)?'Aksesuar ve Ekipmanları':'Yedek Parça ve Aksesuarları'}`;
setSEO({title:seoTitle,desc:firstSentences(lead),path:D.url.hub(m.key,g&&g.key),index:count>0});
D.track('view_vehicle_hub',{model:m.key,kasa:g?g.key:'',items:count});
D.observe&&D.observe(el.body);
loadProducts(m,g,ctx);
}
function paintSave(m,g){
const on=D.garage.get()===m.key&&(!g||((D.garage.gen()||{}).key===g.key));
el.save.setAttribute('aria-pressed',String(on));
el.save.classList.toggle('is-on',on);
el.saveT.textContent=on?'Aracım olarak kayıtlı':'Aracım olarak kaydet';
el.save.querySelector('svg use').setAttribute('href',`/dky/assets/h/img/icons.9d3a84566c.svg#i-${on?'check':'car'}`);
}
function emptyState(m,g){
return`<div class="empty-state">
      <span class="empty-state__icon">${ICON('search')}</span>
      <p class="empty-state__title">${esc(g?`${m.label} ${g.code||g.years}`:m.label)} için listede parça görünmüyor</p>
      <p>Katalogda görünmeyen parçaları da tedarik edebiliyoruz. Şasi numaranızı gönderin, uzmanımız size dönsün.</p>
      <div class="empty-state__actions">
        <a class="btn btn--wa" href="#" data-wa="${esc(`Merhaba, ${m.label}${g?' '+(g.code||g.years):''} için parça arıyorum. Şasi (VIN) numaram: `)}" data-track="whatsapp_click" data-track-label="hub_empty">${ICON('whatsapp')}WhatsApp'tan sor</a>
        ${g?`<a class="btn btn--secondary" href="${esc(D.url.hub(m.key))}">Tüm ${esc(m.label)} parçaları</a>`:''}
      </div>
    </div>`;
}
function loadProducts(m,g,ctx){
const sec=$('[data-hub-pop]'),grid=$('[data-hub-products]'),note=$('[data-hub-gen-note]');
if(!sec||!grid)return;
const run=()=>D.loadCatalog().then(cat=>{
const own=p=>p.models.includes(m.key);
const genOk=p=>!g||(Array.isArray(p.gens)&&p.gens.includes(g.key));
const list=cat.products.filter(p=>own(p)&&genOk(p));
const score=p=>(p.inStock?8:0)+(p.image?4:0)+(p.bestSeller?3:0)+(p.isNew?1:0)+(p.price>=300&&p.price<=15000?1:0);
const ranked=list.filter(p=>p.inStock&&p.image).map(p=>[score(p),p]).sort((a,b)=>b[0]-a[0]||a[1].id-b[1].id).map(r=>r[1]);
const per=new Map(),pick=[];
for(const p of ranked){const n=per.get(p.group)||0;if(n>=2)continue;per.set(p.group,n+1);pick.push(p);if(pick.length>=8)break;}
if(pick.length<4)for(const p of ranked){if(pick.length>=8)break;if(!pick.includes(p))pick.push(p);}
if(pick.length){
D.register&&D.register(pick);
grid.innerHTML=pick.map(p=>D.card(p)).join('');
sec.hidden=false;
D.observe&&D.observe(sec);
}
if(g&&note){
const untagged=cat.products.filter(p=>own(p)&&!(Array.isArray(p.gens)&&p.gens.some(k=>{const i=D.genInfo(k);return i&&i.model===m.key;}))).length;
if(untagged>0){
note.hidden=false;
note.innerHTML=`${ICON('info')}<span>Kasa kodu belirtilmemiş ${nf(untagged)} ${esc(m.label)} ürünü daha var; aracınıza uyup uymadığını şasi numaranızla doğrulatın.</span> <a href="${esc(D.url.cat({model:m.key}))}">Tüm ${esc(m.label)} ürünlerini gör</a>`;
}
}
}).catch(()=>{});
const idle=fn=>(window.requestIdleCallback?requestIdleCallback(fn,{timeout:2500}):setTimeout(fn,300));
if(document.readyState==='complete')idle(run);else window.addEventListener('load',()=>idle(run),{once:true});
}
function renderMake(nav,c){
const mk=c.key==='offroad'?'Off-road pick-up aksesuar ve ekipmanları':c.key==='bmw-mini'?'BMW ve Mini yedek parçaları':`${c.label} yedek parça ve aksesuarları`;
const n=c.items.filter(m=>!m.isMake||!(m.subs||[]).length).length;
el.eyebrow.textContent='Araca göre parça';el.eyebrow.removeAttribute('lang');
el.h1.textContent=mk.charAt(0).toLocaleUpperCase('tr-TR')+mk.slice(1);
const mkCount=(nav.make(c.key)||{}).count||0;
el.meta.hidden=false;
el.meta.textContent=`${mkCount?nf(mkCount)+(c.key==='offroad'?' ürün · ':' parça · '):''}${nf(n)} model`;
const lead=`${c.label} için ${nf(n)} model. Modelinizi ve kasa kodunu seçin; o araca uyan kategorileri ve parçaları KDV dahil açık fiyatla görün. Emin değilseniz şasi numaranızla WhatsApp’tan sorun.`;
el.lead.textContent=lead;
const chips=modelChips(c.items,c);
el.gens.innerHTML=chips;
el.gens.hidden=!chips;
el.gens.setAttribute('aria-label','Aracını seç');
showActions(true);
el.save.hidden=true;
el.all.hidden=!c.cat;
if(c.cat){
el.all.href=D.url.cat({model:c.cat});
el.all.innerHTML=`Tüm ${esc(c.label)} parçaları${ICON('arrow')}`;
}
el.wa.setAttribute('data-wa',`Merhaba, ${c.label} aracım için parça arıyorum. Şasi (VIN) numaram: `);
D.bindWa(el.actions);
let band=bandFrom('marka',c.key,D.bandImage&&D.bandImage(c.key));
if(!band)for(const k of(D.vehicleFamilyKeys?D.vehicleFamilyKeys(c.key):[]))if((band=aracBand(k)))break;
setHeadVisual(band,c.key,c.label,'');
el.body.innerHTML=colSection(nav,Object.assign({},c,{cat:''}),{id:'hub-make-t',title:`${c.label} modelleri`})+otherMakes(nav,c);
D.paintGarage&&D.paintGarage();
setCrumbs(c.parent?[['Ana sayfa','/'],[c.parent.label,c.parent.href],[c.label,null]]:[['Ana sayfa','/'],['Araçlar','/dky/arac.html'],[c.label,null]]);
setSEO({title:c.key==='offroad'?'Off-road Pick-up Aksesuar ve Ekipmanları':`${c.label} Yedek Parça ve Aksesuarları`,desc:firstSentences(lead),path:D.url.make(c.key)});
D.track('view_vehicle_hub',{make:c.key});
D.observe&&D.observe(el.body);
}
function otherMakes(nav,cur){
const others=nav.cols.filter(c=>c.key!==cur.key&&c.items.length);
return`<section class="section section--paper hub-others" aria-labelledby="hub-others-t">
      <div class="wrap">
        <h2 id="hub-others-t" class="hub-others__t">Diğer araçlar</h2>
        <ul class="hub-others__list">${others.map(c=>`<li><a class="chip" href="${esc(c.href)}">${esc(c.label)}${ICON('arrow')}</a></li>`).join('')}</ul>
      </div>
    </section>`;
}
function renderIndex(nav,missing){
el.eyebrow.textContent='Araca göre parça';el.eyebrow.removeAttribute('lang');
el.h1.textContent=missing?'Bu model bulunamadı':'Aracınızı seçin';
el.meta.hidden=true;
const jump=nav.cols.filter(c=>c.items.length).map(c=>`<a class="chip gen-chip" href="#hm-${esc(c.key)}"><strong>${esc(c.label)}</strong><small>${nf(c.items.filter(m=>!(m.isMake&&(m.subs||[]).length)).length)} model</small></a>`).join('');
el.gens.innerHTML=jump;
el.gens.hidden=!jump;
el.gens.setAttribute('aria-label','Markaya git');
showActions(false);
el.lead.textContent=missing
?'Aradığınız model listemizde yok ya da bağlantı hatalı olabilir. Aşağıdan modelinizi seçin; bulamazsanız şasi numaranızla WhatsApp’tan sorun, parçayı birlikte bulalım.'
:'Land Rover, Range Rover, Jaguar, BMW, Mini ve off-road pick-up’lar için model ve kasa koduna göre parçalar. Modelinizi seçin; o araca uyan kategorileri KDV dahil açık fiyatla görün.';
el.body.innerHTML=nav.cols.map(c=>colSection(nav,c)).join('');
D.paintGarage&&D.paintGarage();
setCrumbs([['Ana sayfa','/'],['Araçlar',null]]);
setSEO({title:'Araca Göre Yedek Parça | Land Rover, Jaguar, BMW, Mini, Off-road',desc:'Modelinizi ve kasa kodunu seçin; o araca uyan yedek parça ve aksesuar kategorilerini KDV dahil açık fiyatla görün. Emin değilseniz şasi numaranızla sorun.',path:'/dky/arac.html',index:!missing});
D.observe&&D.observe(el.body);
}
function errorState(){
el.body.innerHTML=`<section class="section"><div class="wrap"><div class="empty-state">
      <span class="empty-state__icon">${ICON('info')}</span>
      <p class="empty-state__title">Araç listesi şu anda yüklenemedi</p>
      <p>İnternet bağlantınızı kontrol edip tekrar deneyin. Parçanız acilse WhatsApp’tan ya da telefonla yazın.</p>
      <div class="empty-state__actions">
        <button class="btn btn--primary" type="button" data-hub-retry>Tekrar dene</button>
        <a class="btn btn--wa" href="#" data-wa="Merhaba, aracım için parça arıyorum. Şasi (VIN) numaram: " data-track="whatsapp_click" data-track-label="hub_error">${ICON('whatsapp')}WhatsApp</a>
      </div>
    </div></div></section>`;
D.bindWa(el.body);
const r=$('[data-hub-retry]',el.body);
if(r)r.addEventListener('click',()=>location.reload());
}
function route(nav){
const m=P.model?nav.model(P.model):null;
if(m){
let g=P.kasa?nav.gen(P.kasa):null;
if(g&&g.model!==m.key)g=null;
if(g&&!g.count)g=null;
renderModel(nav,m,g);
return;
}
if(!P.model&&P.kasa){
const g=nav.gen(P.kasa);
const gm=g&&nav.model(g.model);
if(gm){renderModel(nav,gm,g.count?g:null);return;}
}
if(!P.model&&P.marka&&FAMILY[P.marka]){
const f=FAMILY[P.marka];
const items=(nav.make('land-rover')||{models:[]}).models.filter(m=>m.family===P.marka&&m.count>0);
if(items.length){renderMake(nav,{key:P.marka,label:f.label,make:'land-rover',fams:[P.marka],cat:'',href:D.url.make(P.marka),items,parent:nav.col('land-rover')});return;}
}
if(!P.model&&P.marka){
const key=MAKE_ALIAS[P.marka]||P.marka;
if(key==='jaguar'&&nav.model('jaguar')){renderModel(nav,nav.model('jaguar'),null);return;}
const c=nav.col(key);
if(c&&c.items.length){renderMake(nav,c);return;}
}
renderIndex(nav,!!(P.model||P.marka));
}
if(P.model&&D.modelLabels&&D.modelLabels[P.model]){
el.h1.textContent=D.modelLabels[P.model];
if(el.skel)el.body.innerHTML=`<section class="section hub-cats"><div class="wrap"><div class="sec-head hub-sec-head"><div><h2>${esc(D.modelLabels[P.model])} kategorileri</h2><p class="hub-sec-head__sub">Yükleniyor…</p></div></div><ul class="cbox-grid cbox-grid--4" aria-hidden="true">${el.skel.innerHTML}</ul></div></section>`;
showActions(true);
}
const fontsReady=()=>{
const F=document.fonts;
const load=F&&F.load?Promise.all([F.load('700 1em Archivo'),F.load('400 1em Inter')]).catch(()=>{}):Promise.resolve();
return Promise.race([load,new Promise(r=>setTimeout(r,900))]);
};
const ready=mode=>fontsReady().then(()=>{el.root.classList.add('is-ready');document.dispatchEvent(new CustomEvent('dky:hub-ready',{detail:{mode,model:P.model,kasa:P.kasa,marka:P.marka}}));});
D.loadNav({fallback:true}).then(nav=>{route(nav);settleHead();ready(P.model||P.kasa?'model':P.marka?'make':'index');}).catch(()=>{settleHead();errorState();ready('error');});
})();
