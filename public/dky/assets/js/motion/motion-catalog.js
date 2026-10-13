(function(){
'use strict';
var w=window,d=document,MO=w.DKYMO,gsap=w.gsap,Flip=w.Flip;
if(!MO||!gsap||!Flip||d.documentElement.hasAttribute('data-mo-catalog'))return;
d.documentElement.setAttribute('data-mo-catalog','');
var MAX=24;
var vh=function(){return w.innerHeight||d.documentElement.clientHeight;};
var idOf=function(card){
if(card.dataset.flipId)return card.dataset.flipId;
var b=card.querySelector('[data-add-quote]');if(b)return b.getAttribute('data-add-quote');
var a=card.querySelector('a[href*="urun.html?id="]');if(a){var m=/id=([^&#]+)/.exec(a.getAttribute('href'));if(m)return m[1];}
return null;
};
var tag=function(cards){cards.forEach(function(c){if(c.dataset.flipId)return;var id=idOf(c);if(id)c.setAttribute('data-flip-id',id);});};
var visibleCards=function(grid){
var out=[],kids=grid.children,h=vh();
for(var i=0;i<kids.length&&out.length<MAX;i++){
var r=kids[i].getBoundingClientRect();
if(r.bottom<-200||r.top>h+200)continue;
out.push(kids[i]);
}
return out;
};
var state=null,running=null;
var filterMode=false,prevVisible=[];
d.addEventListener('dky:grid-before',function(e){
var grid=e.target;
if(!e.detail||!e.detail.animate||!grid||!grid.children)return;
if(running){running.progress(1);running=null;}
filterMode=e.detail.mode==='filter';
if(filterMode){
var kids=Array.prototype.slice.call(grid.children);
tag(kids);
prevVisible=kids.filter(function(k){return!k.hidden&&k.getClientRects().length;});
state=Flip.getState([grid].concat(kids),{props:'opacity'});
e.preventDefault();
return;
}
var cards=visibleCards(grid);
if(!cards.length)return;
tag(cards);
state=Flip.getState(cards,{props:'opacity'});
e.preventDefault();
});
d.addEventListener('dky:grid-after',function(e){
var grid=e.target;
if(!state||!grid||!grid.children){state=null;return;}
if(filterMode){
var kids=Array.prototype.slice.call(grid.children);
var leaving=kids.filter(function(k){return k.hidden&&prevVisible.indexOf(k)>-1;});
leaving.forEach(function(k){k.hidden=false;k.style.display='none';});
var restore=function(){leaving.forEach(function(k){k.style.display='';k.hidden=true;});leaving=[];};
gsap.set(kids,{transition:'none'});
gsap.set(grid,{position:'relative',zIndex:2});
running=Flip.from(state,{
targets:[grid].concat(kids),duration:.6,ease:'power3.inOut',absolute:kids,scale:false,nested:true,
stagger:{each:.02,from:'start'},
onEnter:function(els){return gsap.fromTo(els,{opacity:0,scale:.9},{opacity:1,scale:1,duration:.5,ease:'back.out(1.6)',stagger:.04,delay:.12});},
onLeave:function(els){return gsap.to(els,{opacity:0,scale:.9,duration:.3,ease:'power2.in'});},
onComplete:function(){restore();gsap.set(kids,{clearProps:'transition,transform,opacity,translate,rotate'});gsap.set(grid,{clearProps:'position,zIndex,width,height,transform'});running=null;}
});
running.eventCallback('onInterrupt',function(){restore();gsap.set(grid,{clearProps:'position,zIndex,width,height,transform'});});
state=null;filterMode=false;prevVisible=[];
return;
}
var all=Array.prototype.slice.call(grid.children);
var cards=all.slice(0,MAX);
tag(cards);
gsap.set(cards,{transition:'none'});
running=Flip.from(state,{
targets:cards,
duration:.6,ease:'power3.inOut',absolute:false,scale:false,nested:false,
stagger:{each:.012,from:'start'},
onEnter:function(els){
return gsap.fromTo(els,{opacity:0,y:18,scale:.97},{opacity:1,y:0,scale:1,duration:.5,ease:'power3.out',stagger:{amount:.3},delay:.1});
},
onComplete:function(){gsap.set(cards,{clearProps:'transition,transform,opacity'});running=null;}
});
var rest=all.slice(MAX);
if(rest.length)gsap.fromTo(rest,{opacity:0},{opacity:1,duration:.4,delay:.2,clearProps:'opacity'});
state=null;
});
})();
