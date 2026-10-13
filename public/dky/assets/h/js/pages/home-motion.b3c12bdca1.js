(function(){
'use strict';
const DKY=window.DKY=window.DKY||{};
if(DKY.motion)return;
const mq=q=>(window.matchMedia?window.matchMedia(q):{matches:false});
const mqReduce=mq('(prefers-reduced-motion: reduce)');
const mqFine=mq('(hover: hover) and (pointer: fine)');
const mqSmall=mq('(max-width: 860px)');
const toList=t=>(!t?[]:typeof t==='string'?[...document.querySelectorAll(t)]:(t instanceof Element?[t]:[...t]));
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const noop=()=>{};
const plx=new Set();
let raf=0;
const update=()=>{
raf=0;
const vh=window.innerHeight||1;
plx.forEach(it=>{
const r=it.el.getBoundingClientRect();
const top=r.top-it.y;
if(top>vh*1.5||top+r.height<-vh*.5)return;
const prog=clamp(((top+r.height/2)-vh/2)/(vh/2+r.height/2),-1,1);
const cap=mqSmall.matches||!mqFine.matches?12:40;
const y=Math.round(-prog*Math.min(it.strength,cap)*10)/10;
if(y!==it.y){it.y=y;it.el.style.setProperty('--parallax-y',y+'px');}
});
};
const queue=()=>{if(!raf)raf=requestAnimationFrame(update);};
DKY.motion={
get reduced(){return mqReduce.matches;},
get fine(){return mqFine.matches;},
get small(){return mqSmall.matches;},
inView(target,cb,{once=true,rootMargin='0px 0px -10% 0px',threshold=0}={}){
const els=toList(target);
if(!els.length)return noop;
if(!('IntersectionObserver'in window)){els.forEach(el=>cb(el,null));return noop;}
const io=new IntersectionObserver(entries=>entries.forEach(en=>{
if(en.isIntersecting){cb(en.target,en);if(once)io.unobserve(en.target);}
else if(!once)cb(en.target,en);
}),{rootMargin,threshold});
els.forEach(el=>io.observe(el));
return()=>io.disconnect();
},
stagger(nodes,step=70,{start=0,max=12}={}){
const list=toList(nodes);
const s=mqSmall.matches?Math.round(step*.6):step;
list.forEach((el,i)=>el.style.setProperty('--d',(start+Math.min(i,max)*s)+'ms'));
return list;
},
parallax(el,strength=24,{apply=true}={}){
if(!el||mqReduce.matches)return noop;
const it={el,strength:Math.abs(strength),y:0};
if(apply)el.classList.add('parallax');
plx.add(it);
if(plx.size===1){window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);}
queue();
return()=>{plx.delete(it);el.style.removeProperty('--parallax-y');if(apply)el.classList.remove('parallax');};
},
tilt(el,max=6){
if(!el||!mqFine.matches||mqReduce.matches)return noop;
el.classList.add('tilt');
const move=e=>{
const r=el.getBoundingClientRect();
const x=clamp((e.clientX-r.left)/r.width,0,1),y=clamp((e.clientY-r.top)/r.height,0,1);
el.classList.add('is-tilting');
el.style.setProperty('--tilt-y',((x-.5)*2*max).toFixed(2)+'deg');
el.style.setProperty('--tilt-x',(-(y-.5)*2*max).toFixed(2)+'deg');
};
const leave=()=>{el.classList.remove('is-tilting');el.style.setProperty('--tilt-x','0deg');el.style.setProperty('--tilt-y','0deg');};
el.addEventListener('pointermove',move);
el.addEventListener('pointerleave',leave);
return()=>{leave();el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);el.classList.remove('tilt');};
},
sheen(el){
if(!el)return el;
el.classList.add('sheen');
if(mqReduce.matches)return el;
el.classList.remove('is-sheening');void el.offsetWidth;el.classList.add('is-sheening');
return el;
},
observe(r){
if(typeof DKY.observe==='function')return DKY.observe(r);
const root=r||document;
const els=[...root.querySelectorAll('.reveal:not(.is-in), .stagger:not(.is-in)')];
if(mqReduce.matches){els.forEach(el=>el.classList.add('is-in'));return;}
DKY.motion.inView(els,el=>el.classList.add('is-in'));
}
};
})();
