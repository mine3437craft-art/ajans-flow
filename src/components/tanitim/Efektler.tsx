'use client';

import { useEffect } from 'react';

/**
 * Sunucuda üretilmiş DOM'a efektleri bağlayan tek istemci bileşeni.
 * Hiçbir şey çizmez; yalnızca gözlemci ve dinleyici ekler.
 *
 *  - [data-reveal]       → görünür olunca .is-in (tek IntersectionObserver)
 *  - [data-sayac]        → sayı sayma animasyonu
 *  - [data-parallax]     → kaydırmaya bağlı hafif kayma (yalnızca ince imleç)
 *  - [data-miknatis]     → mıknatıslı düğmeler (yalnızca ince imleç)
 *  - [data-egim]         → 3B eğim + imleç spotu (yalnızca ince imleç)
 *  - [data-anim-alan]    → ekran dışındaki CSS animasyonlarını duraklatır
 *  - [data-zaman-kodu]   → vizör zaman kodu
 *  - [data-surec]        → süreç çizgisinin kaydırmayla dolması
 *  - [data-karusel]      → yatay kaydırma ilerleme çubuğu
 *  - [data-alt-cta]      → hero geçilince beliren mobil alt çubuk
 *  - a[href^="#"]        → yumuşak kaydırma (html'e scroll-behavior yazmadan)
 *
 * Her şey transform/opacity ile; kaydırma döngüsünde düzen (layout) okuması
 * yapılmaz, ölçüler yalnızca yeniden boyutlanmada alınır.
 */
export default function Efektler({ kokId }: { kokId: string }) {
  useEffect(() => {
    const kok = document.getElementById(kokId);
    if (!kok) return;

    const temizle: Array<() => void> = [];
    const dinle = <K extends keyof WindowEventMap>(
      hedef: Window | Document | HTMLElement,
      olay: K | string,
      fn: EventListenerOrEventListenerObject,
      secenek?: AddEventListenerOptions,
    ) => {
      hedef.addEventListener(olay, fn, secenek);
      temizle.push(() => hedef.removeEventListener(olay, fn, secenek));
    };

    const azHareket = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const inceImlec = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const dusukGuc =
      nav.connection?.saveData === true ||
      (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2) ||
      (navigator.hardwareConcurrency ?? 8) <= 2;
    const zenginEfekt = inceImlec && !azHareket && !dusukGuc;

    // JS geç yüklendiyse (satır içi betiğin zaman aşımı) içerik zaten görünür:
    // tekrar gizlemeyelim, yalnızca etkileşimleri bağlayalım.
    // Etkileşimli parçaların (SSS, QR demosu) kuralları .tn-js'e bağlı: geç
    // kalınsa da sınıf eklenir; görünür içerik aşağıda hemen .is-in alıyor.
    const gecKaldi = kok.classList.contains('tn-js-yok');
    kok.classList.remove('tn-js-yok');
    kok.classList.add('tn-js', 'tn-hazir');

    const hepsi = <T extends Element = HTMLElement>(secici: string) =>
      Array.from(kok.querySelectorAll<T & Element>(secici)) as T[];

    /* ---------------- Görünce belir ---------------- */
    const belirenler = hepsi<HTMLElement>('[data-reveal]:not(.is-in)');
    if (azHareket || gecKaldi || !('IntersectionObserver' in window)) {
      belirenler.forEach((el) => el.classList.add('is-in'));
    } else {
      const io = new IntersectionObserver(
        (girdiler) => {
          for (const g of girdiler) {
            if (!g.isIntersecting) continue;
            g.target.classList.add('is-in');
            io.unobserve(g.target);
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
      );
      belirenler.forEach((el) => io.observe(el));
      temizle.push(() => io.disconnect());
    }

    /* ---------------- Sayı sayma ---------------- */
    const sayaclar = hepsi<HTMLElement>('[data-sayac]');
    const bicim = (n: number, ek: string) => `${n.toLocaleString('tr-TR')}${ek}`;
    if (!azHareket && 'IntersectionObserver' in window) {
      const rafIdleri = new Set<number>();
      const say = (el: HTMLElement) => {
        const hedef = Number(el.dataset.sayac) || 0;
        const ek = el.dataset.ek ?? '';
        const sure = 1500 + Math.min(hedef, 300) * 2;
        const bas = performance.now();
        const adim = (t: number) => {
          const p = Math.min(1, (t - bas) / sure);
          const e = 1 - Math.pow(1 - p, 4);
          el.textContent = bicim(Math.round(hedef * e), ek);
          if (p < 1) {
            const id = requestAnimationFrame(adim);
            rafIdleri.add(id);
          }
        };
        requestAnimationFrame(adim);
      };
      // Yalnızca ekranın altında kalanları sıfırdan başlat; görünenler SSR değeriyle kalır.
      const vh = window.innerHeight;
      const bekleyen = sayaclar.filter((el) => el.getBoundingClientRect().top > vh);
      bekleyen.forEach((el) => (el.textContent = bicim(0, el.dataset.ek ?? '')));
      const io = new IntersectionObserver(
        (girdiler) => {
          for (const g of girdiler) {
            if (!g.isIntersecting) continue;
            io.unobserve(g.target);
            say(g.target as HTMLElement);
          }
        },
        { threshold: 0.6 },
      );
      bekleyen.forEach((el) => io.observe(el));
      temizle.push(() => {
        io.disconnect();
        rafIdleri.forEach((id) => cancelAnimationFrame(id));
        // Strict Mode'da ikinci bağlanmada doğru değer görünsün
        sayaclar.forEach((el) => (el.textContent = bicim(Number(el.dataset.sayac) || 0, el.dataset.ek ?? '')));
      });
    }

    /* ---------------- Ekran dışı animasyonları duraklat ---------------- */
    const oynayanlar = new Set<Element>();
    if ('IntersectionObserver' in window) {
      const alanlar = hepsi<HTMLElement>('[data-anim-alan]');
      const io = new IntersectionObserver(
        (girdiler) => {
          for (const g of girdiler) {
            g.target.classList.toggle('is-oynuyor', g.isIntersecting);
            if (g.isIntersecting) oynayanlar.add(g.target);
            else oynayanlar.delete(g.target);
          }
          // Duraklatma kuralı ancak ilk ölçümden sonra devreye girsin;
          // yoksa hero'nun açılış animasyonları bir an donar.
          kok.classList.add('tn-duraklat');
        },
        { rootMargin: '120px 0px' },
      );
      alanlar.forEach((el) => io.observe(el));
      temizle.push(() => {
        io.disconnect();
        kok.classList.remove('tn-duraklat');
      });
    }
    const gorunurMu = (el: Element) => {
      const alan = el.closest('[data-anim-alan]');
      return !alan || oynayanlar.has(alan);
    };

    /* ---------------- Vizör zaman kodu ---------------- */
    const tc = kok.querySelector<HTMLElement>('[data-zaman-kodu]');
    if (tc && !azHareket) {
      const baz = 3 * 60 + 27; // 00:03:27'den başlasın, "çekim sürüyor" hissi
      const bas = performance.now();
      const iki = (n: number) => String(n).padStart(2, '0');
      // Her karede değil, saniyede ~12 kez ve yalnızca bölüm görünürken:
      // sürekli requestAnimationFrame telefonu boşuna uyanık tutuyordu.
      const zamanlayici = window.setInterval(() => {
        if (document.hidden || !gorunurMu(tc)) return;
        const toplamKare = Math.floor(((performance.now() - bas) / 1000 + baz) * 25);
        const f = toplamKare % 25;
        const s = Math.floor(toplamKare / 25);
        tc.textContent = `${iki(Math.floor(s / 3600))}:${iki(Math.floor(s / 60) % 60)}:${iki(s % 60)}:${iki(f)}`;
      }, 80);
      temizle.push(() => window.clearInterval(zamanlayici));
    }

    /* ---------------- Kaydırmaya bağlı işler ---------------- */
    const ilerleme = kok.querySelector<HTMLElement>('[data-ilerleme]');
    const surec = kok.querySelector<HTMLElement>('[data-surec]');
    const surecDolgu = kok.querySelector<HTMLElement>('[data-surec-dolgu]');
    const adimlar = hepsi<HTMLElement>('[data-adim]');
    const parallaxlar = zenginEfekt ? hepsi<HTMLElement>('[data-parallax]') : [];

    type Olcu = {
      maks: number;
      vh: number;
      surecUst: number;
      surecBoy: number;
      adimEsik: number[];
      parallax: { el: HTMLElement; merkez: number; hiz: number }[];
    };
    const olcu: Olcu = { maks: 1, vh: 1, surecUst: 0, surecBoy: 1, adimEsik: [], parallax: [] };
    let kaydirildi: boolean | null = null;

    const olc = () => {
      const y = window.scrollY;
      olcu.vh = window.innerHeight;
      olcu.maks = Math.max(1, document.documentElement.scrollHeight - olcu.vh);
      if (surec) {
        const r = surec.getBoundingClientRect();
        olcu.surecUst = r.top + y;
        olcu.surecBoy = Math.max(1, r.height);
        olcu.adimEsik = adimlar.map((a) => {
          const ar = a.getBoundingClientRect();
          return (ar.top + y - olcu.surecUst + 18) / olcu.surecBoy;
        });
      }
      olcu.parallax = parallaxlar.map((el) => {
        el.style.transform = '';
        const r = el.getBoundingClientRect();
        return { el, merkez: r.top + y + r.height / 2, hiz: Number(el.dataset.parallax) || 0 };
      });
    };

    const guncelle = () => {
      bekliyor = false;
      const y = window.scrollY;
      const { vh } = olcu;

      if (ilerleme) ilerleme.style.transform = `scaleX(${Math.min(1, y / olcu.maks)})`;

      const yeniKaydirildi = y > 24;
      if (yeniKaydirildi !== kaydirildi) {
        kaydirildi = yeniKaydirildi;
        kok.classList.toggle('tn-kaydirildi', yeniKaydirildi);
      }

      if (surec && surecDolgu) {
        const p = Math.min(1, Math.max(0, (y + vh * 0.62 - olcu.surecUst) / olcu.surecBoy));
        surecDolgu.style.transform = `scaleY(${p})`;
        adimlar.forEach((a, i) => a.classList.toggle('is-aktif', p >= (olcu.adimEsik[i] ?? 1)));
      }

      for (const p of olcu.parallax) {
        const fark = y + vh / 2 - p.merkez;
        if (Math.abs(fark) > vh * 1.6) continue;
        p.el.style.transform = `translate3d(0, ${(fark * p.hiz).toFixed(1)}px, 0)`;
      }
    };

    let bekliyor = false;
    const kaydir = () => {
      if (bekliyor) return;
      bekliyor = true;
      requestAnimationFrame(guncelle);
    };

    let olcumZamani = 0;
    const yenidenOlc = () => {
      window.clearTimeout(olcumZamani);
      olcumZamani = window.setTimeout(() => {
        olc();
        guncelle();
      }, 120);
    };

    olc();
    guncelle();
    dinle(window, 'scroll', kaydir, { passive: true });
    dinle(window, 'resize', yenidenOlc);
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(yenidenOlc);
      ro.observe(kok);
      temizle.push(() => ro.disconnect());
    }
    document.fonts?.ready.then(yenidenOlc).catch(() => {});
    temizle.push(() => window.clearTimeout(olcumZamani));
    temizle.push(() => parallaxlar.forEach((el) => (el.style.transform = '')));

    /* ---------------- Yatay kaydırıcı ilerlemesi ---------------- */
    hepsi<HTMLElement>('[data-karusel]').forEach((kutu) => {
      const cubuk = kok.querySelector<HTMLElement>(`[data-karusel-cubuk="${kutu.id}"]`);
      const sayac = kok.querySelector<HTMLElement>(`[data-karusel-sayac="${kutu.id}"]`);
      if (!cubuk && !sayac) return;
      const kartlar = Array.from(kutu.children) as HTMLElement[];
      let bekle = false;
      const guncelleK = () => {
        bekle = false;
        const maks = kutu.scrollWidth - kutu.clientWidth;
        const p = maks > 0 ? Math.min(1, Math.max(0, Math.abs(kutu.scrollLeft) / maks)) : 0;
        if (cubuk) cubuk.style.transform = `scaleX(${Math.max(1 / kartlar.length, p)})`;
        if (sayac && kartlar.length) {
          const idx = Math.round(p * (kartlar.length - 1)) + 1;
          sayac.textContent = `${idx} / ${kartlar.length}`;
        }
      };
      const kaydirK = () => {
        if (bekle) return;
        bekle = true;
        requestAnimationFrame(guncelleK);
      };
      guncelleK();
      dinle(kutu, 'scroll', kaydirK, { passive: true });
    });

    /* ---------------- Mobil alt çağrı çubuğu ---------------- */
    const altCta = kok.querySelector<HTMLElement>('[data-alt-cta]');
    if (altCta && 'IntersectionObserver' in window) {
      const gizleyenler = hepsi<HTMLElement>('[data-alt-cta-gizle]');
      const gorunenler = new Set<Element>();
      const io = new IntersectionObserver(
        (girdiler) => {
          for (const g of girdiler) {
            if (g.isIntersecting) gorunenler.add(g.target);
            else gorunenler.delete(g.target);
          }
          altCta.classList.toggle('is-gorunur', gorunenler.size === 0);
        },
        { threshold: 0 },
      );
      gizleyenler.forEach((el) => io.observe(el));
      temizle.push(() => io.disconnect());
    }

    /* ---------------- Yumuşak çapa kaydırma ---------------- */
    const capaTikla = (e: Event) => {
      const me = e as MouseEvent;
      if (me.defaultPrevented || me.button !== 0 || me.metaKey || me.ctrlKey || me.shiftKey || me.altKey) return;
      const a = (me.target as Element | null)?.closest?.('a[href^="#"]');
      if (!a || !kok.contains(a)) return;
      const id = decodeURIComponent(a.getAttribute('href')!.slice(1));
      const hedef = id ? document.getElementById(id) : null;
      if (!hedef) return;
      e.preventDefault();
      // Mobil menü kapanıp kaydırma kilidi kalksın diye bir kare bekle
      requestAnimationFrame(() => {
        const basOfset = parseFloat(getComputedStyle(kok).getPropertyValue('--tn-ust-bosluk')) || 80;
        const ust = id === 'tn-ust' ? 0 : hedef.getBoundingClientRect().top + window.scrollY - basOfset;
        window.scrollTo({ top: Math.max(0, ust), behavior: azHareket ? 'auto' : 'smooth' });
        if (!hedef.hasAttribute('tabindex')) hedef.setAttribute('tabindex', '-1');
        hedef.focus({ preventScroll: true });
        history.replaceState(null, '', `#${id}`);
      });
    };
    dinle(kok, 'click', capaTikla);

    /* ---------------- İmleç ışığı ---------------- */
    if (zenginEfekt) {
      const isik = kok.querySelector<HTMLElement>('[data-imlec-isik]');
      if (isik) {
        let hx = window.innerWidth / 2;
        let hy = window.innerHeight / 2;
        let x = hx;
        let y = hy;
        let id = 0;
        let calisiyor = false;
        const dongu = () => {
          x += (hx - x) * 0.16;
          y += (hy - y) * 0.16;
          isik.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
          if (Math.abs(hx - x) + Math.abs(hy - y) > 0.4) id = requestAnimationFrame(dongu);
          else calisiyor = false;
        };
        const hareket = (e: Event) => {
          const pe = e as PointerEvent;
          if (pe.pointerType !== 'mouse') return;
          hx = pe.clientX;
          hy = pe.clientY;
          isik.classList.add('is-gorunur');
          if (!calisiyor) {
            calisiyor = true;
            id = requestAnimationFrame(dongu);
          }
        };
        const ayril = (e: Event) => {
          if (!(e as MouseEvent).relatedTarget) isik.classList.remove('is-gorunur');
        };
        dinle(window, 'pointermove', hareket, { passive: true });
        dinle(document, 'mouseout', ayril);
        temizle.push(() => cancelAnimationFrame(id));
      }
    }

    /* ---------------- Mıknatıslı düğmeler + eğim/spot ---------------- */
    if (zenginEfekt) {
      // Önbellekteki kutu ölçüleri kaydırınca eskir; bir sonraki harekette yeniden ölçülür.
      const eskit: Array<() => void> = [];
      dinle(window, 'scroll', () => eskit.forEach((f) => f()), { passive: true });

      hepsi<HTMLElement>('[data-miknatis]').forEach((el) => {
        let r: DOMRect | null = null;
        const olcDugme = () => {
          const eski = el.style.transform;
          el.style.transform = '';
          r = el.getBoundingClientRect();
          el.style.transform = eski;
        };
        const gir = () => {
          olcDugme();
          el.classList.add('is-miknatis');
        };
        const hareket = (e: Event) => {
          const pe = e as PointerEvent;
          if (!r) olcDugme();
          if (!r) return;
          const dx = pe.clientX - (r.left + r.width / 2);
          const dy = pe.clientY - (r.top + r.height / 2);
          el.style.transform = `translate3d(${(dx * 0.22).toFixed(1)}px, ${(dy * 0.34).toFixed(1)}px, 0)`;
        };
        const cik = () => {
          r = null;
          el.classList.remove('is-miknatis');
          el.style.transform = '';
        };
        eskit.push(() => (r = null));
        dinle(el, 'pointerenter', gir);
        dinle(el, 'pointermove', hareket);
        dinle(el, 'pointerleave', cik);
        temizle.push(() => (el.style.transform = ''));
      });

      hepsi<HTMLElement>('[data-egim]').forEach((el) => {
        let r: DOMRect | null = null;
        let bekle = false;
        let sonX = 0;
        let sonY = 0;
        const guncelleE = () => {
          bekle = false;
          if (!r) r = el.getBoundingClientRect();
          const px = Math.min(1, Math.max(0, (sonX - r.left) / r.width));
          const py = Math.min(1, Math.max(0, (sonY - r.top) / r.height));
          el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
          el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
          el.style.setProperty('--rx', `${((0.5 - py) * 7).toFixed(2)}deg`);
          el.style.setProperty('--ry', `${((px - 0.5) * 9).toFixed(2)}deg`);
        };
        const gir = () => {
          r = null;
          el.classList.add('is-egik');
        };
        const hareket = (e: Event) => {
          const pe = e as PointerEvent;
          sonX = pe.clientX;
          sonY = pe.clientY;
          if (!bekle) {
            bekle = true;
            requestAnimationFrame(guncelleE);
          }
        };
        const cik = () => {
          r = null;
          el.classList.remove('is-egik');
          el.style.setProperty('--rx', '0deg');
          el.style.setProperty('--ry', '0deg');
        };
        eskit.push(() => (r = null));
        dinle(el, 'pointerenter', gir);
        dinle(el, 'pointermove', hareket);
        dinle(el, 'pointerleave', cik);
      });
    }

    return () => {
      temizle.forEach((f) => f());
    };
  }, [kokId]);

  return null;
}
