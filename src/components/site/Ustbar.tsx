'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ILETISIM, siteYolu, whatsappBaglantisi } from '@/lib/site';
import Dugme from './Dugme';
import { IkonWhatsApp, MarkaLogosu } from './Ikonlar';

/* ------------------------------------------------------------------ */
/* Menü verisi                                                         */
/*                                                                     */
/* ŞİMDİLİK burada sabit duruyor. `src/lib/site-icerik.ts` (içerik      */
/* ajanı) hazır olunca TEK satırla oraya taşınır:                       */
/*                                                                     */
/*   import { NAV, BIRINCIL_CAGRI } from '@/lib/site-icerik';           */
/*   … <Ustbar nav={NAV} cagri={BIRINCIL_CAGRI} />                      */
/*                                                                     */
/* `NavOge` tipi site-icerik.ts'tekiyle BİREBİR aynı: { etiket, href,   */
/* aciklama?, alt? }. Bu yüzden geçiş sırasında hiçbir şey değişmez.    */
/* `href` değerleri site köküne göredir; siteYolu() burada uygulanır.   */
/* ------------------------------------------------------------------ */

export type NavOge = {
  etiket: string;
  href: string;
  aciklama?: string;
  alt?: NavOge[];
};

const NAV_VARSAYILAN: NavOge[] = [
  {
    etiket: 'Hizmetler',
    href: '/hizmetler',
    aciklama: 'Sosyal medya, prodüksiyon, reklam, web ve yazılım',
    alt: [
      { etiket: 'Sosyal medya yönetimi', href: '/hizmetler/sosyal-medya-yonetimi', aciklama: 'Hesapların düzenli ve tutarlı yönetimi' },
      { etiket: 'İçerik stratejisi ve planlama', href: '/hizmetler/icerik-stratejisi', aciklama: 'Hedefi olan içerik takvimi' },
      { etiket: 'Fotoğraf çekimi', href: '/hizmetler/fotograf-cekimi', aciklama: 'Ürün, mekân ve ekip çekimleri' },
      { etiket: 'Video ve Reels prodüksiyonu', href: '/hizmetler/video-produksiyon', aciklama: 'Fikirden kurguya kısa video' },
      { etiket: 'Drone çekimi', href: '/hizmetler/drone-cekimi', aciklama: 'Havadan görüntü' },
      { etiket: 'Meta reklam yönetimi', href: '/hizmetler/meta-reklam-yonetimi', aciklama: 'Instagram ve Facebook kampanyaları' },
      { etiket: 'Google Ads yönetimi', href: '/hizmetler/google-ads-yonetimi', aciklama: 'Arama ve harita reklamları' },
      { etiket: 'Google İşletme Profili', href: '/hizmetler/google-isletme-profili', aciklama: 'Haritalarda doğru görünüm' },
      { etiket: 'Web sitesi tasarımı ve yazılımı', href: '/hizmetler/web-sitesi-tasarimi', aciklama: 'Sektöre özel entegrasyonlu siteler' },
      { etiket: 'QR dijital menü', href: '/hizmetler/qr-dijital-menu', aciklama: 'Çok dilli menü, sipariş, rezervasyon' },
      { etiket: 'Grafik tasarım ve kurumsal kimlik', href: '/hizmetler/kurumsal-kimlik-tasarim', aciklama: 'Logo, menü, katalog' },
      { etiket: 'Veri analizi ve raporlama', href: '/hizmetler/veri-analizi-raporlama', aciklama: 'Tahmin değil ölçüm' },
    ],
  },
  {
    etiket: 'Sektörler',
    href: '/sektorler',
    aciklama: 'İşinize göre web sitesi ve sosyal medya kurgusu',
    alt: [
      { etiket: 'Go kart ve eğlence merkezi', href: '/sektorler/go-kart-eglence-merkezi', aciklama: 'Seans takvimi ve rezervasyon' },
      { etiket: 'Oto galeri ve otomotiv', href: '/sektorler/oto-galeri', aciklama: 'Değerleme formu ve ilan akışı' },
      { etiket: 'Kafe ve restoran', href: '/sektorler/kafe-restoran', aciklama: 'QR menü, sipariş, rezervasyon' },
      { etiket: 'Avukat ve hukuk bürosu', href: '/sektorler/avukat-hukuk', aciklama: 'Randevu ve KVKK uyumlu form' },
      { etiket: 'Mimar ve iç mimar', href: '/sektorler/mimar-ic-mimar', aciklama: 'Proje galerisi' },
      { etiket: 'Diş kliniği ve sağlık', href: '/sektorler/dis-klinigi-saglik', aciklama: 'Randevu ve mevzuata uygun tanıtım' },
      { etiket: 'Spor salonu', href: '/sektorler/spor-salonu', aciklama: 'Deneme dersi ve ders programı' },
      { etiket: 'Anaokulu ve eğitim', href: '/sektorler/anaokulu-egitim', aciklama: 'Kayıt formu ve veli bilgilendirme' },
      { etiket: 'Güzellik salonu ve kuaför', href: '/sektorler/guzellik-kuafor', aciklama: 'Online randevu' },
      { etiket: 'Otel ve turizm', href: '/sektorler/otel-turizm', aciklama: 'Rezervasyon ve çok dilli site' },
      { etiket: 'Emlak ve inşaat', href: '/sektorler/emlak-insaat', aciklama: 'Portföy ve proje sayfaları' },
      { etiket: 'Mağaza ve e-ticaret', href: '/sektorler/magaza-eticaret', aciklama: 'Ürün vitrini, WhatsApp sipariş' },
    ],
  },
  { etiket: 'Çalışmalar', href: '/calismalar', aciklama: 'Gerçek markalar, gerçek işler' },
  { etiket: 'Rehber', href: '/rehber', aciklama: 'Mevzuat, reklam ve web sitesi rehberleri' },
  { etiket: 'Hakkımızda', href: '/hakkimizda' },
  { etiket: 'İletişim', href: '/iletisim' },
];

const CAGRI_VARSAYILAN = { etiket: 'Ücretsiz analiz', href: '/analiz' };

type Props = {
  nav?: NavOge[];
  cagri?: { etiket: string; href: string };
  /** Koyu hero ile başlayan sayfalarda üst bar da koyu olur. */
  koyu?: boolean;
};

const OK = (
  <svg className="af-menu-ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Yapışkan, cam efektli üst bar.
 *
 *  - Açılır menüler `<details>` tabanlı: JAVASCRIPT OLMADAN DA AÇILIR.
 *    `name` niteliği sayesinde aynı anda yalnız biri açık kalır.
 *  - Klavye: <summary> doğal olarak odaklanır, Enter/Space açar, Esc kapatır,
 *    Tab panelin içine girer.
 *  - Mobilde tam ekran menü: odak menünün içinde döner, Esc kapatır,
 *    sayfa kaydırması kilitlenir.
 */
export default function Ustbar({ nav = NAV_VARSAYILAN, cagri = CAGRI_VARSAYILAN, koyu }: Props) {
  const kokRef = useRef<HTMLElement>(null);
  const mobilRef = useRef<HTMLDetailsElement>(null);
  const yol = usePathname();

  const hepsiniKapat = useCallback(() => {
    kokRef.current?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach((d) => {
      d.open = false;
    });
  }, []);

  /* Sayfa değişince menüler kapanır */
  useEffect(() => {
    hepsiniKapat();
  }, [yol, hepsiniKapat]);

  /* Esc, dışarı tıklama, bağlantıya tıklama, geniş ekrana geçiş */
  useEffect(() => {
    const kok = kokRef.current;
    if (!kok) return;

    const tus = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const acik = kok.querySelector<HTMLDetailsElement>('details[open]');
      if (!acik) return;
      e.preventDefault();
      acik.open = false;
      acik.querySelector('summary')?.focus();
    };

    const disTiklama = (e: PointerEvent) => {
      const hedef = e.target as Node | null;
      if (hedef && kok.contains(hedef)) return;
      kok.querySelectorAll<HTMLDetailsElement>('details[open]').forEach((d) => {
        d.open = false;
      });
    };

    const bagTiklama = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]');
      if (a && kok.contains(a)) hepsiniKapat();
    };

    const genis = window.matchMedia('(min-width: 1000px)');
    const genisDegisti = () => {
      if (genis.matches && mobilRef.current) mobilRef.current.open = false;
    };

    document.addEventListener('keydown', tus);
    document.addEventListener('pointerdown', disTiklama, true);
    kok.addEventListener('click', bagTiklama);
    genis.addEventListener('change', genisDegisti);
    return () => {
      document.removeEventListener('keydown', tus);
      document.removeEventListener('pointerdown', disTiklama, true);
      kok.removeEventListener('click', bagTiklama);
      genis.removeEventListener('change', genisDegisti);
    };
  }, [hepsiniKapat]);

  /* Mobil menü: kaydırma kilidi + odak tuzağı */
  useEffect(() => {
    const mobil = mobilRef.current;
    if (!mobil) return;

    const odaklanabilirler = () =>
      Array.from(
        mobil.querySelectorAll<HTMLElement>(
          'summary, a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null || el.tagName === 'SUMMARY');

    const tuzak = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !mobil.open) return;
      const liste = odaklanabilirler();
      if (!liste.length) return;
      const ilk = liste[0];
      const son = liste[liste.length - 1];
      if (e.shiftKey && document.activeElement === ilk) {
        e.preventDefault();
        son.focus();
      } else if (!e.shiftKey && document.activeElement === son) {
        e.preventDefault();
        ilk.focus();
      }
    };

    const degisti = () => {
      // html + body birlikte: Lenis `html`i kaydırıyor olabilir.
      document.documentElement.classList.toggle('af-menu-kilit', mobil.open);
      document.body.classList.toggle('af-menu-kilit', mobil.open);
      if (mobil.open) {
        document.addEventListener('keydown', tuzak);
        // İlk bağlantıya odaklan (ekran okuyucu menüye girsin)
        requestAnimationFrame(() => {
          mobil.querySelector<HTMLElement>('.af-mobil-panel a, .af-mobil-panel summary')?.focus({ preventScroll: true });
        });
      } else {
        document.removeEventListener('keydown', tuzak);
      }
    };

    mobil.addEventListener('toggle', degisti);
    return () => {
      mobil.removeEventListener('toggle', degisti);
      document.removeEventListener('keydown', tuzak);
      document.documentElement.classList.remove('af-menu-kilit');
      document.body.classList.remove('af-menu-kilit');
    };
  }, []);

  const aktifMi = (href: string) => yol === siteYolu(href);
  const waAdresi = whatsappBaglantisi(
    'Merhaba, Ajans Flow sitesinden yazıyorum. Ücretsiz dijital analiz istiyorum.',
  );

  return (
    <header
      ref={kokRef}
      className={['af-ustbar', koyu ? 'af-ustbar--koyu' : ''].filter(Boolean).join(' ')}
      data-ustbar=""
    >
      <div className="af-kap af-ustbar-ic">
        <a className="af-logo" href={siteYolu('/')}>
          <MarkaLogosu boyut={30} />
          <span className="af-gizli-metin">Ajans Flow — ana sayfa</span>
        </a>

        <nav className="af-ana-menu" aria-label="Ana menü">
          <ul>
            {nav.map((oge) =>
              oge.alt?.length ? (
                <li key={oge.href}>
                  <details className="af-mega" name="af-mega">
                    <summary className="af-menu-dugme">
                      {oge.etiket}
                      {OK}
                    </summary>
                    <div className="af-mega-panel">
                      <div className="af-mega-baslik">
                        <span className="af-ust-etiket">{oge.etiket}</span>
                        <a className="af-bag-ok" href={siteYolu(oge.href)}>
                          Tüm {oge.etiket.toLocaleLowerCase('tr')}
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                            <path d="M4.5 12h15M13.5 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                      </div>
                      <ul className="af-mega-liste">
                        {oge.alt.map((alt) => (
                          <li key={alt.href}>
                            <a className="af-mega-oge" href={siteYolu(alt.href)}>
                              <span className="af-mega-oge-ad">{alt.etiket}</span>
                              {alt.aciklama ? <span className="af-mega-oge-not">{alt.aciklama}</span> : null}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </li>
              ) : (
                <li key={oge.href}>
                  <a
                    className="af-menu-bag"
                    href={siteYolu(oge.href)}
                    aria-current={aktifMi(oge.href) ? 'page' : undefined}
                  >
                    {oge.etiket}
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="af-ustbar-sag">
          <a
            className="af-ikon-dugme af-mobil-gizle"
            href={waAdresi}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp'tan yazın"
          >
            <IkonWhatsApp />
          </a>
          <Dugme href={siteYolu(cagri.href)} sinif="af-ustbar-cagri">
            {cagri.etiket}
          </Dugme>

          {/* ---- Mobil tam ekran menü (<details> → JS'siz de açılır) ---- */}
          <details className="af-mobil" ref={mobilRef}>
            <summary className="af-hamburger">
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span className="af-gizli-metin">Menü</span>
            </summary>
            <div className="af-mobil-panel" role="dialog" aria-modal="true" aria-label="Site menüsü">
              <nav aria-label="Mobil menü">
                <ul className="af-mobil-liste">
                  {nav.map((oge, i) => (
                    <li key={oge.href}>
                      {oge.alt?.length ? (
                        <details className="af-mobil-grup" name="af-mobil-grup">
                          <summary className="af-mobil-bag">
                            <span>{oge.etiket}</span>
                            {OK}
                          </summary>
                          <ul className="af-mobil-alt-liste">
                            <li>
                              <a className="af-mobil-alt-bag" href={siteYolu(oge.href)}>
                                Tümü →
                              </a>
                            </li>
                            {oge.alt.map((alt) => (
                              <li key={alt.href}>
                                <a className="af-mobil-alt-bag" href={siteYolu(alt.href)}>
                                  {alt.etiket}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </details>
                      ) : (
                        <a
                          className="af-mobil-bag"
                          href={siteYolu(oge.href)}
                          aria-current={aktifMi(oge.href) ? 'page' : undefined}
                        >
                          <span>{oge.etiket}</span>
                          <small>{String(i + 1).padStart(2, '0')}</small>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="af-mobil-eylem">
                <Dugme href={siteYolu(cagri.href)} blok buyuk>
                  {cagri.etiket}
                </Dugme>
                <Dugme tur="ikincil" href={waAdresi} blok whatsapp>
                  <IkonWhatsApp />
                  WhatsApp&apos;tan yazın
                </Dugme>
                <p className="af-mobil-kunye">
                  {ILETISIM.telefonGorunum} · {ILETISIM.adres}
                </p>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
