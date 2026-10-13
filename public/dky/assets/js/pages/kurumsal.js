(function(){
'use strict';
const C=window.DKY_CONFIG||{};
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const DKY=()=>window.DKY||{};
const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const masks=$$('.k-mask');
if(masks.length){
const show=el=>el.classList.add('is-in');
const M=DKY().motion;
if(reduce||!('IntersectionObserver'in window))masks.forEach(show);
else if(M&&typeof M.inView==='function')masks.forEach(el=>M.inView(el,()=>show(el)));
else{
const io=new IntersectionObserver(entries=>entries.forEach(en=>{
if(en.isIntersecting){show(en.target);io.unobserve(en.target);}
}),{rootMargin:'0px 0px -6% 0px'});
masks.forEach(el=>io.observe(el));
}
}
const F=window.DKY_FEATURED;
if(F){
const floorK=n=>{const step=n>=10000?1000:100;return(Math.floor(n/step)*step).toLocaleString('tr-TR')+'+';};
$$('[data-stat]').forEach(el=>{
const n=F.stats&&F.stats[el.getAttribute('data-stat')];
if(n>=1000)el.textContent=floorK(n);
});
$$('[data-model-count]').forEach(el=>{
const n=F.modelCounts&&F.modelCounts[el.getAttribute('data-model-count')];
if(n)el.textContent=Number(n).toLocaleString('tr-TR');
});
}
$$('[data-hours]').forEach(el=>{
const h=String(C.hours||'').trim();
if(!h){el.hidden=true;return;}
const t=$('[data-hours-text]',el);
if(t)t.textContent=h;
el.hidden=false;
});
const L=C.legal||{};
$$('[data-legal]').forEach(el=>{
const k=el.getAttribute('data-legal');
const v=k==='tax'
?[L.taxOffice,L.taxNo].map(x=>String(x||'').trim()).filter(Boolean).join(' · ')
:String(L[k]||'').trim();
const row=el.closest('[data-legal-row]');
if(!v){if(row&&!el.hasAttribute('data-legal-keep'))row.hidden=true;return;}
el.textContent=v;
if(row)row.hidden=false;
});
$$('[data-map-load]').forEach(btn=>{
btn.addEventListener('click',()=>{
const box=btn.closest('.k-map');
if(!box)return;
const f=document.createElement('iframe');
f.title=btn.getAttribute('data-map-title')||'Harita';
f.src=btn.getAttribute('data-map-load');
f.loading='lazy';
f.referrerPolicy='no-referrer-when-downgrade';
f.allowFullscreen=true;
box.appendChild(f);
btn.closest('.k-map__ph')?.remove();
if(DKY().track)DKY().track('map_load',{page:location.pathname});
},{once:true});
});
$$('[data-store-path]').forEach(a=>{
const base=String(C.storeUrl||'https://www.dkyautoparts.com').replace(/\/$/,'');
a.href=base+a.getAttribute('data-store-path');
});
const toc=$('[data-toc]');
if(toc){
const details=$('details',toc);
const mq=window.matchMedia('(max-width: 960px)');
const sync=()=>{if(details)details.open=!mq.matches;};
sync();
if(mq.addEventListener)mq.addEventListener('change',sync);
const links=$$('a[href^="#"]',toc);
const map=new Map();
links.forEach(a=>{
const sec=document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
if(sec)map.set(sec,a);
a.addEventListener('click',()=>{if(mq.matches&&details)details.open=false;});
});
if('IntersectionObserver'in window&&map.size){
const visible=new Set();
const setActive=()=>{
let first=null;
for(const sec of map.keys())if(visible.has(sec)){first=sec;break;}
if(!first)return;
links.forEach(a=>a.removeAttribute('aria-current'));
map.get(first).setAttribute('aria-current','true');
};
const io=new IntersectionObserver(entries=>{
entries.forEach(en=>(en.isIntersecting?visible.add(en.target):visible.delete(en.target)));
setActive();
},{rootMargin:'-15% 0px -70% 0px'});
map.forEach((_,sec)=>io.observe(sec));
}
}
const konu=new URLSearchParams(location.search).get('konu');
if(konu){
$$('select[data-preselect]').forEach(sel=>{
const opt=$$('option',sel).find(o=>o.dataset.key===konu);
if(opt)sel.value=opt.value;
});
}
$$('[data-line-count]').forEach(out=>{
const ta=document.getElementById(out.getAttribute('data-line-count'));
if(!ta)return;
const update=()=>{
const n=ta.value.split('\n').map(s=>s.trim()).filter(Boolean).length;
out.textContent=n?`${n} satır`:'';
};
ta.addEventListener('input',update);
update();
});
const nf=$('[data-nf]');
if(nf){
const fontsOk=()=>nf.classList.add('is-fonts');
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fontsOk,fontsOk);else fontsOk();
const path=location.pathname+location.search;
$$('[data-nf-path]').forEach(el=>{el.textContent=path;});
$$('[data-nf-wa]').forEach(a=>{
a.setAttribute('data-wa',`Merhaba, sitenizde şu adrese ulaşamadım: ${path}\nAradığım parça: `);
});
if(document.readyState!=='loading'&&DKY().bindWa)DKY().bindWa(nf);
const form=$('[data-nf-search]');
if(form){
form.addEventListener('submit',e=>{
const q=(form.q&&form.q.value||'').trim();
if(DKY().openSearch){
e.preventDefault();
DKY().openSearch(q);
}
});
}
const report=()=>DKY().track&&DKY().track('page_not_found',{page:path,referrer:document.referrer||''});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',report);
else report();
}
})();
