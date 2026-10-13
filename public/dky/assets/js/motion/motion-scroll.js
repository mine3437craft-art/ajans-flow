(function(){
'use strict';
var w=window,d=document,html=d.documentElement,MO=w.DKYMO,gsap=w.gsap,ST=w.ScrollTrigger;
if(!MO||!gsap||!ST||html.hasAttribute('data-mo-scroll'))return;
html.setAttribute('data-mo-scroll','');
var $=function(s,r){return(r||d).querySelector(s);};
var $$=function(s,r){return Array.prototype.slice.call((r||d).querySelectorAll(s));};
var vh=function(){return w.innerHeight||html.clientHeight;};
var below=function(el){return el.getBoundingClientRect().top>vh();};
var shown=function(el){return el.getClientRects().length>0;};
var mm=gsap.matchMedia();
var DESK='(min-width: 1101px) and (pointer: fine)';
var MOBI='(max-width: 1100px), (pointer: coarse)';
var SVGNS='http://www.w3.org/2000/svg';
var steps=[];
steps.push(function(){
mm.add('(min-width: 1360px)',function(){
if(html.scrollHeight<vh()*1.8)return;
var wrap=d.createElement('div');
wrap.className='mo-road';wrap.setAttribute('aria-hidden','true');
var svg=d.createElementNS(SVGNS,'svg');
svg.setAttribute('viewBox','0 0 40 1000');svg.setAttribute('preserveAspectRatio','none');
var D='M20 0 C 34 120, 6 240, 20 360 S 34 600, 20 720 S 6 900, 20 1000';
[['mo-road__lane mo-road__lane--a',-7],['mo-road__lane mo-road__lane--b',0],['mo-road__lane mo-road__lane--c',7]].forEach(function(l){
var p=d.createElementNS(SVGNS,'path');
p.setAttribute('d',D);p.setAttribute('class',l[0]);p.setAttribute('transform','translate('+l[1]+' 0)');
p.setAttribute('pathLength','100');
svg.appendChild(p);
});
wrap.appendChild(svg);
var tip=d.createElement('span');tip.className='mo-road__tip';wrap.appendChild(tip);
d.body.appendChild(wrap);
html.classList.add('mo-road-on');
var lanes=$$('.mo-road__lane',svg);
gsap.set(lanes,{strokeDasharray:100,strokeDashoffset:100});
var mid=lanes[1],len=mid.getTotalLength?mid.getTotalLength():0;
var placeTip=function(p){
if(!len)return;
var pt=mid.getPointAtLength(p*len),bw=wrap.clientWidth,bh=wrap.clientHeight;
gsap.set(tip,{x:pt.x/40*bw,y:pt.y/1000*bh});
};
var tl=gsap.timeline({scrollTrigger:{trigger:d.body,start:'top top',end:'bottom bottom',scrub:.8},
onUpdate:function(){placeTip(tl.progress());}});
tl.to(lanes,{strokeDashoffset:0,ease:'none',stagger:.015},0);
placeTip(0);
return function(){tl.scrollTrigger&&tl.scrollTrigger.kill();tl.kill();wrap.remove();html.classList.remove('mo-road-on');};
});
});
steps.push(function(){
$$('main > section').forEach(function(sec,i){
if(i===0||!below(sec)||sec.hasAttribute('data-mo-skip'))return;
if(getComputedStyle(sec).position==='static')return;
var line=d.createElement('span');
line.className='mo-wipe';line.setAttribute('aria-hidden','true');
sec.appendChild(line);
gsap.set(line,{scaleX:0});
ST.create({trigger:sec,start:'top 82%',once:true,onEnter:function(){
gsap.timeline()
.to(line,{scaleX:1,duration:.9,ease:'power3.inOut'})
.to(line,{opacity:.18,duration:.8,ease:'power1.out'},'+=.35');
}});
});
});
steps.push(function(){
var hero=$('[data-mo-hero]');
if(hero)mm.add(DESK,function(){
var lines=$$('[data-mo-intro="1"] > *',hero);
var band=$('[data-mo-intro="3"]',hero);
var tl=gsap.timeline({scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.7}});
if(lines.length)tl.fromTo(lines,{yPercent:0,clipPath:'inset(-10% 0% -10% 0%)'},{yPercent:-45,clipPath:'inset(-10% 0% 70% 0%)',ease:'none',stagger:.12},0);
if(band)tl.fromTo(band,{y:0,scale:1},{y:-36,scale:1.025,ease:'none'},0);
return function(){tl.scrollTrigger&&tl.scrollTrigger.kill();tl.kill();gsap.set(lines.concat(band||[]),{clearProps:'transform,clipPath'});};
});
});
steps.push(function(){
function gridItems(g){return Array.prototype.filter.call(g.children,function(k){return shown(k)&&!MO.inViewNow(k)&&k.getBoundingClientRect().top>0;});}
var WAVE='[data-mo-stagger="wave"], [data-vgrid]';
var FOLD='[data-mo-stagger="fold"], .ctiles';
mm.add({desk:DESK,mob:MOBI},function(ctx){
var desk=ctx.conditions.desk,triggers=[];
$$(WAVE).forEach(function(g){
var items=gridItems(g);if(!items.length)return;
var imgs=items.map(function(it){return it.querySelector('img[data-mo-depth], img');}).filter(Boolean);
gsap.set(items,{opacity:0,y:desk?56:26,transition:'none'});
if(imgs.length)gsap.set(imgs,{x:desk?-48:-18,scale:1.08});
triggers=triggers.concat(ST.batch(items,{start:'top bottom',once:true,onEnter:function(batch){
var bi=batch.map(function(it){return it.querySelector('img[data-mo-depth], img');}).filter(Boolean);
gsap.to(batch,{opacity:1,y:0,duration:desk?1:.7,ease:'power4.out',stagger:{each:.09,grid:'auto',from:'start'},overwrite:true,clearProps:'opacity,transform,transition'});
if(bi.length)gsap.to(bi,{x:0,scale:1,duration:desk?1.25:.8,ease:'power3.out',stagger:{each:.09,grid:'auto',from:'start'},delay:.08,overwrite:true,clearProps:'transform'});
}}));
});
$$(FOLD).forEach(function(g){
var items=gridItems(g);if(!items.length)return;
gsap.set(items,desk?{opacity:0,rotationX:-62,y:24,transformOrigin:'50% 0%',transformPerspective:900,transition:'none'}:{opacity:0,y:22,transition:'none'});
triggers=triggers.concat(ST.batch(items,{start:'top bottom',once:true,onEnter:function(batch){
gsap.to(batch,{opacity:1,rotationX:0,y:0,duration:desk?1.05:.65,ease:desk?'back.out(1.4)':'power3.out',stagger:{each:.08,grid:'auto',from:'start'},overwrite:true,clearProps:'opacity,transform,transformOrigin,transition'});
}}));
});
return function(){triggers.forEach(function(t){t.kill();});};
});
});
steps.push(function(){
$$('[data-mo-marquee]').forEach(function(band){
if(band.hasAttribute('data-mo-ready'))return;
band.setAttribute('data-mo-ready','');
var items=Array.prototype.slice.call(band.children);
if(!items.length)items=['Land Rover','Range Rover','Defender','Discovery','Jaguar','BMW','Mini','Ford Ranger','Toyota Hilux','Mitsubishi L200','Isuzu D-Max','Nissan Navara','VW Amarok','Jeep']
.map(function(t){var s=d.createElement('span');s.textContent=t;return s;});
var track=d.createElement('div');track.className='mo-band__track';
var run=d.createElement('div');run.className='mo-band__run';
band.setAttribute('lang','en');
items.forEach(function(it,i){it.textContent=it.textContent.toLocaleUpperCase('en-US');it.classList.add('mo-band__item');if(i%2)it.classList.add('mo-band__item--out');run.appendChild(it);});
band.textContent='';
track.appendChild(run);
var copies=Math.max(2,Math.ceil((w.innerWidth*2)/Math.max(1,run.scrollWidth||600))+1);
band.appendChild(track);
for(var c=1;c<copies;c++)track.appendChild(run.cloneNode(true));
var unit=run.getBoundingClientRect().width||600;
var skewTo=gsap.quickTo(track,'skewX',{duration:.5,ease:'power3.out'});
var desk=w.matchMedia(DESK).matches;
ST.create({
trigger:band,start:'top bottom',end:'bottom top',
onUpdate:function(self){
var x=-((self.scroll()*.45)%unit);
gsap.set(track,{x:x});
if(desk){var v=self.getVelocity();skewTo(gsap.utils.clamp(-9,9,v/-220));}
},
onLeave:function(){skewTo(0);},onLeaveBack:function(){skewTo(0);}
});
if(desk)ST.addEventListener('scrollEnd',function(){skewTo(0);});
});
});
steps.push(function(){
mm.add(DESK,function(){
var rails=$$('[data-mo-rail]').filter(below);
var tws=rails.map(function(rail){
rail.classList.add('mo-drift');
return gsap.fromTo(rail,{'--mo-rx':function(){return Math.min(260,w.innerWidth*.16)+'px';}},{'--mo-rx':'0px',ease:'none',
scrollTrigger:{trigger:rail,start:'top bottom',end:'top 45%',scrub:.6,invalidateOnRefresh:true}});
});
return function(){tws.forEach(function(t){t.scrollTrigger&&t.scrollTrigger.kill();t.kill();});rails.forEach(function(r){r.classList.remove('mo-drift');r.style.removeProperty('--mo-rx');});};
});
});
steps.push(function(){
$$('[data-mo-draw], .why__list, .trust4__list').forEach(function(list){
if(!below(list))return;
var icons=$$('svg',list).filter(function(s){
var u=s.querySelector('use'),href=u?(u.getAttribute('href')||''):'';
return!s.classList.contains('is-wa')&&!/whatsapp|star/.test(href);
});
if(!icons.length)return;
gsap.set(icons,{strokeDasharray:90,strokeDashoffset:90});
ST.create({trigger:list,start:'top 85%',once:true,onEnter:function(){
gsap.to(icons,{strokeDashoffset:0,duration:1.2,ease:'power2.inOut',stagger:.14,clearProps:'strokeDasharray,strokeDashoffset'});
}});
});
});
steps.push(function(){
var foot=$('footer.footer');
if(!foot||!below(foot))return;
var bandVisible=getComputedStyle(foot,'::before').content!=='none'&&getComputedStyle(foot,'::before').display!=='none';
if(bandVisible){
foot.classList.add('mo-fband');
gsap.set(foot,{'--mo-fb':0});
ST.create({trigger:foot,start:'top 94%',once:true,onEnter:function(){
gsap.to(foot,{'--mo-fb':1,duration:.9,ease:'power3.inOut',onComplete:function(){foot.classList.remove('mo-fband');foot.style.removeProperty('--mo-fb');}});
}});
}
var logo=$('.footer__about .logo img, .footer .logo img',foot);
var link=logo&&logo.parentElement;
if(!logo||!link||!/logo/.test(logo.getAttribute('src')||''))return;
var BASE_CLIP='polygon(0% 0%, 70% 0%, 70% 21.5%, 65% 21.5%, 65% 47%, 60% 47%, 60% 59.5%, 46% 59.5%, 46% 100%, 0% 100%)';
var SLICES=[['inset(0% 0% 78.5% 70%)',0],['inset(21.5% 0% 53% 65%)',1],['inset(47% 0% 40.5% 60%)',2],['inset(59.5% 0% 0% 46%)',2]];
link.classList.add('mo-flogo');
var clones=SLICES.map(function(sl){
var clip=sl[0],c=d.createElement('img');
c.setAttribute('data-mo-order',sl[1]);
c.src=logo.currentSrc||logo.src;c.alt='';c.setAttribute('aria-hidden','true');c.className='mo-flogo__slice';
c.style.clipPath=clip;
link.appendChild(c);
return c;
});
var fit=function(){var r=logo.getBoundingClientRect(),lr=link.getBoundingClientRect();clones.forEach(function(c){c.style.left=(r.left-lr.left)+'px';c.style.top=(r.top-lr.top)+'px';c.style.width=r.width+'px';c.style.height=r.height+'px';});};
fit();
logo.style.clipPath=BASE_CLIP;
gsap.set(clones,{x:28,opacity:0});
var done=function(){logo.style.clipPath='';clones.forEach(function(c){c.remove();});link.classList.remove('mo-flogo');};
ST.create({trigger:link,start:'top 92%',once:true,onEnter:function(){
fit();
gsap.to(clones,{x:0,opacity:1,duration:.55,ease:'power3.out',delay:function(i,el){return.15+(+el.getAttribute('data-mo-order'))*.12;},onComplete:done});
}});
});
steps.push(function(){
$$('[data-mo-reveal-img], .k-photo img, .lp-visual__frame img').forEach(function(img){
if(!below(img)||img.closest('[data-mo-skip]'))return;
gsap.set(img,{clipPath:'inset(0% 0% 100% 0%)',scale:1.08});
ST.create({trigger:img,start:'top 88%',once:true,onEnter:function(){
gsap.to(img,{clipPath:'inset(0% 0% 0% 0%)',scale:1,duration:1.15,ease:'power3.inOut',clearProps:'clipPath,transform'});
}});
});
});
steps.push(function(){
var main=$('main[data-mo-page="arac"]');
if(!main)return;
mm.add(DESK,function(){
var tl=null,layers=[];
var kill=function(){
if(tl){tl.scrollTrigger&&tl.scrollTrigger.kill();tl.kill();tl=null;}
layers.forEach(function(el){el.classList.remove('mo-depth');el.style.removeProperty('--mo-py');});layers=[];
};
var setup=function(){
kill();
var head=$('.hub-head--band, .hub-head--media, [data-mo-hub-head]',main);
if(!head)return;
var car=$('.hub-band__car',head),fill=$('.hub-band__fill',head),sil=$('.hub-head__media:not([hidden])',head);
var map=[[car,56],[fill,28],[car?null:sil,36]].filter(function(x){return x[0];});
if(!map.length)return;
tl=gsap.timeline({scrollTrigger:{trigger:head,start:'top top',end:'bottom top',scrub:.6}});
map.forEach(function(x){x[0].classList.add('mo-depth');layers.push(x[0]);tl.fromTo(x[0],{'--mo-py':'0px'},{'--mo-py':x[1]+'px',ease:'none'},0);});
};
setup();
d.addEventListener('dky:hub-ready',setup);
return function(){d.removeEventListener('dky:hub-ready',setup);kill();};
});
var seen=new WeakSet();
var veil=function(){
var medias=$$('[data-mo-stagger] > * [class*="__media"]',main).filter(function(m){
if(seen.has(m)||!shown(m)||MO.inViewNow(m)||m.getBoundingClientRect().top<0||m.closest('.hub-head'))return false;
seen.add(m);return true;
});
if(!medias.length)return;
gsap.set(medias,{clipPath:'inset(0% 0% 100% 0%)'});
ST.batch(medias,{start:'top bottom',once:true,onEnter:function(batch){
gsap.to(batch,{clipPath:'inset(0% 0% 0% 0%)',duration:1,ease:'power3.inOut',stagger:{each:.08,grid:'auto',from:'start'},delay:.1,clearProps:'clipPath'});
var imgs=batch.map(function(m){return m.querySelector('img');}).filter(Boolean);
if(imgs.length)gsap.fromTo(imgs,{scale:1.12},{scale:1,duration:1.3,ease:'power3.out',stagger:{each:.08,grid:'auto',from:'start'},delay:.1,clearProps:'transform'});
}});
};
veil();
d.addEventListener('dky:hub-ready',function(){setTimeout(veil,0);});
});
var nextTask=function(fn){if(w.scheduler&&w.scheduler.yield)w.scheduler.yield().then(fn);else setTimeout(fn,0);};
(function run(i){if(i>=steps.length)return;try{steps[i]();}catch(e){if(w.console)console.warn('[DKY motion] v5 adım '+(i+1)+':',e.message);}nextTask(function(){run(i+1);});})(0);
})();
