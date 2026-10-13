(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const F=window.DKY_FEATURED||null;
const nf=n=>Number(n).toLocaleString('tr-TR');
const AUTO_MS=7000;
const BRAND_OF=m=>(!m?'':/^(rr-|defender|discovery|freelander)/.test(m)?'landrover'
:/^jaguar/.test(m)?'jaguar':(/^bmw/.test(m)||m==='mini')?'bmw-mini':'offroad');
function ready(fn){
if(window.DKY&&window.DKY.motion&&window.DKY.garage)fn();
else document.addEventListener('dky:ready',fn,{once:true});
}
ready(()=>{
const DKY=window.DKY,M=DKY.motion;
const hero=$('.hero');
if(!hero)return;
hero.classList.add('is-intro');
setTimeout(()=>{hero.classList.remove('is-intro');hero.classList.add('is-ready');},M.reduced?0:1200);
if(F){
$$('[data-bcount]').forEach(el=>{const b=F.brands&&F.brands[el.dataset.bcount];if(b&&b.count)el.textContent=nf(b.count);});
$$('.hero [data-stat="total"]').forEach(el=>{if(F.stats&&F.stats.total)el.textContent=nf(Math.floor(F.stats.total/1000)*1000)+'+';});
}
const list=$('.paths__list',hero);
const tabs=list?$$('.path',list):[];
const ind=list&&$('.paths__ind',list);
const scenes=new Map($$('.scene',hero).map(s=>[s.dataset.scene,s]));
scenes.forEach(s=>[...$$('.tile',s),$('.scene__cap',s)].forEach((el,i)=>el&&el.style.setProperty('--k',i)));
let current=((tabs.find(t=>t.getAttribute('aria-selected')==='true')||tabs[0]||{}).dataset||{}).path;
let swapT=0,autoOff=M.reduced,autoT=0;
const holds=new Set();
const placeInd=()=>{
const t=tabs.find(x=>x.dataset.path===current);
if(!ind||!t||!t.offsetWidth)return;
ind.style.width=t.offsetWidth+'px';
ind.style.height=t.offsetHeight+'px';
ind.style.transform=`translate(${t.offsetLeft}px, ${t.offsetTop}px)`;
list.classList.add('has-ind');
};
const show=(key,{focus=false,user=false}={})=>{
const tab=tabs.find(t=>t.dataset.path===key);
if(!tab||!scenes.has(key))return;
if(user)stopAuto();
tabs.forEach(t=>{const on=t===tab;t.setAttribute('aria-selected',on?'true':'false');t.tabIndex=on?0:-1;});
if(focus)tab.focus();
if(key===current)return;
const prev=scenes.get(current),next=scenes.get(key);
clearTimeout(swapT);
scenes.forEach(s=>s.classList.remove('is-enter','is-leave'));
if(prev){prev.classList.remove('is-active');prev.setAttribute('aria-hidden','true');}
next.classList.add('is-active');next.removeAttribute('aria-hidden');
if(!M.reduced){
if(prev)prev.classList.add('is-leave');
next.classList.add('is-enter');
swapT=setTimeout(()=>scenes.forEach(s=>s.classList.remove('is-enter','is-leave')),1250);
}
current=key;
hero.dataset.brand=key;
placeInd();
if(user)DKY.track('select_brand',{brand:key,label:'hero'});
};
tabs.forEach((t,i)=>{
t.addEventListener('click',()=>show(t.dataset.path,{user:true}));
t.addEventListener('keydown',e=>{
const n=tabs.length;
const k=e.key;
const j=(k==='ArrowRight'||k==='ArrowDown')?(i+1)%n
:(k==='ArrowLeft'||k==='ArrowUp')?(i-1+n)%n
:k==='Home'?0:k==='End'?n-1:-1;
if(j<0)return;
e.preventDefault();
show(tabs[j].dataset.path,{focus:true,user:true});
});
});
if(current)hero.dataset.brand=current;
placeInd();
if('ResizeObserver'in window&&list)new ResizeObserver(placeInd).observe(list);
else window.addEventListener('resize',placeInd,{passive:true});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(placeInd);
function schedule(){
clearTimeout(autoT);
if(autoOff||holds.size||document.hidden||tabs.length<2)return;
autoT=setTimeout(()=>{
const i=tabs.findIndex(t=>t.dataset.path===current);
show(tabs[(i+1)%tabs.length].dataset.path);
schedule();
},AUTO_MS);
}
function stopAuto(){autoOff=true;clearTimeout(autoT);}
const hold=(k,on)=>{if(on)holds.add(k);else holds.delete(k);schedule();};
hero.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')hold('hover',true);});
hero.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')hold('hover',false);});
hero.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')stopAuto();});
hero.addEventListener('focusin',()=>hold('focus',true));
hero.addEventListener('focusout',e=>hold('focus',!!(e.relatedTarget&&hero.contains(e.relatedTarget))));
document.addEventListener('visibilitychange',schedule);
M.inView(hero,(el,en)=>hold('view',!!en&&!en.isIntersecting),{once:false,rootMargin:'0px',threshold:0.35});
schedule();
const form=$('[data-hero-search]',hero);
const q=$('#hq'),sel=$('#hm');
const hasOpt=v=>!!sel&&[...sel.options].some(o=>o.value===v);
const syncSel=()=>{const g=DKY.garage.get();if(sel&&g&&hasOpt(g)&&sel.value!==g)sel.value=g;};
syncSel();
document.addEventListener('dky:garage',syncSel);
if(sel)sel.addEventListener('change',()=>{
if(!sel.value)return;
DKY.garage.set(sel.value);
show(BRAND_OF(sel.value),{user:true});
});
if(form&&q)form.addEventListener('submit',e=>{
e.preventDefault();
const qv=q.value.trim().slice(0,120),mv=sel?sel.value:'';
if(!qv&&!mv){q.setAttribute('aria-invalid','true');q.focus();return;}
q.removeAttribute('aria-invalid');
if(mv&&DKY.garage.get()!==mv)DKY.garage.set(mv);
const p=new URLSearchParams();
if(qv)p.set('q',qv);
if(mv)p.set('model',mv);
DKY.track('search',{search_term:qv,model:mv||'all',label:'hero'});
location.href='/dky/urunler.html?'+p.toString();
});
if(q)q.addEventListener('input',()=>q.removeAttribute('aria-invalid'));
const find=$('[data-hero-find]',hero);
if(find&&q)find.addEventListener('click',e=>{
if(e.metaKey||e.ctrlKey||e.shiftKey)return;
e.preventDefault();
if(q.value.trim()&&form){form.requestSubmit?form.requestSubmit():form.submit();return;}
q.focus({preventScroll:true});
q.scrollIntoView({block:'center',behavior:M.reduced?'auto':'smooth'});
});
if(!M.small)$$('.tile--wide.tile--photo img',hero).forEach(img=>{
img.style.setProperty('--py','var(--parallax-y, 0px)');
M.parallax(img,28,{apply:false});
});
const bar=$('.scroll-progress');
if(bar&&!M.reduced){
let raf=0;
const upd=()=>{
raf=0;
const max=document.documentElement.scrollHeight-window.innerHeight;
bar.style.setProperty('--p',max>0?Math.min(1,Math.max(0,window.scrollY/max)).toFixed(4):'0');
};
const qd=()=>{if(!raf)raf=requestAnimationFrame(upd);};
window.addEventListener('scroll',qd,{passive:true});
window.addEventListener('resize',qd,{passive:true});
upd();
}
});
})();
