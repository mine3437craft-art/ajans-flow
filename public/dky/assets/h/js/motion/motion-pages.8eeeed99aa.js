(function(){
'use strict';
var w=window,d=document,MO=w.DKYMO,gsap=w.gsap,ST=w.ScrollTrigger;
if(!MO||!gsap||!ST||d.documentElement.hasAttribute('data-mo-pages'))return;
d.documentElement.setAttribute('data-mo-pages','');
var $$=function(s,r){return Array.prototype.slice.call((r||d).querySelectorAll(s));};
var below=function(el){return el.getBoundingClientRect().top>(w.innerHeight||d.documentElement.clientHeight);};
var lpItems=$$('.lp .lp-form, .lp .lp-trust__item').filter(function(el){return below(el)&&!el.closest('.mo-gs');});
if(lpItems.length)MO.reveal(lpItems,{y:18});
var main=d.querySelector('main[data-mo-page]');
d.addEventListener('dky:hub-ready',function(e){
if(!main||(e.detail&&e.detail.mode==='error'))return;
MO.enter(main,{delay:.05});
ST.refresh();
});
var pop=d.querySelector('[data-hub-pop]');
if(pop)new MutationObserver(function(){
var grid=pop.querySelector('.p-grid');
if(grid&&grid.children.length&&!grid.hasAttribute('data-mo-stagger')){grid.setAttribute('data-mo-stagger','');MO.enter(pop);}
}).observe(pop,{childList:true,subtree:true});
d.addEventListener('dky:dir-render',function(e){
var reason=e.detail&&e.detail.reason;
if(!main||reason==='filter')return;
$$('.az',main).forEach(function(az){az.setAttribute('data-mo-stagger','');});
MO.enter(main,{y:reason==='view'?10:14});
ST.refresh();
});
})();
