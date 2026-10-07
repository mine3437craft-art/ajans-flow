'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

/** SSR'da useLayoutEffect uyarısı vermesin. */
const useIzomorfik = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type Baglanti = { saveData?: boolean; effectiveType?: string; downlink?: number };

/**
 * Sitenin TEK istemci efekt bileşeni. Hiçbir şey çizmez; sunucuda üretilmiş
 * DOM'a davranış bağlar. ScrollSmoother KULLANILMAZ (Lenis ile çakışır).
 *
 * Tek rAF döngüsü: `gsap.ticker` Lenis'i sürer, `lenis.on('scroll')`
 * ScrollTrigger'ı günceller. Ayrı bir requestAnimationFrame yoktur.
 *
 * Okuduğu nitelikler (sayfa ajanları bunları kullanır):
 *   [data-belir]           görünce belirme · `--i` ile kademe
 *   [data-belir="yan"|"olcek"|"solma"]   belirme yönü
 *   [data-sayac="244"]     bir kez sayma · [data-ek="+"] sonek
 *   [data-miknatis]        düğme çekimi (yalnız ince imleç)
 *   [data-baslik-ac]       SplitText ile kelime kelime açılış (H1 / bölüm H2)
 *   [data-video]           Video bileşeninin kutusu (tek oynatıcı denetimi)
 *   [data-video-bekle="yukleme"]  hero kapısı: window.load + idle + ağ
 *   [data-akis="kare"]     akış hattının o bölümdeki şekli
 *   [data-alt-cta-gizle]   ekrandayken mobil alt şerit gizlenir
 *
 * Korumalar: `prefers-reduced-motion`, `saveData`, 2g/slow-2g.
 */
export default function Efektler({ kokId = 'af-kok' }: { kokId?: string }) {
  const kokIdRef = useRef(kokId);
  kokIdRef.current = kokId;

  useIzomorfik(() => {
    const kok = document.getElementById(kokIdRef.current);
    if (!kok) return;

    const temizle: Array<() => void> = [];
    const azHareket = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const inceImlec = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const baglanti = (navigator as Navigator & { connection?: Baglanti }).connection;
    const yavasAg =
      baglanti?.saveData === true || /(^|-)(2g|slow-2g)$/.test(baglanti?.effectiveType ?? '');
    const hafif = azHareket || yavasAg;

    // 4 saniye kuralı: satır içi betik `js-var`'ı koydu ve zamanlayıcı kurdu.
    // `af-hazir` zamanlayıcıyı iptal eder. `js-var` yoksa JS geç kaldı demektir:
    // içerik zaten açık, bir daha gizlemeyiz.
    const gecKaldi = !kok.classList.contains('js-var');
    kok.classList.add('af-hazir');
    if (yavasAg) kok.classList.add('af-hafif');

    /* ---------------- Lenis — akıcı kaydırma ---------------- */
    let lenis: Lenis | null = null;
    if (!hafif) {
      lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        touchMultiplier: 1.5,
        // Sayfa içi çapa bağlantıları (#id) da Lenis üzerinden gitsin;
        // yoksa tarayıcının anlık zıplaması Lenis'in konumuyla çakışıyor.
        anchors: { offset: -80 },
      });
      const surucu = (t: number) => lenis?.raf(t * 1000);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(surucu);
      gsap.ticker.lagSmoothing(0);
      temizle.push(() => {
        gsap.ticker.remove(surucu);
        lenis?.destroy();
        lenis = null;
      });
    }

    const bolmeler: SplitText[] = [];

    const ctx = gsap.context(() => {
      const hepsi = <T extends HTMLElement>(secici: string) =>
        Array.from(kok.querySelectorAll<T>(secici));

      /* ---------------- Görünce belirme (stagger: --i) ---------------- */
      const belirenler = hepsi('[data-belir]');
      if (azHareket || gecKaldi) {
        belirenler.forEach((el) => el.classList.add('af-belirdi'));
      } else {
        ScrollTrigger.batch(belirenler, {
          start: 'top 90%',
          once: true,
          onEnter: (ogeler) => {
            ogeler.forEach((el, i) => {
              const he = el as HTMLElement;
              if (!he.style.getPropertyValue('--i')) {
                he.style.setProperty('--i', String(Math.min(i, 6)));
              }
              he.classList.add('af-belirdi');
            });
          },
        });
        // Ekranın üstünde kalanlar hemen açılsın (ilk ekran beklemesin)
        belirenler.forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight * 0.9) el.classList.add('af-belirdi');
        });
      }

      /* ---------------- Başlık açılışı (SplitText) ---------------- */
      if (!azHareket && !yavasAg && !gecKaldi) {
        hepsi('[data-baslik-ac]').forEach((baslik) => {
          const bolme = new SplitText(baslik, { type: 'words', mask: 'words', wordsClass: 'af-kelime' });
          bolmeler.push(bolme);
          gsap.from(bolme.words, {
            yPercent: 110,
            duration: 0.85,
            ease: 'power3.out',
            stagger: 0.035,
            scrollTrigger: { trigger: baslik, start: 'top 88%', once: true },
          });
        });
      }

      /* ---------------- Sayaçlar (bir kez) ---------------- */
      hepsi('[data-sayac]').forEach((el) => {
        const hedef = Number(el.dataset.sayac) || 0;
        const ek = el.dataset.ek ?? '';
        const yaz = (n: number) => {
          el.textContent = `${Math.round(n).toLocaleString('tr-TR')}${ek}`;
        };
        if (azHareket) {
          yaz(hedef);
          return;
        }
        const durum = { n: 0 };
        gsap.to(durum, {
          n: hedef,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => yaz(durum.n),
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          onStart: () => yaz(0),
        });
      });

      /* ---------------- Üst bar kaydırma durumu ---------------- */
      const ustbar = document.querySelector<HTMLElement>('[data-ustbar]');
      if (ustbar) {
        ScrollTrigger.create({
          start: 'top -24px',
          end: 99999,
          toggleClass: { targets: ustbar, className: 'is-kaydirildi' },
        });
      }

      /* ---------------- AKIŞ HATTI ----------------
         DÜZELTME (SITE-GIRIS.md, üç jürinin de işaret ettiği tek en
         büyük jank kaynağı): bu scrub eskiden `trigger: document.body,
         end: 'bottom bottom'` ile TÜM SAYFA BOYU `stroke-dashoffset`
         sürüyordu. `stroke-dashoffset` compositor'da hızlanmaz, yani
         sayfa ne kadar uzunsa o kadar uzun süre her kaydırma karesinde
         SVG yeniden boyanıyordu; orta segment Android'de tam kullanıcı
         kaydırmaya başladığı anda kare düşürüyordu.

         Yeni davranış: hat BÖLÜM BÖLÜM segmentlenir. Her `[data-akis]`
         bölümü kendi KISA ScrollTrigger'ını kurar ve yalnız o bölüm
         ekrandayken, yalnız o bölümün mesafesi boyunca kendi yolunu
         çizer. Aynı anda en çok bir-iki trigger etkin olur; sayfanın
         boyu maliyeti artırmaz.

         Mobilde (<1000px) dashoffset scrub'ı TAMAMEN kapalı: hat orada
         14px genişlikte ve 0,5 opak, çizim etkisi görünmüyor bile —
         yalnız bölüm bazlı opaklık devri kalır (saf CSS geçişi). */
      const hat = document.querySelector<HTMLElement>('[data-akis-hat]');
      if (hat) {
        const yollar = Array.from(hat.querySelectorAll<SVGPathElement>('.af-akis-yol'));
        const sekilAyarla = (sekil: string) =>
          yollar.forEach((y) => y.classList.toggle('is-aktif', y.dataset.akisSekil === sekil));

        sekilAyarla('duz');
        if (!azHareket && !yavasAg) {
          // Çizim yalnız masaüstünde; `.af-akis` CSS'i de 1000px'te açılıyor.
          const cizilsin = window.matchMedia('(min-width: 1000px)').matches;
          const uzunluk = new Map<SVGPathElement, number>();
          if (cizilsin) {
            yollar.forEach((y) => {
              const u = y.getTotalLength();
              uzunluk.set(y, u);
              y.style.strokeDasharray = String(u);
              y.style.strokeDashoffset = String(u);
            });
          }

          hepsi('[data-akis]').forEach((bolum) => {
            const sekil = bolum.dataset.akis || 'duz';
            const yol = yollar.find((y) => y.dataset.akisSekil === sekil);
            ScrollTrigger.create({
              trigger: bolum,
              start: 'top 70%',
              end: 'bottom 30%',
              // scrub yalnız çizim açıkken; kapalıyken trigger sadece
              // şekli devreder ve hiç kare başına iş yapmaz.
              scrub: cizilsin ? 0.5 : false,
              onToggle: (self) => {
                if (self.isActive) sekilAyarla(sekil);
              },
              onEnter: () => sekilAyarla(sekil),
              onEnterBack: () => sekilAyarla(sekil),
              onLeave: () => sekilAyarla('duz'),
              onLeaveBack: () => sekilAyarla('duz'),
              onUpdate: cizilsin
                ? (self) => {
                    if (!yol) return;
                    const u = uzunluk.get(yol) ?? 0;
                    yol.style.strokeDashoffset = String(u * (1 - self.progress));
                  }
                : undefined,
            });
          });

          temizle.push(() => {
            yollar.forEach((y) => {
              y.style.removeProperty('stroke-dasharray');
              y.style.removeProperty('stroke-dashoffset');
            });
          });
        }
      }

      /* ---------------- Mobil alt CTA şeridi ---------------- */
      const serit = kok.querySelector<HTMLElement>('[data-alt-cta]');
      if (serit) {
        // İki koşul birlikte: (1) sayfanın tepesinden en az yarım ekran
        // uzaklaşılmış olmalı, (2) [data-alt-cta-gizle] işaretli bir bölüm
        // (hero, alt bilgi, form) ekranda olmamalı.
        const gorunenler = new Set<Element>();
        let yeterinceKaydi = false;
        const tazele = () =>
          serit.classList.toggle('is-gorunur', yeterinceKaydi && gorunenler.size === 0);

        ScrollTrigger.create({
          start: () => window.innerHeight * 0.55,
          end: 99999,
          onToggle: (self) => {
            yeterinceKaydi = self.isActive;
            tazele();
          },
        });

        const gizleyenler = hepsi('[data-alt-cta-gizle]');
        if (gizleyenler.length && 'IntersectionObserver' in window) {
          const io = new IntersectionObserver(
            (girdiler) => {
              for (const g of girdiler) {
                if (g.isIntersecting) gorunenler.add(g.target);
                else gorunenler.delete(g.target);
              }
              tazele();
            },
            { threshold: 0 },
          );
          gizleyenler.forEach((el) => io.observe(el));
          temizle.push(() => io.disconnect());
        }
      }

      /* ---------------- Marka şeritlerini ekran dışında duraklat ------- */
      if ('IntersectionObserver' in window) {
        const seritler = hepsi('.af-marka-serit');
        if (seritler.length) {
          const io = new IntersectionObserver(
            (girdiler) => girdiler.forEach((g) => g.target.classList.toggle('af-durakla', !g.isIntersecting)),
            { rootMargin: '120px 0px' },
          );
          seritler.forEach((el) => io.observe(el));
          temizle.push(() => io.disconnect());
        }
      }

      /* ---------------- Mıknatıslı düğmeler (yalnız ince imleç) -------- */
      if (inceImlec && !azHareket) {
        hepsi('[data-miknatis]').forEach((el) => {
          const hizliX = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' });
          const hizliY = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' });
          let kutu: DOMRect | null = null;
          const gir = () => {
            kutu = el.getBoundingClientRect();
            el.classList.add('is-miknatis');
          };
          const hareket = (e: PointerEvent) => {
            if (!kutu) kutu = el.getBoundingClientRect();
            hizliX((e.clientX - (kutu.left + kutu.width / 2)) * 0.22);
            hizliY((e.clientY - (kutu.top + kutu.height / 2)) * 0.34);
          };
          const cik = () => {
            kutu = null;
            el.classList.remove('is-miknatis');
            hizliX(0);
            hizliY(0);
          };
          el.addEventListener('pointerenter', gir);
          el.addEventListener('pointermove', hareket);
          el.addEventListener('pointerleave', cik);
          temizle.push(() => {
            el.removeEventListener('pointerenter', gir);
            el.removeEventListener('pointermove', hareket);
            el.removeEventListener('pointerleave', cik);
          });
        });
      }
    }, kok);

    /* ---------------- VİDEO DENETLEYİCİ ----------------
       Sayfada aynı anda TEK video oynar. `src` ancak öğe %50 görününce
       atanır; `saveData`/2g'de hiç atanmaz, kullanıcı oynat düğmesine
       basarsa yüklenir. */
    const videolar = Array.from(kok.querySelectorAll<HTMLElement>('[data-video]'));
    if (videolar.length) {
      const sirasi = new Map<HTMLElement, number>(
        videolar.map((k, i) => [k, Number(k.dataset.videoSira ?? Number.NaN) || i]),
      );
      const gorunurler = new Set<HTMLElement>();
      let aktifKutu: HTMLElement | null = null;

      const videosu = (kutu: HTMLElement) => kutu.querySelector('video');

      /* ---- HERO KAPISI: [data-video-bekle="yukleme"] ----
         Mevcut kapı `src`'yi yalnız %50 görünürlükte atıyor. Giriş
         ekranındaki plaka İLK KAREDE görünür olduğu için bu, 971 KB'lık
         klibi doğrudan LCP penceresine sokuyordu. Bu kutular için ÜÇ
         koşul BİRLİKTE istenir (SITE-GIRIS.md "AĞ KAPISI YÜKSELTİLECEK"):
           (1) sayfa yüklenmiş olmalı (`window.load`),
           (2) ana iş parçacığı boşta olmalı (`requestIdleCallback`),
           (3) ağ yeterli olmalı — 2g/slow-2g VE 3g engelli,
               `downlink >= 1.5` istenir.
         Mevcut `data-video` / `data-video-sira` sözleşmesi aynen
         korunuyor, böylece "aynı anda tek video" denetleyicisi hiç
         değişmeden plakaları da yönetir. */
      const dl = baglanti?.downlink;
      const agYeterli =
        !yavasAg &&
        !/(^|-)3g$/.test(baglanti?.effectiveType ?? '') &&
        (typeof dl !== 'number' || dl >= 1.5);
      let yuklemeHazir = false;

      const kaynagiVer = (kutu: HTMLElement): HTMLVideoElement | null => {
        const v = videosu(kutu);
        const kaynak = kutu.dataset.videoKaynak;
        if (!v || !kaynak) return null;
        if (!v.getAttribute('src')) {
          if (kutu.dataset.videoBekle === 'yukleme' && !(yuklemeHazir && agYeterli)) return null;
          // `src` atamak zaten yüklemeyi başlatır; ayrıca `load()` çağırmak
          // hemen ardından gelen play() sözünü iptal ettiriyor.
          v.setAttribute('src', kaynak);
        }
        return v;
      };

      const durdur = (kutu: HTMLElement) => {
        const v = videosu(kutu);
        if (!v || v.paused) return;
        // Bilinçli duraklatma: play() sözü reddedilecek, bunu hata sayma.
        v.dataset.afDevir = '1';
        v.pause();
      };

      const oynat = (kutu: HTMLElement, elle = false) => {
        const v = kaynagiVer(kutu);
        if (!v) return;
        if (aktifKutu && aktifKutu !== kutu) durdur(aktifKutu);
        aktifKutu = kutu;
        delete v.dataset.afDevir;
        if (!v.paused) return;
        v.play()
          .then(() => kutu.removeAttribute('data-video-durum'))
          .catch(() => {
            // Başka bir video devraldığı için reddedildiyse uyarı gösterme.
            if (v.dataset.afDevir) {
              delete v.dataset.afDevir;
              return;
            }
            if (!elle) kutu.setAttribute('data-video-durum', 'elle');
          });
      };

      /** Görünenler arasından en küçük `sira` değerli tek video oynar. */
      const secimiTazele = () => {
        const kazanan = [...gorunurler].sort(
          (a, b) => (sirasi.get(a) ?? 0) - (sirasi.get(b) ?? 0),
        )[0];
        videolar.forEach((k) => {
          if (k !== kazanan) durdur(k);
        });
        if (!kazanan) {
          aktifKutu = null;
          return;
        }
        if (hafif || (kazanan.dataset.videoBekle === 'yukleme' && !agYeterli)) {
          // Veri tasarrufu / 2g-3g: src atanmaz, poster kalır. Normal
          // video kutularında oynat düğmesi çıkar; harf kadrajı
          // plakasında ÇIKMAZ — başlığın ortasında tıklanabilir bir şey
          // durmaz ve durağan dolgu karesi duvarı zaten dolu tutuyor.
          if (kazanan.dataset.videoBekle !== 'yukleme') {
            kazanan.setAttribute('data-video-durum', 'elle');
          }
          return;
        }
        oynat(kazanan);
      };

      /* Hero kapısını aç: window.load → requestIdleCallback → tazele. */
      if (videolar.some((k) => k.dataset.videoBekle === 'yukleme')) {
        let zaman: number | undefined;
        const ac = () => {
          yuklemeHazir = true;
          secimiTazele();
        };
        const bosta = () => {
          const ric = (
            window as Window & {
              requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number;
            }
          ).requestIdleCallback;
          zaman = ric ? ric(ac, { timeout: 1200 }) : window.setTimeout(ac, 1200);
        };
        if (document.readyState === 'complete') bosta();
        else window.addEventListener('load', bosta, { once: true });
        temizle.push(() => {
          window.removeEventListener('load', bosta);
          if (zaman !== undefined) window.clearTimeout(zaman);
        });
      }

      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(
          (girdiler) => {
            for (const g of girdiler) {
              const kutu = g.target as HTMLElement;
              if (g.isIntersecting && g.intersectionRatio >= 0.5) gorunurler.add(kutu);
              else gorunurler.delete(kutu);
            }
            secimiTazele();
          },
          { threshold: [0, 0.5] },
        );
        videolar.forEach((el) => io.observe(el));
        temizle.push(() => io.disconnect());
      }

      const dugmeTikla = (e: Event) => {
        const dugme = (e.target as Element | null)?.closest?.('[data-video-oynat]');
        if (!dugme) return;
        const kutu = dugme.closest<HTMLElement>('[data-video]');
        if (kutu) oynat(kutu, true);
      };
      kok.addEventListener('click', dugmeTikla);
      temizle.push(() => kok.removeEventListener('click', dugmeTikla));
      temizle.push(() => videolar.forEach((k) => videosu(k)?.pause()));
    }

    /* Yazı tipleri yüklenince ölçüler değişir */
    const yenile = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(yenile).catch(() => {});

    return () => {
      temizle.forEach((f) => f());
      bolmeler.forEach((b) => b.revert());
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return null;
}
