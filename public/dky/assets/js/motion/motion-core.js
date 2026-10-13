(function(){
'use strict';
var d=document,w=window,html=d.documentElement;
if(w.DKYMO)return;
var mq=function(q){return w.matchMedia?w.matchMedia(q):{matches:false};};
var RM=mq('(prefers-reduced-motion: reduce)');
var MAIN_JS='/dky/assets/h/js/motion/motion-main.42f5b19067.js';
var MO=w.DKYMO={
version:'3.0',
reduced:RM.matches,
fine:mq('(hover: hover) and (pointer: fine)').matches&&!RM.matches,
small:mq('(max-width: 760px)').matches,
gsap:null,
ready:function(fn){if(MO.gsap)MO.gsap.then(fn,function(){});else d.addEventListener('dky:gsap',function(){fn(w.gsap);},{once:true});}
};
MO.inViewNow=function(el){var r=el.getBoundingClientRect();return r.bottom>0&&r.top<(w.innerHeight||html.clientHeight)&&r.width+r.height>0;};
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
function whenSettled(cb){
var t0=Date.now(),MAX=3500,fired=false,timer=0;
var go=function(){if(fired)return;fired=true;clearTimeout(timer);cb();};
var check=function(){
if(fired)return;
if(Date.now()-t0>MAX)return go();
if(d.querySelector('main [aria-busy="true"]')){timer=setTimeout(check,150);return;}
var pending=[];
for(var i=0;i<d.images.length;i++){var im=d.images[i];if(!im.complete&&MO.inViewNow(im))pending.push(im);}
if(!pending.length)return go();
var left=pending.length;
var one=function(){if(--left<=0)check();};
pending.forEach(function(im){im.addEventListener('load',one,{once:true});im.addEventListener('error',one,{once:true});});
timer=setTimeout(go,Math.max(0,MAX-(Date.now()-t0)));
};
check();
}
function loadMain(){
var s=d.createElement('script');
s.src=MAIN_JS;s.async=true;
s.onerror=function(){if(w.console)console.warn('[DKY motion] ana gövde yüklenemedi; site CSS hareketleriyle devam');};
d.head.appendChild(s);
}
initViewTransitions();
var start=function(){whenSettled(loadMain);};
if(d.readyState==='complete')start();else w.addEventListener('load',start,{once:true});
})();
