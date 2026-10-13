(function(){
'use strict';
var w=window,d=document,MO=w.DKYMO,gsap=w.gsap;
if(!MO||!gsap||d.documentElement.hasAttribute('data-mo-product'))return;
d.documentElement.setAttribute('data-mo-product','');
var root=d.querySelector('[data-pd-root]')||d.querySelector('[data-mo-product]');
if(!root)return;
MO.spot('.pd-frame');
var done=false;
function emphasize(){
if(done)return;
var price=root.querySelector('.pd-price');
if(!price||!MO.inViewNow(price))return;
done=true;
var M=w.DKY&&w.DKY.motion;
var now=price.querySelector('.pd-price__now')||price;
setTimeout(function(){if(M&&M.sheen)M.sheen(now);},650);
var stock=root.querySelector('.pd-stock');
if(stock)gsap.fromTo(stock,{opacity:0,x:-8},{opacity:1,x:0,duration:.55,ease:'back.out(2)',delay:.5,clearProps:'opacity,transform'});
var svg=stock&&stock.querySelector('svg');
if(svg)gsap.fromTo(svg,{scale:.4,rotate:-30},{scale:1,rotate:0,duration:.6,ease:'back.out(3)',delay:.62,clearProps:'transform'});
}
function check(){if(root.getAttribute('aria-busy')!=='true'&&root.querySelector('.pd-price'))emphasize();}
check();
if(!done){
var ob=new MutationObserver(function(){check();if(done)ob.disconnect();});
ob.observe(root,{attributes:true,attributeFilter:['aria-busy'],childList:true});
}
})();
