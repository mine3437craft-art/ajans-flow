import { ILETISIM, MARKA, siteYolu, whatsappBaglantisi } from '@/lib/site';
import type { NavOge } from './Ustbar';
import {
  IkonEposta,
  IkonInstagram,
  IkonKonum,
  IkonTelefon,
  IkonWhatsApp,
  MarkaLogosu,
} from './Ikonlar';

/* ------------------------------------------------------------------ */
/* Alt bilgi menüsü — şimdilik burada sabit (seçilmiş, kısa liste).     */
/* `site-icerik.ts` gelince layout'tan prop olarak geçilir:             */
/*   import { NAV, ALT_MENU } from '@/lib/site-icerik';                 */
/*   <Altbilgi sutunlar={[…NAV]} yasal={ALT_MENU} />                    */
/* Hizmet ve sektör sayfalarının TAMAMI zaten üst bardaki mega menüde   */
/* SSR olarak basılıyor; burada kısa liste yeterli.                     */
/* ------------------------------------------------------------------ */

const SUTUNLAR_VARSAYILAN: NavOge[] = [
  {
    etiket: 'Hizmetler',
    href: '/hizmetler',
    alt: [
      { etiket: 'Sosyal medya yönetimi', href: '/hizmetler/sosyal-medya-yonetimi' },
      { etiket: 'Video ve Reels prodüksiyonu', href: '/hizmetler/video-produksiyon' },
      { etiket: 'Fotoğraf çekimi', href: '/hizmetler/fotograf-cekimi' },
      { etiket: 'Meta reklam yönetimi', href: '/hizmetler/meta-reklam-yonetimi' },
      { etiket: 'Web sitesi tasarımı', href: '/hizmetler/web-sitesi-tasarimi' },
      { etiket: 'QR dijital menü', href: '/qr-menu' },
      { etiket: 'Tüm hizmetler', href: '/hizmetler' },
    ],
  },
  {
    etiket: 'Sektörler',
    href: '/sektorler',
    alt: [
      { etiket: 'Kafe ve restoran', href: '/sektorler/kafe-restoran' },
      { etiket: 'Oto galeri ve otomotiv', href: '/sektorler/oto-galeri' },
      { etiket: 'Go kart ve eğlence merkezi', href: '/sektorler/go-kart-eglence-merkezi' },
      { etiket: 'Mimar ve iç mimar', href: '/sektorler/mimar-ic-mimar' },
      { etiket: 'Diş kliniği ve sağlık', href: '/sektorler/dis-klinigi-saglik' },
      { etiket: 'Tüm sektörler', href: '/sektorler' },
    ],
  },
  {
    etiket: 'Yazılım',
    href: '/otomotiv-yazilimlari',
    alt: [
      { etiket: 'Otomotiv yazılımları', href: '/otomotiv-yazilimlari' },
      { etiket: 'Araç değerleme', href: '/otomotiv-yazilimlari/arac-degerleme' },
      { etiket: 'İlan hazırlama', href: '/otomotiv-yazilimlari/ilan-hazirlama' },
      { etiket: 'Galeri muhasebesi', href: '/otomotiv-yazilimlari/galeri-muhasebe' },
      { etiket: 'QR menü demosu', href: '/demo/qr-menu' },
    ],
  },
  {
    etiket: 'Kurumsal',
    href: '/hakkimizda',
    alt: [
      { etiket: 'Hakkımızda', href: '/hakkimizda' },
      { etiket: 'Çalışmalar', href: '/calismalar' },
      { etiket: 'Rehber', href: '/rehber' },
      { etiket: 'Ücretsiz dijital analiz', href: '/analiz' },
      { etiket: 'İletişim', href: '/iletisim' },
    ],
  },
];

const YASAL_VARSAYILAN: NavOge[] = [
  { etiket: 'Gizlilik Politikası', href: '/gizlilik' },
  { etiket: 'KVKK Aydınlatma Metni', href: '/kvkk' },
];

type Props = {
  sutunlar?: NavOge[];
  yasal?: NavOge[];
};

/**
 * Site alt bilgisi — her zaman KOYU bant (yazılım kanadının rengi),
 * dört bağlantı sütunu + NAP (isim-adres-telefon) bloğu.
 *
 * NAP bilgisi Google İşletme Profili ve JSON-LD ile BİREBİR aynı olmalı;
 * tek kaynak `src/lib/site.ts` → `ILETISIM`. Çalışma saati yazılmaz
 * (sahibi istemedi).
 */
export default function Altbilgi({ sutunlar = SUTUNLAR_VARSAYILAN, yasal = YASAL_VARSAYILAN }: Props) {
  const yil = new Date().getFullYear();
  const wa = whatsappBaglantisi('Merhaba, Ajans Flow sitesinden yazıyorum.');

  return (
    <footer className="af-altbilgi" data-alt-cta-gizle="">
      <div className="af-kap">
        <div className="af-altbilgi-ust">
          <div className="af-altbilgi-marka">
            <a className="af-logo af-logo--buyuk" href={siteYolu('/')}>
              <MarkaLogosu boyut={44} />
              <span className="af-gizli-metin">Ajans Flow — ana sayfa</span>
            </a>
            <p className="af-ikincil-metin" style={{ fontSize: 'var(--af-y-kucuk)', maxWidth: '34ch' }}>
              İçeriği de yazılımı da aynı ekip yazıyor. {MARKA.slogan}
            </p>
            <div className="af-sosyal">
              <a
                className="af-ikon-dugme"
                href={ILETISIM.instagramProfil}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram: @${ILETISIM.instagram}`}
              >
                <IkonInstagram />
              </a>
              <a className="af-ikon-dugme" href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <IkonWhatsApp />
              </a>
              <a className="af-ikon-dugme" href={ILETISIM.telefonBaglanti} aria-label="Telefonla arayın">
                <IkonTelefon />
              </a>
            </div>
          </div>

          {sutunlar.map((sutun) => (
            <nav className="af-altbilgi-grup" key={sutun.href} aria-label={sutun.etiket}>
              <h3>{sutun.etiket}</h3>
              <ul>
                {(sutun.alt ?? [{ etiket: sutun.etiket, href: sutun.href }]).map((oge) => (
                  <li key={oge.href}>
                    <a href={siteYolu(oge.href)}>{oge.etiket}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="af-altbilgi-grup">
            <h3>İletişim</h3>
            <address className="af-nap" style={{ fontStyle: 'normal' }}>
              <a href={ILETISIM.telefonBaglanti}>
                <IkonTelefon />
                {ILETISIM.telefonGorunum}
              </a>
              <a href={`mailto:${ILETISIM.eposta}`}>
                <IkonEposta />
                {ILETISIM.eposta}
              </a>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--af-b-8)' }}>
                <IkonKonum />
                {ILETISIM.adres}
              </span>
              <a href={ILETISIM.instagramProfil} target="_blank" rel="noopener noreferrer">
                <IkonInstagram />@{ILETISIM.instagram}
              </a>
            </address>
          </div>
        </div>

        <div className="af-altbilgi-alt">
          <p>
            © {yil} {MARKA.ad}. Tüm hakları saklıdır.
          </p>
          <nav className="af-altbilgi-yasal" aria-label="Yasal">
            {yasal.map((y) => (
              <a key={y.href} href={siteYolu(y.href)}>
                {y.etiket}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
