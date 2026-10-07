'use client';

import { useEffect } from 'react';

/**
 * HARF KADRAJI — hareket katmanı.
 *
 * TEMEL KARAR: GİRİŞ ANİMASYONU CSS'TİR, GSAP DEĞİL. Satır perdesi,
 * kutup, yarım cümle, KURGU kapısı ve nefes alan ipucu `giris.css`
 * içinde saf CSS keyframe. GSAP buraya YALNIZ iki iş için gelir —
 * ölçek scrub'ı ve nesne zinciri FLIP'i — ve ancak İLK ETKİLEŞİMDEN
 * SONRA `import()` ile indirilir. İlk ekran 0 KB GSAP taşır. 3G ve
 * Instagram içi tarayıcı şartını tek başına çözen karar budur.
 * Mono şeridin devri GSAP'siz: `setTimeout` + iki CSS değişkeni.
 *
 * Bu bileşen hiçbir şey ÇİZMEZ; sunucuda üretilmiş DOM'a davranış
 * bağlar. Yeni `requestAnimationFrame` döngüsü YOKTUR (mevcut tek-rAF
 * kuralı: `gsap.ticker` Lenis'i sürüyor). Devir zamanlayıcısı düz
 * `setTimeout` zinciridir.
 *
 * KASITLI OLARAK YAPILMAYANLAR:
 *  - SplitText: açılış sunucuda basılı satır span'ları + CSS keyframe
 *    ile çıkıyor; kritik JS yolu 3,7 KB hafifliyor ve LCP ögesi hiç
 *    gizlenmiyor.
 *  - Harf itişi (imleçle en yakın 3 harfin kaçması): knockout İKİ metin
 *    katmanının piksel piksel çakışmasına dayanıyor. Harfleri tek tek
 *    itmek iki katmanın hizasını bozma riski taşıyor ve "videonun
 *    dikdörtgen sızması" tam olarak bu yüzden olur. Masaüstü süsü için
 *    konseptin çekirdeği riske edilmedi.
 *  - DrawSVG: aktif hizmetin altındaki iz `transform` ile sürülüyor —
 *    compositor-only ve 0 ek bayt.
 *  - ScrambleTextPlugin: TAMAMEN KALDIRILDI. Gerekçesi aşağıda
 *    (3c bölümü); kazanç 3,7 KB gz.
 */

/* Devir süreleri EŞİT ARALIKLI DEĞİL: sabit dizi, nefes alıyor.
   `Math.random()` yok — rastgelelik CodePen görünümüdür. */
const SURELER = [1250, 900, 1600, 750, 1100] as const;

type Baglanti = { saveData?: boolean; effectiveType?: string; downlink?: number };

export default function GirisEfekti() {
  useEffect(() => {
    const kok = document.getElementById('af-kok');
    if (!kok) return;

    const plakalar = Array.from(document.querySelectorAll<HTMLElement>('.af-hk'));
    if (!plakalar.length) return;

    const azHareket = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const baglanti = (navigator as Navigator & { connection?: Baglanti }).connection;
    const yavasAg =
      baglanti?.saveData === true || /(^|-)(2g|slow-2g)$/.test(baglanti?.effectiveType ?? '');
    const temizle: Array<() => void> = [];

    /* ---------------------------------------------------------------
       1. YEDEK YOL ÖNCE: ne olursa olsun cümle tamamlanabilir durumda.
       GSAP hiç gelmezse ya da az hareket isteniyorsa ilerleme 1'e
       sabitlenir; yüklem satırı kırpılmadan tam görünür.
       --------------------------------------------------------------- */
    const ilerlemeyiSabitle = () =>
      plakalar.forEach((p) => p.style.setProperty('--hk-ilerleme', '1'));

    if (azHareket) {
      ilerlemeyiSabitle();
    }

    /* ---------------------------------------------------------------
       2. VİDEO: hız 0,72× ve çapraz geçiş.
       `playbackRate = 0.72` → 6 sn'lik döngü 8,3 sn gibi okunur,
       640px kaynağın yukarı ölçeklemesinden gelen titreme gizlenir,
       "stok video" acelesi kaybolur. Negatif playbackRate (ping-pong)
       KULLANILMAZ — Safari'de güvenilmez.
       `src` atamasını Efektler.tsx'teki denetleyici yapıyor; biz yalnız
       oynama durumunu dinleyip çapraz geçişi açıyoruz.
       --------------------------------------------------------------- */
    const duzlemler = Array.from(document.querySelectorAll<HTMLElement>('.af-hk-plan[data-video]'));
    duzlemler.forEach((duzlem) => {
      const v = duzlem.querySelector('video');
      if (!v) return;
      const oynadi = () => {
        v.playbackRate = 0.72;
        duzlem.setAttribute('data-hk-oynuyor', '');
      };
      const durdu = () => duzlem.removeAttribute('data-hk-oynuyor');
      v.addEventListener('playing', oynadi);
      v.addEventListener('pause', durdu);
      v.addEventListener('emptied', durdu);
      temizle.push(() => {
        v.removeEventListener('playing', oynadi);
        v.removeEventListener('pause', durdu);
        v.removeEventListener('emptied', durdu);
      });
    });

    /* ---------------------------------------------------------------
       3. EKRAN DIŞINDA TAM SERBEST BIRAKMA
       Plaka görünürden çıkınca `mix-blend-mode: normal` yazılır ve
       `will-change` kaldırılır (CSS, `data-hk-kapali` üzerinden).
       Sayfanın kalanında blend/kompozisyon maliyeti SIFIR olur —
       "cafcaf iki ekranda yoğunlaşır, okuma bölgesini kirletmez"
       sözünün teknik karşılığı budur.
       --------------------------------------------------------------- */
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (girdiler) => {
          for (const g of girdiler) {
            (g.target as HTMLElement).toggleAttribute('data-hk-kapali', !g.isIntersecting);
          }
        },
        { rootMargin: '80px 0px' },
      );
      plakalar.forEach((p) => io.observe(p));
      temizle.push(() => io.disconnect());

      /* KURGU KAPISI — bir kez, göründüğünde. Dönüşüm saf CSS. */
      const kapi = document.querySelector<HTMLElement>('[data-hk-kapi]');
      if (kapi) {
        const kio = new IntersectionObserver(
          (girdiler) => {
            for (const g of girdiler) {
              if (g.isIntersecting) {
                (g.target as HTMLElement).setAttribute('data-hk-gorundu', '');
                kio.unobserve(g.target);
              }
            }
          },
          { threshold: 0.6 },
        );
        kio.observe(kapi);
        temizle.push(() => kio.disconnect());
      }
    }

    /* ---------------------------------------------------------------
       3b. ÜST BAR KUTBU
       Siyah plaka üst barın ALTINDAN geçerken bar koyu kutupta kalır,
       kâğıt banda geçilince eski hâline döner.

       İlk boyamadaki doğru hâl CSS'ten geliyor (`.af:has(.af-hk)
       .af-ustbar` koyu), bu yüzden burada SADECE "artık koyu değil"
       durumunu yazıyoruz — beyaz şerit bir kare bile görünmez ve JS
       gelmezse bar koyu kalır (siyah plakanın üstünde doğru olan bu).

       Ölçüm: üst barın hemen altında 2px'lik bir bant. Koyu plaka o
       bandı kesiyorsa bar koyu, kesmiyorsa açık. GSAP gerektirmez.
       --------------------------------------------------------------- */
    const koyuPlaka = document.querySelector<HTMLElement>('.af-hk[data-hk="koyu"]');
    if (koyuPlaka && 'IntersectionObserver' in window) {
      /* Bandı KİM dolduruyor? Siyah plaka YAPIŞKAN olduğu için beyaz
         plaka üstüne kaydıktan sonra da bandı kesmeye devam ediyor —
         tek başına siyah plakayı izlemek, beyaz plakanın üstünde barı
         koyu bırakıyordu (ölçtüm). Bu yüzden bandı kesebilecek bütün
         yüzeyleri izliyoruz ve bar YALNIZ siyah plaka tek başınaysa
         koyu kalıyor. */
      const yuzeyler: HTMLElement[] = [koyuPlaka];
      document
        .querySelectorAll<HTMLElement>('.af-hk--acik, #af-icerik .af-bant')
        .forEach((el) => yuzeyler.push(el));

      const bantta = new Set<Element>();
      let bio: IntersectionObserver | null = null;
      let bekleyen: number | undefined;

      const tazele = () => {
        const koyuda = bantta.has(koyuPlaka) && bantta.size === 1;
        if (koyuda) kok.removeAttribute('data-ustbar');
        else kok.setAttribute('data-ustbar', 'acik');
      };

      const kur = () => {
        bio?.disconnect();
        bantta.clear();
        const barH = parseFloat(getComputedStyle(kok).getPropertyValue('--af-ustbar-h')) || 64;
        const alt = Math.max(0, window.innerHeight - barH - 2);
        bio = new IntersectionObserver(
          (girdiler) => {
            for (const g of girdiler) {
              if (g.isIntersecting) bantta.add(g.target);
              else bantta.delete(g.target);
            }
            tazele();
          },
          { rootMargin: `-${barH}px 0px -${alt}px 0px`, threshold: 0 },
        );
        yuzeyler.forEach((el) => bio?.observe(el));
      };
      kur();

      const yenidenOlc = () => {
        if (bekleyen !== undefined) window.clearTimeout(bekleyen);
        bekleyen = window.setTimeout(kur, 150);
      };
      window.addEventListener('resize', yenidenOlc, { passive: true });
      window.addEventListener('orientationchange', yenidenOlc, { passive: true });
      temizle.push(() => {
        window.removeEventListener('resize', yenidenOlc);
        window.removeEventListener('orientationchange', yenidenOlc);
        if (bekleyen !== undefined) window.clearTimeout(bekleyen);
        bio?.disconnect();
        kok.removeAttribute('data-ustbar');
      });
    }

    /* ---------------------------------------------------------------
       3c. MONO DEVİR ŞERİDİ — KAYAN İZ (ScrambleText YOK)

       ScrambleText KALDIRILDI ve geri gelmeyecek. Gerekçe ölçüm:
       1200px'te alınan tek bir karede şerit
       "SUSFGMYQAJBTSNRWSBWJV · DRONE ÇEKİMİ · …" görünüyordu. Uzun bir
       Türkçe hizmet adı bir an için rastgele harfe dönünce ekran
       "bozuk site" gibi okunuyor — bu site satış görüşmesinde müşteriye
       açılacak, tek kare bile böyle görünemez. Marka adlarını kuyruğa
       almak sorunun yalnız yarısını çözdü; asıl sorun OKUNMAYAN METNİN
       KENDİSİ.

       Yerine geçen devir, hiçbir karede metni bozmaz:
         - Aktif adın altındaki 2px turuncu iz TEK ögedir ve addan ada
           KAYAR: tek `transform` (translateX + scaleX), compositor-only.
         - Aktif ad tam opak ve vurgu renginde; pasifler `--af-metin-3`.
         - Aktif ad 1px yukarı kalkar (yine `transform`).
       Harf aralığı/kalınlık DEĞİŞTİRİLMEZ: ikisi de şeridi yeniden
       akıtır (reflow) ve kayan izin hedef genişliğini kaydırır.

       GSAP GEREKTİRMEZ: `setTimeout` zinciri + iki CSS değişkeni. Bu
       sayede GSAP hiç gelmese bile şerit çalışır ve `ScrambleTextPlugin`
       paketten tamamen çıktı (3,7 KB gz kazanç).
       --------------------------------------------------------------- */
    const serit = document.querySelector<HTMLElement>('[data-hk-serit]');
    const mobil = window.matchMedia('(max-width: 700px)').matches;
    if (serit && !azHareket && !yavasAg && !mobil) {
      const ogeler = Array.from(serit.querySelectorAll<HTMLLIElement>('li[data-hk-oge]'));
      const iz = serit.querySelector<HTMLElement>('.af-hk-iz');
      if (ogeler.length > 1 && iz) {
        let i = 0;
        let sayac: number | undefined;
        let duruyor = false;

        const iziTasi = (li: HTMLLIElement) => {
          const a = li.querySelector<HTMLAnchorElement>('a');
          if (!a) return;
          // `offsetLeft` ve iz'in `left:0`'ı aynı dolgu kutusuna göre
          // ölçülüyor; iz 1px tabanlı olduğu için scaleX = piksel genişlik.
          serit.style.setProperty('--hk-iz-x', `${a.offsetLeft}px`);
          serit.style.setProperty('--hk-iz-g', String(a.offsetWidth));
        };

        const isaretle = (k: number) => {
          i = k;
          ogeler.forEach((li, n) => li.classList.toggle('is-aktif', n === k));
          iziTasi(ogeler[k]);
        };

        const devret = () => {
          if (iptal) return;
          isaretle((i + 1) % ogeler.length);
          sayac = window.setTimeout(devret, SURERi(i));
        };

        const bekle = () => {
          if (sayac !== undefined) window.clearTimeout(sayac);
          sayac = undefined;
        };
        const surdur = () => {
          if (duruyor || sayac !== undefined || iptal) return;
          sayac = window.setTimeout(devret, 900);
        };

        // İlk yerleşim geçişsiz olsun; iz yerine oturduktan SONRA
        // `data-hk-iz` ile görünür hâle gelip kaymaya başlar.
        isaretle(0);
        const ilk = requestAnimationFrame(() => serit.setAttribute('data-hk-iz', ''));

        // Odak/işaretçi gelince devir DURUR; beş bağlantı da okunur
        // kalır (CSS `:focus-within` hepsini tam parlaklığa çeker).
        const dur = () => {
          duruyor = true;
          bekle();
        };
        const devam = () => {
          duruyor = false;
          surdur();
        };
        serit.addEventListener('focusin', dur);
        serit.addEventListener('focusout', devam);
        serit.addEventListener('pointerenter', dur);
        serit.addEventListener('pointerleave', devam);

        const gorunurluk = () => (document.hidden ? bekle() : surdur());
        document.addEventListener('visibilitychange', gorunurluk);

        // Ölçüler değişince iz kayar: yazı tipi gelince ve yeniden
        // boyutlandırmada hedefi tazele.
        let olcBekle: number | undefined;
        const yenidenOlc = () => {
          if (olcBekle !== undefined) window.clearTimeout(olcBekle);
          olcBekle = window.setTimeout(() => iziTasi(ogeler[i]), 120);
        };
        window.addEventListener('resize', yenidenOlc, { passive: true });
        document.fonts?.ready.then(() => iziTasi(ogeler[i])).catch(() => {});

        let sio: IntersectionObserver | null = null;
        if ('IntersectionObserver' in window) {
          sio = new IntersectionObserver((g) => (g.some((x) => x.isIntersecting) ? surdur() : bekle()), {
            threshold: 0,
          });
          sio.observe(serit);
        } else {
          surdur();
        }

        temizle.push(() => {
          bekle();
          cancelAnimationFrame(ilk);
          if (olcBekle !== undefined) window.clearTimeout(olcBekle);
          sio?.disconnect();
          serit.removeEventListener('focusin', dur);
          serit.removeEventListener('focusout', devam);
          serit.removeEventListener('pointerenter', dur);
          serit.removeEventListener('pointerleave', devam);
          document.removeEventListener('visibilitychange', gorunurluk);
          window.removeEventListener('resize', yenidenOlc);
          serit.removeAttribute('data-hk-iz');
          serit.style.removeProperty('--hk-iz-x');
          serit.style.removeProperty('--hk-iz-g');
          ogeler.forEach((li) => li.classList.remove('is-aktif'));
        });
      }
    }

    /* ---------------------------------------------------------------
       4. GSAP — yalnız ölçek scrub'ı ve nesne zinciri, yalnız ilk
       etkileşimden/boştan sonra.
       --------------------------------------------------------------- */
    let iptal = false;
    const gsapTemizle: Array<() => void> = [];

    async function gsapKur() {
      if (iptal || azHareket) return;
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ]);
        if (iptal) return;
        gsap.registerPlugin(ScrollTrigger);

        /* --- 4a. ÖLÇEK SCRUB'I: kaydırmanın ödülü CÜMLENİN TAMAMLANMASI
           Tek CSS değişkeni yazılır; `transform: scale()` ve opaklık
           CSS tarafında ondan türetilir → tek `transform`, reflow yok.
           Scrub'a bağlı, hıza bağlı değil; geri kaydırırsan geri alır.
           PIN YOK, SNAP YOK, scroll-jacking YOK. */
        const koyu = document.querySelector<HTMLElement>('.af-hk[data-hk="koyu"]');
        const yuva = koyu?.closest<HTMLElement>('.af-hk-yuva') ?? null;
        if (koyu && yuva) {
          const oyuk = koyu.querySelector<HTMLElement>('[data-hk-oyuk]');
          /* Scrub mesafesi = yapışkan yolun İLK %55'i. Kalan %45'te
             beyaz plaka içeri kayar; cümle o zamana kadar çoktan
             tamamlanmış olur. Yapışkan kapalıysa (mobil / kısa ekran)
             yol 0'a düşer ve 40svh'lik sabit mesafeye geçilir. */
          const st = ScrollTrigger.create({
            trigger: yuva,
            start: 'top top',
            end: () => {
              const yolu = yuva.offsetHeight - koyu.offsetHeight;
              return `+=${Math.round(yolu > 10 ? yolu * 0.55 : window.innerHeight * 0.4)}`;
            },
            scrub: true,
            invalidateOnRefresh: true,
            onToggle: (self) => {
              // `will-change` YALNIZ scrub süresince yaşar.
              if (oyuk) oyuk.toggleAttribute('data-hk-surukle', self.isActive);
            },
            onUpdate: (self) => {
              koyu.style.setProperty('--hk-ilerleme', self.progress.toFixed(4));
            },
            onRefreshInit: () => {
              koyu.style.setProperty('--hk-ilerleme', '0');
            },
          });
          gsapTemizle.push(() => {
            st.kill();
            koyu.style.removeProperty('--hk-ilerleme');
            oyuk?.removeAttribute('data-hk-surukle');
          });
          ScrollTrigger.refresh();
        }

        /* --- 4b. NESNE ZİNCİRİ — ilk ekranın adları eksik çiplerine devreder
           Ziyaretçinin ilk ekranda okuduğu kelime, iki kaydırma sonra
           teklif kapsamının satırının üstüne iner. Elle FLIP: hero
           çiplerinin konumu hero ekrandayken ölçülür, "Neyin eksik"
           ızgarası görününce hayaletler o konumdan hedef çipe uçar.

           GSAP `Flip` eklentisi (9,5 KB gz) KULLANILMADI: beş öge için
           `getBoundingClientRect` + `gsap.fromTo` yeterli.

           DÜRÜSTLÜK SINIRI: hedef çip SEÇİLMEZ, yalnız bir kez işaret
           edilir. Ziyaretçinin söylemediği bir eksiği forma yazmak
           "uydurma yok" kuralının ihlali olurdu. */
        const hedefKap = document.querySelector<HTMLElement>('#eksikler .af-cipler');
        const zincirCipleri = serit
          ? Array.from(serit.querySelectorAll<HTMLAnchorElement>('a[data-hk-eksik]'))
          : [];
        if (hedefKap && zincirCipleri.length && 'IntersectionObserver' in window) {
          // Hero ekrandayken ölç: aşağı inildiğinde şerit çoktan gitmiş olur.
          const konumlar = new Map<string, { x: number; ad: string }>();
          const olc = () => {
            zincirCipleri.forEach((a) => {
              const anahtar = a.dataset.hkEksik;
              const kutu = a.getBoundingClientRect();
              if (!anahtar || kutu.width === 0) return;
              konumlar.set(anahtar, {
                x: kutu.left + kutu.width / 2,
                ad: a.querySelector<HTMLElement>('[data-hk-ad]')?.dataset.hkAd ?? '',
              });
            });
          };
          olc();

          const hayaletler: HTMLElement[] = [];
          const devirEt = () => {
            let sira = 0;
            konumlar.forEach((bilgi, anahtar) => {
              const girdi = hedefKap.querySelector<HTMLInputElement>(
                `input[value="${CSS.escape(anahtar)}"]`,
              );
              const etiket = girdi?.closest<HTMLElement>('label');
              if (!etiket || !bilgi.ad) return;
              const hedefKutu = etiket.getBoundingClientRect();

              const hayalet = document.createElement('span');
              hayalet.className = 'af-hk-hayalet';
              hayalet.setAttribute('aria-hidden', 'true');
              hayalet.textContent = bilgi.ad;
              document.body.appendChild(hayalet);
              hayaletler.push(hayalet);

              const kendi = hayalet.getBoundingClientRect();
              const basX = Math.min(
                Math.max(bilgi.x - kendi.width / 2, 10),
                Math.max(10, window.innerWidth - kendi.width - 10),
              );
              const bitir = () => {
                hayalet.remove();
                const k = hayaletler.indexOf(hayalet);
                if (k >= 0) hayaletler.splice(k, 1);
                etiket.classList.add('af-hk-devir');
                window.setTimeout(() => etiket.classList.remove('af-hk-devir'), 1300);
              };

              gsap.fromTo(
                hayalet,
                { x: basX, y: -26, opacity: 0 },
                {
                  x: hedefKutu.left + 14,
                  y: hedefKutu.top + (hedefKutu.height - kendi.height) / 2,
                  opacity: 1,
                  duration: 0.52,
                  ease: 'power3.out',
                  delay: sira * 0.07,
                  onComplete: () => gsap.to(hayalet, { opacity: 0, duration: 0.22, onComplete: bitir }),
                },
              );
              sira += 1;
            });
          };

          const dio = new IntersectionObserver(
            (g) => {
              if (!g.some((x) => x.isIntersecting && x.intersectionRatio >= 0.35)) return;
              dio.disconnect();
              devirEt();
            },
            { threshold: [0, 0.35] },
          );
          dio.observe(hedefKap);
          gsapTemizle.push(() => {
            dio.disconnect();
            hayaletler.splice(0).forEach((h) => h.remove());
          });
        }
      } catch {
        // GSAP gelmezse giriş bozulmaz: cümleyi tamamlayıp bırakırız.
        ilerlemeyiSabitle();
      }
    }

    /** Sabit süre dizisinden oku (elle yazılmış, rastgele değil). */
    function SURERi(k: number) {
      return SURELER[k % SURELER.length];
    }

    /* İlk etkileşim VEYA boşta — hangisi önce olursa. */
    let kuruldu = false;
    const basla = () => {
      if (kuruldu) return;
      kuruldu = true;
      kapilariKaldir();
      void gsapKur();
    };
    const olaylar: Array<keyof WindowEventMap> = ['scroll', 'wheel', 'touchstart', 'pointerdown'];
    const kapilariKaldir = () => {
      olaylar.forEach((o) => window.removeEventListener(o, basla));
    };
    olaylar.forEach((o) => window.addEventListener(o, basla, { passive: true, once: true }));

    // Boşta kalma kapısı: `requestIdleCallback` yoksa (Safari <17)
    // zamanlayıcıya düşer. İlk etkileşim hangisi önce gelirse o kazanır.
    const bostaVar = typeof window.requestIdleCallback === 'function';
    const zaman = bostaVar
      ? window.requestIdleCallback(basla, { timeout: 2600 })
      : window.setTimeout(basla, 1600);

    temizle.push(() => {
      iptal = true;
      kapilariKaldir();
      if (bostaVar && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(zaman);
      } else {
        window.clearTimeout(zaman);
      }
      gsapTemizle.forEach((f) => f());
    });

    return () => temizle.forEach((f) => f());
  }, []);

  return null;
}
