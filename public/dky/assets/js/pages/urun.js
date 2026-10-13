(function(){
'use strict';
const D=window.DKY;
if(!D||!D.loadCatalog)return;
const C=window.DKY_CONFIG||{};
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=D.esc;
const showOld=p=>(D.showOld?D.showOld(p):C.showOldPrice!==false&&p.oldPrice>p.price);
const ICON=id=>D.icon?D.icon(id):`<svg aria-hidden="true"><use href="/dky/assets/h/img/icons.9d3a84566c.svg#i-${id}"/></svg>`;
const SITE=(C.siteUrl||'https://www.dkyautoparts.com').replace(/\/$/,'');
const STORE_HOST=(C.storeUrl||SITE).replace(/^https?:\/\/(www\.)?/,'').replace(/\/.*$/,'')||'dkyautoparts.com';
const PHONE=C.phone||'+902122852944';
const PHONE_L=C.phoneLabel||'+90 212 285 29 44';
const FREE=C.freeShippingLimit||3000;
const Q_ORDER={orijinal:0,oem:1,muadil:2,aksesuar:3};
const MAKES=[
{key:'land-rover',label:'Land Rover',fams:['range-rover','defender','discovery','freelander']},
{key:'jaguar',label:'Jaguar',single:true,sub:'jaguar-'},
{key:'bmw',label:'BMW',single:true,sub:'bmw-'},
{key:'mini',label:'Mini',single:true},
{key:'pickup',label:'Off-road pick-up',order:['ford-ranger','toyota-hilux','mitsubishi-l200','isuzu-dmax','nissan-navara','vw-amarok','mercedes-x-class','jeep']}
];
const RMQ=matchMedia('(prefers-reduced-motion: reduce)');
const SPRING='cubic-bezier(.34,1.56,.64,1)';
const EASE='cubic-bezier(.2,.7,.2,1)';
function reduced(){
const m=D.motion;
if(m&&'reduced'in m)return typeof m.reduced==='function'?!!m.reduced():!!m.reduced;
return RMQ.matches;
}
const canAnim=()=>!!Element.prototype.animate&&!reduced();
function stagger(nodes,{y=12,step=60,dur=320}={}){
if(!canAnim())return;
const k=matchMedia('(max-width: 760px)').matches?0.5:1;
nodes.slice(0,24).forEach((n,i)=>n.animate([{opacity:0,transform:`translateY(${y*k}px)`},{opacity:1,transform:'none'}],
{duration:dur,delay:Math.min(i,10)*step*k,easing:EASE,fill:'backwards'}));
}
function revealOnce(container,sel,opts){
if(!container||!canAnim())return;
const run=()=>stagger($$(sel,container),opts);
if(!('IntersectionObserver'in window))return run();
const nodes=$$(sel,container);
nodes.forEach(n=>{n.style.opacity='0';});
const io=new IntersectionObserver(ens=>{
if(!ens.some(e=>e.isIntersecting))return;
io.disconnect();
nodes.forEach(n=>{n.style.opacity='';});
run();
},{rootMargin:'0px 0px -10% 0px'});
io.observe(container);
}
const root=$('[data-pd-root]');
const crumbs=$('[data-pd-crumbs]');
if(!root)return;
const id=parseInt(new URLSearchParams(location.search).get('id'),10);
const uniq=a=>[...new Set(a)];
const brandKey=s=>String(s||'').toLocaleUpperCase('tr-TR').replace(/İ/g,'I').trim();
const isCodeTok=t=>t.length>=5&&(t.match(/\d/g)||[]).length>=3;
const codeTokens=p=>uniq((String(p.code||'').toUpperCase().match(/[A-Z0-9]+/g)||[]).filter(isCodeTok));
const quality=p=>D.quality(p)||D.quality(Object.assign({},p,{brand:brandKey(p.brand)}));
const EN_I=/\b(DISCOVERY|DISCO|HILUX|MITSUBISHI|NISSAN|ISUZU|MINI|VIGO|KIT|SPOILER|AUTOBIOGRAPHY|DIESEL|TRITON|INTERCOOLER|MOONVISOR|TERRAFIRMA|INCH|LIMITED|EDITION|DYNAMIC|PREMIUM|PLATINUM|SILVER|WHITE|LIGHT|PIRELLI|BRITPART|VISION|GRILLE|MIRROR|SIDE)\b/g;
const prepName=s=>String(s||'').replace(EN_I,m=>m[0]+m.slice(1).toLowerCase());
const T=s=>D.title(prepName(s));
const card=p=>D.card(Object.assign({},p,{name:prepName(p.name)},!D.quality(p)&&quality(p)?{brand:brandKey(p.brand)}:{}));
const lowerTR=s=>String(s||'').toLocaleLowerCase('tr-TR');
let cat=null,P=null;
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
function addLD(obj){
const s=document.createElement('script');
s.type='application/ld+json';
s.textContent=JSON.stringify(obj).replace(/</g,'\\u003c');
document.head.appendChild(s);
}
const clip=(s,n)=>(s.length>n?s.slice(0,n-1).replace(/\s+\S*$/,'')+'…':s);
function makeModels(mk){
if(mk.single)return cat.models.filter(m=>m.key===mk.key||(mk.sub&&m.key.startsWith(mk.sub)));
if(mk.fams)return cat.models.filter(m=>mk.fams.includes(m.family));
return mk.order.map(k=>cat.models.find(m=>m.key===k)).filter(Boolean);
}
function garageOptions(){
return'<option value="">Aracınızı seçin</option>'+MAKES.map(mk=>{
const ms=makeModels(mk);
if(!ms.length)return'';
return`<optgroup label="${esc(mk.label)}">${ms.map(m=>`<option value="${esc(m.key)}">${esc(mk.single&&m.key===mk.key?`${m.label} (tüm modeller)`:m.label)}</option>`).join('')}</optgroup>`;
}).join('');
}
const garageKey=()=>{const g=D.garage.get();return g&&cat&&cat.models.some(m=>m.key===g)?g:null;};
function render(p){
const name=T(p.name);
const q=quality(p);
const gLabel=cat.groupLabel(p.group);
const url=`${SITE}/urun.html?id=${p.id}`;
const imgs=uniq([p.image].concat(Array.isArray(p.images)?p.images:[]).filter(Boolean));
const toks=codeTokens(p);
const mainCode=toks[0]||String(p.code||'').trim().split(/\s+/)[0]||'';
const free=p.freeShipping||p.price>=FREE;
const save=showOld(p)?p.oldPrice-p.price:0;
const waMsg=`Merhaba, bu ürünü sormak / sipariş etmek istiyorum:\n${name}\nParça kodu: ${p.code}\nFiyat: ${D.fmt(p.price)} (KDV dahil)\n${url}\n\nŞasi (VIN) no: `;
const waStock=`Merhaba, bu ürünün tedarik süresini ve fiyatını öğrenmek istiyorum:\n${name}\nParça kodu: ${p.code}\n${url}\n\nŞasi (VIN) no: `;
const waVin=`Merhaba, bu parçanın aracıma uyup uymadığını kontrol eder misiniz?\n${name}\nParça kodu: ${p.code}\n${url}\n\nŞasi (VIN) no: `;
const flags=[];
if(!p.inStock)flags.push('<span class="tag tag--muted">Tedarik edilir</span>');
if(p.discount>=5&&showOld(p))flags.push(`<span class="tag">%${p.discount} indirim</span>`);
if(p.isNew)flags.push('<span class="tag">Yeni</span>');
const qHTML=q?`<span class="pd-q" tabindex="0" aria-describedby="pd-q-tip"><span class="q-badge q-badge--${q.key}">${esc(q.label)}</span>${ICON('info')}<span class="pd-tip" role="tooltip" id="pd-q-tip">${esc(q.hint)}</span></span>`:'';
const specs=[
['Marka',p.brand&&esc(p.brand)],
['Parça kodu',p.code&&`<span class="mono">${esc(p.code)}</span>`],
['Parça grubu',p.group&&`<a href="/dky/urunler.html?grup=${esc(p.group)}">${esc(gLabel)}</a>`],
['Uyumlu modeller',p.models.length&&p.models.map(k=>`<a href="/dky/urunler.html?model=${esc(k)}">${esc(cat.modelLabel(k))}</a>`).join(', ')],
['Kalite',q&&`${esc(q.label)} <span class="pd-spec__muted">— ${esc(q.hint)}</span>`],
['Kategori',p.category&&esc(p.category)],
['Stok durumu',p.inStock?'Stokta':'Tedarik edilir']
].filter(r=>r[1]);
const thumbs=imgs.length>1
?`<div class="pd-thumbs" role="tablist" aria-label="Ürün görselleri">${imgs.map((im,i)=>`<button class="pd-thumb${i?'':' is-on'}" type="button" role="tab" aria-selected="${i?'false':'true'}" data-thumb="${i}" aria-label="Görsel ${i+1}"><img src="${esc(D.img(im,120))}" alt="" width="64" height="64" loading="lazy" decoding="async"></button>`).join('')}</div>`
:'';
const buy=`<a class="btn btn--primary btn--red btn--lg btn--block pd-buy" href="${esc(D.storeUrl(p))}" target="_blank" rel="noopener" data-track="store_click" data-track-label="${esc(p.code)}">${ICON('cart')}Online satın al${ICON('external').replace('<svg','<svg class="pd-ext"')}</a>
          <p class="pd-buy__note">Ödeme, güvenli mağazamız ${esc(STORE_HOST)}’da tamamlanır; yeni sekmede açılır.</p>`;
const quoteRow=(primary)=>`<div class="pd-quote">
            <div class="pd-qty" role="group" aria-label="Adet">
              <button type="button" data-step="-1" aria-label="Adedi azalt">${ICON('minus')}</button>
              <input type="number" min="1" max="99" step="1" value="1" inputmode="numeric" aria-label="Adet" data-qty>
              <button type="button" data-step="1" aria-label="Adedi artır">${ICON('plus')}</button>
            </div>
            <button class="btn ${primary?'btn--primary btn--red':'btn--secondary btn--ghost'} pd-quote__add" type="button" data-add>${ICON('clipboard')}Teklif listesine ekle</button>
          </div>`;
const waBtn=`<a class="btn btn--wa btn--secondary btn--block" href="#" data-wa="${esc(p.inStock?waMsg:waStock)}" data-track="whatsapp_click" data-track-label="product">${ICON('whatsapp')}${p.inStock?'WhatsApp ile sor':'Tedarik süresini WhatsApp’tan sor'}</a>`;
root.innerHTML=`
<section class="pd-main">
  <div class="wrap pd-grid">
    <div class="pd-gallery">
      <div class="pd-gallery__in">
        <button class="pd-frame" type="button" data-zoom aria-label="Görseli tam ekran büyüt: ${esc(name)}">
          <img class="pd-img" src="${esc(D.img(imgs[0],800))}" srcset="${esc(D.img(imgs[0],400))} 400w, ${esc(D.img(imgs[0],800))} 800w, ${esc(D.img(imgs[0],1200))} 1200w" sizes="(max-width: 960px) calc(100vw - 40px), 600px" width="800" height="800" alt="${esc(name)}" fetchpriority="high" decoding="async">
          <span class="pd-lens" aria-hidden="true"></span>
          ${flags.length?`<span class="pd-frame__flags">${flags.slice(0,2).join('')}</span>`:''}
          <span class="pd-frame__hint">${ICON('search')}<span class="pd-hint-mouse">Yakınlaştırmak için üzerine gelin</span><span class="pd-hint-touch">Büyütmek için dokunun</span></span>
        </button>
        ${thumbs}
      </div>
    </div>
    <div class="pd-box" data-pd-box>
      <div class="pd-brandrow">
        ${p.brand?`<span class="pd-brand">${esc(p.brand)}</span>`:''}
        ${qHTML}
        <a class="pd-group" href="/dky/urunler.html?grup=${esc(p.group)}">${esc(gLabel)}</a>
      </div>
      <h1 class="pd-title">${esc(name)}</h1>
      <div class="pd-code">
        <span class="pd-code__l">OEM / parça kodu</span>
        <span class="pd-code__v mono">${esc(p.code)}</span>
        <button class="pd-copy" type="button" data-copy aria-label="Parça kodunu kopyala: ${esc(p.code)}">${ICON('clipboard')}<span>Kopyala</span></button>
      </div>
      <div class="pd-price">
        <span class="pd-price__now">${D.fmt(p.price)}</span>
        <span class="pd-price__vat">KDV dahil</span>
        ${save?`<div class="pd-price__sub"><span class="price__old">${D.fmt(p.oldPrice)}</span><span class="pd-price__save">${D.fmt(save)} indirim (%${p.discount})</span></div>`:''}
      </div>
      <p class="pd-stock ${p.inStock?'is-in':'is-out'}">${ICON(p.inStock?'check':'clock')}${p.inStock
?`<span><strong>Stokta</strong>${C.showStockUrgency!==false&&p.stock>0&&p.stock<=3?` · son ${p.stock} adet`:''} · 15.00'e kadar verilen siparişte aynı gün kargoda</span>`
:`<span><strong>Tedarik edilir</strong> · <a href="#" data-wa="${esc(waStock)}" data-track="whatsapp_click" data-track-label="product_supply">süre ve fiyatı sorun</a></span>`}</p>
      <div class="pd-fit" id="uyumluluk" aria-labelledby="pd-fit-title">
        <div class="pd-fit__head">
          <h2 id="pd-fit-title">Aracınıza uyar mı?</h2>
          <label class="sr-only" for="pd-garage">Aracım</label>
          <select class="pd-fit__select" id="pd-garage" data-pd-garage>${garageOptions()}</select>
        </div>
        <div class="pd-fit__result" data-fit aria-live="polite"></div>
        ${p.models.length
?`<ul class="pd-chips" aria-label="Ürün bilgisine göre uyumlu modeller">${p.models.map(k=>`<li><a class="pd-chip" data-model="${esc(k)}" href="/dky/urunler.html?model=${esc(k)}&amp;grup=${esc(p.group)}">${esc(cat.modelLabel(k))}</a></li>`).join('')}</ul>`
:'<p class="pd-fit__none">Bu ürün için katalogda model bilgisi yer almıyor.</p>'}
        <a class="btn btn--wa btn--secondary btn--sm pd-fit__vin" href="#" data-wa="${esc(waVin)}" data-track="whatsapp_click" data-track-label="product_vin">${ICON('whatsapp')}Şasi no ile doğrulat</a>
      </div>
      <div class="pd-actions" data-pd-cta>
        ${p.inStock?buy+quoteRow(false):quoteRow(true)}
        ${waBtn}
        ${p.inStock?'':`<a class="pd-storelink" href="${esc(D.storeUrl(p))}" target="_blank" rel="noopener" data-track="store_click" data-track-label="${esc(p.code)}">Ürünü mağazada görüntüle${ICON('external')}</a>`}
      </div>
      <ul class="pd-facts">
        <li>${ICON('bolt')}<span>Stoktaki ürünlerde 15.00'e kadar verilen siparişler <strong>aynı gün kargoda</strong></span></li>
        <li>${ICON('truck')}<span>İstanbul içi <strong>kurye ile teslimat</strong></span></li>
        <li>${ICON('box')}<span>${free?'<strong>Ücretsiz kargo</strong> (3.000 TL ve üzeri)':`<strong>${D.fmt(FREE-p.price)}</strong> daha ekleyin, kargo ücretsiz olsun`}</span></li>
        <li>${ICON('phone')}<span>Telefonla sipariş: <a href="tel:${esc(PHONE)}" data-track="phone_click" data-track-label="product">${esc(PHONE_L)}</a></span></li>
      </ul>
    </div>
  </div>
</section>
<section class="pd-detail" aria-labelledby="pd-spec-title">
  <div class="wrap pd-detail__grid">
    <div class="pd-specs">
      <h2 id="pd-spec-title">Teknik bilgiler</h2>
      <table class="pd-spec">
        <caption class="sr-only">${esc(name)} teknik bilgileri</caption>
        <tbody>${specs.map(([k,v])=>`<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('')}</tbody>
      </table>
    </div>
    <aside class="pd-help" aria-label="Yardım">
      <h3>Parçadan emin değil misiniz?</h3>
      <p>Kasa kodu ve model yılına göre parçalar değişebilir. Şasi (VIN) numaranızı gönderin; uzmanımız uyumu sipariş öncesi kontrol etsin.</p>
      <a class="btn btn--wa btn--secondary btn--block" href="#" data-wa="${esc(waVin)}" data-track="whatsapp_click" data-track-label="product_help">${ICON('whatsapp')}Şasi no ile doğrulat</a>
      <a class="btn btn--secondary btn--ghost btn--block" href="tel:${esc(PHONE)}" data-track="phone_click" data-track-label="product_help">${ICON('phone')}${esc(PHONE_L)}</a>
    </aside>
  </div>
</section>
<div class="pd-related" data-pd-related></div>
<div class="pd-bar" data-pd-bar aria-hidden="true">
  <div class="pd-bar__price"><strong>${D.fmt(p.price)}</strong><span>${p.inStock?'KDV dahil · Stokta':'KDV dahil · Tedarik edilir'}</span></div>
  ${p.inStock
?`<a class="btn btn--primary btn--red pd-bar__go" href="${esc(D.storeUrl(p))}" target="_blank" rel="noopener" tabindex="-1" data-track="store_click" data-track-label="${esc(p.code)}_bar">Satın al</a>`
:`<button class="btn btn--primary btn--red pd-bar__go" type="button" tabindex="-1" data-bar-quote>Listeye ekle</button>`}
  <a class="icon-btn pd-bar__wa" href="#" tabindex="-1" aria-label="WhatsApp ile sor" data-wa="${esc(p.inStock?waMsg:waStock)}" data-track="whatsapp_click" data-track-label="product_bar">${ICON('whatsapp')}</a>
</div>
<dialog class="pd-lb" aria-label="Ürün görseli: ${esc(name)}">
  <button class="icon-btn pd-lb__x" type="button" data-lb-close aria-label="Kapat">${ICON('close')}</button>
  <img class="pd-lb__img" alt="${esc(name)}" width="1200" height="1200" decoding="async">
  <p class="pd-lb__cap">${esc(name)} <span class="mono">${esc(p.code)}</span></p>
</dialog>`;
root.removeAttribute('aria-busy');
D.bindWa(root);
crumbs.innerHTML=`<li><a href="/dky/">Ana sayfa</a></li><li><a href="/dky/urunler.html">Ürünler</a></li><li><a href="/dky/urunler.html?grup=${esc(p.group)}">${esc(gLabel)}</a></li><li aria-current="page">${esc(clip(name,48))}</li>`;
seo(p,{name,q,gLabel,url,mainCode,imgs});
bindProduct(p,imgs,renderSims);
renderFit(p,false);
stagger($$('[data-pd-box] > *',root),{y:10,step:45,dur:300});
D.track('view_item',{
currency:'TRY',value:p.price,item_id:String(p.id),item_name:p.name,item_brand:p.brand,item_category:gLabel,price:p.price,
items:[{item_id:String(p.id),item_name:p.name,item_brand:p.brand,item_category:gLabel,item_variant:p.code,price:p.price,quantity:1}]
});
}
let sims=[];
const renderSims=()=>{
const grid=$('[data-sim]',root);
if(grid)grid.innerHTML=sims.map(card).join('');
};
function renderRelated(p){
const box=$('[data-pd-related]',root);
if(!box||!P||!P.length)return;
const toks=codeTokens(p);
const alts=toks.length?P.filter(x=>x.id!==p.id&&codeTokens(x).some(t=>toks.includes(t))):[];
sims=similar(p,new Set(alts.map(a=>a.id)));
const gLabel=cat.groupLabel(p.group);
box.innerHTML=(alts.length?altSection(p,alts,quality(p)):'')+(sims.length?`
<section class="pd-sim" aria-labelledby="pd-sim-title">
  <div class="wrap">
    <div class="pd-sec-head">
      <div><p class="eyebrow">${esc(gLabel)}</p><h2 id="pd-sim-title">Benzer ürünler</h2></div>
      <a class="pd-more" href="/dky/urunler.html?${p.models[0]?`model=${esc(p.models[0])}&amp;`:''}grup=${esc(p.group)}">Tümünü gör${ICON('arrow')}</a>
    </div>
    <div class="p-grid pd-sim__grid" data-sim></div>
  </div>
</section>`:'');
renderSims();
revealOnce($('.pd-cmp',box),'.pd-cmp__col',{y:14,step:70});
revealOnce($('[data-sim]',box),'.p-card',{y:14,step:60});
}
function similar(p,altIds){
const g=garageKey();
const score=x=>(x.inStock?4:0)+(x.image?2:0)+x.models.filter(m=>p.models.includes(m)).length+(g&&x.models.includes(g)?3:0)+(x.brand===p.brand?1:0);
const pick=fn=>P.filter(x=>x.id!==p.id&&!altIds.has(x.id)&&fn(x));
let list=pick(x=>x.group===p.group&&(p.models.length?x.models.some(m=>p.models.includes(m)):x.category===p.category));
if(list.length<4){
const have=new Set(list.map(x=>x.id));
list=list.concat(pick(x=>!have.has(x.id)&&(x.group===p.group||(p.category&&x.category===p.category))&&(p.group!=='diger'||x.category===p.category)));
}
return list.map(x=>[score(x),x]).sort((a,b)=>b[0]-a[0]).slice(0,8).map(r=>r[1]);
}
function altSection(p,alts,q){
const all=[p,...alts].map(x=>({x,q:x===p?q:quality(x)}))
.sort((a,b)=>((Q_ORDER[a.q&&a.q.key]??9)-(Q_ORDER[b.q&&b.q.key]??9))||(b.x.inStock-a.x.inStock)||(a.x.price-b.x.price));
const shown=all.slice(0,8);
if(!shown.some(r=>r.x===p))shown[shown.length-1]=all.find(r=>r.x===p);
const isLevels=new Set(all.map(r=>brandKey(r.x.brand))).size>1;
const diff=x=>{
if(x===p||!p.price||!x.price)return'';
const d=x.price-p.price;
if(Math.abs(d)<1)return'<span class="pd-cmp__diff">Aynı fiyat</span>';
return d<0?`<span class="pd-cmp__diff">${D.fmtShort(-d)} daha uygun</span>`:`<span class="pd-cmp__diff">${D.fmtShort(d)} daha yüksek</span>`;
};
const col=({x,q:xq})=>`
      <li class="pd-cmp__col${x===p?' is-current':''}">
        ${x===p?'<span class="pd-cmp__now">Bu ürün</span>':''}
        <div class="pd-cmp__img"><img src="${esc(D.img(x.image,400))}" alt="" width="400" height="300" loading="lazy" decoding="async"></div>
        <div class="pd-cmp__body">
          <div class="pd-cmp__meta">${xq?`<span class="q-badge q-badge--${xq.key}" title="${esc(xq.hint)}">${esc(xq.label)}</span>`:''}<span class="pd-cmp__brand">${esc(x.brand)}</span></div>
          ${x===p?`<span class="pd-cmp__name">${esc(T(x.name))}</span>`:`<a class="pd-cmp__name" href="${D.productUrl(x)}">${esc(T(x.name))}</a>`}
          <span class="code-chip">${esc(x.code)}</span>
          <span class="pd-cmp__stock">${ICON(x.inStock?'check':'clock')}${x.inStock?'Stokta':'Tedarik edilir'}</span>
          <div class="pd-cmp__foot">
            <div class="price">${showOld(x)?`<span class="price__old">${D.fmt(x.oldPrice)}</span>`:''}<span class="price__now">${D.fmt(x.price)}</span></div>
            ${diff(x)}
          </div>
        </div>
      </li>`;
return`
<section class="pd-alt" aria-labelledby="pd-alt-title">
  <div class="wrap">
    <div class="pd-sec-head">
      <div>
        <p class="eyebrow">${isLevels?'Aynı parça kodu · farklı kalite seviyeleri':'Aynı parça kodu · diğer seçenekler'}</p>
        <h2 id="pd-alt-title">${isLevels?'Kalite seviyelerini karşılaştırın':'Bu parçanın diğer seçenekleri'}</h2>
        <p class="pd-sec-head__lead">${isLevels?'Aynı parça numarasına sahip orijinal, OEM üretici ve muadil seçenekleri yan yana görün; bütçenize ve kullanımınıza göre seçin.':'Aynı parça numarasının renk, set veya paket seçenekleri.'}</p>
      </div>
    </div>
    <ul class="pd-cmp">${shown.map(col).join('')}</ul>
    ${all.length>shown.length?`<p class="pd-cmp__more"><a class="pd-more" href="/dky/urunler.html?q=${encodeURIComponent(codeTokens(p)[0]||p.code)}">Tüm ${all.length} seçeneği gör${ICON('arrow')}</a></p>`:''}
  </div>
</section>`;
}
let lastFitState=null;
function renderFit(p,animate=true){
const box=$('[data-fit]',root);
const sel=$('[data-pd-garage]',root);
if(!box)return;
const g=garageKey();
if(sel)sel.value=g||'';
$$('.pd-chip',root).forEach(a=>a.classList.toggle('is-mine',a.dataset.model===g));
let state,html;
if(!g){
state='none';
html=`${ICON('car')}<p>Aracınızı seçin; bu parçanın uyup uymadığını hemen gösterelim.</p>`;
}else{
const gl=cat.modelLabel(g);
if(!p.models.length){
state='unknown';
html=`${ICON('info')}<p><strong>${esc(gl)} için uyum bilgisi yok.</strong> Bu ürünün kaydında model bilgisi bulunmuyor; şasi numaranızla teyit edelim.</p>`;
}else if(p.models.includes(g)){
state='ok';
html=`${ICON('check')}<p><strong>${esc(gl)} ile uyumlu görünüyor.</strong> Ürün bilgisine göre eşleşti; kasa kodu ve model yılı için şasi numaranızla son kontrolü yapabiliriz.</p>`;
}else{
state='warn';
html=`${ICON('info')}<p><strong>Ürün bilgisinde ${esc(gl)} geçmiyor.</strong> Bu parça aracınıza uymayabilir. <a href="/dky/urunler.html?model=${esc(g)}&amp;grup=${esc(p.group)}">${esc(gl)} için ${esc(lowerTR(cat.groupLabel(p.group)))} ürünlerini görün</a>.</p>`;
}
}
box.className=`pd-fit__result is-${state}`;
box.innerHTML=html;
if(animate&&state!==lastFitState&&canAnim()){
box.animate([{transform:'scale(.96)',opacity:0.4},{transform:'scale(1)',opacity:1}],{duration:460,easing:SPRING});
const ic=$('svg',box);
if(ic)ic.animate([{transform:'scale(.4) rotate(-20deg)'},{transform:'none'}],{duration:520,easing:SPRING});
}
lastFitState=state;
}
function seo(p,{name,q,gLabel,url,mainCode,imgs}){
const hasCode=mainCode&&name.toUpperCase().includes(mainCode);
let title=`${name}${hasCode||!mainCode?'':' – '+mainCode}`;
title=title.length>62?clip(title,62)+' | DKY':title+' | DKY Auto Parts';
document.title=title;
const parts=[
`${name}${name.toUpperCase().includes(String(p.code).toUpperCase())?'':' ('+p.code+')'}${p.brand?', '+p.brand:''}${q?' '+q.label.toLocaleLowerCase('tr-TR'):''}.`,
`${D.fmt(p.price)} KDV dahil, ${p.inStock?'stokta; 15.00\'e kadar siparişte aynı gün kargo':'tedarik edilir'}.`,
'Uyumluluğu şasi numaranızla WhatsApp’tan sorun.',
'DKY Auto Parts.'
];
let desc='';
for(const part of parts){if((desc+' '+part).trim().length>158)break;desc=(desc+' '+part).trim();}
if(!desc)desc=clip(parts[0],158);
setMeta('meta[name="description"]','content',desc);
setMeta('link[rel="canonical"]','href',url);
setMeta('meta[property="og:type"]','content','product');
setMeta('meta[property="og:title"]','content',title);
setMeta('meta[property="og:description"]','content',desc);
setMeta('meta[property="og:url"]','content',url);
if(imgs[0])setMeta('meta[property="og:image"]','content',D.img(imgs[0],1200));
setMeta('meta[property="product:price:amount"]','content',p.price.toFixed(2));
setMeta('meta[property="product:price:currency"]','content','TRY');
const product={'@context':'https://schema.org','@type':'Product',name,sku:p.code,productID:String(p.id),description:desc,category:gLabel,url};
if(mainCode)product.mpn=mainCode;
if(p.brand)product.brand={'@type':'Brand',name:p.brand};
if(imgs.length)product.image=imgs.map(im=>D.img(im,1200));
if(p.price>0){
product.offers={
'@type':'Offer',url,priceCurrency:'TRY',price:p.price.toFixed(2),
availability:p.inStock?'https://schema.org/InStock':'https://schema.org/BackOrder',
itemCondition:'https://schema.org/NewCondition',
seller:{'@type':'Organization',name:C.brand||'DKY Auto Parts',url:SITE+'/'}
};
}
addLD(product);
addLD({
'@context':'https://schema.org','@type':'BreadcrumbList',
itemListElement:[
{'@type':'ListItem',position:1,name:'Ana sayfa',item:SITE+'/'},
{'@type':'ListItem',position:2,name:'Ürünler',item:SITE+'/urunler.html'},
{'@type':'ListItem',position:3,name:gLabel,item:`${SITE}/urunler.html?grup=${p.group}`},
{'@type':'ListItem',position:4,name,item:url}
]
});
}
function bindProduct(p,imgs,renderSims){
$('[data-copy]',root).addEventListener('click',e=>{
const btn=e.currentTarget;
const done=()=>{D.toast('Parça kodu kopyalandı');btn.classList.add('is-done');setTimeout(()=>btn.classList.remove('is-done'),1600);D.track('copy_code',{item_id:String(p.id),code:p.code});};
const fallback=()=>{
const ta=document.createElement('textarea');
ta.value=p.code;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';
document.body.appendChild(ta);ta.select();
try{document.execCommand('copy');done();}catch(err){D.toast('Kopyalanamadı, kodu seçip kopyalayın');}
ta.remove();
};
if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(p.code).then(done,fallback);
else fallback();
});
const qty=$('[data-qty]',root);
const clampQ=v=>Math.max(1,Math.min(99,parseInt(v,10)||1));
$$('[data-step]',root).forEach(b=>b.addEventListener('click',()=>{qty.value=clampQ(Number(qty.value)+Number(b.dataset.step));}));
qty.addEventListener('change',()=>{qty.value=clampQ(qty.value);});
$('[data-add]',root).addEventListener('click',()=>{D.quote.add(p,clampQ(qty.value));qty.value=1;});
const barQuote=$('[data-bar-quote]',root);
if(barQuote)barQuote.addEventListener('click',()=>D.quote.add(p,clampQ(qty.value)));
const sel=$('[data-pd-garage]',root);
if(sel)sel.addEventListener('change',()=>D.garage.set(sel.value||null));
document.addEventListener('dky:garage',()=>{renderFit(p,true);renderSims();});
bindGallery(p,imgs);
bindBar();
}
function bindGallery(p,imgs){
const frame=$('[data-zoom]',root),lens=$('.pd-lens',root),dlg=$('.pd-lb',root),main=$('.pd-img',root);
if(!frame)return;
let cur=0;
const big=()=>D.img(imgs[cur],1200);
const fine=matchMedia('(hover: hover) and (pointer: fine)');
let loadedFor=-1,loadingFor=-1;
const ensure=()=>{
if(!imgs[cur]||loadedFor===cur||loadingFor===cur)return;
loadingFor=cur;
const want=cur,im=new Image();
im.onload=()=>{if(want!==cur)return;loadedFor=cur;lens.style.backgroundImage=`url("${big()}")`;frame.classList.add('can-zoom');};
im.src=big();
};
const move=e=>{
const r=frame.getBoundingClientRect();
const x=Math.max(0,Math.min(100,((e.clientX-r.left)/r.width)*100));
const y=Math.max(0,Math.min(100,((e.clientY-r.top)/r.height)*100));
lens.style.backgroundPosition=`${x}% ${y}%`;
};
frame.addEventListener('pointerenter',e=>{if(!fine.matches||e.pointerType!=='mouse')return;ensure();frame.classList.add('is-zoom');move(e);});
frame.addEventListener('pointermove',e=>{if(frame.classList.contains('is-zoom'))move(e);});
frame.addEventListener('pointerleave',()=>frame.classList.remove('is-zoom'));
$$('[data-thumb]',root).forEach(t=>t.addEventListener('click',()=>{
const i=Number(t.dataset.thumb);
if(i===cur)return;
cur=i;
$$('[data-thumb]',root).forEach(b=>{const on=Number(b.dataset.thumb)===i;b.classList.toggle('is-on',on);b.setAttribute('aria-selected',String(on));});
frame.classList.remove('can-zoom');
const swap=()=>{
main.srcset=`${D.img(imgs[i],400)} 400w, ${D.img(imgs[i],800)} 800w, ${D.img(imgs[i],1200)} 1200w`;
main.src=D.img(imgs[i],800);
};
if(canAnim()){
main.animate([{opacity:1},{opacity:0}],{duration:120,easing:'ease-in',fill:'forwards'}).onfinish=()=>{
swap();
const show=()=>main.animate([{opacity:0,transform:'scale(1.02)'},{opacity:1,transform:'none'}],{duration:260,easing:EASE,fill:'forwards'});
if(main.complete)show();else main.addEventListener('load',show,{once:true});
};
}else swap();
}));
const lbImg=$('.pd-lb__img',dlg);
let back=null;
frame.addEventListener('click',()=>{
back=document.activeElement;
lbImg.src=big();
lbImg.classList.remove('is-zoomed');
if(typeof dlg.showModal==='function')dlg.showModal();else dlg.setAttribute('open','');
if(canAnim())dlg.animate([{opacity:0,transform:'scale(.97)'},{opacity:1,transform:'none'}],{duration:240,easing:EASE});
D.track('view_item_image',{item_id:String(p.id)});
});
const close=()=>{if(typeof dlg.close==='function'&&dlg.open)dlg.close();else dlg.removeAttribute('open');};
dlg.addEventListener('close',()=>{if(back&&back.focus)back.focus();});
dlg.addEventListener('click',e=>{
if(e.target.closest('[data-lb-close]')||e.target===dlg){close();return;}
if(e.target===lbImg){
const r=lbImg.getBoundingClientRect();
lbImg.style.transformOrigin=`${((e.clientX-r.left)/r.width)*100}% ${((e.clientY-r.top)/r.height)*100}%`;
lbImg.classList.toggle('is-zoomed');
}
});
}
function bindBar(){
const bar=$('[data-pd-bar]',root),cta=$('[data-pd-cta]',root);
if(!bar||!cta)return;
const mq=matchMedia('(max-width: 860px)');
const place=()=>{
const mb=$('.mbar');
const h=mb&&getComputedStyle(mb).display!=='none'?mb.getBoundingClientRect().height:0;
bar.style.bottom=h+'px';
document.body.style.setProperty('--pd-bottom',(h+bar.offsetHeight)+'px');
};
const sync=()=>{
const hb=($('#header')||{getBoundingClientRect:()=>({bottom:0})}).getBoundingClientRect().bottom;
const on=mq.matches&&cta.getBoundingClientRect().bottom<hb;
bar.classList.toggle('is-on',on);
bar.setAttribute('aria-hidden',String(!on));
$$('a, button',bar).forEach(x=>{x.tabIndex=on?0:-1;});
document.body.classList.toggle('pd-has-bar',mq.matches);
};
let ticking=false;
window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(()=>{ticking=false;sync();});}},{passive:true});
place();sync();
window.addEventListener('resize',()=>{place();sync();},{passive:true});
if(mq.addEventListener)mq.addEventListener('change',()=>{place();sync();});
}
function notFound(){
document.title='Ürün bulunamadı | DKY Auto Parts';
setMeta('meta[name="robots"]','content','noindex,nofollow');
crumbs.innerHTML='<li><a href="/dky/">Ana sayfa</a></li><li><a href="/dky/urunler.html">Ürünler</a></li><li aria-current="page">Ürün bulunamadı</li>';
const groups=[['fren','Fren sistemi'],['suspansiyon','Süspansiyon'],['motor','Motor ve mekanik'],['filtre','Filtre ve bakım'],['bodykit','Body kit'],['offroad','Off-road ve kamp']];
root.removeAttribute('aria-busy');
root.innerHTML=`
<section class="pd-404">
  <div class="wrap pd-404__in">
    <p class="eyebrow">Hata 404 · Ürün bulunamadı</p>
    <h1>Bu ürün bulunamadı</h1>
    <p class="pd-404__lead">Ürün kaldırılmış ya da bağlantı hatalı olabilir. Parça adı veya OEM koduyla arayın; bulamazsanız şasi numaranızla WhatsApp’tan yazın, parçayı sizin için tedarik edelim.</p>
    <form class="pd-404__search" role="search" action="/dky/urunler.html">
      ${ICON('search')}
      <label class="sr-only" for="nf-q">Parça adı veya OEM kodu</label>
      <input id="nf-q" name="q" type="search" autocomplete="off" required placeholder="OEM kodu veya parça adı">
      <button class="btn btn--primary btn--red" type="submit">Parça bul</button>
    </form>
    <ul class="pd-404__links">${groups.map(([k,l])=>`<li><a href="/dky/urunler.html?grup=${k}">${l}</a></li>`).join('')}<li><a href="/dky/urunler.html">Tüm katalog</a></li></ul>
    <div class="pd-404__actions">
      <a class="btn btn--wa btn--secondary" href="#" data-wa="Merhaba, sitede bir ürüne ulaşamadım. Aradığım parça: \nŞasi (VIN) no: " data-track="whatsapp_click" data-track-label="product_404">${ICON('whatsapp')}WhatsApp'tan sor</a>
      <a class="btn btn--secondary btn--ghost" href="tel:${esc(PHONE)}" data-track="phone_click" data-track-label="product_404">${ICON('phone')}${esc(PHONE_L)}</a>
    </div>
  </div>
</section>`;
D.bindWa(root);
stagger($$('.pd-404__in > *',root),{y:10,step:50});
}
function errorState(){
root.removeAttribute('aria-busy');
document.title='Ürün yüklenemedi | DKY Auto Parts';
root.innerHTML=`
<section class="pd-404">
  <div class="wrap pd-404__in">
    <p class="eyebrow">Bağlantı sorunu</p>
    <h1>Ürün bilgisi yüklenemedi</h1>
    <p class="pd-404__lead">İnternet bağlantınızı kontrol edip tekrar deneyin. Acil parça ihtiyacınız için WhatsApp’tan ya da telefonla hemen yazın.</p>
    <div class="pd-404__actions">
      <button class="btn btn--primary btn--red" type="button" data-retry>Tekrar dene</button>
      <a class="btn btn--wa btn--secondary" href="#" data-wa="Merhaba, şu ürün sayfasına ulaşamadım: ${esc(location.href)}\nŞasi (VIN) no: " data-track="whatsapp_click" data-track-label="product_error">${ICON('whatsapp')}WhatsApp</a>
      <a class="btn btn--secondary btn--ghost" href="tel:${esc(PHONE)}" data-track="phone_click" data-track-label="product_error">${ICON('phone')}${esc(PHONE_L)}</a>
    </div>
  </div>
</section>`;
D.bindWa(root);
$('[data-retry]',root).addEventListener('click',()=>location.reload());
}
const setHdr=()=>{const h=$('#header'),m=$('.pd');if(h&&m)m.style.setProperty('--hdr',Math.round(h.getBoundingClientRect().height)+'px');};
setHdr();
window.addEventListener('resize',setHdr,{passive:true});
const KOVA=256;
const KOVA_DIZIN='/dky/assets/h/js/data/p.356e9d0e75/';
function loadBucket(pid){
if(!window.fetch)return Promise.reject(new Error('fetch yok'));
return fetch(KOVA_DIZIN+(pid%KOVA)+'.json',{credentials:'same-origin'})
.then(r=>{if(!r.ok)throw new Error('kova '+r.status);return r.json();})
.then(b=>{if(!b||b.v!==1||!b.products||!b.models||!b.groups)throw new Error('kova biçimi');return b;});
}
const labelsOf=(models,groups)=>({
models,groups,
modelLabel:k=>(models.find(m=>m.key===k)||{}).label||k,
groupLabel:k=>(groups.find(g=>g.key===k)||{}).label||k
});
const idle=fn=>(window.requestIdleCallback?requestIdleCallback(fn,{timeout:2500}):setTimeout(fn,200));
function loadRest(p){
const go=()=>idle(()=>D.loadCatalog().then(c=>{
cat=c;P=c.products;
renderRelated(c.byId.get(p.id)||p);
}).catch(()=>{}));
if(document.readyState==='complete')go();else window.addEventListener('load',go,{once:true});
}
function fromCatalog(){
D.loadCatalog().then(c=>{
cat=c;P=c.products;
const p=c.byId.get(id);
if(!p){notFound();return;}
render(p);
renderRelated(p);
}).catch(errorState);
}
function start(){
if(!Number.isFinite(id)||id<=0){notFound();return;}
loadBucket(id).then(b=>{
const p=b.products[id];
if(!p){fromCatalog();return;}
cat=labelsOf(b.models,b.groups);P=[];
render(p);
loadRest(p);
},fromCatalog).catch(errorState);
}
start();
})();
