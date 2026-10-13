(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const nf=n=>Number(n).toLocaleString('tr-TR');
function ready(fn){
if(window.DKY&&window.DKY.card&&window.DKY.motion)fn();
else document.addEventListener('dky:ready',fn,{once:true});
}
const MAKES={
'land-rover':[['defender-new','Yeni Defender (2020+)'],['defender-classic','Defender 1987–2016'],['discovery-5','Discovery 5'],['discovery-4','Discovery 4'],['discovery-3','Discovery 3'],['discovery-2','Discovery 2'],['discovery-sport','Discovery Sport'],['freelander-2','Freelander 2'],['freelander-1','Freelander 1']],
'range-rover':[['rr-vogue','Range Rover Vogue'],['rr-sport','Range Rover Sport'],['rr-evoque','Range Rover Evoque'],['rr-velar','Range Rover Velar']],
jaguar:[['jaguar','Jaguar (tüm modeller)'],['jaguar-xe','Jaguar XE'],['jaguar-xf','Jaguar XF'],['jaguar-xj','Jaguar XJ'],['jaguar-s-type','Jaguar S-Type'],['jaguar-x-type','Jaguar X-Type'],['jaguar-f-pace','Jaguar F-Pace'],['jaguar-f-type','Jaguar F-Type']],
'bmw-mini':[['bmw','BMW (tüm modeller)'],['bmw-1','BMW 1 Serisi'],['bmw-3','BMW 3 Serisi'],['bmw-5','BMW 5 Serisi'],['bmw-7','BMW 7 Serisi'],['bmw-x1','BMW X1'],['bmw-x3','BMW X3'],['bmw-x5','BMW X5'],['mini','Mini']],
offroad:[['ford-ranger','Ford Ranger'],['toyota-hilux','Toyota Hilux'],['mitsubishi-l200','Mitsubishi L200'],['isuzu-dmax','Isuzu D-Max'],['nissan-navara','Nissan Navara'],['vw-amarok','VW Amarok'],['mercedes-x-class','Mercedes X-Class'],['jeep','Jeep']]
};
const MAKE_HUB={'land-rover':'/dky/arac.html?marka=land-rover','range-rover':'/dky/arac.html?marka=range-rover',jaguar:'/dky/arac.html?model=jaguar','bmw-mini':'/dky/arac.html?marka=bmw-mini',offroad:'/dky/arac.html?marka=offroad'};
const makeOf=model=>Object.keys(MAKES).find(k=>MAKES[k].some(m=>m[0]===model))||'';
const SIL={jeep:'sil-offroad','ford-ranger':'sil-pickup','toyota-hilux':'sil-pickup','mitsubishi-l200':'sil-pickup','isuzu-dmax':'sil-pickup','nissan-navara':'sil-pickup','vw-amarok':'sil-pickup','mercedes-x-class':'sil-pickup','range-rover':'sil-suv','rr-sport':'sil-suv','rr-evoque':'sil-suv-compact','rr-velar':'sil-suv','defender-new':'sil-offroad','defender-classic':'sil-offroad',discovery:'sil-suv','discovery-sport':'sil-suv-compact',freelander:'sil-suv-compact',jaguar:'sil-sedan','bmw-mini':'sil-sedan',offroad:'sil-pickup'};
ready(()=>{
const DKY=window.DKY,M=DKY.motion,esc=DKY.esc;
const F=window.DKY_FEATURED||null;
const G=window.DKY_GORSELLER||{};
if(F){
$$('[data-stat]').forEach(el=>{const v=F.stats&&F.stats[el.dataset.stat];if(v!=null)el.textContent=nf(v);});
$$('[data-gcount]').forEach(el=>{const n=F.groupCounts&&F.groupCounts[el.dataset.gcount];if(n)el.textContent=nf(n);});
const box=F.boxCounts||{};
const brand=F.brands||{};
const single={'range-rover':'rr-vogue'};
$$('[data-vcount]').forEach(el=>{
const k=el.dataset.vcount;
let n=box[k];
if(n==null)n=(F.modelCounts||{})[single[k]||k];
if(n==null&&k==='jaguar')n=(brand.jaguar||{}).count;
if(n==null&&k==='bmw-mini')n=(brand['bmw-mini']||{}).count;
if(n==null&&k==='offroad')n=(brand.offroad||{}).pickup;
if(n==null)return;
el.innerHTML=`<span data-vn>${nf(n)}</span> ${k==='offroad'||makeOf(k)==='offroad'?'ürün':'parça'}`;
});
}
$$('[data-gimg]').forEach(img=>{
const k=img.dataset.gimg,media=img.closest('.ctile__media');
const ai=G.kategori&&G.kategori[k];
const name=F&&F.groupImages&&F.groupImages[k];
const photo=name?DKY.img(name,400):img.getAttribute('src');
if(ai){
const src='/dky/'+String(ai).replace(/^\/+/,'');
img.addEventListener('error',()=>{if(media)media.classList.remove('ctile__media--ai');img.width=400;img.height=400;if(photo&&img.getAttribute('src')!==photo)img.src=photo;},{once:true});
if(media)media.classList.add('ctile__media--ai');
img.width=1200;img.height=900;
if(img.getAttribute('src')!==src)img.src=src;
}else if(photo&&img.getAttribute('src')!==photo)img.src=photo;
});
const silHTML=k=>`<svg class="car-sil" aria-hidden="true"><use href="/dky/assets/h/img/icons.9d3a84566c.svg#${SIL[k]||'sil-suv'}"/></svg>`;
const toSil=(media,k)=>{media.className='vbox__media vbox__media--sil';media.innerHTML=silHTML(k);};
$$('[data-veh]').forEach((a,i)=>{
const k=a.dataset.veh;
const media=$('.vbox__media',a);
if(!media)return;
const vi=DKY.vehicleImage?DKY.vehicleImage(k,800):null;
const cur=$('img',media);
if(vi&&vi.kind==='ai'&&!(cur&&cur.getAttribute('src')===vi.src)){
const im=new Image();
im.decoding='async';
im.onload=()=>{
media.className='vbox__media vbox__media--ai';
media.innerHTML=`<img src="${esc(vi.src)}" alt="" width="${vi.w}" height="${vi.h}" data-mo-depth${i<4?'':' loading="lazy"'} decoding="async">`;
};
im.src=vi.src;
}
$$('img',media).forEach(img=>{
const fail=()=>{if(media.isConnected)toSil(media,k);};
if(img.complete&&img.naturalWidth===0&&img.getAttribute('src'))fail();
else img.addEventListener('error',fail,{once:true});
});
});
const grid=$('[data-vgrid]'),filter=$('[data-vfilter]');
if(grid&&filter){
const items=$$(':scope > li',grid);
const apply=(val,anim)=>{
const before=new CustomEvent('dky:grid-before',{bubbles:true,cancelable:true,detail:{animate:!!anim,mode:'filter'}});
grid.dispatchEvent(before);
items.forEach(li=>{li.hidden=val?!(li.dataset.brand||'').split(' ').includes(val):li.hasAttribute('data-only');});
grid.dispatchEvent(new CustomEvent('dky:grid-after',{bubbles:true,detail:{animate:!!anim,mode:'filter',flip:before.defaultPrevented}}));
if(anim&&!before.defaultPrevented&&!M.reduced&&Element.prototype.animate){
items.filter(li=>!li.hidden).forEach((li,i)=>li.animate([{opacity:0,transform:'translateY(10px) scale(.98)'},{opacity:1,transform:'none'}],{duration:320,delay:Math.min(i,8)*40,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'}));
}
};
filter.addEventListener('click',e=>{
const b=e.target.closest('[data-vf]');
if(!b||b.getAttribute('aria-pressed')==='true')return;
$$('[data-vf]',filter).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
apply(b.dataset.vf,true);
DKY.track('select_content',{content_type:'vehicle_filter',item_id:b.dataset.vf||'tumu'});
});
}
const form=$('[data-vfinder]');
if(form){
const sMake=$('[data-vf-make]',form),sModel=$('[data-vf-model]',form),sGen=$('[data-vf-gen]',form);
const counts=(F&&F.modelCounts)||{};
const fillModels=(mk,keep)=>{
const list=MAKES[mk];
if(!list)return;
sModel.innerHTML='<option value="">Seçin</option>'+list.map(([k,l])=>`<option value="${esc(k)}">${esc(l)}${counts[k]?` (${nf(counts[k])})`:''}</option>`).join('');
if(keep&&list.some(m=>m[0]===keep))sModel.value=keep;
};
let gensReq=0;
const fillGens=(model,keep)=>{
const req=++gensReq;
sGen.innerHTML='<option value="">Tüm yıllar</option>';
sGen.disabled=true;
if(!model||!DKY.loadNav)return;
DKY.loadNav({fallback:false}).then(nav=>{
if(req!==gensReq)return;
const m=nav.model(model);
const gs=m&&DKY.liveGens?DKY.liveGens(m):[];
if(gs.length<2){
if(gs.length===1)sGen.innerHTML=`<option value="">${esc((gs[0].code?gs[0].code+' · ':'')+gs[0].years)}</option>`;
return;
}
sGen.innerHTML='<option value="">Tüm yıllar / kasalar</option>'+gs.map(g=>`<option value="${esc(g.key)}">${esc((g.code?g.code+' · ':'')+g.years)}</option>`).join('');
sGen.disabled=false;
if(keep&&gs.some(g=>g.key===keep))sGen.value=keep;
}).catch(()=>{});
};
sMake.addEventListener('change',()=>{fillModels(sMake.value);fillGens('');if(sMake.value)sModel.focus();});
sModel.addEventListener('change',()=>{
if(!sMake.value&&sModel.value){sMake.value=makeOf(sModel.value);fillModels(sMake.value,sModel.value);}
fillGens(sModel.value);
});
form.addEventListener('focusin',()=>{if(DKY.loadNav)DKY.loadNav({fallback:false}).catch(()=>{});},{once:true});
form.addEventListener('submit',e=>{
const model=sModel.value,mk=sMake.value;
if(!model){
e.preventDefault();
if(mk&&MAKE_HUB[mk]){location.href=MAKE_HUB[mk];return;}
sMake.focus();
if(DKY.toast)DKY.toast('Önce aracınızın markasını ve modelini seçin');
return;
}
const gen=sGen.disabled?'':sGen.value;
DKY.garage.set(model,gen||null);
DKY.track('select_vehicle_finder',{model,kasa:gen});
e.preventDefault();
location.href=DKY.url?DKY.url.hub(model,gen):'/dky/arac.html?model='+encodeURIComponent(model)+(gen?'&kasa='+encodeURIComponent(gen):'');
});
const g=DKY.garage.get(),gg=DKY.garage.gen&&DKY.garage.gen();
if(g&&makeOf(g)){sMake.value=makeOf(g);fillModels(sMake.value,g);fillGens(g,gg&&gg.key);}
}
const rail=$('[data-rail-track]');
const prev=$('[data-rail="-1"]'),next=$('[data-rail="1"]');
const pbar=$('.rail-progress__bar'),ptrack=pbar&&pbar.parentElement;
let prRaf=0;
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
const queue=()=>{if(!prRaf)prRaf=requestAnimationFrame(progress);};
const paint=()=>{
if(!rail||!F||!F.sets)return;
const items=F.sets.populer||[];
rail.innerHTML=items.map(p=>DKY.card(p)).join('');
[...rail.children].forEach((c,i)=>c.style.setProperty('--k',Math.min(i,8)));
if(DKY.register)DKY.register(items);
queue();
};
paint();
if(rail)rail.addEventListener('scroll',queue,{passive:true});
window.addEventListener('resize',queue,{passive:true});
$$('[data-rail]').forEach(b=>b.addEventListener('click',()=>{
if(rail)rail.scrollBy({left:Number(b.dataset.rail)*rail.clientWidth*0.9,behavior:M.reduced?'auto':'smooth'});
}));
const paintGarage=()=>{
const g=DKY.garage.get();
const keys=new Set(g?[g,DKY.vehicleBox?DKY.vehicleBox(g):'',makeOf(g)==='offroad'?'offroad':'']:[]);
$$('[data-veh]').forEach(a=>{
const on=keys.has(a.dataset.veh);
a.classList.toggle('is-garage',on);
if(on)a.setAttribute('aria-describedby','veh-garage-note');else a.removeAttribute('aria-describedby');
});
};
if(!$('#veh-garage-note'))document.body.insertAdjacentHTML('beforeend','<span id="veh-garage-note" class="sr-only" hidden>Kayıtlı aracınız</span>');
paintGarage();
document.addEventListener('dky:garage',()=>{paintGarage();paint();});
window.addEventListener('pageshow',e=>{if(e.persisted){paintGarage();paint();}});
if(DKY.observe)DKY.observe();
});
})();
