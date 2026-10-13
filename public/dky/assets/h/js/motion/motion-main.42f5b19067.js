(function(){
'use strict';
var d=document,w=window,html=d.documentElement;
var MO=w.DKYMO;
if(!MO||MO.main)return;
MO.main=true;
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
var FX_CSS='/dky/assets/h/css/motion-fx.5635eeca4d.css';
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
MO.module=function(src){return loadScript(src);};
var idle=function(fn,t){return w.requestIdleCallback?w.requestIdleCallback(fn,{timeout:t||1500}):setTimeout(fn,1);};
var raf=w.requestAnimationFrame||function(f){return setTimeout(f,16);};
var nextTask=function(){return new Promise(function(r){if(w.scheduler&&w.scheduler.yield)w.scheduler.yield().then(r);else setTimeout(r,0);});};
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
var SPOT_SEL=['.p-card','.ctile','.cbox','.mbox','.mega-cat','.search-hit','[data-mo-spot]'];
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
if(!n||revealed.has(n)||!n.getClientRects().length||MO.inViewNow(n)||n.getBoundingClientRect().top<0)continue;
revealed.add(n);list.push(n);
}
if(!list.length)return;
var y=opts.y!=null?opts.y:(MO.small?14:22);
var x=opts.x||0;
gsap.set(list,{opacity:0,y:y,x:x,transition:'none'});
w.ScrollTrigger.batch(list,{
start:opts.start||'top 90%',
once:true,
onEnter:function(batch){
gsap.to(batch,{
opacity:1,y:0,x:0,duration:opts.duration||.75,ease:opts.ease||'power3.out',
stagger:opts.stagger!=null?opts.stagger:(MO.small?.045:.075),
overwrite:true,clearProps:'opacity,transform,transition'
});
}
});
};
var HEAD_SEL='main .sec-title, .page-hero h1, .footer__cta h2, [data-mo-split]';
MO.split=function(el,now){
var gsap=w.gsap;
if(!gsap||!w.SplitText||!el||revealed.has(el))return;
if(el.closest('[data-mo-skip], .mega, .drawer, .search-overlay, .quote')||el.querySelector('.mask-line'))return;
revealed.add(el);
w.SplitText.create(el,{
type:'lines',mask:'lines',linesClass:'mo-line',aria:'auto',autoSplit:true,
onSplit:function(self){
var masks=self.masks||[];
for(var k=0;k<masks.length;k++)masks[k].classList.add('mo-split-mask');
return gsap.from(self.lines,now
?{yPercent:108,duration:.9,ease:'expo.out',stagger:.08,delay:.05}
:{yPercent:108,duration:.95,ease:'expo.out',stagger:.09,scrollTrigger:{trigger:el,start:'top 90%',once:true}});
}
});
};
MO.enter=function(root,opts){
var gsap=w.gsap;if(!gsap||!root)return;
opts=opts||{};
var heads=root.querySelectorAll('[data-mo-split]');
for(var i=0;i<heads.length;i++)MO.split(heads[i],MO.inViewNow(heads[i]));
var groups=root.matches&&root.matches('[data-mo-stagger]')?[root]:root.querySelectorAll('[data-mo-stagger]');
for(var g=0;g<groups.length;g++){
var vis=[],rest=[],kids=groups[g].children;
for(var k=0;k<kids.length;k++){if(revealed.has(kids[k])||!kids[k].getClientRects().length)continue;(MO.inViewNow(kids[k])?vis:rest).push(kids[k]);}
vis.forEach(function(n){revealed.add(n);});
if(vis.length)gsap.fromTo(vis,{opacity:0,y:opts.y||14,transition:'none'},{
opacity:1,y:0,duration:.6,ease:'power3.out',delay:opts.delay||0,
stagger:{amount:Math.min(.4,vis.length*.05)},clearProps:'opacity,transform,transition'
});
if(rest.length)MO.reveal(rest);
}
};
function initSplitHeads(){
var heads=Array.prototype.slice.call(d.querySelectorAll(HEAD_SEL)),i=0;
return new Promise(function(done){
(function step(){
var end=Math.min(heads.length,i+3);
for(;i<end;i++)splitOne(heads[i]);
if(i<heads.length)nextTask().then(step);else done();
})();
});
}
function splitOne(el){
(function(el){
if(el.closest('[data-mo-skip], .mega, .drawer, .search-overlay, .quote')||el.querySelector('.mask-line'))return;
if(MO.inViewNow(el)||el.getBoundingClientRect().top<0)return;
var host=el.closest('.reveal, .mask-reveal, .reveal--mask');
if(host&&!host.classList.contains('is-in')){host.classList.add('mo-gs');}
if(/(^|\s)(mask-reveal|reveal--mask|reveal|mask)(\s|$)/.test(el.className))el.classList.add('mo-gs');
MO.split(el,false);
if(host&&host!==el&&host.classList.contains('mo-gs')){
var sibs=[];
for(var c=host.firstElementChild;c;c=c.nextElementSibling)if(c!==el&&!c.contains(el))sibs.push(c);
if(sibs.length)MO.reveal(sibs,{y:12,stagger:.08});
}
})(el);
}
var GROUP_SEL='.levels__list, .steps, .faq, .footer__grid, .k-grid, [data-mo-stagger]';
var SKIP_REVEAL='[data-mo-skip], [data-mo-own], [data-mo-rail], .p-grid, .rail';
function initReveals(){
var r=d.querySelectorAll('.reveal:not(.is-in):not(.mo-gs)');
var single=[];
for(var i=0;i<r.length;i++){
var el=r[i];
if(el.closest(SKIP_REVEAL)||MO.inViewNow(el))continue;
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
{sel:'.mega',items:'.mega__head, .mega-cat, .mcat, .mbrand, .mega--pop li, .mega__foot, [data-mo-item]',grid:true},
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
var ADD_SEL='[data-add-quote], .pd-quote__add, [data-bar-quote], [data-mo-fly]';
function quoteTarget(){
var c=d.querySelectorAll('[data-open-quote]');
for(var i=0;i<c.length;i++){var r=c[i].getBoundingClientRect();if(r.width&&r.height&&r.bottom>0&&r.top<w.innerHeight)return c[i];}
return null;
}
function flyImageFor(btn){
var host=btn.closest('.p-card, .search-hit, [data-mo-card]');
if(host)return host.querySelector('img');
return d.querySelector('[data-mo-vt-main] img, .pd-img');
}
function initFly(gsap){
d.addEventListener('click',function(e){
var btn=e.target.closest&&e.target.closest(ADD_SEL);
if(!btn||btn.disabled)return;
var img=flyImageFor(btn),to=quoteTarget();
if(!img||!to)return;
var fromImg=MO.inViewNow(img);
var a=(fromImg?img:btn).getBoundingClientRect(),b=to.getBoundingClientRect();
var size=fromImg?Math.min(a.width,a.height,MO.small?120:160):56;
var ghost=img.cloneNode(false);
ghost.removeAttribute('srcset');ghost.removeAttribute('sizes');ghost.removeAttribute('loading');ghost.removeAttribute('id');
ghost.className='mo-fly';ghost.alt='';ghost.setAttribute('aria-hidden','true');
ghost.style.width=ghost.style.height=size+'px';
d.body.appendChild(ghost);
var x0=a.left+a.width/2-size/2,y0=a.top+a.height/2-size/2;
var x1=b.left+b.width/2-size/2,y1=b.top+b.height/2-size/2;
var tl=gsap.timeline({onComplete:function(){ghost.remove();}});
tl.set(ghost,{x:x0,y:y0,scale:.6,opacity:0})
.to(ghost,{scale:1,opacity:1,duration:.18,ease:'power2.out'})
.to(ghost,{x:x1,duration:.62,ease:'power2.inOut'},'>-0.02')
.to(ghost,{y:y1,duration:.62,ease:'back.in(1.4)'},'<')
.to(ghost,{scale:.14,opacity:.2,duration:.62,ease:'power2.in'},'<');
},true);
}
function initTilt(gsap){
if(!MO.fine)return;
var cur=null,st=null;
var apply=function(){
if(!st)return;
var a=Math.sqrt(st.rx*st.rx+st.ry*st.ry);
st.el.style.rotate=a>.01?(st.rx/a).toFixed(3)+' '+(st.ry/a).toFixed(3)+' 0 '+a.toFixed(2)+'deg':'';
if(st.img)st.img.style.translate=st.dx.toFixed(2)+'px '+st.dy.toFixed(2)+'px';
};
var state=new WeakMap();
var get=function(el){
var s0=state.get(el);
if(!s0){s0={el:el,img:el.querySelector('[data-mo-depth]'),rx:0,ry:0,dx:0,dy:0};state.set(el,s0);}
return s0;
};
var go=function(s0,rx,ry,dx,dy,dur,ease){
gsap.to(s0,{rx:rx,ry:ry,dx:dx,dy:dy,duration:dur,ease:ease,overwrite:true,
onUpdate:function(){st=s0;apply();},
onComplete:function(){if(!rx&&!ry){s0.el.style.rotate='';if(s0.img)s0.img.style.translate='';}}});
};
d.addEventListener('pointermove',function(e){
if(e.pointerType&&e.pointerType!=='mouse')return;
var el=e.target.closest?e.target.closest('[data-mo-tilt]'):null;
if(el!==cur){if(cur)go(get(cur),0,0,0,0,.7,'elastic.out(1, .55)');cur=el;}
if(!el)return;
var r=el.getBoundingClientRect();
var nx=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1));
var ny=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1));
go(get(el),-ny*4,nx*5,-nx*10,-ny*7,.45,'power3.out');
},{passive:true});
d.addEventListener('pointerleave',function(){if(cur){go(get(cur),0,0,0,0,.7,'elastic.out(1, .55)');cur=null;}});
}
var CHIP_SEL='[data-mo-chips], [data-gen-chips], [data-sub-chips]';
function initChips(gsap){
var seen=new WeakSet();
var bind=function(box){
if(seen.has(box))return;seen.add(box);
var key=function(){var a=box.querySelector('[aria-pressed="true"], [aria-current="true"], [aria-checked="true"]');return a?(a.getAttribute('href')||a.getAttribute('data-value')||a.textContent):'';};
var last=key();
new MutationObserver(function(){
var k=key();if(k===last)return;last=k;
var a=box.querySelector('[aria-pressed="true"], [aria-current="true"], [aria-checked="true"]');
if(a)gsap.fromTo(a,{scale:.9,transition:'none'},{scale:1,duration:.5,ease:'back.out(3)',overwrite:true,clearProps:'transform,transition'});
}).observe(box,{childList:true,subtree:true,attributes:true,attributeFilter:['aria-pressed','aria-current','aria-checked']});
};
Array.prototype.forEach.call(d.querySelectorAll(CHIP_SEL),bind);
}
function initRails(gsap){
Array.prototype.forEach.call(d.querySelectorAll('[data-mo-rail]'),function(rail){
if(MO.inViewNow(rail)||rail.getBoundingClientRect().top<0)return;
var run=function(){
var cards=Array.prototype.slice.call(rail.children,0,6);
if(!cards.length)return;
gsap.set(cards,{opacity:0,x:48,transition:'none'});
w.ScrollTrigger.create({trigger:rail,start:'top 85%',once:true,onEnter:function(){
gsap.to(cards,{opacity:1,x:0,duration:.8,ease:'expo.out',stagger:.07,clearProps:'opacity,transform,transition'});
}});
};
if(rail.children.length)run();else new MutationObserver(function(_,ob){if(rail.children.length){ob.disconnect();run();}}).observe(rail,{childList:true});
});
}
function initCountsDepth(gsap){
var ST=w.ScrollTrigger;
var $$=function(s,r){return Array.prototype.slice.call((r||d).querySelectorAll(s));};
var below=function(el){return el.getBoundingClientRect().top>(w.innerHeight||html.clientHeight);};
$$('[data-mo-count]').forEach(function(el){
var txt=el.textContent,target=parseInt(String(el.getAttribute('data-mo-count')||txt).replace(/\D/g,''),10);
if(!target||!below(el))return;
var suffix=/\+\s*$/.test(txt)?'+':'',o={v:0};
el.textContent='0'+suffix;
ST.create({trigger:el,start:'top 92%',once:true,onEnter:function(){
gsap.to(o,{v:target,duration:1.1,ease:'power3.out',
onUpdate:function(){el.textContent=Math.round(o.v).toLocaleString('tr-TR')+suffix;},
onComplete:function(){el.textContent=txt;}});
}});
});
gsap.matchMedia().add('(min-width: 1101px)',function(){
var els=$$('[data-mo-parallax], .k-photo img, .lp-visual__frame');
els.forEach(function(el){
var amt=parseFloat(el.getAttribute('data-mo-parallax'))||28;
el.classList.add('mo-depth');
gsap.fromTo(el,{'--mo-py':(amt/2)+'px'},{'--mo-py':(-amt/2)+'px',ease:'none',
scrollTrigger:{trigger:el.parentElement||el,start:'top bottom',end:'bottom top',scrub:.6}});
});
return function(){els.forEach(function(el){el.classList.remove('mo-depth');el.style.removeProperty('--mo-py');});};
});
}
function watchLayout(){
if(!w.ResizeObserver||!w.ScrollTrigger)return;
var lastH=d.documentElement.scrollHeight,t=0;
new ResizeObserver(function(){
var h=d.documentElement.scrollHeight;
if(Math.abs(h-lastH)<2)return;
lastH=h;clearTimeout(t);
t=setTimeout(function(){w.ScrollTrigger.refresh();},150);
}).observe(d.body);
}
var MODULES=[
{test:'[data-mo-hero], [data-mo-steps]',file:'/dky/assets/h/js/motion/motion-home.5e363b5a63.js'},
{test:'[data-cat-grid], [data-mo-catalog], [data-mo-flip], .cat-head',file:'/dky/assets/h/js/motion/motion-catalog.40be72d14e.js',plugins:['Flip']},
{test:'[data-pd-root], [data-mo-product]',file:'/dky/assets/h/js/motion/motion-product.9133f5cbdd.js'},
{test:'[data-mo-page], .page-hero, .lp, .k-photo',file:'/dky/assets/h/js/motion/motion-pages.8eeeed99aa.js'}
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
function injectFxCss(){
if(d.querySelector('link[data-mo-fx]'))return;
var l=d.createElement('link');
l.rel='stylesheet';l.href=FX_CSS;l.setAttribute('data-mo-fx','');
d.head.appendChild(l);
}
function boot(){
injectFxCss();
initProgress();
if(MO.fine){initSpotlight();initMagnetic();}
if(MO.reduced)return;
var start=function(){
idle(function(){
MO.gsap=loadGsap();
MO.gsap.then(function(gsap){
html.classList.add('has-gsap');
initSplitHeads()
.then(nextTask).then(initReveals)
.then(nextTask).then(function(){initPanels(gsap);initFly(gsap);initTilt(gsap);initChips(gsap);initRails(gsap);initCountsDepth(gsap);})
.then(nextTask).then(function(){
loadModules();
watchLayout();
d.dispatchEvent(new CustomEvent('dky:gsap',{detail:{gsap:gsap}}));
})
.catch(function(e){if(w.console)console.warn('[DKY motion] başlatma:',e.message);});
},function(e){
html.classList.remove('has-gsap');
if(w.console)console.warn('[DKY motion] GSAP yüklenemedi, CSS hareketleriyle devam:',e.message);
});
},1200);
};
start();
if(RM.addEventListener)RM.addEventListener('change',function(){MO.reduced=RM.matches;});
}
boot();
})();
