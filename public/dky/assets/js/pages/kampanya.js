(function(){
'use strict';
const D=document,W=window;
const DKY=W.DKY||(W.DKY={});
const $=(s,r=D)=>r.querySelector(s);
const $$=(s,r=D)=>[...r.querySelectorAll(s)];
const esc=s=>(DKY.esc?DKY.esc(s):String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
const norm=s=>(DKY.norm?DKY.norm(s):String(s||'').toLocaleLowerCase('tr-TR'));
const ICON=id=>`<svg aria-hidden="true"><use href="/dky/assets/h/img/icons.9d3a84566c.svg#i-${id}"/></svg>`;
const track=(n,p)=>(DKY.track?DKY.track(n,p):null);
const page=D.body.dataset.lp||'';
const params=new URLSearchParams(location.search);
const MODELS={
'rr-vogue':{name:'Range Rover Vogue',kasa:'L322 · L405 · L460',re:/(\bvogue\b|l322|l405|l460|autobiography)/,dat:"Range Rover Vogue'unuza"},
'rr-sport':{name:'Range Rover Sport',kasa:'L320 · L494 · L461',re:/(range ?rover ?sport|\brr ?sport|\brrs\b|l320|l494|l461|\bsvr\b)/,dat:"Range Rover Sport'unuza"},
'rr-velar':{name:'Range Rover Velar',kasa:'L560',re:/(velar|l560)/,dat:"Velar'ınıza"},
'rr-evoque':{name:'Range Rover Evoque',kasa:'L538 · L551',re:/(evoque|l538|l551)/,dat:"Evoque'unuza"},
'defender-new':{name:'Yeni Defender',kasa:'L663',re:/((yeni|new) ?defender|l663|defender ?(90 |110 |130 )?20[2-3]\d|defender ?130)/,dat:"Defender'ınıza"},
'defender-classic':{name:'Klasik Defender',kasa:'90 / 110 · 1987–2016',re:/(defender|puma|\btd5\b)/,dat:"Defender'ınıza"},
'discovery-sport':{name:'Discovery Sport',kasa:'L550',re:/(disco(very)? ?sport|l550)/,dat:"Discovery Sport'unuza"},
'discovery-5':{name:'Discovery 5',kasa:'L462',re:/(disco(very)? ?5|l462)/,dat:"Discovery'nize"},
'discovery-4':{name:'Discovery 4',kasa:'L319',re:/(disco(very)? ?4|\blr4\b)/},
'discovery-3':{name:'Discovery 3',kasa:'L319',re:/(disco(very)? ?3|\blr3\b)/},
'discovery-2':{name:'Discovery 2',kasa:'',re:/(disco(very)? ?(2|ii)\b)/},
'freelander-2':{name:'Freelander 2',kasa:'L359',re:/(freelander ?2|l359)/},
'freelander-1':{name:'Freelander 1',kasa:'L314',re:/(freelander ?1|l314)/},
'ford-ranger':{name:'Ford Ranger',kasa:'T6 · T7 · T8 · T9',re:/(ranger|raptor)/,items:'snorkel, diferansiyel kilidi, panjur, dodik seti, body kit ve LED stop lambaları'},
'toyota-hilux':{name:'Toyota Hilux',kasa:'Vigo · Revo',re:/(hilux|\brevo\b|\bvigo\b)/,items:'diferansiyel kilidi, panjur, dodik seti, body kit ve LED stop lambaları'},
'mitsubishi-l200':{name:'Mitsubishi L200',kasa:'',re:/(\bl ?200\b|triton)/,items:'diferansiyel kilidi, snorkel, ön tampon, panjur, dodik seti ve stop lambaları'},
'vw-amarok':{name:'VW Amarok',kasa:'',re:/amarok/,items:'snorkel, dodik seti, LED stop lambası ve sis farları'},
'isuzu-dmax':{name:'Isuzu D-Max',kasa:'',re:/(d ?-?max|isuzu)/,items:'snorkel, panjur, tampon ve LED stop lambaları'},
'mercedes-x-class':{name:'Mercedes X-Class',kasa:'',re:/(x ?-?class)/,items:'diferansiyel kilidi, ön panjur ve dodik seti'},
'nissan-navara':{name:'Nissan Navara',kasa:'',re:/(navara|np ?300)/,items:'diferansiyel kilidi, snorkel, panjur, body kit ve dodik seti'},
'jeep':{name:'Jeep',kasa:'',re:/(jeep|wrangler|gladiator)/,items:'panjur, snorkel, tampon ve vinç'},
'bmw':{name:'BMW',kasa:'',re:/(\bbmw\b|\b[1-8] ?serisi\b|\bx[1-7]\b)/,items:'fren, motor, ateşleme, soğutma, filtre ve süspansiyon parçaları; Bosch, Mahle, NGK ve Delphi gibi OEM üretici markalarıyla'},
'jaguar':{name:'Jaguar',kasa:'',re:/(jaguar|\bxf\b|\bxe\b|\bxj\b|\bxk\b|[efi] ?-?pace|s ?-?type|x ?-?type|f ?-?type)/,items:'süspansiyon, fren, motor, soğutma ve kaporta parçaları; orijinal Jaguar ve Lemförder, Bosch, Brembo gibi OEM üretici seçenekleriyle'},
'mini':{name:'Mini',kasa:'',re:/(\bmini\b|cooper)/,items:'fren, motor ve filtre parçaları; Bosch, NGK ve Delphi gibi OEM üretici markalarıyla'}
};
Object.keys(MODELS).forEach(k=>(MODELS[k].key=k));
const GROUPS=[
['bodykit',/(body ?kit|facelift|donusum|makyaj|\bsvo?\b|autobiography|black edition)/,'body kit ve facelift'],
['basamak',/(basamak|marspiyel)/,'yan basamak'],
['logo',/(yazi|logo|arma|amblem)/,'orijinal logo ve yazılar'],
['offroad',/(snorkel|vinc|diferansiyel|dif kilidi|tavan sepeti|off ?-?road|ceki demir|tente|kamp)/,'off-road ekipman'],
['fren',/(fren|balata|disk|kaliper|\babs\b)/,'fren parçaları'],
['motor',/(motor|turbo|enjektor|triger|conta|\begr\b|takoz|buji)/,'motor parçaları'],
['suspansiyon',/(suspansiyon|kompresor|amortisor|hava korugu|salincak|rotil|\brot\b|rulman|aks\b)/,'süspansiyon parçaları'],
['filtre',/(filtre|bakim|\byag\b)/,'filtre ve bakım parçaları'],
['sogutma',/(radyator|termostat|su pompa|devirdaim|intercooler|klima|\bfan\b)/,'soğutma ve klima parçaları'],
['aydinlatma',/(\bfar\b|farlar|stop lamba|lamba|\bled\b|ledli|xenon|sis far)/,'far ve aydınlatma'],
['elektrik',/(sensor|modul|alternator|\bmars\b|\baku\b|kamera)/,'elektrik ve sensör parçaları'],
['aktarma',/(sanziman|vites|\bsaft\b|transfer|debriyaj)/,'şanzıman ve aktarma parçaları'],
['kaporta',/(panjur|tampon|ayna|kaput|dodik|camurluk|izgara)/,'kaporta ve dış trim'],
['jant',/(jant|lastik)/,'jant ve lastik']
].map(([key,re,label])=>({key,re,label}));
const EQUIP={
dif:{label:'Diferansiyel kilidi',name:/D[İI]FERANS[İI]YEL|HAVALI K[İI]L[İI]T/,kw:/(diferansiyel|dif kilidi|havali kilit)/},
snorkel:{label:'Snorkel',name:/SNORKEL|ŞNORKEL/,kw:/snorkel/},
vinc:{label:'Vinç ve kurtarma',name:/V[İI]NÇ|HALAT|KURTARMA|SAPAN|KR[İI]KO/,kw:/(vinc|halat|kurtarma|kriko)/},
panjur:{label:'Panjur ve tampon',name:/PANJUR|TAMPON|IZGARA/,kw:/(panjur|tampon|izgara)/},
isik:{label:'Far ve LED stop',name:/\bFAR|STOP|LED|S[İI]S (FAR|LAMBA)/,kw:/(\bfar\b|stop|\bled\b|sis)/},
dodik:{label:'Dodik ve çamurluk',name:/DOD[İI]K|ÇAMURLUK/,kw:/(dodik|camurluk)/},
kamp:{label:'Kasa, tente ve kamp',name:/KASA|TENTE|KAMP|ROLL ?BAR|PORTBAGAJ|TAVAN/,kw:/(kasa|tente|kamp|roll ?bar|tavan)/}
};
const LP_OFFROAD_MODELS=['ford-ranger','toyota-hilux','mitsubishi-l200','vw-amarok','isuzu-dmax','mercedes-x-class','nissan-navara','jeep'];
const PAGES={
'land-rover-yedek-parca':{
list:'LP Land Rover yedek parça',
label:'lp_lr',
models:['rr-sport','rr-vogue','rr-velar','rr-evoque','discovery-sport','discovery-5','discovery-4','discovery-3','discovery-2','defender-new','defender-classic','freelander-2','freelander-1'],
chipAlias:{'discovery-4':['discovery-3','discovery-4'],'defender-classic':['defender-classic','defender-new']},
groups:['fren','suspansiyon','filtre','motor','sogutma','elektrik','aydinlatma','aktarma'],
kwGroups:['fren','suspansiyon','filtre','motor','sogutma','elektrik','aydinlatma','aktarma','kaporta'],
boost:/FREN D[İI]SK|BALATASI|F[İI]LTRES[İI]|MOTOR TAKOZ|AMORT[İI]S[ÖO]R(?! TAKOZ)|SU POMPAS|DEV[İI]RDA[İI]M POMPA|HAVA K[ÖO]R[ÜU]Ğ|KOMPRES[ÖO]R|TERMOSTAT|BUJ[İI]|TR[İI]GER|RADYAT[ÖO]R|SALINCAK|ROT[İI]L/,
exclude:/OR[İI]NG|STOP TAKOZ|CAM TAKOZ|KL[İI]PS|V[İI]DA|SOMUN|\bPUL\b|KEÇE|TAPA|KELEPÇE|AIRBAG|AİRBAG|M[ÜU]H[ÜU]R|ET[İI]KET|C[İI]VATA|CIVATA|BAĞLANTI|HORTUM|YIKAMA|BRAKET/,
minPrice:800,
n:12,
dki:{
h1:m=>(m?m.name:null),
eyebrow:(m,g)=>(m?m.name+(m.kasa?' · '+m.kasa:'')+(g?' · '+g.label:''):g?'Land Rover · '+g.label:null),
lead:(m,g)=>(m||g
?`${m?m.name+(m.kasa?' ('+m.kasa+')':''):'Range Rover, Discovery, Defender ve Freelander'} için ${g?g.label:'yedek parça'}: orijinal, OEM üretici ve muadil seçenekler, açık fiyatla. Parça numarasını yazın ya da şasi numaranızla uzmanımıza WhatsApp'tan doğrulatın.`
:null),
products:(m,g)=>(m||g?`${esc(m?m.name:'Land Rover')} <em>${esc(g?g.label:'parçaları')}</em>`:null)
}
},
'range-rover-body-kit':{
list:'LP Range Rover body kit',
label:'lp_bodykit',
models:['rr-vogue','rr-sport','rr-velar','rr-evoque','defender-new','discovery-5','discovery-sport'],
groups:['bodykit','basamak','kaporta','logo'],
kwGroups:['bodykit','basamak','kaporta','logo','aydinlatma'],
boost:/BODY|FACELIFT|DÖNÜŞÜM|PANJUR|BASAMAK|TAMPON SET|ÇITA SET|LİP|SPOILER|SPO[İI]LER/,
exclude:/BAĞLANTI|BRAKET|TRAVERS|KLİPS|KLIPS|V[İI]DA|CONTA|TESİSAT|TES[İI]SAT|SENS[ÖO]R|AMPUL|SİGORTA|KABLO|M[ÜU]H[ÜU]R|TAPA|DEMİRİ|LAMBA|S[İI]S\b|\bFAR\b/,
minPrice:4000,
preferHigh:true,
n:12,
offer:{
'rr-vogue':'body kit, facelift parçaları, panjur ve tampon setleri ile elektrikli yan basamak',
'rr-sport':'dönüşüm kitleri, elektrikli yan basamak, panjur ve tampon setleri',
'rr-velar':'elektrikli yan basamak, tampon ve dış trim parçaları',
'rr-evoque':'elektrikli yan basamak, tampon setleri ve dış trim parçaları',
'defender-new':'elektrikli yan basamak, LED ön tampon eki, tavan spoyleri ve dış aksesuarlar',
'discovery-5':'body kit ve elektrikli yan basamak',
'discovery-sport':'body kit ve elektrikli yan basamak'
},
dki:{
h1:m=>(m&&m.dat?m.dat:null),
eyebrow:(m,g)=>(m?m.name+(m.kasa?' · '+m.kasa:''):g?'Range Rover · '+g.label:null),
lead:(m,g,cfg)=>(m
?`${m.name} için ${cfg.offer[m.key]||'dönüşüm ve görünüm parçaları'}. Fiyatlar sayfada; aracınıza özel teklif ve uyumluluk için WhatsApp'tan yazın.`
:g?`Range Rover ve Defender için ${g.label}: fiyatlar sayfada, aracınıza özel teklif ve uyumluluk için WhatsApp'tan yazın.`:null),
products:(m,g)=>(m||g?`${esc(m?m.name:'Range Rover')} <em>${esc(g?g.label:'dönüşüm ve aksesuar')}</em>`:null)
}
},
'defender-aksesuar':{
list:'LP Defender aksesuar',
label:'lp_defender',
models:['defender-new','defender-classic'],
mix:[
{models:['defender-new'],groups:['offroad','basamak','kaporta','aydinlatma','ic','logo'],n:8,boost:/SNORKEL|BASAMAK|TAVAN|PANJUR|DOD[İI]K|ÇEK[İI]|SPO[İI]LER|LED|KOLÇAK|PASPAS|MERD[İI]VEN|TAMPON EK/},
{models:['defender-classic'],groups:['offroad','suspansiyon','motor','sogutma','fren','basamak'],n:4,boost:/D[İI]FERANS[İI]YEL|SNORKEL|BASAMAK|AMORT[İI]S|RADYAT|BALATA|YAY/}
],
perModel:{
'defender-new':{groups:['offroad','basamak','kaporta','aydinlatma','ic','logo'],boost:/SNORKEL|BASAMAK|TAVAN|PANJUR|DOD[İI]K|ÇEK[İI]|SPO[İI]LER|LED|KOLÇAK|PASPAS|MERD[İI]VEN|TAMPON EK/},
'defender-classic':{groups:['offroad','suspansiyon','motor','sogutma','fren','basamak','aktarma','kaporta'],boost:/D[İI]FERANS[İI]YEL|SNORKEL|BASAMAK|AMORT[İI]S|RADYAT|BALATA|YAY|TERMOSTAT/}
},
kwGroups:['offroad','basamak','kaporta','aydinlatma','ic','logo','fren','suspansiyon','motor','sogutma','aktarma','filtre'],
exclude:/V[İI]DA|KLİPS|KLIPS|SOMUN|CİVATA|C[İI]VATA|PUL\b|M[ÜU]H[ÜU]R|TAPA\b/,
minPrice:600,
n:12,
lead:{
'defender-new':'Yeni Defender (L663) için elektrikli yan basamak, snorkel, tavan sepeti ve bar, çeki demiri, LED ön tampon eki, dodik seti ve iç aksesuarlar. Stoktaki ürünlerde 15.00\'e kadar siparişte aynı gün kargo; uyum için şasi numaranızla WhatsApp\'tan sorun.',
'defender-classic':'Defender 90 / 110 (1987–2016) için motor, süspansiyon, soğutma, fren ve kaporta parçaları ile diferansiyel kilidi ve snorkel gibi off-road ekipman. Orijinal, OEM üretici ve muadil seçenekler, açık fiyatla.'
},
dki:{
h1:m=>(m?m.name:null),
eyebrow:(m,g)=>(m?m.name+' · '+m.kasa+(g?' · '+g.label:''):g?'Defender · '+g.label:null),
lead:(m,g,cfg)=>(m?cfg.lead[m.key]:g?`Yeni ve klasik Defender için ${g.label}: stoktaki ürünlerde 15.00'e kadar siparişte aynı gün kargo, uyum için şasi numaranızla WhatsApp'tan sorun.`:null),
products:(m,g)=>(m||g?`${esc(m?m.name:'Defender')} <em>${esc(g?g.label:(m&&m.key==='defender-classic'?'parça ve ekipman':'aksesuarları'))}</em>`:null)
}
},
'off-road-aksesuar':{
list:'LP Off-road aksesuar',
label:'lp_offroad',
models:LP_OFFROAD_MODELS,
includeUnmodeled:['offroad'],
groups:['offroad','kaporta','aydinlatma','bodykit'],
kwGroups:['offroad','kaporta','aydinlatma','bodykit'],
boost:/D[İI]FERANS[İI]YEL|SNORKEL|ŞNORKEL|V[İI]NÇ|PANJUR|TAMPON|BODY ?K[İI]T|ROLL ?BAR|TENTE|DOD[İI]K/,
exclude:/V[İI]DA|KLİPS|KLIPS|SOMUN|AMPUL|SİGORTA|KABLO|RANGE ROVER|FRLD|FREELANDER|D[İI]SCOVERY|DEFENDER|EVOQUE|\bLR\d{5,}/,
minPrice:1500,
bucketBy:'model',
n:12,
dki:{
h1:m=>(m?m.name:null),
eyebrow:(m,g,cfg,eq)=>(eq?eq.label+' · '+(m?m.name:'Pickup ve 4x4'):m?m.name+(m.kasa?' · '+m.kasa:'')+' · off-road':null),
lead:(m,g,cfg,eq)=>{
if(!m&&!eq)return null;
if(eq&&!m)return`${eq.label}: Ranger, Hilux, L200, Amarok, D-Max ve Navara için uyumlu ürünler; ROCAS, ARB ve Terrafirma dahil. Aracınızı seçin, uyumlu ürünleri görün; stoktaki ürünlerde 15.00'e kadar siparişte aynı gün kargo.`;
return`${m.name} için ${m.items||'off-road aksesuar ve ekipman'}. Aracınıza uyan ürünleri aşağıda görün; emin değilseniz WhatsApp'tan sorun, stoktaki ürünlerde 15.00'e kadar siparişte aynı gün kargo.`;
},
products:(m,g,cfg,eq)=>(m||eq?`${esc(m?m.name:'Pickup ve 4x4')} <em>${esc(eq?eq.label.toLocaleLowerCase('tr-TR'):'off-road aksesuar')}</em>`:null)
}
}
};
PAGES['jaguar-bmw-yedek-parca']={
list:'LP Jaguar BMW Mini',
label:'lp_jbm',
models:['bmw','jaguar','mini'],
groups:['fren','suspansiyon','motor','sogutma','filtre','elektrik'],
kwGroups:['fren','suspansiyon','motor','sogutma','filtre','elektrik','aktarma','kaporta','aydinlatma'],
boost:/BALATA|D[İI]SK|F[İI]LTRE|BOB[İI]N|BUJ[İI]|SALINCAK|AMORT[İI]S|RADYAT|TERMOSTAT|POMPA|SENS[ÖO]R/,
exclude:/TERMOS|LOGOLU|ANAHTARLIK|HED[İI]YE|RANGE|\bRR|R\.R|FRLD|FREELANDER|EVOQUE|D[İI]SCOVERY|D[İI]S\.|VELAR|DEFENDER|N\.R\.R/,
minPrice:300,
bucketBy:'model',
n:12,
dki:{
h1:m=>(m?m.name:null),
eyebrow:(m,g)=>(m?m.name+(g?' · '+g.label:' · yedek parça'):g?'Jaguar · BMW · Mini · '+g.label:null),
lead:(m,g)=>(m
?`${m.name} için ${g?g.label+(m.key==='jaguar'?': orijinal ve OEM üretici seçenekler':': OEM üretici seçenekler'):m.items}, açık fiyatla. Parça numarasıyla arayın ya da şasi numaranızla WhatsApp'tan sorun.`
:g?`Jaguar, BMW ve Mini için ${g.label}: Jaguar'da orijinal, BMW ve Mini'de OEM üretici seçenekler, açık fiyatla. Parça numarasıyla arayın ya da şasi numaranızla WhatsApp'tan sorun.`:null),
products:(m,g)=>(m||g?`${esc(m?m.name:'Jaguar, BMW ve Mini')} <em>${esc(g?g.label:'parçaları')}</em>`:null)
}
};
const CODE_RE=/^(?=.*\d)[a-z]{0,5}[\s.-]?\d[\d\s.-]{3,}[a-z0-9]*$|^[a-z]{2,5}\d{4,}[a-z0-9]*$/i;
function looksLikeCode(s){
const t=String(s||'').trim();
return t.length>=5&&t.length<=24&&/\d{4,}/.test(t.replace(/[\s.-]/g,''))&&CODE_RE.test(t);
}
function catalogUrl(m,g,eq){
const q=new URLSearchParams();
if(m)q.set('model',m.key);
if(g)q.set('grup',g.key);
else if(eq&&page==='off-road-aksesuar')q.set('grup','offroad');
q.set('stok','1');
return'/dky/urunler.html?'+q.toString();
}
$$('[data-store-path]').forEach(a=>{
const base=String((W.DKY_CONFIG||{}).storeUrl||'https://www.dkyautoparts.com').replace(/\/$/,'');
a.href=base+a.getAttribute('data-store-path');
});
if(page==='tesekkurler'){initThanks();return;}
const cfg=PAGES[page];
if(!cfg)return;
const allowed=new Set(cfg.models);
const pm=(params.get('model')||'').trim().toLowerCase();
const term=params.get('kw')||params.get('q')||params.get('utm_term')||params.get('keyword')||'';
const nterm=norm(term).replace(/[+_]/g,' ').slice(0,120);
let dModel=allowed.has(pm)?MODELS[pm]:null;
let dGroup=null,dEquip=null,dCode='';
if(nterm){
if(!dModel){
const order=cfg.models.slice().sort((a,b)=>(/sport|new/.test(b)?1:0)-(/sport|new/.test(a)?1:0));
const hit=order.find(k=>MODELS[k]&&MODELS[k].re.test(nterm));
if(hit)dModel=MODELS[hit];
}
if(page==='off-road-aksesuar'){
const ek=Object.keys(EQUIP).find(k=>EQUIP[k].kw.test(nterm));
if(ek)dEquip=Object.assign({key:ek},EQUIP[ek]);
}
if(!dEquip){
const g=GROUPS.find(x=>x.re.test(nterm));
if(g&&(cfg.kwGroups||[]).includes(g.key))dGroup=g;
}
if(D.querySelector('[data-code-form]')&&looksLikeCode(term))dCode=term.trim().slice(0,24);
}
const pg=(params.get('grup')||'').trim();
if(!dGroup&&pg&&(cfg.kwGroups||[]).includes(pg))dGroup=GROUPS.find(x=>x.key===pg)||null;
const pe=(params.get('ekipman')||'').trim();
if(!dEquip&&page==='off-road-aksesuar'&&EQUIP[pe])dEquip=Object.assign({key:pe},EQUIP[pe]);
function applyDki(){
const set=(key,val,html)=>{
if(val==null)return;
$$(`[data-dki="${key}"]`).forEach(el=>{if(html)el.innerHTML=val;else el.textContent=val;});
};
set('h1',cfg.dki.h1(dModel,dGroup,cfg,dEquip));
set('eyebrow',cfg.dki.eyebrow(dModel,dGroup,cfg,dEquip));
set('lead',cfg.dki.lead(dModel,dGroup,cfg,dEquip));
set('products',cfg.dki.products(dModel,dGroup,cfg,dEquip),true);
if(dCode){
const eb=$('[data-dki="eyebrow"]');
if(eb)eb.textContent='Parça no: '+dCode.toLocaleUpperCase('tr-TR');
}
if(dModel){
$$('form[data-lead-form] select[name="arac"]').forEach(sel=>{
if([...sel.options].some(o=>o.value===dModel.key))sel.value=dModel.key;
});
}
if(dCode){
$$('form[data-lead-form] input[name="parca"]').forEach(inp=>{if(!inp.value)inp.value=dCode;});
}
if(dModel){
$$('[data-wa]').forEach(a=>{
const t=a.getAttribute('data-wa')||'';
if(/Araç \/ model: $/m.test(t))a.setAttribute('data-wa',t.replace(/Araç \/ model: $/m,'Araç / model: '+dModel.name));
});
if(DKY.bindWa)DKY.bindWa();
}
if(dModel||dGroup||dEquip||dCode){
track('lp_personalize',{lp:page,model:dModel?dModel.key:'',group:dGroup?dGroup.key:'',equipment:dEquip?dEquip.key:'',code:dCode?'yes':''});
}
}
const COLOR=/\b(S[İI]YAH|GR[İI]|GOLD|KAHVERENG[İI]|BEYAZ|KIRMIZI|PARLAK|MAT|SAĞ|SOL|SAG|ÖN|ARKA|BEJ|KROM|GÜMÜŞ|FÜME)\b/g;
const nameKey=p=>String(p.name).toLocaleUpperCase('tr-TR').replace(COLOR,' ').replace(/[^A-Z0-9ÇĞİÖŞÜ ]/g,' ').split(/\s+/).filter(Boolean).slice(0,5).join(' ');
const QSCORE={orijinal:12,oem:10,aksesuar:8,muadil:5};
const TM_L='[^A-ZÇĞİÖŞÜ0-9]';
const TM_MARK=new RegExp(`(^|${TM_L})(LOGO(LU|SU)?|YAZI(LI|SI)?|ARMA(LI|SI)?|AMBLEM(L[İI]|[İI])?)(${TM_L}|$)`);
const TM_TRIM=new RegExp(`(^|${TM_L})(SVR|SVO|SV|AUTOBIOGRAPHY|BLACK EDITION|SUPERCHARGED|RAPTOR|TRD|NISMO|WILDTRAK|AMG|M ?SPORT|M PERFORMANCE)(${TM_L}|$)`);
function tmRisk(p){
if(DKY.quality&&(DKY.quality(p)||{}).key==='orijinal')return false;
const n=String(p.name||'').toLocaleUpperCase('tr-TR');
return p.group==='logo'||TM_MARK.test(n)||TM_TRIM.test(n);
}
function score(p,boost,preferHigh){
let s=0;
if(boost&&boost.test(p.name))s+=30;
const q=DKY.quality?DKY.quality(p):null;
if(q)s+=QSCORE[q.key]||0;
s+=Math.min(p.stock||0,20)/2;
if(preferHigh)s+=Math.log10(Math.max(p.price,1))*6;
if(p.discount>=5)s+=3;
return s;
}
function pool(cat,o){
const models=o.models&&o.models.length?new Set(o.models):null;
const groups=o.groups&&o.groups.length?new Set(o.groups):null;
const unmodeled=o.includeUnmodeled?new Set(o.includeUnmodeled):null;
return cat.products.filter(p=>{
if(!p.inStock||!p.image||!(p.price>0))return false;
if(tmRisk(p))return false;
if(o.minPrice&&p.price<o.minPrice)return false;
if(models&&!p.models.some(m=>models.has(m))&&!(unmodeled&&!p.models.length&&unmodeled.has(p.group)))return false;
if(groups&&!groups.has(p.group))return false;
if(o.exclude&&o.exclude.test(p.name))return false;
if(o.nameRe&&!o.nameRe.test(p.name))return false;
if(o.quality&&(!DKY.quality||(DKY.quality(p)||{}).key!==o.quality))return false;
return true;
});
}
function diversify(list,n,bucketBy,boost,preferHigh,limitKinds=true){
const scored=list.map(p=>[score(p,boost,preferHigh),p]).sort((a,b)=>b[0]-a[0]);
const seen=new Set();
const kinds=new Map();
const buckets=new Map();
for(const[,p]of scored){
const k=nameKey(p);
if(seen.has(k))continue;
const kind=k.split(' ').slice(0,2).join(' ');
if(limitKinds&&(kinds.get(kind)||0)>=2)continue;
seen.add(k);
kinds.set(kind,(kinds.get(kind)||0)+1);
const b=bucketBy==='model'?(p.models[0]||'genel'):p.group;
if(!buckets.has(b))buckets.set(b,[]);
buckets.get(b).push(p);
}
const out=[];
const lists=[...buckets.values()];
let i=0;
while(out.length<n&&lists.some(l=>l.length)){
const l=lists[i%lists.length];
if(l.length)out.push(l.shift());
i++;
}
return out;
}
function preferBoosted(list,boost,n){
if(!boost)return list;
const b=list.filter(p=>boost.test(p.name));
return b.length>=n?b:list;
}
function pick(cat,state){
const base={exclude:cfg.exclude,minPrice:cfg.minPrice,includeUnmodeled:cfg.includeUnmodeled,quality:state.quality};
const n=cfg.n||12;
const eqRe=state.equip?state.equip.name:null;
const models=state.model?(cfg.chipAlias&&cfg.chipAlias[state.model])||[state.model]:null;
if(models)base.includeUnmodeled=null;
if(cfg.mix&&!models&&!state.group&&!eqRe&&!state.quality){
let out=[];
cfg.mix.forEach(mx=>{out=out.concat(diversify(preferBoosted(pool(cat,Object.assign({},base,mx)),mx.boost,mx.n),mx.n,'group',mx.boost));});
return out;
}
const per=models&&cfg.perModel?cfg.perModel[models[0]]:null;
const tries=[
{models:models||cfg.models,groups:state.group?[state.group]:(per?per.groups:cfg.groups),nameRe:eqRe},
{models:models||cfg.models,groups:state.group?[state.group]:null,nameRe:eqRe},
{models:models||cfg.models,groups:null,nameRe:eqRe,minPrice:0},
{models:models||cfg.models,groups:null,nameRe:null}
];
let best=null;
for(const t of tries){
if(eqRe&&!t.nameRe)break;
const o=Object.assign({},base,t);
if(t.minPrice===0)o.minPrice=0;
const list=pool(cat,o);
if(list.length>=4){best=list;break;}
if(!best||list.length>best.length)best=list;
}
if(!best||!best.length)return[];
const bucket=models?'group':(state.group||eqRe?'model':(cfg.bucketBy||'group'));
const boost=(per&&per.boost)||cfg.boost;
return diversify(preferBoosted(best,boost,n),n,bucket,boost,cfg.preferHigh,!state.group&&!eqRe&&!state.quality);
}
const grid=$('[data-showcase]');
const state={model:dModel&&$(`[data-chip="${dModel.key}"]`)?dModel.key:'',group:dGroup?dGroup.key:'',equip:dEquip,quality:''};
if(!state.model&&dModel&&cfg.chipAlias){
const alias=Object.keys(cfg.chipAlias).find(k=>cfg.chipAlias[k].includes(dModel.key));
if(alias)state.model=alias;
}
if(!state.model&&dModel)state.model=dModel.key;
let catP=null;
let listViewed=false;
const loadCat=()=>(catP=catP||(DKY.loadCatalog?DKY.loadCatalog():Promise.reject(new Error('katalog yok'))));
function syncChips(){
$$('[data-chip]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.chip||'')===(state.model||''))));
$$('[data-filter-quality]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filterQuality===state.quality)));
$$('[data-filter-equip]').forEach(b=>b.setAttribute('aria-pressed',String(!!state.equip&&b.dataset.filterEquip===state.equip.key)));
$$('[data-filter-model]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filterModel===state.model)));
}
function render(){
if(!grid)return;
syncChips();
grid.setAttribute('aria-busy','true');
loadCat().then(cat=>{
const items=pick(cat,state);
const m=state.model?MODELS[state.model]:null;
const g=state.group?GROUPS.find(x=>x.key===state.group):null;
$$('[data-catalog-link]').forEach(a=>{a.href=catalogUrl(m,g,state.equip);});
if(!items.length){
grid.innerHTML=`<div class="lp-products__msg"><strong>Bu seçim için stokta ürün görünmüyor.</strong><span>Katalog dışındaki parçalar için de bize yazın; şasi numaranızla uygun parçayı birlikte bulalım.</span><a class="btn btn--wa btn--sm" href="#" data-wa="Merhaba, ${esc(m?m.name+' için ':'')}parça arıyorum.&#10;Şasi (VIN) no: " data-track="whatsapp_click" data-track-label="${esc(cfg.label)}_empty">${ICON('whatsapp')}WhatsApp'tan sor</a></div>`;
if(DKY.bindWa)DKY.bindWa(grid);
}else{
grid.innerHTML=items.map(p=>DKY.card(p)).join('');
}
[...grid.children].forEach((c,i)=>c.style.setProperty('--i',String(Math.min(i,11))));
grid.classList.remove('lp-stagger');
void grid.offsetWidth;
grid.classList.add('lp-stagger');
grid.setAttribute('aria-busy','false');
if(DKY.observe)DKY.observe(grid);
const tag=[state.model,state.group,state.equip&&state.equip.key,state.quality].filter(Boolean).join('|')||'varsayilan';
if(!listViewed||tag!=='varsayilan'){
listViewed=true;
track('view_item_list',{
item_list_name:cfg.list,filter:tag.slice(0,100),
items:items.slice(0,12).map((p,i)=>({item_id:String(p.id),item_name:String(p.name).slice(0,100),item_brand:p.brand,price:p.price,index:i}))
});
}
}).catch(()=>{
grid.setAttribute('aria-busy','false');
grid.innerHTML=`<div class="lp-products__msg"><strong>Ürünler şu anda yüklenemedi.</strong><span>Sayfayı yenileyin ya da aradığınız parçayı doğrudan sorun.</span><a class="btn btn--wa btn--sm" href="#" data-wa="Merhaba, parça arıyorum." data-track="whatsapp_click" data-track-label="${esc(cfg.label)}_error">${ICON('whatsapp')}WhatsApp'tan sor</a></div>`;
if(DKY.bindWa)DKY.bindWa(grid);
});
}
function scrollToProducts(){
const sec=$('#urunler');
if(sec)sec.scrollIntoView({behavior:W.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
}
D.addEventListener('click',e=>{
const chip=e.target.closest('[data-chip]');
if(chip){
state.model=chip.dataset.chip||'';
state.quality='';
if(state.model&&DKY.garage&&MODELS[state.model]&&!cfg.chipAlias?.[state.model])DKY.garage.set(state.model);
render();
return;
}
const fq=e.target.closest('[data-filter-quality]');
if(fq){
state.quality=state.quality===fq.dataset.filterQuality?'':fq.dataset.filterQuality;
render();scrollToProducts();
track('lp_filter',{lp:page,quality:state.quality||'hepsi'});
return;
}
const fe=e.target.closest('[data-filter-equip]');
if(fe){
const k=fe.dataset.filterEquip;
state.equip=state.equip&&state.equip.key===k?null:Object.assign({key:k},EQUIP[k]);
render();scrollToProducts();
track('lp_filter',{lp:page,equipment:state.equip?k:'hepsi'});
return;
}
const fm=e.target.closest('[data-filter-model]');
if(fm){
state.model=fm.dataset.filterModel||'';
if(fm.hasAttribute('data-filter-group-set'))state.group=fm.getAttribute('data-filter-group-set')||'';
state.quality='';
if(state.model&&DKY.garage&&MODELS[state.model])DKY.garage.set(state.model);
track('lp_filter',{lp:page,model:state.model||'hepsi',group:state.group||'hepsi'});
render();scrollToProducts();
return;
}
const fg=e.target.closest('[data-filter-group]');
if(fg){
state.group=state.group===fg.dataset.filterGroup?'':fg.dataset.filterGroup;
render();scrollToProducts();
track('lp_filter',{lp:page,group:state.group||'hepsi'});
return;
}
const card=e.target.closest('[data-showcase] .p-card a');
if(card){
const btn=card.closest('.p-card').querySelector('[data-add-quote]');
track('select_item',{item_list_name:cfg.list,item_id:btn?btn.dataset.addQuote:''});
}
const sf=e.target.closest('[data-scroll-form]');
if(sf){
const f=$('#talep');
if(f){
e.preventDefault();
f.scrollIntoView({behavior:W.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
const first=f.querySelector('input:not([type=hidden]):not([tabindex="-1"]), select');
if(first)setTimeout(()=>first.focus({preventScroll:true}),450);
}
}
});
function fillCounts(cat){
const fmt=n=>n.toLocaleString('tr-TR');
$$('[data-count-model]').forEach(el=>{
const keys=el.dataset.countModel.split(',');
const n=cat.products.filter(p=>p.inStock&&p.models.some(m=>keys.includes(m))).length;
el.textContent=n?fmt(n)+' ürün stokta':'';
});
$$('[data-count-quality]').forEach(el=>{
const q=el.dataset.countQuality;
const ms=new Set(cfg.models);
const n=cat.products.filter(p=>p.inStock&&p.models.some(m=>ms.has(m))&&(DKY.quality(p)||{}).key===q).length;
el.textContent=n?fmt(n)+' ürün stokta':'';
});
$$('[data-count-equip]').forEach(el=>{
const e=EQUIP[el.dataset.countEquip];
const ms=new Set(cfg.models);
const n=e?cat.products.filter(p=>p.inStock&&e.name.test(p.name)&&(p.models.some(m=>ms.has(m))||(!p.models.length&&p.group==='offroad'))).length:0;
el.textContent=n?fmt(n)+' ürün':'';
});
$$('[data-count-group]').forEach(el=>{
const[models,group]=el.dataset.countGroup.split(':');
const ms=new Set(models.split(','));
const n=cat.products.filter(p=>p.inStock&&p.group===group&&p.models.some(m=>ms.has(m))&&!tmRisk(p)).length;
el.textContent=n?fmt(n)+' ürün stokta':'';
});
}
const codeForm=$('[data-code-form]');
const codeInput=$('[data-code-input]');
const codeBox=$('[data-code-results]');
let codeT=null;
function runCode(q){
if(!codeBox)return;
q=String(q||'').trim().slice(0,40);
if(q.length<3){codeBox.innerHTML='';return;}
codeBox.innerHTML='<p class="muted">Aranıyor…</p>';
loadCat().then(cat=>{
const hits=DKY.search(cat,q,{limit:6});
if(!hits.length){
codeBox.innerHTML=`<div class="search-empty"><strong>“${esc(q)}” katalogda görünmüyor.</strong><span class="muted">Numarayı uzmanımıza sorun; uygun parçayı ya da muadilini kontrol edip size dönelim.</span><a class="btn btn--wa btn--sm" href="#" data-wa="${esc('Merhaba, şu parça numarasını arıyorum: '+q+'\nAraç / model: \nŞasi (VIN) no: ')}" data-track="whatsapp_click" data-track-label="lp_code_empty">${ICON('whatsapp')}Bu numarayı WhatsApp'tan sor</a></div>`;
if(DKY.bindWa)DKY.bindWa(codeBox);
}else{
codeBox.innerHTML=hits.map(p=>`<a class="search-hit" href="${DKY.productUrl(p)}">
          <img src="${esc(DKY.img(p.image,120))}" alt="" width="64" height="64" loading="lazy">
          <span><span class="search-hit__name">${esc(DKY.title(p.name))}</span><br><span class="code-chip">${esc(p.code)}</span> <span class="muted" style="font-size:.8rem">· ${esc(p.brand)}</span></span>
          <span class="search-hit__price">${DKY.fmt(p.price)}<small class="${p.inStock?'':'is-out'}">${p.inStock?'Stokta':'Tedarik sorun'}</small></span></a>`).join('')+
`<a class="link-arrow" style="justify-self:start;margin-top:6px" href="/dky/urunler.html?q=${encodeURIComponent(q)}">Tüm sonuçlar${ICON('arrow')}</a>`;
}
track('search',{search_term:q,results:hits.length,source:page});
}).catch(()=>{codeBox.innerHTML='<p class="muted">Katalog yüklenemedi; sayfayı yenileyin.</p>';});
}
if(codeForm&&codeInput){
codeForm.addEventListener('submit',e=>{e.preventDefault();clearTimeout(codeT);runCode(codeInput.value);});
codeInput.addEventListener('input',()=>{clearTimeout(codeT);codeT=setTimeout(()=>runCode(codeInput.value),350);});
D.addEventListener('click',e=>{
const b=e.target.closest('[data-code-try]');
if(!b)return;
codeInput.value=b.dataset.codeTry;
runCode(codeInput.value);
});
if(dCode){codeInput.value=dCode;runCode(dCode);}
}
function start(){
applyDki();
syncChips();
let kicked=false;
const kick=()=>{
if(kicked)return;
kicked=true;
render();
loadCat().then(fillCounts).catch(()=>{});
};
if(dCode||state.model||state.group||state.equip){kick();return;}
const target=grid||$('#urunler');
if(target&&'IntersectionObserver'in W){
const io=new IntersectionObserver(en=>{if(en.some(x=>x.isIntersecting)){io.disconnect();kick();}},{rootMargin:'600px 0px'});
io.observe(target);
}else kick();
['pointerdown','keydown','scroll'].forEach(ev=>W.addEventListener(ev,function once(){W.removeEventListener(ev,once);setTimeout(kick,120);},{passive:true,once:true}));
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',start);
else start();
function initThanks(){
const form=(params.get('form')||'').toLowerCase().slice(0,60);
const kanal=params.get('kanal');
let wa=null;
try{wa=JSON.parse(sessionStorage.getItem('dky_lead_wa')||'null');}catch(e){wa=null;}
const VARIANTS=[
[/toptan|bayi|servis|kurumsal|b2b/,{title:'Toptan talebiniz <em>alındı</em>',text:'Servis ve toptan satış ekibimiz talebinizi inceleyip size dönüş yapacak. Parça listeniz hazırsa WhatsApp\'tan iletebilirsiniz; teklifi hızlandırır.'}],
[/iletisim|contact|mesaj/,{title:'Mesajınız bize <em>ulaştı</em>',text:'En kısa sürede size dönüş yapacağız. Acil bir parça ihtiyacınız varsa WhatsApp\'tan yazabilir ya da arayabilirsiniz.'}],
[/vin|sasi|şasi/,{title:'Şasi numaranız <em>alındı</em>',text:'Parça uzmanımız şasi (VIN) numaranıza göre uyumlu parçaları kontrol edip fiyat ve stok bilgisiyle size dönecek.'}],
[/body|kit|donusum|facelift|teklif/,{title:'Teklif talebiniz <em>alındı</em>',text:'Aracınıza özel fiyat ve uyumluluk bilgisini hazırlayıp size ileteceğiz. Aracınızın fotoğrafını WhatsApp\'tan göndermeniz süreci hızlandırır.'}],
[/defender|offroad|off-road|aksesuar/,{title:'Aksesuar talebiniz <em>alındı</em>',text:'Parça uzmanımız aracınıza uyan ürünleri fiyat ve stok bilgisiyle size iletecek. Şasi numaranızı WhatsApp\'tan gönderirseniz uyumu daha hızlı doğrularız.'}],
[/./,{title:'Parça talebiniz <em>alındı</em>',text:'Parça uzmanımız talebinizi inceleyip fiyat ve stok bilgisiyle size dönüş yapacak. Şasi (VIN) numaranızı WhatsApp\'tan gönderirseniz uyumu daha hızlı doğrularız.'}]
];
const v=(VARIANTS.find(([re])=>re.test(form||'parca'))||VARIANTS[VARIANTS.length-1])[1];
const t=$('[data-ty-title]'),p=$('[data-ty-text]'),al=$('[data-ty-alert]');
if(t)t.innerHTML=v.title;
if(p)p.textContent=v.text;
if(kanal==='whatsapp'&&al){
al.hidden=false;
const s=al.querySelector('span');
if(s)s.textContent=wa&&wa.popup===false
?'WhatsApp penceresi açılamadı. Talebinizi iletmek için aşağıdaki "WhatsApp\'tan devam et" düğmesine dokunun.'
:'Talebiniz WhatsApp\'ta hazır mesaj olarak açıldı. Mesajı göndermeyi unutmayın; pencere açılmadıysa aşağıdaki düğmeyi kullanın.';
}
const text=(wa&&wa.text)||'Merhaba, web sitenizden talep oluşturdum.';
$$('[data-ty-wa]').forEach(a=>{
a.setAttribute('data-wa',text);
});
if(DKY.bindWa)DKY.bindWa();
}
})();
