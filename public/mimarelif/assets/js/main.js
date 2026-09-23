/* =========================================================
   ELİF KARA — site JS
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     1) AYARLAR — iletişim bilgilerini burada değiştirin.
        Buradaki değerler sitedeki tüm telefon / WhatsApp /
        e-posta bağlantılarına otomatik uygulanır.
     --------------------------------------------------------- */
  var CONFIG = {
    phone:      '+90 553 801 53 23',   // ekranda görünen hâli
    phoneRaw:   '905538015323',        // wa.me ve tel: için (sadece rakam)
    email:      'merhaba@elifkara.com',// KENDİ E-POSTANIZLA DEĞİŞTİRİN
    instagram:  'https://www.instagram.com/mimarelifk/'
  };

  /* ---------------------------------------------------------
     2) PROJELER — kendi projelerinizi buraya ekleyin.
        img: assets/img/projects/ içine koyduğunuz görselin yolu.
        Görsel yoksa şık bir yer tutucu gösterilir.
     --------------------------------------------------------- */
  var PROJECTS = [
    // Fotoğraf eklemek için: görseli assets/img/projects/ içine koyun ve
    // img alanına yolunu yazın →  img:'/mimarelif/assets/img/projects/1.jpg'
    { img:'/mimarelif/assets/img/projects/1.jpg', tr:{t:'Salon & Yaşam Alanı', g:'Konut'},  en:{t:'Living Room',   g:'Residential'} },
    { img:'/mimarelif/assets/img/projects/2.jpg', tr:{t:'Yatak Odası',         g:'Konut'},  en:{t:'Bedroom',       g:'Residential'} },
    { img:'/mimarelif/assets/img/projects/3.jpg', tr:{t:'Mutfak',              g:'Konut'},  en:{t:'Kitchen',       g:'Residential'} },
    { img:'/mimarelif/assets/img/projects/4.jpg', tr:{t:'Banyo',               g:'Konut'},  en:{t:'Bathroom',      g:'Residential'} },
    { img:'/mimarelif/assets/img/projects/5.jpg', tr:{t:'Kafe Konsepti',       g:'Ticari'}, en:{t:'Café Concept',  g:'Commercial'} },
    { img:'/mimarelif/assets/img/projects/6.jpg', tr:{t:'Ofis Tasarımı',       g:'Ticari'}, en:{t:'Office Design', g:'Commercial'} }
  ];

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* =======================================================
     DİL
     ======================================================= */
  var lang = 'tr';

  function dict() { return window.I18N[lang] || window.I18N.tr; }
  function t(key) { var v = dict()[key]; return v === undefined ? (window.I18N.tr[key] || '') : v; }

  function detectLang() {
    var qs = new URLSearchParams(location.search).get('lang');
    var stored = null;
    try { stored = localStorage.getItem('ek-lang'); } catch (e) {}
    var nav = (navigator.language || 'tr').slice(0, 2).toLowerCase();
    var pick = qs || stored || (nav === 'tr' ? 'tr' : 'en');
    return window.I18N[pick] ? pick : 'tr';
  }

  function applyLang(next) {
    lang = window.I18N[next] ? next : 'tr';
    try { localStorage.setItem('ek-lang', lang); } catch (e) {}

    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);

    $$('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (!v) return;
      if (v.indexOf('<') > -1) el.innerHTML = v; else el.textContent = v;
    });
    $$('[data-i18n-placeholder]').forEach(function (el) {
      el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    $$('[data-i18n-content]').forEach(function (el) {
      el.setAttribute('content', t(el.getAttribute('data-i18n-content')));
    });
    document.title = t('meta.title');

    $$('.lang-btn').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-set-lang') === lang);
    });

    renderRibbon();
    renderProjects();
    splitWords();
  }

  /* Başlıkları kelimelere böler — perde efektinin taşıyıcısı.
     Dil değişince metin yeniden yazıldığı için her seferinde çalışır. */
  function splitWords() {
    $$('.fx-words').forEach(function (el) {
      var text = (el.textContent || '').trim();
      if (!text) return;
      el.setAttribute('aria-label', text);
      el.innerHTML = text.split(/\s+/).map(function (w, i) {
        return '<span class="w" aria-hidden="true" style="--wi:' + i + '"><i>' + w + '</i></span>';
      }).join(' ');
    });
  }

  /* =======================================================
     İLETİŞİM BAĞLANTILARI
     ======================================================= */
  function applyContact() {
    $$('a[href^="tel:"]').forEach(function (a) {
      a.href = 'tel:+' + CONFIG.phoneRaw;
      if (/[0-9]{3}/.test(a.textContent)) a.textContent = CONFIG.phone;
    });
    $$('a[href*="wa.me"]').forEach(function (a) {
      a.href = 'https://wa.me/' + CONFIG.phoneRaw;
    });
    $$('a[href^="mailto:"]').forEach(function (a) {
      a.href = 'mailto:' + CONFIG.email;
      if (a.textContent.indexOf('@') > -1) a.textContent = CONFIG.email;
    });
    $$('a[href*="instagram.com"]').forEach(function (a) { a.href = CONFIG.instagram; });
  }

  /* =======================================================
     RIBBON
     ======================================================= */
  function renderRibbon() {
    var track = $('.ribbon-track');
    if (!track) return;
    var words = dict().ribbon || [];
    var html = '';
    for (var pass = 0; pass < 2; pass++) {
      words.forEach(function (w) { html += '<span>' + w + '</span><i>◦</i>'; });
    }
    track.innerHTML = html;
  }

  /* =======================================================
     PROJELER
     ======================================================= */
  function renderProjects() {
    var grid = $('#projectGrid');
    if (!grid) return;
    grid.innerHTML = '';
    PROJECTS.forEach(function (p, i) {
      var meta = p[lang] || p.tr;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'proj reveal';
      btn.setAttribute('data-index', i);
      btn.innerHTML =
        '<figure class="frame">' +
          (p.img ? '<img src="' + p.img + '" alt="' + meta.t + '" loading="lazy" onerror="this.remove()">' : '') +
        '</figure>' +
        '<div class="proj-meta">' +
          '<span class="proj-title">' + meta.t + '</span>' +
          '<span class="proj-tag">' + meta.g + '</span>' +
        '</div>';
      if (p.img) {
        btn.addEventListener('click', function () { lbIndex = i; openLightbox(i); });
      } else {
        btn.style.cursor = 'default';
      }
      grid.appendChild(btn);
    });
    observeReveals();
  }

  /* =======================================================
     LIGHTBOX
     ======================================================= */
  var lb = $('#lightbox');
  function openLightbox(i) {
    var p = PROJECTS[i];
    if (!p) return;
    var meta = p[lang] || p.tr;
    var img = $('#lbImg');
    img.src = p.img;
    img.alt = meta.t;
    $('#lbCap').textContent = meta.t + ' — ' + meta.g;
    lb.hidden = false;
    document.body.classList.add('is-locked');
  }
  function closeLightbox() {
    lb.hidden = true;
    document.body.classList.remove('is-locked');
  }
  if (lb) {
    $('.lb-close', lb).addEventListener('click', closeLightbox);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
  }

  /* =======================================================
     HEADER / MENÜ / SCROLL
     ======================================================= */
  var header = $('#header');
  var burger = $('.burger');
  var mobileMenu = $('#mobile-menu');

  function onScroll() {
    header.classList.toggle('is-stuck', window.scrollY > 8);
    var y = window.scrollY + 140;
    var current = '';
    $$('main section[id]').forEach(function (s) {
      if (s.offsetTop <= y) current = s.id;
    });
    $$('.nav-desktop a').forEach(function (a) {
      a.classList.toggle('is-current', a.getAttribute('href') === '#' + current);
    });
  }

  function toggleMenu(force) {
    var open = force !== undefined ? force : mobileMenu.hidden;
    mobileMenu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
  }

  if (burger) {
    burger.addEventListener('click', function () { toggleMenu(); });
    $$('a', mobileMenu).forEach(function (a) {
      a.addEventListener('click', function () { toggleMenu(false); });
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (lb && !lb.hidden) closeLightbox();
    if (mobileMenu && !mobileMenu.hidden) toggleMenu(false);
  });

  /* =======================================================
     REVEAL
     ======================================================= */
  var io = null;
  function observeReveals() {
    var items = $$('.reveal:not(.is-in)');
    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en, i) {
          if (!en.isIntersecting) return;
          var el = en.target;
          setTimeout(function () { el.classList.add('is-in'); }, Math.min(i * 70, 280));
          io.unobserve(el);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    }
    items.forEach(function (el) { io.observe(el); });
  }

  /* =======================================================
     ÖN DEĞERLENDİRME FORMU
     ======================================================= */
  var form = $('#assessForm');
  if (form) {
    var steps     = $$('.step', form);
    var total     = steps.length;
    var stepIndex = 0;
    var answers   = {};

    var prevBtn = $('#prevBtn');
    var nextBtn = $('#nextBtn');
    var sendBtn = $('#sendBtn');
    var errEl   = $('#formError');
    var bar     = $('#progressBar');
    var stepNow = $('#stepNow');

    function paint() {
      steps.forEach(function (s, i) { s.classList.toggle('is-active', i === stepIndex); });
      bar.style.width = ((stepIndex + 1) / total * 100) + '%';
      stepNow.textContent = String(stepIndex + 1);
      prevBtn.hidden = stepIndex === 0;
      nextBtn.hidden = stepIndex === total - 1;
      sendBtn.hidden = stepIndex !== total - 1;
      errEl.hidden = true;
    }

    function fail(key) {
      errEl.textContent = t(key);
      errEl.hidden = false;
      return false;
    }

    function validate(i) {
      // 1. ve 2. adımda seçim zorunlu, 5. adımda iletişim bilgisi zorunlu.
      if (i === 0 && !answers.mekan)  return fail('err.choose');
      if (i === 1 && !answers.kapsam) return fail('err.choose');
      if (i === total - 1) {
        var ad  = form.elements.ad.value.trim();
        var tel = form.elements.telefon.value.replace(/[^0-9+]/g, '');
        if (ad.length < 2)   return fail('err.name');
        if (tel.length < 10) return fail('err.phone');
        if (!form.elements.kvkk.checked) return fail('err.kvkk');
      }
      errEl.hidden = true;
      return true;
    }

    function go(dir) {
      if (dir > 0 && !validate(stepIndex)) return;
      stepIndex = Math.max(0, Math.min(total - 1, stepIndex + dir));
      paint();
      var top = $('#on-degerlendirme').getBoundingClientRect().top + window.scrollY - 90;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: 'smooth' });
    }

    // seçenek butonları
    $$('.opts', form).forEach(function (group) {
      var name = group.getAttribute('data-name');
      $$('.opt', group).forEach(function (btn) {
        btn.addEventListener('click', function () {
          $$('.opt', group).forEach(function (b) { b.classList.remove('is-selected'); });
          btn.classList.add('is-selected');
          answers[name] = btn.textContent.trim();
          errEl.hidden = true;
          // tek soruluk adımlarda otomatik ilerle
          if (name === 'mekan' || name === 'kapsam') {
            setTimeout(function () { go(1); }, 260);
          }
        });
      });
    });

    prevBtn.addEventListener('click', function () { go(-1); });
    nextBtn.addEventListener('click', function () { go(1); });

    function buildMessage() {
      var f = form.elements;
      var rows = [
        ['wa.space',  answers.mekan],
        ['wa.scope',  answers.kapsam],
        ['wa.area',   f.alan.value ? f.alan.value + ' m²' : ''],
        ['wa.state',  answers.durum],
        ['wa.budget', answers.butce],
        ['wa.time',   answers.zaman],
        ['wa.name',   f.ad.value.trim()],
        ['wa.phone',  f.telefon.value.trim()],
        ['wa.mail',   f.eposta.value.trim()],
        ['wa.city',   f.sehir.value.trim()],
        ['wa.note',   f.not.value.trim()]
      ];
      var lines = ['*' + t('wa.head') + '*', ''];
      rows.forEach(function (r) {
        if (r[1]) lines.push(t(r[0]) + ': ' + r[1]);
      });
      return lines.join('\n');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(total - 1)) return;

      var msg = buildMessage();
      var waUrl = 'https://wa.me/' + CONFIG.phoneRaw + '?text=' + encodeURIComponent(msg);
      var mailUrl = 'mailto:' + CONFIG.email +
        '?subject=' + encodeURIComponent(t('mail.subject')) +
        '&body=' + encodeURIComponent(msg.replace(/\*/g, ''));

      window.open(waUrl, '_blank', 'noopener');

      $('#waAgain').href = waUrl;
      $('#mailInstead').href = mailUrl;
      form.hidden = true;
      $('#assessDone').hidden = false;

      if (window.gtag) window.gtag('event', 'generate_lead', { method: 'assessment_form' });
    });

    paint();
  }

  /* =======================================================
     HAREKET — okuma çubuğu, mobil çubuk, parallax
     ======================================================= */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bar    = $('#scrollBar');
  var mBar   = $('.mobile-bar');
  var heroV  = $('.hero-visual');
  var lastY  = 0, ticking = false;

  function frame() {
    var y   = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

    // aşağı kaydırırken mobil çubuğu gizle, yukarıda göster
    if (mBar) {
      var down = y > lastY + 4;
      var up   = y < lastY - 4;
      var nearEnd = max - y < 240;
      if (nearEnd || up || y < 160) mBar.classList.remove('is-hidden');
      else if (down && y > 260) mBar.classList.add('is-hidden');
    }

    // hero görselinde hafif derinlik (JS parallax yalnızca masaüstünde)
    if (heroV && !reduce && window.innerWidth > 980) {
      var off = Math.max(-40, Math.min(40, y * -0.045));
      heroV.style.transform = 'translate3d(0,' + off.toFixed(2) + 'px,0)';
    }

    lastY = y;
    ticking = false;
  }

  function onScrollFx() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(frame);
  }

  // mobil menü kademeli giriş için sıra numarası
  if (mobileMenu) {
    $$('nav a', mobileMenu).forEach(function (a, i) { a.style.setProperty('--i', i); });
  }

  /* =======================================================
     LIGHTBOX — ileri / geri / kaydırma
     ======================================================= */
  var lbIndex = 0;
  function showAt(i) {
    var withPhoto = PROJECTS.filter(function (p) { return p.img; });
    if (!withPhoto.length) return;
    var n = PROJECTS.length, step = i > lbIndex ? 1 : -1, guard = 0, j = i;
    while (guard++ < n) {
      j = (j + n) % n;
      if (PROJECTS[j].img) { lbIndex = j; openLightbox(j); return; }
      j += step;
    }
  }
  if (lb) {
    $('.lb-prev', lb).addEventListener('click', function (e) { e.stopPropagation(); showAt(lbIndex - 1); });
    $('.lb-next', lb).addEventListener('click', function (e) { e.stopPropagation(); showAt(lbIndex + 1); });

    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'ArrowLeft')  showAt(lbIndex - 1);
      if (e.key === 'ArrowRight') showAt(lbIndex + 1);
    });

    var tx = 0, ty = 0, fig = $('figure', lb);
    lb.addEventListener('touchstart', function (e) {
      tx = e.touches[0].clientX; ty = e.touches[0].clientY;
    }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - tx;
      var dy = e.changedTouches[0].clientY - ty;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) showAt(lbIndex + (dx < 0 ? 1 : -1));
      else if (dy > 90) closeLightbox();
      if (fig) fig.style.transform = '';
    }, { passive: true });
  }

  /* =======================================================
     AÇILIŞ PERDESİ
     ======================================================= */
  (function preloader() {
    var pre = $('#preloader');
    if (!pre) return;
    var root = document.documentElement;
    var seen = false;
    try { seen = sessionStorage.getItem('ek-seen') === '1'; } catch (e) {}

    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pre.remove();
      return;
    }
    root.classList.add('is-loading');
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      pre.classList.add('is-done');
      root.classList.remove('is-loading');
      try { sessionStorage.setItem('ek-seen', '1'); } catch (e) {}
      setTimeout(function () { pre.remove(); }, 700);
    }
    window.addEventListener('load', function () { setTimeout(finish, 950); });
    setTimeout(finish, 3200); // ağ yavaşsa bile sayfa açılsın
  })();

  /* =======================================================
     YAPIŞKAN SÜREÇ — adım görünürken görsel değişir
     ======================================================= */
  (function procScroll() {
    var steps   = $$('.proc-step');
    var frames  = $$('.proc-frame');
    var counter = $('#procNo');
    var section = $('#surec');
    if (!steps.length || !frames.length || !section) return;

    var active = -1, queued = false;

    function activate(i) {
      if (i === active) return;
      active = i;
      steps.forEach(function (s, n) { s.classList.toggle('is-on', n === i); });
      frames.forEach(function (f, n) { f.classList.toggle('is-on', n === i); });
      if (counter) counter.textContent = ('0' + (i + 1)).slice(-2);
    }

    /* Okuma çizgisine en yakın adımı seç: anlık zıplamalarda da doğru çalışır. */
    function pick() {
      queued = false;
      var r = section.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;

      var line = window.innerHeight * 0.45;
      var best = 0, bestDist = Infinity;
      steps.forEach(function (s, i) {
        var b = s.getBoundingClientRect();
        var d = Math.abs(b.top + b.height / 2 - line);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      activate(best);
    }

    function onScroll() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(pick);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    activate(0);
    pick();
  })();

  /* =======================================================
     İMLECİ İZLEYEN ÖNİZLEME (yalnız fareli ekranlar)
     ======================================================= */
  (function cursorPreview() {
    var box = $('#cursorImg');
    var cards = $$('[data-preview]');
    if (!box || !cards.length) return;
    if (!window.matchMedia('(hover: hover) and (min-width: 1041px)').matches) return;

    var img = $('img', box);
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null, on = false;

    function loop() {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      box.style.left = cx + 'px';
      box.style.top = cy + 'px';
      raf = on ? requestAnimationFrame(loop) : null;
    }

    cards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        var src = card.getAttribute('data-preview');
        if (!src) return;
        img.src = src;
        box.classList.add('is-on');
        on = true;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      card.addEventListener('mouseleave', function () {
        box.classList.remove('is-on');
        on = false;
      });
      card.addEventListener('mousemove', function (e) {
        tx = e.clientX; ty = e.clientY;
        if (!cx && !cy) { cx = tx; cy = ty; }
      });
    });
  })();

  /* =======================================================
     MIKNATIS DÜĞMELER
     ======================================================= */
  (function magnetic() {
    if (!window.matchMedia('(hover: hover) and (min-width: 981px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    $$('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
        var dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
        el.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  })();

  /* =======================================================
     BAŞLAT
     ======================================================= */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  applyContact();
  applyLang(detectLang());
  observeReveals();
  onScroll();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scroll', onScrollFx, { passive: true });
  window.addEventListener('resize', onScrollFx, { passive: true });
  onScrollFx();
  $$('.lang-btn').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-set-lang')); });
  });
})();
