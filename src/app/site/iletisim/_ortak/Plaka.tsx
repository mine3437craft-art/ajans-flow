import type { CSSProperties, ReactNode } from 'react';
import { medyaYolu } from '@/lib/site-icerik';
import './plaka.css';

/* Harf kadrajının içine giren TEK uygun kare: 1024×576 YATAY, 18 KB AVIF
   (26 KB WebP yedeği). Dikey klipler kadraja GİRMEZ — bir satırlık
   açıklık ~5:1 geniştir, 404×720 bir kareyi oraya `cover` ile koymak
   2,5× yukarı ölçekleme demektir (bulanık ve amatör). Bu kare ise
   AŞAĞI ölçekleniyor: 1024 px'lik kaynak en geniş kullanımda ~640 px'lik
   bir kutuya oturuyor. */
const DOLGU_AVIF = medyaYolu('poster/hk-dolgu-gece-grid.avif');
const DOLGU_WEBP = medyaYolu('poster/hk-dolgu-gece-grid.webp');

type PlakaProps = {
  children: ReactNode;
  /** İçeriği dar kapsayıcıya al (yasal/teşekkür gibi kısa ekranlar). */
  dar?: boolean;
  id?: string;
  sinif?: string;
};

/**
 * PLAKA — üçüncü ve NADİR yüzey (bant değil, BAŞLIK ANI).
 * "Bant = okunan içerik, plaka = başlık anı." Bir sayfada EN ÇOK BİR kez;
 * marka bantları (#0E0E16 / #F7F5F2) dokunulmaz.
 *
 * Koyu bandın dokuz değişkenini devralır (`af-bant--koyu`), yalnız zemini
 * saf siyaha çeker. Üstünde en çok ÜÇ işaret olur: devasa satır, mono
 * şerit, veri şeridi. Dördüncüsünü koyan an "şablon dark mode" olur.
 */
export function Plaka({ children, dar, id, sinif }: PlakaProps) {
  return (
    <section
      id={id}
      className={['af-bant', 'af-bant--koyu', 'af-kr-plaka', sinif ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      {/* Işık ve zerre İÇERİĞİN ÜSTÜNDE (z-index 3/4) durur — altta
          dururlarsa knockout maskesi ışık havuzunu kendi kutusu boyunca
          keser ve kadraj "dikdörtgen olarak sızmış" görünür. */}
      <span className="af-kr-isik" aria-hidden="true" />
      <span className="af-kr-zerre" aria-hidden="true" />
      <div
        className={['af-kr-plaka-ic', dar ? 'af-kr-plaka-ic--dar' : ''].filter(Boolean).join(' ')}
      >
        {children}
      </div>
    </section>
  );
}

type HarfSatiriProps = {
  /** Tek satırlık anahtar kelime. Büyük harfe CSS çevirir. */
  kelime: string;
  /**
   * Satırın em cinsinden tahmini genişliği. Punto bundan hesaplanır:
   * `font-size = min(tavan, kolonGenisligi / en)`. Tarayıcıda ölçülerek
   * doğrulanır; büyütmeden önce 360 px'te kontrol edin.
   */
  en: number;
  /** Punto tavanı (varsayılan 6.5rem = 104 px). */
  tavan?: string;
  /**
   * `true` → harflerin içinden gece pistinin durağan karesi akar.
   * `false` (varsayılan) → harfler marka gradyanıyla dolar: 0 bayt,
   * aynı 5,52:1 kontrast.
   */
  gorsel?: boolean;
};

/**
 * HARF KADRAJI — TEK SATIR, blend knockout.
 *
 * SAYFADA EN ÇOK BİR KEZ KULLANILIR. Her başlığa konulduğu an imza
 * olmaktan çıkıp şablona dönüşür (SITE-GIRIS.md jüri şartı).
 *
 * Dekoratiftir (`aria-hidden`): ekran okuyucunun okuduğu gerçek bilgi
 * komşu `<h1>`/`<h2>`'de durur, bu katman yalnız hangi harfin açık
 * olduğunu söyler. Böylece `background-clip: text`, SVG `mask` ve
 * harfi path'e çevirme yollarının üçü de elenmiş olur; teknik iOS
 * 15.4+ dâhil her yerde çalışır ve GPU'da birleşir.
 */
export function HarfSatiri({ kelime, en, tavan, gorsel }: HarfSatiriProps) {
  const stil = {
    ['--kr-en']: String(en),
    ...(tavan ? { ['--kr-tavan']: tavan } : {}),
  } as CSSProperties;

  return (
    <span className="af-kr-knock af-kr-dev" aria-hidden="true" style={stil}>
      {/* 0. ölçü satırı — kutuyu kelimeye oturtur. Üç katman da mutlak
             konumlu olduğu için akışta yer kaplayan tek öge bu; görünmez
             ama genişliği maskedeki satırla birebir aynı. Kutu kolon
             kadar geniş kalsaydı kelimenin sağında boş ama ayrı
             kompozisyonlanmış bir alan olurdu. */}
      <span className="af-kr-knock-olcu">{kelime}</span>

      {/* 1. taban — kontrast tabanı: #E2541F / #000 = 5,52:1 */}
      <span className="af-kr-knock-taban" />

      {/* 2. düzlem — görüntü turuncu tabana EKLENİR (screen), yani
             harfin içi asla turuncudan koyu olamaz. Katmana `opacity`
             veya `filter` VERİLMEZ: Chrome blend grubunu ayrı yüzeye
             alır ve kutu soluk bir dikdörtgen olarak belirir. */}
      {gorsel ? (
        <span className="af-kr-knock-plan">
          <picture>
            <source srcSet={DOLGU_AVIF} type="image/avif" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={DOLGU_WEBP} alt="" width={1024} height={576} decoding="async" />
          </picture>
        </span>
      ) : null}

      {/* 3. maske — siyah plaka × düzlem = siyah (gizler),
             beyaz harf × düzlem = düzlem (gösterir). */}
      <span className="af-kr-knock-maske">
        <span className="af-kr-dev">{kelime}</span>
      </span>
    </span>
  );
}
