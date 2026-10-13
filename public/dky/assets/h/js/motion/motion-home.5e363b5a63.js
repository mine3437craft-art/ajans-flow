(function(){
'use strict';
var w=window,d=document,MO=w.DKYMO,gsap=w.gsap;
if(!MO||!gsap||d.documentElement.hasAttribute('data-mo-home'))return;
d.documentElement.setAttribute('data-mo-home','');
var steps=d.querySelector('[data-mo-steps]');
if(steps){
var form=steps.closest('form');
var go=form&&form.querySelector('[type="submit"]');
var sheened=false;
steps.addEventListener('change',function(e){
var li=e.target.closest?e.target.closest('[data-mo-steps] > *'):null;
if(!li)return;
gsap.fromTo(li,{scale:.97},{scale:1,duration:.45,ease:'back.out(3)',overwrite:true,clearProps:'transform'});
setTimeout(function(){
var next=li.nextElementSibling;
if(next&&next.querySelector('select:not(:disabled), input:not(:disabled)')){
gsap.fromTo(next,{y:-5},{y:0,duration:.55,ease:'back.out(3)',overwrite:true,clearProps:'transform'});
}
var model=form&&form.querySelector('[name="model"]');
var M=w.DKY&&w.DKY.motion;
if(go&&model&&model.value&&M&&M.sheen){if(!sheened||e.target===model)M.sheen(go);sheened=true;}
},0);
});
}
})();
