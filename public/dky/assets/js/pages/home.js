(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const F=window.DKY_FEATURED||null;
const nf=n=>Number(n).toLocaleString('tr-TR');
function ready(fn){
if(window.DKY&&window.DKY.card&&window.DKY.motion)fn();
else document.addEventListener('dky:ready',fn,{once:true});
}
function tablist(tabs,onSelect){
const select=(tab,focus)=>{
tabs.forEach(t=>{const on=t===tab;t.setAttribute('aria-selected',on?'true':'false');t.tabIndex=on?0:-1;});
if(focus)tab.focus();
onSelect(tab);
};
tabs.forEach((t,i)=>{
t.addEventListener('click',()=>select(t));
t.addEventListener('keydown',e=>{
const n=tabs.length,k=e.key;
const j=k==='ArrowRight'?(i+1)%n:k==='ArrowLeft'?(i-1+n)%n:k==='Home'?0:k==='End'?n-1:-1;
if(j<0)return;
e.preventDefault();
select(tabs[j],true);
});
});
}
ready(()=>{
const DKY=window.DKY,M=DKY.motion;
const root=document.documentElement;
const countUp=(el,to)=>{
el.textContent=nf(to);
if(M.reduced)return;
const r=el.getBoundingClientRect();
if(r.top<window.innerHeight&&r.bottom>0)return;
el.textContent='0';
M.inView(el,()=>{
const t0=performance.now(),d=1000;
const step=now=>{
const k=Math.min(1,(now-t0)/d);
el.textContent=nf(Math.round(to*(1-Math.pow(1-k,3))));
if(k<1)requestAnimationFrame(step);
};
requestAnimationFrame(step);
},{rootMargin:'0px 0px -15% 0px'});
};
if(F){
$$('[data-stat]').forEach(el=>{const v=F.stats&&F.stats[el.dataset.stat];if(v!=null&&!el.closest('.hero'))countUp(el,v);});
$$('[data-count]').forEach(el=>{const n=F.modelCounts&&F.modelCounts[el.dataset.count];if(n)el.textContent=nf(n);});
$$('[data-gcount]').forEach(el=>{const n=F.groupCounts&&F.groupCounts[el.dataset.gcount];if(n)countUp(el,n);});
$$('[data-gimg]').forEach(img=>{
const name=F.groupImages&&F.groupImages[img.dataset.gimg];
const src=name&&DKY.img?DKY.img(name,400):'';
if(src&&img.getAttribute('src')!==src)img.src=src;
});
}
root.classList.add('hm-anim');
const masks=$$('.mask');
if(M.reduced)masks.forEach(el=>el.classList.add('is-in'));
else M.inView(masks,el=>el.classList.add('is-in'));
const rail=$('[data-rail-track]');
const tabsBox=$('.showcase .tabs');
const stabs=tabsBox?$$('.tabs__btn',tabsBox):[];
const sind=tabsBox&&$('.tabs__ind',tabsBox);
const more=$('[data-showcase-more]');
const prev=$('[data-rail="-1"]'),next=$('[data-rail="1"]');
const pbar=$('.rail-progress__bar'),ptrack=pbar&&pbar.parentElement;
const MORE={populer:'/dky/urunler.html?stok=1',bakim:'/dky/urunler.html?grup=fren&stok=1',offroad:'/dky/urunler.html?grup=offroad&stok=1',firsat:'/dky/urunler.html?firsat=1&stok=1'};
let set=((stabs.find(t=>t.getAttribute('aria-selected')==='true')||stabs[0]||{}).dataset||{}).set||'populer';
let swapT=0,prRaf=0;
const placeTab=()=>{
const t=stabs.find(b=>b.dataset.set===set);
if(!sind||!t||!t.offsetWidth)return;
sind.style.transform=`translateX(${t.offsetLeft}px) scaleX(${(t.offsetWidth/100).toFixed(4)})`;
tabsBox.classList.add('has-ind');
};
const progress=()=>{
prRaf=0;
if(!rail)return;
const max=rail.scrollWidth-rail.clientWidth;
if(prev)prev.disabled=rail.scrollLeft<=2;
if(next)next.disabled=rail.scrollLeft>=max-2;
if(!pbar||!ptrack)return;
const tw=ptrack.clientWidth;
const bw=Math.max(24,Math.round(tw*Math.min(1,rail.clientWidth/(rail.scrollWidth||1))));
if(pbar.style.width!==bw+'px')pbar.style.width=bw+'px';
const p=max>0?Math.min(1,Math.max(0,rail.scrollLeft/max)):0;
pbar.style.setProperty('--x',((tw-bw)*p).toFixed(1)+'px');
ptrack.style.setProperty('--progress',p.toFixed(3));
};
const queueProgress=()=>{if(!prRaf)prRaf=requestAnimationFrame(progress);};
const paint=(key,{keep=false,anim=false}={})=>{
if(!rail||!F||!F.sets)return;
const items=F.sets[key]||[];
const x=rail.scrollLeft;
rail.classList.remove('is-swap');
rail.innerHTML=items.map(p=>DKY.card(p)).join('');
[...rail.children].forEach((c,i)=>c.style.setProperty('--k',Math.min(i,8)));
if(anim&&!M.reduced){
void rail.offsetWidth;
rail.classList.add('is-swap');
clearTimeout(swapT);
swapT=setTimeout(()=>rail.classList.remove('is-swap'),1100);
}
rail.scrollTo({left:keep?x:0,behavior:'instant'});
if(DKY.register)DKY.register(items);
if(more)more.href=MORE[key]||'/dky/urunler.html';
queueProgress();
};
tablist(stabs,b=>{
set=b.dataset.set;
if(rail)rail.setAttribute('aria-labelledby',b.id);
placeTab();
paint(set,{anim:true});
DKY.track('select_content',{content_type:'showcase_tab',item_id:set});
});
paint(set);
placeTab();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(placeTab);
if(rail)rail.addEventListener('scroll',queueProgress,{passive:true});
window.addEventListener('resize',()=>{placeTab();queueProgress();},{passive:true});
$$('[data-rail]').forEach(b=>b.addEventListener('click',()=>{
if(rail)rail.scrollBy({left:Number(b.dataset.rail)*rail.clientWidth*0.9,behavior:M.reduced?'auto':'smooth'});
}));
const grid=$('[data-map]');
const card=$('#map-card');
const link=grid&&$('.map__link',grid);
const lpath=link&&$('path',link),ldot=link&&$('circle',link);
let MAPD={};
try{MAPD=JSON.parse(($('#map-data')||{}).textContent||'{}');}catch(e){MAPD={};}
const firstPressed=grid&&$('.hs[aria-pressed="true"]',grid);
let group=(firstPressed&&firstPressed.dataset.hs)||'fren';
const mapHref=key=>{const g=DKY.garage.get();return'/dky/urunler.html?grup='+encodeURIComponent(key)+(g?'&model='+encodeURIComponent(g):'');};
const f1=v=>v.toFixed(1);
const draw=animate=>{
if(!grid||!lpath||!card)return;
const hs=$(`.hs[data-hs="${group}"]`,grid);
if(!hs||!hs.offsetParent){link.style.visibility='hidden';return;}
link.style.visibility='';
const g=grid.getBoundingClientRect(),h=hs.getBoundingClientRect(),c=card.getBoundingClientRect();
const x1=h.left+h.width/2-g.left,y1=h.top+h.height/2-g.top;
let x2,y2,d;
if(c.left>=h.right-4){
x2=c.left-g.left;
y2=Math.min(Math.max(y1,c.top-g.top+28),c.bottom-g.top-28);
const mx=x1+(x2-x1)*0.5;
d=`M${f1(x1)} ${f1(y1)}C${f1(mx)} ${f1(y1)} ${f1(mx)} ${f1(y2)} ${f1(x2)} ${f1(y2)}`;
}else{
x2=Math.min(Math.max(x1,c.left-g.left+28),c.right-g.left-28);
y2=c.top-g.top;
const my=y1+(y2-y1)*0.5;
d=`M${f1(x1)} ${f1(y1)}C${f1(x1)} ${f1(my)} ${f1(x2)} ${f1(my)} ${f1(x2)} ${f1(y2)}`;
}
lpath.setAttribute('d',d);
if(ldot){ldot.setAttribute('cx',f1(x2));ldot.setAttribute('cy',f1(y2));}
const len=Math.ceil(lpath.getTotalLength?lpath.getTotalLength():600);
lpath.style.setProperty('--len',len);
if(animate&&!M.reduced){
link.classList.remove('is-draw');
lpath.style.setProperty('--off',len);
void lpath.getBoundingClientRect();
link.classList.add('is-draw');
}
lpath.style.setProperty('--off',0);
};
const selectGroup=(key,user)=>{
if(!grid||!MAPD[key])return;
const same=key===group;
group=key;
$$('[data-hs]',grid).forEach(b=>b.setAttribute('aria-pressed',b.dataset.hs===key?'true':'false'));
if(same&&user)return;
const t=$('[data-map-title]',grid),n=$('[data-map-count]',grid),x=$('[data-map-text]',grid),a=$('[data-map-link]',grid);
if(t)t.textContent=MAPD[key].label;
if(n)n.textContent=nf((F&&F.groupCounts&&F.groupCounts[key])||0);
if(x)x.textContent=MAPD[key].text;
if(a)a.href=mapHref(key);
if(card&&!same&&!M.reduced){card.classList.remove('is-swap');void card.offsetWidth;card.classList.add('is-swap');}
draw(!same);
};
if(grid){
$$('[data-hs]',grid).forEach(b=>{
b.addEventListener('click',()=>{selectGroup(b.dataset.hs,true);DKY.track('select_content',{content_type:'part_map',item_id:b.dataset.hs});});
b.addEventListener('focus',()=>selectGroup(b.dataset.hs,true));
b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')selectGroup(b.dataset.hs,true);});
});
selectGroup(group,false);
M.inView(grid,()=>draw(true),{rootMargin:'0px 0px -20% 0px'});
if('ResizeObserver'in window)new ResizeObserver(()=>draw(false)).observe(grid);
else window.addEventListener('resize',()=>draw(false),{passive:true});
}
const paintGarage=()=>{
const g=DKY.garage.get();
const label=g?DKY.garage.label(g):'';
$$('[data-garage-label]').forEach(el=>{el.textContent=label?'Aracım: '+label:'Tüm modeller';});
$$('[data-model]').forEach(a=>a.classList.toggle('is-garage',!!g&&a.dataset.model===g));
const a=grid&&$('[data-map-link]',grid);
if(a)a.href=mapHref(group);
};
paintGarage();
$$('[data-model]').forEach(a=>a.addEventListener('click',()=>DKY.garage.set(a.dataset.model)));
document.addEventListener('dky:garage',()=>{paintGarage();paint(set,{keep:true});});
window.addEventListener('pageshow',e=>{if(e.persisted){paintGarage();paint(set,{keep:true});}});
$$('[data-parallax]').forEach(img=>{
img.style.setProperty('--py','var(--parallax-y, 0px)');
M.parallax(img,32,{apply:false});
});
if(DKY.observe)DKY.observe();
});
})();
