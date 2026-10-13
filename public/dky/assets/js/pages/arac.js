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
function cbox(nav,g,ctx){
const grp=nav.group(g.group)||{key:g.group,label:D.groupName(g.group)};
const media=g.image
?`<span class="cbox__media"><img src="${esc(img(g.image,400))}" alt="" width="400" height="400" loading="lazy" decoding="async"></span>`
:`<span class="cbox__media cbox__media--icon">${D.catIco(grp.key,'lg')}</span>`;
return`<li><a class="cbox" href="${esc(D.url.cat(Object.assign({grup:grp.key},ctx)))}" data-mo-spot>${media}<span class="cbox__body"><span class="cbox__name">${D.catIco(grp.key,'sm')}${esc(grp.label)}</span><span class="cbox__count">${nf(g.count)} parça</span></span><span class="cbox__go" aria-hidden="true">${ICON('arrow')}</span></a></li>`;
}
const CLEAN=['fren','suspansiyon','motor','aydinlatma','sogutma','filtre','elektrik','aktarma'];
const cleanImgs=(list,fallback)=>{
const by=new Map((list||[]).filter(x=>x.image).map(x=>[x.group,x.image]));
const out=CLEAN.map(g=>by.get(g)).filter(Boolean);
return[...new Set(out.length?out:[fallback].filter(Boolean))];
};
function mbox(nav,m,col){
const gs=D.liveGens(m);
const imgs=cleanImgs(nav.groupsOf(m.key),m.image).slice(0,3);
const vi=vehicleFor(m.key,'',!!m.isMake);
const media=vi
?`<span class="mbox__media mbox__media--photo"><img src="${esc(vi.src)}" alt="" width="${vi.w}" height="${vi.h}"${vi.pos?` style="object-position:${esc(vi.pos)}"`:''} loading="lazy" decoding="async"></span>`
:imgs.length
?`<span class="mbox__media mbox__media--collage">${imgs.map(im=>`<img src="${esc(img(im,400))}" alt="" width="400" height="400" loading="lazy" decoding="async">`).join('')}</span>`
:`<span class="mbox__media mbox__media--sil"><svg class="car-sil" aria-hidden="true"><use href="/dky/assets/h/img/icons.9d3a84566c.svg#${offroadish(m)?'sil-pickup':'sil-suv'}"/></svg></span>`;
const sg=D.soleGen?D.soleGen(m):null;
const meta=sg?`${sg.code?sg.code+' · ':''}${sg.years}`:gs.length>1?gs.map(g=>g.code||g.years).join(' · '):'';
const name=m.isMake?D.shortModel(m,col):m.label;
const chips=gs.length>1?`<div class="gen-chips gen-chips--sm" role="group" aria-label="${esc(m.label)} nesilleri">${gs.map(g=>`<a class="chip gen-chip" href="${esc(D.url.hub(m.key,g.key))}" data-nav-model="${esc(m.key)}" data-nav-gen="${esc(g.key)}" aria-label="${esc(m.label+' '+(g.code?g.code+' ':'')+g.years)}">${g.code?`<strong>${esc(g.code)}</strong>`:''}<small>${esc(g.years)}</small></a>`).join('')}</div>`:'';
return`<li class="mbox-item"><a class="mbox" href="${esc(D.url.hub(m.key))}" data-nav-model="${esc(m.key)}" data-mo-spot>${media}<span class="mbox__body"><span class="mbox__name">${esc(name)}</span>${meta?`<span class="mbox__meta">${esc(meta)}</span>`:''}<span class="mbox__count">${nf(m.count)} ${offroadish(m)?'ürün':'parça'}</span></span></a>${chips}</li>`;
}
function colSection(nav,c,{heading='h2',id,title}={}){
if(!c.items.length)return'';
const H=heading;
let inner;
if(c.fams&&c.fams.length>1){
inner=c.fams.map(f=>{
const its=c.items.filter(m=>m.family===f);
return its.length?`<div class="hub-fam"><h3 class="hub-fam__title">${esc(({defender:'Defender',discovery:'Discovery',freelander:'Freelander'})[f]||f)}</h3><ul class="mbox-grid" data-mo-stagger>${its.map(m=>mbox(nav,m,c)).join('')}</ul></div>`:'';
}).join('');
}else inner=`<ul class="mbox-grid" data-mo-stagger>${c.items.map(m=>mbox(nav,m,c)).join('')}</ul>`;
const cta=c.cat?`<a class="btn btn--text" href="${esc(D.url.cat({model:c.cat}))}">Tüm ${esc(c.label)} parçaları${ICON('arrow')}</a>`:'';
return`<section class="section hub-make" aria-labelledby="${esc(id||'hm-'+c.key)}">
      <div class="wrap">
        <div class="sec-head hub-sec-head"><${H} id="${esc(id||'hm-'+c.key)}" data-mo-split>${title?esc(title):`<a href="${esc(c.href)}">${esc(c.label)}</a>`}</${H}>${cta}</div>
        ${inner}
      </div>
    </section>`;
}
function showActions(on){el.actions.hidden=!on;}
const GENERIC=new Set(['offroad','jaguar','bmw-mini','discovery','freelander']);
function vehicleFor(key,gen,allowGeneric){
if(!D.vehicleImage||!D.vehicleKey)return null;
const k=D.vehicleKey(key,gen);
if(GENERIC.has(k)&&!allowGeneric)return null;
const vi=D.vehicleImage(k,1100);
return vi&&vi.kind==='photo'&&vi.w<480?null:vi;
}
function setVehicle(vi,alt){
el.media.hidden=false;
el.media.className=`hub-head__media hub-head__media--vehicle hub-head__media--${vi.kind}`;
el.media.innerHTML=`<span class="media-well"><img src="${esc(vi.src)}"${vi.srcset?` srcset="${esc(vi.srcset)}" sizes="(max-width: 960px) 100vw, 520px"`:''} alt="${esc(alt||'')}" width="${vi.w}" height="${vi.h}"${vi.pos?` style="object-position:${esc(vi.pos)}"`:''} fetchpriority="high" decoding="async"></span>`;
}
const BAND={'land-rover':'land-rover','range-rover':'land-rover',discovery:'land-rover',freelander:'land-rover',defender:'land-rover',jaguar:'jaguar','bmw-mini':'bmw-mini',bmw:'bmw-mini',mini:'bmw-mini',offroad:'offroad'};
function bandSrc(key){
const M=(window.DKY_GORSELLER&&window.DKY_GORSELLER.marka)||{};
const b=BAND[key];
return b&&M[b]?'/'+String(M[b]).replace(/^\/+/,''):'';
}
function setBand(src,band){
const head=el.root.querySelector('.hub-head');
if(!head||!src)return false;
head.classList.add('hub-head--band');head.dataset.band=band||'';
if(!head.querySelector('.hub-band'))head.insertAdjacentHTML('afterbegin',`<div class="hub-band" aria-hidden="true"><span class="hub-band__fill"><img class="hub-band__bg" src="${esc(src)}" alt="" width="1600" height="900" decoding="async"></span><img class="hub-band__car" src="${esc(src)}" alt="" width="1600" height="900" fetchpriority="high" decoding="async"></div>`);
el.media.hidden=true;
el.media.innerHTML='';
return true;
}
function modelChips(items,col){
return items.filter(m=>m.count>0&&!(m.isMake&&(m.subs||[]).length)).map(m=>`<a class="chip gen-chip" href="${esc(D.url.hub(m.key))}" data-nav-model="${esc(m.key)}"><strong>${esc(D.shortModel(m,col))}</strong><small>${nf(m.count)}</small></a>`).join('');
}
function setMedia(list,vi,alt){
if(vi){setVehicle(vi,alt);return;}
const imgs=list.filter(Boolean).slice(0,3);
if(!imgs.length){el.media.hidden=true;el.media.innerHTML='';return;}
el.media.hidden=false;
el.media.className=`hub-head__media hub-head__media--${imgs.length}`;
el.media.innerHTML=imgs.map((im,i)=>`<span class="media-well"><img src="${esc(img(im,i?400:800))}" alt="" width="${i?400:800}" height="${i?400:800}" ${i?'loading="lazy"':'fetchpriority="high"'} decoding="async"></span>`).join('');
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
el.h1.textContent=title;
const metaTxt=gen?`${gen.code?'Kasa kodu '+gen.code+' · ':''}${gen.years}`:gs.length>1?`Nesiller: ${gs.map(x=>x.code||x.years).join(' · ')}`:'';
el.meta.hidden=!metaTxt;
el.meta.textContent=metaTxt;
const lead=`${title}${years?` (${years})`:''} için ${nf(count)} ${partsWord(m)}: kategoriyi seçin, parçayı kodu ve KDV dahil fiyatıyla görün. Kasa kodundan ya da uyumdan emin değilseniz şasi numaranızla WhatsApp’tan sorun.`;
el.lead.textContent=lead;
let chips='';
if(gs.length>1){
chips=`<a class="chip gen-chip gen-chip--all" href="${esc(D.url.hub(m.key))}"${g?'':' aria-current="true"'}><strong>Tüm nesiller</strong><small>${nf(m.count)}</small></a>`+
gs.map(x=>`<a class="chip gen-chip" href="${esc(D.url.hub(m.key,x.key))}"${g&&g.key===x.key?' aria-current="true"':''} aria-label="${esc(m.label+' '+(x.code?x.code+' ':'')+x.years+', '+nf(x.count)+' parça')}">${x.code?`<strong>${esc(x.code)}</strong>`:''}<small>${esc(x.years)}</small></a>`).join('');
}else{
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
const groups=nav.groupsOf(m.key,g&&g.key);
if(!(m.isMake&&setBand(bandSrc(m.key),BAND[m.key])))setMedia(cleanImgs(groups,m.image),vehicleFor(m.key,g&&g.key,!!m.isMake),title);
const catsTitle=`${title} kategorileri`;
el.body.innerHTML=`
    <section class="section hub-cats" aria-labelledby="hub-cats-t">
      <div class="wrap">
        <div class="sec-head hub-sec-head">
          <div><h2 id="hub-cats-t" data-mo-split>${esc(catsTitle)}</h2><p class="hub-sec-head__sub">${groups.length?`${nf(groups.length)} kategoride ${nf(count)} ${partsWord(m)}`:'Bu seçimde henüz listelenmiş parça yok.'}</p></div>
          <p class="vat-note">${ICON('info')}Fiyatlar KDV dahildir</p>
        </div>
        ${groups.length
?`<ul class="cbox-grid cbox-grid--4" data-mo-stagger>${groups.map(x=>cbox(nav,x,ctx)).join('')}</ul>`
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
el.eyebrow.textContent='Araca göre parça';
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
showActions(!!c.cat);
if(c.cat){
el.all.href=D.url.cat({model:c.cat});
el.all.innerHTML=`Tüm ${esc(c.label)} parçaları${ICON('arrow')}`;
el.save.hidden=true;
el.wa.setAttribute('data-wa',`Merhaba, ${c.label} aracım için parça arıyorum. Şasi (VIN) numaram: `);
D.bindWa(el.actions);
}
if(!setBand(bandSrc(c.key),BAND[c.key]))setMedia(c.items.map(m=>cleanImgs(nav.groupsOf(m.key),m.image)[0]),vehicleFor(c.key,'',true),c.label);
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
el.eyebrow.textContent='Araca göre parça';
el.h1.textContent=missing?'Bu model bulunamadı':'Aracınızı seçin';
el.meta.hidden=true;
el.gens.hidden=true;
showActions(false);
el.lead.textContent=missing
?'Aradığınız model listemizde yok ya da bağlantı hatalı olabilir. Aşağıdan modelinizi seçin; bulamazsanız şasi numaranızla WhatsApp’tan sorun, parçayı birlikte bulalım.'
:'Land Rover, Range Rover, Jaguar, BMW, Mini ve off-road pick-up’lar için model ve kasa koduna göre parçalar. Modelinizi seçin; o araca uyan kategorileri KDV dahil açık fiyatla görün.';
setMedia([]);
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
D.loadNav({fallback:true}).then(nav=>{route(nav);ready(P.model||P.kasa?'model':P.marka?'make':'index');}).catch(()=>{errorState();ready('error');});
})();
