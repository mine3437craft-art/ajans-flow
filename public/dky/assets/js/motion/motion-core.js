(function(){
'use strict';
var d=document,w=window,html=d.documentElement;
if(w.DKYMO)return;
var mq=function(q){return w.matchMedia?w.matchMedia(q):{matches:false};};
var RM=mq('(prefers-reduced-motion: reduce)');
var FINE=mq('(hover: hover) and (pointer: fine)');
var SMALL=mq('(max-width: 760px)');
var GSAP_V='3.13.0';
var CDN='https://cdn.jsdelivr.net/npm/gsap@'+GSAP_V+'/dist/';
var SRI={
gsap:'sha384-HOvlOYPIs/zjoIkWUGXkVmXsjr8GuZLV+Q+rcPwmJOVZVpvTSXQChiN4t9Euv9Vc',
ScrollTrigger:'sha384-P8VzCVnT9NBUkMrpcIZrJbA7EBjJvh/fJS6PmP+4nLIM284DtsImIv8D0fFjIkeh',
SplitText:'sha384-xb96EMJeax+NLXMC88ZBa1xAeAW+kn+horHh/zFlbMLG2UPWhMJJSlv7fi57hS+Q',
Flip:'sha384-lg3+EgIwmxYq9YD4ix279pdUEasqmOS17fF+2mI/NEg6JHkawYaWYpJ6nKZenPOy'
};
var SELF=(d.currentScript&&d.currentScript.src)||'/dky/assets/js/motion/motion-core.js';
var BASE=SELF.replace(/[^/]*$/,'');
var MO=w.DKYMO={
version:'3.0',
reduced:RM.matches,
fine:FINE.matches&&!RM.matches,
small:SMALL.matches,
gsap:null,
ready:function(fn){if(MO.gsap)MO.gsap.then(fn,function(){});}
};
html.classList.add('mo-on');
var loaded={};
function loadScript(src,integrity){
if(loaded[src])return loaded[src];
loaded[src]=new Promise(function(res,rej){
var s=d.createElement('script');
s.src=src;s.async=false;
if(integrity){s.integrity=integrity;s.crossOrigin='anonymous';}
s.onload=function(){res();};
s.onerror=function(){rej(new Error('yüklenemedi: '+src));};
d.head.appendChild(s);
});
return loaded[src];
}
MO.load=loadScript;
MO.plugin=function(name){return loadScript(CDN+name+'.min.js',SRI[name]);};
MO.module=function(file){return loadScript(BASE+file);};
var idle=function(fn,t){return w.requestIdleCallback?w.requestIdleCallback(fn,{timeout:t||1500}):setTimeout(fn,1);};
var raf=w.requestAnimationFrame||function(f){return setTimeout(f,16);};
MO.inViewNow=function(el){var r=el.getBoundingClientRect();return r.bottom>0&&r.top<(w.innerHeight||html.clientHeight)&&r.width+r.height>0;};
function initProgress(){
if(d.querySelector('.mo-progress'))return;
var bar=d.createElement('div');
bar.className='mo-progress';bar.setAttribute('aria-hidden','true');
d.body.appendChild(bar);
var css=w.CSS&&CSS.supports&&CSS.supports('animation-timeline: scroll()');
if(css)return;
var ticking=false;
var update=function(){
ticking=false;
var max=Math.max(1,html.scrollHeight-(w.innerHeight||html.clientHeight));
bar.style.setProperty('--mo-p',Math.min(1,Math.max(0,(w.scrollY||w.pageYOffset)/max)).toFixed(4));
};
w.addEventListener('scroll',function(){if(!ticking){ticking=true;raf(update);}},{passive:true});
w.addEventListener('resize',update,{passive:true});
update();
}
var VT_NAME='urun-media';
var lastCard=null;
function productIdFromUrl(href){
try{
var u=new URL(href,location.href);
if(u.origin!==location.origin||!/\/urun\.html$/.test(u.pathname))return null;
return u.searchParams.get('id');
}catch(e){return null;}
}
function cardImageFor(id){
var img=null;
if(lastCard&&lastCard.isConnected)img=lastCard;
if(!img){
var a=d.querySelector('a[href*="urun.html?id='+(w.CSS&&CSS.escape?CSS.escape(id):id)+'"]');
var card=a&&a.closest('.p-card, .search-hit, .quote__item, [data-mo-card]');
img=card&&card.querySelector('img');
}
if(!img||!MO.inViewNow(img))return null;
return img;
}
function clearVtNames(){
var named=d.querySelectorAll('[data-mo-vt]');
for(var i=0;i<named.length;i++){named[i].style.viewTransitionName='';named[i].style.viewTransitionClass='';named[i].removeAttribute('data-mo-vt');}
}
function initViewTransitions(){
d.addEventListener('click',function(e){
var a=e.target.closest&&e.target.closest('a[href*="urun.html?id="]');
if(!a){lastCard=null;return;}
var card=a.closest('.p-card, .search-hit, .quote__item, [data-mo-card]');
lastCard=card?card.querySelector('img'):null;
},true);
w.addEventListener('pageswap',function(e){
if(!e.viewTransition||!e.activation||!e.activation.entry)return;
var id=productIdFromUrl(e.activation.entry.url);
if(!id)return;
var img=cardImageFor(id);
if(!img)return;
var own=d.querySelectorAll('.pd-img, [data-mo-vt-main]');
for(var i=0;i<own.length;i++)own[i].style.viewTransitionName='none';
img.style.viewTransitionName=VT_NAME;
img.style.viewTransitionClass='urun-morph';
img.setAttribute('data-mo-vt','');
});
w.addEventListener('pageshow',function(e){
if(!e.persisted)return;
clearVtNames();
var own=d.querySelectorAll('.pd-img, [data-mo-vt-main]');
for(var i=0;i<own.length;i++)own[i].style.viewTransitionName='';
});
}
var SPOT_SEL=['.p-card','.ctile','.bcard','.mega-cat','.search-hit','[data-mo-spot]'];
MO.spot=function(sel){if(SPOT_SEL.indexOf(sel)<0)SPOT_SEL.push(sel);};
function initSpotlight(){
var cur=null,px=0,py=0,pending=false;
var paint=function(){
pending=false;
if(!cur)return;
var r=cur.getBoundingClientRect();
cur.style.setProperty('--mo-x',(px-r.left).toFixed(1)+'px');
cur.style.setProperty('--mo-y',(py-r.top).toFixed(1)+'px');
};
var off=function(){if(cur){cur.classList.remove('is-lit');cur=null;}};
d.addEventListener('pointermove',function(e){
if(e.pointerType&&e.pointerType!=='mouse')return;
var el=e.target.closest?e.target.closest(SPOT_SEL.join(',')):null;
if(el!==cur){
off();
if(el){el.classList.add('mo-spot','is-lit');cur=el;}
}
if(!cur)return;
px=e.clientX;py=e.clientY;
if(!pending){pending=true;raf(paint);}
},{passive:true});
d.addEventListener('pointerleave',off);
w.addEventListener('blur',off);
}
var MAG_SEL=['.btn--primary','.btn--red','.qsearch__go','[data-magnetic]'];
MO.mag=function(sel){if(MAG_SEL.indexOf(sel)<0)MAG_SEL.push(sel);};
function initMagnetic(){
var cur=null,pending=false,px=0,py=0;
var MX=7,MY=5;
var paint=function(){
pending=false;
if(!cur)return;
var r=cur.getBoundingClientRect();
var dx=(px-(r.left+r.width/2))/(r.width/2);
var dy=(py-(r.top+r.height/2))/(r.height/2);
dx=Math.max(-1,Math.min(1,dx));dy=Math.max(-1,Math.min(1,dy));
cur.style.setProperty('--mo-mx',(dx*MX).toFixed(2)+'px');
cur.style.setProperty('--mo-my',(dy*MY).toFixed(2)+'px');
};
var release=function(){
if(!cur)return;
cur.classList.remove('is-mag');
cur.style.setProperty('--mo-mx','0px');cur.style.setProperty('--mo-my','0px');
cur=null;
};
d.addEventListener('pointermove',function(e){
if(e.pointerType&&e.pointerType!=='mouse')return;
var el=e.target.closest?e.target.closest(MAG_SEL.join(',')):null;
if(el&&el.disabled)el=null;
if(el!==cur){
release();
if(el){el.classList.add('mo-mag','is-mag');cur=el;}
}
if(!cur)return;
px=e.clientX;py=e.clientY;
if(!pending){pending=true;raf(paint);}
},{passive:true});
d.addEventListener('pointerleave',release);
w.addEventListener('blur',release);
}
function loadGsap(){
return Promise.all([MO.plugin('gsap'),MO.plugin('ScrollTrigger'),MO.plugin('SplitText')]).then(function(){
var gsap=w.gsap;
if(!gsap||!w.ScrollTrigger)throw new Error('GSAP yok');
gsap.registerPlugin(w.ScrollTrigger,w.SplitText);
gsap.defaults({ease:'power3.out',duration:.7});
return d.fonts&&d.fonts.ready?d.fonts.ready.then(function(){return gsap;}):gsap;
});
}
var revealed=new WeakSet();
MO.reveal=function(nodes,opts){
var gsap=w.gsap;if(!gsap)return;
opts=opts||{};
var list=[];
for(var i=0;i<nodes.length;i++){
var n=nodes[i];
if(!n||revealed.has(n)||MO.inViewNow(n)||n.getBoundingClientRect().top<0)continue;
revealed.add(n);list.push(n);
}
if(!list.length)return;
var y=opts.y!=null?opts.y:(MO.small?14:22);
gsap.set(list,{opacity:0,y:y,transition:'none'});
w.ScrollTrigger.batch(list,{
start:opts.start||'top 90%',
once:true,
onEnter:function(batch){
gsap.to(batch,{
opacity:1,y:0,duration:opts.duration||.75,ease:opts.ease||'power3.out',
stagger:opts.stagger!=null?opts.stagger:(MO.small?.045:.075),
overwrite:true,clearProps:'opacity,transform,transition'
});
}
});
};
var HEAD_SEL='main .sec-title, .page-hero h1, .footer__cta h2, [data-mo-split]';
function initSplitHeads(gsap){
var heads=d.querySelectorAll(HEAD_SEL);
for(var i=0;i<heads.length;i++)(function(el){
if(el.closest('[data-mo-skip], .mega, .drawer, .search-overlay, .quote')||el.querySelector('.mask-line'))return;
if(MO.inViewNow(el)||el.getBoundingClientRect().top<0)return;
var host=el.closest('.reveal, .mask-reveal, .reveal--mask');
if(host&&!host.classList.contains('is-in')){host.classList.add('mo-gs');}
if(/(^|\s)(mask-reveal|reveal--mask|reveal|mask)(\s|$)/.test(el.className))el.classList.add('mo-gs');
revealed.add(el);
w.SplitText.create(el,{
type:'lines',mask:'lines',linesClass:'mo-line',aria:'auto',autoSplit:true,
onSplit:function(self){
var masks=self.masks||[];
for(var k=0;k<masks.length;k++)masks[k].classList.add('mo-split-mask');
return gsap.from(self.lines,{
yPercent:108,duration:.95,ease:'expo.out',stagger:.09,
scrollTrigger:{trigger:el,start:'top 90%',once:true}
});
}
});
if(host&&host!==el&&host.classList.contains('mo-gs')){
var sibs=[];
for(var c=host.firstElementChild;c;c=c.nextElementSibling)if(c!==el&&!c.contains(el))sibs.push(c);
if(sibs.length)MO.reveal(sibs,{y:12,stagger:.08});
}
})(heads[i]);
}
var GROUP_SEL='.p-grid, .ctiles, .bgrid, .trust__list, .levels__list, .steps, .faq, .footer__grid, [data-mo-stagger]';
function initReveals(){
var r=d.querySelectorAll('.reveal:not(.is-in):not(.mo-gs)');
var single=[];
for(var i=0;i<r.length;i++){
var el=r[i];
if(el.closest('[data-mo-skip]')||MO.inViewNow(el))continue;
el.classList.add('mo-gs');single.push(el);
}
MO.reveal(single);
var st=d.querySelectorAll('.stagger:not(.is-in):not(.mo-gs)');
for(var j=0;j<st.length;j++){
if(st[j].closest('[data-mo-skip]')||MO.inViewNow(st[j]))continue;
st[j].classList.add('mo-gs');
MO.reveal(st[j].children,{stagger:MO.small?.045:.07});
}
var g=d.querySelectorAll(GROUP_SEL);
for(var k=0;k<g.length;k++){
var grp=g[k];
if(grp.closest('[data-mo-skip], .mo-gs, .reveal, .stagger, .mega, .drawer, .search-overlay, .quote')||grp.classList.contains('stagger')||grp.hasAttribute('data-mo-own'))continue;
MO.reveal(grp.children);
}
}
function initPanels(gsap){
var PANELS=[
{sel:'.mega',items:'.mega__head, .mega-cat, .mbrand, .mega--pop li, .mega__foot, [data-mo-item]',grid:true},
{sel:'.drawer',items:'.drawer__body > *',x:28},
{sel:'.search-overlay',items:'.search-overlay > .wrap > *',y:16}
];
PANELS.forEach(function(p){
var els=d.querySelectorAll(p.sel);
for(var i=0;i<els.length;i++)(function(panel){
panel.classList.add('mo-panel');
var open=panel.classList.contains('is-open');
new MutationObserver(function(){
var now=panel.classList.contains('is-open');
if(now&&!open){
var items=panel.querySelectorAll(p.items);
if(items.length){
gsap.killTweensOf(items);
gsap.fromTo(items,{opacity:0,x:p.x||0,y:p.x?0:(p.y||14)},{
opacity:1,x:0,y:0,duration:.55,ease:'power3.out',delay:.04,
stagger:p.grid?{amount:Math.min(.36,items.length*.03),grid:'auto',from:'start'}:.05,
clearProps:'opacity,transform'
});
}
}
open=now;
}).observe(panel,{attributes:true,attributeFilter:['class']});
})(els[i]);
});
}
var MODULES=[
{test:'.hero__stage, .home',file:'motion-home.js'},
{test:'[data-mo-catalog], #results, .cat-head',file:'motion-catalog.js',plugins:['Flip']},
{test:'.pd-img, [data-mo-product]',file:'motion-product.js'},
{test:'[data-mo-page], .page-hero, .lp, .k-photo',file:'motion-pages.js'}
];
function loadModules(){
MODULES.forEach(function(m){
if(!d.querySelector(m.test))return;
var pre=(m.plugins||[]).map(MO.plugin);
Promise.all(pre).then(function(){
if(m.plugins&&w.Flip)w.gsap.registerPlugin(w.Flip);
return MO.module(m.file);
}).catch(function(e){if(w.console)console.warn('[DKY motion]',e.message);});
});
}
function boot(){
initProgress();
initViewTransitions();
if(MO.fine){initSpotlight();initMagnetic();}
if(MO.reduced)return;
var start=function(){
idle(function(){
MO.gsap=loadGsap();
MO.gsap.then(function(gsap){
html.classList.add('has-gsap');
initSplitHeads(gsap);
initReveals();
initPanels(gsap);
loadModules();
w.ScrollTrigger.refresh();
d.dispatchEvent(new CustomEvent('dky:gsap',{detail:{gsap:gsap}}));
}).catch(function(e){
html.classList.remove('has-gsap');
if(w.console)console.warn('[DKY motion] GSAP yüklenemedi, CSS hareketleriyle devam:',e.message);
});
},1200);
};
if(d.readyState==='complete')start();else w.addEventListener('load',start,{once:true});
if(RM.addEventListener)RM.addEventListener('change',function(){MO.reduced=RM.matches;});
}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
