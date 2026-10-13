(function(){
'use strict';
var w=window,d=document;
var C=w.DKY_CONFIG||{};
var DKY=(w.DKY=w.DKY||{});
if(DKY.__formReady)return;
DKY.__formReady=true;
var PENDING_KEY='dky_lead_pending';
var WA_KEY='dky_lead_wa';
var LOADED_AT=Date.now();
var PHONE_NAMES=/^(telefon|phone|tel|gsm|cep)$/i;
var SKIP_IN_MSG={kvkk:1,website:1,_gotcha:1,access_key:1};
function track(name,params){return DKY.track?DKY.track(name,params):Promise.resolve(false);}
function haptic(pattern){try{if(navigator.vibrate&&!w.matchMedia('(prefers-reduced-motion: reduce)').matches)navigator.vibrate(pattern);}catch(e){}}
function shake(el){if(!el)return;el.classList.remove('lf-shake');void el.offsetWidth;el.classList.add('lf-shake');setTimeout(function(){el.classList.remove('lf-shake');},400);}
function uid(){
try{if(w.crypto&&crypto.randomUUID)return crypto.randomUUID();}catch(e){}
return'l'+Date.now().toString(36)+Math.random().toString(36).slice(2,10);
}
function ss(){try{var s=w.sessionStorage;s.setItem('__dky','1');s.removeItem('__dky');return s;}catch(e){return null;}}
if(!d.getElementById('dky-form-css')){
var st=d.createElement('style');
st.id='dky-form-css';
st.textContent=
'.lf-hp{position:absolute!important;left:-10000px!important;top:auto!important;width:1px!important;height:1px!important;overflow:hidden!important}'+
'.lf-spin{width:18px;height:18px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:lf-spin .7s linear infinite;flex:none;display:inline-block}'+
'@keyframes lf-spin{to{transform:rotate(360deg)}}'+
'.btn.is-loading{cursor:progress;opacity:.9}'+
'.form-status a{text-decoration:underline;font-weight:600}'+
'.form-status .btn{margin-top:10px}'+
'@media (prefers-reduced-motion:no-preference){.lf-shake{animation:lf-shake .36s cubic-bezier(.36,.07,.19,.97)}}'+
'@keyframes lf-shake{20%,60%{transform:translateX(-4px)}40%,80%{transform:translateX(4px)}}';
d.head.appendChild(st);
}
function parsePhone(raw){
var s=String(raw||'').trim();
if(!s)return null;
var plus=s.charAt(0)==='+';
var dg=s.replace(/\D/g,'');
if(!plus&&dg.indexOf('00')===0){dg=dg.slice(2);plus=true;}
var national=null;
if(plus){
if(dg.indexOf('90')===0)national=dg.slice(2);
else return/^[1-9]\d{7,14}$/.test(dg)?{e164:'+'+dg,display:'+'+dg,tr:false}:null;
}else if(dg.length===12&&dg.indexOf('90')===0)national=dg.slice(2);
else if(dg.length===11&&dg.charAt(0)==='0')national=dg.slice(1);
else if(dg.length===10)national=dg;
if(!national||!/^(5\d{9}|[234]\d{9}|850\d{7})$/.test(national))return null;
var n=national;
return{e164:'+90'+n,display:'0'+n.slice(0,3)+' '+n.slice(3,6)+' '+n.slice(6,8)+' '+n.slice(8),tr:true,mobile:n.charAt(0)==='5'};
}
DKY.parsePhone=parsePhone;
function isPhoneField(el){return el.type==='tel'||PHONE_NAMES.test(el.name||'');}
function wrapperOf(el){return el.closest('.field')||el.closest('.check')||el.parentElement;}
function labelOf(el){
if(el.dataset&&el.dataset.label)return el.dataset.label;
var lab=null;
if(el.id)lab=el.form&&el.form.querySelector('label[for="'+(w.CSS&&CSS.escape?CSS.escape(el.id):el.id)+'"]');
if(!lab)lab=el.closest('label');
var t=lab?lab.textContent:(el.getAttribute('aria-label')||el.placeholder||el.name||'');
return t.replace(/\*/g,'').replace(/\((isteğe bağlı|opsiyonel|zorunlu)\)/gi,'').replace(/\s+/g,' ').trim();
}
function fieldsOf(form){
return[].filter.call(form.elements,function(el){
return el.name&&!el.disabled&&!/^(submit|button|reset|fieldset|file)$/i.test(el.type||'')&&!el.closest('.lf-hp');
});
}
function errorEl(el){
var wrap=wrapperOf(el);
if(!wrap)return null;
var host=el.closest('.field')||wrap;
var err=host.querySelector('.field__error');
if(!err){
err=d.createElement('p');
err.className='field__error';
if(host===wrap&&wrap.classList.contains('check'))wrap.insertAdjacentElement('afterend',err);
else host.appendChild(err);
}
if(!err.id)err.id='err-'+(el.id||el.name)+'-'+Math.random().toString(36).slice(2,6);
return err;
}
function setError(el,msg){
var host=el.closest('.field')||wrapperOf(el);
var err=errorEl(el);
if(msg){
if(host)host.classList.add('is-invalid');
if(err){err.textContent=msg;err.style.display='block';}
el.setAttribute('aria-invalid','true');
if(err){
var ids=(el.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);
if(ids.indexOf(err.id)<0){ids.push(err.id);el.setAttribute('aria-describedby',ids.join(' '));}
}
}else{
if(host)host.classList.remove('is-invalid');
if(err){err.textContent='';err.style.display='';}
el.removeAttribute('aria-invalid');
}
}
var EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function validate(el){
var v=el.type==='checkbox'?el.checked:String(el.value||'').trim();
var custom=el.getAttribute('data-error');
var name=(el.name||'').toLowerCase();
var req=el.required;
if(el.type==='checkbox'){
if(req&&!v)return custom||(name==='kvkk'?'Devam etmek için KVKK aydınlatma metnini okuduğunuzu onaylayın.':'Devam etmek için bu kutuyu işaretleyin.');
return'';
}
if(el.type==='radio'){
if(!req)return'';
var group=el.form?el.form.querySelectorAll('input[type="radio"][name="'+el.name+'"]'):[el];
return[].some.call(group,function(r){return r.checked;})?'':(custom||'Lütfen bir seçenek işaretleyin.');
}
if(!v){
if(!req)return'';
if(custom)return custom;
if(isPhoneField(el))return'Size ulaşabilmemiz için telefon numaranızı yazın.';
if(/^(ad|adsoyad|ad_soyad|isim|name|fullname)$/.test(name))return'Lütfen adınızı yazın.';
if(el.tagName==='SELECT')return'Lütfen listeden bir seçim yapın.';
if(el.type==='email')return'E-posta adresinizi yazın.';
return'Bu alan zorunludur.';
}
if(isPhoneField(el)&&!parsePhone(v))return custom||'Telefon numarası geçersiz görünüyor. Örnek: 0532 123 45 67 ya da +90 532 123 45 67';
if(el.type==='email'&&!EMAIL_RE.test(v))return custom||'Geçerli bir e-posta adresi yazın (ör. ad@ornek.com).';
if(/^(ad|adsoyad|ad_soyad|isim|name|fullname)$/.test(name)&&v.replace(/[^A-Za-zÇĞİÖŞÜçğıöşü]/g,'').length<2)return custom||'Adınız en az 2 harf olmalı.';
var min=Number(el.getAttribute('minlength')||0);
if(min&&v.length<min)return custom||('En az '+min+' karakter yazın.');
var pat=el.getAttribute('pattern');
if(pat){try{if(!new RegExp('^(?:'+pat+')$').test(v))return custom||'Biçim geçersiz.';}catch(e){}}
return'';
}
function collect(form){
var data={},rows=[];
fieldsOf(form).forEach(function(el){
if((el.type==='radio')&&!el.checked)return;
var key=el.name,val;
if(el.type==='checkbox'){
if(key==='kvkk'){data.kvkk_onay=el.checked?'evet':'hayır';return;}
val=el.checked?(el.value&&el.value!=='on'?el.value:'Evet'):'';
}else if(el.tagName==='SELECT'){
val=el.value?(el.options[el.selectedIndex]||{}).text||el.value:'';
}else val=String(el.value||'').trim();
if(isPhoneField(el)&&val){var ph=parsePhone(val);if(ph)val=ph.e164;}
if(key in data&&val)data[key]+=', '+val;
else data[key]=val;
if(val&&!SKIP_IN_MSG[key]&&(el.type!=='hidden'||(el.dataset&&el.dataset.label))){
var display=isPhoneField(el)?(parsePhone(val)||{}).display||val:val;
rows.push({key:key,label:labelOf(el),value:display});
}
});
return{data:data,rows:rows};
}
function waMessage(form,rows){
var title=form.getAttribute('data-wa-title')||'Merhaba, web sitenizden talep formu gönderiyorum.';
var lines=rows.map(function(r){return r.label+': '+r.value;});
return title+'\n\n'+lines.join('\n')+'\n\nSayfa: '+location.origin+location.pathname;
}
function waLink(text){
return DKY.waLink?DKY.waLink(text):'https://wa.me/'+(C.whatsapp||'')+'?text='+encodeURIComponent(text);
}
function sha256(str){
try{
if(!w.crypto||!crypto.subtle||!w.TextEncoder)return Promise.resolve('');
return crypto.subtle.digest('SHA-256',new TextEncoder().encode(str)).then(function(buf){
return[].map.call(new Uint8Array(buf),function(b){return('0'+b.toString(16)).slice(-2);}).join('');
}).catch(function(){return'';});
}catch(e){return Promise.resolve('');}
}
function hashedUser(data){
var phone='',email='';
Object.keys(data).forEach(function(k){
var v=data[k];
if(!v)return;
if(!phone&&PHONE_NAMES.test(k)){var p=parsePhone(v);if(p)phone=p.e164;}
if(!email&&/^(email|eposta|e-posta|mail)$/i.test(k)&&EMAIL_RE.test(v))email=String(v).trim().toLowerCase();
});
return Promise.all([phone?sha256(phone):'',email?sha256(email):'']).then(function(h){
var u={};
if(h[0])u.sha256_phone_number=h[0];
if(h[1])u.sha256_email_address=h[1];
return Object.keys(u).length?u:null;
});
}
function post(endpoint,payload){
var target=endpoint,body={};
for(var k in payload)body[k]=payload[k];
try{
var u=new URL(endpoint,location.href);
var key=u.searchParams.get('access_key');
if(key){body.access_key=key;u.searchParams.delete('access_key');target=u.toString();}
}catch(e){}
var isGAS=/script\.google(usercontent)?\.com/i.test(target);
var ctrl=w.AbortController?new AbortController():null;
var timer=ctrl?setTimeout(function(){ctrl.abort();},15000):null;
return fetch(target,{
method:'POST',
headers:isGAS?{'Content-Type':'text/plain;charset=utf-8'}:{'Content-Type':'application/json','Accept':'application/json'},
body:JSON.stringify(body),
credentials:'omit',
signal:ctrl?ctrl.signal:undefined
}).then(function(res){
if(timer)clearTimeout(timer);
if(!res.ok)throw new Error('HTTP '+res.status);
return res.text().then(function(txt){
var j=null;
try{j=JSON.parse(txt);}catch(e){}
if(j&&(j.success===false||j.ok===false||j.result==='error'||j.error))throw new Error(String(j.message||j.error||'Gönderim reddedildi'));
return true;
});
},function(err){if(timer)clearTimeout(timer);throw err;});
}
function statusEl(form){
var s=form.querySelector('.form-status');
if(!s){
s=d.createElement('div');
s.className='form-status';
var btn=form.querySelector('[type="submit"]');
if(btn&&btn.parentNode)btn.parentNode.insertBefore(s,btn.nextSibling);
else form.appendChild(s);
}
s.setAttribute('role','status');
s.setAttribute('aria-live','polite');
return s;
}
function setStatus(form,kind,html){
var s=statusEl(form);
s.classList.remove('is-ok','is-err');
if(kind)s.classList.add(kind==='ok'?'is-ok':'is-err');
s.innerHTML=html||'';
}
function setLoading(form,on){
var btn=form.querySelector('[type="submit"]');
form.setAttribute('aria-busy',on?'true':'false');
if(!btn)return;
if(on){
if(!btn.dataset.idleHtml)btn.dataset.idleHtml=btn.innerHTML;
btn.disabled=true;
btn.classList.add('is-loading');
btn.innerHTML='<span class="lf-spin" aria-hidden="true"></span><span>Gönderiliyor…</span>';
}else{
btn.disabled=false;
btn.classList.remove('is-loading');
if(btn.dataset.idleHtml)btn.innerHTML=btn.dataset.idleHtml;
}
}
function thanksUrl(form,method){
var name=form.getAttribute('data-lead-form')||'form';
var base=form.getAttribute('data-success-url')||'/dky/tesekkurler.html';
var u=base+(base.indexOf('?')<0?'?':'&')+'form='+encodeURIComponent(name);
if(method==='whatsapp')u+='&kanal=whatsapp';
return u;
}
function vehicleOf(data){
var v=data.arac||data.model||data.vehicle||data.arac_modeli||'';
return String(v).slice(0,60);
}
function finish(form,ctx){
var name=form.getAttribute('data-lead-form')||'form';
var redirect=form.getAttribute('data-redirect')!=='false';
var attr=DKY.attributionParams?DKY.attributionParams():{};
var pending={form:name,method:ctx.method,id:ctx.leadId,ts:Date.now(),vehicle:vehicleOf(ctx.data),attr:attr,user:ctx.user||null};
var S=ss();
if(S){
try{
var short=ctx.rows.filter(function(r){return!PHONE_NAMES.test(r.key);}).map(function(r){return r.label+': '+r.value;}).join('\n');
S.setItem(WA_KEY,JSON.stringify({form:name,method:ctx.method,popup:ctx.popup!==false,text:'Merhaba, web sitenizdeki talep formunu doldurdum.\n\n'+short}));
}catch(e){}
}
form.dataset.state='done';
if(redirect&&S){
try{S.setItem(PENDING_KEY,JSON.stringify(pending));}catch(e){S=null;}
}
if(redirect&&S){
location.assign(thanksUrl(form,ctx.method));
return;
}
var p={form:name,method:ctx.method,event_id:ctx.leadId};
if(pending.vehicle)p.vehicle=pending.vehicle;
if(ctx.user)p._user=ctx.user;
track('generate_lead',p).then(function(){
if(redirect){location.assign(thanksUrl(form,ctx.method));return;}
setLoading(form,false);
var btn=form.querySelector('[type="submit"]');
if(btn)btn.disabled=true;
setStatus(form,'ok',ctx.method==='whatsapp'
?'Teşekkürler! WhatsApp penceresinde mesajınızı göndermeyi unutmayın.'
:'Teşekkürler! Talebiniz bize ulaştı; en kısa sürede size dönüş yapacağız.');
});
}
function onSubmit(e){
e.preventDefault();
var form=e.currentTarget;
var state=form.dataset.state;
if(state==='sending'||state==='done')return;
form.dataset.touched='1';
var name=form.getAttribute('data-lead-form')||'form';
var invalid=[];
var seenRadio={};
fieldsOf(form).forEach(function(el){
if(el.type==='hidden')return;
if(el.type==='radio'){if(seenRadio[el.name])return;seenRadio[el.name]=1;}
var msg=validate(el);
setError(el,msg);
if(msg)invalid.push(el);
});
if(invalid.length){
setStatus(form,'err',invalid.length===1?'Lütfen işaretli alanı kontrol edin.':'Lütfen işaretli '+invalid.length+' alanı kontrol edin.');
try{invalid[0].focus({preventScroll:false});}catch(err){invalid[0].focus();}
haptic([12,50,12]);
shake(form.querySelector('[type="submit"]'));
track('form_error',{form:name,fields:invalid.map(function(el){return el.name;}).join(',').slice(0,100)});
return;
}
setStatus(form,'','');
var hp=form.querySelector('.lf-hp input');
if((hp&&hp.value)||Date.now()-LOADED_AT<1500){
form.dataset.state='done';
setLoading(form,true);
setTimeout(function(){location.assign(thanksUrl(form,'endpoint')+'&b=1');},600);
return;
}
var col=collect(form);
var leadId=uid();
var ctx={leadId:leadId,data:col.data,rows:col.rows,method:'endpoint',user:null};
var msg=waMessage(form,col.rows);
form.dataset.state='sending';
setLoading(form,true);
haptic(15);
if(!C.formEndpoint){
ctx.method='whatsapp';
var win=null;
try{win=w.open(waLink(msg),'_blank');if(win)win.opener=null;}catch(err){win=null;}
ctx.popup=!!win;
hashedUser(col.data).then(function(u){ctx.user=u;finish(form,ctx);});
return;
}
var payload={};
Object.keys(col.data).forEach(function(k){payload[k]=col.data[k];});
payload.form=name;
payload.sayfa=location.origin+location.pathname;
payload.sayfa_basligi=d.title;
payload.referans=d.referrer||'';
payload.gonderim_zamani=new Date().toISOString();
payload.lead_id=leadId;
payload._subject='Web talebi: '+name;
var attr=DKY.attribution?DKY.attribution():null;
if(attr)['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','fbclid','landing'].forEach(function(k){if(attr[k])payload[k]=String(attr[k]).slice(0,200);});
payload.ozet=msg;
Promise.all([post(C.formEndpoint,payload),hashedUser(col.data)]).then(function(r){
ctx.user=r[1];
finish(form,ctx);
}).catch(function(err){
form.dataset.state='';
setLoading(form,false);
track('form_submit_error',{form:name,error:String((err&&err.message)||err).slice(0,80)});
setStatus(form,'err',
'Form şu anda gönderilemedi. Bilgilerinizi tek dokunuşla WhatsApp\'tan iletebilirsiniz.'+
'<br><a class="btn btn--wa btn--sm" href="#" data-lf-wa>WhatsApp\'tan gönder</a>');
var a=form.querySelector('[data-lf-wa]');
if(a){
a.href=waLink(msg);
a.target='_blank';
a.rel='noopener';
a.addEventListener('click',function(){
if(form.dataset.state==='done')return;
ctx.method='whatsapp';
form.dataset.state='sending';
hashedUser(col.data).then(function(u){ctx.user=u;setTimeout(function(){finish(form,ctx);},300);});
});
}
});
}
function bind(form){
if(form.__lf)return;
form.__lf=true;
form.setAttribute('novalidate','');
var name=form.getAttribute('data-lead-form')||'form';
if(!form.querySelector('.lf-hp')){
var hp=d.createElement('div');
hp.className='lf-hp';
hp.setAttribute('aria-hidden','true');
hp.innerHTML='<label>Web siteniz<input type="text" name="website" tabindex="-1" autocomplete="off"></label>';
form.insertBefore(hp,form.firstChild);
}
fieldsOf(form).forEach(function(el){
if(isPhoneField(el)){
if(!el.getAttribute('inputmode'))el.setAttribute('inputmode','tel');
if(!el.getAttribute('autocomplete'))el.setAttribute('autocomplete','tel');
el.addEventListener('blur',function(){
var p=parsePhone(el.value);
if(p)el.value=p.display;
if(form.dataset.touched||el.value)setError(el,el.value?validate(el):(form.dataset.touched?validate(el):''));
});
}
var revalidate=function(){if(form.dataset.touched||el.getAttribute('aria-invalid')==='true')setError(el,validate(el));};
el.addEventListener('input',revalidate);
el.addEventListener('change',revalidate);
});
var started=false;
var onStart=function(){
if(started)return;
started=true;
track('form_start',{form:name});
};
form.addEventListener('input',onStart);
form.addEventListener('change',onStart);
form.addEventListener('submit',onSubmit);
}
function init(root){[].forEach.call((root||d).querySelectorAll('form[data-lead-form]'),bind);}
DKY.bindForms=init;
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',function(){init();});
else init();
})();
